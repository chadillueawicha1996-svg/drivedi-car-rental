import React from 'react';
import { 
  Users, 
  Car, 
  Calendar, 
  Home,
  Settings,
  BarChart3,
  Shield,
  Home as HomeIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onMenuClick: (menuId: string) => void;
  displayName: string;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onMenuClick,
  displayName,
  isOpen
}) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: Home, active: true },
    { id: 'users', label: 'จัดการผู้ใช้', icon: Users, active: false },
    { id: 'cars', label: 'จัดการรถ', icon: Car, active: false },
    { id: 'bookings', label: 'จัดการการจอง', icon: Calendar, active: false },
    { id: 'reports', label: 'รายงาน', icon: BarChart3, active: false },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings, active: false },
  ];

  return (
    <div 
      className={`w-64 bg-gray-700 shadow-lg min-h-screen transition-all duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center space-x-3 pl-3.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {displayName || 'Dashboard Panel'}
            </h2>
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                activeTab === item.id ? 'text-white' : 'text-white'
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-white hover:bg-gray-700 hover:text-white transition-colors"
        >
          <HomeIcon className="w-5 h-5 text-white" />
          <span className="font-medium">กลับหน้าหลัก</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
