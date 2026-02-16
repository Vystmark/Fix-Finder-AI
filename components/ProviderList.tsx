import React from 'react';
import { Star, MapPin, Clock, ShieldCheck, Phone, Zap, Facebook, Globe, ExternalLink } from 'lucide-react';
import { ServiceProvider } from '../types';

interface ProviderListProps {
  providers: ServiceProvider[];
  onConnect: (provider: ServiceProvider) => void;
  isLoading: boolean;
}

const ProviderList: React.FC<ProviderListProps> = ({ providers, onConnect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
              <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-slate-200 rounded mb-4"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return null;
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Facebook': return <Facebook className="w-3 h-3 mr-1 text-blue-600" />;
      case 'Google': return <Globe className="w-3 h-3 mr-1 text-red-500" />;
      case 'FixFinder': return <Zap className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />;
      default: return <MapPin className="w-3 h-3 mr-1 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Available Professionals</h2>
           <p className="text-slate-500 mt-2">Verified pros from across Facebook, Google, and FixFinder Network</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {providers.map((provider, index) => {
          const isSponsored = index === 0;
          return (
            <div 
              key={provider.id} 
              className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative ${isSponsored ? 'border-2 border-blue-500 ring-4 ring-blue-50/50' : 'border border-slate-100'}`}
            >
              {isSponsored && (
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 absolute top-0 right-0 z-20 rounded-bl-xl flex items-center">
                  <Zap className="w-3 h-3 mr-1 fill-white" />
                  Recommended
                </div>
              )}
              
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={`https://picsum.photos/seed/${provider.id + (provider.imageUrl || 'pro')}/800/600`} 
                  alt={provider.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm flex items-center border border-slate-100 uppercase tracking-wider">
                    {getSourceIcon(provider.source)}
                    {provider.source}
                  </div>
                  {provider.source === 'FixFinder' && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center">
                       <ShieldCheck className="w-3 h-3 mr-1" /> Partner
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 leading-tight">{provider.name}</h3>
                     <p className="text-sm font-medium text-slate-500">{provider.trade}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-bold text-slate-700">{provider.rating}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {provider.description}
                </p>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center text-slate-500">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {provider.distance}
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {provider.availability}
                  </div>
                  {provider.socialLink && (
                    <a 
                      href={`https://${provider.socialLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline font-medium"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      View Facebook Page
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-slate-400 font-medium">ESTIMATED RATE</span>
                      <span className="text-sm font-bold text-slate-900">{provider.hourlyRate}/hr</span>
                   </div>
                   <button
                    onClick={() => onConnect(provider)}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl transition-all ${isSponsored ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Book & Get Quote
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderList;