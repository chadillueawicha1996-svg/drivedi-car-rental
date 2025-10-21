import React from 'react';
import { Gift, Calendar, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  validUntil: string;
  minimumSpend: number;
  isUsed: boolean;
  description: string;
}

interface MyCouponsProps {
  user: any;
}

export function MyCoupons({ user }: MyCouponsProps) {
  // Mock data - ในอนาคตจะดึงจาก API
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME2024',
      discount: 20,
      discountType: 'percentage',
      validUntil: '2024-12-31',
      minimumSpend: 1000,
      isUsed: false,
      description: 'ส่วนลด 20% สำหรับการเช่ารถครั้งแรก'
    },
    {
      id: '2',
      code: 'SAVE500',
      discount: 500,
      discountType: 'fixed',
      validUntil: '2024-11-30',
      minimumSpend: 2000,
      isUsed: false,
      description: 'ส่วนลด 500 บาท สำหรับการเช่ารถ 2 วันขึ้นไป'
    },
    {
      id: '3',
      code: 'LOYALTY100',
      discount: 100,
      discountType: 'fixed',
      validUntil: '2024-10-31',
      minimumSpend: 500,
      isUsed: true,
      description: 'ส่วนลด 100 บาท สำหรับลูกค้าประจำ'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discount}%`;
    }
    return `${coupon.discount.toLocaleString()} บาท`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <Gift className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">คูปองของฉัน</h2>
      </div>

      <div className="space-y-4">
        {mockCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`border rounded-xl p-4 transition-all duration-200 ${
              coupon.isUsed
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : 'bg-white border-blue-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {coupon.code}
                  </div>
                  {coupon.isUsed && (
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                      ใช้แล้ว
                    </span>
                  )}
                </div>
                
                <p className="text-gray-800 font-medium mb-2">{coupon.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    <span>ส่วนลด: {getDiscountText(coupon)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>หมดอายุ: {formatDate(coupon.validUntil)}</span>
                  </div>
                </div>
                
                {coupon.minimumSpend > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ใช้ได้เมื่อเช่ารถขั้นต่ำ {coupon.minimumSpend.toLocaleString()} บาท
                  </p>
                )}
              </div>
              
              {!coupon.isUsed && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  ใช้คูปอง
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {mockCoupons.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">ยังไม่มีคูปอง</h3>
          <p className="text-gray-500">คุณยังไม่มีคูปองส่วนลด</p>
        </div>
      )}
    </div>
  );
}
