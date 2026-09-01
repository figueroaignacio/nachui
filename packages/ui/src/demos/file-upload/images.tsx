'use client';

import { ImageAdd01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUpload } from '../../components/file-upload';

export function Images() {
  return (
    <FileUpload className="max-w-md" multiple accept="image/*" maxFiles={6}>
      <FileUpload.Dropzone className="min-h-32">
        <HugeiconsIcon icon={ImageAdd01Icon} strokeWidth={1.5} />
        <p className="text-foreground font-medium">Drop images here</p>
        <p className="text-xs">Up to 6 images</p>
      </FileUpload.Dropzone>
      <FileUpload.List className="grid grid-cols-3 gap-2">
        {(file) => (
          <FileUpload.Item file={file} className="group relative aspect-square p-0">
            <FileUpload.ItemPreview className="size-full rounded-lg [&_svg]:size-8" />
            <FileUpload.ItemRemove className="bg-background/90 absolute top-1.5 right-1.5 size-6 opacity-0 shadow-sm group-focus-within:opacity-100 group-hover:opacity-100" />
          </FileUpload.Item>
        )}
      </FileUpload.List>
      <FileUpload.Errors />
    </FileUpload>
  );
}
