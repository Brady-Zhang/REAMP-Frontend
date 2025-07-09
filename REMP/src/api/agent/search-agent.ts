import { Agent, AgentByEmail } from "../../interfaces/agent-response";
import { mapEamilReturnToAgent } from "../../lib/map-to-agent";
import apiClient from "../apiClient";

export const searchAgent = async (searchTerm: string): Promise<Agent[]> => {
  const response = await apiClient.get('/User/search-agent', {
    params: { searchTerm }
  });

  return response.data.map((item: AgentByEmail) => mapEamilReturnToAgent(item));
  return response.data.map((item: AgentByEmail) => mapEamilReturnToAgent(item));
};
