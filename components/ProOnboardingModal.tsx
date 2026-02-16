import React, { useState } from 'react';
import { X, CheckCircle2, Facebook, Globe, Camera, Briefcase, DollarSign } from 'lucide-react';

interface ProOnboardingModalProps {
  onClose: () => void;
}

const ProOnboardingModal: React.FC<ProOnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    trade: '',
    facebookPage: '',
    zip: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

        <div className="relative inline-block align-middle bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full">
          <div className="absolute top-6 right-6 z-10">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all">
                <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white p-8 sm:p-12">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Grow your business</h2>
                <p className="text-slate-500 mb-8">Join the network where customers find you using AI. Whether you're on Google, Facebook, or just starting out.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Direct AI Referrals</p>
                      <p className="text-sm text-slate-500">Our AI analyzes home photos and sends relevant leads directly to you.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Facebook Integration</p>
                      <p className="text-sm text-slate-500">Import your existing reviews and photos from your Facebook business page.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  List My Business
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                    <input 
                      type="text" required 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Reliable Roofing Co."
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Trade</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.trade}
                      onChange={e => setFormData({...formData, trade: e.target.value})}
                    >
                      <option value="">Select your specialty...</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Handyman">Handyman</option>
                      <option value="Roofer">Roofer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Facebook Business Page (Optional)
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="facebook.com/your-business"
                      value={formData.facebookPage}
                      onChange={e => setFormData({...formData, facebookPage: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-8"
                >
                  Review & Submit
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Application Received!</h2>
                <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-left">
                  <p className="text-sm text-slate-600 mb-4">You'll be listed in the <span className="font-bold">FixFinder Partner Network</span> once we verify your details.</p>
                  <div className="flex items-center text-xs text-blue-700 font-bold bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Fee structure: $15.00 flat fee per qualified lead sent.
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProOnboardingModal;