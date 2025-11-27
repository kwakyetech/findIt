import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, MapPin } from 'lucide-react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

// Import our new separate components
import { auth } from './firebase';
import ItemCard from './components/ItemCard';
import AddItemModal from './components/AddItemModal';
import StatsBanner from './components/StatsBanner';
import LoadingSpinner from './components/LoadingSpinner';
import { useItems } from './hooks/useItems';

export default function App() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initialize Auth
  useEffect(() => {
    signInAnonymously(auth).catch((error) => console.error("Auth Error", error));
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Use Custom Hook for Data
  const { items, loading, addItem, deleteItem } = useItems(user);

  // 3. Handle Create Item
  const handleAddItem = async (itemData) => {
    setIsSubmitting(true);
    const success = await addItem(itemData);
    setIsSubmitting(false);
    if (success) {
      setIsModalOpen(false);
    }
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

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-blue-600">FindIt</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
          >
            <Plus size={18} /> Post Item
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4">
        <StatsBanner items={items} />

        {/* Search & Filter */}
        <div className="mb-6 space-y-3">
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
      </main>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
