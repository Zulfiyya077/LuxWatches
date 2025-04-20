import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import PrivateRoute from "./context/PrivateRoute";
import Orders from "./Pages/Orders/Orders";

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

              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

          
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/thankyou"
                element={
                  <PrivateRoute>
                    <ThankYou />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              {/* 404 səhifəsi */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />

          
          <ToastContainer
            position="bottom-right"
            autoClose={2000} // Changed from 5000 to 2000
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false} // Changed from true to false
            draggable
            pauseOnHover={false} // Changed from true to false
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