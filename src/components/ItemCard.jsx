import React from 'react';
import { MapPin, Calendar, Tag, Trash2, Mail, Image as ImageIcon } from 'lucide-react';

const ItemCard = ({ item, isOwner, onDelete }) => {
  const isLost = item.type === 'lost';

  const handleContact = () => {
    window.location.href = `mailto:${item.contact}?subject=Regarding: ${item.title}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
            {item.type}
          </span>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(item.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={item.title}>
            {item.title}
          </h3>
          <span className="text-xs text-slate-400 whitespace-nowrap mt-1">
            {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown date'}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {item.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Tag size={14} className="text-blue-500" />
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
              {item.category || 'Uncategorized'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={14} className="text-red-500" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <button
          onClick={handleContact}
          className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-sm font-medium transition-colors"
        >
          <Mail size={16} />
          Contact Owner
        </button>
      </div>
    </div>
  );
};

export default ItemCard;