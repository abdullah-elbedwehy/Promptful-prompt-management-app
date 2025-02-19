import React from 'react';
import styled from 'styled-components';
import { FaCalendar, FaList, FaTags, FaFlag, FaPlus } from 'react-icons/fa';
import type { Task } from '../types/task';

interface TaskDetailsProps {
    task?: Task;
    onUpdate?: (task: Partial<Task>) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onUpdate }) => {
    if (!task) {
        return (
            <Container>
                <EmptyState>Select a task to view details</EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <TaskHeader>
                <Checkbox $checked={task.completed} />
                <TitleInput
                    type="text"
                    value={task.title}
                    onChange={(e) => onUpdate?.({ title: e.target.value })}
                    placeholder="Task title"
                />
            </TaskHeader>

            <DetailSection>
                <DetailItem>
                    <FaCalendar />
                    <span>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Due Date'}
                    </span>
                </DetailItem>
                <DetailItem>
                    <FaList />
                    <span>{task.list_id ? 'List Name' : 'No List'}</span>
                </DetailItem>
                <DetailItem>
                    <FaTags />
                    <span>{task.tags.length ? `${task.tags.length} tags` : 'Tags'}</span>
                </DetailItem>
                <DetailItem>
                    <FaFlag />
                    <span>Priority {task.priority}</span>
                </DetailItem>
            </DetailSection>

            <DescriptionSection>
                <textarea
                    placeholder="Add description..."
                    value={task.description || ''}
                    onChange={(e) => onUpdate?.({ description: e.target.value })}
                />
            </DescriptionSection>

            <SubtasksSection>
                <h4>Subtasks</h4>
                <SubtasksList>
                    {task.subtasks.map((subtask) => (
                        <SubtaskItem key={subtask.id}>
                            <Checkbox $checked={subtask.completed} />
                            <span>{subtask.title}</span>
                        </SubtaskItem>
                    ))}
                </SubtasksList>
                <AddSubtask>
                    <FaPlus />
                    <span>Add subtask</span>
                </AddSubtask>
            </SubtasksSection>
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const EmptyState = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-size: 0.9rem;
`;

const TaskHeader = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
`;

const Checkbox = styled.div<{ $checked: boolean }>`
    width: 18px;
    height: 18px;
    border: 2px solid
        ${(props) => (props.$checked ? 'var(--accent-color)' : 'var(--text-secondary)')};
    border-radius: 50%;
    cursor: pointer;
    background-color: ${(props) => (props.$checked ? 'var(--accent-color)' : 'transparent')};
    transition: all 0.2s;

    &:hover {
        border-color: var(--accent-color);
    }
`;

const TitleInput = styled.input`
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.1rem;
    width: 100%;
    outline: none;

    &::placeholder {
        color: var(--text-secondary);
    }
`;

const DetailSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    color: var(--text-secondary);
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: var(--hover-bg);
        color: var(--text-primary);
    }
`;

const DescriptionSection = styled.div`
    textarea {
        width: 100%;
        min-height: 100px;
        background: none;
        border: none;
        color: var(--text-primary);
        resize: vertical;
        outline: none;
        padding: 0.5rem;

        &::placeholder {
            color: var(--text-secondary);
        }
    }
`;

const SubtasksSection = styled.div`
    flex-grow: 1;

    h4 {
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        font-weight: 600;
    }
`;

const SubtasksList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const SubtaskItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;

    &:hover {
        background-color: var(--hover-bg);
    }
`;

const AddSubtask = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 6px;

    &:hover {
        background-color: var(--hover-bg);
        color: var(--text-primary);
    }
`;

export default TaskDetails;
