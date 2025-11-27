import React from 'react';
import { MapPin, Tag, Phone } from 'lucide-react';

const ItemCard = ({ item, isOwner, onDelete }) => {
  const isLost = item.type === 'lost';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className={`h-2 ${isLost ? 'bg-red-500' : 'bg-green-500'}`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
            isLost ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
          <span className="text-xs text-slate-400">
            {item.date ? new Date(item.date).toLocaleDateString() : 'Recently'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>{item.category}</span>
          </div>
          {item.contact && (
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <Phone size={16} />
              <span>{item.contact}</span>
            </div>
          )}
        </div>
      </div>
      
      {isOwner && (
         <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
            <button 
              onClick={() => onDelete(item.id)}
              className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline"
            >
              Remove Listing
            </button>
         </div>
      )}
    </div>
  );
};

export default ItemCard;