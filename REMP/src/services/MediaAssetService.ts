import apiClient from "../api/apiClient";
import { MediaType } from "../enums/mediaType";

export interface UploadMediaParams {
  files: File[];
  listingCaseId: number;
  type: MediaType;
}

export const uploadMediaToListingCase = async (params: UploadMediaParams) => {
  const formData = new FormData();

  params.files.forEach((file) => {
    formData.append("Files", file);
  });

  formData.append("ListingCaseId", params.listingCaseId.toString());
  formData.append("Type", params.type.toString());

  try {
    const response = await apiClient.post("/MediaAsset/uploadMediaToListingCase", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
    });
    return response.data;
  } catch (error) {
    console.error("uploadMediaToListingCase failed:", error);
    throw error;
  }
};

export const getMediaAssetsByListingId = async (listingCaseId: number) => {
  try {
    const response = await apiClient.get(`/MediaAsset/${listingCaseId}/media`);
    return response.data;
  } catch (error) {
    console.error("getMediaAssetsByListingId failed:", error);
    throw error;
  }
};
