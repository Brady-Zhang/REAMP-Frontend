import { AxiosResponse } from "axios"
import { Agent } from "../../interfaces/agent-response";
import apiClient from "../apiClient";

export const getAllAgents = async():Promise<Agent[]> =>{
    const response : AxiosResponse<Agent[]> = await apiClient.get('/User/GetAllAgents');
    return response.data
}