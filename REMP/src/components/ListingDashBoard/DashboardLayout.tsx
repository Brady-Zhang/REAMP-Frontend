import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import DashboardNavbar from './DashboardNavbar';
import PhotographyCompanyDashboard from '../PhotographyCompanyDashboard';
import AgentList from '../AgentList/AgentList';
import ListingDashboard from './ListingDashboard';

const allNavItems = ['Listing', 'Agents', 'Photography companies'] as const;
type ButtonType = typeof allNavItems[number];

interface DashboardLayoutProps {
  children?: ReactNode;
  scope?: 'company' | 'admin';
}

const DashboardLayout = ({ children, scope }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect unauthenticated or agent users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'Agent') {
      navigate('/AgentPropertyPage');
    }
  }, [user, navigate]);

  // Block rendering during redirect
  if (!user || user.role === 'Agent') {
    return null;
  }

  // Dynamically build nav items based on role
  let navItems: readonly ButtonType[] = [];
  if (user.role === 'Admin') {
    navItems = ['Listing', 'Agents', 'Photography companies'];
  } else if (user.role === 'PhotographyCompany') {
    navItems = ['Listing', 'Agents'];
  }

  // Active tab state (for Admin/Company dashboards)
  const [activeTab, setActiveTab] = useState<ButtonType>(navItems[0]);

  // Resolve scope dynamically if not passed
  const resolvedScope: 'company' | 'admin' =
    scope ?? (user.role === 'PhotographyCompany' ? 'company' : 'admin');

  // Render main content area
  const renderContent = () => {
    // Use passed children directly if defined
    if (children) return children;

    // Else render by active tab
    switch (activeTab) {
      case 'Listing':
        return <ListingDashboard scope={resolvedScope} />;
      case 'Agents':
        return <AgentList scope={resolvedScope} />;
      case 'Photography companies':
        return <PhotographyCompanyDashboard />;
      default:
        return <div className="text-xl">Welcome to the dashboard.</div>;
    }
  };

  return (
    <div>
      <DashboardNavbar
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="pt-16 px-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
