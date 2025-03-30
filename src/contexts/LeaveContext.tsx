
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth, User } from './AuthContext';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  parentApproval?: boolean;
  adminApproval?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName'>) => void;
  updateLeaveRequest: (id: string, status: LeaveStatus) => void;
  getStudentLeaves: (studentId: string) => LeaveRequest[];
  getPendingLeaves: () => LeaveRequest[];
  getAllLeaves: () => LeaveRequest[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

interface LeaveProviderProps {
  children: ReactNode;
}

export const LeaveProvider: React.FC<LeaveProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Load leave requests from localStorage
  useEffect(() => {
    const storedLeaves = localStorage.getItem('leaveRequests');
    if (storedLeaves) {
      setLeaveRequests(JSON.parse(storedLeaves));
    } else {
      // Initialize with some mock data if needed
      const mockLeaves: LeaveRequest[] = [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Student',
          fromDate: '2023-10-12',
          toDate: '2023-10-15',
          reason: 'Family function',
          status: 'approved',
          parentApproval: true,
          adminApproval: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          studentId: '1',
          studentName: 'John Student',
          fromDate: '2023-11-05',
          toDate: '2023-11-07',
          reason: 'Medical appointment',
          status: 'rejected',
          parentApproval: false,
          adminApproval: false,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          studentId: '1',
          studentName: 'John Student',
          fromDate: '2023-12-20',
          toDate: '2023-12-25',
          reason: 'Winter holidays',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setLeaveRequests(mockLeaves);
      localStorage.setItem('leaveRequests', JSON.stringify(mockLeaves));
    }
  }, []);

  // Save leave requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const createLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName'>) => {
    if (!user) {
      toast.error('You must be logged in to create a leave request');
      return;
    }

    const newLeaveRequest: LeaveRequest = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLeaveRequests(prev => [newLeaveRequest, ...prev]);
    toast.success('Leave request submitted successfully');
  };

  const updateLeaveRequest = (id: string, status: LeaveStatus) => {
    setLeaveRequests(prev => 
      prev.map(leave => 
        leave.id === id 
          ? {
              ...leave,
              status,
              parentApproval: user?.role === 'parent' ? status === 'approved' : leave.parentApproval,
              adminApproval: user?.role === 'admin' ? status === 'approved' : leave.adminApproval,
              updatedAt: new Date().toISOString()
            } 
          : leave
      )
    );
    
    toast.success(`Leave request ${status}`);
  };

  const getStudentLeaves = (studentId: string) => {
    return leaveRequests.filter(leave => leave.studentId === studentId);
  };

  const getPendingLeaves = () => {
    return leaveRequests.filter(leave => leave.status === 'pending');
  };

  const getAllLeaves = () => {
    return leaveRequests;
  };

  return (
    <LeaveContext.Provider value={{
      leaveRequests,
      createLeaveRequest,
      updateLeaveRequest,
      getStudentLeaves,
      getPendingLeaves,
      getAllLeaves
    }}>
      {children}
    </LeaveContext.Provider>
  );
};
