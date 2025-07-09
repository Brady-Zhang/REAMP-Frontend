import { useDropzone } from 'react-dropzone';
import { FaRegFolderOpen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { uploadMediaToListingCase, getMediaAssetsByListingId } from '../services/MediaAssetService';
import { MediaType } from '../enums/mediaType';
import { MediaAssetResponseDto } from '../interfaces/MediaAssetResponseDto';

interface GenericMediaUploadFormProps {
  listingId: number;
  mediaType: MediaType;
  existingAssets: MediaAssetResponseDto[];
  onUploadSuccess: () => void;
}

export default function GenericMediaUploadForm({
  listingId,
  mediaType,
  existingAssets,
  onUploadSuccess,
}: GenericMediaUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [existingMediaAssets, setExistingMediaAssets] = useState<MediaAssetResponseDto[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const getAcceptType = (): { [key: string]: string[] } => {
    switch (mediaType) {
      case MediaType.Video:
        return { 'video/*': [] };
      case MediaType.FloorPlan:
      case MediaType.VRTour:
      default:
        return { 'image/*': [] };
    }
  };
  const filteredAssets = existingAssets.filter(
    (a) => Number(a.mediaType) === mediaType
  );

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    accept: getAcceptType(),
    multiple: true,
    maxFiles: 20,
    maxSize: 100 * 1024 * 1024,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, [acceptedFiles]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await uploadMediaToListingCase({
        files: selectedFiles,
        listingCaseId: listingId,
        type: mediaType,
      });
      setSelectedFiles([]);
      onUploadSuccess();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {filteredAssets.length > 0 && (
        <div className="space-y-2">
          <p className="text-white font-semibold">Previously uploaded {MediaType[mediaType]}:</p>
          <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
            {filteredAssets.map((media) => (
              <div key={media.id} className="border p-1 rounded">
                {mediaType === MediaType.Video ? (
                  <video src={media.mediaUrl ?? ''} controls className="w-full h-24 rounded" />
                ) : (
                  <img src={media.mediaUrl ?? ''} alt={media.fileName || media.id.toString()} className="object-cover w-full h-24 rounded" />
                )}
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
        <p className="text-white font-semibold mb-4">Drop your files here to upload</p>
        <div className="inline-flex items-center gap-2 px-[36px] py-[14px] h-[44px] bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm font-medium justify-center mx-auto">
          <FaRegFolderOpen className="text-base" />
          Choose files
        </div>
      </div>

      {/* Preview area */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative border p-1 rounded">
              <button
                onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-4 h-4 text-s flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              {mediaType === MediaType.Video ? (
                <video src={URL.createObjectURL(file)} controls className="w-full h-24 rounded" />
              ) : (
                <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover w-full h-24 rounded" />
              )}
              <p className="text-xs truncate mt-1 text-center">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Rejection info */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 text-sm">
          Some files were rejected (wrong type or too large)
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
        {selectedFiles.length > 0 ? (
          <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold">
            {selectedFiles.length} files
          </div>
        ) : (
          <div></div>
        )}

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
