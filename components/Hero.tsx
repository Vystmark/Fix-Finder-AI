import React, { useState, useRef } from 'react';
import { Search, MapPin, Camera, Loader2 } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string, zip: string) => void;
  onPhotoUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, onPhotoUpload, isAnalyzing }) => {
  const [query, setQuery] = useState('');
  const [zip, setZip] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && zip.trim()) {
      onSearch(query, zip);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative bg-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Home improvement, <span className="text-blue-400">simplified.</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Find trusted local professionals for any project. Describe your issue or upload a photo, and let our AI match you with the right pros in your zip code.
        </p>

        <div className="bg-white p-2 rounded-xl shadow-2xl max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What needs fixing? (e.g. Leaky faucet)"
                className="block w-full pl-10 pr-3 py-4 text-slate-900 placeholder-slate-400 bg-transparent border border-transparent focus:border-blue-500 focus:ring-0 rounded-lg sm:text-sm md:text-base font-medium"
              />
            </div>
            
            <div className="relative md:w-48 group border-t md:border-t-0 md:border-l border-slate-200">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
              </div>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip Code"
                maxLength={5}
                className="block w-full pl-10 pr-3 py-4 text-slate-900 placeholder-slate-400 bg-transparent border border-transparent focus:border-blue-500 focus:ring-0 rounded-lg sm:text-sm md:text-base font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="md:w-auto w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md"
            >
              Find Pros
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center items-center space-x-4">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Or try AI Analysis</span>
        </div>

        <div className="mt-4 flex justify-center">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="inline-flex items-center px-6 py-3 border border-slate-600 shadow-sm text-sm font-medium rounded-full text-slate-200 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105"
            >
                {isAnalyzing ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-400" />
                ) : (
                    <Camera className="h-5 w-5 mr-2 text-blue-400" />
                )}
                {isAnalyzing ? "Analyzing Issue..." : "Snap a photo of the problem"}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />
        </div>
      </div>
    </div>
  );
};

export default Hero;