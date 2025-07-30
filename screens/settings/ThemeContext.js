import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';


const lightTheme = {
  primary: '#FFFFFF',
  secondary: '#FAFAFA',
  text: '#262626',
  textSecondary: '#8E8E8E',
  border: '#DBDBDB',
  button: '#0095F6',
  buttonText: '#FFFFFF',
  notification: '#FF3B30',
  card: '#F7F7F7',
  background: '#FFFFFF',
};

const darkTheme = {
  primary: '#000000',
  secondary: '#121212',
  text: '#FFFFFF',
  textSecondary: '#8E8E8E',
  border: '#262626',
  button: '#0095F6',
  buttonText: '#FFFFFF',
  notification: '#FF3B30',
  card: '#1C1C1C',
  background: '#000000',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system');
  const systemTheme = Appearance.getColorScheme();
  
  const isDark = themeMode === 'system' 
    ? systemTheme === 'dark'
    : themeMode === 'dark';

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        // Update theme if system preference changes
        setThemeMode('system');
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);