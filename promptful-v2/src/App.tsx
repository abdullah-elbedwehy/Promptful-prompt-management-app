import React from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { FiMoon, FiSun } from 'react-icons/fi';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import PromptList from './components/Prompts/PromptList';
import PromptModal from './components/Prompts/PromptModal';
import { Button } from './components/UI/Button';

const AppContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    padding: 1rem;
    background: ${({ theme }) => theme.background.secondary};
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const HeaderContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
`;

const Main = styled.main`
    flex: 1;
    background: ${({ theme }) => theme.background.primary};
`;

interface Prompt {
    id: string;
    title: string;
    content: string;
    aiModels: string[];
    category: string;
    variables: string[];
}

const AppContent = () => {
    const { theme, toggleTheme, themeConfig } = useTheme();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingPrompt, setEditingPrompt] = React.useState<Prompt | null>(null);
    const [prompts, setPrompts] = React.useState<Prompt[]>([
        {
            id: '1',
            title: 'Football Commentator',
            content: 'Act as a football commentator for the match between {team1} and {team2}.',
            aiModels: ['ChatGPT', 'Claude'],
            category: 'Fun',
            variables: ['team1', 'team2'],
        },
        {
            id: '2',
            title: 'JavaScript Console',
            content:
                'I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show.',
            aiModels: ['ChatGPT'],
            category: 'Coding',
            variables: [],
        },
    ]);

    const handleNewPrompt = () => {
        setEditingPrompt(null);
        setIsModalOpen(true);
    };

    const handleEditPrompt = (id: string) => {
        const promptToEdit = prompts.find((p) => p.id === id);
        if (promptToEdit) {
            setEditingPrompt(promptToEdit);
            setIsModalOpen(true);
        }
    };

    const handleDeletePrompt = (id: string) => {
        setPrompts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleSubmitPrompt = (data: {
        title: string;
        content: string;
        aiModels: string[];
        category: string;
        variables: string[];
    }) => {
        if (editingPrompt) {
            setPrompts((prev) =>
                prev.map((p) => (p.id === editingPrompt.id ? { ...data, id: editingPrompt.id } : p))
            );
        } else {
            setPrompts((prev) => [
                ...prev,
                {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                },
            ]);
        }
        setIsModalOpen(false);
        setEditingPrompt(null);
    };

    const handleCopyPrompt = (id: string, variables: Record<string, string>) => {
        const prompt = prompts.find((p) => p.id === id);
        if (prompt) {
            let content = prompt.content;
            Object.entries(variables).forEach(([key, value]) => {
                content = content.replace(new RegExp(`{${key}}`, 'g'), value);
            });
            navigator.clipboard.writeText(content);
        }
    };

    return (
        <AppContainer>
            <Header>
                <HeaderContent>
                    <Logo>Promptful</Logo>
                    <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        leftIcon={theme === 'dark' ? <FiSun /> : <FiMoon />}
                    >
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </HeaderContent>
            </Header>
            <Main>
                <PromptList
                    prompts={prompts}
                    onNewPrompt={handleNewPrompt}
                    onEditPrompt={handleEditPrompt}
                    onDeletePrompt={handleDeletePrompt}
                    onCopyPrompt={handleCopyPrompt}
                />
                <PromptModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingPrompt || undefined}
                    onSubmit={handleSubmitPrompt}
                />
            </Main>
        </AppContainer>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <GlobalStyles />
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
