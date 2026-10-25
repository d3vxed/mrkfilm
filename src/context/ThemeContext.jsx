import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try { return (localStorage.getItem('theme') || 'dark') === 'dark'; } catch { return true; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('theme', darkMode ? 'dark' : 'light'); } catch { /* storage unavailable */ }
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => !d);
  return <ThemeContext.Provider value={{ darkMode, toggleDark }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
