import { isAxiosError } from "axios";
import apiClient from "../apiClient";

export const assignAgentToListing = async (listingCaseId: number, agentId: string): Promise<void> => {
  try {
    const res = await apiClient.post('/ListingCase/AddAgentToListingCase', {
      listingCaseId,
      agentId,
    });

    if (!res.data.success) {
      throw new Error(res.data.message || 'Unknown error');
    }
  } catch (error: any) {
    if (isAxiosError(error) && error.response?.status === 409) {
      const msg = error.response.data?.message;
      throw new Error(msg);
    }

    throw new Error('Failed to assign agent, try again later.');
  }
};