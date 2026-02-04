import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Upload, Sparkles, Image as ImageIcon, Shirt, Globe, 
  User, Shuffle, Download, X, Maximize2, History, ChevronLeft, ChevronRight, Loader2,
  ScanEye, MapPin, Zap, AlertCircle, Clock, Crop as CropIcon, ZoomIn, Move, Check, RotateCcw, RefreshCcw,
  Ratio, FlipHorizontal, FlipVertical, Grid3x3, MousePointer2, Crown, MoveUpRight, Trash2, Lightbulb, PlayCircle, Filter
} from 'lucide-react';

import { GeneratedImage, GenerationConfig, HistoryEntry } from './types';
import { PHOTOSHOOT_TYPES, BACKGROUNDS, POSES, COUNTRIES, ASPECT_RATIOS, INSPIRATION_GALLERY } from './constants';
import { getTraditionalClothing, generateClothingImage, analyzeModel, getLocationInfo, quickSuggestStyle } from './services/geminiService';
import { Button, Input, Select, Label, Card } from './components/UI';

// --- Global Type for AI Studio ---
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

// --- Utility Functions ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- IndexedDB Utilities ---
const DB_NAME = 'FashionAppDB';
const STORE_NAME = 'history';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const getHistory = async (): Promise<HistoryEntry[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result as HistoryEntry[];
        items.sort((a, b) => Number(b.id) - Number(a.id)); 
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB Error:", err);
    return [];
  }
};

const saveHistory = async (entry: HistoryEntry) => {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB Save Error:", err);
  }
};

// --- Components ---

const ImageCard: React.FC<{ 
  img: GeneratedImage; 
  idx: number; 
  setSelectedImage: (img: GeneratedImage) => void 
}> = ({ img, idx, setSelectedImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`
        group relative rounded-2xl overflow-hidden bg-stone-900/50 
        transition-all duration-500 ease-out
        ${img.status === 'success' ? 'hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer' : ''}
        ${img.status === 'error' ? 'border border-red-900/20' : 'border border-stone-800'}
      `}
      style={{ 
        animation: 'fadeIn 0.6s ease-out forwards',
        animationDelay: `${idx * 100}ms`,
        opacity: 0 
      }}
      onClick={() => img.status === 'success' && setSelectedImage(img)}
    >
      <div style={{ aspectRatio: (img.aspectRatio || '3:4').replace(':', '/') }} className="w-full relative bg-stone-900">
        
        {img.status === 'success' && (
          <>
            <img 
              src={img.url} 
              alt={img.clothingName} 
              className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} 
            />
            {!imageLoaded && (
               <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-stone-700 opacity-50" />
               </div>
            )}
            
            {imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{img.clothingOrigin}</p>
                  <h3 className="text-xl font-serif text-white leading-tight mb-4">{img.clothingName}</h3>
                  
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="primary" 
                      className="flex-1 text-xs py-2 bg-white text-black hover:bg-stone-200 border-none" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(img);
                      }}
                    >
                      <Maximize2 className="w-3 h-3 mr-1.5" /> View Detail
                    </Button>
                    <a 
                      href={img.url} 
                      download={`vogue-ai-${img.id}.jpg`} 
                      className="w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/10 transition-colors"
                      title="Download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {img.status === 'loading' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900">
             <div className="w-16 h-16 relative mb-4">
               <div className="absolute inset-0 border-t-2 border-stone-700 rounded-full"></div>
               <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
             </div>
             <p className="text-xs font-bold text-stone-300 uppercase tracking-widest animate-pulse">Designing</p>
             <p className="text-[10px] text-stone-500 mt-2 px-4 text-center truncate w-full">{img.clothingName}</p>
           </div>
        )}

        {img.status === 'pending' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-925 opacity-60">
             <div className="w-12 h-12 rounded-full bg-stone-800/50 flex items-center justify-center mb-3 animate-pulse">
               <Clock className="w-5 h-5 text-stone-600" />
             </div>
             <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">In Queue</p>
           </div>
        )}

        {img.status === 'error' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/10">
             <AlertCircle className="w-10 h-10 text-red-500/50 mb-3" />
             <p className="text-stone-400 text-sm">Generation Failed</p>
           </div>
        )}
      </div>
    </div>
  );
};

