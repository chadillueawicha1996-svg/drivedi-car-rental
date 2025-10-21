import React, { useState } from 'react';
import { Car, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';

interface CarData {
  id: number;
  brand: string;
  model: string;
  sub_model: string;
  year: number;
  color: string;
  plate_number: string;
  car_type: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  engine_size: string;
  doors: number;
  luggage: number;
  price: number;
  price_type: string;
  pickup_area: string;
  shop_location: string;
  after_hours_service: string;
  normal_hours: string;
  insurance: boolean;
  roadside_assistance: boolean;
  free_cancellation: boolean;
  unlimited_mileage: boolean;
  unlimited_route: boolean;
  status: string;
  user_id: number;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

interface CarsManagementProps {
  cars: CarData[];
  loading: boolean;
  onRefresh: () => void;
}

const CarsManagement: React.FC<CarsManagementProps> = ({
  cars,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Filter และ search cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.owner_name && car.owner_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTypeFilter = filterType === 'all' || car.car_type === filterType;
    const matchesStatusFilter = filterStatus === 'all' || car.status === filterStatus;
    
    return matchesSearch && matchesTypeFilter && matchesStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">จัดการรถทั้งหมด</h3>
          <p className="text-sm text-gray-500">จัดการข้อมูลรถในระบบ ({filteredCars.length} คัน)</p>
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
            placeholder="ค้นหารถ..."
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
          <option value="sedan">รถเก๋ง</option>
          <option value="suv">SUV</option>
          <option value="pickup">กระบะ</option>
          <option value="van">รถตู้</option>
          <option value="hatchback">รถแฮทช์แบ็ก</option>
          <option value="wagon">รถสเตชันวากอน</option>
          <option value="sports">รถสปอร์ต</option>
          <option value="luxury">รถหรู</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอการอนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ถูกปฏิเสธ</option>
        </select>
      </div>

      {/* Cars Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลดข้อมูลรถ...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="p-8 text-center">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบรถที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      รถ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ข้อมูลรถ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      เจ้าของ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Car className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {car.brand} {car.model} {car.sub_model && `(${car.sub_model})`}
                            </div>
                            <div className="text-sm text-gray-500">{car.plate_number}</div>
                            <div className="text-sm text-gray-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="flex justify-center">
                          <Badge variant="outline">
                            {car.car_type === 'sedan' ? 'รถเก๋ง' : 
                             car.car_type === 'suv' ? 'SUV' : 
                             car.car_type === 'pickup' ? 'กระบะ' : 
                             car.car_type === 'van' ? 'รถตู้' : 
                             car.car_type === 'hatchback' ? 'รถแฮทช์แบ็ก' : 
                             car.car_type === 'wagon' ? 'รถสเตชันวากอน' : 
                             car.car_type === 'sports' ? 'รถสปอร์ต' : 
                             car.car_type === 'luxury' ? 'รถหรู' : car.car_type}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="flex justify-center">
                          {getStatusBadge(car.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="text-sm text-gray-900">
                          <div>สี: {car.color}</div>
                          <div>เกียร์: {car.transmission === 'manual' ? 'เกียร์ธรรมดา' : 
                                         car.transmission === 'automatic' ? 'ออโต้' : 
                                         car.transmission === 'cvt' ? 'เกียร์ CVT' : 
                                         car.transmission === 'dct' ? 'เกียร์ DCT' : car.transmission}</div>
                          <div>ที่นั่ง: {car.seats} ที่</div>
                          <div>ราคา: {formatCurrency(car.price)}/วัน</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
                        <div className="text-sm text-gray-900">
                          {car.owner_name || 'ไม่ระบุ'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
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

export default CarsManagement;
