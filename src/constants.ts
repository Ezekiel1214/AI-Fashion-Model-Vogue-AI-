
export const PHOTOSHOOT_TYPES = [
  "Editorial / High Fashion",
  "Street Style",
  "Catalog / Clean",
  "Cinematic Portrait",
  "Vintage / Retro film",
  "Candid Lifestyle",
  "Golden Hour",
  "Studio Noir",
  "Cyberpunk / Futurist",
  "Ethereal / Dreamy",
  "Vogue Cover (Close-up)",
  "Minimalist Monochrome",
  "Polaroid Aesthetic",
  "Underwater / Submerged",
  "Double Exposure",
  "Grunge / 90s Rock",
  "Surrealist Art",
  "Neon Noir"
];

export const BACKGROUNDS = [
  "Simple Studio Grey",
  "Luxury Hotel Lobby",
  "Urban City Street (Bokeh)",
  "Nature / Forest",
  "Historical Landmark",
  "Abstract Neon",
  "Desert Dunes",
  "Minimalist Concrete",
  "Infinite White Cyclorama",
  "Parisian Rooftop",
  "Cyberpunk Alleyway",
  "Botanical Garden Greenhouse",
  "Art Gallery / Museum",
  "Private Jet Interior",
  "Retro Diner",
  "Beach Sunset",
  "Snowy Tundra",
  "Industrial Warehouse",
  "Library / Academia",
  "Rooftop Infinity Pool"
];

export const POSES = [
  // Standard
  "Standard: Standing Confidence",
  "Standard: Walking Towards Camera",
  "Standard: Sitting Elegantly",
  "Standard: Side Profile",
  "Standard: Relaxed Leaning",
  "Standard: Hands in Pockets",
  "Standard: Arms Crossed (Power Pose)",
  
  // Editorial
  "Editorial: Contrapposto (Weight Shift)",
  "Editorial: S-Curve (Dynamic)",
  "Editorial: High-Fashion Squat",
  "Editorial: Hand on Hip / Waist",
  "Editorial: Looking Over Shoulder",
  "Editorial: The 'Vogue' Face Frame",
  "Editorial: Leaning Back (Low Angle)",
  "Editorial: Walking Away (Looking Back)",
  "Editorial: Hair Flip / Motion",
  
  // Artistic / Action
  "Artistic: Ethereal Float",
  "Artistic: Geometric Angles",
  "Artistic: Mid-Action Spin",
  "Artistic: Dramatic Drape",
  "Artistic: Tucked Knee / Balanced",
  "Artistic: Shadow Play Silhouette",
  "Artistic: Crouched / Floorwork",
  "Artistic: Levitation Illusion",
  "Artistic: Reflection / Mirror Interaction",
  "Artistic: Lying Down (Overhead Shot)"
];

export const COUNTRIES = [
  "Japan", "France", "Italy", "Nigeria", "India", "South Korea", 
  "Mexico", "United Kingdom", "USA", "Brazil", "China", "Spain",
  "Germany", "Morocco", "Iceland", "Turkey", "South Africa", "Argentina", "Australia"
];

export const ASPECT_RATIOS = [
  "1:1", "3:4", "4:3", "9:16", "16:9"
];

