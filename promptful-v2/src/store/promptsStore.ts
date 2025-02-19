import { create } from 'zustand';
import { storage } from '../utils/storage';

export interface Prompt {
    id: string;
    title: string;
    content: string;
    aiModels: string[];
    category: string;
    variables: string[];
    usageCount: number;
}

interface PromptsState {
    prompts: Prompt[];
    addPrompt: (prompt: Omit<Prompt, 'id'>) => void;
    addPrompts: (prompts: Omit<Prompt, 'id'>[]) => void;
    updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
    deletePrompt: (id: string) => void;
    deleteAll: () => void;
    incrementUsage: (id: string) => void;
}

const STORAGE_KEY = 'promptful_prompts';

export const usePromptsStore = create<PromptsState>((set, get) => ({
    prompts: storage.get(STORAGE_KEY) || [],
    
    addPrompt: (promptData) => set((state) => {
        const newPrompt = {
            ...promptData,
            id: Math.random().toString(36).substr(2, 9),
            usageCount: 0,
        };
        const newPrompts = [...state.prompts, newPrompt];
        storage.set(STORAGE_KEY, newPrompts);
        return { prompts: newPrompts };
    }),
    
    addPrompts: (promptsData) => set((state) => {
        const newPrompts = [
            ...state.prompts,
            ...promptsData.map(prompt => ({
                ...prompt,
                id: Math.random().toString(36).substr(2, 9),
                usageCount: 0,
            }))
        ];
        storage.set(STORAGE_KEY, newPrompts);
        return { prompts: newPrompts };
    }),
    
    updatePrompt: (id, promptData) => set((state) => {
        const newPrompts = state.prompts.map(prompt => 
            prompt.id === id ? { 
                ...prompt, 
                ...promptData,
                usageCount: promptData.usageCount ?? prompt.usageCount ?? 0,
            } : prompt
        );
        storage.set(STORAGE_KEY, newPrompts);
        return { prompts: newPrompts };
    }),
    
    deletePrompt: (id) => set((state) => {
        const newPrompts = state.prompts.filter(prompt => prompt.id !== id);
        storage.set(STORAGE_KEY, newPrompts);
        return { prompts: newPrompts };
    }),

    deleteAll: () => set(() => {
        storage.set(STORAGE_KEY, []);
        return { prompts: [] };
    }),

    incrementUsage: (id: string) => set((state) => {
        const newPrompts = state.prompts.map(prompt => 
            prompt.id === id 
                ? { ...prompt, usageCount: (prompt.usageCount || 0) + 1 }
                : prompt
        );
        storage.set(STORAGE_KEY, newPrompts);
        return { prompts: newPrompts };
    }),
})); 