
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { TaskCategory } from "@/types";
import { useTasks } from "@/contexts/TaskContext";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [isImportant, setIsImportant] = useState(false);
  
  const { addTask } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    addTask({
      title,
      description: description || undefined,
      category,
      completed: false,
      important: isImportant
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("personal");
    setIsImportant(false);
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("personal");
    setIsImportant(false);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add details about your task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup 
                value={category} 
                onValueChange={(value) => setCategory(value as TaskCategory)}
                className="flex flex-wrap gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="personal" />
                  <Label htmlFor="personal" className="cursor-pointer">Personal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="cursor-pointer">Work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shopping" id="shopping" />
                  <Label htmlFor="shopping" className="cursor-pointer">Shopping</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="health" id="health" />
                  <Label htmlFor="health" className="cursor-pointer">Health</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="important"
                checked={isImportant}
                onCheckedChange={setIsImportant}
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-taskPurple hover:bg-purple-600">
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
