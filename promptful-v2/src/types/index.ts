export interface Prompt {
    id: number;
    promptName: string;
    aiSelection: string[];
    promptContent: string;
    createdAt: string;
    updatedAt: string;
}

export interface VariableInput {
    name: string;
    value: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
        primary: string;
        secondary: string;
    };
    border: string;
    error: string;
    success: string;
}

export interface ThemeConfig extends ThemeColors {
    borderRadius: string;
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
    typography: {
        fontFamily: string;
        fontSizes: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
        };
        fontWeights: {
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
        lineHeights: {
            tight: number;
            normal: number;
            loose: number;
        };
    };
    zIndices: {
        base: number;
        dropdown: number;
        sticky: number;
        fixed: number;
        modalBackdrop: number;
        modal: number;
        popover: number;
        tooltip: number;
    };
}

// Separate store state since theme is managed by context
export interface StoreState {
    prompts: Prompt[];
    searchTerm: string;
    aiFilter: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export type SortOption = 'name' | 'date' | 'ai';
export type SortDirection = 'asc' | 'desc';

export interface PromptFormData {
    promptName: string;
    aiSelection: string[];
    promptContent: string;
}