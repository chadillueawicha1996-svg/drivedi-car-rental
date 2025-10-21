import React, { useState, useEffect } from 'react';
import { FileText, Calendar, MapPin, Car, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CarRental {
  id: string;
  car_id: string;
  car_brand: string;
  car_model: string;
  plate_number: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickup_location: string;
  carImage: string;
  car_year: number;
  car_color: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  engine_size: string;
  car_type: string;
  owner_name: string;
  owner_phone: string;
  created_at: string;
  updated_at: string;
}

interface MyCarRentalsProps {
  user: any;
}

export function MyCarRentals({ user }: MyCarRentalsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'active' | 'completed' | 'cancelled'>('all');
  const [rentals, setRentals] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingRental, setCancellingRental] = useState<string | null>(null);

  // ดึงข้อมูลการเช่ารถจากฐานข้อมูล
  useEffect(() => {
    const fetchRentals = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3001/api/user-car-rentals/${encodeURIComponent(user.email)}`);
        const data = await response.json();
        
        if (data.success) {
          setRentals(data.rentals);
        } else {
          setError(data.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // แสดงเฉพาะ HH:MM
  };

  const calculateTotalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ฟังก์ชันยกเลิกการจอง
  const handleCancelRental = async (rentalId: string) => {
    if (!user?.email) return;
    
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
      return;
    }

    try {
      setCancellingRental(rentalId);
      
      const response = await fetch(`http://localhost:3001/api/cancel-rental/${rentalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      const data = await response.json();

      if (data.success) {
        // อัปเดตสถานะใน local state
        setRentals(prevRentals => 
          prevRentals.map(rental => 
            rental.id === rentalId 
              ? { ...rental, status: 'cancelled' as const }
              : rental
          )
        );
        
        // แสดงข้อความสำเร็จ
        alert('ยกเลิกการจองสำเร็จ');
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    } catch (err) {
      console.error('Error cancelling rental:', err);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setCancellingRental(null);
    }
  };

  // ตรวจสอบว่าการจองสามารถยกเลิกได้หรือไม่
  const canCancelRental = (rental: CarRental) => {
    if (rental.status === 'cancelled' || rental.status === 'completed') {
      return false;
    }
    
    // ตรวจสอบว่าวันเริ่มเช่ายังไม่มาถึง
    const startDate = new Date(rental.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 ของวันนี้
    
    return startDate > today;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, text: 'รอการยืนยัน' };
      case 'confirmed':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Clock, text: 'ยืนยันแล้ว' };
      case 'active':
        return { color: 'text-green-600', bgColor: 'bg-green-100', icon: Car, text: 'กำลังใช้งาน' };
      case 'completed':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle, text: 'เสร็จสิ้น' };
      case 'cancelled':
        return { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle, text: 'ยกเลิก' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle, text: 'ไม่ทราบสถานะ' };
    }
  };

  const filteredRentals = activeTab === 'all' 
    ? rentals 
    : rentals.filter(rental => rental.status === activeTab);

  const tabs = [
    { id: 'all', label: 'ทั้งหมด', count: rentals.length },
    { id: 'confirmed', label: 'ยืนยันแล้ว', count: rentals.filter(r => r.status === 'confirmed').length },
    { id: 'active', label: 'กำลังใช้งาน', count: rentals.filter(r => r.status === 'active').length },
    { id: 'completed', label: 'เสร็จสิ้น', count: rentals.filter(r => r.status === 'completed').length },
    { id: 'cancelled', label: 'ยกเลิก', count: rentals.filter(r => r.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">การเช่ารถของฉัน</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">การเช่ารถของฉัน</h2>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <FileText className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">การเช่ารถของฉัน</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRentals.map((rental) => {
          const statusInfo = getStatusInfo(rental.status);
          const StatusIcon = statusInfo.icon;
          const totalDays = calculateTotalDays(rental.start_date, rental.end_date);
          
          return (
            <div
              key={rental.id}
              className="border rounded-xl p-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                {/* Car Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                  <img
                    src={rental.carImage}
                    alt={`${rental.car_brand} ${rental.car_model}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-car.svg';
                    }}
                  />
                </div>

                {/* Rental Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {rental.car_brand} {rental.car_model}
                      </h3>
                      <p className="text-gray-600">ทะเบียน: {rental.plate_number}</p>
                      <p className="text-sm text-gray-500">
                        {rental.car_year} • {rental.car_color} • {rental.transmission} • {rental.seats} ที่นั่ง
                      </p>
                    </div>
                    
                    <div className={`flex items-center px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.color}`} />
                      <span className={`text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>เริ่ม: {formatDate(rental.start_date)} {formatTime(rental.start_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>สิ้นสุด: {formatDate(rental.end_date)} {formatTime(rental.end_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{totalDays} วัน</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">
                        ฿{rental.total_price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span>รับ-ส่ง: {rental.pickup_location}</span>
                  </div>

                  {rental.owner_name && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">เจ้าของรถ:</span> {rental.owner_name}
                      {rental.owner_phone && (
                        <span className="ml-4">
                          <span className="font-medium">โทร:</span> {rental.owner_phone}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* ปุ่มดูรายละเอียด - แสดงสำหรับทุกสถานะ */}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      ดูรายละเอียด
                    </button>
                    
                    {/* ปุ่มยกเลิกการจอง - แสดงเฉพาะเมื่อสามารถยกเลิกได้ */}
                    {canCancelRental(rental) && (
                      <button 
                        onClick={() => handleCancelRental(rental.id)}
                        disabled={cancellingRental === rental.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingRental === rental.id ? 'กำลังยกเลิก...' : 'ยกเลิกการจอง'}
                      </button>
                    )}
                    
                    {/* ปุ่มให้คะแนน - แสดงเฉพาะเมื่อเสร็จสิ้น */}
                    {rental.status === 'completed' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        ให้คะแนน
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">ยังไม่มีประวัติการเช่ารถ</h3>
          <p className="text-gray-500">คุณยังไม่เคยเช่ารถผ่านระบบ</p>
        </div>
      )}
    </div>
  );
}
