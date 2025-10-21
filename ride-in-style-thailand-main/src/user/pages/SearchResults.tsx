import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Star, Users, Fuel, Cog } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Navigation } from "@/user/components/Navigation";
import { Breadcrumb } from "@/shared/components/Breadcrumb";
import { FilterSidebar } from "@/user/components/FilterSidebar";
import Icon from '@mdi/react';
import { mdiCarDoor } from '@mdi/js';


// ดึงข้อมูลรถจาก API
async function getAllCars() {
  try {
    const response = await fetch('http://localhost:3001/api/cars');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data; // API ส่งกลับ array โดยตรง
    } else if (data.success && data.cars) {
      return data.cars;
    } else {
      console.error('Failed to load cars:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error loading cars:', error);
    return [];
  }
}

const MIN_PRICE = 0;
const MAX_PRICE = 30000;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResults() {
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [carName, setCarName] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const vehicleType = query.get("vehicleType");
  const navigate = useNavigate();
  const locationObj = useLocation();

  // Extract search params
  const params = new URLSearchParams(locationObj.search);
  const pickupDate = params.get("pickupDate") || "";
  const returnDate = params.get("returnDate") || "";
  const pickupTime = params.get("pickupTime") || "10:00";
  const returnTime = params.get("returnTime") || "10:00";
  const locationParam = params.get("location") || "";

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const carsData = await getAllCars();

        setCars(carsData);
      } catch (error) {
        console.error('Error loading cars:', error);
        setError('ไม่สามารถโหลดข้อมูลรถได้');
      } finally {
        setLoading(false);
      }
    };
    
    loadCars();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  let filteredCars = cars;
  if (vehicleType && vehicleType !== "all") {
    filteredCars = filteredCars.filter(car => car.vehicleType === vehicleType);
  }
  if (carName.trim() !== "") {
    filteredCars = filteredCars.filter(car => car.name.toLowerCase().includes(carName.trim().toLowerCase()));
  }
  const filteredCarsByPrice = filteredCars.filter(car => {
    const price = Number(car.price.replace(/,/g, ''));
    return price >= priceRange[0] && price <= priceRange[1];
  });

  return (
    <>
      <Navigation />
      <div className="w-full px-4 py-4 bg-white">
        <Breadcrumb 
          items={[
            { label: "หน้าแรก", path: "/" },
            { label: "ผลการค้นหา", isActive: true }
          ]} 
        />
      </div>

      <section className="py-8 px-2 sm:px-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto flex flex-row gap-8">
          {/* Sidebar (ซ่อนบน mobile, แสดงบน lg ขึ้นไป) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} carName={carName} setCarName={setCarName} />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-end justify-between mb-4">
              <h2 className="car-name-title">รถเช่าทั้งหมดที่พร้อมให้เช่า</h2>
              <div className="text-base text-gray-700 font-medium">พบรถที่พร้อมให้เช่า {filteredCarsByPrice.length} คัน</div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลรถ...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  ลองใหม่
                </button>
              </div>
            ) : (
            <div className="space-y-4">
              {filteredCarsByPrice.map((car, idx) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  {/* Header with Save, Share, Compare buttons */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">บันทึก</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="text-sm">แชร์</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="text-sm">เปรียบเทียบ</span>
                    </button>
                  </div>

                  {/* Main content */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Left column - Car image and logo */}
                    <div className="lg:w-1/3 p-4 relative">
                      <div className="relative">
                        <img 
                          src={car.images && car.images.length > 0 ? car.images[0] : '/images/placeholder-car.svg'} 
                          alt={`${car.brand} ${car.model}`} 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-car.svg';
                          }}
                        />
                        {/* Rental company logo */}
                        <div className="absolute bottom-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                          RIDE IN STYLE
                        </div>
                      </div>
                    </div>

                    {/* Right column - Car details and pricing */}
                    <div className="lg:w-2/3 p-4">
                      {/* Car model and type */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="car-name-title text-gray-900">{car.brand} {car.model}</h3>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>

                      </div>

                                              {/* Car specifications */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                          <img src="/public/icons/car-seat.png" alt="Car" className="w-5 h-5" />
                            <span className="tw-subtitle">{car.seats || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                          <img src="/public/icons/sportive-car (1).png" alt="Car" className="w-7 h-7" />
                            <span className="tw-subtitle">{car.car_type || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                          <img src="/public/icons/cardoor.png" alt="Car" className="w-4 h-4" />
                            <span className="tw-subtitle">{car.doors || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                          <img src="/public/icons/transmission.png" alt="Car" className="w-5 h-5" />
                            <span className="tw-subtitle">{car.transmission || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                          
                        <img src="/public/icons/gas-station.png" alt="Car" className="w-4 h-4" />
                      
                            <span className="tw-subtitle">{car.fuel_type || 'N/A'}</span>
                          </div>
                        </div>



                      {/* Features list - ดึงข้อมูลจาก database */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        {car.insurance && (
                          <div className="tw-subtitle-green flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>ประกันรถยนต์</span>
                          </div>
                        )}
                        {car.roadside_assistance && (
                          <div className="tw-subtitle-green flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>ช่วยเหลือตลอด 24 ชม.</span>
                          </div>
                        )}
                        {car.free_cancellation && (
                          <div className="tw-subtitle-green flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>ยกเลิกฟรีภายใน 12 ชม.</span>
                          </div>
                        )}
                        {car.unlimited_mileage && (
                          <div className="tw-subtitle-green flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>ไม่จำกัดระยะทาง</span>
                          </div>
                        )}
                        {car.unlimited_route && (
                          <div className="tw-subtitle-green flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>ไม่จำกัดเส้นทาง</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing section */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-600">RIDE IN STYLE</div>
                            <div className="font-bold text-gray-900 font-sans font-medium font-size-26">฿{car.price}</div>
                            <div className="text-xs text-gray-500">ทั้งหมด</div>
                          </div>
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
                            onClick={() => {
                              navigate(`/booking/${car.id}?pickupDate=${pickupDate}&returnDate=${returnDate}&pickupTime=${pickupTime}&returnTime=${returnTime}&location=${locationParam}`);
                            }}
                          >
                            ดูข้อเสนอ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 