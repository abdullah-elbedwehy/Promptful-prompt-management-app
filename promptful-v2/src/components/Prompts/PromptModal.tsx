import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { Button } from '../UI/Button';
import PromptForm from './PromptForm';

interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        title: string;
        content: string;
        aiModels: string[];
        category: string;
    };
    onSubmit: (data: {
        title: string;
        content: string;
        aiModels: string[];
        category: string;
        variables: string[];
    }) => void;
}

const Overlay = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
    background: ${({ theme }) => theme.background.primary};
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
`;

const CloseButton = styled(Button)`
    padding: 0.5rem;
    min-width: 2rem;
    height: 2rem;
`;

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
}) => {
    const initialFormState = {
        title: '',
        content: '',
        aiModels: ['ChatGPT'],
        category: '',
        variables: [],
    };

    const [formData, setFormData] = useState<FormData>(
        initialData || initialFormState
    );

    const handleSubmit = (data: { title: string; description: string; category: string }) => {
        onSubmit(data);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Overlay
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    onClick={onClose}
                >
                    <ModalContent
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <ModalHeader>
                            <ModalTitle>
                                {initialData ? 'Edit Prompt' : 'Create New Prompt'}
                            </ModalTitle>
                            <CloseButton
                                variant="ghost"
                                onClick={onClose}
                                leftIcon={<FiX />}
                                aria-label="Close modal"
                            />
                        </ModalHeader>
                        <PromptForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </ModalContent>
                </Overlay>
            )}
        </AnimatePresence>
    );
};

export default PromptModal;
