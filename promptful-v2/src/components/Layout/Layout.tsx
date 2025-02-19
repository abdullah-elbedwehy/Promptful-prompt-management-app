import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.surface};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding: 1rem 0;
    z-index: ${({ theme }) => theme.zIndices.sticky};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
`;

const ThemeToggle = styled(motion.button)`
    background: none;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 0.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.background};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

const Main = styled.main`
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
`;

const Footer = styled.footer`
    background-color: ${({ theme }) => theme.surface};
    border-top: 1px solid ${({ theme }) => theme.border};
    padding: 1.5rem 0;
    text-align: center;
    color: ${({ theme }) => theme.text.secondary};
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <LayoutContainer>
            <Header>
                <HeaderContent>
                    <Logo>Promptful</Logo>
                    <ThemeToggle
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </ThemeToggle>
                </HeaderContent>
            </Header>

            <Main>{children}</Main>

            <Footer>
                <p>© {new Date().getFullYear()} Promptful. All rights reserved.</p>
            </Footer>
        </LayoutContainer>
    );
};

export default Layout;