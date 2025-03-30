
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave, LeaveRequest, LeaveType, LEAVE_TYPE_LABELS } from '@/contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { createLeaveRequest, getStudentLeaves } = useLeave();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('home_leave');

  const studentLeaves = user ? getStudentLeaves(user.id) : [];
  const pendingLeaves = studentLeaves.filter(leave => leave.status === 'pending');
  const approvedLeaves = studentLeaves.filter(leave => leave.status === 'approved');
  const rejectedLeaves = studentLeaves.filter(leave => leave.status === 'rejected');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate || !reason || !leaveType) return;
    
    createLeaveRequest({
      fromDate,
      toDate,
      reason,
      leaveType,
    });
    
    // Reset form
    setFromDate('');
    setToDate('');
    setReason('');
    setLeaveType('home_leave');
    setIsDialogOpen(false);
  };

  const LeaveStatusBadge: React.FC<{ status: LeaveRequest['status'] }> = ({ status }) => {
    const statusConfig = {
      pending: { icon: <Clock className="h-4 w-4 mr-1" />, class: 'bg-yellow-100 text-yellow-800' },
      approved: { icon: <CheckCircle className="h-4 w-4 mr-1" />, class: 'bg-green-100 text-green-800' },
      rejected: { icon: <XCircle className="h-4 w-4 mr-1" />, class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const LeaveCard: React.FC<{ leave: LeaveRequest }> = ({ leave }) => {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Leave Request</CardTitle>
              <CardDescription>
                {LEAVE_TYPE_LABELS[leave.leaveType]} • Created on {format(new Date(leave.createdAt), 'PPP')}
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
          <div className="mb-2">
            <p className="text-sm font-medium">Reason</p>
            <p className="text-sm text-gray-700">{leave.reason}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Parent Approval</p>
              <p className="text-sm">
                {leave.parentApproval ? 'Approved' : 'Pending'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Admin Approval</p>
              <p className="text-sm">
                {leave.adminApproval ? 'Approved' : 'Pending'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground">
            Last updated: {format(new Date(leave.updatedAt), 'PPP')}
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">My Leave Requests</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new leave request.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate">From Date</Label>
                    <Input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toDate">To Date</Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please explain why you need a leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="all" className="mt-0">
              {studentLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any leave requests yet.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(true)} 
                    className="mt-4"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create your first request
                  </Button>
                </div>
              ) : (
                studentLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} />
                ))
              )}
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending leave requests.</p>
                </div>
              ) : (
                pendingLeaves.map(leave => (
                  <LeaveCard key={leave.id} leave={leave} />
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
