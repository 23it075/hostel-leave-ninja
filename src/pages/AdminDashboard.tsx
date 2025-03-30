
import React from 'react';
import { useLeave, LeaveRequest } from '@/contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { leaveRequests, updateLeaveRequest } = useLeave();
  
  const pendingLeaves = leaveRequests.filter(leave => leave.status === 'pending');
  const approvedLeaves = leaveRequests.filter(leave => leave.status === 'approved');
  const rejectedLeaves = leaveRequests.filter(leave => leave.status === 'rejected');
  const allLeaves = [...leaveRequests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const handleApprove = (id: string) => {
    updateLeaveRequest(id, 'approved');
  };
  
  const handleReject = (id: string) => {
    updateLeaveRequest(id, 'rejected');
  };

  const LeaveStatusBadge: React.FC<{ status: LeaveRequest['status'] }> = ({ status }) => {
    const statusConfig = {
      pending: { icon: <Clock className="h-4 w-4 mr-1" />, class: 'leave-status-pending' },
      approved: { icon: <CheckCircle className="h-4 w-4 mr-1" />, class: 'leave-status-approved' },
      rejected: { icon: <XCircle className="h-4 w-4 mr-1" />, class: 'leave-status-rejected' }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const LeaveCard: React.FC<{ leave: LeaveRequest; isPending?: boolean }> = ({ leave, isPending }) => {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{leave.studentName}</CardTitle>
              <CardDescription>
                Created on {format(new Date(leave.createdAt), 'PPP')}
              </CardDescription>
            </div>
            <LeaveStatusBadge status={leave.status} />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-sm font-medium">From Date</p>
              <p className="text-sm">{format(new Date(leave.fromDate), 'PPP')}</p>
            </div>
            <div>
              <p className="text-sm font-medium">To Date</p>
              <p className="text-sm">{format(new Date(leave.toDate), 'PPP')}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Reason</p>
            <p className="text-sm text-gray-700">{leave.reason}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">Parent Approval</p>
            <p className="text-sm">
              {leave.parentApproval === true 
                ? 'Approved' 
                : leave.parentApproval === false 
                  ? 'Rejected' 
                  : 'Pending'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Last updated: {format(new Date(leave.updatedAt), 'PPP')}
          </div>
          
          {isPending && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleReject(leave.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                size="sm"
                onClick={() => handleApprove(leave.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leaveRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingLeaves.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leaveRequests.length > 0 
                ? `${Math.round((approvedLeaves.length / (approvedLeaves.length + rejectedLeaves.length || 1)) * 100)}%` 
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Leave Management
        </h3>
        <p className="text-muted-foreground">Comprehensive view of all leave requests</p>
      </div>
      
      {pendingLeaves.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-800">
            You have {pendingLeaves.length} pending leave {pendingLeaves.length === 1 ? 'request' : 'requests'} that require your attention.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue={pendingLeaves.length > 0 ? "pending" : "all"}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="pending" className="mt-0">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending leave requests to approve.</p>
                </div>
              ) : (
                pendingLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} isPending={true} />
                ))
              )}
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              {approvedLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No approved leave requests.</p>
                </div>
              ) : (
                approvedLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} />
                ))
              )}
            </TabsContent>
            <TabsContent value="rejected" className="mt-0">
              {rejectedLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No rejected leave requests.</p>
                </div>
              ) : (
                rejectedLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} />
                ))
              )}
            </TabsContent>
            <TabsContent value="all" className="mt-0">
              {allLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No leave requests available.</p>
                </div>
              ) : (
                allLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} isPending={leave.status === 'pending'} />
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
