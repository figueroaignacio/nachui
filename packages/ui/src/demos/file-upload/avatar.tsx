'use client';

import { Camera01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUpload, useFileUploadContext } from '../../components/file-upload';

function AvatarDropzone() {
  const { files } = useFileUploadContext();
  const preview = files[0]?.preview;

  return (
    <FileUpload.Dropzone
      aria-label="Upload avatar"
      className="size-24 min-h-0 overflow-hidden rounded-full p-0"
    >
      {preview ? (
        <img src={preview} alt="" className="size-full object-cover" />
      ) : (
        <HugeiconsIcon icon={Camera01Icon} strokeWidth={1.5} />
      )}
    </FileUpload.Dropzone>
  );
}

export function Avatar() {
  return (
    <FileUpload accept="image/*" maxSize={1024 * 1024} className="w-auto items-center gap-2">
      <AvatarDropzone />
      <p className="text-muted-foreground text-xs">PNG or JPG up to 1 MB</p>
      <FileUpload.Clear>Remove photo</FileUpload.Clear>
      <FileUpload.Errors className="text-center" />
    </FileUpload>
  );
}
