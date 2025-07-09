import { Agent } from "../../interfaces/agent-response";
import { mapEamilReturnToAgent } from "../../lib/map-to-agent";
import apiClient from "../apiClient";

export const getAgentByEmail = async (email: string): Promise<Agent> => {
  const response = await apiClient.get(`/User/FindAgentByEmail/${email}`);
  return mapEamilReturnToAgent(response.data);
};