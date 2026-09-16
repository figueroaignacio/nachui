'use client';

import { FileUpload } from '../../components/file-upload';
import { PaperclipIcon } from '../../icons/paperclip';

export function Compact() {
  return (
    <FileUpload className="max-w-md" multiple accept="image/*,.pdf">
      <div className="flex items-center gap-3">
        <FileUpload.Trigger>
          <PaperclipIcon />
          Attach files
        </FileUpload.Trigger>
        <span className="text-muted-foreground text-xs">Images or PDF</span>
      </div>
      <FileUpload.List className="flex-row flex-wrap">
        {(file) => (
          <FileUpload.Item file={file} className="max-w-56 py-2 ps-2 pe-2">
            <FileUpload.ItemPreview className="size-8 rounded-sm [&_svg]:size-4" />
            <FileUpload.ItemInfo className="gap-0 [&>span:last-child]:hidden" />
            <FileUpload.ItemRemove className="size-6" />
          </FileUpload.Item>
        )}
      </FileUpload.List>
      <FileUpload.Errors />
    </FileUpload>
  );
}
