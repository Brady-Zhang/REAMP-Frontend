import { useState } from 'react';
import ListingDashboard from '../ListingDashBoard/ListingDashboard';
import AgentList from '../AgentList/AgentList';

const PhotographyCompanyPortal = () => {
  const [activeTab, setActiveTab] = useState<'listing' | 'agents'>('listing');

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'listing' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('listing')}
        >
          Listing Cases
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'agents' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('agents')}
        >
          Agents
        </button>
      </div>

      {activeTab === 'listing' ? (
        <ListingDashboard scope="company" />
      ) : (
        <AgentList scope="company" />
      )}
    </div>
  );
};
export default PhotographyCompanyPortal;