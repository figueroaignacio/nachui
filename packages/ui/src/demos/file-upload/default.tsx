'use client';

import { CloudUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUpload } from '../../components/file-upload';

export function Default() {
  return (
    <FileUpload className="max-w-md" maxSize={5 * 1024 * 1024}>
      <FileUpload.Dropzone>
        <HugeiconsIcon icon={CloudUploadIcon} strokeWidth={1.5} />
        <p className="text-foreground font-medium">Drop a file here or click to browse</p>
        <p className="text-xs">Any file up to 5 MB</p>
      </FileUpload.Dropzone>
      <FileUpload.List />
      <FileUpload.Errors />
    </FileUpload>
  );
}
