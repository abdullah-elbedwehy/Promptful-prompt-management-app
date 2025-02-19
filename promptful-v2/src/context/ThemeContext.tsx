import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeConfig } from '../types/theme';
import { lightTheme, darkTheme } from '../styles/theme';
import { GlobalStyles } from '../styles/globalStyles';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const themeConfig = theme === 'light' ? lightTheme : darkTheme;

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeConfig }}>
            <StyledThemeProvider theme={themeConfig}>
                <GlobalStyles theme={themeConfig} currentTheme={theme} />
                {children}
            </StyledThemeProvider>
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

// Custom hook for theme values
export const useThemeConfig = () => {
    const { themeConfig } = useTheme();
    return themeConfig;
};
