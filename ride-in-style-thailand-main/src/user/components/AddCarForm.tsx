import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { X, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { MapPicker } from "@/shared/components/MapPicker";

interface AddCarFormProps {
  user: any;
  onCarAdded: () => void;
  onCancel: () => void;
}

export function AddCarForm({ user, onCarAdded, onCancel }: AddCarFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocationAddress, setSelectedLocationAddress] = useState<string>("");
  const { toast } = useToast();
  
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    subModel: "",
    year: "",
    color: "",
    plate: "",
    carType: "",
    transmission: "",
    seats: "",
    fuelType: "",
    engineSize: "",
    doors: "",
    luggage: "",
    price: "",
    priceType: "per_day",
    pickupArea: "",
    shopLocation: "",
    shopLatitude: "",
    shopLongitude: "",
    afterHoursService: "",
    normalHours: "",
    insurance: false,
    roadsideAssistance: false,
    freeCancellation: false,
    unlimitedMileage: false,
    unlimitedRoute: false,
    pickupFee: "",
    deliveryFee: "",
    depositAmount: "",
    images: [] as string[],
    imageFiles: [] as File[],
    documents: [] as string[],
    availableDates: [] as string[],
    availableTimeStart: "",
    availableTimeEnd: "",
  });

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
    setNewCar(prev => ({
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
    setNewCar(prev => ({
      ...prev,
      shopLatitude: "",
      shopLongitude: "",
    }));
    setSelectedLocationAddress("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // ตรวจสอบประเภทไฟล์
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "ประเภทไฟล์ไม่ถูกต้อง",
            description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP, GIF)",
            variant: "destructive",
          });
          continue;
        }

        // สร้าง URL สำหรับแสดงรูปภาพ
        const imageUrl = URL.createObjectURL(file);
        
        // เพิ่มรูปภาพเข้า state พร้อมกับไฟล์ต้นฉบับ
        setNewCar(prev => ({
          ...prev,
          images: [...prev.images, imageUrl],
          imageFiles: [...(prev.imageFiles || []), file]
        }));
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setNewCar(prev => ({
            ...prev,
            documents: [...prev.documents, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewCar(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index: number) => {
    setNewCar(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleAddCar = async () => {
    if (!user?.email) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบก่อน",
        variant: "destructive",
      });
      return;
    }

    if (!newCar.brand || !newCar.model || !newCar.year || !newCar.color || !newCar.plate || !newCar.price) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // อัปโหลดรูปภาพก่อน
      const uploadedImages: string[] = [];
      if (newCar.imageFiles && newCar.imageFiles.length > 0) {
        for (const file of newCar.imageFiles) {
          try {
            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await fetch('/api/upload-car-image', {
              method: 'POST',
              body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
              uploadedImages.push(uploadData.imageUrl);
            } else {
              toast({
                title: "ข้อผิดพลาด",
                description: `ไม่สามารถอัปโหลดรูปภาพ ${file.name} ได้`,
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            toast({
              title: "ข้อผิดพลาด",
              description: `ไม่สามารถอัปโหลดรูปภาพ ${file.name} ได้`,
              variant: "destructive",
            });
          }
        }
      }

      const response = await fetch('/api/add-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          brand: newCar.brand,
          model: newCar.model,
          subModel: newCar.subModel,
          year: parseInt(newCar.year),
          color: newCar.color,
          plateNumber: newCar.plate,
          carType: newCar.carType,
          transmission: newCar.transmission,
          seats: parseInt(newCar.seats),
          fuelType: newCar.fuelType,
          engineSize: newCar.engineSize,
          doors: parseInt(newCar.doors),
          luggage: parseInt(newCar.luggage),
          price: parseFloat(newCar.price),
          priceType: newCar.priceType,
          pickupArea: newCar.pickupArea,
          shopLocation: newCar.shopLocation,
          shopLatitude: newCar.shopLatitude,
          shopLongitude: newCar.shopLongitude,
          afterHoursService: newCar.afterHoursService,
          normalHours: newCar.normalHours,
          insurance: newCar.insurance,
          roadsideAssistance: newCar.roadsideAssistance,
          freeCancellation: newCar.freeCancellation,
          unlimitedMileage: newCar.unlimitedMileage,
          unlimitedRoute: newCar.unlimitedRoute,
          pickupFee: newCar.pickupFee ? parseFloat(newCar.pickupFee) : 0,
          deliveryFee: newCar.deliveryFee ? parseFloat(newCar.deliveryFee) : 0,
          depositAmount: newCar.depositAmount ? parseFloat(newCar.depositAmount) : 0,
          images: uploadedImages,
          documents: newCar.documents,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "สำเร็จ",
          description: "เพิ่มรถใหม่สำเร็จ",
        });
        
        // รีเซ็ตฟอร์ม
        setNewCar({
          brand: "",
          model: "",
          subModel: "",
          year: "",
          color: "",
          plate: "",
          carType: "",
          transmission: "",
          seats: "",
          fuelType: "",
          engineSize: "",
          doors: "",
          luggage: "",
          price: "",
          priceType: "per_day",
          pickupArea: "",
          shopLocation: "",
          shopLatitude: "",
          shopLongitude: "",
          afterHoursService: "",
          normalHours: "",
          insurance: false,
          roadsideAssistance: false,
          freeCancellation: false,
          unlimitedMileage: false,
          unlimitedRoute: false,
          pickupFee: "",
          deliveryFee: "",
          depositAmount: "",
          images: [],
          imageFiles: [],
          documents: [],
          availableDates: [],
          availableTimeStart: "",
          availableTimeEnd: "",
        });
        setSelectedLocationAddress("");
        
        // เรียก callback
        onCarAdded();
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: data.error || "ไม่สามารถเพิ่มรถใหม่ได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding car:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มรถใหม่ได้",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

    return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>เพิ่มรถใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* ข้อมูลพื้นฐาน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">ยี่ห้อ</Label>
                <Input
                  id="brand"
                  value={newCar.brand}
                  onChange={(e) => setNewCar(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="เช่น Toyota, Honda"
                />
              </div>
              <div>
                <Label htmlFor="model">รุ่น</Label>
                <Input
                  id="model"
                  value={newCar.model}
                  onChange={(e) => setNewCar(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="เช่น Camry, Civic"
                />
              </div>
              <div>
                <Label htmlFor="subModel">รุ่นย่อย</Label>
                <Input
                  id="subModel"
                  value={newCar.subModel}
                  onChange={(e) => setNewCar(prev => ({ ...prev, subModel: e.target.value }))}
                  placeholder="เช่น 2.0G, 2.5V"
                />
              </div>
              <div>
                <Label htmlFor="year">ปี</Label>
                <Input
                  id="year"
                  type="number"
                  value={newCar.year}
                  onChange={(e) => setNewCar(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="เช่น 2020"
                />
              </div>
              <div>
                <Label htmlFor="color">สี</Label>
                <Input
                  id="color"
                  value={newCar.color}
                  onChange={(e) => setNewCar(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="เช่น ขาว, ดำ"
                />
              </div>
              <div>
                <Label htmlFor="plate">ทะเบียน</Label>
                <Input
                  id="plate"
                  value={newCar.plate}
                  onChange={(e) => setNewCar(prev => ({ ...prev, plate: e.target.value }))}
                  placeholder="เช่น กข-1234"
                />
              </div>
              <div>
                <Label htmlFor="carType">ประเภทรถ</Label>
                <Select
                  value={newCar.carType}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, carType: value }))}
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
                <Label htmlFor="transmission">ระบบเกียร์</Label>
                <Select
                  value={newCar.transmission}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, transmission: value }))}
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
                <Label htmlFor="seats">จำนวนที่นั่ง</Label>
                <Select
                  value={newCar.seats}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, seats: value }))}
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
                <Label htmlFor="fuelType">ระบบเชื้อเพลิง</Label>
                <Select
                  value={newCar.fuelType}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, fuelType: value }))}
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
                <Label htmlFor="engineSize">ความจุเครื่องยนต์</Label>
                <Input
                  id="engineSize"
                  value={newCar.engineSize}
                  onChange={(e) => setNewCar(prev => ({ ...prev, engineSize: e.target.value }))}
                  placeholder="เช่น 2.0L, 1.5L"
                />
              </div>
              <div>
                <Label htmlFor="doors">จำนวนประตู</Label>
                <Select
                  value={newCar.doors}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, doors: value }))}
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
                <Label htmlFor="luggage">จำนวนสัมภาระ</Label>
                <Select
                  value={newCar.luggage}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, luggage: value }))}
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
                <Label htmlFor="price">ราคา</Label>
                <Input
                  id="price"
                  type="number"
                  value={newCar.price}
                  onChange={(e) => setNewCar(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="เช่น 1000"
                />
              </div>
              <div>
                <Label htmlFor="priceType">ประเภทราคา</Label>
                <Select
                  value={newCar.priceType}
                  onValueChange={(value) => setNewCar(prev => ({ ...prev, priceType: value }))}
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
                <Label htmlFor="pickupArea">พื้นที่รับส่ง</Label>
                <Textarea
                  id="pickupArea"
                  value={newCar.pickupArea}
                  onChange={(e) => setNewCar(prev => ({ ...prev, pickupArea: e.target.value }))}
                  placeholder="เช่น กรุงเทพฯ, เชียงใหม่, ภูเก็ต"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div>
                <Label>ที่อยู่ร้าน</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    {selectedLocationAddress ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{selectedLocationAddress}</p>
                      </div>
                    ) : newCar.shopLatitude && newCar.shopLongitude ? (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">
                          ละติจูด: {newCar.shopLatitude}, ลองจิจูด: {newCar.shopLongitude}
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
                <Label htmlFor="normalHours">เวลาทำการปกติ</Label>
                <Textarea
                  id="normalHours"
                  value={newCar.normalHours}
                  onChange={(e) => setNewCar(prev => ({ ...prev, normalHours: e.target.value }))}
                  placeholder="เช่น 08:00-18:00 น."
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div>
                <Label htmlFor="shopLocation">สถานที่ร้าน</Label>
                <Input
                  id="shopLocation"
                  value={newCar.shopLocation}
                  onChange={(e) => setNewCar(prev => ({ ...prev, shopLocation: e.target.value }))}
                  placeholder="เช่น สนามบินดอนเมือง, สถานีรถไฟหัวลำโพง"
                />
              </div>
              <div>
                <Label htmlFor="afterHoursService">ช่วงนอกเวลาทำการ</Label>
                <Textarea
                  id="afterHoursService"
                  value={newCar.afterHoursService}
                  onChange={(e) => setNewCar(prev => ({ ...prev, afterHoursService: e.target.value }))}
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
                  <Label htmlFor="pickupFee">ค่ารับรถ (บาท)</Label>
                  <Input
                    id="pickupFee"
                    type="number"
                    value={newCar.pickupFee}
                    onChange={(e) => setNewCar(prev => ({ ...prev, pickupFee: e.target.value }))}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryFee">ค่าส่งรถ (บาท)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={newCar.deliveryFee}
                    onChange={(e) => setNewCar(prev => ({ ...prev, deliveryFee: e.target.value }))}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="depositAmount">ค่ามัดจำ (บาท)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    value={newCar.depositAmount}
                    onChange={(e) => setNewCar(prev => ({ ...prev, depositAmount: e.target.value }))}
                    placeholder="5000"
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
                    id="insurance"
                    checked={newCar.insurance}
                    onChange={(e) => setNewCar(prev => ({ ...prev, insurance: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="insurance" className="text-sm">ประกันรถยนต์</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="roadsideAssistance"
                    checked={newCar.roadsideAssistance}
                    onChange={(e) => setNewCar(prev => ({ ...prev, roadsideAssistance: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="roadsideAssistance" className="text-sm">ช่วยเหลือตลอด 24 ชม.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="freeCancellation"
                    checked={newCar.freeCancellation}
                    onChange={(e) => setNewCar(prev => ({ ...prev, freeCancellation: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="freeCancellation" className="text-sm">ยกเลิกฟรีภายใน 12 ชม.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="unlimitedMileage"
                    checked={newCar.unlimitedMileage}
                    onChange={(e) => setNewCar(prev => ({ ...prev, unlimitedMileage: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="unlimitedMileage" className="text-sm">ไม่จำกัดระยะทาง</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="unlimitedRoute"
                    checked={newCar.unlimitedRoute}
                    onChange={(e) => setNewCar(prev => ({ ...prev, unlimitedRoute: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="unlimitedRoute" className="text-sm">ไม่จำกัดเส้นทาง</Label>
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
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-add"
                />
                <label htmlFor="image-upload-add" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  เลือกไฟล์รูปภาพ
                </label>
                {newCar.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {newCar.images.map((image, index) => (
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
                          onClick={() => removeImage(index)}
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

            {/* อัปโหลดเอกสาร */}
            <div>
              <Label>เอกสารรถ (ไม่บังคับ)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload-add"
                />
                <label htmlFor="document-upload-add" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
                  เลือกไฟล์เอกสาร
                </label>
                {newCar.documents.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {newCar.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">เอกสาร {index + 1}</span>
                        <button
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
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
                onClick={handleAddCar} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังเพิ่มรถ...
                  </>
                ) : (
                  "เพิ่มรถ"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
              >
                ยกเลิก
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
        initialLatitude={newCar.shopLatitude ? parseFloat(newCar.shopLatitude) : 13.7563}
        initialLongitude={newCar.shopLongitude ? parseFloat(newCar.shopLongitude) : 100.5018}
      />
    </>
  );
} 