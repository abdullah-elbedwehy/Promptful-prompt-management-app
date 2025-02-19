import { createGlobalStyle } from 'styled-components';
import { Theme, ThemeConfig } from '../types/theme';

interface GlobalStylesProps {
    theme: ThemeConfig;
    currentTheme: Theme;
}

export const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        font-size: 16px;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background: ${({ theme }) => theme.background.primary};
        color: ${({ theme }) => theme.text.primary};
        line-height: 1.5;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    button {
        font-family: inherit;
    }

    pre, code {
        font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.background.secondary};
    }

    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.background.tertiary};
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.text.tertiary};
    }

    /* Selection */
    ::selection {
        background: ${({ theme }) => `${theme.primary}33`};
        color: ${({ theme }) => theme.primary};
    }

    /* Focus outline */
    :focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: 2px;
    }

    /* Loading animation */
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading {
        animation: spin 1s linear infinite;
    }
`;
