'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icons } from './icons';
import { Button } from './ui/button';

export function FileUpload({
  onFileUpload,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: {
  onFileUpload: (file: File) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFile(file);
      setError(null);
      setIsUploading(true);

      try {
        await onFileUpload(file);
      } catch (err) {
        setError('Failed to upload file. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message || 'File not accepted';
      setError(error);
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Icons.upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {isDragActive ? (
              <p>Drop the file here</p>
            ) : (
              <p>
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
            )}
            <p className="text-xs mt-1">
              {Object.values(accept)
                .flat()
                .join(', ')}{' '}
              (max {formatFileSize(maxSize)})
            </p>
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center space-x-2">
            <Icons.file className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          {isUploading ? (
            <Icons.loader className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              <Icons.x className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-destructive flex items-center">
          <Icons.alertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
