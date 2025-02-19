import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

const AddPrompt: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const addPrompt = useStore(state => state.addPrompt);

    const mutation = useMutation<Prompt, Error, PromptFormData>({
        mutationFn: (data: PromptFormData) => promptsApi.create(data),
        onSuccess: (newPrompt) => {
            // Update the cache
            queryClient.setQueryData<Prompt[]>(['prompts'], (old = []) => {
                return [newPrompt, ...old];
            });
            
            // Update local state
            addPrompt(newPrompt);
            
            // Navigate back to dashboard
            navigate('/');
        },
    });

    const handleSubmit = async (data: PromptFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (error) {
            console.error('Failed to create prompt:', error);
            // You might want to show an error notification here
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <PageContainer>
            <Header>
                <Title>Create New Prompt</Title>
                <Subtitle>
                    Add a new prompt with dynamic variables using the {'{variable}'} syntax.
                </Subtitle>
            </Header>

            <PromptForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={mutation.isPending}
            />
        </PageContainer>
    );
};

export default AddPrompt;