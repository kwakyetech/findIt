import React from 'react';
import { MapPin, LogOut, User as UserIcon, Shield, Settings, Plus, LogIn, MessageSquare } from 'lucide-react';

const Navbar = ({ user, isAdmin, currentView, setCurrentView, handleLogout, handlePostClick, setIsAuthModalOpen }) => {
    return (
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm transition-all duration-300">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setCurrentView('home')}
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform">
                        <MapPin size={20} fill="currentColor" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        FindIt
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <button
                                    onClick={() => setCurrentView('admin')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentView === 'admin'
                                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <Shield size={16} />
                                    <span className="hidden sm:inline">Admin</span>
                                </button>
                            )}

                            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
                                <UserIcon size={16} className="text-slate-500" />
                                <span className="max-w-[100px] truncate">{user.displayName || user.email.split('@')[0]}</span>
                            </div>

                            <button
                                onClick={() => setCurrentView('messages')}
                                className={`p-2 rounded-full transition-all ${currentView === 'messages'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                                title="Messages"
                            >
                                <MessageSquare size={20} />
                            </button>

                            <button
                                onClick={() => setCurrentView('settings')}
                                className={`p-2 rounded-full transition-all ${currentView === 'settings'
                                    ? 'bg-slate-200 text-slate-800'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                                title="Settings"
                            >
                                <Settings size={20} />
                            </button>

                            <button
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>

                            <button
                                onClick={handlePostClick}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Post Item</span>
                                <span className="sm:hidden">Post</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex items-center gap-2 text-slate-600 font-medium text-sm hover:text-blue-600 px-3 py-2 transition-colors"
                            >
                                <LogIn size={18} />
                                <span className="hidden sm:inline">Log In</span>
                            </button>
                            <button
                                onClick={handlePostClick}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
                            >
                                <Plus size={18} /> Post Item
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
