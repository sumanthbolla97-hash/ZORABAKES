import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addressService, Address } from "../services/addressService";
import { orderService } from "../services/orderService";
import { Button } from "@/components/ui/Button";
import { MapPin, CheckCircle2 } from "lucide-react";

export function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, deliveryCharge, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate("/cart");
      return;
    }

    const fetchAddresses = async () => {
      if (user) {
        try {
          const userAddresses = await addressService.getAddresses(user.uid);
          setAddresses(userAddresses);
          
          const defaultAddr = userAddresses.find(a => a.isDefault);
          if (defaultAddr && defaultAddr.id) {
            setSelectedAddressId(defaultAddr.id);
          } else if (userAddresses.length > 0 && userAddresses[0].id) {
            setSelectedAddressId(userAddresses[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAddresses();
  }, [user, items.length, navigate, orderSuccess]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) return;

    setPlacingOrder(true);
    try {
      const userEmail = user.email || 'Unknown';
      await orderService.createOrder(
        user.uid,
        userEmail,
        items,
        total,
        selectedAddress,
        'COD'
      );
      
      clearCart();
      setOrderSuccess(true);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      alert(error.message || "There was an error placing your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-6 py-24 text-center md:px-12">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-24 w-24 text-emerald-500" />
        </div>
        <h1 className="mb-6 font-serif text-5xl font-bold text-[var(--color-zora-ink)]">Order Confirmed!</h1>
        <p className="mb-10 text-lg font-medium text-[var(--color-zora-stone)]">
          Your sweet treats are on their way. You will pay on delivery.
        </p>
        <Button size="lg" onClick={() => navigate("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 md:px-12 md:py-24">
      <h1 className="mb-12 font-serif text-5xl font-bold text-[var(--color-zora-ink)] md:text-6xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
        {/* Left Column: Address Selection */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-zora-ink)] mb-6">Delivery Address</h2>
            
            {loading ? (
              <p className="text-[var(--color-zora-stone)]">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="mb-4 text-[var(--color-zora-stone)]">You don't have any saved addresses.</p>
                <Button onClick={() => navigate("/profile")}>Add Address in Profile</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div 
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id!)}
                    className={`cursor-pointer border-2 rounded-2xl p-6 transition-all ${
                      selectedAddressId === address.id 
                        ? 'border-[var(--color-zora-ink)] bg-[var(--color-zora-blush)]/30' 
                        : 'border-[var(--color-zora-ink)]/10 hover:border-[var(--color-zora-ink)]/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`h-5 w-5 mt-0.5 ${selectedAddressId === address.id ? 'text-[var(--color-zora-ink)]' : 'text-[var(--color-zora-stone)]'}`} />
                      <div>
                        <p className="font-bold text-[var(--color-zora-ink)]">{address.fullName}</p>
                        <p className="text-sm text-[var(--color-zora-stone)] mt-1">{address.addressLine1}</p>
                        {address.addressLine2 && <p className="text-sm text-[var(--color-zora-stone)]">{address.addressLine2}</p>}
                        <p className="text-sm text-[var(--color-zora-stone)]">{address.city}, {address.state} {address.pincode}</p>
                        <p className="text-sm text-[var(--color-zora-stone)] mt-2">Phone: {address.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-zora-ink)] mb-6">Payment Method</h2>
            <div className="border-2 border-[var(--color-zora-ink)] bg-[var(--color-zora-blush)]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-4 border-[var(--color-zora-ink)] bg-white"></div>
                <p className="font-bold text-[var(--color-zora-ink)]">Cash on Delivery (COD)</p>
              </div>
              <p className="text-sm text-[var(--color-zora-stone)] mt-2 ml-8">Pay with cash when your order is delivered.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 sticky top-32">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-zora-ink)] mb-8">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-8 border-b border-[var(--color-zora-ink)]/10 pb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-zora-stone)]">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-[var(--color-zora-ink)]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium text-[var(--color-zora-stone)] mb-8 border-b border-[var(--color-zora-ink)]/10 pb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">Total</span>
              <span className="font-serif text-3xl font-bold text-[var(--color-zora-ink)]">${total.toFixed(2)}</span>
            </div>
            
            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handlePlaceOrder}
              disabled={placingOrder || addresses.length === 0 || !selectedAddressId}
            >
              {placingOrder ? "Placing Order..." : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
