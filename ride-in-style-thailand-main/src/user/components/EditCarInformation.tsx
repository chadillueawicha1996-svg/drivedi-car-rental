import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { X, Loader2, ArrowLeft, FileText, MapPin } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { MapPicker } from "@/shared/components/MapPicker";

interface EditCarInformationProps {
  user: any;
  car: any;
  onCarUpdated: () => void;
  onBackToList: () => void;
}

export function EditCarInformation({ user, car, onCarUpdated, onBackToList }: EditCarInformationProps) {
  // Debug: แสดงข้อมูล car object
  console.log('EditCarInformation - Car object:', car);
  console.log('EditCarInformation - Car properties:', {
    id: car?.id,
    brand: car?.brand,
    model: car?.model,
    year: car?.year,
    color: car?.color,
    plate_number: car?.plate_number,
    price: car?.price
  });
  
  // Debug: แสดงข้อมูล additional services
  console.log('EditCarInformation - Additional services:', {
    insurance: car?.insurance,
    roadside_assistance: car?.roadside_assistance,
    free_cancellation: car?.free_cancellation,
    unlimited_mileage: car?.unlimited_mileage,
    unlimited_route: car?.unlimited_route
  });
  
  // Debug: แสดงข้อมูลทั้งหมดของ car object
  console.log('EditCarInformation - All car fields:', Object.keys(car).map(key => `${key}: ${car[key]} (${typeof car[key]})`));
  
  const [submitting, setSubmitting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocationAddress, setSelectedLocationAddress] = useState<string>("");
  const { toast } = useToast();
  
  const [editingCar, setEditingCar] = useState({
    id: car.id,
    brand: car.brand || "",
    model: car.model || "",
    subModel: car.sub_model || "",
    year: car.year ? car.year.toString() : "",
    color: car.color || "",
    plate: car.plate_number || "",
    carType: car.car_type || "",
    transmission: car.transmission || "",
    seats: car.seats ? car.seats.toString() : "",
    fuelType: car.fuel_type || "",
    engineSize: car.engine_size || "",
    doors: car.doors ? car.doors.toString() : "",
    luggage: car.luggage ? car.luggage.toString() : "",
    price: car.price ? car.price.toString() : "",
    priceType: car.price_type || "",
    pickupArea: car.pickup_area || "",
    shopLocation: car.shop_location || "",
    shopLatitude: car.shop_latitude || "",
    shopLongitude: car.shop_longitude || "",
    afterHoursService: car.after_hours_service || "",
    normalHours: car.normal_hours || "",
    insurance: car.insurance === 1 || car.insurance === '1' || car.insurance === true,
    roadsideAssistance: car.roadside_assistance === 1 || car.roadside_assistance === '1' || car.roadside_assistance === true,
    freeCancellation: car.free_cancellation === 1 || car.free_cancellation === '1' || car.free_cancellation === true,
    unlimitedMileage: car.unlimited_mileage === 1 || car.unlimited_mileage === '1' || car.unlimited_mileage === true,
    unlimitedRoute: car.unlimited_route === 1 || car.unlimited_route === '1' || car.unlimited_route === true,
    pickupFee: car.pickup_fee || "",
    deliveryFee: car.delivery_fee || "",
    depositAmount: car.deposit_amount || "",
    images: car.images || [],
    documents: car.documents || [],
  });
  
  // Debug: แสดงข้อมูล additional services ที่แปลงแล้ว
  console.log('EditCarInformation - Converted additional services:', {
    insurance: editingCar.insurance,
    roadsideAssistance: editingCar.roadsideAssistance,
    freeCancellation: editingCar.freeCancellation,
    unlimitedMileage: editingCar.unlimitedMileage,
    unlimitedRoute: editingCar.unlimitedRoute
  });

  // โหลดที่อยู่เมื่อมีพิกัด GPS
  useEffect(() => {
    const loadAddressFromCoordinates = async () => {
      if (editingCar.shopLatitude && editingCar.shopLongitude) {
        const address = await getAddressFromCoordinates(
          parseFloat(editingCar.shopLatitude), 
          parseFloat(editingCar.shopLongitude)
        );
        setSelectedLocationAddress(address);
      }
    };

    loadAddressFromCoordinates();
  }, [editingCar.shopLatitude, editingCar.shopLongitude]);

  // ฟังก์ชันสำหรับเปิดแผนที่
  const openMapPicker = () => {
    setIsMapOpen(true);
  };

  // ฟังก์ชันสำหรับแปลงพิกัดเป็นที่อยู่
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=th`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return '';
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  // ฟังก์ชันสำหรับเลือกตำแหน่งจากแผนที่
  const handleLocationSelect = async (latitude: number, longitude: number) => {
    setEditingCar(prev => ({
      ...prev,
      shopLatitude: latitude.toString(),
      shopLongitude: longitude.toString(),
    }));
    
    // แปลงพิกัดเป็นที่อยู่
    const address = await getAddressFromCoordinates(latitude, longitude);
    setSelectedLocationAddress(address);
    
    toast({
      title: "เลือกตำแหน่งสำเร็จ",
      description: address || `ตำแหน่ง: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    });
  };

  // ฟังก์ชันสำหรับล้างตำแหน่ง
  const handleClearLocation = () => {
    setEditingCar(prev => ({
      ...prev,
      shopLatitude: "",
      shopLongitude: "",
    }));
    setSelectedLocationAddress("");
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        // ตรวจสอบขนาดไฟล์
        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast({
            title: "ไฟล์ใหญ่เกินไป",
            description: "กรุณาเลือกไฟล์ที่มีขนาดน้อยกว่า 5MB",
            variant: "destructive",
          });
          continue;
        }

        try {
          // สร้าง FormData
          const formData = new FormData();
          formData.append('image', file);

          // อัปโหลดรูปภาพ
          const response = await fetch('/api/upload-car-image', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            setEditingCar(prev => ({
              ...prev,
              images: [...prev.images, data.imageUrl]
            }));
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
            description: "ไม่สามารถอัปโหลดรูปภาพได้",
            variant: "destructive",
          });
        }
      }
    }
  };

  const removeEditImage = (index: number) => {
    setEditingCar(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleEditDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      toast({
        title: "ไม่ได้เลือกไฟล์ใด",
        description: "กรุณาเลือกไฟล์เอกสารที่ต้องการอัปโหลด",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    
    for (const file of Array.from(files)) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(`.${fileExtension}`)) {
        toast({
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์เอกสารเท่านั้น (PDF, DOC, DOCX, JPG, JPEG, PNG)",
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาเลือกไฟล์ที่มีขนาดน้อยกว่า 10MB",
          variant: "destructive",
        });
        continue;
      }

      if (file.size === 0) {
        toast({
          title: "ไฟล์ว่างเปล่า",
          description: "กรุณาเลือกไฟล์ที่มีข้อมูล",
          variant: "destructive",
        });
        continue;
      }

      try {
        toast({
          title: "กำลังอัปโหลด...",
          description: `กำลังอัปโหลด ${file.name}`,
        });

        const formData = new FormData();
        formData.append('document', file);

        const response = await fetch('/api/upload-car-document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          console.log('Document uploaded successfully:', data.documentUrl);
          
          setEditingCar(prev => {
            const newDocuments = [...prev.documents, data.documentUrl];
            console.log('Updated editingCar documents:', newDocuments);
            console.log('Previous documents count:', prev.documents.length);
            console.log('New documents count:', newDocuments.length);
            return {
              ...prev,
              documents: newDocuments
            };
          });
          
          toast({
            title: "อัปโหลดสำเร็จ",
            description: `อัปโหลด ${file.name} สำเร็จแล้ว`,
          });
        } else {
          toast({
            title: "ข้อผิดพลาด",
            description: data.error || "ไม่สามารถอัปโหลดเอกสารได้",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        toast({
          title: "ข้อผิดพลาด",
          description: `ไม่สามารถอัปโหลด ${file.name} ได้ กรุณาลองใหม่อีกครั้ง`,
          variant: "destructive",
        });
      }
    }
    
    e.target.value = '';
  };

  const removeEditDocument = (index: number) => {
    setEditingCar(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
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
      console.log('Sending fees data:', {
        pickupFee: editingCar.pickupFee,
        deliveryFee: editingCar.deliveryFee,
        depositAmount: editingCar.depositAmount
      });
      
      // Debug: แสดงข้อมูลที่จะส่งไปยัง API
      const updateData = {
        brand: editingCar.brand || 'ไม่ระบุ',
        model: editingCar.model || 'ไม่ระบุ',
        sub_model: editingCar.subModel || 'ไม่ระบุ',
        year: parseInt(editingCar.year) || 2024,
        color: editingCar.color || 'ไม่ระบุ',
        plate_number: editingCar.plate || 'ไม่ระบุ',
        car_type: editingCar.carType || 'sedan', // ใช้ค่า default เมื่อเป็นสตริงว่าง
        transmission: editingCar.transmission || 'ไม่ระบุ',
        seats: parseInt(editingCar.seats) || 4,
        fuel_type: editingCar.fuelType || 'gasoline',
        engine_size: editingCar.engineSize || 'ไม่ระบุ',
        doors: parseInt(editingCar.doors) || 4,
        luggage: parseInt(editingCar.luggage) || 1,
        price: parseFloat(editingCar.price) || 0,
        price_type: editingCar.priceType || 'per_day',
        pickup_area: editingCar.pickupArea || 'ไม่ระบุ',
        shop_location: editingCar.shopLocation || 'ไม่ระบุ',
        after_hours_service: editingCar.afterHoursService || 'ไม่ระบุ',
        normal_hours: editingCar.normalHours || 'ไม่ระบุ',
        insurance: editingCar.insurance ? 1 : 0,
        roadside_assistance: editingCar.roadsideAssistance ? 1 : 0,
        free_cancellation: editingCar.freeCancellation ? 1 : 0,
        unlimited_mileage: editingCar.unlimitedMileage ? 1 : 0,
        unlimited_route: editingCar.unlimitedRoute ? 1 : 0,
      };
      
      console.log('Update data being sent:', updateData);
      console.log('car_type value:', editingCar.carType, 'Type:', typeof editingCar.carType, 'Length:', editingCar.carType?.length);
      
      const response = await fetch(`http://localhost:3001/api/update-car/${editingCar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">แก้ไขข้อมูลรถ</h2>
          <p className="text-gray-600 mt-1">แก้ไขข้อมูลรถ {car.brand} {car.model} ({car.year})</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
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
                <Label>ที่อยู่ร้าน</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    {selectedLocationAddress ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{selectedLocationAddress}</p>
                      </div>
                    ) : editingCar.shopLatitude && editingCar.shopLongitude ? (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">
                          ละติจูด: {editingCar.shopLatitude}, ลองจิจูด: {editingCar.shopLongitude}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500">ยังไม่ได้เลือกตำแหน่ง</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={openMapPicker}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    เลือกตำแหน่ง
                  </Button>
                </div>
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
                  <Label htmlFor="edit-shopLocation">สถานที่ร้าน</Label>
                  <Input
                    id="edit-shopLocation"
                    value={editingCar.shopLocation}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, shopLocation: e.target.value }))}
                    placeholder="เช่น สนามบินดอนเมือง, สถานีรถไฟหัวลำโพง"
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

            {/* ค่าบริการ */}
            <div>
              <Label className="text-base font-medium">ค่าบริการ</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="edit-pickupFee">ค่ารับรถ (บาท)</Label>
                  <Input
                    id="edit-pickupFee"
                    type="number"
                    value={editingCar.pickupFee}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, pickupFee: e.target.value }))}
                    
                  />
                </div>
                <div>
                  <Label htmlFor="edit-deliveryFee">ค่าส่งรถ (บาท)</Label>
                  <Input
                    id="edit-deliveryFee"
                    type="number"
                    value={editingCar.deliveryFee}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, deliveryFee: e.target.value }))}
                    
                  />
                </div>
                <div>
                  <Label htmlFor="edit-depositAmount">ค่ามัดจำ (บาท)</Label>
                  <Input
                    id="edit-depositAmount"
                    type="number"
                    value={editingCar.depositAmount}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, depositAmount: e.target.value }))}
                    
                  />
                </div>
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
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  เลือกไฟล์รูปภาพ
                </label>
                {editingCar.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {editingCar.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`รูปภาพ ${index + 1}`}
                          className="w-full h-32 object-contain rounded border"
                          onError={(e) => {
                            console.error('Image failed to load:', image);
                            console.error('Image element:', e.target);
                            // ลองใช้ path แบบอื่น
                            const alternativePath = image.replace('/uploads/cars/', '/public/uploads/cars/');
                            console.log('Trying alternative path:', alternativePath);
                            e.currentTarget.src = alternativePath;
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

            {/* อัปโหลดเอกสารรถ */}
            <div>
              <Label>เอกสารรถ (ไม่บังคับ)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleEditDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
                  เลือกไฟล์เอกสาร
                </label>
                {editingCar.documents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {editingCar.documents.map((document, index) => (
                      <div key={`${document}-${index}`} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm truncate">{document.split('/').pop()}</span>
                        </div>
                        <button
                          onClick={() => removeEditDocument(index)}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
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
                onClick={onBackToList}
                disabled={submitting}
              >
                ยกเลิกการแก้ไข
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MapPicker Component */}
      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        onLocationClear={handleClearLocation}
        initialLatitude={editingCar.shopLatitude ? parseFloat(editingCar.shopLatitude) : 13.7563}
        initialLongitude={editingCar.shopLongitude ? parseFloat(editingCar.shopLongitude) : 100.5018}
      />
    </div>
  );
} 