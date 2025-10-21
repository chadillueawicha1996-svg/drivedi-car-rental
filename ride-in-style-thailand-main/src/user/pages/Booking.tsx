import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Navigation } from "@/user/components/Navigation";
import { ReviewSection } from "@/shared/components/ReviewSection";
import { BookingDetailsCard } from "@/user/components/BookingDetailsCard";
import { Breadcrumb } from "@/shared/components/Breadcrumb";
import { Share2, Calendar, MapPin, Clock, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";

const locations = [
  { value: "bangkok", label: "กรุงเทพมหานคร" },
  { value: "chiangmai", label: "เชียงใหม่" },
  { value: "phuket", label: "ภูเก็ต" },
  { value: "pattaya", label: "พัทยา" },
  { value: "hatyai", label: "หาดใหญ่" },
];

const times = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"
];

// Function to fetch car data from API
async function getCarById(carId: string) {
  try {
    console.log('Fetching car with ID:', carId);
    
    // ใช้ API endpoint ที่ถูกต้อง
    const response = await fetch(`http://localhost:3001/api/cars/${carId}`);
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return null;
    }
    
    const car = await response.json();
    console.log('API Response - Car data:', car);
    
    if (car && car.id) {
      return car;
    } else {
      console.error('Invalid car data received:', car);
      return null;
    }
  } catch (error) {
    console.error('Error loading car:', error);
    return null;
  }
}

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

