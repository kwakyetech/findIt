import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

const ChatWindow = ({ chatId, currentUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: currentUser.uid,
                createdAt: serverTimestamp(),
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                <button onClick={onClose} className="md:hidden p-1 hover:bg-slate-200 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h3 className="font-bold text-slate-800">Chat</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {loading ? (
                    <div className="text-center text-slate-400 mt-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-10">No messages yet. Say hello!</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUser.uid;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
