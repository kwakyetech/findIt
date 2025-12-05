import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageSquare } from 'lucide-react';

const ChatList = ({ currentUser, onSelectChat, selectedChatId }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const chatsRef = collection(db, 'chats');
        // We need to find chats where the user is a participant.
        // Note: Firestore 'array-contains' allows filtering by one value in an array.
        const q = query(
            chatsRef,
            where('participants', 'array-contains', currentUser.uid),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedChats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChats(fetchedChats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <div className="p-4 text-center text-slate-400">Loading chats...</div>;
    }

    if (chats.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p>No messages yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            {chats.map(chat => (
                <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                        }`}
                >
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">
                        {/* Ideally we'd fetch the other user's name or the item title here */}
                        Item Chat
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                        {chat.lastMessage || 'No messages'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ChatList;
