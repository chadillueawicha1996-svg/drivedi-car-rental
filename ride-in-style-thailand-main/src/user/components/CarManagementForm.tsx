import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Car, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { useToast } from "@/shared/hooks/use-toast";
import { AddCarForm } from "./AddCarForm";
import { EditCarForm } from "./EditCarForm";

interface CarManagementFormProps {
  user: any;
  activeTab?: "add" | "list";
  onTabChange?: (tab: "add" | "list") => void;
}

export function CarManagementForm({ user, activeTab: propActiveTab, onTabChange }: CarManagementFormProps) {
  const [cars, setCars] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"add" | "list">(propActiveTab || "add");
  const [loading, setLoading] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
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

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
      // ถ้าเปลี่ยนไปแท็บ "เพิ่มรถใหม่" ให้ปิดโหมดแก้ไข
      if (propActiveTab === "add") {
        setShowEditForm(false);
        setEditingCar(null);
      }
    }
  }, [propActiveTab]);

  const handleEditCar = (car: any) => {
    setEditingCar(car);
    setShowEditForm(true);
  };

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
      default: return "อนุมัติแล้ว"; // เปลี่ยน default เป็น "อนุมัติแล้ว"
    }
  };

  const handleTabChange = (tab: "add" | "list") => {
    setActiveTab(tab);
    // ถ้าเปลี่ยนไปแท็บ "เพิ่มรถใหม่" ให้ปิดโหมดแก้ไข
    if (tab === "add") {
      setShowEditForm(false);
      setEditingCar(null);
    }
    // เรียก callback ถ้ามี
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleCarAdded = () => {
    loadUserCars();
    handleTabChange("list");
  };

  const handleCarUpdated = () => {
    loadUserCars();
    setShowEditForm(false);
    setEditingCar(null);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingCar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">จัดการรถให้เช่า</h2>
          <p className="text-gray-600 mt-1">จัดการรถยนต์ของคุณที่ให้เช่า</p>
        </div>
      </div>

      {/* ฟอร์มเพิ่มรถใหม่ */}
      {activeTab === "add" && !showEditForm && (
        <AddCarForm 
          user={user}
          onCarAdded={handleCarAdded}
          onCancel={() => handleTabChange("list")}
        />
      )}

      {/* รายการรถเช่าของฉัน */}
      {activeTab === "list" && !showEditForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              รถเช่าของฉัน ({cars.length} คัน)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>ยังไม่มีรถที่ลงทะเบียน</p>
                <p className="text-sm">คลิก "เพิ่มรถใหม่" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold text-lg">
                            {car.brand} {car.model} ({car.year})
                          </h3>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(car.status))}>
                            {getStatusText(car.status)}
                          </span>
                        </div>
                        
                        {/* แสดงรูปภาพรถ */}
                        {car.images && car.images.length > 0 && (
                          <div className="mt-3">
                            <div className="flex gap-2 overflow-x-auto">
                              {car.images.slice(0, 4).map((image, index) => (
                                <div key={index} className="flex-shrink-0">
                                  <img
                                    src={image}
                                    alt={`${car.brand} ${car.model} - รูปที่ ${index + 1}`}
                                    className="w-20 h-16 object-cover rounded border"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder-car.svg';
                                    }}
                                  />
                                </div>
                              ))}
                              {car.images.length > 4 && (
                                <div className="flex-shrink-0 w-20 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                  +{car.images.length - 4} รูป
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                          <div>สี: {car.color}</div>
                          <div>ทะเบียน: {car.plate_number}</div>
                          <div>ราคา: {car.price} บาท/{car.price_type === "per_day" ? "วัน" : "ชั่วโมง"}</div>
                          {car.car_type && <div>ประเภท: {car.car_type}</div>}
                        </div>
                        {car.pickup_area && (
                          <p className="text-sm text-gray-500 mt-2">พื้นที่รับส่ง: {car.pickup_area}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCar(car)}
                        >
                          แก้ไข
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCar(car.id)}
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ฟอร์มแก้ไขข้อมูลรถ */}
      {showEditForm && editingCar && (
        <EditCarForm 
          user={user}
          car={editingCar}
          onCarUpdated={handleCarUpdated}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
} 