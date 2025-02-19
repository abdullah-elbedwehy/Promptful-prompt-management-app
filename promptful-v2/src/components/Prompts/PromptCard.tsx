import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Prompt } from '../../types';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { promptsApi } from '../../api/client';
import { useStore } from '../../store';

interface PromptCardProps {
    prompt: Prompt;
}

const Card = styled(motion.div)`
    background-color: ${({ theme }) => theme.surface};
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.border};
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
`;

const PromptName = styled.h3`
    margin: 0;
    color: ${({ theme }) => theme.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    word-break: break-word;
`;

const AIBadges = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const AIBadge = styled.span`
    background-color: ${({ theme }) => `${theme.primary}22`};
    color: ${({ theme }) => theme.primary};
    padding: 0.25rem 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const Content = styled.p`
    color: ${({ theme }) => theme.text.secondary};
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

const Actions = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
`;

const DeleteModal = styled(Modal)`
    text-align: center;
`;

const DeleteButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
`;

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePrompt = useStore(state => state.deletePrompt);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await promptsApi.delete(prompt.id);
            deletePrompt(prompt.id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete prompt:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopy = async () => {
        try {
            const promptData = await promptsApi.copy(prompt.id);
            await navigator.clipboard.writeText(promptData.promptContent);
            // Show success notification (implement later)
        } catch (error) {
            console.error('Failed to copy prompt:', error);
            // Show error notification (implement later)
        }
    };

    return (
        <>
            <Card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
            >
                <CardHeader>
                    <PromptName>{prompt.promptName}</PromptName>
                    <AIBadges>
                        {prompt.aiSelection.map((ai) => (
                            <AIBadge key={ai}>{ai}</AIBadge>
                        ))}
                    </AIBadges>
                </CardHeader>

                <Content>{prompt.promptContent}</Content>

                <Actions>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={handleCopy}
                    >
                        Copy
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => navigate(`/edit/${prompt.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="small"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete
                    </Button>
                </Actions>
            </Card>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Prompt"
                size="small"
            >
                <p>Are you sure you want to delete this prompt?</p>
                <p>This action cannot be undone.</p>

                <DeleteButtons>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </Button>
                </DeleteButtons>
            </DeleteModal>
        </>
    );
};

export default PromptCard;