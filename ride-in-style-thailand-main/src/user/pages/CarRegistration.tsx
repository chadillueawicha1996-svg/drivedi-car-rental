import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Calendar, Upload, DollarSign, Clock, FileText } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

export default function CarRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("day");
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeStart, setAvailableTimeStart] = useState("");
  const [availableTimeEnd, setAvailableTimeEnd] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // ใช้ is_admin จาก currentUser แทน isAdmin แยก
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [engineSize, setEngineSize] = useState("");
  const [fuelType, setFuelType] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const userData = JSON.parse(stored);
      // ตรวจสอบ is_admin จาก currentUser
      const adminStatus = userData.is_admin === 1;
      setIsAdmin(adminStatus);
      
      if (adminStatus) return; // admin เข้าหน้านี้ได้เสมอ
      if (userData.user_type !== "owner") {
        toast({
          title: "ไม่สามารถเข้าถึงได้",
          description: "หน้านี้สำหรับผู้ให้เช่าเท่านั้น",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      setUser(userData);
    } else {
      navigate('/login');
    }
  }, [navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setImages(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setDocuments(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const dateInput = (document.getElementById("dateInput") as HTMLInputElement)?.value;
    if (dateInput && !availableDates.includes(dateInput)) {
      setAvailableDates(prev => [...prev, dateInput]);
    }
  };

  const handleRemoveDate = (date: string) => {
    setAvailableDates(prev => prev.filter(d => d !== date));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!brand || !model || !year || !color || !plate || !price || images.length === 0 || documents.length === 0 || availableDates.length === 0 || !availableTimeStart || !availableTimeEnd) && !isAdmin) {
      setError(t("carreg_error_fill_all", "กรุณากรอกข้อมูลและอัปโหลดไฟล์ให้ครบถ้วน"));
      return;
    }
    setError("");
    const car = {
      id: Date.now(),
      brand,
      model,
      year,
      color,
      plate,
      engineSize,
      fuelType,
      price,
      priceType,
      images,
      documents,
      availableDates,
      availableTimeStart,
      availableTimeEnd,
      status: "pending",
    };
    const cars = JSON.parse(localStorage.getItem("myCars") || "[]");
    cars.push(car);
    localStorage.setItem("myCars", JSON.stringify(cars));
    setSuccess(t("carreg_success", "ลงทะเบียนรถสำเร็จ!"));
    setTimeout(() => setSuccess(""), 1500);
    // reset form (optional)
  };

  return (
    <section className="py-8 px-2 md:py-16 md:px-4 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white">
        <div className="p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900">{t("register_car", "ลงทะเบียนรถของคุณ")}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
              <div>
                <Label>{t("brand", "ยี่ห้อรถ")}</Label>
                <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder={t("brand_placeholder", "เช่น Toyota, Honda")}/>
              </div>
              <div>
                <Label>{t("model", "รุ่นรถ")}</Label>
                <Input value={model} onChange={e => setModel(e.target.value)} placeholder={t("model_placeholder", "เช่น Camry, CR-V")}/>
              </div>
              <div>
                <Label>{t("year", "ปีรถ")}</Label>
                <Input value={year} onChange={e => setYear(e.target.value)} placeholder={t("year_placeholder", "เช่น 2022")}/>
              </div>
              <div>
                <Label>{t("color", "สีรถ")}</Label>
                <Input value={color} onChange={e => setColor(e.target.value)} placeholder={t("color_placeholder", "เช่น ขาว, ดำ")}/>
              </div>
              <div>
                <Label>{t("plate", "ทะเบียนรถ")}</Label>
                <Input value={plate} onChange={e => setPlate(e.target.value)} placeholder={t("plate_placeholder", "1กข 1234")}/>
              </div>
              <div>
                <Label>{t("vehicle_type", "ประเภทรถ")}</Label>
                <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="">{t("select_vehicle_type", "เลือกประเภทรถ")}</option>
                  <option value="sedan">{t("sedan", "รถเก๋ง")}</option>
                  <option value="suv">{t("suv", "รถ SUV")}</option>
                  <option value="pickup">{t("pickup", "รถกระบะ")}</option>
                  <option value="motorcycle">{t("motorcycle", "รถจักรยานยนต์")}</option>
                  <option value="other">{t("other", "อื่นๆ")}</option>
                </select>
              </div>
              <div>
                <Label>{t("price", "ราคา")}</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={t("price_placeholder", "เช่น 1500")}/>
                  <select value={priceType} onChange={e => setPriceType(e.target.value)} className="border rounded px-2 py-1">
                    <option value="day">{t("per_day", "/วัน")}</option>
                    <option value="hour">{t("per_hour", "/ชม.")}</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>ขนาดเครื่องยนต์ (ซีซี หรือ kW)</Label>
                <Input value={engineSize} onChange={e => setEngineSize(e.target.value)} placeholder="เช่น 1500, 2000, 75kW" />
              </div>
              <div>
                <Label>ประเภทน้ำมันเชื้อเพลิง</Label>
                <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="">เลือกประเภทน้ำมัน</option>
                  <option value="เบนซิน">เบนซิน</option>
                  <option value="ดีเซล">ดีเซล</option>
                  <option value="ไฮบริด">ไฮบริด</option>
                  <option value="ไฟฟ้า">ไฟฟ้า (EV)</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
            </div>
            <div className="mb-6 pb-6 border-b">
              <Label>{t("car_images", "รูปรถ (อัปโหลดได้หลายรูป)")}</Label>
              <Input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-28">
                    <img src={img} alt="car" className="h-20 w-28 object-cover rounded border" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center bg-white border-2 border-red-400 hover:border-red-600 rounded-full shadow text-red-600 font-bold text-base transition-colors"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      aria-label="ลบรูป"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6 pb-6 border-b">
              <Label>{t("car_documents", "เอกสารรถ (อัปโหลดได้หลายไฟล์)")}</Label>
              <Input type="file" accept="image/*,application/pdf" multiple onChange={handleDocumentUpload} />
              <div className="flex flex-wrap gap-2 mt-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span className="text-xs text-gray-500">{t("uploaded", "อัปโหลดแล้ว")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6 pb-6 border-b">
              <Label>{t("available_dates", "วันที่ปล่อยเช่า (เลือกได้หลายวัน)")}</Label>
              <form onSubmit={handleDateAdd} className="flex items-center gap-2 mt-2">
                <Input type="date" id="dateInput" className="w-40" />
                <Button type="submit" variant="outline">{t("add_date", "เพิ่มวัน")}</Button>
              </form>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableDates.map(date => (
                  <div key={date} className="bg-blue-100 text-blue-700 rounded px-3 py-1 flex items-center gap-1">
                    <span>{date}</span>
                    <button type="button" onClick={() => handleRemoveDate(date)} className="text-red-500 ml-1">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label>{t("available_time_start", "เวลาเริ่มปล่อยเช่า")}</Label>
                <Input type="time" value={availableTimeStart} onChange={e => setAvailableTimeStart(e.target.value)} />
              </div>
              <div>
                <Label>{t("available_time_end", "เวลาสิ้นสุดปล่อยเช่า")}</Label>
                <Input type="time" value={availableTimeEnd} onChange={e => setAvailableTimeEnd(e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg py-6 mt-4" disabled={(!brand || !model || !year || !color || !plate || !price || images.length === 0 || documents.length === 0 || availableDates.length === 0 || !availableTimeStart || !availableTimeEnd) && !isAdmin}>
              {t("register_car_btn", "ลงทะเบียนรถ")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
} 