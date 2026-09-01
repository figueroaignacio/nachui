'use client';

import { CloudUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUpload } from '../../components/file-upload';

export function Multiple() {
  return (
    <FileUpload
      className="max-w-md"
      multiple
      maxFiles={3}
      maxSize={2 * 1024 * 1024}
      accept=".pdf,.docx,image/*"
    >
      <FileUpload.Dropzone>
        <HugeiconsIcon icon={CloudUploadIcon} strokeWidth={1.5} />
        <p className="text-foreground font-medium">Drop up to 3 files</p>
        <p className="text-xs">PDF, Word or images, 2 MB each</p>
      </FileUpload.Dropzone>
      <FileUpload.List />
      <FileUpload.Errors />
      <FileUpload.Clear>Remove all</FileUpload.Clear>
    </FileUpload>
  );
}
