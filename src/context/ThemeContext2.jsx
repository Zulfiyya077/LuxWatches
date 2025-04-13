import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const isBrowser = typeof window !== "undefined";

  const getInitialTheme = () => {
    if (isBrowser) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");

      if (darkMode) {
        document.documentElement.classList.add("dark-theme");
        document.documentElement.classList.remove("light-theme");
      } else {
        document.documentElement.classList.add("light-theme");
        document.documentElement.classList.remove("dark-theme");
      }
    }
  }, [darkMode, isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e) => {
        if (!localStorage.getItem("theme")) {
          setDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      const root = document.documentElement;

      if (darkMode) {
        root.style.setProperty('--primary-bg', '#121212');
        root.style.setProperty('--secondary-bg', '#1e1e1e');
        root.style.setProperty('--text-primary', '#f5f5f5');
        root.style.setProperty('--text-secondary', '#aaaaaa');
        root.style.setProperty('--accent-color', '#d4af37');
        root.style.setProperty('--accent-hover', '#b8960b');
        root.style.setProperty('--card-shadow', '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)');
      } else {
        root.style.setProperty('--primary-bg', '#f9f9f9');
        root.style.setProperty('--secondary-bg', '#ffffff');
        root.style.setProperty('--text-primary', '#333333');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--accent-color', '#d4af37');
        root.style.setProperty('--accent-hover', '#b8960b');
        root.style.setProperty('--card-shadow', '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(212, 175, 55, 0.15)');
      }
    }
  }, [darkMode, isBrowser]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
