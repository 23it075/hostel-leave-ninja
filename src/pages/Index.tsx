
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold">LeaveIt</h1>
          </div>
          <div>
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simplify Hostel Leave Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A complete solution for students, parents, and administrators to efficiently manage hostel leave applications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Get Started"}
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">For Everyone in the System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-4">Students</h4>
                <ul className="space-y-2">
                  <li>• Easy leave application</li>
                  <li>• Real-time status tracking</li>
                  <li>• Leave history</li>
                  <li>• Simplified process</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-4">Parents</h4>
                <ul className="space-y-2">
                  <li>• Leave approval access</li>
                  <li>• View child's request details</li>
                  <li>• Transparency in process</li>
                  <li>• Easy decision making</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-4">Administrators</h4>
                <ul className="space-y-2">
                  <li>• Complete system overview</li>
                  <li>• Management dashboard</li>
                  <li>• Final approval authority</li>
                  <li>• Analytics and reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to simplify leave management?</h3>
            <Button size="lg" variant="secondary" asChild>
              <Link to={user ? "/dashboard" : "/register"}>
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-6 w-6 mr-2" />
              <p className="font-semibold">LeaveIt</p>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
