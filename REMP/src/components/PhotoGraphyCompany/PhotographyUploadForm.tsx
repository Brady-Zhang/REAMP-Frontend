import { useDropzone } from 'react-dropzone';
import { FaRegFolderOpen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { MediaAssetResponseDto } from '../../interfaces/MediaAssetResponseDto';
import { uploadMediaToListingCase } from '../../services/MediaAssetService';
import { MediaType } from '../../enums/mediaType';


type PhotographyUploadFormProps = {
  listingId: number;
  existingAssets: MediaAssetResponseDto[];
  onUploadSuccess: () => void;
};

export default function PhotographyUploadForm({
  listingId,
  existingAssets,
  onUploadSuccess,
}: PhotographyUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: 20,
    maxSize: 10 * 1024 * 1024,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, [acceptedFiles]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select images to upload.');
      return;
    }

    setIsUploading(true);
    try {
      await uploadMediaToListingCase({
        files: selectedFiles, // Fix readonly issue
        listingCaseId: listingId,
        type: MediaType.Picture,
      });
      alert('Upload successful!');
      setSelectedFiles([]);
      onUploadSuccess();
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {existingAssets.length > 0 && (
        <div className="space-y-2">
          <p className="text-white font-semibold">Previously uploaded images:</p>
          <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
            {existingAssets.map((media) => (
              <div key={media.id} className="border p-1 rounded">
                <img
                  src={media.mediaUrl ?? ''}
                  alt={media.fileName || media.id.toString()}
                  className="object-cover w-full h-24 rounded"
                />
                <p className="text-xs truncate mt-1 text-center">
                  {media.fileName || media.id.toString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Dropzone area */}
      <div
        {...getRootProps({
          className:
            'border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer transition hover:border-blue-400',
        })}
      >
        <input {...getInputProps()} />

        {/* Title */}
        <p className="text-white font-semibold mb-4">Drop your images here to upload</p>

        {/* Choose files button */}
        <div className="inline-flex items-center gap-2 px-[36px] py-[14px] h-[44px] bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm font-medium justify-center mx-auto">
          <FaRegFolderOpen className="text-base" />
          Choose files
        </div>
      </div>

      {/* Preview area for current upload */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative border p-1 rounded">
              <button
                onClick={() =>
                  setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-4 h-4 text-s flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="object-cover w-full h-24 rounded"
              />
              <p className="text-xs truncate mt-1 text-center">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error messages */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 text-sm">
          Some files were rejected (wrong type or too large)
        </div>
      )}

      {/* Image count + Upload button in one line */}
      <div className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
        {/* Image count */}
        {selectedFiles.length > 0 ? (
          <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold">
            {selectedFiles.length} images
          </div>
        ) : (
          <div></div> // Placeholder to keep alignment
        )}

        {/* Upload and Clear button */}
        <button
          type="button"
          onClick={() => setSelectedFiles([])}
          className="flex items-center justify-center h-[44px] px-[36px] rounded-full bg-blue-500 text-white hover:bg-blue-600 gap-[10px] disabled:opacity-50"
        >
          Clear preview area
        </button>

        <button
          type="button"
          onClick={handleUpload}
          className="flex items-center justify-center h-[44px] px-[36px] rounded-full bg-blue-500 text-white hover:bg-blue-600 gap-[10px] disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
