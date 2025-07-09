import { CaseContactRequestDto, CaseContactResponseDto } from "../interfaces/CaseContact";
import apiClient from "./apiClient";

export const addCaseContact = async (
  payload: CaseContactRequestDto
): Promise<CaseContactResponseDto> => {
  const resp = await apiClient.post<CaseContactResponseDto>(
    '/CaseContact/caseContact',
    payload
  );
  return resp.data;
};

export const getCaseContactsByListing = async (
  listingCaseId: number
): Promise<CaseContactResponseDto[]> => {
  const resp = await apiClient.get<CaseContactResponseDto[]>(
    `/CaseContact/caseContacts/${listingCaseId}`
  );
  return resp.data;
};
