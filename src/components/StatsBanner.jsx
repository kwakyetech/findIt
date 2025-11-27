import React, { useMemo } from 'react';

const StatsBanner = ({ items }) => {
  const stats = useMemo(() => {
    const lost = items.filter(i => i.type === 'lost').length;
    const found = items.filter(i => i.type === 'found').length;
    return { lost, found };
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-red-600">{stats.lost}</span>
        <span className="text-sm font-medium text-red-800 uppercase tracking-wide">Lost Items</span>
      </div>
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-green-600">{stats.found}</span>
        <span className="text-sm font-medium text-green-800 uppercase tracking-wide">Found Items</span>
      </div>
    </div>
  );
};

export default StatsBanner;
