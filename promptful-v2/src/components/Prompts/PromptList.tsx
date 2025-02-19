import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
    FiPlus,
    FiTrash2,
    FiEdit2,
    FiCopy,
    FiCheck,
    FiUpload,
    FiDownload,
    FiSettings,
    FiSearch,
} from 'react-icons/fi';
import { Button } from '../UI/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, DefaultTheme } from 'styled-components';
import { toast } from 'react-hot-toast';
import { usePromptsStore } from '../../store/promptsStore';
import PromptModal from './PromptModal';
import { Theme } from '../styles/theme';

interface Prompt {
    id: string;
    title: string;
    content: string;
    aiModels: string[];
    category: string;
    variables: string[];
    usageCount: number;
}

interface PromptListProps {
    prompts: Prompt[];
    onNewPrompt?: () => void;
    onEditPrompt?: (id: string) => void;
    onDeletePrompt?: (id: string) => void;
    onCopyPrompt?: (id: string, variables: Record<string, string>) => void;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
`;

const PromptGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
`;

const PromptCard = React.memo(
    ({
        prompt,
        onEdit,
        onDelete,
        onCopy,
    }: {
        prompt: Prompt;
        onEdit: (id: string) => void;
        onDelete: (id: string) => void;
        onCopy: (prompt: Prompt) => void;
    }) => {
        const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
        const deleteTimeoutRef = useRef<NodeJS.Timeout>();

        const handleCopyClick = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (prompt.variables.length > 0) {
                onCopy(prompt);
            } else {
                try {
                    await navigator.clipboard.writeText(prompt.content);
                    const previewText =
                        prompt.content.length > 50
                            ? prompt.content.substring(0, 50) + '...'
                            : prompt.content;
                    toast.success(`Copied: ${previewText}`);
                } catch (error) {
                    toast.error('Failed to copy prompt');
                    console.error('Copy failed:', error);
                }
            }
        };

        // Handle delete click with confirmation
        const handleDeleteClick = () => {
            if (isConfirmingDelete) {
                onDelete(prompt.id);
                setIsConfirmingDelete(false);
                if (deleteTimeoutRef.current) {
                    clearTimeout(deleteTimeoutRef.current);
                }
            } else {
                setIsConfirmingDelete(true);
                deleteTimeoutRef.current = setTimeout(() => {
                    setIsConfirmingDelete(false);
                }, 2000); // Reset after 2 seconds
            }
        };

        // Clear timeout on unmount
        useEffect(() => {
            return () => {
                if (deleteTimeoutRef.current) {
                    clearTimeout(deleteTimeoutRef.current);
                }
            };
        }, []);

        return (
            <StyledPromptCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <PromptHeader>
                    <PromptTitle>{prompt.title}</PromptTitle>
                    <CategoryBadge>{prompt.category}</CategoryBadge>
                </PromptHeader>
                <AIModelList>
                    {prompt.aiModels.map((model) => (
                        <AIModelChip key={model}>{model}</AIModelChip>
                    ))}
                </AIModelList>
                <PromptContent>{prompt.content}</PromptContent>
                <ActionButtons>
                    <IconButton
                        variant="ghost"
                        onClick={() => onEdit(prompt.id)}
                        leftIcon={<FiEdit2 />}
                        aria-label="Edit prompt"
                    />
                    <DeleteButton
                        variant="ghost"
                        onClick={handleDeleteClick}
                        leftIcon={<FiTrash2 />}
                        aria-label={
                            isConfirmingDelete ? 'Click again to confirm delete' : 'Delete prompt'
                        }
                        isConfirming={isConfirmingDelete}
                    />
                    <Button variant="primary" onClick={handleCopyClick} leftIcon={<FiCopy />}>
                        {prompt.variables.length > 0 ? 'Fill Variables' : 'Copy'}
                    </Button>
                </ActionButtons>
            </StyledPromptCard>
        );
    }
);

const StyledPromptCard = styled(motion.div)`
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.secondary};
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.2s ease;
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.border.primary};
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: ${({ theme }) => theme.primary};
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &::before {
            opacity: 1;
        }
    }
`;

const PromptHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const PromptTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
`;

const PromptContent = styled.pre`
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text.secondary};
    margin: 1rem 0;
    padding: 1rem;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.tertiary};
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 150px;
    overflow-y: auto;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CategoryBadge = styled.span`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${({ theme }) => `${theme.primary}22`};
    color: ${({ theme }) => theme.primary};
`;

const AIModelList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
`;

const AIModelChip = styled.div`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.tertiary};
    color: ${({ theme }) => theme.text.secondary};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 1rem;
`;

const IconButton = styled(Button)`
    padding: 0.5rem;
    min-width: 2rem;
    height: 2rem;
