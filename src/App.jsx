import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, MapPin, LogOut, User as UserIcon, Shield, Settings } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

// Import our new separate components
import { auth } from './firebase';
import Navbar from './components/Navbar';
import ItemCard from './components/ItemCard';
import AddItemModal from './components/AddItemModal';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import LoadingSpinner from './components/LoadingSpinner';
import AdminDashboard from './components/AdminDashboard';
import UserSettings from './components/UserSettings';
import { useItems } from './hooks/useItems';

// Define Admin Emails
const ADMIN_EMAILS = ['admin@findit.com', 'kwaky@example.com']; // Add your email here

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'settings'

  // 1. Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Reset view if logged out
      if (!currentUser) setCurrentView('home');
    });
    return () => unsubscribe();
  }, []);

  // 2. Use Custom Hook for Data
  const { items, loading, addItem, deleteItem } = useItems(user);

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // 3. Handle Create Item
  const handleAddItem = async (itemData) => {
    setIsSubmitting(true);
    const success = await addItem(itemData);
    setIsSubmitting(false);
    if (success) {
      setIsAddItemModalOpen(false);
    }
  };

  // 4. Handle Post Button Click
  const handlePostClick = () => {
    if (user) {
      setIsAddItemModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // 5. Handle Logout
  const handleLogout = () => {
    signOut(auth);
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [items, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Toaster position="bottom-right" />

      <Navbar
        user={user}
        isAdmin={isAdmin}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        handlePostClick={handlePostClick}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />

      <main className="max-w-4xl mx-auto p-4">
        {currentView === 'admin' && isAdmin ? (
          <AdminDashboard
            items={items}
            onDelete={deleteItem}
            onBack={() => setCurrentView('home')}
          />
        ) : currentView === 'settings' ? (
          <UserSettings
            user={user}
            onBack={() => setCurrentView('home')}
          />
        ) : (
          <>
            {!user && <HeroSection onAction={handlePostClick} />}

            {/* Search & Filter */}
            <div className="mb-6 space-y-3" id="items-grid">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>All</button>
                <button onClick={() => setFilter('lost')} className={`px-4 py-1 rounded-full text-sm ${filter === 'lost' ? 'bg-red-600 text-white' : 'bg-white border'}`}>Lost</button>
                <button onClick={() => setFilter('found')} className={`px-4 py-1 rounded-full text-sm ${filter === 'found' ? 'bg-green-600 text-white' : 'bg-white border'}`}>Found</button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isOwner={user && user.uid === item.authorId}
                      onDelete={deleteItem}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    No items found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        isSubmitting={isSubmitting}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
