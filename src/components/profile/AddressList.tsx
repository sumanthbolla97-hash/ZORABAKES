import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Address, addressService } from '../../services/addressService';
import { Button } from '@/components/ui/Button';
import { MapPin, Edit2, Trash2, Star, CheckCircle2, Loader2 } from 'lucide-react';

interface AddressListProps {
  onSelectAddress?: (address: Address) => void;
  selectable?: boolean;
}

export function AddressList({ onSelectAddress, selectable = false }: AddressListProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await addressService.getAddresses(user.uid);
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(user.uid, id);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      await addressService.setDefaultAddress(user.uid, id);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to set default address');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-zora-ink)]" /></div>;
  }

  if (isAdding || editingAddress) {
    return (
      <AddressForm 
        address={editingAddress} 
        onCancel={() => {
          setIsAdding(false);
          setEditingAddress(null);
        }}
        onSave={() => {
          setIsAdding(false);
          setEditingAddress(null);
          fetchAddresses();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-[var(--color-zora-ink)]">Saved Addresses</h2>
        <Button onClick={() => setIsAdding(true)} size="sm">Add New Address</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--color-zora-ink)]/10 rounded-2xl">
          <MapPin className="mx-auto h-12 w-12 text-[var(--color-zora-stone)] mb-4" />
          <p className="text-[var(--color-zora-stone)] font-medium">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`relative p-6 rounded-2xl border transition-all ${
                addr.isDefault 
                  ? 'border-[var(--color-zora-ink)] bg-[var(--color-zora-oat)]/50' 
                  : 'border-[var(--color-zora-ink)]/10 bg-white hover:border-[var(--color-zora-ink)]/30'
              }`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-zora-ink)] bg-white px-2 py-1 rounded-full border border-[var(--color-zora-ink)]/10 shadow-sm">
                  <Star className="h-3 w-3 fill-current" /> Default
                </span>
              )}

              <div className="mb-4 pr-20">
                <h3 className="font-bold text-[var(--color-zora-ink)]">{addr.fullName}</h3>
                <p className="text-sm text-[var(--color-zora-stone)] mt-1">{addr.phone}</p>
              </div>

              <div className="text-sm text-[var(--color-zora-ink)] space-y-1 mb-6">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                {addr.landmark && <p className="text-[var(--color-zora-stone)]">Landmark: {addr.landmark}</p>}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-zora-ink)]/10">
                {selectable ? (
                  <Button 
                    onClick={() => onSelectAddress?.(addr)} 
                    className="flex-1"
                    variant={addr.isDefault ? "default" : "outline"}
                  >
                    Deliver Here
                  </Button>
                ) : (
                  <>
                    <button 
                      onClick={() => setEditingAddress(addr)}
                      className="flex items-center gap-1 text-sm font-medium text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(addr.id!)}
                      className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                    {!addr.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(addr.id!)}
                        className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Set Default
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AddressFormProps {
  address: Address | null;
  onCancel: () => void;
  onSave: () => void;
}

function AddressForm({ address, onCancel, onSave }: AddressFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [formData, setFormData] = useState<Address>({
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    landmark: address?.landmark || '',
    isDefault: address ? address.isDefault : true,
    latitude: address?.latitude,
    longitude: address?.longitude,
    formattedAddress: address?.formattedAddress || '',
    placeId: address?.placeId || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const extractAddressComponents = (components: any[]) => {
    let city = '';
    let state = '';
    let pincode = '';

    components.forEach(component => {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (types.includes('postal_code')) {
        pincode = component.long_name;
      }
    });

    return { city, state, pincode };
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await addressService.reverseGeocode(latitude, longitude);
          const { city, state, pincode } = extractAddressComponents(result.address_components);
          
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            formattedAddress: result.formatted_address,
            placeId: result.place_id,
            addressLine1: result.formatted_address.split(',')[0], // Rough approximation
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode
          }));
        } catch (err: any) {
          setError(err.message || 'Failed to get address from location. Please enter manually.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setError('Failed to get your location. Please ensure location permissions are granted.');
        setDetectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      if (address?.id) {
        await addressService.updateAddress(user.uid, address.id, formData);
      } else {
        await addressService.addAddress(user.uid, formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-[var(--color-zora-ink)]/10 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-serif text-[var(--color-zora-ink)]">
          {address ? 'Edit Address' : 'Add New Address'}
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={handleDetectLocation} disabled={detectingLocation}>
          {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
          {detectingLocation ? 'Detecting...' : 'Detect Location'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Phone Number *</label>
            <input
              type="tel"
              inputMode="numeric"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Address Line 1 *</label>
          <input
            type="text"
            name="addressLine1"
            required
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            placeholder="Street address, P.O. box, company name, c/o"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">City *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">State *</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">PIN Code *</label>
            <input
              type="text"
              inputMode="numeric"
              name="pincode"
              required
              value={formData.pincode}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Landmark</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            placeholder="E.g. Near Apollo Hospital"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-5 w-5 rounded border-[var(--color-zora-ink)]/20 text-[var(--color-zora-ink)] focus:ring-[var(--color-zora-ink)]"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-[var(--color-zora-ink)]">
            Make this my default address
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[var(--color-zora-ink)]/10">
          <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? 'Saving...' : 'Save Address'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1 md:flex-none">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
