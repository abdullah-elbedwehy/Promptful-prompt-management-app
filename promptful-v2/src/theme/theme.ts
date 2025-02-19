import { ThemeConfig } from '../types/theme';

export const lightTheme: ThemeConfig = {
    primary: '#0066FF',
    secondary: '#6B7280',
    background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
    },
    text: {
        primary: '#111827',
        secondary: '#4B5563',
        tertiary: '#9CA3AF',
    },
    border: {
        primary: '#E5E7EB',
        secondary: '#D1D5DB',
    },
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#2563EB',
};

export const darkTheme: ThemeConfig = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: {
        primary: '#111827',
        secondary: '#1F2937',
        tertiary: '#374151',
    },
    text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        tertiary: '#9CA3AF',
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
