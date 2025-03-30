
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-destructive mb-4">
        <ShieldAlert className="h-16 w-16" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Access Denied</h1>
      <p className="text-muted-foreground text-center mb-6">
        You don't have permission to access this page.
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;
