
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth, User } from './AuthContext';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'home_leave' | 'one_day_leave' | 'medical_leave' | 'emergency_leave' | 'other';

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  home_leave: 'Home Leave',
  one_day_leave: 'One Day Leave',
  medical_leave: 'Medical Leave',
  emergency_leave: 'Emergency Leave',
  other: 'Other'
};

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  parentApproval: boolean;
  adminApproval: boolean;
  finalApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName' | 'parentApproval' | 'adminApproval' | 'finalApproval'>) => void;
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

  useEffect(() => {
    // Load leave requests from localStorage on initial render
    const storedLeaves = localStorage.getItem('leaveRequests');
    if (storedLeaves) {
      try {
        const parsedLeaves = JSON.parse(storedLeaves);
        setLeaveRequests(parsedLeaves);
      } catch (error) {
        console.error('Error parsing stored leave requests:', error);
        // Initialize with empty array if parsing fails
        setLeaveRequests([]);
        localStorage.setItem('leaveRequests', JSON.stringify([]));
      }
    } else {
      const mockLeaves: LeaveRequest[] = [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Student',
          leaveType: 'home_leave',
          fromDate: '2023-10-12',
          toDate: '2023-10-15',
          reason: 'Family function',
          status: 'approved',
          parentApproval: true,
          adminApproval: true,
          finalApproval: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          studentId: '1',
          studentName: 'John Student',
          leaveType: 'medical_leave',
          fromDate: '2023-11-05',
          toDate: '2023-11-07',
          reason: 'Medical appointment',
          status: 'rejected',
          parentApproval: false,
          adminApproval: false,
          finalApproval: false,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          studentId: '1',
          studentName: 'John Student',
          leaveType: 'one_day_leave',
          fromDate: '2023-12-20',
          toDate: '2023-12-20',
          reason: 'Personal errands',
          status: 'pending',
          parentApproval: true,
          adminApproval: false,
          finalApproval: false,
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
    console.log('Saving leave requests to localStorage:', leaveRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const createLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName' | 'parentApproval' | 'adminApproval' | 'finalApproval'>) => {
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
      parentApproval: false,
      adminApproval: false,
      finalApproval: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating new leave request:', newLeaveRequest);
    
    setLeaveRequests(prev => {
      const updated = [newLeaveRequest, ...prev];
      console.log('Updated leave requests:', updated);
      return updated;
    });
    
    toast.success('Leave request submitted successfully');
  };

  const updateLeaveRequest = (id: string, status: LeaveStatus) => {
    setLeaveRequests(prev => 
      prev.map(leave => {
        if (leave.id === id) {
          const parentApproval = user?.role === 'parent' ? status === 'approved' : leave.parentApproval;
          const adminApproval = user?.role === 'admin' ? status === 'approved' : leave.adminApproval;
          
          let finalStatus = leave.status;
          let finalApproval = false;
          
          if (status === 'rejected') {
            finalStatus = 'rejected';
          } else if (parentApproval && adminApproval) {
            finalStatus = 'approved';
            finalApproval = true;
          } else {
            finalStatus = 'pending';
          }
          
          return {
            ...leave,
            parentApproval,
            adminApproval,
            status: finalStatus,
            finalApproval,
            updatedAt: new Date().toISOString()
          };
        }
        return leave;
      })
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
