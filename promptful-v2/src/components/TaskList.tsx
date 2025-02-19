import React from 'react';
import styled from 'styled-components';
import { FaCalendar, FaStar, FaEllipsisH, FaFlag } from 'react-icons/fa';
import type { Task } from '../types/task';

interface TaskListProps {
    tasks: Task[];
    title: string;
    onTaskClick?: (task: Task) => void;
    onTaskToggle?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title, onTaskClick, onTaskToggle }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Container>
            <Header>
                <Title>{title}</Title>
                <ViewOptions>
                    <ViewButton $active>
                        <FaList />
                    </ViewButton>
                    <ViewButton>
                        <FaCalendar />
                    </ViewButton>
                </ViewOptions>
            </Header>

            <Tasks>
                {tasks.map((task) => (
                    <TaskItem key={task.id} onClick={() => onTaskClick?.(task)}>
                        <Checkbox
                            $checked={task.completed}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTaskToggle?.(task);
                            }}
                        />
                        <TaskContent>
                            <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                            {(task.due_date || task.tags.length > 0 || task.priority) && (
                                <TaskMeta>
                                    {task.due_date && (
                                        <DueDate>
                                            <FaCalendar />
                                            {formatDate(task.due_date)}
                                        </DueDate>
                                    )}
                                    {task.priority && (
                                        <Priority $priority={task.priority}>
                                            <FaFlag />
                                        </Priority>
                                    )}
                                    {task.tags.map((tag) => (
                                        <Tag key={tag.id} $color={tag.color}>
                                            {tag.name}
                                        </Tag>
                                    ))}
                                </TaskMeta>
                            )}
                        </TaskContent>
                        <TaskActions>
                            <ActionButton>
                                <FaStar />
                            </ActionButton>
                            <ActionButton>
                                <FaEllipsisH />
                            </ActionButton>
                        </TaskActions>
                    </TaskItem>
                ))}

                <AddTask>
                    <FaPlus />
                    <span>Add Task</span>
                </AddTask>
            </Tasks>
        </Container>
    );
};

const Container = styled.div`
    margin-bottom: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
`;

const ViewOptions = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const ViewButton = styled.button<{ $active?: boolean }>`
    background: none;
    border: none;
    color: ${(props) => (props.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        color: var(--text-primary);
        background-color: var(--hover-bg);
    }
`;

const Tasks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const TaskItem = styled.div`
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--bg-secondary);
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--hover-bg);
    }
`;

const Checkbox = styled.div<{ $checked: boolean }>`
    width: 18px;
    height: 18px;
    border: 2px solid
        ${(props) => (props.$checked ? 'var(--accent-color)' : 'var(--text-secondary)')};
    border-radius: 50%;
    margin-right: 1rem;
    cursor: pointer;
    background-color: ${(props) => (props.$checked ? 'var(--accent-color)' : 'transparent')};
    transition: all 0.2s;

    &:hover {
        border-color: var(--accent-color);
    }
`;

const TaskContent = styled.div`
    flex-grow: 1;
    margin-right: 1rem;
`;

const TaskTitle = styled.div<{ $completed: boolean }>`
    color: ${(props) => (props.$completed ? 'var(--text-secondary)' : 'var(--text-primary)')};
    text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
`;

const TaskMeta = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
`;

const DueDate = styled.span`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const Priority = styled.span<{ $priority: number }>`
    display: flex;
    align-items: center;
    color: ${(props) => {
        switch (props.$priority) {
            case 1:
                return '#ff4d4d';
            case 2:
                return '#ffa64d';
            case 3:
                return '#ffff4d';
            default:
                return 'var(--text-secondary)';
        }
    }};
`;

const Tag = styled.span<{ $color: string }>`
    display: flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    background-color: ${(props) => props.$color}20;
    color: ${(props) => props.$color};
    border-radius: 12px;
    font-size: 0.85rem;
`;

const TaskActions = styled.div`
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;

    ${TaskItem}:hover & {
        opacity: 1;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: var(--text-secondary);
    padding: 0.25rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        color: var(--text-primary);
        background-color: var(--hover-bg);
    }
`;

const AddTask = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 6px;
    margin-top: 0.5rem;

    &:hover {
        background-color: var(--hover-bg);
        color: var(--text-primary);
    }
`;

const FaList = styled(FaCalendar)`
    transform: rotate(90deg);
`;

const FaPlus = styled(FaCalendar)`
    color: var(--accent-color);
`;

export default TaskList;
