import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { getLeaveRequests, createLeaveRequest as apiCreateLeave, updateLeaveRequestStatus } from '../services/api';

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
  fromTime: string; // New field for time selection
  toTime: string;   // New field for time selection
  reason: string;
  status: LeaveStatus;
  parentApproval: boolean;
  adminApproval: boolean;
  finalApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for API responses
interface ApiResponse {
  data: LeaveRequest;
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName' | 'parentApproval' | 'adminApproval' | 'finalApproval'>) => Promise<void>;
  updateLeaveRequest: (id: string, status: LeaveStatus) => Promise<void>;
  getStudentLeaves: (studentId: string) => LeaveRequest[];
  getPendingLeaves: () => LeaveRequest[];
  getAllLeaves: () => LeaveRequest[];
  loading: boolean;
  error: string | null;
  refetchLeaves: () => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Remove any stored leave requests from localStorage
  useEffect(() => {
    localStorage.removeItem('leaveRequests');
  }, []);

  // Function to fetch leaves from the API
  const fetchLeaves = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getLeaveRequests();
      console.log('Fetched leave requests:', response.data);
      
      // Ensure each leave request has a unique ID
      const uniqueLeaves = removeDuplicateLeaves(response.data);
      setLeaveRequests(uniqueLeaves);
      
      // Always save to localStorage for offline access
      localStorage.setItem('leaveRequests', JSON.stringify(uniqueLeaves));
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to fetch leave requests');
      
      // Fall back to localStorage data if API fails
      const storedLeaves = localStorage.getItem('leaveRequests');
      if (storedLeaves) {
        try {
          const parsedLeaves = JSON.parse(storedLeaves);
          const uniqueLeaves = removeDuplicateLeaves(parsedLeaves);
          setLeaveRequests(uniqueLeaves);
        } catch (parseErr) {
          console.error('Error parsing stored leave requests:', parseErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to remove duplicate leave requests by ID
  const removeDuplicateLeaves = (leaves: LeaveRequest[]): LeaveRequest[] => {
    const uniqueLeaves = new Map<string, LeaveRequest>();
    
    leaves.forEach(leave => {
      uniqueLeaves.set(leave.id, leave);
    });
    
    return Array.from(uniqueLeaves.values());
  };

  // Fetch leaves when component mounts and when user changes
  useEffect(() => {
    if (user) {
      fetchLeaves();
    } else {
      setLeaveRequests([]);
    }
  }, [user]);

  // Create a new leave request
  const createLeaveRequest = async (data: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'studentId' | 'studentName' | 'parentApproval' | 'adminApproval' | 'finalApproval'>) => {
    if (!user) {
      toast.error('You must be logged in to create a leave request');
      return;
    }

    try {
      setLoading(true);
      const response = await apiCreateLeave(data);
      
      // Check if response contains data before proceeding
      if (response && typeof response === 'object' && 'data' in response) {
        const apiResponse = response as ApiResponse;
        console.log('Created leave request:', apiResponse.data);
        
        // Add the new leave to the state using our uniqueness function
        const newLeave = apiResponse.data;
        const updatedLeaves = removeDuplicateLeaves([newLeave, ...leaveRequests]);
        setLeaveRequests(updatedLeaves);
        
        toast.success('Leave request submitted successfully');
        
        // Update localStorage
        localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error creating leave request:', err);
      toast.error('Failed to submit leave request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a leave request status
  const updateLeaveRequest = async (id: string, status: LeaveStatus) => {
    try {
      setLoading(true);
      const response = await updateLeaveRequestStatus(id, status);
      
      // Check if response contains data before proceeding
      if (response && typeof response === 'object' && 'data' in response) {
        const apiResponse = response as ApiResponse;
        console.log('Updated leave request:', apiResponse.data);
        
        // Find the updated leave in our state
        const updatedLeave = apiResponse.data;
        
        // Update the leave in the state, ensuring no duplicates
        const updatedLeaves = leaveRequests.map(leave => 
          leave.id === id ? updatedLeave : leave
        );
        
        setLeaveRequests(updatedLeaves);
        
        // Update localStorage
        localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves));
        
        toast.success(`Leave request ${status}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating leave request:', err);
      toast.error('Failed to update leave request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to filter leaves
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
      getAllLeaves,
      loading,
      error,
      refetchLeaves: fetchLeaves
    }}>
      {children}
    </LeaveContext.Provider>
  );
};
