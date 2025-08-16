'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { AssignmentCard } from '@/components/assignment-card';
import { AssignmentSubmissionForm } from '@/components/assignment-submission-form';

export default function StudentDashboard() {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Mock data - in a real app, this would come from your API
  const assignments = [
    {
      id: '1',
      title: 'Math Homework',
      course: 'Mathematics 101',
      dueDate: new Date('2023-12-15'),
      points: 100,
      status: 'in-progress',
      description: 'Complete exercises 1-10 on page 45. Show all your work.',
    },
    {
      id: '2',
      title: 'Science Project',
      course: 'Physics 101',
      dueDate: new Date('2023-12-20'),
      points: 150,
      status: 'not-started',
      description: 'Research and present on a physics concept of your choice.',
    },
  ];

  const handleViewAssignment = (id: string) => {
    setSelectedAssignment(id);
    setShowSubmissionForm(true);
  };

  const handleSubmissionSuccess = () => {
    // Refresh assignments or update UI
    setShowSubmissionForm(false);
    setSelectedAssignment(null);
  };

  const selectedAssignmentData = assignments.find(a => a.id === selectedAssignment);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <Icons.bookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
                <Icons.calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <Icons.award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">A-</div>
                <p className="text-xs text-muted-foreground">92% overall</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Feedback</CardTitle>
                <Icons.sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">AI feedback received</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {showSubmissionForm && selectedAssignmentData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Submit Assignment: {selectedAssignmentData.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSubmissionForm(false);
                      setSelectedAssignment(null);
                    }}
                  >
                    <Icons.x className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedAssignmentData.course} • Due: {selectedAssignmentData.dueDate.toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <AssignmentSubmissionForm
                  assignmentId={selectedAssignmentData.id}
                  onSuccess={handleSubmissionSuccess}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Assignments</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icons.filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.sortAsc className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    title={assignment.title}
                    course={assignment.course}
                    dueDate={assignment.dueDate}
                    points={assignment.points}
                    status={assignment.status as any}
                    onClick={() => handleViewAssignment(assignment.id)}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
