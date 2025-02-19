export type Theme = 'light' | 'dark';

export interface ThemeColors {
    primary: string;
    secondary: string;
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
        secondary: string;
    };
    error: string;
    success: string;
    warning: string;
    info: string;
}

export type ThemeConfig = ThemeColors;