`;

const NewPromptButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.5rem;

    svg {
        width: 1.25rem;
        height: 1.25rem;
    }
`;

const VariableOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const VariableForm = styled(motion.form)`
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.primary};
    border-radius: 12px;
    padding: 1.5rem;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const VariableTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
`;

const VariableDescription = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: 1rem;
`;

const VariablePreview = styled.pre`
    max-height: 150px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.tertiary};
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
`;

const VariableInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: ${({ theme }) => theme.text.primary};
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    textarea {
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid ${({ theme }) => theme.border.primary};
        background: ${({ theme }) => theme.background.primary};
        color: ${({ theme }) => theme.text.primary};
        font-size: 1rem;
        width: 100%;
        font-family: 'Fira Code', monospace;
        min-height: 2.5rem;
        max-height: 50vh;
        resize: vertical;
        overflow-y: auto;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;

        &:focus {
            outline: none;
            border-color: ${({ theme }) => theme.primary};
            box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
        }

        &::placeholder {
            color: ${({ theme }) => theme.text.tertiary};
        }
    }
`;

const Select = styled.select`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border.primary};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 1rem;
    width: 100%;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
`;

const FileInput = styled.input`
    display: none;
`;

const SettingsDropdown = styled.div`
    position: relative;
    display: inline-block;
`;

const SettingsButton = styled(Button)`
    padding: 0.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 1.25rem;
        height: 1.25rem;
    }
`;

const SettingsMenu = styled(motion.div)`
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.background.primary};
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.border.primary};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 1000;
`;

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    color: ${({ theme }) => theme.text.primary};
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: ${({ theme }: { theme: DefaultTheme }) => theme.background.secondary};
    }

    &.danger {
        color: ${({ theme }) => theme.error};
    }
`;

const MenuDivider = styled.div`
    height: 1px;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.border.primary};
    margin: 0.5rem 0;
`;

const MenuCategory = styled.div`
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.text.tertiary};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const exportToCSV = (prompts: Prompt[]) => {
    const headers = ['Name,Prompt,'];
    const rows = prompts.map((prompt) => {
        // Properly escape quotes and handle multiline content
        const escapedTitle = prompt.title.replace(/"/g, '""');
        const escapedContent = prompt.content.replace(/"/g, '""');

        return `"${escapedTitle}","${escapedContent}",`;
    });

    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'prompts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Custom CSV parser that correctly handles quoted fields with commas and newlines.
const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentField = '';
    let inQuotes = false;
    let currentRow: string[] = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                currentField += '"';
                i++; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // Handle both \n and \r\n
            if (char === '\r' && text[i + 1] === '\n') {
                i++;
            }
            currentRow.push(currentField);
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    // Add the last field/row if any
    currentRow.push(currentField);
    if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
    }
    return rows;
};

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 400px;
    margin-bottom: 1rem;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border.primary};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
    }

    &::placeholder {
        color: ${({ theme }) => theme.text.tertiary};
    }
`;

const SearchIcon = styled(FiSearch)`
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.text.tertiary};
    width: 1rem;
    height: 1rem;
`;

// Add this styled component for the delete button
const DeleteButton = styled(IconButton)<{ isConfirming: boolean }>`
    color: ${({ isConfirming, theme }) => (isConfirming ? theme.error : theme.text.primary)};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.error};
    }
`;

// Update the parseChoices function
const parseChoices = (variable: string): string[] | null => {
    const match = variable.match(/\[(.*?)\]/);
    if (match) {
        return match[1]
            .split(':|:')
            .map((choice) => choice.trim())
            .filter(Boolean);
    }
    return null;
};

// Add new styled components for multi-select
const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: ${({ theme }) => theme.background.secondary};
    border-radius: 8px;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background: ${({ theme }) => theme.background.tertiary};
    }
`;

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

