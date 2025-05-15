
import { useState, useEffect } from "react";
import { Check, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCategory } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<TaskCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  
  const { getFilteredTasks, getCustomCategories } = useTasks();
  const { user } = useAuth();
  
  const customCategories = getCustomCategories();
  const filteredTasks = getFilteredTasks(activeTab, showCompleted);

  useEffect(() => {
    // If current activeTab is a custom category that no longer exists, reset to "all"
    if (activeTab !== "all" && 
        !["personal", "work", "shopping", "health", "other"].includes(activeTab as string) &&
        !customCategories.includes(activeTab as string)) {
      setActiveTab("all");
    }
  }, [customCategories, activeTab]);

  if (!user) {
    return null; // Or redirect to login
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as TaskCategory | "all");
  };

  const renderTaskList = (category: string) => {
    const tasksToShow = category === "all" 
      ? filteredTasks 
      : getFilteredTasks(category as TaskCategory, showCompleted);
      
    if (tasksToShow.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No {category !== "all" ? category + " " : ""}tasks found</p>
          <Button 
            variant="outline" 
            onClick={() => setIsAddTaskOpen(true)}
            className="mt-4"
          >
            Add {category !== "all" ? "a " + category + " " : "your first "}task
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {tasksToShow.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-taskBackground">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <Button 
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-taskPurple hover:bg-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="overflow-hidden">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="p-4 flex items-center justify-between border-b overflow-x-auto">
              <div className="flex items-center">
                <TabsList className="grid grid-flow-col auto-cols-max gap-1">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="work">Work</TabsTrigger>
                  <TabsTrigger value="shopping">Shopping</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  
                  {/* Show some custom categories in the main tabs */}
                  {customCategories.slice(0, 2).map(cat => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                  
                  {/* More categories dropdown if we have more than 2 custom categories */}
                  {customCategories.length > 2 && (
                    <DropdownMenu open={showMoreCategories} onOpenChange={setShowMoreCategories}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          More...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        {customCategories.slice(2).map(cat => (
                          <DropdownMenuItem key={cat} onSelect={() => handleTabChange(cat)}>
                            {cat}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TabsList>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`text-xs ${!showCompleted ? 'bg-gray-100' : ''}`}
                >
                  {showCompleted ? "Hide Completed" : "Show Completed"}
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="p-4">
                {renderTaskList("all")}
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="m-0">
              <div className="p-4">
                {renderTaskList("personal")}
              </div>
            </TabsContent>
            
            <TabsContent value="work" className="m-0">
              <div className="p-4">
                {renderTaskList("work")}
              </div>
            </TabsContent>
            
            <TabsContent value="shopping" className="m-0">
              <div className="p-4">
                {renderTaskList("shopping")}
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="m-0">
              <div className="p-4">
                {renderTaskList("health")}
              </div>
            </TabsContent>
            
            <TabsContent value="other" className="m-0">
              <div className="p-4">
                {renderTaskList("other")}
              </div>
            </TabsContent>
            
            {/* Add TabsContent for custom categories */}
            {customCategories.map(cat => (
              <TabsContent key={cat} value={cat} className="m-0">
                <div className="p-4">
                  {renderTaskList(cat)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </main>
      
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  );
};

export default Tasks;
