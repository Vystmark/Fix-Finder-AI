import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProviderList from './components/ProviderList';
import LeadModal from './components/LeadModal';
import AnalysisResultView from './components/AnalysisResult';
import ZipPromptModal from './components/ZipPromptModal';
import { ServiceProvider, AiAnalysisResult } from './types';
import { findProviders, analyzeHomeIssue } from './services/gemini';
import { Loader2, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const [searchParams, setSearchParams] = useState({ query: '', zip: '' });
  const [hasSearched, setHasSearched] = useState(false);
  
  // Logic for handling missing zip code
  const [showZipPrompt, setShowZipPrompt] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<string | null>(null);

  const handleSearch = async (query: string, zip: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setAnalysisResult(null); // Clear analysis if manually searching
    setSearchParams({ query, zip });
    
    const results = await findProviders(query, zip);
    setProviders(results);
    setIsLoading(false);
  };

  const handlePhotoUpload = async (file: File) => {
    setIsAnalyzing(true);
    setHasSearched(false);
    setProviders([]);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        const result = await analyzeHomeIssue(base64Data);
        setAnalysisResult(result);
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysisAction = (trade: string) => {
    // Check if we already have a zip code from the hero input
    if (searchParams.zip && searchParams.zip.length === 5) {
      handleSearch(trade, searchParams.zip);
    } else {
      // If not, ask the user for it
      setPendingTrade(trade);
      setShowZipPrompt(true);
    }
  };

  const handleZipSubmit = (zip: string) => {
    setShowZipPrompt(false);
    setSearchParams(prev => ({ ...prev, zip }));
    if (pendingTrade) {
        handleSearch(pendingTrade, zip);
        setPendingTrade(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => {
                setHasSearched(false);
                setAnalysisResult(null);
                setProviders([]);
            }}>
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                    <Wrench className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">FixFinder<span className="text-blue-600">AI</span></span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-slate-500 hover:text-slate-900 font-medium text-sm">For Pros</button>
              <button className="ml-6 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col">
        <Hero 
            onSearch={handleSearch} 
            onPhotoUpload={handlePhotoUpload}
            isAnalyzing={isAnalyzing}
        />

        {/* AI Analysis Result Section */}
        {analysisResult && (
            <AnalysisResultView 
                result={analysisResult} 
                onSearchForTrade={handleAnalysisAction} 
            />
        )}

        {/* Search Results */}
        {hasSearched && (
            <ProviderList 
                providers={providers} 
                isLoading={isLoading} 
                onConnect={setSelectedProvider} 
            />
        )}

        {/* Empty State / Intro */}
        {!hasSearched && !isAnalyzing && !analysisResult && (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl">1</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Search or Snap</h3>
                        <p className="text-slate-500">Describe your issue or upload a photo for AI analysis.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl">2</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Compare Pros</h3>
                        <p className="text-slate-500">View ratings, prices, and availability of local verified experts.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl">3</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Get it Fixed</h3>
                        <p className="text-slate-500">Connect directly and get your home back to normal.</p>
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm">
            © 2024 FixFinder AI. All rights reserved. <br/>
            <span className="text-xs">This is a demo application. Service providers listed are generated by AI.</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedProvider && (
        <LeadModal 
          provider={selectedProvider} 
          onClose={() => setSelectedProvider(null)} 
        />
      )}

      {showZipPrompt && (
        <ZipPromptModal 
            onSubmit={handleZipSubmit}
            onClose={() => setShowZipPrompt(false)}
        />
      )}
    </div>
  );
};

export default App;