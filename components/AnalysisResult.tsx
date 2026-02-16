import React from 'react';
import { AlertTriangle, Wrench, DollarSign, ArrowRight } from 'lucide-react';
import { AiAnalysisResult } from '../types';

interface AnalysisResultProps {
  result: AiAnalysisResult;
  onSearchForTrade: (trade: string) => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onSearchForTrade }) => {
  const severityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Emergency: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10 mb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-500" />
                AI Assessment
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severityColors[result.severity]}`}>
                Severity: {result.severity}
            </span>
        </div>
        
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Issue Detected: {result.detectedTrade} Work Needed</h4>
                    <p className="text-slate-600 mb-4">{result.description}</p>
                    
                    <div className="flex items-center text-slate-700 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        Estimated Cost: {result.estimatedCostRange}
                    </div>
                </div>

                <div className="flex items-center justify-center md:border-l md:pl-8 border-slate-100">
                    <button
                        onClick={() => onSearchForTrade(result.detectedTrade)}
                        className="group flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        Find {result.detectedTrade}s Near You
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;