import React from 'react';
import { Calendar, Clock, CheckCircle, BarChart3, RefreshCw, Eye } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface Booking {
  id: number;
  car_brand: string;
  car_model: string;
  renter_name: string;
  owner_name: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  pickup_datetime: string;
  return_datetime: string;
  pickup_location: string;
  note: string;
  total_price: number;
  delivery_fee: string;
  pickup_fee: string;
  deposit_amount: string;
  status: string;
}

interface BookingsManagementProps {
  bookings: Booking[];
  loading: boolean;
  onRefresh: () => void;
  onViewBooking: (booking: Booking) => void;
  onUpdateStatus: (bookingId: number, newStatus: string) => void;
}

const BookingsManagement: React.FC<BookingsManagementProps> = ({
  bookings,
  loading,
  onRefresh,
  onViewBooking,
  onUpdateStatus
}) => {
  const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'waiting_payment':
        return 'รอชำระเงิน';
      case 'pending':
        return 'รอการยืนยัน';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'cancelled':
        return 'ยกเลิก';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'waiting_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">จัดการการจอง</h3>
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">รอชำระเงิน</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'waiting_payment').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">รอการยืนยัน</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">ยืนยันแล้ว</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-600">
                  {bookings.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">รายการจองทั้งหมด</h3>
            <p className="text-sm text-gray-500">จัดการข้อมูลการจองรถในระบบ ({bookings.length} รายการ)</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรช
            </Button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีการจอง</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-center p-3 font-medium border-r border-gray-200">รถ</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">ผู้จอง</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">วันรับรถ</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">วันคืนรถ</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">เวลารับรถ</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">เวลาคืนรถ</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">สถานที่</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">ราคา</th>
                    <th className="text-center p-3 font-medium border-r border-gray-200">สถานะ</th>
                    <th className="text-center p-3 font-medium">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div>
                          <div className="font-medium">
                            {booking.car_brand} {booking.car_model}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div>
                          <div className="font-medium">{booking.renter_name}</div>
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="text-sm">
                          <div className="font-medium text-blue-600">
                            {new Date(booking.start_date).toLocaleDateString('th-TH')}
                          </div>
                          {booking.pickup_datetime && (
                            <div className="text-xs text-blue-500 mt-1">
                              📅 {new Date(booking.pickup_datetime).toLocaleString('th-TH')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            {new Date(booking.end_date).toLocaleDateString('th-TH')}
                          </div>
                          {booking.return_datetime && (
                            <div className="text-xs text-green-500 mt-1">
                              📅 {new Date(booking.return_datetime).toLocaleString('th-TH')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="text-sm">
                          {booking.start_time ? (
                            <div className="text-gray-700 font-medium">
                              {booking.start_time}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-xs">ไม่ระบุเวลา</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="text-sm">
                          {booking.end_time ? (
                            <div className="text-gray-700 font-medium">
                              {booking.end_time}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-xs">ไม่ระบุเวลา</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="text-sm">
                          <div className="font-medium">{booking.pickup_location || 'ไม่ระบุ'}</div>
                          {booking.note && (
                            <div className="text-xs text-gray-500 mt-1">
                              หมายเหตุ: {booking.note}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <div className="font-medium">
                          ฿{parseFloat(booking.total_price).toLocaleString('th-TH')}
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                          {getBookingStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewBooking(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === 'waiting_payment' && (
                            <Button
                              size="sm"
                              onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                            >
                              ยืนยัน
                            </Button>
                          )}
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateStatus(booking.id, 'waiting_payment')}
                            >
                              รอชำระเงิน
                            </Button>
                          )}
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

export default BookingsManagement;
