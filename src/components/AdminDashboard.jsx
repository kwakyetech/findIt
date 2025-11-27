import React, { useMemo } from 'react';
import { Trash2, ArrowLeft, LayoutDashboard, Search } from 'lucide-react';

const AdminDashboard = ({ items, onDelete, onBack }) => {
    // Calculate stats
    const stats = useMemo(() => {
        const lost = items.filter(i => i.type === 'lost').length;
        const found = items.filter(i => i.type === 'found').length;
        return { lost, found, total: items.length };
    }, [items]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LayoutDashboard className="text-blue-600" />
                        Admin Dashboard
                    </h1>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Items</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <p className="text-sm font-medium text-red-600 uppercase tracking-wider">Lost Items</p>
                    <p className="text-3xl font-bold text-red-700 mt-2">{stats.lost}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Found Items</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">{stats.found}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-700">All Posted Items</h2>
                    <div className="text-sm text-slate-500">{items.length} items</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{item.title}</div>
                                        <div className="text-slate-500 text-xs truncate max-w-[200px]">{item.description}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.type === 'lost' ? 'Lost' : 'Found'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.location}</td>
                                    <td className="px-4 py-3 text-slate-600">{item.date}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colspan="6" className="px-4 py-8 text-center text-slate-500">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
