export interface Task {
    id: number;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    due_date?: string;
    completed: boolean;
    completed_at?: string;
    priority: 1 | 2 | 3 | 4;
    list_id?: number;
    parent_id?: number;
    tags: Tag[];
    subtasks: Task[];
}

export interface List {
    id: number;
    name: string;
    color: string;
    icon: string;
    created_at: string;
    task_count: number;
}

export interface Tag {
    id: number;
    name: string;
    color: string;
    created_at: string;
    task_count: number;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    due_date?: string;
    list_id?: number;
    priority?: 1 | 2 | 3 | 4;
    tags?: string[];
}

export interface CreateListInput {
    name: string;
    color?: string;
    icon?: string;
}

export interface CreateTagInput {
    name: string;
    color?: string;
}

export interface TaskFilters {
    list_id?: number;
    tag_id?: number;
    due_date?: string;
    due_after?: string;
}
