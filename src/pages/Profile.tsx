import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/Button";
import { logout, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AddressList } from "../components/profile/AddressList";
import { OrderList } from "../components/profile/OrderList";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const { user, userProfile, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPhone(userProfile.phone || "");
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name,
        phone
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 font-serif text-4xl font-bold text-[var(--color-zora-ink)]">My Account</h1>
        
        <div className="flex gap-4 mb-8 border-b border-[var(--color-zora-ink)]/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'text-[var(--color-zora-ink)] border-b-2 border-[var(--color-zora-ink)]' 
                : 'text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'text-[var(--color-zora-ink)] border-b-2 border-[var(--color-zora-ink)]' 
                : 'text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
              activeTab === 'addresses' 
                ? 'text-[var(--color-zora-ink)] border-b-2 border-[var(--color-zora-ink)]' 
                : 'text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]'
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">Personal Details</h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  Edit Profile
                </Button>
              )}
            </div>
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userProfile?.email || user?.email || ""}
                    className="w-full rounded-xl border border-[var(--color-zora-ink)]/10 bg-[var(--color-zora-oat)] px-4 py-3 text-[var(--color-zora-stone)] cursor-not-allowed"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-2">Full Name</h3>
                  <p className="text-lg font-medium text-[var(--color-zora-ink)]">{userProfile?.name || "Not set"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-2">Email</h3>
                  <p className="text-lg font-medium text-[var(--color-zora-ink)]">{userProfile?.email || user?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-2">Phone</h3>
                  <p className="text-lg font-medium text-[var(--color-zora-ink)]">{userProfile?.phone || "Not set"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-2">User ID</h3>
                  <p className="text-sm font-mono text-[var(--color-zora-ink)] bg-[var(--color-zora-oat)] p-3 rounded-xl break-all">
                    {user?.uid}
                  </p>
                </div>

                <div className="pt-8 border-t border-[var(--color-zora-ink)]/10 flex flex-col sm:flex-row gap-4 flex-wrap">
                  <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
                    Log Out
                  </Button>
                  {isAdmin && (
                    <>
                      <Button onClick={() => navigate("/admin/orders")} className="w-full sm:w-auto bg-[var(--color-zora-ink)] text-white">
                        Admin Orders
                      </Button>
                      <Button onClick={() => navigate("/admin/products")} className="w-full sm:w-auto bg-[var(--color-zora-ink)] text-white">
                        Admin Products
                      </Button>
                      <Button onClick={() => navigate("/admin/inventory")} className="w-full sm:w-auto bg-[var(--color-zora-ink)] text-white">
                        Admin Inventory
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <AddressList />
        )}

        {activeTab === 'orders' && (
          <OrderList />
        )}
      </div>
    </div>
  );
}
