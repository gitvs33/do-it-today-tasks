import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCategory, TaskRepetition } from "@/types";
import { useTasks } from "@/contexts/TaskContext";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [repetition, setRepetition] = useState<TaskRepetition>("none");
  const [repeatInterval, setRepeatInterval] = useState<number>(1);
  
  const { addTask, getCustomCategories } = useTasks();
  const customCategories = getCustomCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    // Handle custom category
    let finalCategory: TaskCategory;
    if (showCustomCategory) {
      // If a custom category is selected from dropdown, use it
      if (customCategories.includes(customCategory)) {
        finalCategory = customCategory;
      } else if (customCategory.trim()) {
        // If it's a new custom category, use the trimmed value
        finalCategory = customCategory.trim();
      } else {
        // Fallback to 'other' if no valid custom category
        finalCategory = 'other';
      }
    } else {
      finalCategory = category;
    }
    
    addTask({
      title,
      description: description || undefined,
      category: finalCategory,
      completed: false,
      important: isImportant,
      dueDate,
      repetition,
      repeatInterval: repetition === 'custom' ? repeatInterval : undefined
    });
    
    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("personal");
    setCustomCategory("");
    setShowCustomCategory(false);
    setIsImportant(false);
    setDueDate(undefined);
    setRepetition("none");
    setRepeatInterval(1);
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setCategory('other'); // Set a default
    } else {
      setShowCustomCategory(false);
      setCategory(value as TaskCategory);
    }
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
                value={showCustomCategory ? "custom" : category} 
                onValueChange={handleCategoryChange}
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
              
              {showCustomCategory && (
                <div className="mt-2 space-y-4">
                  {customCategories.length > 0 && (
                    <div>
                      <Label>Select existing category or create new:</Label>
                      <Select 
                        value={customCategory} 
                        onValueChange={setCustomCategory}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose existing category" />
                        </SelectTrigger>
                        <SelectContent>
                          {customCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="newCategory">
                      {customCategories.length > 0 ? "Or create new category:" : "Create new category:"}
                    </Label>
                    <Input
                      id="newCategory"
                      placeholder="Enter new category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="dueDate">Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repetition">Repeat</Label>
              <Select value={repetition} onValueChange={(value) => setRepetition(value as TaskRepetition)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One time only</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {repetition === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="repeatInterval">Repeat every</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="repeatInterval"
                    type="number"
                    min={1}
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <span>days</span>
                </div>
              </div>
            )}
            
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