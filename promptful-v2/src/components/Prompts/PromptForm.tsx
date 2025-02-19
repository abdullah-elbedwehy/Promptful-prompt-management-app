import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../UI/Button';
import { FiPlus, FiX } from 'react-icons/fi';

interface PromptFormProps {
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
    onCancel: () => void;
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 1.5rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text.primary};
`;

const Input = styled.input`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border.primary};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 1rem;
    width: 100%;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
    }
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border.primary};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 1rem;
    width: 100%;
    min-height: 120px;
    resize: vertical;
    transition: all 0.2s ease;
    font-family: 'Fira Code', monospace;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
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
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
    }
`;

const AIModelList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const AIModelChip = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 9999px;
    background: ${({ theme }) => theme.background.tertiary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 0.875rem;
    font-weight: 500;
`;

const ChipButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 9999px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.text.secondary};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.text.primary};
        background: ${({ theme }) => theme.background.secondary};
    }
`;

const VariableList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.75rem;
    border-radius: 8px;
    background: ${({ theme }) => theme.background.tertiary};
`;

const VariableChip = styled.div`
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: ${({ theme }) => theme.primary};
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: 'Fira Code', monospace;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    &:hover {
        background: ${({ theme }) => theme.error};
        transform: scale(1.05);
    }

    &:hover::after {
        content: '×';
        font-size: 1rem;
        line-height: 1;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
`;

const aiModelsAvailable = [
    'ChatGPT',
    'Claude',
    'GPT-4',
    'Bard',
    'DALL-E',
    'Midjourney',
    'Stable Diffusion',
];

const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.error};
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

export const PromptForm: React.FC<PromptFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        aiModels: initialData?.aiModels || [],
        category: initialData?.category || 'General',
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [variables, setVariables] = React.useState<string[]>([]);
    const [newAiModel, setNewAiModel] = React.useState('');

    useEffect(() => {
        const matches = formData.content.match(/\{([^}]+)\}/g) || [];
        const vars = matches.map((match) => match.slice(1, -1));
        setVariables([...new Set(vars)]);
    }, [formData.content]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        } else if (formData.content.length < 10) {
            newErrors.content = 'Content must be at least 10 characters';
        }

        if (formData.aiModels.length === 0) {
            newErrors.aiModels = 'Select at least one AI model';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({ ...formData, variables });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddAiModel = () => {
        if (newAiModel && !formData.aiModels.includes(newAiModel)) {
            setFormData((prev) => ({
                ...prev,
                aiModels: [...prev.aiModels, newAiModel],
            }));
            setNewAiModel('');
            // Clear AI models error if it exists
            if (errors.aiModels) {
                setErrors((prev) => ({ ...prev, aiModels: '' }));
            }
        }
    };

    const handleRemoveAiModel = (model: string) => {
        setFormData((prev) => ({
            ...prev,
            aiModels: prev.aiModels.filter((m) => m !== model),
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter prompt title"
                    required
                    aria-invalid={!!errors.title}
                />
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="content">Prompt Content</Label>
                <TextArea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter your prompt content. Use {variableName} for dynamic inputs."
                    required
                    aria-invalid={!!errors.content}
                />
                {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
                {variables.length > 0 && (
                    <VariableList>
                        {variables.map((variable) => (
                            <VariableChip
                                key={variable}
                                onClick={() => {
                                    // Update the content first
                                    const newContent = formData.content.replace(
                                        new RegExp(`\\{${variable}\\}`, 'g'),
                                        ''
                                    );
                                    
                                    // Update both content and variables
                                    setFormData({
                                        ...formData,
                                        content: newContent,
                                    });
                                    
                                    // Update the variables list
                                    const newVariables = variables.filter(v => v !== variable);
                                    setVariables(newVariables);
                                }}
                            >
                                {variable}
                            </VariableChip>
                        ))}
                    </VariableList>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="aiModel">AI Models</Label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Select
                        id="aiModel"
                        value={newAiModel}
                        onChange={(e) => setNewAiModel(e.target.value)}
                        aria-invalid={!!errors.aiModels}
                    >
                        <option value="">Select AI Model</option>
                        {aiModelsAvailable
                            .filter((model) => !formData.aiModels.includes(model))
                            .map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                    </Select>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAddAiModel}
                        leftIcon={<FiPlus />}
                    >
                        Add
                    </Button>
                </div>
                {errors.aiModels && <ErrorMessage>{errors.aiModels}</ErrorMessage>}
                <AIModelList>
                    {formData.aiModels.map((model) => (
                        <AIModelChip key={model}>
                            {model}
                            <ChipButton
                                type="button"
                                onClick={() => handleRemoveAiModel(model)}
                                aria-label={`Remove ${model}`}
                            >
                                <FiX size={14} />
                            </ChipButton>
                        </AIModelChip>
                    ))}
                </AIModelList>
            </FormGroup>

            <FormGroup>
                <Label htmlFor="category">Category</Label>
                <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="General">General</option>
                    <option value="Writing">Writing</option>
                    <option value="Coding">Coding</option>
                    <option value="Image">Image</option>
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                </Select>
            </FormGroup>

            <ButtonGroup>
                <Button variant="ghost" onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Update Prompt' : 'Create Prompt'}
                </Button>
            </ButtonGroup>
        </Form>
    );
};

export default PromptForm;