// Helper: calculate total days
function getTotalDays(start: string, end: string) {
  if (!start || !end) return 1;
  
  // ตรวจสอบว่าวันที่เป็นรูปแบบ YYYY-MM-DD หรือไม่
  if (start.match(/^\d{4}-\d{2}-\d{2}$/) && end.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // ถ้าเป็นรูปแบบ YYYY-MM-DD ให้แปลงโดยตรง
    const [startYear, startMonth, startDay] = start.split('-').map(Number);
    const [endYear, endMonth, endDay] = end.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }
  
  // ถ้าเป็นรูปแบบอื่น ให้ใช้ Date object ตามเดิม
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function Booking() {
  const { t } = useTranslation();
  const { carId } = useParams();
  const query = useQuery();
  const navigate = useNavigate();

  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // ใช้ is_admin จาก currentUser แทน isAdmin แยก
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupLocation, setPickupLocation] = useState(query.get("location") || "");
  const [pickupDate, setPickupDate] = useState(query.get("pickupDate") || "");
  const [returnDate, setReturnDate] = useState(query.get("returnDate") || "");
  const [pickupTime, setPickupTime] = useState(query.get("pickupTime") || "10:00");
  const [returnTime, setReturnTime] = useState(query.get("returnTime") || "10:00");
  const [note, setNote] = useState("");

  useEffect(() => {
    // ตรวจสอบ is_admin จาก currentUser
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setIsAdmin(userData.is_admin === 1);
    }
  }, []);

  useEffect(() => {
    const loadCar = async () => {
      if (!carId) {
        console.error('No car ID provided in URL');
        setError('ไม่พบรหัสรถ กรุณาเลือกรถจากหน้าค้นหา');
        setIsLoading(false);
        return;
      }
      
      console.log('Loading car with ID:', carId);
      setIsLoading(true);
      setError('');
      
      try {
        const carData = await getCarById(carId);
        if (carData) {
          // Debug: log car data
          console.log('Car data received:', carData);
          console.log('Engine size:', carData.engine_size);
          console.log('Delivery fee:', carData.delivery_fee);
          console.log('Pickup fee:', carData.pickup_fee);
          console.log('Deposit amount:', carData.deposit_amount);
          console.log('Price:', carData.price);
          
          // Debug: แสดง keys ทั้งหมดของ carData
          console.log('All carData keys:', Object.keys(carData));
          console.log('Raw carData object:', carData);
          
          // Ensure images array exists and has at least one image
          if (!carData.images || carData.images.length === 0) {
            carData.images = ['/images/placeholder-car.svg'];
          }
          setSelectedCar(carData);
        } else {
          console.error('No car data received from API');
          setError('ไม่พบข้อมูลรถ กรุณาลองใหม่อีกครั้ง');
        }
      } catch (error) {
        console.error('Error loading car:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลรถ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };

    loadCar();
  }, [carId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!pickupDate || !returnDate || !pickupTime || !returnTime || !pickupLocation) && !isAdmin) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setError("");
    
    // Navigate to payment page with booking data
    const bookingData = {
      carId: selectedCar?.id,
      carName: selectedCar?.name,
      price: selectedCar?.price,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      location: pickupLocation
    };
    
    navigate('/payment', { state: { bookingData } });
  };

  const pricePerDay = parseInt((selectedCar?.price || '0').replace(/,/g, ''));
  const totalDays = getTotalDays(pickupDate, returnDate);
  const totalPrice = pricePerDay * totalDays;

  return (
    <>
      <Navigation />
      <div className="w-full px-4 py-4 bg-white">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "หน้าแรก", path: "/" },
            { label: "ผลการค้นหา", path: "/search-results" },
            { label: "รายละเอียดรถ", isActive: true }
          ]} 
        />
      </div>

      <section className="py-8 px-2 md:py-16 md:px-4 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Error or Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูลรถ...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">ไม่สามารถโหลดข้อมูลรถได้</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/search-results')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    กลับไปหน้าค้นหา
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    ลองใหม่อีกครั้ง
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Car Content - Only show when car is loaded */}
          {selectedCar && !isLoading && !error && (
            <>
              {/* Car Images Section - Top */}
              <div className="mb-6">
                {/* Car Title and Share Button */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="car-name-title">{selectedCar.brand} {selectedCar.model}</h2>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                {/* Car Images Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                  {/* Main Large Image */}
                  <div className="lg:col-span-3 relative">
                    <img
                      src={selectedCar.images[0]}
                      alt={selectedCar.brand + ' ' + selectedCar.model}
                      className="w-full h-96 lg:h-[500px] object-cover rounded-lg cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-car.svg';
                      }}
                    />
                    {/* Image counter overlay */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                      </svg>
                      มีทั้งหมด {selectedCar.images.length} ภาพ
                    </div>
                  </div>

                  {/* Small Images Grid */}
                  <div className="lg:col-span-3 flex flex-col gap-4 justify-center">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {selectedCar.images.slice(1, 5).map((img: string, idx: number) => (
                        <div
                          key={img}
                          className="w-full h-full border-2 border-gray-200 rounded-lg overflow-hidden"
                        >
                          <img 
                            src={img} 
                            alt={selectedCar.brand + ' ' + selectedCar.model + '-' + (idx + 1)} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-car.svg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Car Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-16">
                {/* Left: Car Info */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {/* Car Details */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 gap-4 text-gray-700 mb-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/sportive-car (1).png" alt="Car" className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">ประเภทรถ</div>
                            <div className="font-medium">
                              {selectedCar.car_type === 'sedan' ? 'รถเก๋ง' : 
                               selectedCar.car_type === 'suv' ? 'SUV' : 
                               selectedCar.car_type === 'pickup' ? 'กระบะ' : 
                               selectedCar.car_type === 'van' ? 'รถตู้' : 
                               selectedCar.car_type === 'hatchback' ? 'รถแฮทช์แบ็ก' : 
                               selectedCar.car_type === 'wagon' ? 'รถสเตชันวากอน' : 
                               selectedCar.car_type === 'sports' ? 'รถสปอร์ต' : 
                               selectedCar.car_type === 'luxury' ? 'รถหรู' : selectedCar.car_type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/car-seat.png" alt="Car" className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">จำนวนที่นั่ง</div>
                            <div className="font-medium">{selectedCar.seats} ที่นั่ง</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/engine.png" alt="Car" className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">ความจุเครื่องยนต์</div>
                            <div className="font-medium">{selectedCar.engine_size} ลิตร</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/transmission.png" alt="Car" className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">ระบบเกียร์</div>
                            <div className="font-medium">
                              {selectedCar.transmission === 'manual' ? 'เกียร์ธรรมดา' : 
                               selectedCar.transmission === 'automatic' ? 'เกียร์ออโต้' : 
                               selectedCar.transmission === 'cvt' ? 'เกียร์ CVT' : 
                               selectedCar.transmission === 'dct' ? 'เกียร์ DCT' : selectedCar.transmission}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/gas-station.png" alt="Car" className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">ระบบเชื้อเพลิง</div>
                            <div className="font-medium">
                              {selectedCar.fuel_type || 'ไม่ระบุ'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="/public/icons/cardoor.png" alt="Car" className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">จำนวนประตู</div>
                            <div className="font-medium">{selectedCar.doors} ประตู</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm mt-2">
                      {selectedCar.insurance && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          ประกันภัยรถยนต์
                        </div>
                      )}
                      {selectedCar.roadside_assistance && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          บริการช่วยเหลือข้างทาง
                        </div>
                      )}
                      {selectedCar.free_cancellation && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          ยกเลิกฟรีภายใน 12 ชม.
                        </div>
                      )}
                      {selectedCar.unlimited_mileage && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          ไม่จำกัดระยะทาง
                        </div>
                      )}
                      {selectedCar.unlimited_route && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          ไม่จำกัดเส้นทาง
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="mt-6">
                    <ReviewSection
                      shopId="C00206"
                      ownerName={selectedCar?.owner_name || "ภูมิใจรถเช่า"}
                      location="กรุงเทพมหานคร"
                      rating={4.9}
                      bookingSuccessRate={100}
                      recommendationRate={100}
                    />
                  </div>
                </div>
                
                {/* Right: Booking Details Card */}
                <div className="md:col-span-1">
                  <BookingDetailsCard
                    carId={parseInt(carId || '0')}
                    pickupLocation={pickupLocation || "สนามบินดอนเมือง"}
                    pickupDate={pickupDate}
                    pickupTime={pickupTime}
                    returnDate={returnDate}
                    returnTime={returnTime}
                    pricePerDay={pricePerDay}
                    totalDays={totalDays}
                    deliveryFee={selectedCar?.delivery_fee || 0}
                    pickupFee={selectedCar?.pickup_fee || 0}
                    deposit={selectedCar?.deposit_amount || 0}
                    carPrice={parseFloat(selectedCar?.price || '0')}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setIsModalOpen(false)}>
          <div className="relative flex items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 rounded-full p-2 m-2 text-black"
              onClick={() => setActiveImage((activeImage - 1 + selectedCar.images.length) % selectedCar.images.length)}
              aria-label="Previous"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img 
              src={selectedCar.images[activeImage]} 
              alt={selectedCar.brand + ' ' + selectedCar.model} 
              className="max-w-[90vw] max-h-[80vh] rounded"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-car.svg';
              }}
            />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 rounded-full p-2 m-2 text-black"
              onClick={() => setActiveImage((activeImage + 1) % selectedCar.images.length)}
              aria-label="Next"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 text-black hover:bg-opacity-100"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 