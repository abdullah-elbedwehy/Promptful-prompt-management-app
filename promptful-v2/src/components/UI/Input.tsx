import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

type InputSize = 'small' | 'medium' | 'large';
type InputVariant = 'outlined' | 'filled';

// Omit the native 'size' prop since we're using our own size prop
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    inputSize?: InputSize;
    variant?: InputVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const getSizeStyles = (size: InputSize) => {
    switch (size) {
        case 'small':
            return css`
                padding: 0.5rem;
                font-size: 0.875rem;
            `;
        case 'large':
            return css`
                padding: 0.75rem;
                font-size: 1.125rem;
            `;
        default:
            return css`
                padding: 0.625rem;
                font-size: 1rem;
            `;
    }
};

const getVariantStyles = (variant: InputVariant) => {
    switch (variant) {
        case 'filled':
            return css`
                background-color: ${({ theme }) => `${theme.text.primary}11`};
                border: 1px solid transparent;
                
                &:hover {
                    background-color: ${({ theme }) => `${theme.text.primary}22`};
                }
                
                &:focus {
                    background-color: transparent;
                    border-color: ${({ theme }) => theme.primary};
                }
            `;
        default:
            return css`
                background-color: transparent;
                border: 1px solid ${({ theme }) => theme.border};
                
                &:hover {
                    border-color: ${({ theme }) => theme.text.primary};
                }
                
                &:focus {
                    border-color: ${({ theme }) => theme.primary};
                }
            `;
    }
};

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
    display: inline-flex;
    flex-direction: column;
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text.secondary};
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const IconContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.text.secondary};
    
    &.left {
        left: 0.75rem;
    }
    
    &.right {
        right: 0.75rem;
    }
`;

interface StyledInputProps {
    $inputSize: InputSize;
    $variant: InputVariant;
    $hasLeftIcon?: boolean;
    $hasRightIcon?: boolean;
}

const StyledInput = styled(motion.input)<StyledInputProps>`
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius};
    color: ${({ theme }) => theme.text.primary};
    transition: all 0.2s ease;
    outline: none;
    
    ${({ $inputSize }) => getSizeStyles($inputSize)}
    ${({ $variant }) => getVariantStyles($variant)}
    ${({ $hasLeftIcon }) => $hasLeftIcon && 'padding-left: 2.5rem;'}
    ${({ $hasRightIcon }) => $hasRightIcon && 'padding-right: 2.5rem;'}

    &::placeholder {
        color: ${({ theme }) => theme.text.secondary};
        opacity: 0.7;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:focus {
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
    }
`;

const ErrorMessage = styled(motion.span)`
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.error};
`;

const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            inputSize = 'medium',
            variant = 'outlined',
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <InputContainer $fullWidth={fullWidth} className={className}>
                {label && <Label>{label}</Label>}
                <InputWrapper>
                    {leftIcon && <IconContainer className="left">{leftIcon}</IconContainer>}
                    <StyledInput
                        ref={ref}
                        $inputSize={inputSize}
                        $variant={variant}
                        $hasLeftIcon={!!leftIcon}
                        $hasRightIcon={!!rightIcon}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {rightIcon && <IconContainer className="right">{rightIcon}</IconContainer>}
                </InputWrapper>
                {error && (
                    <ErrorMessage
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {error}
                    </ErrorMessage>
                )}
            </InputContainer>
        );
    }
);

Input.displayName = 'Input';

export default Input;