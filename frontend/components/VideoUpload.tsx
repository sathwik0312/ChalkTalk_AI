"use client";

import React, { useState } from 'react';
import { Upload, FileVideo, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface VideoUploadProps {
  onUploadComplete: (data: any) => void;
}

export default function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (file.type !== 'video/mp4') {
      setError('Please upload an MP4 file.');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        className={clsx(
          "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400",
          isUploading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="video/mp4" 
          className="hidden" 
          id="video-upload"
          onChange={handleFileInput}
        />
        
        {isUploading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Processing lecture video...</p>
            <p className="text-slate-400 text-sm mt-1">Extracting frames & analyzing pedagogy</p>
          </div>
        ) : (
          <label htmlFor="video-upload" className="flex flex-col items-center cursor-pointer max-w-sm text-center">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Lecture Video</h3>
            <p className="text-slate-500 mb-6">Drag and drop your .mp4 file here, or click to browse</p>
            <span className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Select Video
            </span>
          </label>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </div>
  );
}
