import React from 'react';
import { Search, ShieldCheck } from 'lucide-react';

const HeroSection = ({ onAction }) => {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

            <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-blue-400/30">
                    <ShieldCheck size={14} />
                    <span>Trusted Community</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Lost something? Found something? <br />
                    <span className="text-blue-200">Let's help you connect.</span>
                </h1>

                <p className="text-blue-100 mb-6 text-lg max-w-lg">
                    FindIt is a community-driven platform to help you recover lost items or return found ones to their rightful owners.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onAction}
                        className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Report an Item
                    </button>
                    <a href="#items-grid" className="bg-blue-600/50 border border-blue-400/30 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600/70 transition-colors">
                        Browse Items
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
