'use client';

import { FileUpload, useFileUploadContext } from '../../components/file-upload';
import { CameraIcon } from '../../icons/camera';

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
        <CameraIcon strokeWidth={1.5} />
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
