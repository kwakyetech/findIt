import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

const HeroSection = ({ onAction }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl mb-10">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-sm font-medium mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
                    Community Lost & Found
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    Lost something? <br />
                    <span className="text-blue-200">Let's help you find it.</span>
                </h1>

                <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
                    Connect with your community to recover lost items or return found treasures.
                    Simple, fast, and effective.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={onAction}
                        className="group flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Post an Item
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => document.getElementById('items-grid')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center justify-center gap-2 bg-blue-700/50 backdrop-blur-sm text-white border border-blue-500/50 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700/70 transition-all"
                    >
                        <Search size={20} />
                        Browse Items
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
