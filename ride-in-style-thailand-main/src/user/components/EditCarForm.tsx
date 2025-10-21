import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

interface EditCarFormProps {
  user: any;
  car: any;
  onCarUpdated: () => void;
  onCancel: () => void;
}

export function EditCarForm({ user, car, onCarUpdated, onCancel }: EditCarFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [editingCar, setEditingCar] = useState({
    id: car.id,
    brand: car.brand,
    model: car.model,
    subModel: car.sub_model || "",
    year: car.year.toString(),
    color: car.color,
    plate: car.plate_number,
    carType: car.car_type,
    transmission: car.transmission,
    seats: car.seats.toString(),
    fuelType: car.fuel_type,
    engineSize: car.engine_size || "",
    doors: car.doors.toString(),
    luggage: car.luggage.toString(),
    price: car.price.toString(),
    priceType: car.price_type,
    pickupArea: car.pickup_area || "",
    shopLocation: car.shop_location || "",
    afterHoursService: car.after_hours_service || "",
    normalHours: car.normal_hours || "",
    insurance: car.insurance === 1 || car.insurance === '1' || car.insurance === true,
    roadsideAssistance: car.roadside_assistance === 1 || car.roadside_assistance === '1' || car.roadside_assistance === true,
    freeCancellation: car.free_cancellation === 1 || car.free_cancellation === '1' || car.free_cancellation === true,
    unlimitedMileage: car.unlimited_mileage === 1 || car.unlimited_mileage === '1' || car.unlimited_mileage === true,
    unlimitedRoute: car.unlimited_route === 1 || car.unlimited_route === '1' || car.unlimited_route === true,
    images: car.images || [],
    documents: car.documents || [],
  });

  // Debug: Monitor editingCar.images changes
  useEffect(() => {
    console.log('editingCar.images changed:', editingCar.images);
  }, [editingCar.images]);

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // ตรวจสอบว่ามีไฟล์ที่เลือกหรือไม่
    if (!files || files.length === 0) {
      toast({
        title: "ไม่ได้เลือกไฟล์ใด",
        description: "กรุณาเลือกไฟล์รูปภาพที่ต้องการอัปโหลด",
        variant: "destructive",
      });
      return;
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    for (const file of Array.from(files)) {
      // ตรวจสอบประเภทไฟล์
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP, GIF)",
          variant: "destructive",
        });
        continue;
      }

      // ตรวจสอบขนาดไฟล์
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาเลือกไฟล์ที่มีขนาดน้อยกว่า 5MB",
          variant: "destructive",
        });
        continue;
      }

      // ตรวจสอบว่าไฟล์ไม่ว่างเปล่า
      if (file.size === 0) {
        toast({
          title: "ไฟล์ว่างเปล่า",
          description: "กรุณาเลือกไฟล์ที่มีข้อมูล",
          variant: "destructive",
        });
        continue;
      }

      try {
        // แสดง loading state
        toast({
          title: "กำลังอัปโหลด...",
          description: `กำลังอัปโหลด ${file.name}`,
        });

        // สร้าง FormData
        const formData = new FormData();
        formData.append('image', file);

        // อัปโหลดรูปภาพ
        const response = await fetch('/api/upload-car-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          console.log('Image uploaded successfully:', data.imageUrl);
          
          // อัปเดต state ด้วย callback function เพื่อให้แน่ใจว่าใช้ข้อมูลล่าสุด
          setEditingCar(prev => {
            const newImages = [...prev.images, data.imageUrl];
            console.log('Updated editingCar images:', newImages);
            console.log('Previous images count:', prev.images.length);
            console.log('New images count:', newImages.length);
            return {
              ...prev,
              images: newImages
            };
          });
          
          toast({
            title: "อัปโหลดสำเร็จ",
            description: `อัปโหลด ${file.name} สำเร็จแล้ว`,
          });
        } else {
          toast({
            title: "ข้อผิดพลาด",
            description: data.error || "ไม่สามารถอัปโหลดรูปภาพได้",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "ข้อผิดพลาด",
          description: `ไม่สามารถอัปโหลด ${file.name} ได้ กรุณาลองใหม่อีกครั้ง`,
          variant: "destructive",
        });
      }
    }
    
    // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
    e.target.value = '';
  };

  const removeEditImage = (index: number) => {
    setEditingCar(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCar = async () => {
    if (!user?.email || !editingCar) return;

    if (!editingCar.brand || !editingCar.model || !editingCar.year || !editingCar.color || !editingCar.plate || !editingCar.price) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('Sending update request with images:', editingCar.images);
      
      const response = await fetch(`/api/update-car/${editingCar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          brand: editingCar.brand,
          model: editingCar.model,
          subModel: editingCar.subModel,
          year: parseInt(editingCar.year),
          color: editingCar.color,
          plateNumber: editingCar.plate,
          carType: editingCar.carType,
          transmission: editingCar.transmission,
          seats: parseInt(editingCar.seats),
          fuelType: editingCar.fuelType,
          engineSize: editingCar.engineSize,
          doors: parseInt(editingCar.doors),
          luggage: parseInt(editingCar.luggage),
          price: parseFloat(editingCar.price),
          priceType: editingCar.priceType,
          pickupArea: editingCar.pickupArea,
          shopLocation: editingCar.shopLocation,
          afterHoursService: editingCar.afterHoursService,
          normalHours: editingCar.normalHours,
          insurance: editingCar.insurance,
          roadsideAssistance: editingCar.roadsideAssistance,
          freeCancellation: editingCar.freeCancellation,
          unlimitedMileage: editingCar.unlimitedMileage,
          unlimitedRoute: editingCar.unlimitedRoute,
          images: editingCar.images,
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);
      
      if (data.success) {
        toast({
          title: "สำเร็จ",
          description: "อัปเดตข้อมูลรถสำเร็จ",
        });
        
        // เรียก callback
        onCarUpdated();
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: data.error || "ไม่สามารถอัปเดตข้อมูลรถได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating car:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลรถได้",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>แก้ไขข้อมูลรถ</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            กลับไปรายการรถ
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ข้อมูลพื้นฐาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-brand">ยี่ห้อ</Label>
              <Input
                id="edit-brand"
                value={editingCar.brand}
                onChange={(e) => setEditingCar(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="เช่น Toyota, Honda"
              />
            </div>
            <div>
              <Label htmlFor="edit-model">รุ่น</Label>
              <Input
                id="edit-model"
                value={editingCar.model}
                onChange={(e) => setEditingCar(prev => ({ ...prev, model: e.target.value }))}
                placeholder="เช่น Camry, Civic"
              />
            </div>
            <div>
              <Label htmlFor="edit-subModel">รุ่นย่อย</Label>
              <Input
                id="edit-subModel"
                value={editingCar.subModel}
                onChange={(e) => setEditingCar(prev => ({ ...prev, subModel: e.target.value }))}
                placeholder="เช่น 2.0G, 2.5V"
              />
            </div>
            <div>
              <Label htmlFor="edit-year">ปี</Label>
              <Input
                id="edit-year"
                type="number"
                value={editingCar.year}
                onChange={(e) => setEditingCar(prev => ({ ...prev, year: e.target.value }))}
                placeholder="เช่น 2020"
              />
            </div>
            <div>
              <Label htmlFor="edit-color">สี</Label>
              <Input
                id="edit-color"
                value={editingCar.color}
                onChange={(e) => setEditingCar(prev => ({ ...prev, color: e.target.value }))}
                placeholder="เช่น ขาว, ดำ"
              />
            </div>
            <div>
              <Label htmlFor="edit-plate">ทะเบียน</Label>
              <Input
                id="edit-plate"
                value={editingCar.plate}
                onChange={(e) => setEditingCar(prev => ({ ...prev, plate: e.target.value }))}
                placeholder="เช่น กข-1234"
              />
            </div>
            <div>
              <Label htmlFor="edit-carType">ประเภทรถ</Label>
              <Select
                value={editingCar.carType}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, carType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทรถ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">รถเก๋ง</SelectItem>
                  <SelectItem value="suv">รถ SUV</SelectItem>
                  <SelectItem value="pickup">รถกระบะ</SelectItem>
                  <SelectItem value="van">รถตู้</SelectItem>
                  <SelectItem value="hatchback">รถแฮทช์แบ็ก</SelectItem>
                  <SelectItem value="wagon">รถสเตชันวากอน</SelectItem>
                  <SelectItem value="sports">รถสปอร์ต</SelectItem>
                  <SelectItem value="luxury">รถหรู</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-transmission">ระบบเกียร์</Label>
              <Select
                value={editingCar.transmission}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, transmission: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระบบเกียร์" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">เกียร์ธรรมดา</SelectItem>
                  <SelectItem value="automatic">เกียร์อัตโนมัติ</SelectItem>
                  <SelectItem value="cvt">เกียร์ CVT</SelectItem>
                  <SelectItem value="dct">เกียร์ DCT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-seats">จำนวนที่นั่ง</Label>
              <Select
                value={editingCar.seats}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, seats: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจำนวนที่นั่ง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 ที่นั่ง</SelectItem>
                  <SelectItem value="4">4 ที่นั่ง</SelectItem>
                  <SelectItem value="5">5 ที่นั่ง</SelectItem>
                  <SelectItem value="6">6 ที่นั่ง</SelectItem>
                  <SelectItem value="7">7 ที่นั่ง</SelectItem>
                  <SelectItem value="8">8 ที่นั่ง</SelectItem>
                  <SelectItem value="9">9 ที่นั่ง</SelectItem>
                  <SelectItem value="10">10+ ที่นั่ง</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-fuelType">ระบบเชื้อเพลิง</Label>
              <Select
                value={editingCar.fuelType}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, fuelType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระบบเชื้อเพลิง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">เบนซิน</SelectItem>
                  <SelectItem value="diesel">ดีเซล</SelectItem>
                  <SelectItem value="hybrid">ไฮบริด</SelectItem>
                  <SelectItem value="electric">ไฟฟ้า</SelectItem>
                  <SelectItem value="lpg">แก๊ส LPG</SelectItem>
                  <SelectItem value="ngv">แก๊ส NGV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-engineSize">ความจุเครื่องยนต์</Label>
              <Input
                id="edit-engineSize"
                value={editingCar.engineSize}
                onChange={(e) => setEditingCar(prev => ({ ...prev, engineSize: e.target.value }))}
                placeholder="เช่น 2.0L, 1.5L"
              />
            </div>
            <div>
              <Label htmlFor="edit-doors">จำนวนประตู</Label>
              <Select
                value={editingCar.doors}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, doors: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจำนวนประตู" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 ประตู</SelectItem>
                  <SelectItem value="3">3 ประตู</SelectItem>
                  <SelectItem value="4">4 ประตู</SelectItem>
                  <SelectItem value="5">5 ประตู</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-luggage">จำนวนสัมภาระ</Label>
              <Select
                value={editingCar.luggage}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, luggage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจำนวนสัมภาระ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ใบ</SelectItem>
                  <SelectItem value="2">2 ใบ</SelectItem>
                  <SelectItem value="3">3 ใบ</SelectItem>
                  <SelectItem value="4">4 ใบ</SelectItem>
                  <SelectItem value="5">5 ใบ</SelectItem>
                  <SelectItem value="6">6+ ใบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-price">ราคา</Label>
              <Input
                id="edit-price"
                type="number"
                value={editingCar.price}
                onChange={(e) => setEditingCar(prev => ({ ...prev, price: e.target.value }))}
                placeholder="เช่น 1000"
              />
            </div>
            <div>
              <Label htmlFor="edit-priceType">ประเภทราคา</Label>
              <Select
                value={editingCar.priceType}
                onValueChange={(value) => setEditingCar(prev => ({ ...prev, priceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_day">ต่อวัน</SelectItem>
                  <SelectItem value="per_hour">ต่อชั่วโมง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ข้อมูลสถานที่และเวลา */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-pickupArea">พื้นที่รับส่ง</Label>
              <Textarea
                id="edit-pickupArea"
                value={editingCar.pickupArea}
                onChange={(e) => setEditingCar(prev => ({ ...prev, pickupArea: e.target.value }))}
                placeholder="เช่น กรุงเทพฯ, เชียงใหม่, ภูเก็ต"
                rows={2}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="edit-shopLocation">สถานที่ร้าน</Label>
              <Textarea
                id="edit-shopLocation"
                value={editingCar.shopLocation}
                onChange={(e) => setEditingCar(prev => ({ ...prev, shopLocation: e.target.value }))}
                placeholder="เช่น สนามบินดอนเมือง, สถานีรถไฟหัวลำโพง"
                rows={2}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="edit-normalHours">เวลาทำการปกติ</Label>
              <Textarea
                id="edit-normalHours"
                value={editingCar.normalHours}
                onChange={(e) => setEditingCar(prev => ({ ...prev, normalHours: e.target.value }))}
                placeholder="เช่น 08:00-18:00 น."
                rows={2}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="edit-afterHoursService">ช่วงนอกเวลาทำการ</Label>
              <Textarea
                id="edit-afterHoursService"
                value={editingCar.afterHoursService}
                onChange={(e) => setEditingCar(prev => ({ ...prev, afterHoursService: e.target.value }))}
                placeholder="เช่น 18:00-22:00 น. (มีค่าธรรมเนียมเพิ่ม)"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          {/* บริการเพิ่มเติม */}
          <div>
            <Label className="text-base font-medium">บริการเพิ่มเติม</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-insurance"
                  checked={editingCar.insurance}
                  onChange={(e) => setEditingCar(prev => ({ ...prev, insurance: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-insurance" className="text-sm">ประกันรถยนต์</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-roadsideAssistance"
                  checked={editingCar.roadsideAssistance}
                  onChange={(e) => setEditingCar(prev => ({ ...prev, roadsideAssistance: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-roadsideAssistance" className="text-sm">ช่วยเหลือตลอด 24 ชม.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-freeCancellation"
                  checked={editingCar.freeCancellation}
                  onChange={(e) => setEditingCar(prev => ({ ...prev, freeCancellation: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-freeCancellation" className="text-sm">ยกเลิกฟรีภายใน 12 ชม.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-unlimitedMileage"
                  checked={editingCar.unlimitedMileage}
                  onChange={(e) => setEditingCar(prev => ({ ...prev, unlimitedMileage: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-unlimitedMileage" className="text-sm">ไม่จำกัดระยะทาง</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-unlimitedRoute"
                  checked={editingCar.unlimitedRoute}
                  onChange={(e) => setEditingCar(prev => ({ ...prev, unlimitedRoute: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-unlimitedRoute" className="text-sm">ไม่จำกัดเส้นทาง</Label>
              </div>
            </div>
          </div>

          {/* อัปโหลดรูปภาพ */}
          <div>
            <Label>รูปภาพรถ</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleEditImageUpload}
                className="mb-2"
              />
              {/* Debug info */}
              <div className="text-xs text-gray-500 mb-2">
                จำนวนรูปภาพ: {editingCar.images.length}
              </div>
              {editingCar.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {editingCar.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative">
                      <img
                        src={image}
                        alt={`รูปภาพ ${index + 1}`}
                        className="w-full h-32 object-contain rounded border"
                        onError={(e) => {
                          console.error('Image failed to load:', image);
                          e.currentTarget.src = '/images/placeholder-car.svg';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', image);
                        }}
                      />
                      <button
                        onClick={() => removeEditImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          <div className="flex gap-4">
            <Button 
              onClick={handleUpdateCar} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังอัปเดต...
                </>
              ) : (
                "อัปเดตข้อมูล"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              ยกเลิกการแก้ไข
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 