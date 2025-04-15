
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import { CartProvider } from "react-use-cart";
import { WishlistProvider } from "react-use-wishlist";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CouponProvider } from "./context/CouponContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <CouponProvider>
            <App />
          </CouponProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </ThemeProvider>
);