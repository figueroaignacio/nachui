'use client';

import { CloudUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import { FileUpload, type FileWithPreview } from '../../components/file-upload';
import { Progress } from '../../components/progress';

function UploadRow({ file }: { file: FileWithPreview }) {
  const [value, setValue] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setValue((current) => {
        if (current >= 100) {
          if (timer.current) clearInterval(timer.current);
          return 100;
        }
        return Math.min(100, current + 8);
      });
    }, 180);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <FileUpload.Item file={file}>
      <FileUpload.ItemPreview />
      <FileUpload.ItemInfo>
        <div className="mt-1 flex items-center gap-2">
          <Progress value={value} className="h-1 rounded-full" />
          <span className="text-muted-foreground w-9 text-end text-xs tabular-nums">{value}%</span>
        </div>
      </FileUpload.ItemInfo>
      <FileUpload.ItemRemove />
    </FileUpload.Item>
  );
}

export function UploadProgress() {
  return (
    <FileUpload className="max-w-md" multiple maxFiles={4}>
      <FileUpload.Dropzone>
        <HugeiconsIcon icon={CloudUploadIcon} strokeWidth={1.5} />
        <p className="text-foreground font-medium">Drop files to start uploading</p>
        <p className="text-xs">Progress is simulated in this demo</p>
      </FileUpload.Dropzone>
      <FileUpload.List>{(file) => <UploadRow file={file} />}</FileUpload.List>
      <FileUpload.Errors />
    </FileUpload>
  );
}
