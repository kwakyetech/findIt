import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageSquare, User } from 'lucide-react';

const ChatList = ({ currentUser, onSelectChat, selectedChatId }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const chatsRef = collection(db, 'chats');
        const q = query(
            chatsRef,
            where('participants', 'array-contains', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedChats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side sort since we removed the composite index orderBy
            fetchedChats.sort((a, b) => {
                const timeA = a.updatedAt?.seconds || 0;
                const timeB = b.updatedAt?.seconds || 0;
                return timeB - timeA;
            });

            setChats(fetchedChats);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching chats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Helper to format time like WhatsApp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'long' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    // Helper to get other user's name
    const getOtherUserName = (chat) => {
        if (!chat.participantNames) return chat.itemTitle || 'User';
        const otherId = chat.participants.find(id => id !== currentUser.uid);
        return chat.participantNames[otherId] || chat.itemTitle || 'User';
    };

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center h-full justify-center">
                <div className="bg-slate-100 p-4 rounded-full mb-3">
                    <MessageSquare size={32} className="opacity-50" />
                </div>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm mt-1">Contact an item owner to start chatting</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full bg-white">
            {chats.map(chat => {
                const otherName = getOtherUserName(chat);
                const initials = otherName.substring(0, 2).toUpperCase();

                return (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`flex items-center gap-3 p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedChatId === chat.id ? 'bg-blue-50/60' : ''
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                                {initials}
                            </div>
                            {/* Online Indicator (Fake for now) */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-semibold text-slate-900 truncate pr-2">
                                    {otherName}
                                </h4>
                                <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">
                                    {formatTime(chat.updatedAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-500 truncate pr-2">
                                    {chat.lastMessage || 'Start the conversation...'}
                                </p>
                                {/* Unread Badge (Placeholder logic) */}
                                {/* <div className="min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">2</div> */}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                Re: {chat.itemTitle}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatList;
