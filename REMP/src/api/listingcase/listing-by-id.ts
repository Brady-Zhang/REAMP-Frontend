import { AxiosResponse } from "axios";
import { ListingCaseDetail } from "../../interfaces/listing-case";
import apiClient from "../apiClient";

export const getListingCaseById = async(id:number):Promise<ListingCaseDetail> => {
    const response:AxiosResponse<ListingCaseDetail> = await apiClient.get(`/ListingCase/${id}`)
    return response.data;
}