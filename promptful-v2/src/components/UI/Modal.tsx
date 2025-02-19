import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    closeOnBackdropClick?: boolean;
}

const modalRoot = document.getElementById('modal-root') || document.body;

const Backdrop = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${({ theme }) => theme.zIndices?.modalBackdrop || 1040};
    backdrop-filter: blur(2px);
`;

const getModalWidth = (size: ModalProps['size']) => {
    switch (size) {
        case 'small':
            return '400px';
        case 'large':
            return '800px';
        default:
            return '600px';
    }
};

const ModalContainer = styled(motion.div)<{ size: ModalProps['size'] }>`
    background-color: ${({ theme }) => theme.surface};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows?.lg};
    width: 90%;
    max-width: ${({ size }) => getModalWidth(size)};
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: ${({ theme }) => theme.zIndices?.modal || 1050};
`;

const ModalHeader = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h2`
    margin: 0;
    font-size: ${({ theme }) => theme.typography?.fontSizes.lg};
    color: ${({ theme }) => theme.text.primary};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.text.secondary};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.text.primary};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: 2px;
    }
`;

const ModalContent = styled.div`
    padding: 1.5rem;
    overflow-y: auto;
`;

const backdropVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

const modalVariants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    closeOnBackdropClick = true,
}) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <Backdrop
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    transition={{ duration: 0.2 }}
                    onClick={closeOnBackdropClick ? onClose : undefined}
                >
                    <ModalContainer
                        size={size}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        transition={{ duration: 0.3, type: 'spring', damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <ModalHeader>
                                <Title>{title}</Title>
                                <CloseButton onClick={onClose} aria-label="Close modal">
                                    ✕
                                </CloseButton>
                            </ModalHeader>
                        )}
                        <ModalContent>{children}</ModalContent>
                    </ModalContainer>
                </Backdrop>
            )}
        </AnimatePresence>,
        modalRoot
    );
};

export default Modal;