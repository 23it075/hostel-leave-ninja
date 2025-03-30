
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-destructive mb-4">
        <ShieldAlert className="h-16 w-16" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Access Denied</h1>
      <p className="text-muted-foreground text-center mb-6">
        {user ? `Your role (${user.role}) doesn't have permission to access this page.` : 'You need to be logged in to access this page.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
