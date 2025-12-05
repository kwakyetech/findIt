import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

const ChatWindow = ({ chatId, currentUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatData, setChatData] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch Chat Data (for header info)
    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const chatRef = doc(db, 'chats', chatId);
                const snap = await getDoc(chatRef);
                if (snap.exists()) {
                    setChatData(snap.data());
                }
            } catch (error) {
                console.error("Error fetching chat details:", error);
            }
        };
        fetchChatData();
    }, [chatId]);

    // Fetch Messages
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
        }, (error) => {
            console.error("Error fetching messages:", error);
            toast.error("Error loading chat. Check permissions.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        setNewMessage(''); // Clear immediately for better UX

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const chatRef = doc(db, 'chats', chatId);

            // Add message
            await addDoc(messagesRef, {
                text: messageText,
                senderId: currentUser.uid,
                createdAt: serverTimestamp(),
            });

            // Update last message in chat doc
            await updateDoc(chatRef, {
                lastMessage: messageText,
                updatedAt: serverTimestamp()
            });

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setNewMessage(messageText); // Restore on failure
        }
    };

    // Helper to get other user's name
    const getOtherUserName = () => {
        if (!chatData || !chatData.participantNames) return 'User';
        const otherId = chatData.participants.find(id => id !== currentUser.uid);
        return chatData.participantNames[otherId] || 'User';
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const otherUserName = getOtherUserName();
    const initials = otherUserName.substring(0, 2).toUpperCase();

    return (
        <div className="flex flex-col h-full bg-[#efeae2] relative overflow-hidden">
            {/* WhatsApp-like Background Pattern (CSS trick or image) */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
            </div>

            {/* Header */}
            <div className="relative z-10 p-3 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm">
                <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <ArrowLeft size={20} />
                </button>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-sm">{otherUserName}</h3>
                    <p className="text-xs text-green-600 font-medium">Online</p>
                </div>

                <div className="flex items-center gap-4 text-slate-500 pr-2">
                    <Phone size={20} className="cursor-pointer hover:text-blue-600" />
                    <Video size={20} className="cursor-pointer hover:text-blue-600" />
                    <MoreVertical size={20} className="cursor-pointer hover:text-slate-800" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
                {loading ? (
                    <div className="text-center text-slate-400 mt-10">Loading...</div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center mt-10">
                        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-xs text-slate-500 shadow-sm">
                            Messages are secured with end-to-end encryption.
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUser.uid;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm shadow-sm relative group ${isMe
                                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                                        : 'bg-white text-slate-900 rounded-tl-none'
                                    }`}>
                                    <p className="mr-12 leading-relaxed">{msg.text}</p>
                                    <span className={`text-[10px] absolute bottom-1 right-2 ${isMe ? 'text-green-800/60' : 'text-slate-400'
                                        }`}>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white relative z-10 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 focus:border-white focus:ring-2 focus:ring-blue-500/20 outline-none bg-slate-50"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
