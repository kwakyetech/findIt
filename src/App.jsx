import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, MapPin, LogOut, User as UserIcon, Shield, Settings, Map as MapIcon, Grid, MessageSquare } from 'lucide-react';
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
import MapView from './components/MapView';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import MatchingItemsModal from './components/MatchingItemsModal';
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
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'settings', 'messages'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'map'
  const [selectedChatId, setSelectedChatId] = useState(null);

  // 1. Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Reset view if logged out
      if (!currentUser) setCurrentView('home');
    });
    return () => unsubscribe();
  }, []);

  const [matches, setMatches] = useState([]);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  // 2. Use Custom Hook for Data
  // 2. Use Custom Hook for Data
  const { items, loading, addItem, deleteItem, findMatches, updateItemStatus } = useItems(user);

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // 3. Handle Create Item
  const handleAddItem = async (itemData) => {
    setIsSubmitting(true);

    // Check for matches first
    const potentialMatches = await findMatches(itemData);

    if (potentialMatches.length > 0) {
      setMatches(potentialMatches);
      setPendingItem(itemData);
      setIsMatchingModalOpen(true);
      setIsSubmitting(false);
      setIsAddItemModalOpen(false); // Close add modal temporarily
      return;
    }

    // No matches, proceed to add
    await processAddItem(itemData);
  };

  const processAddItem = async (itemData) => {
    setIsSubmitting(true);
    const success = await addItem(itemData);
    setIsSubmitting(false);
    if (success) {
      setIsAddItemModalOpen(false);
      setIsMatchingModalOpen(false);
      setPendingItem(null);
    }
  };

  const handleMatchContact = async (matchItem) => {
    // Logic to start chat with the match owner
    // We can reuse the logic from ItemCard, but we need to access it here.
    // Ideally, we should extract the chat creation logic to a helper or hook.
    // For now, let's just navigate to messages and let the user find them? 
    // No, we need to create the chat.

    if (!user) return;

    try {
      const chatId = `${matchItem.id}_${user.uid}`;
      const { setDoc, doc, serverTimestamp, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');

      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [user.uid, matchItem.authorId],
          participantNames: {
            [user.uid]: user.displayName || 'User',
            [matchItem.authorId]: matchItem.authorName || 'User'
          },
          itemId: matchItem.id,
          itemTitle: matchItem.title,
          updatedAt: serverTimestamp(),
          lastMessage: ''
        });
      }

      setSelectedChatId(chatId);
      setCurrentView('messages');
      setIsMatchingModalOpen(false);
      setPendingItem(null);
    } catch (error) {
      console.error("Error starting chat from match:", error);
      alert("Failed to connect.");
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

      <main className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)]">
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
        ) : currentView === 'messages' ? (
          <div className="flex h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`${selectedChatId ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r border-slate-200`}>
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-slate-800">Messages</h2>
              </div>
              <ChatList
                currentUser={user}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId}
              />
            </div>
            <div className={`${!selectedChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
              {selectedChatId ? (
                <ChatWindow
                  chatId={selectedChatId}
                  currentUser={user}
                  onClose={() => setSelectedChatId(null)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
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
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>All</button>
                  <button onClick={() => setFilter('lost')} className={`px-4 py-1 rounded-full text-sm ${filter === 'lost' ? 'bg-red-600 text-white' : 'bg-white border'}`}>Lost</button>
                  <button onClick={() => setFilter('found')} className={`px-4 py-1 rounded-full text-sm ${filter === 'found' ? 'bg-green-600 text-white' : 'bg-white border'}`}>Found</button>
                </div>

                {/* View Toggle */}
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Map View"
                  >
                    <MapIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <LoadingSpinner />
            ) : viewMode === 'map' ? (
              <MapView items={filteredItems} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isOwner={user && user.uid === item.authorId}
                      onDelete={deleteItem}
                      onUpdateStatus={updateItemStatus}
                      currentUser={user}
                      onChat={(chatId) => {
                        setCurrentView('messages');
                        setSelectedChatId(chatId);
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    No items found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
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

      <MatchingItemsModal
        isOpen={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        matches={matches}
        onContact={handleMatchContact}
        onPostAnyway={() => processAddItem(pendingItem)}
      />
    </div>
  );
}
