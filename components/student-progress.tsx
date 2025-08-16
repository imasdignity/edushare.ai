'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';

type Student = {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  averageGrade: number;
  recentActivity: Array<{
    id: string;
    title: string;
    type: 'assignment' | 'grade' | 'announcement';
    date: Date;
    details?: string;
  }>;
};

export function StudentProgress() {
  // Mock data - replace with API calls in a real app
  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      grade: '8th Grade',
      attendance: 95,
      assignmentsCompleted: 24,
      totalAssignments: 30,
      averageGrade: 88,
      recentActivity: [
        {
          id: 'a1',
          title: 'Math Homework',
          type: 'assignment',
          date: new Date('2023-12-10'),
          details: 'Submitted on time',
        },
        {
          id: 'g1',
          title: 'Science Project',
          type: 'grade',
          date: new Date('2023-12-08'),
          details: 'Grade: 92/100',
        },
      ],
    },
    // Add more students if needed
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-500';
    if (grade >= 80) return 'text-blue-500';
    if (grade >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGradeIcon = (grade: number) => {
    if (grade >= 90) return <Icons.award className="h-5 w-5 text-green-500" />;
    if (grade >= 80) return <Icons.checkCircle className="h-5 w-5 text-blue-500" />;
    if (grade >= 70) return <Icons.alertCircle className="h-5 w-5 text-yellow-500" />;
    return <Icons.alertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Your Children</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{student.grade}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getGradeIcon(student.averageGrade)}
                  <span className={`font-medium ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{student.attendance}%</span>
                </div>
                <Progress value={student.attendance} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Assignments</span>
                  <span className="font-medium">
                    {student.assignmentsCompleted}/{student.totalAssignments} ({Math.round((student.assignmentsCompleted / student.totalAssignments) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(student.assignmentsCompleted / student.totalAssignments) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                <div className="space-y-3">
                  {student.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start text-sm">
                      <div className="mr-3 mt-0.5">
                        {activity.type === 'assignment' && (
                          <Icons.fileText className="h-4 w-4 text-blue-500" />
                        )}
                        {activity.type === 'grade' && (
                          <Icons.award className="h-4 w-4 text-green-500" />
                        )}
                        {activity.type === 'announcement' && (
                          <Icons.megaphone className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.details} • {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
