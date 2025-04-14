// main.jsx (updated)
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import { CartProvider } from "react-use-cart";
import { WishlistProvider } from "react-use-wishlist";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CouponProvider } from "./context/CouponContext.jsx"; // Add this

createRoot(document.getElementById("root")).render(
  <WishlistProvider>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CouponProvider> {/* Add this */}
            <App />
          </CouponProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </WishlistProvider>
);