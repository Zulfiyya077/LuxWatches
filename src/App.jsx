import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import i18n from "./i18n/i18n";
import Home from "./Pages/Home/Home";
import FAQ from "./Pages/FAQ/FAQ";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import AboutPage from "./Pages/About/About";
import Products from "./Pages/Products/Products";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Blog from "./Pages/Blog/Blog";
import BlogDetails from "./Pages/BlogDetails/BlogDetails";
import CartPage from "./Pages/CartPage/CartPage";
import CheckoutPage from "./Pages/CheckOut/CheckOut";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { I18nextProvider } from "react-i18next";
import { ThemeContext } from "./context/ThemeContext";
import { UserProvider } from "./components/UserContext";
import ThankYou from "./Pages/ThankYou/ThankYou";
import NotFound from "./Pages/NotFound/NotFound";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Wishlist from "./Wishlist/MyWishlist";
import { CartProvider } from "react-use-cart";

const App = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return <div>Loading...</div>;
  }

  const { theme } = themeContext;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <CartProvider>
      <UserProvider>
        <div className={theme === "dark" ? styles.darkMode : styles.lightMode}>
          <I18nextProvider i18n={i18n}>
            <Router>
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/products/:id" element={<SingleProduct />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<Wishlist />} />
                    <Route path="/faqs" element={<FAQ />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetails />} />
                    <Route path="/thankyou" element={<ThankYou />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            </Router>
          </I18nextProvider>
        </div>
      </UserProvider>
    </CartProvider>
  );
};

export default App;
