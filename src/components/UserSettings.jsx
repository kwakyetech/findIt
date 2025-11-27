import React, { useState } from 'react';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const UserSettings = ({ user, onBack }) => {
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(user, { displayName });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await updatePassword(user, newPassword);
            toast.success('Password updated successfully');
            setNewPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error('Please log out and log in again to change password');
            } else {
                toast.error('Failed to update password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">User Settings</h1>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                        <User size={18} />
                        Profile Information
                    </h2>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Lock size={18} />
                        Security
                    </h2>
                </div>
                <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="••••••••"
                            minLength={6}
                        />
                        <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters long.</p>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;
