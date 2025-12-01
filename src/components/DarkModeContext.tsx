import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  // Always force light mode
  const isDark = false;

  useEffect(() => {
    // Ensure dark mode class is removed
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('darkMode');
  }, []);

  const toggleDarkMode = () => {
    // Disabled
    console.log('Dark mode is disabled for this project');
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
