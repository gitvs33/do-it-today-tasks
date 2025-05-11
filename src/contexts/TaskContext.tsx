
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Task, TaskCategory } from '@/types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleImportant: (id: string) => void;
  getFilteredTasks: (category?: TaskCategory | 'all', showCompleted?: boolean) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load tasks from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`taskManager_tasks_${user.id}`);
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          // Convert string dates back to Date objects
          const tasksWithDates = parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined
          }));
          setTasks(tasksWithDates);
        } catch (error) {
          console.error('Failed to parse stored tasks:', error);
        }
      }
    } else {
      // Clear tasks when user logs out
      setTasks([]);
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`taskManager_tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(tasks.filter(t => t.id !== id));
    toast({
      title: "Task deleted",
      description: `"${task.title}" has been removed.`,
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const toggleImportant = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id 
          ? { ...task, important: !task.important } 
          : task
      )
    );
  };

  const getFilteredTasks = (category: TaskCategory | 'all' = 'all', showCompleted = true) => {
    return tasks.filter(task => {
      // Filter by completion status
      if (!showCompleted && task.completed) return false;
      
      // Filter by category
      if (category !== 'all' && task.category !== category) return false;
      
      return true;
    });
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      deleteTask, 
      toggleComplete, 
      toggleImportant,
      getFilteredTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
