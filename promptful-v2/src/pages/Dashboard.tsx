import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import PromptCard from '../components/Prompts/PromptCard';
import { promptsApi } from '../api/client';
import { useStore } from '../store';
import { SortOption, SortDirection, Prompt } from '../types';

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.text.primary};
`;

const Controls = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
`;

const SearchBar = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
`;

const Select = styled.select`
    padding: 0.625rem;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    background-color: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text.primary};
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
    }
`;

const PromptsGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: ${({ theme }) => theme.text.secondary};
`;

const filterAndSortPrompts = (
    prompts: Prompt[],
    searchTerm: string,
    aiFilter: string | null,
    sortOption: SortOption,
    sortDirection: SortDirection
): Prompt[] => {
    let filteredPrompts = [...prompts];

    // Apply search filter
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredPrompts = filteredPrompts.filter(
            prompt => 
                prompt.promptName.toLowerCase().includes(searchLower) ||
                prompt.promptContent.toLowerCase().includes(searchLower)
        );
    }

    // Apply AI filter
    if (aiFilter) {
        filteredPrompts = filteredPrompts.filter(
            prompt => prompt.aiSelection.includes(aiFilter)
        );
    }

    // Apply sorting
    filteredPrompts.sort((a, b) => {
        let comparison = 0;
        switch (sortOption) {
            case 'name':
                comparison = a.promptName.localeCompare(b.promptName);
                break;
            case 'date':
                comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                break;
            case 'ai':
                comparison = (a.aiSelection[0] || '').localeCompare(b.aiSelection[0] || '');
                break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filteredPrompts;
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState<SortOption>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    
    const {
        searchTerm,
        aiFilter,
        setSearchTerm,
        setAiFilter,
    } = useStore();

    const { data: prompts = [], isLoading, error } = useQuery({
        queryKey: ['prompts'],
        queryFn: promptsApi.getAll,
    });

    const filteredPrompts = filterAndSortPrompts(
        prompts,
        searchTerm,
        aiFilter,
        sortOption,
        sortDirection
    );

    const handleSort = (option: SortOption) => {
        if (option === sortOption) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOption(option);
            setSortDirection('asc');
        }
    };

    if (error) {
        return (
            <EmptyState>
                <h3>Error loading prompts</h3>
                <p>{(error as Error).message}</p>
            </EmptyState>
        );
    }

    return (
        <DashboardContainer>
            <Header>
                <Title>My Prompts</Title>
                <Button onClick={() => navigate('/add')}>
                    Add Prompt
                </Button>
            </Header>

            <Controls>
                <SearchBar>
                    <Input
                        placeholder="Search prompts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="filled"
                    />
                    <Select
                        value={aiFilter || ''}
                        onChange={(e) => setAiFilter(e.target.value || null)}
                    >
                        <option value="">All AIs</option>
                        <option value="chatgpt">ChatGPT</option>
                        <option value="claude">Claude</option>
                        <option value="other">Other</option>
                    </Select>
                </SearchBar>

                <Select
                    value={sortOption}
                    onChange={(e) => handleSort(e.target.value as SortOption)}
                >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="ai">AI</option>
                </Select>
            </Controls>

            {isLoading ? (
                <EmptyState>Loading prompts...</EmptyState>
            ) : filteredPrompts.length === 0 ? (
                <EmptyState>
                    <h3>No prompts found</h3>
                    <p>
                        {prompts.length === 0
                            ? 'Create your first prompt by clicking the "Add Prompt" button!'
                            : 'No prompts match your search criteria.'}
                    </p>
                </EmptyState>
            ) : (
                <PromptsGrid
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPrompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                            />
                        ))}
                    </AnimatePresence>
                </PromptsGrid>
            )}
        </DashboardContainer>
    );
};

export default Dashboard;