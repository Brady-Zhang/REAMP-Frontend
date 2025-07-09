import defaultAvatar from '../assets/default-avatar.jpg'
import React, { useEffect, useState } from 'react';
import { getListingCaseDetail } from '../api/listingcase/listing-api';
import { Agent } from '../interfaces/agent-response';
import { getAllAgents } from '../api/agent/get-all-agents';
import { assignAgentToListing } from '../api/listingcase/listing-addAgent';

interface AssignAgentPopupContentProps {
  listingCaseId: number;
}

const AssignAgentPopupContent: React.FC<AssignAgentPopupContentProps> = ({ listingCaseId }) => {
  const [assignedAgents, setAssignedAgents] = useState<Agent[]>([]);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAll();
  }, [listingCaseId]);

  const fetchAll = async () => {
    try {
      const [all, detail] = await Promise.all([
        getAllAgents(),
        getListingCaseDetail(listingCaseId),
      ]);
      setAllAgents(all);
      setAssignedAgents(detail.agents ?? []);
    } catch (err) {
      console.error('Failed to fetch agent data:', err);
    }
  };

  const handleAssign = async (agentId: string) => {
    setAssigningId(agentId);
    setErrorMap((prev) => ({ ...prev, [agentId]: '' }));

    try {
      await assignAgentToListing(listingCaseId, agentId);
      await fetchAll();
    } catch (err: any) {
      const errorMessage = err?.message || 'Assignment failed';
      setErrorMap((prev) => ({ ...prev, [agentId]: errorMessage }));
    } finally {
      setAssigningId(null);
    }
  };

  const assignedIds = new Set(assignedAgents.map((a) => a.id));
  const availableAgents = allAgents.filter((a) => !assignedIds.has(a.id));

  return (
    <div className="space-y-6 mt-4">
      {/* Assigned Agents */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Assigned Agents</h3>
        {assignedAgents.length === 0 ? (
          <div className="text-gray-500">No agents assigned.</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {assignedAgents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <img
                  src={agent.avatarUrl || defaultAvatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">
                    {agent.firstName} {agent.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{agent.companyName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Agents */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Agents</h3>
        {availableAgents.length === 0 ? (
          <div className="text-gray-500">No more agents to assign.</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableAgents.map((agent) => (
              <div key={agent.id} className="flex flex-col gap-1 p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={agent.avatarUrl || defaultAvatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <div className="font-medium">
                        {agent.firstName} {agent.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{agent.companyName}</div>
                    </div>
                  </div>

                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-60"
                    onClick={() => handleAssign(agent.id)}
                    disabled={assigningId === agent.id}
                  >
                    {assigningId === agent.id ? 'Assigning...' : 'Assign'}
                  </button>
                </div>

                {errorMap[agent.id] && (
                  <div className="text-red-500 text-sm ml-14">{errorMap[agent.id]}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignAgentPopupContent;
