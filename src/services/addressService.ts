import { ref, push, get, update, remove, set } from 'firebase/database';
import { rtdb } from '../firebase';

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
    const addressesRef = ref(rtdb, `users/${userId}/addresses`);
    const snapshot = await get(addressesRef);
    if (!snapshot.exists()) return [];
    
    const addresses: Address[] = [];
    snapshot.forEach((childSnapshot) => {
      addresses.push({ id: childSnapshot.key, ...childSnapshot.val() } as Address);
    });
    return addresses;
  },

  addAddress: async (userId: string, address: Address): Promise<string> => {
    const addressesRef = ref(rtdb, `users/${userId}/addresses`);
    
    // If setting as default, unset others
    if (address.isDefault) {
      const snapshot = await get(addressesRef);
      if (snapshot.exists()) {
        const updates: any = {};
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().isDefault) {
            updates[`${childSnapshot.key}/isDefault`] = false;
          }
        });
        if (Object.keys(updates).length > 0) {
          await update(addressesRef, updates);
        }
      }
    }

    const newAddressRef = push(addressesRef);
    await set(newAddressRef, address);
    return newAddressRef.key as string;
  },

  updateAddress: async (userId: string, addressId: string, address: Partial<Address>): Promise<void> => {
    const addressesRef = ref(rtdb, `users/${userId}/addresses`);
    
    // If setting as default, unset others
    if (address.isDefault) {
      const snapshot = await get(addressesRef);
      if (snapshot.exists()) {
        const updates: any = {};
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.key !== addressId && childSnapshot.val().isDefault) {
            updates[`${childSnapshot.key}/isDefault`] = false;
          }
        });
        if (Object.keys(updates).length > 0) {
          await update(addressesRef, updates);
        }
      }
    }

    const addressRef = ref(rtdb, `users/${userId}/addresses/${addressId}`);
    await update(addressRef, address);
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    const addressRef = ref(rtdb, `users/${userId}/addresses/${addressId}`);
    await remove(addressRef);
  },

  setDefaultAddress: async (userId: string, addressId: string): Promise<void> => {
    const addressesRef = ref(rtdb, `users/${userId}/addresses`);
    const snapshot = await get(addressesRef);
    
    if (snapshot.exists()) {
      const updates: any = {};
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key === addressId) {
          updates[`${childSnapshot.key}/isDefault`] = true;
        } else if (childSnapshot.val().isDefault) {
          updates[`${childSnapshot.key}/isDefault`] = false;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(addressesRef, updates);
      }
    }
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
