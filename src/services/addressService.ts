import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  placeId?: string;
  isDefault: boolean;
}

export const addressService = {
  getAddresses: async (userId: string): Promise<Address[]> => {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
  },

  addAddress: async (userId: string, address: Address): Promise<string> => {
    const batch = writeBatch(db);
    const addressesRef = collection(db, 'users', userId, 'addresses');
    
    // If setting as default, unset others
    if (address.isDefault) {
      const q = query(addressesRef, where('isDefault', '==', true));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { isDefault: false });
      });
    }

    const newDocRef = doc(addressesRef);
    batch.set(newDocRef, address);
    await batch.commit();
    
    return newDocRef.id;
  },

  updateAddress: async (userId: string, addressId: string, address: Partial<Address>): Promise<void> => {
    const batch = writeBatch(db);
    const addressesRef = collection(db, 'users', userId, 'addresses');
    
    // If setting as default, unset others
    if (address.isDefault) {
      const q = query(addressesRef, where('isDefault', '==', true));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        if (docSnap.id !== addressId) {
          batch.update(docSnap.ref, { isDefault: false });
        }
      });
    }

    const docRef = doc(addressesRef, addressId);
    batch.update(docRef, address);
    await batch.commit();
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(docRef);
  },

  setDefaultAddress: async (userId: string, addressId: string): Promise<void> => {
    const batch = writeBatch(db);
    const addressesRef = collection(db, 'users', userId, 'addresses');
    
    // Unset all existing defaults
    const q = query(addressesRef, where('isDefault', '==', true));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      if (docSnap.id !== addressId) {
        batch.update(docSnap.ref, { isDefault: false });
      }
    });

    // Set new default
    const docRef = doc(addressesRef, addressId);
    batch.update(docRef, { isDefault: true });
    
    await batch.commit();
  },

  reverseGeocode: async (lat: number, lng: number): Promise<any> => {
    const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key is not configured");
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.error_message || "Failed to reverse geocode");
    }
    
    return data.results[0];
  }
};
