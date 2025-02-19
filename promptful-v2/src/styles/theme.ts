import { ThemeConfig } from '../types/theme';

export const baseTheme = {
    borderRadius: '8px',
    shadows: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.25rem',
            xl: '1.5rem',
            xxl: '2rem',
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeights: {
            tight: 1.25,
            normal: 1.5,
            loose: 1.75,
        },
    },
    zIndices: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
} as const;

export const lightTheme: ThemeConfig = {
    primary: '#6366F1',
    secondary: '#4F46E5',
    background: {
        primary: '#F3F4F6',
        secondary: '#E5E7EB',
        tertiary: '#D1D5DB',
    },
    text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        tertiary: '#6B7280',
    },
    border: {
        primary: '#D1D5DB',
        secondary: '#9CA3AF',
    },
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
};

export const darkTheme: ThemeConfig = {
    primary: '#818CF8',
    secondary: '#6366F1',
    background: {
        primary: '#111827',
        secondary: '#1F2937',
        tertiary: '#374151',
    },
    text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        tertiary: '#D1D5DB',
    },
    border: {
        primary: '#374151',
        secondary: '#4B5563',
    },
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
};

export const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
} as const;

export const transitions = {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
} as const;

export interface Theme {
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    border: {
        primary: string;
    };
    primary: string;
    error: string;
}

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}
