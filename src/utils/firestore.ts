import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';


export interface Pahlawan {
    id?: string;
    name: string;
    story: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const firestoreService = {
    getPahlawanRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'pahlawan');
    },

    async addPahlawan(pahlawan: Omit<Pahlawan, 'id'>) {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const docRef = await addDoc(pahlawanRef, {
                ...pahlawan,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Pahlawan:', error);
            throw error;
        }
    },

    async getPahlawan(): Promise<Pahlawan[]> {
        try {
            const PahlawanRef = this.getPahlawanRef();
            const q = query(PahlawanRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Pahlawan));
        } catch (error) {
            console.error('Error Get Todos:', error);
            throw error;
        }
    },

    async updatePahlawan(id: string, pahlawan: Partial<Pahlawan>) {
        try {
            const PahlawanRef = this.getPahlawanRef();
            const docRef = doc(PahlawanRef, id);
            await updateDoc(docRef, {
                ...pahlawan,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update pahlawan:', error);
            throw error;
        }
    },

    async deletePahlawan(id: string) {
        try {
            const PahlawanRef = this.getPahlawanRef();
            const docRef = doc(PahlawanRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Pahlawan:', error);
            throw error;
        }
    },

    
}