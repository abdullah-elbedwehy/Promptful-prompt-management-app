import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info'
    | 'ghost'
    | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonShape = 'square' | 'rounded' | 'pill';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    elevation?: boolean;
    animated?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
        case 'primary':
            return css`
                background: linear-gradient(
                    145deg,
                    ${({ theme }) => theme.primary},
                    ${({ theme }) => `${theme.primary}dd`}
                );
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(
                        145deg,
                        ${({ theme }) => `${theme.primary}dd`},
                        ${({ theme }) => theme.primary}
                    );
                    transform: translateY(-2px);
                }
            `;
        case 'secondary':
            return css`
                background: linear-gradient(
                    145deg,
                    ${({ theme }) => theme.secondary},
                    ${({ theme }) => `${theme.secondary}dd`}
                );
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(
                        145deg,
                        ${({ theme }) => `${theme.secondary}dd`},
                        ${({ theme }) => theme.secondary}
                    );
                    transform: translateY(-2px);
                }
            `;
        case 'danger':
            return css`
                background: linear-gradient(
                    145deg,
                    ${({ theme }) => theme.error},
                    ${({ theme }) => `${theme.error}dd`}
                );
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(
                        145deg,
                        ${({ theme }) => `${theme.error}dd`},
                        ${({ theme }) => theme.error}
                    );
                    transform: translateY(-2px);
                }
            `;
        case 'success':
            return css`
                background: linear-gradient(145deg, #22c55e, #16a34a);
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(145deg, #16a34a, #22c55e);
                    transform: translateY(-2px);
                }
            `;
        case 'warning':
            return css`
                background: linear-gradient(145deg, #f59e0b, #d97706);
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(145deg, #d97706, #f59e0b);
                    transform: translateY(-2px);
                }
            `;
        case 'info':
            return css`
                background: linear-gradient(145deg, #3b82f6, #2563eb);
                color: white;
                &:hover:not(:disabled) {
                    background: linear-gradient(145deg, #2563eb, #3b82f6);
                    transform: translateY(-2px);
                }
            `;
        case 'ghost':
            return css`
                background: transparent;
                color: ${({ theme }) => theme.text.primary};
                &:hover:not(:disabled) {
                    background: ${({ theme }) => `${theme.text.primary}11`};
                    transform: translateY(-2px);
                }
            `;
        case 'outline':
            return css`
                background: transparent;
                border: 2px solid ${({ theme }) => theme.primary};
                color: ${({ theme }) => theme.primary};
                &:hover:not(:disabled) {
                    background: ${({ theme }) => theme.primary};
                    color: white;
                    transform: translateY(-2px);
                }
            `;
        default:
            return '';
    }
};

const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
        case 'xs':
            return css`
                padding: 0.375rem 0.75rem;
                font-size: 0.75rem;
            `;
        case 'sm':
            return css`
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            `;
        case 'lg':
            return css`
                padding: 0.75rem 1.5rem;
                font-size: 1.125rem;
            `;
        case 'xl':
            return css`
                padding: 1rem 2rem;
                font-size: 1.25rem;
            `;
        default: // md
            return css`
                padding: 0.625rem 1.25rem;
                font-size: 1rem;
            `;
    }
};

const getShapeStyles = (shape: ButtonShape) => {
    switch (shape) {
        case 'square':
            return css`
                border-radius: 4px;
            `;
        case 'pill':
            return css`
                border-radius: 9999px;
            `;
        default: // rounded
            return css`
                border-radius: 8px;
            `;
    }
};

const StyledButton = styled(motion.button)<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    position: relative;
    overflow: hidden;

    ${({ variant = 'primary' }) => getVariantStyles(variant)}
    ${({ size = 'md' }) => getSizeStyles(size)}
    ${({ shape = 'rounded' }) => getShapeStyles(shape)}
    ${({ elevation }) =>
        elevation &&
        css`
            box-shadow:
                0 4px 6px -1px rgb(0 0 0 / 0.1),
                0 2px 4px -2px rgb(0 0 0 / 0.1);
            &:hover:not(:disabled) {
                box-shadow:
                    0 10px 15px -3px rgb(0 0 0 / 0.1),
                    0 4px 6px -4px rgb(0 0 0 / 0.1);
            }
        `}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: 2px;
    }

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s;
    }

    &:active::before {
        transform: translate(-50%, -50%) scale(2);
    }
`;

const LoadingSpinner = styled(motion.span)`
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
`;

const spinnerVariants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    elevation = true,
    animated = true,
    disabled,
    ...props
}) => {
    const motionProps = animated
        ? {
              initial: 'initial',
              whileHover: 'hover',
              whileTap: 'tap',
              variants: buttonVariants,
          }
        : {};

    return (
        <StyledButton
            variant={variant}
            size={size}
            shape={shape}
            fullWidth={fullWidth}
            elevation={elevation}
            disabled={disabled || isLoading}
            {...motionProps}
            {...props}
        >
            {isLoading && (
                <LoadingSpinner variants={spinnerVariants} animate="animate" aria-hidden="true" />
            )}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </StyledButton>
    );
};

export default Button;
