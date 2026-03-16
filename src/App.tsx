/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"; // Changed import
import { Navbar } from "./components/Navbar"; // New Navbar (top header)
import { BottomNavbar } from "./components/BottomNavbar"; // New BottomNavbar (mobile-only)
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Profile } from "./pages/Profile";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminRoute } from "./components/AdminRoute"; // Assuming you have an AdminRoute component
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MobileCartButton } from "./components/MobileCartButton"; // We'll remove this later, but keep for now if it's in use

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen"> {/* Added flex container for sticky footer if needed */}
            <Navbar /> {/* Top Header */}
            <main className="flex-grow"> {/* Main content area */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="checkout" element={<Checkout />} />
                </Route>
                <Route element={<AdminRoute />}> {/* Admin routes protected by AdminRoute */}
                  <Route path="admin/orders" element={<AdminOrders />} />
                  <Route path="admin/products" element={<AdminProducts />} />
                  <Route path="admin/inventory" element={<AdminInventory />} />
                </Route>
              </Routes>
            </main>
            <BottomNavbar /> {/* Mobile-only Bottom Navigation */}
            {/* The MobileCartButton is now redundant with BottomNavbar, so it can be removed */}
            {/* <MobileCartButton /> */}
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