export const PromptList: React.FC = React.memo(() => {
    const {
        prompts,
        addPrompt,
        addPrompts,
        deletePrompt,
        updatePrompt,
        deleteAll,
        incrementUsage,
    } = usePromptsStore();
    const [selectedPrompt, setSelectedPrompt] = React.useState<Prompt | null>(null);
    const [variables, setVariables] = React.useState<Record<string, string>>({});
    const theme = useTheme();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isNewPromptModalOpen, setIsNewPromptModalOpen] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const settingsDropdownRef = useRef<HTMLDivElement>(null);

    const filteredPrompts = React.useMemo(() => {
        const query = searchQuery.toLowerCase();
        return prompts
            .filter(
                (prompt) =>
                    prompt.title.toLowerCase().includes(query) ||
                    prompt.content.toLowerCase().includes(query) ||
                    prompt.category.toLowerCase().includes(query) ||
                    prompt.aiModels.some((model) => model.toLowerCase().includes(query))
            )
            .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    }, [prompts, searchQuery]);

    const handleCopyClick = React.useCallback(
        async (prompt: Prompt) => {
            try {
                incrementUsage(prompt.id);
                if (prompt.variables && prompt.variables.length > 0) {
                    setSelectedPrompt(prompt);
                    setVariables(
                        prompt.variables.reduce((acc, variable) => ({ ...acc, [variable]: '' }), {})
                    );
                } else {
                    await navigator.clipboard.writeText(prompt.content);
                    const previewText =
                        prompt.content.length > 50
                            ? prompt.content.substring(0, 50) + '...'
                            : prompt.content;
                    toast.success(`Copied: ${previewText}`);
                }
            } catch (error) {
                toast.error('Failed to copy prompt');
                console.error('Copy failed:', error);
            }
        },
        [incrementUsage]
    );

    const handleVariableSubmit = React.useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!selectedPrompt) return;

            try {
                incrementUsage(selectedPrompt.id);
                const finalContent = selectedPrompt.content.replace(
                    /\{([^}]+)\}/g,
                    (_, variable) => {
                        const value = variables[variable];
                        // Skip empty values and keep the original variable placeholder
                        if (!value || value.trim() === '') {
                            return `{${variable}}`;
                        }
                        return value;
                    }
                );

                await navigator.clipboard.writeText(finalContent);
                const previewText =
                    finalContent.length > 50 ? finalContent.substring(0, 50) + '...' : finalContent;
                toast.success(`Copied: ${previewText}`);
                setSelectedPrompt(null);
                setVariables({});
            } catch (error) {
                toast.error('Failed to copy prompt');
                console.error('Copy failed:', error);
            }
        },
        [selectedPrompt, variables, incrementUsage]
    );

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsedRows = parseCSV(text);
                if (parsedRows.length < 2) {
                    toast.error('No data found in CSV');
                    return;
                }
                // Assume first row is header (e.g., ["Name", "Prompt", ""]) and skip it.
                const importedPrompts = parsedRows.slice(1).map((row) => {
                    const title = row[0] ? row[0].trim() : '';
                    const content = row[1] ? row[1].trim() : '';
                    const variables = Array.from(content.matchAll(/\{([^}]+)\}/g)).map((m) => m[1]);
                    return {
                        title,
                        content,
                        aiModels: ['ChatGPT'],
                        category: 'Imported',
                        variables,
                        usageCount: 0,
                    };
                });

                // Filter out any malformed entries (e.g., header row duplicates)
                const validPrompts = importedPrompts.filter(
                    (prompt) =>
                        prompt.title &&
                        prompt.content &&
                        prompt.title !== 'Name' &&
                        prompt.content !== 'Prompt'
                );

                if (validPrompts.length > 0) {
                    addPrompts(validPrompts);
                    toast.success(`Successfully imported ${validPrompts.length} prompts`);
                } else {
                    toast.error('No valid prompts found in the CSV file');
                }
            } catch (error) {
                console.error('Failed to import CSV:', error);
                toast.error('Failed to import CSV file');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleEditPrompt = (id: string) => {
        const prompt = prompts.find((p) => p.id === id);
        if (prompt) {
            setEditingPrompt(prompt);
            setIsNewPromptModalOpen(true);
        }
    };

    const handleDeletePrompt = (id: string) => {
        deletePrompt(id);
    };

    const handleSubmitPrompt = (data: Omit<Prompt, 'id'>) => {
        if (editingPrompt) {
            updatePrompt(editingPrompt.id, data);
            setEditingPrompt(null);
        } else {
            addPrompt(data);
        }
        setIsNewPromptModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsNewPromptModalOpen(false);
        setEditingPrompt(null);
    };

    const handleDeleteAll = () => {
        deleteAll();
        setShowDeleteAllModal(false);
        toast.success('All prompts deleted');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                settingsDropdownRef.current &&
                !settingsDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSettingsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Container>
                <Header>
                    <Title>All Prompts</Title>
                    <HeaderActions>
                        <FileInput
                            type="file"
                            ref={fileInputRef}
                            accept=".csv"
                            onChange={handleImportCSV}
                        />
                        <NewPromptButton
                            variant="primary"
                            onClick={() => setIsNewPromptModalOpen(true)}
                            leftIcon={<FiPlus />}
                        >
                            New Prompt
                        </NewPromptButton>
                        <SettingsDropdown ref={settingsDropdownRef}>
                            <SettingsButton
                                variant="ghost"
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                leftIcon={<FiSettings />}
                                aria-label="Settings"
                            />
                            <AnimatePresence>
                                {showSettingsMenu && (
                                    <SettingsMenu
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <MenuCategory>File</MenuCategory>
                                        <MenuItem onClick={() => fileInputRef.current?.click()}>
                                            <FiDownload /> Import from CSV
                                        </MenuItem>
                                        <MenuItem onClick={() => exportToCSV(prompts)}>
                                            <FiUpload /> Export to CSV
                                        </MenuItem>
                                        <MenuDivider />

                                        <MenuCategory>Danger Zone</MenuCategory>
                                        <MenuItem
                                            className="danger"
                                            onClick={() => setShowDeleteAllModal(true)}
                                        >
                                            <FiTrash2 /> Delete All Prompts
                                        </MenuItem>
                                    </SettingsMenu>
                                )}
                            </AnimatePresence>
                        </SettingsDropdown>
                    </HeaderActions>
                </Header>

                <SearchContainer>
                    <SearchIcon />
                    <SearchInput
                        type="text"
                        placeholder="Search prompts by title, content, category, or AI model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchContainer>

                <PromptGrid>
                    {filteredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onEdit={handleEditPrompt}
                            onDelete={handleDeletePrompt}
                            onCopy={handleCopyClick}
                        />
                    ))}
                </PromptGrid>

                {filteredPrompts.length === 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: theme.text.secondary,
                        }}
                    >
                        No prompts found matching your search.
                    </div>
                )}
            </Container>

            <AnimatePresence>
                {selectedPrompt && (
                    <VariableOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPrompt(null)}
                    >
                        <VariableForm
                            onSubmit={handleVariableSubmit}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div>
                                <VariableTitle>Enter Variable Values</VariableTitle>
                                <VariableDescription>
                                    Fill in the values for each variable in your prompt.
                                </VariableDescription>
                            </div>

                            {selectedPrompt.variables.map((variable) => {
                                const choices = parseChoices(variable);
                                return (
                                    <VariableInput key={variable}>
                                        <label htmlFor={variable}>
                                            {choices
                                                ? variable.replace(/\[.*\]/, '').trim()
                                                : variable}
                                            <span style={{ color: theme.text.tertiary }}>
                                                {choices ? ' (Select options)' : `{${variable}}`}
                                            </span>
                                        </label>
                                        {choices ? (
                                            <CheckboxContainer>
                                                {choices.map((choice) => (
                                                    <CheckboxLabel key={choice}>
                                                        <Checkbox
                                                            type="checkbox"
                                                            checked={
                                                                variables[variable]?.includes(
                                                                    choice
                                                                ) ?? false
                                                            }
                                                            onChange={(e) => {
                                                                const currentValues =
                                                                    variables[variable]?.split(
                                                                        ','
                                                                    ) || [];
                                                                let newValues;
                                                                if (e.target.checked) {
                                                                    newValues = [
                                                                        ...currentValues,
                                                                        choice,
                                                                    ];
                                                                } else {
                                                                    newValues =
                                                                        currentValues.filter(
                                                                            (v) => v !== choice
                                                                        );
                                                                }
                                                                setVariables((prev) => ({
                                                                    ...prev,
                                                                    [variable]: newValues.join(','),
                                                                }));
                                                            }}
                                                        />
                                                        {choice}
                                                    </CheckboxLabel>
                                                ))}
                                            </CheckboxContainer>
                                        ) : (
                                            <textarea
                                                id={variable}
                                                value={variables[variable] || ''}
                                                onChange={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                    setVariables((prev) => ({
                                                        ...prev,
                                                        [variable]: e.target.value,
                                                    }));
                                                }}
                                                placeholder={`Enter value for ${variable}`}
                                                required
                                                autoComplete="off"
                                                spellCheck="false"
                                                rows={1}
                                            />
                                        )}
                                    </VariableInput>
                                );
                            })}

                            <VariablePreview>
                                {selectedPrompt.content.replace(/\{([^}]+)\}/g, (_, variable) =>
                                    variables[variable] ? variables[variable] : `{${variable}}`
                                )}
                            </VariablePreview>

                            <ButtonGroup>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setSelectedPrompt(null)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Copy with Variables
                                </Button>
                            </ButtonGroup>
                        </VariableForm>
                    </VariableOverlay>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteAllModal && (
                    <VariableOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDeleteAllModal(false)}
                    >
                        <VariableForm
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div>
                                <VariableTitle>Delete All Prompts</VariableTitle>
                                <VariableDescription>
                                    Are you sure you want to delete all prompts? This action cannot
                                    be undone.
                                </VariableDescription>
                            </div>

                            <ButtonGroup>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowDeleteAllModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="button" variant="danger" onClick={handleDeleteAll}>
                                    Delete All
                                </Button>
                            </ButtonGroup>
                        </VariableForm>
                    </VariableOverlay>
                )}
            </AnimatePresence>

            <PromptModal
                isOpen={isNewPromptModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitPrompt}
                initialData={editingPrompt || undefined}
            />
        </>
    );
});

export default PromptList;
