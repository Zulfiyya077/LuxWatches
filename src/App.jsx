import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { UserProvider, useUser } from "./components/UserContext";
import ThankYou from "./Pages/ThankYou/ThankYou";
import NotFound from "./Pages/NotFound/NotFound";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Wishlist from "./Wishlist/MyWishlist";
import { CartProvider } from "react-use-cart";

// Admin e-poçt ünvanı
const ADMIN_EMAIL = "mammadli.zulfiyya77@gmail.com";

// Admin səhifələri üçün qorunan marşrut komponenti
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    // Giriş etməmiş istifadəçiləri login səhifəsinə yönləndir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.email !== ADMIN_EMAIL) {
    // Admin olmayan istifadəçiləri ana səhifəyə yönləndir
    return <Navigate to="/" replace />;
  }

  // İstifadəçi həm giriş edib, həm də admindirsə, uşaq komponentlərini göstər
  return children;
};

// Ümumi qorunan marşrut komponenti (giriş tələb edir)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    // Giriş etməmiş istifadəçiləri login səhifəsinə yönləndir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // İstifadəçi giriş edibsə, uşaq komponentlərini göstər
  return children;
};

// Əsas App komponentinin içərisində marşrutları idarə edən komponent
const AppRoutes = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return <div>Loading...</div>;
  }

  const { theme } = themeContext;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={theme === "dark" ? styles.darkMode : styles.lightMode}>
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
              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/faqs" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin marşrutu - yalnız admin istifadəçilər üçün */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              } />
              
              {/* Qorunan marşrutlar - yalnız giriş etmiş istifadəçilər üçün */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/thankyou" element={
                <ProtectedRoute>
                  <ThankYou />
                </ProtectedRoute>
              } />
              
              {/* 404 səhifəsi */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Add ToastContainer for React Toastify */}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === "dark" ? "dark" : "light"}
          />
        </>
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <UserProvider>
        <I18nextProvider i18n={i18n}>
          <AppRoutes />
        </I18nextProvider>
      </UserProvider>
    </CartProvider>
  );
};

export default App;