const ImageModal: React.FC<{ 
  selectedImage: GeneratedImage | null;
  onClose: () => void;
}> = ({ selectedImage, onClose }) => {
  const [zoom, setZoom] = useState(false);
  
  // Reset zoom when image changes or modal opens
  useEffect(() => {
    setZoom(false);
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 animate-fade-in" onClick={onClose}>
      <div className="absolute top-6 right-6 z-50">
         <button className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full"><X className="w-6 h-6" /></button>
      </div>
      <div className="w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-stone-900 flex items-center justify-center overflow-auto rounded-2xl relative cursor-zoom-in" onClick={() => setZoom(!zoom)}>
          <img src={selectedImage.url} className={`transition-all duration-500 ${zoom ? 'w-[150%] max-w-none cursor-zoom-out' : 'w-auto h-full max-h-[90vh] object-contain'}`} alt="" />
        </div>
        <div className="w-full md:w-80 flex flex-col justify-center">
          <h2 className="text-3xl font-serif text-white mb-2">{selectedImage.clothingName}</h2>
          <p className="text-stone-500 uppercase tracking-widest text-xs mb-6">{selectedImage.clothingOrigin}</p>
          <div className="p-4 bg-stone-900 rounded-lg border border-stone-800 mb-6">
             <Label>Visual Data</Label>
             <p className="text-xs italic opacity-80 leading-relaxed">"{selectedImage.prompt}"</p>
          </div>
          <Button onClick={() => {
            const link = document.createElement('a');
            link.href = selectedImage.url;
            link.download = `vogue-${selectedImage.id}.jpg`;
            link.click();
          }}>Download High-Res</Button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- State ---
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [groundingLinks, setGroundingLinks] = useState<string[]>([]);
  const [locationInfo, setLocationInfo] = useState<string>('');
  
  // Crop State
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [cropRotation, setCropRotation] = useState(0);
  const [cropFlip, setCropFlip] = useState({ x: 1, y: 1 });
  const [cropAspectRatio, setCropAspectRatio] = useState('3:4');
  const [showGrid, setShowGrid] = useState(true);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const cropImgRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref for Main Content Scrolling
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Inputs
  const [config, setConfig] = useState<GenerationConfig>({
    country: 'Japan',
    city: 'Tokyo',
    gender: 'female',
    photoshootType: '', // Initialized to empty to require selection
    background: '',     // Initialized to empty to require selection
    pose: '',           // Initialized to empty to require selection
    aspectRatio: '3:4',
    useDeepResearch: false,
    highQuality: false
  });
  const [customDescription, setCustomDescription] = useState('');
  const [specificClothing, setSpecificClothing] = useState('');
  
  // UI Toggles
  const [activeTab, setActiveTab] = useState<'studio' | 'archives' | 'inspiration'>('studio');
  const [inspirationCategory, setInspirationCategory] = useState<string>('All');
  const [applyingInspirationId, setApplyingInspirationId] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState(INSPIRATION_GALLERY);
  const [isShuffling, setIsShuffling] = useState(false);

  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  useEffect(() => {
    if (generatedImages.length > 0 && isGenerating && activeTab === 'studio') {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedImages, isGenerating, activeTab]);

  // Derived State for Inspiration Categories
  const inspirationCategories = useMemo(() => {
    const cats = new Set(INSPIRATION_GALLERY.map(item => item.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredInspiration = useMemo(() => {
    let items = galleryItems;
    if (inspirationCategory !== 'All') {
      items = items.filter(item => item.category === inspirationCategory);
    }
    return items;
  }, [inspirationCategory, galleryItems]);

  const handleShuffleGallery = () => {
    setIsShuffling(true);
    // Add a small delay for visual feedback
    setTimeout(() => {
      setGalleryItems(prev => [...prev].sort(() => Math.random() - 0.5));
      setIsShuffling(false);
    }, 300);
  };

  // Handle Dragging via Window events to prevent stuck state when mouse leaves div
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setCropPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragStart]);


  const saveToHistory = async (newImages: GeneratedImage[]) => {
    const validImages = newImages.filter(img => img.status === 'success');
    if (validImages.length === 0) return;

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      images: validImages
    };
    setHistory(prev => [entry, ...prev]);
    await saveHistory(entry);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await readImageFile(e.target.files[0]);
        setSourceImage(base64);
        e.target.value = '';
      } catch (err) {
        console.error("Image processing failed", err);
        alert("Could not process image. Please try another.");
      }
    }
  };

  const handleOpenCrop = () => {
    if (!sourceImage) return;
    setTempImage(sourceImage);
    setIsCropOpen(true);
    setCropScale(1);
    setCropPos({ x: 0, y: 0 });
    setCropRotation(0);
    setCropFlip({ x: 1, y: 1 });
    setCropAspectRatio(config.aspectRatio); 
  };

  const confirmCrop = () => {
    if (!cropImgRef.current || !tempImage) return;

    const img = cropImgRef.current;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;

    const rad = (cropRotation * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    
    const rotW = natW * absCos + natH * absSin;
    const rotH = natW * absSin + natH * absCos;

    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = rotW;
    rotCanvas.height = rotH;
    const rotCtx = rotCanvas.getContext('2d');
    
    if (rotCtx) {
        rotCtx.translate(rotW / 2, rotH / 2);
        rotCtx.rotate(rad);
        rotCtx.scale(cropFlip.x, cropFlip.y);
        rotCtx.drawImage(img, -natW / 2, -natH / 2);
    }

    const [ratioW, ratioH] = cropAspectRatio.split(':').map(Number);
    const aspect = ratioW / ratioH;
    
    const LONG_EDGE = 1024; 
    let OUTPUT_WIDTH, OUTPUT_HEIGHT;

    if (aspect >= 1) {
        OUTPUT_WIDTH = LONG_EDGE;
        OUTPUT_HEIGHT = Math.round(LONG_EDGE / aspect);
    } else {
        OUTPUT_HEIGHT = LONG_EDGE;
        OUTPUT_WIDTH = Math.round(LONG_EDGE * aspect);
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = img.getBoundingClientRect();
    const containerRect = cropContainerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
        const relativeX = rect.left - containerRect.left;
        const relativeY = rect.top - containerRect.top;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const domToCanvasScaleX = OUTPUT_WIDTH / containerRect.width;
        const domToCanvasScaleY = OUTPUT_HEIGHT / containerRect.height;

        ctx.drawImage(
            rotCanvas, 
            relativeX * domToCanvasScaleX, 
            relativeY * domToCanvasScaleY, 
            rect.width * domToCanvasScaleX, 
            rect.height * domToCanvasScaleY
        );
    }
    
    setSourceImage(canvas.toDataURL('image/jpeg', 0.95));
    setCustomDescription(''); 
    setConfig(prev => ({ ...prev, aspectRatio: cropAspectRatio }));
    setIsCropOpen(false);
    setTempImage(null);
  };

  const handleSurpriseMe = () => {
    const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    setConfig(prev => ({
      ...prev,
      country: randomItem(COUNTRIES),
      city: '',
      photoshootType: randomItem(PHOTOSHOOT_TYPES),
      background: randomItem(BACKGROUNDS),
      pose: randomItem(POSES),
      aspectRatio: randomItem(ASPECT_RATIOS),
      useDeepResearch: false,
      highQuality: false
    }));
    setSpecificClothing('');
    setCustomDescription('');
  };

  const handleUseInspiration = async (insp: typeof INSPIRATION_GALLERY[0]) => {
    setApplyingInspirationId(insp.id);
    
    // Aesthetic delay for better user feedback
    await delay(600);
    
    const { specificClothing: cloth, ...conf } = insp.config;
    setConfig(prev => ({ 
      ...prev, 
      ...conf,
      useDeepResearch: false,
      highQuality: false
    }));
    setSpecificClothing(cloth);
    setCustomDescription(''); 
    setActiveTab('studio');
    // Scroll content to top
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setApplyingInspirationId(null);
  };

  const handleQuickSuggest = async () => {
    setCurrentStatus("Thinking fast...");
    const suggestion = await quickSuggestStyle(config.gender);
    setSpecificClothing(suggestion);
    setCurrentStatus("");
  };

  const handleAnalyzeImage = async () => {
    if (!sourceImage) return;
    setCurrentStatus("Analyzing model...");
    const analysis = await analyzeModel(sourceImage);
    setCustomDescription(analysis);
    setCurrentStatus("");
  };

  const handleGetLocation = async () => {
    if (!config.city) return;
    setCurrentStatus(`Checking map data for ${config.city}...`);
    const info = await getLocationInfo(config.city, config.country);
    setLocationInfo(info);
    setCurrentStatus("");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStatus('Initializing session...');
    setActiveTab('studio');
    // Scroll content to top
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      if (config.highQuality) {
        if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
           const hasKey = await window.aistudio.hasSelectedApiKey();
           if (!hasKey) {
             setCurrentStatus('Waiting for API Key...');
             await window.aistudio.openSelectKey();
           }
        }
      }

      let clothingItems = [];
      if (customDescription) {
        clothingItems = [{ name: "Custom Edit", origin: "User Defined", description: customDescription }];
      } else {
        const statusMsg = config.useDeepResearch 
          ? `Deep research on ${config.country} fashion (Thinking)...` 
          : `Searching trends in ${config.country}...`;
        setCurrentStatus(statusMsg);
        
        clothingItems = await getTraditionalClothing(
          config.country, 
          config.city, 
          config.gender, 
          specificClothing,
          config.useDeepResearch
        );
      }

      const links = clothingItems.flatMap(i => i.groundingLinks || []);
      setGroundingLinks(links);

      const generationConfig = {
        ...config
      };

      const initialPlaceholders: GeneratedImage[] = clothingItems.map(item => ({
        id: Date.now().toString() + Math.random(),
        url: '',
        prompt: item.description || customDescription,
        clothingName: item.name,
        clothingOrigin: item.origin,
        timestamp: Date.now(),
        aspectRatio: config.aspectRatio,
        status: 'pending'
      }));

      setGeneratedImages(initialPlaceholders);
      const processedImages = [...initialPlaceholders];

      for (let i = 0; i < clothingItems.length; i++) {
        const item = clothingItems[i];
        setCurrentStatus(`Generating ${item.name}...`);
        processedImages[i] = { ...processedImages[i], status: 'loading' };
        setGeneratedImages([...processedImages]);
        if (i > 0) await delay(4500);

        try {
          const imgData = await generateClothingImage(
            sourceImage,
            item,
            generationConfig,
            customDescription
          );

          if (imgData) {
            processedImages[i] = { ...processedImages[i], url: imgData, status: 'success' };
          } else {
             processedImages[i] = { ...processedImages[i], status: 'error' };
          }
        } catch (e) {
          console.error("Image generation failed", e);
          processedImages[i] = { ...processedImages[i], status: 'error', clothingOrigin: "Error" };
        }
        setGeneratedImages([...processedImages]);
      }

      if (processedImages.some(img => img.status === 'success')) {
        saveToHistory(processedImages);
      }

    } catch (error) {
      console.error(error);
      alert("Generation process failed.");
    } finally {
      setIsGenerating(false);
      setCurrentStatus('');
    }
  };

  // Crop Modal Logic within component for inline rendering
  const handleCropMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
  };
  
  // Note: handleCropMouseMove and handleCropMouseUp are now handled by window effect

  const isResearching = isGenerating && !generatedImages.some(img => img.status === 'loading' || img.status === 'pending');

  return (
    <div className="flex h-screen w-screen bg-stone-950 text-stone-200 overflow-hidden font-sans">
      {/* Sidebar Inlined to fix focus loss bug */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-stone-900 border-r border-stone-800 h-full overflow-y-auto no-scrollbar p-6 flex flex-col gap-6">
        
        <div 
          className="flex items-center gap-3 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
              setActiveTab('studio');
              mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Back to Studio"
        >
          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-stone-900" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-stone-100 tracking-tight">VOGUE.AI</h1>
        </div>

        <div className="w-full">
          <section>
            <Label>Identity Model</Label>
            {!sourceImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-dashed border-2 border-stone-700 hover:border-stone-500 hover:bg-stone-800/50 h-32 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300"
                >
                  <div className="text-center p-4">
                    <User className="w-5 h-5 text-stone-500 mx-auto mb-2" />
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Identity</p>
                  </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-900 shadow-lg group">
                    <div className="aspect-[3/4] w-full relative">
                        <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={handleOpenCrop} className="p-2 bg-stone-100 text-stone-900 rounded-full"><CropIcon className="w-4 h-4" /></button>
                          <button onClick={() => setSourceImage(null)} className="p-2 bg-red-600 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </section>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Country</Label>
              <Input 
                value={config.country} 
                onChange={e => setConfig({...config, country: e.target.value})}
                list="country-options"
              />
              <datalist id="country-options">
                 {COUNTRIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <Label>Gender</Label>
              <Select 
                value={config.gender} 
                onChange={e => setConfig({...config, gender: e.target.value as GenerationConfig['gender']})}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-Binary</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
              <input 
                type="checkbox" id="deepResearch" 
                checked={config.useDeepResearch}
                onChange={e => setConfig({...config, useDeepResearch: e.target.checked})}
                className="rounded border-stone-700 bg-stone-900 w-4 h-4 accent-stone-500"
              />
              <label htmlFor="deepResearch" className="text-xs text-stone-400 cursor-pointer">Deep Research (Thinking)</label>
             </div>
             
             <div className="flex items-center gap-2">
              <input 
                type="checkbox" id="highQuality" 
                checked={config.highQuality}
                onChange={e => setConfig({...config, highQuality: e.target.checked})}
                className="rounded border-stone-700 bg-stone-900 w-4 h-4 accent-amber-500"
              />
              <label htmlFor="highQuality" className="text-xs text-amber-500 font-medium flex items-center gap-1 cursor-pointer">
                High Quality (Pro) <Crown className="w-3 h-3" />
              </label>
             </div>
          </div>

          <div>
             <Label>Custom Instruction (Style/Edits)</Label>
             <textarea 
               className="w-full bg-stone-900/50 border border-stone-800 text-stone-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 placeholder-stone-600 text-sm h-16 resize-none"
               placeholder="e.g. 'Golden hour lighting', 'Neon aesthetics'"
               value={customDescription}
               onChange={e => setCustomDescription(e.target.value)}
             />
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-4">
             <div className="grid grid-cols-2 gap-3">
               <div>
                 <Label>Aspect Ratio</Label>
                 <Select value={config.aspectRatio} onChange={e => setConfig({...config, aspectRatio: e.target.value})}>
                   {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                 </Select>
               </div>
               <div>
                  <Label>Photoshoot</Label>
                  <Select 
                    value={config.photoshootType} 
                    onChange={e => setConfig({...config, photoshootType: e.target.value})}
                  >
                    <option value="" disabled>Select Style...</option>
                    {PHOTOSHOOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div>
                   <Label>Artistic Pose</Label>
                   <Select 
                    value={config.pose} 
                    onChange={e => setConfig({...config, pose: e.target.value})}
                   >
                     <option value="" disabled>Select Pose...</option>
                     {POSES.map(p => <option key={p} value={p}>{p}</option>)}
                   </Select>
                </div>
                <div>
                  <Label>Background</Label>
                  <Select 
                    value={config.background} 
                    onChange={e => setConfig({...config, background: e.target.value})}
                  >
                    <option value="" disabled>Select Background...</option>
                    {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </Select>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-4 mt-auto space-y-3 pb-6">
          <div className="grid grid-cols-2 gap-3">
             <Button onClick={() => handleGenerate()} isLoading={isGenerating} className="col-span-1">
              {isGenerating ? 'Working...' : 'Generate'}
            </Button>
            <Button variant="outline" onClick={handleSurpriseMe} disabled={isGenerating} className="col-span-1">
              <Shuffle className="w-4 h-4" /> Random
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-full flex flex-col">
        {/* MainContent Inlined */}
        <div ref={mainContentRef} className="flex-1 h-full overflow-y-auto bg-stone-950 relative custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20 p-6 md:p-10">
            
            <div className="sticky top-0 z-20 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800 pb-4 pt-2 mb-8 -mx-6 px-6 md:-mx-10 md:px-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-serif text-stone-100 tracking-tight mb-2">Studio</h2>
                    <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest">
                        <span className="text-stone-300">{config.country}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-700" />
                        <span>{config.photoshootType || 'Custom'}</span>
                        {config.highQuality && <span className="text-amber-500 flex items-center gap-1 ml-2"><Crown className="w-3 h-3" /> Pro</span>}
                    </div>
                  </div>

                  <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
                      <button 
                          onClick={() => {
                            setActiveTab('studio');
                            mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'studio' ? 'bg-stone-800 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                      >Studio</button>
                      <button 
                          onClick={() => {
                            setActiveTab('inspiration');
                            mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'inspiration' ? 'bg-stone-800 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                      >Inspiration</button>
                      <button 
                          onClick={() => {
                             setActiveTab('archives');
                             mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'archives' ? 'bg-stone-800 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                      >Archives</button>
                  </div>
              </div>
            </div>

            {activeTab === 'studio' && (
               <div className="animate-fade-in">
                  {groundingLinks.length > 0 && (
                      <div className="mb-8 p-4 bg-stone-900/30 rounded-xl border border-stone-800/50 flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] text-stone-500 font-bold uppercase mr-2">Inspiration:</span>
                          {groundingLinks.map((link, i) => (
                          <a key={i} href={link} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-stone-800 text-[10px] text-stone-400 border border-stone-700 hover:text-white transition-colors">
                              {new URL(link).hostname.replace('www.', '')}
                          </a>
                          ))}
                      </div>
                  )}

                  {generatedImages.length === 0 && !isGenerating ? (
                      <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-600 border border-dashed border-stone-800/50 rounded-3xl">
                        <Sparkles className="w-12 h-12 mb-4 text-stone-800" />
                        <p className="font-serif italic mb-6">The camera is ready when you are.</p>
                        <button 
                          onClick={() => {
                            setActiveTab('inspiration');
                            mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-stone-400 text-xs flex items-center gap-2 hover:text-stone-100 transition-colors"
                        >
                          <Lightbulb className="w-4 h-4" /> Need inspiration? Browse the gallery
                        </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {generatedImages.map((img, idx) => (
                          <ImageCard key={img.id} img={img} idx={idx} setSelectedImage={setSelectedImage} />
                      ))}
                      {isResearching && (
                          <div style={{ aspectRatio: config.aspectRatio.replace(':', '/') }} className="rounded-2xl bg-stone-900 border border-dashed border-stone-800 flex flex-col items-center justify-center animate-pulse">
                            <p className="text-stone-500 text-[10px] uppercase tracking-widest">{currentStatus}</p>
                          </div>
                      )}
                      <div ref={scrollEndRef} />
                      </div>
                  )}
               </div>
            )}

            {activeTab === 'inspiration' && (
               <div className="animate-fade-in">
                  <div className="mb-8 max-w-4xl">
                      <h3 className="text-2xl font-serif text-white mb-4">Curated Style Gallery</h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-6">
                          Explore high-fashion and traditional looks generated by our AI. 
                          Select a category to filter or click 'Try this look' to automatically configure the Studio.
                      </p>
                      
                      {/* Category Filter and Shuffle */}
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade flex-1 mr-4">
                            <Filter className="w-4 h-4 text-stone-500 shrink-0 mr-2" />
                            {inspirationCategories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setInspirationCategory(cat)}
                                className={`
                                  px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                                  ${inspirationCategory === cat 
                                    ? 'bg-stone-100 text-stone-900 ring-2 ring-stone-500/50' 
                                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-600 hover:text-stone-200'}
                                `}
                              >
                                {cat}
                              </button>
                            ))}
                         </div>
                         <button 
                           onClick={handleShuffleGallery}
                           className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700 hover:text-white transition-all text-xs font-medium shrink-0"
                           disabled={isShuffling}
                         >
                            <RefreshCcw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} /> 
                            {isShuffling ? 'Shuffling...' : 'Shuffle'}
                         </button>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredInspiration.map((insp) => (
                          <div key={insp.id} className="group flex flex-col bg-stone-900 border border-stone-800 hover:border-stone-600 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl">
                              <div className="aspect-[3/4] overflow-hidden relative bg-stone-800">
                                  <img 
                                      src={insp.image} 
                                      alt={insp.title} 
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                      onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                      }}
                                  />
                                  {/* Fallback element */}
                                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-stone-600">
                                     <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                     <span className="text-[10px] uppercase tracking-widest">Image unavailable</span>
                                  </div>

                                  <div className="absolute top-4 left-4">
                                      <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                          {insp.category}
                                      </span>
                                  </div>
                              </div>
                              <div className="p-6 relative">
                                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-50"></div>
                                  <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> {insp.origin}
                                  </p>
                                  <h4 className="text-xl font-serif text-white mb-5">{insp.title}</h4>
                                  <Button 
                                      variant="secondary" 
                                      className={`w-full py-3 text-xs transition-all duration-300 ${applyingInspirationId === insp.id ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-stone-800 hover:bg-stone-100 hover:text-stone-950'}`}
                                      onClick={() => handleUseInspiration(insp)}
                                      disabled={applyingInspirationId !== null}
                                  >
                                      {applyingInspirationId === insp.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" /> Applied
                                        </>
                                      ) : (
                                        <>
                                          <PlayCircle className="w-3.5 h-3.5" /> Try this look
                                        </>
                                      )}
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
                  {filteredInspiration.length === 0 && (
                    <div className="py-20 text-center text-stone-500 flex flex-col items-center">
                      <ScanEye className="w-12 h-12 mb-4 opacity-20" />
                      <p>No styles found in this category.</p>
                      <button onClick={() => setInspirationCategory('All')} className="text-stone-300 text-sm mt-2 hover:underline">View all styles</button>
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'archives' && (
               <div className="animate-fade-in space-y-12">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[30vh] text-stone-600">
                      <History className="w-12 h-12 mb-4 opacity-20" />
                      <p>No archived shoots yet.</p>
                    </div>
                  ) : (
                    history.map((entry) => (
                      <div key={entry.id}>
                        <div className="flex items-baseline gap-4 mb-6">
                          <span className="text-stone-500 text-sm font-mono">{entry.date}</span>
                          <div className="h-px bg-stone-800 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {entry.images.map((img) => (
                            <div key={img.id} onClick={() => setSelectedImage(img)} style={{ aspectRatio: (img.aspectRatio || '4:5').replace(':', '/') }} className="rounded-lg overflow-hidden bg-stone-900 cursor-pointer group">
                              <img src={img.url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            )}
          </div>
        </div>

        <ImageModal selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
        
        {/* CropModal Inlined */}
        {isCropOpen && tempImage && (
          <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                <h3 className="text-stone-100 font-serif text-lg">Crop Identity</h3>
                <button onClick={() => { setIsCropOpen(false); setTempImage(null); }} className="text-stone-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 bg-stone-950 overflow-hidden relative flex items-center justify-center cursor-move select-none"
                   onMouseDown={handleCropMouseDown}>
                 <div ref={cropContainerRef} className="relative overflow-visible border border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.85)]"
                    style={{ aspectRatio: cropAspectRatio.replace(':', '/'), height: '400px', maxWidth: '85vw' }}>
                    <div className="w-full h-full relative overflow-hidden">
                        <img ref={cropImgRef} src={tempImage} alt="" className="max-w-none origin-center"
                            style={{ transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropScale}) rotate(${cropRotation}deg) scaleX(${cropFlip.x}) scaleY(${cropFlip.y})`, minWidth: '100%', minHeight: '100%' }} draggable={false} />
                    </div>
                    {showGrid && <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30"><div className="border-r border-b border-white"></div><div className="border-r border-b border-white"></div><div className="border-b border-white"></div><div className="border-r border-b border-white"></div><div className="border-r border-b border-white"></div><div className="border-b border-white"></div><div className="border-r border-white"></div><div className="border-r border-white"></div><div></div></div>}
                 </div>
              </div>
              <div className="p-5 bg-stone-900 border-t border-stone-800 space-y-5">
                 <div className="flex justify-center gap-2 flex-wrap">
                     {ASPECT_RATIOS.map(ratio => (
                         <button key={ratio} onClick={() => setCropAspectRatio(ratio)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${cropAspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-stone-800 text-stone-400 border-stone-700'}`}>{ratio}</button>
                     ))}
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-stone-800/50 p-2.5 rounded-xl">
                        <ZoomIn className="w-4 h-4 text-stone-400" />
                        <input type="range" min="0.5" max="3" step="0.05" value={cropScale} onChange={(e) => setCropScale(parseFloat(e.target.value))} className="flex-1 h-1 bg-stone-600 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button 
                            onClick={() => setCropRotation(r => (r - 90))} 
                            className="p-3 bg-stone-800 text-stone-300 rounded-full hover:bg-stone-700 transition-colors"
                            title="Rotate Left"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setCropFlip(prev => ({ ...prev, y: prev.y * -1 }))} 
                            className="p-3 bg-stone-800 text-stone-300 rounded-full hover:bg-stone-700 transition-colors"
                            title="Flip Vertical"
                        >
                            <FlipVertical className="w-5 h-5" />
                        </button>
                         <button 
                            onClick={() => setCropFlip(prev => ({ ...prev, x: prev.x * -1 }))} 
                            className="p-3 bg-stone-800 text-stone-300 rounded-full hover:bg-stone-700 transition-colors"
                            title="Flip Horizontal"
                        >
                            <FlipHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                 </div>

                 <Button onClick={confirmCrop} className="w-full py-3"><Check className="w-4 h-4" /> Apply Crop</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;