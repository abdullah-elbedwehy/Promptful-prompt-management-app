import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import PromptForm from '../components/Prompts/PromptForm';
import { promptsApi } from '../api/client';
import { PromptFormData, Prompt } from '../types';
import { useStore } from '../store';

const PageContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.text.secondary};
`;

const LoadingState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: ${({ theme }) => theme.text.secondary};
`;

const ErrorState = styled.div`
    text-align: center;
    padding: 2rem;
    color: ${({ theme }) => theme.error};
`;

const EditPrompt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const updatePrompt = useStore(state => state.updatePrompt);

    // Fetch the existing prompt
    const { data: prompt, isLoading, error } = useQuery<Prompt>({
        queryKey: ['prompt', id],
        queryFn: () => promptsApi.getById(Number(id)),
        enabled: !!id,
    });

    // Update mutation
    const mutation = useMutation<Prompt, Error, PromptFormData>({
        mutationFn: (data: PromptFormData) =>
            promptsApi.update(Number(id), data),
        onSuccess: (updatedPrompt) => {
            // Update the cache
            queryClient.setQueryData<Prompt[]>(['prompts'], (old = []) => {
                return old.map(p =>
                    p.id === updatedPrompt.id ? updatedPrompt : p
                );
            });
            
            // Update the individual prompt cache
            queryClient.setQueryData(['prompt', id], updatedPrompt);
            
            // Update local state
            updatePrompt(Number(id), updatedPrompt);
            
            // Navigate back to dashboard
            navigate('/');
        },
    });

    const handleSubmit = async (data: PromptFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (error) {
            console.error('Failed to update prompt:', error);
            // You might want to show an error notification here
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingState>Loading prompt...</LoadingState>
            </PageContainer>
        );
    }

    if (error || !prompt) {
        return (
            <PageContainer>
                <ErrorState>
                    <h2>Error</h2>
                    <p>{error?.message || 'Prompt not found'}</p>
                </ErrorState>
            </PageContainer>
        );
    }

    const initialData: PromptFormData = {
        promptName: prompt.promptName,
        aiSelection: prompt.aiSelection,
        promptContent: prompt.promptContent,
    };

    return (
        <PageContainer>
            <Header>
                <Title>Edit Prompt</Title>
                <Subtitle>
                    Update your prompt or modify its variables using the {'{variable}'} syntax.
                </Subtitle>
            </Header>

            <PromptForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={mutation.isPending}
            />
        </PageContainer>
    );
};

export default EditPrompt;