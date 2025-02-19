import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Prompt, StoreState, SortOption, SortDirection } from '../types';

interface StoreActions {
    setPrompts: (prompts: Prompt[]) => void;
    addPrompt: (prompt: Prompt) => void;
    updatePrompt: (id: number, updatedPrompt: Partial<Prompt>) => void;
    deletePrompt: (id: number) => void;
    setSearchTerm: (term: string) => void;
    setAiFilter: (ai: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    sortPrompts: (option: SortOption, direction: SortDirection) => void;
    clearFilters: () => void;
}

const initialState: StoreState = {
    prompts: [],
    searchTerm: '',
    aiFilter: null,
    isLoading: false,
    error: null,
};

export const useStore = create<StoreState & StoreActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setPrompts: (prompts) => 
                    set({ prompts }),

                addPrompt: (prompt) => 
                    set((state) => ({
                        prompts: [prompt, ...state.prompts]
                    })),

                updatePrompt: (id, updatedPrompt) =>
                    set((state) => ({
                        prompts: state.prompts.map((prompt) =>
                            prompt.id === id
                                ? { ...prompt, ...updatedPrompt }
                                : prompt
                        )
                    })),

                deletePrompt: (id) =>
                    set((state) => ({
                        prompts: state.prompts.filter((prompt) => prompt.id !== id)
                    })),

                setSearchTerm: (searchTerm) =>
                    set({ searchTerm }),

                setAiFilter: (aiFilter) =>
                    set({ aiFilter }),

                setLoading: (isLoading) =>
                    set({ isLoading }),

                setError: (error) =>
                    set({ error }),

                sortPrompts: (option: SortOption, direction: SortDirection) => {
                    set((state) => {
                        const sortedPrompts = [...state.prompts].sort((a, b) => {
                            switch (option) {
                                case 'name':
                                    return direction === 'asc'
                                        ? a.promptName.localeCompare(b.promptName)
                                        : b.promptName.localeCompare(a.promptName);
                                case 'date':
                                    return direction === 'asc'
                                        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                case 'ai':
                                    return direction === 'asc'
                                        ? a.aiSelection[0]?.localeCompare(b.aiSelection[0] || '')
                                        : b.aiSelection[0]?.localeCompare(a.aiSelection[0] || '');
                                default:
                                    return 0;
                            }
                        });
                        return { prompts: sortedPrompts };
                    });
                },

                clearFilters: () =>
                    set({
                        searchTerm: '',
                        aiFilter: null
                    }),
            }),
            {
                name: 'promptful-storage',
                partialize: (state) => ({
                    prompts: state.prompts // Only persist prompts
                })
            }
        )
    )
);

// Selector hooks for better performance
export const usePrompts = () => useStore((state) => state.prompts);
export const useSearchTerm = () => useStore((state) => state.searchTerm);
export const useAiFilter = () => useStore((state) => state.aiFilter);
export const useLoading = () => useStore((state) => state.isLoading);
export const useError = () => useStore((state) => state.error);

// Filtered prompts selector
export const useFilteredPrompts = () => {
    const prompts = usePrompts();
    const searchTerm = useSearchTerm();
    const aiFilter = useAiFilter();

    return prompts.filter((prompt) => {
        const matchesSearch = searchTerm
            ? prompt.promptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              prompt.promptContent.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesAi = aiFilter
            ? prompt.aiSelection.includes(aiFilter)
            : true;

        return matchesSearch && matchesAi;
    });
};