import apiClient from "../apiClient";


export const deleteAgentById = async(id:string):Promise<void>=>{
    await apiClient.delete(`/User/delete-agent/${id}`);
};