
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Welcome = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-taskBackground">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
            
            <div>
              {user ? (
                <Link to="/tasks">
                  <Button variant="ghost">My Tasks</Button>
                </Link>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-taskPurple hover:bg-purple-600">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Manage your tasks with ease
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Stay organized, focused, and in control of your daily tasks with our simple and elegant task manager.
            </p>
            
            {user ? (
              <Link to="/tasks">
                <Button size="lg" className="bg-taskPurple hover:bg-purple-600 text-lg px-8">
                  Go to My Tasks
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-taskPurple hover:bg-purple-600 text-lg px-8 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto">
                    I already have an account
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-taskLightPurple rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-taskPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Organize Tasks</h2>
              <p className="text-gray-600">
                Keep all your tasks organized by categories like work, personal, shopping, and health.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-taskLightPurple rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-taskPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Track Progress</h2>
              <p className="text-gray-600">
                Mark tasks as complete and track your progress to stay motivated throughout the day.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-taskLightPurple rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-taskPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Prioritize</h2>
              <p className="text-gray-600">
                Mark important tasks and always know what needs your attention first.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 Task Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
