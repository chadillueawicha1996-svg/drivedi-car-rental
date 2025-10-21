import React from 'react';
import { BarChart3, Settings } from 'lucide-react';

interface PlaceholderContentProps {
  type: 'reports' | 'settings';
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ type }) => {
  const config = {
    reports: {
      icon: BarChart3,
      title: 'รายงาน',
      description: 'ฟีเจอร์นี้จะพร้อมใช้งานในเร็วๆ นี้'
    },
    settings: {
      icon: Settings,
      title: 'ตั้งค่า',
      description: 'ฟีเจอร์นี้จะพร้อมใช้งานในเร็วๆ นี้'
    }
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="text-center py-20">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default PlaceholderContent;
