import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse, Prompt, PromptFormData } from '../types';
import type {
    Task,
    List,
    Tag,
    CreateTaskInput,
    CreateListInput,
    CreateTagInput,
    TaskFilters,
} from '../types/task';

// Create axios instance with default config
const API_URL = 'http://localhost:5001';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handler
const handleError = (error: AxiosError): never => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message =
            (error.response.data as ApiResponse<any>).message ||
            'An error occurred while processing your request';
        throw new Error(message);
    } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server');
    } else {
        // Something happened in setting up the request
        throw new Error('Error setting up the request');
    }
};

// API methods
export const promptsApi = {
    // Get all prompts
    getAll: async (): Promise<Prompt[]> => {
        try {
            const response = await api.get<ApiResponse<Prompt[]>>('/');
            return response.data.data || [];
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Get a single prompt
    getById: async (id: number): Promise<Prompt> => {
        try {
            const response = await api.get<ApiResponse<Prompt>>(`/prompt/${id}`);
            if (!response.data.data) {
                throw new Error('Prompt not found');
            }
            return response.data.data;
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Create a new prompt
    create: async (promptData: PromptFormData): Promise<Prompt> => {
        try {
            const response = await api.post<ApiResponse<Prompt>>('/prompt/add', promptData);
            if (!response.data.data) {
                throw new Error('Failed to create prompt');
            }
            return response.data.data;
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Update an existing prompt
    update: async (id: number, promptData: Partial<PromptFormData>): Promise<Prompt> => {
        try {
            const response = await api.post<ApiResponse<Prompt>>(`/prompt/${id}/edit`, promptData);
            if (!response.data.data) {
                throw new Error('Failed to update prompt');
            }
            return response.data.data;
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Delete a prompt
    delete: async (id: number): Promise<void> => {
        try {
            await api.post<ApiResponse<void>>(`/prompt/${id}/delete`);
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Copy a prompt (fetch for variable replacement)
    copy: async (id: number): Promise<Prompt> => {
        try {
            const response = await api.post<ApiResponse<Prompt>>(`/prompt/${id}/copy`);
            if (!response.data.data) {
                throw new Error('Failed to copy prompt');
            }
            return response.data.data;
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },

    // Search prompts
    search: async (searchTerm?: string, aiFilter?: string): Promise<Prompt[]> => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('q', searchTerm);
            if (aiFilter) params.append('ai', aiFilter);

            const response = await api.get<ApiResponse<Prompt[]>>('/prompts/search', { params });
            return response.data.data || [];
        } catch (error) {
            return handleError(error as AxiosError);
        }
    },
};

// Tasks
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
    const { data } = await api.get<ApiResponse<Task[]>>('/api/tasks', { params: filters });
    return data.data || [];
};

export const createTask = async (task: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post<ApiResponse<Task>>('/api/tasks', task);
    return data.data!;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
    const { data } = await api.put<ApiResponse<Task>>(`/api/tasks/${id}`, task);
    return data.data!;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
};

export const toggleTask = async (id: number, completed: boolean): Promise<Task> => {
    const { data } = await api.post<ApiResponse<Task>>(`/api/tasks/${id}/toggle`, { completed });
    return data.data!;
};

// Lists
export const getLists = async (): Promise<List[]> => {
    const { data } = await api.get<ApiResponse<List[]>>('/api/lists');
    return data.data || [];
};

export const createList = async (list: CreateListInput): Promise<List> => {
    const { data } = await api.post<ApiResponse<List>>('/api/lists', list);
    return data.data!;
};

// Tags
export const getTags = async (): Promise<Tag[]> => {
    const { data } = await api.get<ApiResponse<Tag[]>>('/api/tags');
    return data.data || [];
};

export const createTag = async (tag: CreateTagInput): Promise<Tag> => {
    const { data } = await api.post<ApiResponse<Tag>>('/api/tags', tag);
    return data.data!;
};

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can add auth headers or other request modifications here
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // You can handle global error cases here
        return Promise.reject(error);
    }
);

export default api;
