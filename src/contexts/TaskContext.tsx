
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Task, TaskCategory, TaskRepetition } from '@/types';
import { useAuth } from './AuthContext';
import { addDays, addMonths, addWeeks, addYears, isAfter } from 'date-fns';

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
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : undefined
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

  // Check for tasks that need to be regenerated based on repetition
  useEffect(() => {
    if (!user) return;

    // Get current date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const repeatingTasks = tasks.filter(task => 
      task.repetition !== 'none' && 
      task.completed && 
      task.lastCompleted
    );

    if (repeatingTasks.length === 0) return;

    const newTasks: Task[] = [];
    const updatedTasks = [...tasks];

    repeatingTasks.forEach(task => {
      if (!task.lastCompleted) return;

      let nextDueDate: Date | undefined;
      
      // Calculate next due date based on repetition type
      switch (task.repetition) {
        case 'daily':
          nextDueDate = addDays(task.lastCompleted, 1);
          break;
        case 'weekly':
          nextDueDate = addWeeks(task.lastCompleted, 1);
          break;
        case 'monthly':
          nextDueDate = addMonths(task.lastCompleted, 1);
          break;
        case 'yearly':
          nextDueDate = addYears(task.lastCompleted, 1);
          break;
        case 'custom':
          if (task.repeatInterval) {
            nextDueDate = addDays(task.lastCompleted, task.repeatInterval);
          }
          break;
      }

      // If next due date exists and is today or earlier, create a new task
      if (nextDueDate && !isAfter(nextDueDate, today)) {
        // Create new repeated task
        const repeatedTask: Task = {
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          completed: false,
          createdAt: new Date(),
          dueDate: nextDueDate,
          lastCompleted: undefined
        };
        
        newTasks.push(repeatedTask);
        
        // Remove the completed recurring task
        const index = updatedTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          updatedTasks.splice(index, 1);
        }
      }
    });

    if (newTasks.length > 0) {
      setTasks([...updatedTasks, ...newTasks]);
      
      if (newTasks.length === 1) {
        toast({
          title: "Recurring task created",
          description: `"${newTasks[0].title}" has been recreated based on your schedule.`,
        });
      } else {
        toast({
          title: "Recurring tasks created",
          description: `${newTasks.length} tasks have been recreated based on your schedules.`,
        });
      }
    }
  }, [tasks, user, toast]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      repetition: taskData.repetition || 'none'
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
      tasks.map(task => {
        if (task.id === id) {
          const isNowCompleted = !task.completed;
          return { 
            ...task, 
            completed: isNowCompleted,
            lastCompleted: isNowCompleted ? new Date() : undefined 
          };
        }
        return task;
      })
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
