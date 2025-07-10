import React from 'react';
import { Agent } from '../../interfaces/agent-response';

type Props = {
    agent: Agent;
};

const AgentCard: React.FC<Props> = ({ agent }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold">First Name: {agent.firstName}</h2>
            <h2 className="text-lg font-semibold">Last Name: {agent.lastName}</h2>
            <p className="text-gray-600">Email: {agent.email}</p>
            <p className="text-gray-600">Phone: {agent.phoneNumber}</p>
        </div>
    );
};

export default AgentCard;
