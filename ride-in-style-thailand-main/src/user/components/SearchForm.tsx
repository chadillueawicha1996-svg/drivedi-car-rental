import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { MapPin, Calendar, Clock, Search, Car } from "lucide-react";
import { CustomCalendar } from "@/shared/components/CustomCalendar";
// ไอคอนลูกศรในวงกลม
const ArrowCircle = () => (
  <span className="inline-flex items-center justify-center mx-2" style={{ width: 32, height: 32 }}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="#FFC107" strokeWidth="1" />
      <path d="M12 16h8m0 0-3-3m3 3-3 3" stroke="#1976D2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

// เพิ่ม SVG Expand down arrow-01
const ExpandDownArrow = ({ open }) => (
  <svg
    className={`ml-2 transition-transform duration-200 inline-block`}
    style={{ transform: open ? 'rotate(180deg)' : 'none', transformOrigin: '50% 50%' }}
    width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SearchForm = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState("");


  const today = new Date();
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const locationBoxRef = useRef(null);
  
  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationBoxRef.current && !locationBoxRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !selectedRange?.from || !selectedRange?.to || !vehicleType) {
      return;
    }
    
    // ตรวจสอบว่าวันเริ่มและวันสิ้นสุดเป็นวันเดียวกันหรือไม่
    const isSameDay = selectedRange?.from && selectedRange?.to && 
      selectedRange.from.toDateString() === selectedRange.to.toDateString();
    
    // ถ้าเป็นวันเดียวกัน ให้เพิ่ม 1 วันให้วันสิ้นสุด
    const returnDate = isSameDay && selectedRange?.to 
      ? new Date(selectedRange.to.getTime() + 24 * 60 * 60 * 1000) // เพิ่ม 1 วัน
      : selectedRange?.to;
    
    // แปลงวันที่เป็นรูปแบบ YYYY-MM-DD โดยไม่ใช้ toISOString() เพื่อหลีกเลี่ยงปัญหา timezone
    const formatDateForURL = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const result = `${year}-${month}-${day}`;
      return result;
    };
    
    const formattedPickupDate = selectedRange?.from ? formatDateForURL(selectedRange.from) : "";
    const formattedReturnDate = returnDate ? formatDateForURL(returnDate) : "";
    
    const params = new URLSearchParams({
      location,
      pickupDate: formattedPickupDate,
      returnDate: formattedReturnDate,
      vehicleType,
      pickupTime,
      returnTime,
    });
    navigate(`/search-results?${params.toString()}`);
  };

  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const vehicleBoxRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (vehicleBoxRef.current && !vehicleBoxRef.current.contains(event.target)) {
        setShowVehicleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ปิดปฏิทินเมื่อเลือกวันเริ่มและวันสิ้นสุดแล้ว
  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to) {
      setShowCalendar(false);
    }
  }, [selectedRange]);

  const handleRangeSelect = (range: { from: Date; to: Date } | null) => {
    // รีเซ็ทวันที่เมื่อมีการเลือกวันใหม่
    if (selectedRange && range) {
      // ถ้ามีวันที่เลือกอยู่แล้ว และมีการเลือกใหม่ ให้รีเซ็ทก่อน
      setSelectedRange(null);
      // รอสักครู่แล้วค่อยตั้งค่าวันที่ใหม่
      setTimeout(() => {
        setSelectedRange(range);
      }, 0);
    } else {
      setSelectedRange(range);
    }
  };

  const handleTimeChange = (newPickupTime: string, newReturnTime: string) => {
    setPickupTime(newPickupTime);
    setReturnTime(newReturnTime);
  };

  return (
    <section className="px-4 -mt-10 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="title-font">ค้นหารถเช่าที่ใช่สำหรับคุณ</h2>
          <p className="small-title-font">เลือกสถานที่ วันที่ และประเภทรถที่ต้องการ</p>
        </div>
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div
                  className="bg-gray-200 rounded-[8px] px-3 py-2 cursor-pointer relative h-14 sm:h-12 flex flex-col justify-center"
                  tabIndex={0}
                  ref={locationBoxRef}
                  onClick={() => {
                    setShowVehicleDropdown(false);
                    setShowCalendar(false);
                    setShowLocationDropdown((v) => !v);
                  }}
                >
                  <div className="flex items-center mb-0.5">
                    <MapPin className="h-3 w-3 text-blue-400 mr-1" />
                    <span className="tw-subtitle-gray-10">จุดรับ-คืนรถ</span>
                  </div>
                  <div className={`${location ? 'tw-subtitle' : 'tw-subtitle-gray-14'}`}
                    style={{lineHeight:'1.2'}}>
                    {location
                      ? {
                          bangkok: 'กรุงเทพมหานคร',
                          chiangmai: 'เชียงใหม่',
                          phuket: 'ภูเก็ต',
                          pattaya: 'พัทยา',
                        }[location] || location
                      : 'โปรดเลือกจุดรับ-คืนรถ'}
                  </div>
                  {showLocationDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-40 transition-all duration-200 ease-out origin-top transform scale-y-100 animate-slide-down">
                      {[
                        { value: 'bangkok', label: 'กรุงเทพมหานคร' },
                        { value: 'chiangmai', label: 'เชียงใหม่' },
                        { value: 'phuket', label: 'ภูเก็ต' },
                        { value: 'pattaya', label: 'พัทยา' },
                      ].map(opt => (
                        <div
                          key={opt.value}
                          className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${location === opt.value ? 'text-blue-600' : 'tw-subtitle'}`}
                          onClick={e => {
                            e.stopPropagation();
                            setLocation(opt.value);
                            setShowLocationDropdown(false);
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* วัน-เวลารับรถ/คืนรถ (range) */}
                <div className="lg:col-span-2 bg-gray-200 rounded-[8px] border-none">
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full rounded-[8px] border-none px-3 py-2 flex items-center gap-4 bg-gray-200 justify-center h-14 sm:h-12 shadow-none"
                      onClick={() => setShowCalendar((v) => !v)}
                    >
                      <div className="flex items-center gap-2 w-full justify-center">
                        {/* ส่วนที่ 1: วันรับรถ */}
                        <div className="flex flex-col items-start text-left flex-1">
                          <span className="tw-subtitle-gray-10 mb-0.5 flex items-center">
                            <Calendar className="h-3 w-3 text-blue-400 mr-1" />วัน-เวลารับรถ
                          </span>
                          <span className={`${!selectedRange?.from ? 'tw-subtitle-gray-14' : 'tw-subtitle'}` }>
                            {!selectedRange?.from
                              ? <span>วัน/เดือน/ปี</span>
                              : `${selectedRange?.from?.toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' })} ${pickupTime}`
                            }
                          </span>
                        </div>
                        
                        {/* ส่วนที่ 2: วงกลมลูกศร */}
                        <div className="flex items-center justify-center">
                          <ArrowCircle />
                        </div>
                        
                        {/* ส่วนที่ 3: วันคืนรถ */}
                        <div className="flex flex-col items-start text-left flex-1">
                          <span className="tw-subtitle-gray-10 mb-0.5 flex items-center">
                            <Calendar className="h-3 w-3 text-blue-400 mr-1" />วัน-เวลาคืนรถ
                          </span>
                          <span className={`${!selectedRange?.to ? 'tw-subtitle-gray-14' : 'tw-subtitle'}` }>
                            {!selectedRange?.to
                              ? <span>วัน/เดือน/ปี</span>
                              : (() => {
                                  const isSameDay = selectedRange?.from && selectedRange?.to && 
                                    selectedRange.from.toDateString() === selectedRange.to.toDateString();
                                  const dateStr = selectedRange?.to?.toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' });
                                  return isSameDay 
                                    ? `${dateStr} ${returnTime} (1 วัน)`
                                    : `${dateStr} ${returnTime}`;
                                })()
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                    {showCalendar && (
                      <div className="absolute z-30 mt-2 left-0 right-0">
                        <CustomCalendar
                          selectedRange={selectedRange}
                          onRangeSelect={handleRangeSelect}
                          onClose={() => setShowCalendar(false)}
                          minDate={today}
                          allowSingleDay={true}
                          showTodayButton={true}
                          showTimeSelection={true}
                          onTimeChange={handleTimeChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* ประเภทรถ */}
                <div
                  className="bg-gray-200 rounded-[8px] px-3 py-2 cursor-pointer relative h-14 sm:h-12 flex flex-col justify-center"
                  tabIndex={0}
                  ref={vehicleBoxRef}
                  onClick={() => {
                    setShowLocationDropdown(false);
                    setShowCalendar(false);
                    setShowVehicleDropdown((v) => !v);
                  }}
                >
                  <div className="flex items-center mb-0.5">
                    <Car className="h-3.5 w-3.5 text-blue-400 mr-1" />
                    <span className="tw-subtitle-gray-10">ประเภทรถ</span>
                  </div>
                  <div className={`${vehicleType ? 'tw-subtitle' : 'tw-subtitle-gray-14'}`}
                    style={{lineHeight:'1.2'}}>
                    {vehicleType
                      ? {
                          all: 'ทุกประเภท',
                          sedan: 'รถเก๋ง',
                          suv: 'SUV',
                          pickup: 'กระบะ',
                          van: 'รถตู้',
                          motorcycle: 'มอเตอร์ไซค์',
                        }[vehicleType] || vehicleType
                      : 'โปรดเลือกประเภทรถ'}
                  </div>
                  {showVehicleDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg z-40 transition-all duration-200 ease-out origin-top transform scale-y-100 animate-slide-down">
                      {[
                        { value: 'all', label: 'ทุกประเภท' },
                        { value: 'sedan', label: 'รถเก๋ง' },
                        { value: 'suv', label: 'SUV' },
                        { value: 'pickup', label: 'กระบะ' },
                        { value: 'van', label: 'รถตู้' },
                        { value: 'motorcycle', label: 'มอเตอร์ไซค์' },
                      ].map(opt => (
                        <div
                          key={opt.value}
                          className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${vehicleType === opt.value ? 'text-blue-600' : 'tw-subtitle'}`}
                          onClick={e => {
                            e.stopPropagation();
                            setVehicleType(opt.value);
                            setShowVehicleDropdown(false);
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-end h-14 sm:h-12">
                  <Button
                    type="submit"
                    className="w-full h-14 sm:h-12 px-3 py-2 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] font-semibold flex items-center justify-center"
                    disabled={!location || !selectedRange?.from || !selectedRange?.to || !vehicleType}
                  >
                    ค้นหารถเช่า
                  </Button>
                </div>
              </div>
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
