'use client';

import { FileUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { FileUpload } from '../../components/file-upload';

export function Documents() {
  return (
    <FileUpload
      className="border-border bg-card max-w-md rounded-xl border p-5"
      multiple
      maxFiles={3}
      maxSize={10 * 1024 * 1024}
      accept=".pdf,.png,.jpg,.jpeg"
    >
      <div>
        <p className="text-sm font-medium">Verify your identity</p>
        <p className="text-muted-foreground text-xs">
          Upload a passport or ID card. We delete the files once the review is done.
        </p>
      </div>
      <FileUpload.Dropzone className="min-h-28">
        <HugeiconsIcon icon={FileUploadIcon} strokeWidth={1.5} />
        <p className="text-foreground text-sm font-medium">Drop your documents</p>
        <p className="text-xs">PDF, PNG or JPG, up to 10 MB each</p>
      </FileUpload.Dropzone>
      <FileUpload.List />
      <FileUpload.Errors />
      <div className="flex items-center justify-end gap-2">
        <FileUpload.Clear className="me-auto">Clear</FileUpload.Clear>
        <Button size="sm" variant="ghost">
          Later
        </Button>
        <Button size="sm">Submit</Button>
      </div>
    </FileUpload>
  );
}
