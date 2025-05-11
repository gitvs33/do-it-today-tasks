
import { useState } from "react";
import { Check, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCategory } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<TaskCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  const { getFilteredTasks } = useTasks();
  const { user } = useAuth();
  
  const filteredTasks = getFilteredTasks(activeTab, showCompleted);

  if (!user) {
    return null; // Or redirect to login
  }

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
            onValueChange={(value) => setActiveTab(value as TaskCategory | "all")}
            className="w-full"
          >
            <div className="p-4 flex items-center justify-between border-b">
              <TabsList className="grid grid-cols-5 w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="shopping">Shopping</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
              </TabsList>
              
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
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No tasks found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="mt-4"
                    >
                      Add your first task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="m-0">
              <div className="p-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No personal tasks found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="mt-4"
                    >
                      Add a personal task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="work" className="m-0">
              <div className="p-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No work tasks found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="mt-4"
                    >
                      Add a work task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shopping" className="m-0">
              <div className="p-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No shopping tasks found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="mt-4"
                    >
                      Add a shopping task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="m-0">
              <div className="p-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No health tasks found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="mt-4"
                    >
                      Add a health task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  );
};

export default Tasks;
