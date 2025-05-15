
import { useState } from "react";
import { Check, Clock, RepeatIcon, Star, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleComplete, toggleImportant, deleteTask } = useTasks();
  
  const handleToggleComplete = () => {
    toggleComplete(task.id);
  };
  
  const handleToggleImportant = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleImportant(task.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const getRepetitionLabel = (task: Task) => {
    switch (task.repetition) {
      case 'none':
        return null;
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'custom':
        return `Every ${task.repeatInterval} day${task.repeatInterval !== 1 ? 's' : ''}`;
      default:
        return null;
    }
  };

  const repetitionLabel = getRepetitionLabel(task);

  return (
    <div 
      className={cn(
        "task-card flex items-center",
        task.completed ? "opacity-60" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "task-checkbox",
          task.completed ? "task-checkbox-checked animate-task-complete" : ""
        )}
        onClick={handleToggleComplete}
      >
        {task.completed && <Check size={14} />}
      </div>
      
      <div className="flex-1 ml-3">
        <div className="flex items-center">
          <h3 
            className={cn(
              "text-sm font-medium",
              task.completed ? "line-through text-gray-500" : "",
              task.important ? "text-taskImportant" : ""
            )}
          >
            {task.title}
          </h3>
          {task.important && !isHovered && (
            <Star 
              size={16} 
              className="ml-1 text-yellow-400 fill-yellow-400" 
            />
          )}
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 mt-1">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center mt-1 flex-wrap gap-2">
          <span 
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              {
                "bg-blue-100 text-blue-700": task.category === "work",
                "bg-green-100 text-green-700": task.category === "personal",
                "bg-orange-100 text-orange-700": task.category === "shopping",
                "bg-red-100 text-red-700": task.category === "health",
                "bg-gray-100 text-gray-700": task.category === "other"
              }
            )}
          >
            {task.category}
          </span>
          
          {task.dueDate && (
            <span className="text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          )}
          
          {repetitionLabel && (
            <span className="text-xs text-purple-600 flex items-center">
              <RepeatIcon size={12} className="mr-1" />
              {repetitionLabel}
            </span>
          )}
        </div>
      </div>
      
      {isHovered && (
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleToggleImportant}
            className={cn(
              "p-1 rounded-full hover:bg-gray-100",
              task.important ? "text-yellow-500" : "text-gray-400"
            )}
            title={task.important ? "Remove importance" : "Mark as important"}
          >
            <Star size={18} className={task.important ? "fill-yellow-400" : ""} />
          </button>
          
          <button 
            onClick={handleDelete}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500"
            title="Delete task"
          >
            <Trash size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
