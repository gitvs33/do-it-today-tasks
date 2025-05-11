
export type TaskCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  important: boolean;
  category: TaskCategory;
  createdAt: Date;
  dueDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
