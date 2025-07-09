import apiClient from "../apiClient";

export const deleteListingCaseById = async(listingId:number):Promise<void> =>{
    await apiClient.delete('/ListingCase/RemoveListingCase', {
        params: { listingCaseId: listingId }
    });
};