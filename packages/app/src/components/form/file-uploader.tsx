import { type ChangeEvent, useEffect, useMemo, useState, type DragEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/custom/loading-button';
import { useRouteContext } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, File, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FileUploaderProps = {
  multiple?: boolean;
  accept?: string[];
  path: string;
  customName?: string;
  label?: string;
  initialValues?: FileUploaderData[];
  onUploaded?: (attributes: { key: string; url: string; type: string, name: string }[]) => void;
};

type FileUploaderData = {
  uploadUrl?: string;
  file: File;
  key?: string;
  fileUrl?: string;
  type?: string;
  name?: string;
  status: 'pending' | 'uploaded' | 'error';
};

export function FileUploader(props: FileUploaderProps) {
  const { trpc } = useRouteContext({
    from: '/_app',
  });

  const [files, setFiles] = useState<FileUploaderData[]>(props.initialValues || []);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const completionRate = useMemo(() => {
    return files.filter((f) => f.status !== 'pending').length / files.length;
  }, [files]);

  const isComplete = useMemo(() => {
    return completionRate === 1 && files.every(f => f.status === 'uploaded');
  }, [completionRate, files]);

  const hasErrors = useMemo(() => {
    return files.some(f => f.status === 'error');
  }, [files]);

  useEffect(() => {
    if (isComplete) {
      setUploading(false);
      props.onUploaded?.(files.map((f) => ({ key: f.key || '', url: f.uploadUrl || '', type: f.type || '', name: f.name || '' })));
    }
  }, [isComplete]);

  const uploadUrlMutation = useMutation(trpc.files.getUploadUrl.mutationOptions());
  const uploadFileMutation = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { url: string; file: File; name: string }) => {
      console.log('### UPLOADING ###', data);
      const response = await fetch(data.url, {
        body: data.file,
        method: 'PUT',
        headers: {
          'Content-Type': data.file.type,
          'Content-Disposition': `attachment; filename="${data.name}"`,
        },
      });
      return {
        url: response.url,
      };
    },
  });

  const handleFiles = (newFiles: FileList | File[]) => {
    const files = Array.from(newFiles).map(
      (f) =>
        ({
          file: f,
          status: 'pending',
        } as FileUploaderData)
    );
    setFiles(files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      // If multiple is false, only take the first file
      const filesToHandle = props.multiple 
        ? droppedFiles 
        : [droppedFiles[0]];
      handleFiles(filesToHandle);
    }
  };

  const uploadFile = async (file: FileUploaderData, index: number) => {
    try {
      const extension = file.file.name.split(".")[1];
      const name = props.customName 
        ? `${props.customName}-${index}${extension ? `.${extension}` : ""}` 
        : file.file.name;

      console.log('### GETTING URL ###', name);
      
      const urlData = await uploadUrlMutation.mutateAsync({
        scope: 'user',
        path: props.path,
        contentType: file.file.type,
        size: file.file.size,
        name,
      });

      console.log('### UPLOADING FILE ###', urlData);
      
      const uploadResponse = await uploadFileMutation.mutateAsync({
        url: urlData.url,
        file: file.file,
        name,
      });

      console.log('### UPLOAD RESPONSE ###', uploadResponse);

      setFiles(currentFiles => 
        currentFiles.map((f, i) => 
          i === index ? { ...f, key: urlData.key, status: 'uploaded', uploadUrl: uploadResponse.url, type: extension, name: name } : f
        )
      );
    } catch (error) {
      console.error('### UPLOAD ERROR ###', error);
      setFiles(currentFiles => 
        currentFiles.map((f, i) => 
          i === index ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const uploadPromises = files
      .filter(f => f.status === 'pending' || f.status === 'error')
      .map((file, index) => uploadFile(file, index));

    try {
      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error('### UPLOAD ERROR ###', error);
    }
  };

  const handleRetry = async (index: number) => {
    await uploadFile(files[index], index);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: FileUploaderData) => {
    switch (file.status) {
      case 'uploaded':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full space-y-1.5">
        <Label htmlFor="file-uploader">{props.label || 'Upload Files'}</Label>
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:bg-gray-50",
            uploading && "pointer-events-none opacity-60"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className={cn(
            "h-10 w-10",
            isDragging ? "text-primary" : "text-gray-400"
          )} />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-uploader"
              className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
            >
              <span>Click to upload</span>
              <Input
                id="file-uploader"
                type="file"
                className="sr-only"
                accept={props.accept?.join(',') || 'image/png,image/jpeg'}
                multiple={props.multiple}
                onChange={handleChange}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {props.accept 
              ? `Accepted formats: ${props.accept.join(', ')}`
              : 'PNG, JPG up to 10MB'}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <span className="text-sm font-medium">{file.file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'error' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(index)}
                        disabled={uploading}
                      >
                        Retry
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => handleRemoveFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            {(uploading || isComplete) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "font-medium",
                    hasErrors ? "text-red-500" : isComplete ? "text-green-500" : "text-gray-700"
                  )}>
                    {hasErrors ? "Some files failed to upload" : 
                     isComplete ? "Upload complete" : "Uploading..."}
                  </span>
                  <span className="text-gray-500">{Math.round(completionRate * 100)}%</span>
                </div>
                <Progress value={completionRate * 100} className={cn(
                  hasErrors && "[&>div]:bg-red-500",
                  isComplete && "[&>div]:bg-green-500"
                )} />
              </div>
            )}

            <LoadingButton
              onClick={handleUpload}
              loading={uploading}
              disabled={isComplete || files.length === 0}
              className="w-full"
            >
              {hasErrors ? "Retry Failed Uploads" : "Upload Files"}
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
}
