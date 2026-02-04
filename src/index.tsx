import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 text-stone-200 font-sans">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-3">Something went wrong</h1>
            <p className="text-stone-400 mb-6 text-sm leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
             {this.state.error && (
                <div className="mb-6 p-3 bg-black/30 rounded text-left overflow-auto max-h-32 text-xs text-red-400 font-mono border border-red-900/10">
                  {this.state.error.toString()}
                </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-stone-100 text-stone-900 hover:bg-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);