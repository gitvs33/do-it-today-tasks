
export type TaskCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other' | string;

export type TaskRepetition = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  important: boolean;
  category: TaskCategory;
  createdAt: Date;
  dueDate?: Date;
  repetition: TaskRepetition;
  repeatInterval?: number; // For custom repetition (days)
  lastCompleted?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
