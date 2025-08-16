'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { FileUpload } from '@/components/file-upload';
import { useToast } from '@/components/ui/use-toast';

export function AssignmentSubmissionForm({
  assignmentId,
  initialContent = '',
  onSuccess,
  className,
}: {
  assignmentId: string;
  initialContent?: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setFiles((prev) => [...prev, file]);
    return Promise.resolve();
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && files.length === 0) {
      toast({
        title: 'Error',
        description: 'Please provide a submission or upload a file',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('content', content);
      
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      toast({
        title: 'Success',
        description: 'Your assignment has been submitted successfully!',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit assignment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateFeedback = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide some content before generating feedback',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingFeedback(true);

    try {
      const response = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          submission: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Feedback generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="content">Your Submission</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your assignment here..."
            className="min-h-[200px]"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments (Optional)</Label>
          <FileUpload
            onFileUpload={handleFileUpload}
            className="w-full"
          />
          
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Icons.file className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                    disabled={isSubmitting}
                  >
                    <Icons.x className="h-3 w-3" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={isSubmitting || isGeneratingFeedback}>
            {isSubmitting ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Assignment'
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateFeedback}
            disabled={isGeneratingFeedback || isSubmitting || !content.trim()}
          >
            {isGeneratingFeedback ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Get AI Feedback
              </>
            )}
          </Button>
        </div>
      </form>

      {feedback && (
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">AI Feedback</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback('')}
              className="h-8 px-2"
            >
              <Icons.x className="h-4 w-4" />
              <span className="sr-only">Close feedback</span>
            </Button>
          </div>
          <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap text-sm">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
