import React, { useState } from 'react';

interface BookingDetailsCardProps {
  carId: number;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pricePerDay: number;
  totalDays: number;
  deliveryFee: number;
  pickupFee: number;
  deposit: number;
  carPrice: number; // ราคาต่อวันจากรถ
}

export const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({
  carId,
  pickupLocation,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  pricePerDay,
  totalDays,
  deliveryFee,
  pickupFee,
  deposit,
  carPrice
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // แปลงค่าที่ส่งมาเป็นตัวเลขให้แน่ใจว่าเป็น number
  const actualPricePerDay = Number(carPrice ?? pricePerDay ?? 0);
  const actualDeliveryFee = Number(deliveryFee ?? 0);
  const actualPickupFee = Number(pickupFee ?? 0);
  const actualDeposit = Number(deposit ?? 0);
  
  // คำนวณราคาต่างๆ
  const totalRentalCost = actualPricePerDay * totalDays;
  const totalServiceFees = actualDeliveryFee + actualPickupFee;
  const totalPrice = totalRentalCost + totalServiceFees;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // ตรวจสอบว่าวันที่เป็นรูปแบบ YYYY-MM-DD หรือไม่
    if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // ถ้าเป็นรูปแบบ YYYY-MM-DD ให้แปลงโดยตรง
      const [year, month, day] = dateStr.split('-').map(Number);
      const monthNames = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      
      const result = `${day} ${monthNames[month - 1]} ${year}`;
      return result;
    }
    
    // ถ้าเป็นรูปแบบอื่น ให้ใช้ Date object
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return 'วันที่ไม่ถูกต้อง';
      }
      
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthNames = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      
      const result = `${day} ${monthNames[month]} ${year}`;
      return result;
    } catch (error) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  // Helper แปลงวันที่เป็นรูปแบบ YYYY-MM-DD สำหรับ MySQL
  const toMySqlDate = (dateStr: string) => {
    
    if (!dateStr) {
      return '';
    }
    
    // ตรวจสอบว่าวันที่เป็นรูปแบบ YYYY-MM-DD หรือไม่
    if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // ถ้าเป็นรูปแบบอื่น ให้แปลงผ่าน Date object
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // แปลงเป็นรูปแบบ YYYY-MM-DD โดยไม่ใช้ toISOString() เพื่อหลีกเลี่ยงปัญหา timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const result = `${year}-${month}-${day}`;
      
      return result;
    } catch (error) {
      return '';
    }
  };

  const handleCreateBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        setError('กรุณาล็อกอินก่อนทำการจอง');
        return;
      }

      const userData = JSON.parse(currentUser);
      if (!userData.id) {
        setError('ข้อมูลผู้ใช้ไม่ถูกต้อง');
        return;
      }

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!carId || !pickupDate || !returnDate) {
        setError('ข้อมูลการจองไม่ครบถ้วน');
        return;
      }

      // Helper แปลงเวลาเป็นรูปแบบ HH:MM:SS สำหรับ MySQL หรือ null ถ้าไม่มีค่า
      const toMySqlTime = (timeStr: string) => {
        
        if (!timeStr || timeStr.trim() === '') {
          return null;
        }
        
        // ถ้าเวลาเป็นรูปแบบ HH:MM ให้เพิ่ม :00
        if (timeStr.match(/^\d{2}:\d{2}$/)) {
          const result = timeStr + ':00';
          return result;
        }
        
        return timeStr;
      };

      // สร้างการจองใหม่
      const startDate = toMySqlDate(pickupDate);
      const endDate = toMySqlDate(returnDate);
      const startTime = toMySqlTime(pickupTime);
      const endTime = toMySqlTime(returnTime);
      
      const bookingData = {
        car_id: carId,
        renter_id: userData.id,
        owner_id: userData.id, // ใช้ userData.id เป็น owner_id ชั่วคราว (ควรดึงจากข้อมูลรถจริง)
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        pickup_datetime: `${startDate} ${startTime || '00:00:00'}`,
        return_datetime: `${endDate} ${endTime || '23:59:59'}`,
        total_price: totalPrice,
        pickup_location: pickupLocation,
        delivery_fee: actualDeliveryFee,
        pickup_fee: actualPickupFee,
        deposit_amount: actualDeposit,
        note: ''
      };

      const response = await fetch('http://localhost:3001/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('สร้างการจองสำเร็จ!');
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการสร้างการจอง');
      }

    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-medium text-[rgb(25,26,32)] leading-6">รายละเอียด</h3>
        <button className="text-blue-600 text-sm hover:text-blue-800">
          แก้ไขวันรับ/คืนรถ
        </button>
      </div>

      {/* Location and Dates */}
      <div className="mb-6">
        <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px] mb-3">สถานที่รับรถ / คืนรถ</div>
        <div className="text-base font-medium text-gray-900 mb-4">{pickupLocation}</div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Pickup */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px] mb-2">รับรถ</div>
            <div className="text-base font-medium text-gray-900 mb-1">{pickupLocation}</div>
            <div className="text-sm font-medium text-blue-600 mb-1">{formatDate(pickupDate)}</div>
            <div className="text-xs text-gray-600">
              เวลา: {pickupTime || 'ไม่ระบุเวลา'}
            </div>
          </div>
          
          {/* Return */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px] mb-2">คืนรถ</div>
            <div className="text-base font-medium text-gray-900 mb-1">{pickupLocation}</div>
            <div className="text-sm font-medium text-green-600 mb-1">{formatDate(returnDate)}</div>
            <div className="text-xs text-gray-600">
              เวลา: {returnTime || 'ไม่ระบุเวลา'}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Rental Cost */}
      <div className="mb-4">
        <div className="text-base font-medium text-gray-900 mb-2">
          ค่าเช่ารถ {totalDays} วัน
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px]">
            ราคาต่อวัน ฿{actualPricePerDay.toLocaleString('th-TH')} x {totalDays} วัน
          </div>
          <div className="text-base font-medium text-gray-900">
            ฿{totalRentalCost.toLocaleString('th-TH')}
          </div>
        </div>
      </div>

      {/* Service Fees */}
      <div className="mb-4">
        <div className="text-base font-medium text-gray-900 mb-2">
          ค่ารับ - ค่าส่ง
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px]">
            ค่าส่งรถ ฿{actualDeliveryFee.toLocaleString('th-TH')}, ค่ารับรถ ฿{actualPickupFee.toLocaleString('th-TH')}
          </div>
          <div className="text-base font-medium text-gray-900">
            ฿{totalServiceFees.toLocaleString('th-TH')}
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Total Price and Deposit */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-base font-medium text-gray-900">ราคารวมทั้งหมด</div>
          <div className="text-2xl font-bold text-gray-900">
            ฿{totalPrice.toLocaleString('th-TH')}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-normal text-[rgb(115,115,115)] leading-[18px]">
            ค่ามัดจำในวันรับรถ (ได้คืนในวันคืนรถ)
          </div>
          <div className="text-base font-medium text-gray-900">
            ฿{actualDeposit.toLocaleString('th-TH')}
          </div>
        </div>
        
        <div className="text-xs text-red-500">
          ราคานี้ยังไม่รวมโค้ดส่วนลด หรือโปรโมชัน
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Action Button */}
      <button 
        onClick={handleCreateBooking}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isLoading 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            กำลังสร้างการจอง...
          </div>
        ) : (
          'เช่ารถคันนี้'
        )}
      </button>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        การจองจะถูกส่งไปยังแอดมินเพื่อตรวจสอบและยืนยัน
      </div>
    </div>
  );
};
