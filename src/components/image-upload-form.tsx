import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, ImageIcon } from 'lucide-react';

interface ImageUploadFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export function ImageUploadForm({ onSubmit, isLoading }: ImageUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only accept image files
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 10485760, // 10MB
    onDropRejected: () => {
      setError('File rejected. Please ensure it is an image and under 10MB.');
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter analysis instructions');
      return;
    }

    const formData = new FormData();
    formData.append('prompt', prompt);
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    }
  };
  
  // Listen for prompt events from the context
  useEffect(() => {
    const handleSetPrompt = (e: CustomEvent) => {
      setPrompt(e.detail);
    };
    
    window.addEventListener('set-prompt', handleSetPrompt as EventListener);
    
    return () => {
      window.removeEventListener('set-prompt', handleSetPrompt as EventListener);
    };
  }, []);
  
  // Clear files when a new analysis is loaded from saved analyses
  useEffect(() => {
    const handleClearForm = () => {
      setFiles([]);
      setPrompt('');
    };
    
    window.addEventListener('clear-form', handleClearForm);
    
    return () => {
      window.removeEventListener('clear-form', handleClearForm);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium text-lg">Drag images here or click to browse</h3>
            <p className="text-sm text-muted-foreground">
              Upload JPEG, PNG or GIF images (max 10MB)
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium">
          Analysis Instructions
        </label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want Claude to analyze in these images..."
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          You can select sample prompts from the sidebar or write your own.
        </p>
      </div>

      {error && (
        <div className="text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading || files.length === 0 || !prompt.trim()}
        className="w-full"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Images'}
      </Button>
    </form>
  );
}