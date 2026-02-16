import React, { useState } from 'react';
import Hero from './components/Hero';
import ProviderList from './components/ProviderList';
import LeadModal from './components/LeadModal';
import AnalysisResultView from './components/AnalysisResult';
import ZipPromptModal from './components/ZipPromptModal';
import ProOnboardingModal from './components/ProOnboardingModal';
import { ServiceProvider, AiAnalysisResult } from './types';
import { findProviders, analyzeHomeIssue } from './services/gemini';
import { Wrench, ShieldCheck, Megaphone } from 'lucide-react';

const App: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const [searchParams, setSearchParams] = useState({ query: '', zip: '' });
  const [hasSearched, setHasSearched] = useState(false);
  
  const [showZipPrompt, setShowZipPrompt] = useState(false);
  const [showProOnboarding, setShowProOnboarding] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<string | null>(null);

  const handleSearch = async (query: string, zip: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setAnalysisResult(null);
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
    if (searchParams.zip && searchParams.zip.length === 5) {
      handleSearch(trade, searchParams.zip);
    } else {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => {
                setHasSearched(false);
                setAnalysisResult(null);
                setProviders([]);
            }}>
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 p-1.5 rounded-xl mr-2 shadow-lg shadow-blue-200">
                    <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">FixFinder<span className="text-blue-600">AI</span></span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setShowProOnboarding(true)}
                className="hidden sm:flex items-center text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
              >
                <Megaphone className="w-4 h-4 mr-2" />
                Join as a Pro
              </button>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-md">
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

        {analysisResult && (
            <AnalysisResultView 
                result={analysisResult} 
                onSearchForTrade={handleAnalysisAction} 
            />
        )}

        {hasSearched && (
            <ProviderList 
                providers={providers} 
                isLoading={isLoading} 
                onConnect={setSelectedProvider} 
            />
        )}

        {!hasSearched && !isAnalyzing && !analysisResult && (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-12">The smartest way to find local experts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Wrench className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">AI Diagnostics</h3>
                        <p className="text-slate-500 leading-relaxed">Not sure who to call? Upload a photo and let our AI diagnose the issue and the right pro for the job.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Network</h3>
                        <p className="text-slate-500 leading-relaxed">We aggregate pros from Google, Facebook, and our direct partner network to find the best available help.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                          <Megaphone className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Connect Directly</h3>
                        <p className="text-slate-500 leading-relaxed">Get quotes and book services instantly. Our partners pay for leads, keeping the platform free for you.</p>
                    </div>
                </div>
                
                <div className="mt-20 bg-blue-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
                   <div className="relative z-10 max-w-2xl mx-auto">
                      <h3 className="text-3xl font-extrabold mb-4">Are you a service provider?</h3>
                      <p className="text-blue-100 text-lg mb-8">Get listed and start receiving AI-matched leads from Facebook and beyond. No monthly fees, only pay for valid leads.</p>
                      <button 
                        onClick={() => setShowProOnboarding(true)}
                        className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-extrabold hover:bg-blue-50 transition-all shadow-2xl"
                      >
                        Join the Partner Network
                      </button>
                   </div>
                   <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4">
                      <Wrench className="w-96 h-96" />
                   </div>
                </div>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <div className="bg-slate-900 p-1.5 rounded-lg mr-2">
                  <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">FixFinder AI</span>
            </div>
            <div className="flex space-x-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <button onClick={() => setShowProOnboarding(true)} className="hover:text-blue-600 text-blue-600 font-bold underline underline-offset-4">Add Your Listing</button>
            </div>
          </div>
          <p className="text-center text-slate-400 text-xs mt-8">
            © 2024 FixFinder AI. Verified professionals are independent contractors. <br/>
            FixFinder may receive a referral fee when you connect with providers.
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

      {showProOnboarding && (
        <ProOnboardingModal 
            onClose={() => setShowProOnboarding(false)}
        />
      )}
    </div>
  );
};

export default App;