export const INSPIRATION_GALLERY = [
  {
    id: "insp-1",
    title: "Kyoto Silk Kimono",
    origin: "Kyoto, Japan",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1582236592285-d72b27150567?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Japan",
      city: "Kyoto",
      gender: "female",
      photoshootType: "Editorial / High Fashion",
      background: "Historical Landmark",
      pose: "Standard: Standing Confidence",
      aspectRatio: "3:4",
      specificClothing: "Traditional Furisode Kimono with floral cherry blossom patterns"
    }
  },
  {
    id: "insp-2",
    title: "Parisian Chic Noir",
    origin: "Paris, France",
    category: "High Fashion",
    image: "https://images.unsplash.com/photo-1502989642968-94f429ca6554?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "France",
      city: "Paris",
      gender: "female",
      photoshootType: "Studio Noir",
      background: "Luxury Hotel Lobby",
      pose: "Editorial: Looking Over Shoulder",
      aspectRatio: "3:4",
      specificClothing: "Haute Couture Black Velvet Gown with avant-garde silhouette"
    }
  },
  {
    id: "insp-3",
    title: "Lagos Vibrant Ankara",
    origin: "Lagos, Nigeria",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Nigeria",
      city: "Lagos",
      gender: "female",
      photoshootType: "Street Style",
      background: "Urban City Street (Bokeh)",
      pose: "Editorial: Contrapposto (Weight Shift)",
      aspectRatio: "3:4",
      specificClothing: "Modern Ankara Print Maxi Dress with bold geometric patterns"
    }
  },
  {
    id: "insp-4",
    title: "Neo-Seoul Cyberpunk",
    origin: "Seoul, South Korea",
    category: "Street Style",
    image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "South Korea",
      city: "Seoul",
      gender: "female",
      photoshootType: "Cyberpunk / Futurist",
      background: "Abstract Neon",
      pose: "Artistic: Geometric Angles",
      aspectRatio: "9:16",
      specificClothing: "Techwear iridescent jacket with holographic accessories"
    }
  },
  {
    id: "insp-5",
    title: "Venetian Masquerade",
    origin: "Venice, Italy",
    category: "Artistic",
    image: "https://images.unsplash.com/photo-1516568285513-393226a1b24e?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Italy",
      city: "Venice",
      gender: "female",
      photoshootType: "Cinematic Portrait",
      background: "Historical Landmark",
      pose: "Artistic: Dramatic Drape",
      aspectRatio: "3:4",
      specificClothing: "Baroque ballgown with elaborate lace and gold Venetian mask"
    }
  },
  {
    id: "insp-6",
    title: "Mumbai Royal Silk",
    origin: "Mumbai, India",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1583391733958-e02eb86c9d77?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "India",
      city: "Mumbai",
      gender: "female",
      photoshootType: "Golden Hour",
      background: "Historical Landmark",
      pose: "Standard: Sitting Elegantly",
      aspectRatio: "3:4",
      specificClothing: "Banarasi Silk Saree in deep crimson with zari embroidery"
    }
  },
  {
    id: "insp-7",
    title: "NYC Concrete Jungle",
    origin: "New York, USA",
    category: "Street Style",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "USA",
      city: "New York",
      gender: "female",
      photoshootType: "Street Style",
      background: "Urban City Street (Bokeh)",
      pose: "Standard: Walking Towards Camera",
      aspectRatio: "3:4",
      specificClothing: "Oversized beige trench coat layered over high-end streetwear"
    }
  },
  {
    id: "insp-8",
    title: "London Punk Revival",
    origin: "London, UK",
    category: "High Fashion",
    image: "https://images.unsplash.com/photo-1500336624523-d727130c3328?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "United Kingdom",
      city: "London",
      gender: "female",
      photoshootType: "Grunge / 90s Rock",
      background: "Industrial Warehouse",
      pose: "Editorial: Hand on Hip / Waist",
      aspectRatio: "3:4",
      specificClothing: "Tartan plaid corset with leather biker jacket and silver hardware"
    }
  },
  {
    id: "insp-9",
    title: "Tulum Boho Spirit",
    origin: "Tulum, Mexico",
    category: "Candid Lifestyle",
    image: "https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Mexico",
      city: "Tulum",
      gender: "female",
      photoshootType: "Candid Lifestyle",
      background: "Beach Sunset",
      pose: "Standard: Relaxed Leaning",
      aspectRatio: "3:4",
      specificClothing: "Embroidered Huipil dress with flowing linen fabrics"
    }
  },
  {
    id: "insp-10",
    title: "Shanghai Modern Qipao",
    origin: "Shanghai, China",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1546872545-d4193ea721c5?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "China",
      city: "Shanghai",
      gender: "female",
      photoshootType: "Cinematic Portrait",
      background: "Luxury Hotel Lobby",
      pose: "Standard: Side Profile",
      aspectRatio: "3:4",
      specificClothing: "Modern high-slit Qipao in emerald silk with gold dragon embroidery"
    }
  },
  {
    id: "insp-11",
    title: "Milan Sartorial",
    origin: "Milan, Italy",
    category: "High Fashion",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Italy",
      city: "Milan",
      gender: "male",
      photoshootType: "Catalog / Clean",
      background: "Minimalist Concrete",
      pose: "Standard: Hands in Pockets",
      aspectRatio: "3:4",
      specificClothing: "Italian tailored beige linen suit with loafers"
    }
  },
  {
    id: "insp-12",
    title: "Rio Carnival Queen",
    origin: "Rio, Brazil",
    category: "Artistic",
    image: "https://images.unsplash.com/photo-1563567705703-6e3e110c7959?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Brazil",
      city: "Rio de Janeiro",
      gender: "female",
      photoshootType: "Surrealist Art",
      background: "Abstract Neon",
      pose: "Artistic: Mid-Action Spin",
      aspectRatio: "3:4",
      specificClothing: "Elaborate Carnival Samba costume with massive feather headdress and sequins"
    }
  },
  {
    id: "insp-13",
    title: "Berlin Underground",
    origin: "Berlin, Germany",
    category: "Street Style",
    image: "https://images.unsplash.com/photo-1518049362260-00ac83636f8d?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Germany",
      city: "Berlin",
      gender: "non-binary",
      photoshootType: "Studio Noir",
      background: "Industrial Warehouse",
      pose: "Artistic: Shadow Play Silhouette",
      aspectRatio: "16:9",
      specificClothing: "All-black techno aesthetic, leather harness, mesh top, and combat boots"
    }
  },
  {
    id: "insp-14",
    title: "Santorini Breeze",
    origin: "Santorini, Greece",
    category: "Candid Lifestyle",
    image: "https://images.unsplash.com/photo-1520182205149-1e5e4e7329b4?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Greece",
      city: "Santorini",
      gender: "female",
      photoshootType: "Golden Hour",
      background: "Rooftop Infinity Pool",
      pose: "Standard: Relaxed Leaning",
      aspectRatio: "3:4",
      specificClothing: "Flowing white Grecian maxi dress with gold arm cuffs"
    }
  },
  {
    id: "insp-15",
    title: "Marrakech Desert",
    origin: "Marrakech, Morocco",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Morocco",
      city: "Marrakech",
      gender: "female",
      photoshootType: "Editorial / High Fashion",
      background: "Desert Dunes",
      pose: "Editorial: Walking Away (Looking Back)",
      aspectRatio: "3:4",
      specificClothing: "Rich indigo Kaftan with intricate Berber jewelry"
    }
  },
  {
    id: "insp-16",
    title: "Icelandic Avant-Garde",
    origin: "Reykjavik, Iceland",
    category: "Artistic",
    image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Iceland",
      city: "Reykjavik",
      gender: "female",
      photoshootType: "Ethereal / Dreamy",
      background: "Snowy Tundra",
      pose: "Artistic: Levitation Illusion",
      aspectRatio: "3:4",
      specificClothing: "Volcanic ash-colored wool coat with structural, sculptural shoulders"
    }
  },
  {
    id: "insp-17",
    title: "Cappadocia Dawn",
    origin: "Cappadocia, Turkey",
    category: "Candid Lifestyle",
    image: "https://images.unsplash.com/photo-1567634689033-286847d06e23?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Turkey",
      city: "Cappadocia",
      gender: "female",
      photoshootType: "Double Exposure",
      background: "Nature / Forest",
      pose: "Artistic: Ethereal Float",
      aspectRatio: "3:4",
      specificClothing: "Bohemian layered rug-patterned vest and skirt"
    }
  },
  {
    id: "insp-18",
    title: "Madrid Flamenco",
    origin: "Madrid, Spain",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1552697816-52c6f376997d?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Spain",
      city: "Madrid",
      gender: "female",
      photoshootType: "Cinematic Portrait",
      background: "Historical Landmark",
      pose: "Artistic: Mid-Action Spin",
      aspectRatio: "3:4",
      specificClothing: "Red Flamenco dress with polka dots and ruffles"
    }
  },
  {
    id: "insp-19",
    title: "Cape Town Afrofuturism",
    origin: "Cape Town, South Africa",
    category: "Street Style",
    image: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "South Africa",
      city: "Cape Town",
      gender: "female",
      photoshootType: "Cyberpunk / Futurist",
      background: "Urban City Street (Bokeh)",
      pose: "Standard: Arms Crossed (Power Pose)",
      aspectRatio: "3:4",
      specificClothing: "Vibrant patterned jumpsuit with metallic accessories and bold makeup"
    }
  },
  {
    id: "insp-20",
    title: "Buenos Aires Tango",
    origin: "Buenos Aires, Argentina",
    category: "High Fashion",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Argentina",
      city: "Buenos Aires",
      gender: "female",
      photoshootType: "Cinematic Portrait",
      background: "Retro Diner",
      pose: "Editorial: S-Curve (Dynamic)",
      aspectRatio: "3:4",
      specificClothing: "Sleek black slit dress suitable for Tango, with red heels"
    }
  },
  {
    id: "insp-21",
    title: "Harajuku Pop",
    origin: "Tokyo, Japan",
    category: "Street Style",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Japan",
      city: "Tokyo",
      gender: "female",
      photoshootType: "Street Style",
      background: "Abstract Neon",
      pose: "Artistic: Geometric Angles",
      aspectRatio: "3:4",
      specificClothing: "Decora style multi-layered pastel outfit with many hair clips"
    }
  },
  {
    id: "insp-22",
    title: "Sydney Coastal",
    origin: "Sydney, Australia",
    category: "Candid Lifestyle",
    image: "https://images.unsplash.com/photo-1526413232648-2826cae68125?q=80&w=1024&auto=format&fit=crop",
    config: {
      country: "Australia",
      city: "Sydney",
      gender: "female",
      photoshootType: "Golden Hour",
      background: "Beach Sunset",
      pose: "Standard: Walking Towards Camera",
      aspectRatio: "3:4",
      specificClothing: "White linen casual chic ensemble with sun hat"
    }
  }
];
