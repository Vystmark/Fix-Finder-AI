import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ZipPromptModalProps {
  onSubmit: (zip: string) => void;
  onClose: () => void;
}

const ZipPromptModal: React.FC<ZipPromptModalProps> = ({ onSubmit, onClose }) => {
  const [zip, setZip] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length >= 5) {
      onSubmit(zip);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">What's your Zip Code?</h3>
        <p className="text-slate-500 text-center mb-6 text-sm">We need your location to match you with available pros in your area.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 90210"
              className="w-full text-center text-lg font-bold tracking-widest px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300"
              autoFocus
              required
              pattern="[0-9]*"
              maxLength={5}
            />
          </div>
          <div className="flex gap-3">
             <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={zip.length < 5}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30"
            >
              See Pros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZipPromptModal;