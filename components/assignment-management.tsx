'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';
import { CalendarIcon, Download, Edit, Plus } from 'lucide-react';

export type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  grade?: number;
};

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  courseId: string;
  submissions: Submission[];
};

export function AssignmentManagement() {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Math Homework',
      description: 'Complete exercises 1-10 on page 45. Show all your work.',
      dueDate: new Date('2023-12-15'),
      points: 100,
      courseId: 'math101',
      submissions: [
        { id: 's1', studentId: 'stud1', studentName: 'John Doe', submittedAt: new Date('2023-12-10'), grade: 95 },
        { id: 's2', studentId: 'stud2', studentName: 'Jane Smith', submittedAt: new Date('2023-12-12'), grade: 88 },
      ],
    },
    // Add more assignments as needed
  ]);

  const handleCreateAssignment = () => {
    setSelectedAssignment({
      id: 'new',
      title: '',
      description: '',
      dueDate: new Date(),
      points: 100,
      courseId: '',
      submissions: [],
    });
    setIsCreating(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedAssignment) return;
    
    // Basic validation
    if (!selectedAssignment.title.trim()) {
      alert('Please enter a title for the assignment');
      return;
    }
    
    if (selectedAssignment.points <= 0) {
      alert('Points must be greater than 0');
      return;
    }
    
    if (isCreating) {
      // Add new assignment
      const newAssignment: Assignment = {
        ...selectedAssignment,
        id: Date.now().toString(),
        submissions: []
      };
      setAssignments(prev => [...prev, newAssignment]);
    } else {
      // Update existing assignment
      setAssignments(prev => 
        prev.map(a => a.id === selectedAssignment.id ? { ...a, ...selectedAssignment } : a)
      );
    }
    
    setIsCreating(false);
    setSelectedAssignment(null);
  };

  const handleGradeSubmission = (submissionId: string, grade: string | number) => {
    const gradeValue = typeof grade === 'string' ? parseInt(grade, 10) || 0 : grade;
    
    setAssignments(prev => 
      prev.map(assignment => ({
        ...assignment,
        submissions: assignment.submissions.map(sub => 
          sub.id === submissionId ? { ...sub, grade: gradeValue } : sub
        )
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        <Button onClick={handleCreateAssignment}>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {isCreating && selectedAssignment && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={selectedAssignment.title}
              onChange={(e) =>
                setSelectedAssignment({ ...selectedAssignment, title: e.target.value })
              }
              placeholder="Assignment title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={selectedAssignment.description}
              onChange={(e) =>
                setSelectedAssignment({ ...selectedAssignment, description: e.target.value })
              }
              placeholder="Assignment description and instructions"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        setSelectedAssignment({ ...selectedAssignment, dueDate: newDate });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                value={selectedAssignment.points}
                onChange={(e) =>
                  setSelectedAssignment({
                    ...selectedAssignment,
                    points: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment}>Save Assignment</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Due: {format(assignment.dueDate, 'MMM d, yyyy')} • {assignment.points} points • {assignment.submissions.length} submissions
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {assignment.submissions.length > 0 && (
              <div className="p-4">
                <h4 className="font-medium mb-3">Submissions</h4>
                <div className="space-y-3">
                  {assignment.submissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{submission.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {format(submission.submittedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          className="w-20"
                          placeholder="Grade"
                          value={submission.grade || ''}
                          onChange={(e) =>
                            handleGradeSubmission(
                              submission.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        <span className="text-sm text-muted-foreground">/ {assignment.points}</span>
                        <Button variant="ghost" size="icon">
                          <Icons.download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
