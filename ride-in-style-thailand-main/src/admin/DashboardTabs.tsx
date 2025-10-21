import React from 'react';
import { Users, Car, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';

interface RecentUser {
  id: number;
  email: string;
  display_name: string;
  user_type: string;
  created_at: string;
  email_verified: boolean;
}

interface RecentCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  user_id: number;
  owner_name: string;
}

interface RecentBooking {
  id: number;
  car_brand: string;
  car_model: string;
  renter_name: string;
  owner_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

interface DashboardTabsProps {
  recentUsers: RecentUser[];
  recentCars: RecentCar[];
  recentBookings: RecentBooking[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  recentUsers,
  recentCars,
  recentBookings
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏰' },
      approved: { color: 'bg-green-100 text-green-800', icon: '✅' },
      rejected: { color: 'bg-red-100 text-red-800', icon: '❌' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: '❌' },
      completed: { color: 'bg-green-100 text-green-800', icon: '✅' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={config.color}>
        <span className="mr-1">{config.icon}</span>
        {status === 'pending' && 'รอการอนุมัติ'}
        {status === 'approved' && 'อนุมัติแล้ว'}
        {status === 'rejected' && 'ถูกปฏิเสธ'}
        {status === 'confirmed' && 'ยืนยันแล้ว'}
        {status === 'cancelled' && 'ยกเลิกแล้ว'}
        {status === 'completed' && 'เสร็จสิ้น'}
      </Badge>
    );
  };

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">ผู้ใช้ล่าสุด</TabsTrigger>
        <TabsTrigger value="cars">รถล่าสุด</TabsTrigger>
        <TabsTrigger value="bookings">การจองล่าสุด</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ผู้ใช้ที่ลงทะเบียนล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{user.display_name || user.email}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{user.user_type}</Badge>
                        {user.email_verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <UserCheck className="w-3 h-3 mr-1" />
                            ยืนยันอีเมลแล้ว
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            ยังไม่ได้ยืนยันอีเมล
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">ลงทะเบียนเมื่อ</p>
                    <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cars" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>รถที่ลงทะเบียนล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCars.map((car) => (
                <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{car.brand} {car.model} ({car.year})</p>
                      <p className="text-sm text-gray-500">เจ้าของ: {car.owner_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(car.status)}
                        <Badge variant="outline">{formatCurrency(car.price)}/วัน</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">รหัสรถ</p>
                    <p className="text-sm font-medium">#{car.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bookings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>การจองล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.car_brand} {booking.car_model}</p>
                      <p className="text-sm text-gray-500">
                        ผู้จอง: {booking.renter_name} | เจ้าของ: {booking.owner_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(booking.status)}
                        <Badge variant="outline">{formatCurrency(booking.total_price)}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">วันที่จอง</p>
                    <p className="text-sm font-medium">
                      {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
