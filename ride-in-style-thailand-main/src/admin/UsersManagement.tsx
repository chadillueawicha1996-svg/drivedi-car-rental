import React, { useState } from 'react';
import { Users, Search, Eye, Edit, Trash2, Phone, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';

interface User {
  id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  user_type: string;
  birth_date: string;
  phone_number: string;
  email_verified: boolean;
  created_at: string;
  is_admin?: number;
}

interface UsersManagementProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  onRoleChange: (userId: number, newRole: number) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({
  users,
  loading,
  onRefresh,
  onRoleChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const formatDate = (dateString: string) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserTypeBadge = (userType: string) => {
    const typeConfig = {
      renter: { color: 'bg-blue-100 text-blue-800', label: 'ผู้เช่า' },
      owner: { color: 'bg-green-100 text-green-800', label: 'เจ้าของรถ' }
    };

    const config = typeConfig[userType as keyof typeof typeConfig] || typeConfig.renter;

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getEmailVerifiedBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          ยืนยันแล้ว
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          ยังไม่ได้ยืนยัน
        </Badge>
      );
    }
  };

  const confirmRoleChange = (user: User, newRole: number) => {
    const roleText = newRole === 1 ? 'แอดมิน' : 'ผู้ใช้ทั่วไป';
    const userName = user.display_name || user.email;
    const currentRole = user.is_admin === 1 ? 'แอดมิน' : 'ผู้ใช้ทั่วไป';
    
    if (window.confirm(
      `คุณต้องการเปลี่ยนสิทธิ์ของ ${userName} หรือไม่?\n\n` +
      `จาก: ${currentRole}\n` +
      `เป็น: ${roleText}\n\n` +
      `การเปลี่ยนแปลงนี้จะมีผลทันที`
    )) {
      onRoleChange(user.id, newRole);
    }
  };

  // Filter และ search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || user.user_type === filterType;
    const matchesRoleFilter = filterRole === 'all' || 
      (filterRole === 'admin' && user.is_admin === 1) || 
      (filterRole === 'user' && user.is_admin !== 1);
    
    return matchesSearch && matchesFilter && matchesRoleFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">จัดการผู้ใช้ทั้งหมด</h3>
          <p className="text-sm text-gray-500">จัดการข้อมูลผู้ใช้ในระบบ ({filteredUsers.length} คน)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onRefresh} variant="outline" size="sm">
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">ทุกประเภท</option>
          <option value="renter">ผู้เช่า</option>
          <option value="owner">เจ้าของรถ</option>
        </select>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">ทุกระดับสิทธิ์</option>
          <option value="admin">แอดมิน</option>
          <option value="user">ผู้ใช้ทั่วไป</option>
        </select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลดข้อมูลผู้ใช้...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ผู้ใช้
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ระดับสิทธิ์
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ข้อมูลติดต่อ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      วันที่ลงทะเบียน
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'ไม่ระบุชื่อ'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="flex justify-center">
                          {getUserTypeBadge(user.user_type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="flex justify-center">
                          {user.is_admin === 1 ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              แอดมิน
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              <UserCheck className="w-3 h-3 mr-1" />
                              ผู้ใช้ทั่วไป
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="flex justify-center">
                          {getEmailVerifiedBadge(user.email_verified)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="text-sm text-gray-900">
                          {user.phone_number ? (
                            <div className="flex items-center justify-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{user.phone_number}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">ไม่ระบุ</span>
                          )}
                        </div>
                        {user.birth_date && (
                          <div className="text-sm text-gray-500 mt-1">
                            วันเกิด: {formatDate(user.birth_date)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-sm text-gray-500 text-center">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {/* ปุ่มเปลี่ยนสิทธิ์ */}
                          <div className="flex items-center space-x-2">
                            <select
                              value={user.is_admin === 1 ? 'admin' : 'user'}
                              onChange={(e) => {
                                const newRole = e.target.value === 'admin' ? 1 : 0;
                                if (newRole !== user.is_admin) {
                                  confirmRoleChange(user, newRole);
                                }
                              }}
                              className="h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                              title="เปลี่ยนระดับสิทธิ์"
                              style={{ minWidth: '100px' }}
                            >
                              <option value="user" className="py-1">👤 ผู้ใช้ทั่วไป</option>
                              <option value="admin" className="py-1">🛡️ แอดมิน</option>
                            </select>
                            {/* Indicator แสดงสถานะปัจจุบัน */}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.is_admin === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.is_admin === 1 ? '🛡️' : '👤'}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
