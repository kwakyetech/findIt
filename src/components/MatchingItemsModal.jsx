import React from 'react';
import { X, MessageSquare, ArrowRight, AlertCircle } from 'lucide-react';

const MatchingItemsModal = ({ isOpen, onClose, matches, onContact, onPostAnyway }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-blue-50/50">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Potential Matches Found!</h2>
                                <p className="text-slate-600 text-sm mt-1">
                                    We found some items that match what you're looking for.
                                    Check if any of these are yours before posting.
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Matches List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {matches.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-4">
                            {/* Image */}
                            <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 truncate">{item.title}</h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-medium text-slate-700">Location:</span> {item.location}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex flex-col justify-center border-l border-slate-100 pl-4">
                                <button
                                    onClick={() => onContact(item)}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center gap-1 min-w-[80px]"
                                >
                                    <MessageSquare size={18} />
                                    <span className="text-xs font-medium">Connect</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onPostAnyway}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium text-sm"
                    >
                        No match, post my item
                        <ArrowRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MatchingItemsModal;
