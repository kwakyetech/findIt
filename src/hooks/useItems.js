import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export const useItems = (user) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const itemsRef = collection(db, 'lost-found-items');
        const q = query(itemsRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(fetchedItems);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching items:", error);
            toast.error("Failed to load items");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addItem = async (itemData) => {
        if (!user) {
            toast.error("You must be logged in to post");
            return false;
        }

        const loadingToast = toast.loading('Posting item...');
        try {
            const itemsRef = collection(db, 'lost-found-items');
            await addDoc(itemsRef, {
                ...itemData,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                createdAt: serverTimestamp(),
            });
            toast.success('Item posted successfully!', { id: loadingToast });
            return true;
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error(`Failed to post item: ${error.message}`, { id: loadingToast });
            return false;
        }
    };

    const deleteItem = async (itemId) => {
        if (!confirm('Remove this listing?')) return;

        const loadingToast = toast.loading('Deleting item...');
        try {
            await deleteDoc(doc(db, 'lost-found-items', itemId));
            toast.success('Item removed', { id: loadingToast });
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item", { id: loadingToast });
        }
    };

    const findMatches = async (newItem) => {
        try {
            const itemsRef = collection(db, 'lost-found-items');
            // Look for opposite type (Lost <-> Found) in the same category
            const targetType = newItem.type === 'lost' ? 'found' : 'lost';

            const q = query(
                itemsRef,
                where('type', '==', targetType),
                where('category', '==', newItem.category)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error finding matches:", error);
            return [];
        }
    };

    return { items, loading, addItem, deleteItem, findMatches };
};
