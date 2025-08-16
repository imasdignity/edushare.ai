import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Extend the global File interface to include arrayBuffer
declare global {
  interface File {
    arrayBuffer(): Promise<ArrayBuffer>;
  }
}

interface UploadedFile {
  name: string;
  path: string;
}

/**
 * @file API route for handling assignment submissions
 * @description This file contains the API endpoint for submitting assignments with file uploads
 * 
 * Project Overview:
 * AI-Powered Educational Platform that enhances learning experience with personalized feedback
 * and robust progress tracking for students, teachers, and parents.
 * 
 * Key Features:
 * - Secure file uploads for assignment submissions
 * - AI-powered feedback system
 * - Progress tracking and reporting
 * - Multi-role support (Students, Teachers, Parents)
 */

/**
 * Handles POST request for assignment submission
 * @param request - The incoming request object
 * @returns Response with submission status and data
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const formData = await request.formData();
    
    // Get form fields
    const assignmentId = formData.get('assignmentId');
    const content = formData.get('content') || '';
    const files = formData.getAll('files') || [];
    
    if (!assignmentId) {
      return NextResponse.json(
        { message: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    // Save uploaded files
    const savedFiles = await Promise.all(
      files.map(file => saveFile(file, uploadsDir))
    );

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Create submission object
    const submission = {
      assignmentId: new ObjectId(assignmentId),
      studentId: new ObjectId(session.user.id),
      content,
      files: savedFiles,
      submittedAt: new Date(),
      status: 'submitted'
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        assignmentId,
        content,
        files,
      },
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { message: 'Failed to submit assignment', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
