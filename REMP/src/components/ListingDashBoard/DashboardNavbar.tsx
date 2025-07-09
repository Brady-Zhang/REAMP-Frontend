import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type ButtonType = 'Listing' | 'Agents' | 'Photography companies';

interface DashboardNavbarProps {
  navItems: readonly ButtonType[];
  activeTab: ButtonType;
  onTabChange: (key: ButtonType) => void;
}


function DashboardNavbar(props: DashboardNavbarProps) {
  const { navItems, activeTab, onTabChange } = props;
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 从 context 拿到 setUser

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#0085CA] text-white flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-8">
        <div className="font-bold text-xl leading-tight">
          <div>recam</div>
          <div className="text-[5px] font-normal tracking-wider">SIMPLE SHOOT · PRO RESULTS</div>
        </div>

        <div className="flex space-x-2 font-semibold text-white ml-6 justify-start">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={`px-4 py-2 rounded font-medium transition-colors duration-200
            ${activeTab === item ? 'bg-[#535bf2] text-white' : 'hover:bg-[#535bf2] text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded font-medium transition-colors duration-200 text-white hover:bg-[#535bf2]"
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
