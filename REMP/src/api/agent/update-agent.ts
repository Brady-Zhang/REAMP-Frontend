import { updateAgentForm } from "../../interfaces/agent-request"
import apiClient from "../apiClient"

export const updateAgent = async (form: updateAgentForm): Promise<void> => {
  const formData = new FormData();
  formData.append("Id", form.id);
  formData.append("Email", form.email);
  formData.append("AgentFirstName", form.agentFirstName);
  formData.append("AgentLastName", form.agentLastName);
  formData.append("PhoneNumber", form.phoneNumber);
  formData.append("CompanyName", form.companyName);
  if (form.avatarImage) {
    formData.append("AvatarImage", form.avatarImage);
  }

  await apiClient.put("/User/update-agent", formData);
};