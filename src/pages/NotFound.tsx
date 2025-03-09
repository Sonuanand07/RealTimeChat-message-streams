
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg border border-slate-200/70 max-w-md w-full animate-scale-in">
        <h1 className="text-6xl font-bold mb-4 text-slate-800">404</h1>
        <p className="text-xl text-slate-600 mb-6">Oops! Page not found</p>
        <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-300 px-6">
          <a href="/">Return to Chat</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
