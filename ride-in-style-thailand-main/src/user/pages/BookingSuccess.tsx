import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/user/components/Navigation';
import { CheckCircle, Calendar, MapPin, Clock, Car, User, DollarSign } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, carDetails } = location.state || {};

  if (!booking) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบข้อมูลการจอง</h1>
            <Button onClick={() => navigate('/')}>กลับหน้าหลัก</Button>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthNames = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    return `${day} ${monthNames[month]} ${year}`;
  };

  const getStatusText = (status: string) => {
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

  const getStatusColor = (status: string) => {
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
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              การจองสำเร็จ!
            </h1>
            <p className="text-lg text-gray-600">
              ขอบคุณที่ใช้บริการของเรา การจองของคุณถูกส่งไปยังแอดมินแล้ว
            </p>
          </div>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Car Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    ข้อมูลรถ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">รถ:</span>
                      <span className="font-medium">
                        {booking.car_brand} {booking.car_model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ทะเบียน:</span>
                      <span className="font-medium">{booking.plate_number || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ปี:</span>
                      <span className="font-medium">{booking.car_year || 'ไม่ระบุ'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    รายละเอียดการเช่า
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">วันที่รับรถ:</span>
                      <span className="font-medium">{formatDate(booking.start_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">วันที่คืนรถ:</span>
                      <span className="font-medium">{formatDate(booking.end_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">เวลา:</span>
                      <span className="font-medium">
                        {booking.start_time} - {booking.end_time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">วันที่และเวลารับรถ:</span>
                      <span className="font-medium">
                        {booking.pickup_datetime ? new Date(booking.pickup_datetime).toLocaleString('th-TH') : 'ไม่ระบุ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">วันที่และเวลาคืนรถ:</span>
                      <span className="font-medium">
                        {booking.return_datetime ? new Date(booking.return_datetime).toLocaleString('th-TH') : 'ไม่ระบุ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">สถานที่:</span>
                      <span className="font-medium">{booking.pickup_location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    ข้อมูลการชำระเงิน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ราคารวม:</span>
                      <span className="font-medium text-lg">
                        ฿{parseFloat(booking.total_price).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าส่งรถ:</span>
                      <span className="font-medium">
                        ฿{parseFloat(booking.delivery_fee || '0').toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่ารับรถ:</span>
                      <span className="font-medium">
                        ฿{parseFloat(booking.pickup_fee || '0').toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่ามัดจำ:</span>
                      <span className="font-medium">
                        ฿{parseFloat(booking.deposit_amount || '0').toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status and Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    สถานะและขั้นตอนถัดไป
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">สถานะ:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">ขั้นตอนถัดไป:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• แอดมินจะตรวจสอบการจองของคุณ</li>
                        <li>• คุณจะได้รับอีเมลยืนยันการจอง</li>
                        <li>• ชำระเงินตามที่แอดมินแจ้ง</li>
                        <li>• รับรถในวันที่และเวลาที่กำหนด</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3"
            >
              กลับหน้าหลัก
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              className="px-8 py-3"
            >
              ดูการจองของฉัน
            </Button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-2">
              หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อเรา
            </p>
            <p className="text-sm">
              โทร: 02-123-4567 | อีเมล: support@rideinstylethailand.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
