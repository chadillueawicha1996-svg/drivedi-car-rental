import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Car, Loader2, Edit, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { useToast } from "@/shared/hooks/use-toast";

interface MyRentalCarsProps {
  user: any;
  onEditCar: (car: any) => void;
}

export function MyRentalCars({ user, onEditCar }: MyRentalCarsProps) {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // โหลดข้อมูลรถจากฐานข้อมูล
  const loadUserCars = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/get-user-cars?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      console.log('Cars data:', data.cars); // Debug log
      
      if (data.success) {
        setCars(data.cars);
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: data.error || "ไม่สามารถโหลดข้อมูลรถได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลรถได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserCars();
  }, [user]);

  const handleDeleteCar = async (carId: number) => {
    if (!user?.email) return;
    
    if (!confirm('คุณต้องการลบรถคันนี้หรือไม่?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/delete-car/${carId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "สำเร็จ",
          description: "ลบรถสำเร็จ",
        });
        loadUserCars(); // โหลดข้อมูลใหม่
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: data.error || "ไม่สามารถลบรถได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบรถได้",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "อนุมัติแล้ว";
      case "pending": return "รออนุมัติ";
      case "rejected": return "ไม่อนุมัติ";
      default: return "อนุมัติแล้ว";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">รถเช่าของฉัน</h2>
          <p className="text-gray-600 mt-1">จัดการรถยนต์ของคุณที่ให้เช่า</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-6">
          <Car className="w-4 h-4 mr-1" />
          รถเช่าของฉัน ({cars.length} คัน)
        </div>
      </div>

          {loading ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-600" />
              <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Car className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>ยังไม่มีรถที่ลงทะเบียน</p>
              <p className="text-sm">คลิก "เพิ่มรถใหม่" เพื่อเริ่มต้น</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cars.map((car) => (
                <Card key={car.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* รูปภาพรถ */}
                      <div className="flex-shrink-0 pl-2">
                        {car.images && car.images.length > 0 ? (
                          <img
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            className="w-32 h-24 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-car.svg';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-24 bg-gray-100 flex items-center justify-center">
                            <Car className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* รายละเอียดรถ */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {car.brand} {car.model} ({car.year})
                          </h3>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex-shrink-0", getStatusColor(car.status))}>
                            {getStatusText(car.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                          <div>สี: {car.color || 'ไม่ระบุ'}</div>
                          <div>ทะเบียน: {car.plate_number || 'ไม่ระบุ'}</div>
                          <div>เครื่องยนต์: {car.engine_size || 'ไม่ระบุ'}</div>
                          <div>เชื้อเพลิง: {car.fuel_type || 'ไม่ระบุ'}</div>
                          <div>สถานะ: {getStatusText(car.status)}</div>
                          <div className="font-medium text-black text-lg">
                            ฿{car.price}/{car.price_type === "per_day" ? "วัน" : "ชั่วโมง"}
                          </div>
                        </div>
                      </div>
                      
                      {/* ปุ่มแก้ไขและลบ */}
                      <div className="flex flex-col gap-6 pr-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditCar(car)}
                          className="flex items-center gap-1.5 h-9 px-4"
                        >
                          <Edit className="w-4 h-4" />
                          แก้ไข
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCar(car.id)}
                          className="flex items-center gap-1.5 h-9 px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

      
    </div>

    
  );
} 