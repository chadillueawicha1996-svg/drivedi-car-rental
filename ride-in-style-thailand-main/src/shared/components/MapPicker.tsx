import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { X, MapPin, Navigation, Search } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

interface LocationInfo {
  lat: number;
  lng: number;
  address?: string;
}

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
  onLocationClear?: () => void;
  initialLatitude?: number;
  initialLongitude?: number;
  googleMapsApiKey?: string;
}

export function MapPicker({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  onLocationClear,
  initialLatitude = 13.7563, 
  initialLongitude = 100.5018,
  googleMapsApiKey = "AIzaSyBFpT1QjZqUit1e8V91_GDHd5u4X0WX_No"
}: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const [savedLocation, setSavedLocation] = useState<LocationInfo | null>(null);
  const [wasLocationCleared, setWasLocationCleared] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // ฟังก์ชันสำหรับแปลงพิกัดเป็นที่อยู่
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    if (!window.google) return '';
    
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve('');
        }
      });
    });
  };

  // ฟังก์ชันสำหรับค้นหาตำแหน่ง
  const searchLocation = async (query: string) => {
    if (!query.trim() || !window.google) return;
    
    setIsSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: query }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          // ย้ายแผนที่ไปยังตำแหน่งที่ค้นหา
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(15);
          }
          
          // ตั้งค่า marker ที่ตำแหน่งที่ค้นหา
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
            markerRef.current.setMap(mapInstanceRef.current);
            setSelectedLocation({ lat, lng, address: results[0].formatted_address });
            setIsMarkerVisible(true);
          }
          
          toast({
            title: "ค้นหาสำเร็จ",
            description: results[0].formatted_address,
          });
        } else {
          toast({
            title: "ไม่พบตำแหน่ง",
            description: "ไม่พบตำแหน่งที่ค้นหา กรุณาลองใหม่อีกครั้ง",
            variant: "destructive",
          });
        }
        setIsSearching(false);
      });
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถค้นหาตำแหน่งได้",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };

  // ฟังก์ชันสำหรับดึงตำแหน่งปัจจุบัน
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "ไม่รองรับ GPS",
        description: "เบราว์เซอร์ของคุณไม่รองรับการใช้งาน GPS",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // ย้ายแผนที่ไปยังตำแหน่งปัจจุบัน
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
          mapInstanceRef.current.setZoom(15);
        }
        
        // เพิ่มหรืออัปเดต marker ตำแหน่งปัจจุบัน
        updateCurrentLocationMarker(latitude, longitude);
        
        // แปลงพิกัดเป็นที่อยู่
        getAddressFromCoordinates(latitude, longitude).then(address => {
          setCurrentLocation({ lat: latitude, lng: longitude, address });
        }).catch(() => {
          setCurrentLocation({ lat: latitude, lng: longitude });
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = "ไม่สามารถดึงตำแหน่งได้";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "ไม่สามารถดึงตำแหน่งได้ในขณะนี้";
            break;
          case error.TIMEOUT:
            errorMessage = "หมดเวลาการดึงตำแหน่ง";
            break;
        }
        
        toast({
          title: "ข้อผิดพลาด",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };



  // ฟังก์ชันสำหรับอัปเดต marker ตำแหน่งปัจจุบัน
  const updateCurrentLocationMarker = (latitude: number, longitude: number) => {
    if (!mapInstanceRef.current || !window.google) return;

    // ลบ marker เดิม (ถ้ามี)
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    // สร้าง marker ใหม่สำหรับตำแหน่งปัจจุบัน
    currentLocationMarkerRef.current = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: mapInstanceRef.current,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 1000
    });
  };

  // ฟังก์ชันสำหรับเลือกตำแหน่ง
  const handleLocationSelect = () => {
    if (selectedLocation && isMarkerVisible) {
      // บันทึกตำแหน่งที่เลือก
      setSavedLocation(selectedLocation);
      setWasLocationCleared(false);
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
      onClose();
    } else {
      toast({
        title: "กรุณาเลือกตำแหน่ง",
        description: "กรุณาคลิกบนแผนที่เพื่อเลือกตำแหน่ง",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชันสำหรับล้างตำแหน่งที่เลือก
  const handleClearLocation = () => {
    setSavedLocation(null);
    setSelectedLocation(null);
    setIsMarkerVisible(false);
    setWasLocationCleared(true);
    
    // ลบ marker จากแผนที่
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    // เรียกใช้ฟังก์ชันล้างตำแหน่งจาก parent component
    if (onLocationClear) {
      onLocationClear();
    }
    
    toast({
      title: "ล้างตำแหน่งแล้ว",
      description: "ตำแหน่งที่เลือกได้ถูกล้างแล้ว",
    });
  };

  // โหลด Google Maps API
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isOpen && mapRef.current) {
          createMap();
        }
      };
      document.head.appendChild(script);
    } else if (window.google && isOpen && mapRef.current) {
      createMap();
    }

    // เพิ่ม CSS สำหรับปุ่มในแผนที่
    if (!document.querySelector('#map-controls-styles')) {
      const style = document.createElement('style');
      style.id = 'map-controls-styles';
      style.textContent = `
        .custom-map-control button:hover {
          background-color: #f8f9fa !important;
        }
        .custom-map-control button:active {
          background-color: #e9ecef !important;
        }
        .custom-map-control button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `;
      document.head.appendChild(style);
    }

    // ป้องกัน scroll เมื่อเปิดแผนที่
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup เมื่อปิดแผนที่
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, googleMapsApiKey]);

  // สร้างแผนที่ Google Maps
  const createMap = () => {
    if (!mapRef.current || !window.google) return;

    // ใช้ตำแหน่งที่บันทึกไว้ หรือตำแหน่งเริ่มต้น (แต่ไม่ใช้ถ้ามีการล้างตำแหน่ง)
    const centerLat = (savedLocation && !wasLocationCleared) ? savedLocation.lat : initialLatitude;
    const centerLng = (savedLocation && !wasLocationCleared) ? savedLocation.lng : initialLongitude;
    
    // สร้างแผนที่
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 13,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,      // ปิดปุ่ม Street View
      fullscreenControl: false,      // ปิดปุ่ม Fullscreen
      zoomControl: false,            // ปิดปุ่ม Zoom (+/-)
      mapTypeControl: false,         // ปิดปุ่มเปลี่ยนประเภทแผนที่
      scaleControl: false,           // ปิดมาตราส่วน
      scrollwheel: true,              // เปิดใช้งาน scroll wheel
    });
    mapInstanceRef.current = map;

    // สร้างปุ่มตำแหน่งปัจจุบัน
    const currentLocationButton = document.createElement('div');
    currentLocationButton.className = 'custom-map-control';
    currentLocationButton.style.margin = '10px';
    currentLocationButton.innerHTML = `
      <button 
        id="current-location-btn"
        style="
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          height: 40px;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        "
        title="ตำแหน่งปัจจุบัน"
      >
        <img src="/icons/gps.png" alt="ตำแหน่งปัจจุบัน" style="width: 20px; height: 20px;" />
      </button>
    `;

    // เพิ่มปุ่มลงในแผนที่
    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(currentLocationButton);

    // เพิ่ม event listener สำหรับปุ่ม
    currentLocationButton.addEventListener('click', getCurrentLocation);

    // เพิ่ม marker สำหรับตำแหน่งที่เลือก
    const marker = new window.google.maps.Marker({
      position: { lat: initialLatitude, lng: initialLongitude },
      map: null, // เริ่มต้นไม่แสดง
      draggable: true,
    });
    markerRef.current = marker;

    // ถ้ามีตำแหน่งที่บันทึกไว้ ให้แสดง marker ทันที (แต่ไม่แสดงถ้ามีการล้างตำแหน่ง)
    if (savedLocation && !wasLocationCleared) {
      marker.setPosition({ lat: savedLocation.lat, lng: savedLocation.lng });
      marker.setMap(map);
      setIsMarkerVisible(true);
      setSelectedLocation(savedLocation);
    } else if (initialLatitude !== 13.7563 || initialLongitude !== 100.5018) {
      // ถ้ามีตำแหน่งเริ่มต้นที่กำหนดมา ให้แสดง marker ทันที
      marker.setMap(map);
      setIsMarkerVisible(true);
      // แปลงพิกัดเป็นที่อยู่
      getAddressFromCoordinates(initialLatitude, initialLongitude).then(address => {
        setSelectedLocation({ lat: initialLatitude, lng: initialLongitude, address });
      }).catch(() => {
        setSelectedLocation({ lat: initialLatitude, lng: initialLongitude });
      });
    }

    // อัปเดตตำแหน่งที่เลือกเมื่อลาก marker
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        // แปลงพิกัดเป็นที่อยู่
        getAddressFromCoordinates(lat, lng).then(address => {
          setSelectedLocation({ lat, lng, address });
        }).catch(() => {
          setSelectedLocation({ lat, lng });
        });
        setIsMarkerVisible(true);
      }
    });

    // อัปเดตตำแหน่งที่เลือกเมื่อคลิกบนแผนที่
    map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      marker.setMap(map); // แสดง marker เมื่อคลิก
      // แปลงพิกัดเป็นที่อยู่
      getAddressFromCoordinates(lat, lng).then(address => {
        setSelectedLocation({ lat, lng, address });
      }).catch(() => {
        setSelectedLocation({ lat, lng });
      });
      setIsMarkerVisible(true);
    });

    // ตั้งค่าตำแหน่งเริ่มต้น
    getAddressFromCoordinates(initialLatitude, initialLongitude).then(address => {
      setSelectedLocation({ lat: initialLatitude, lng: initialLongitude, address });
    }).catch(() => {
      setSelectedLocation({ lat: initialLatitude, lng: initialLongitude });
    });

    // ดึงตำแหน่งปัจจุบันทันทีเมื่อเปิดแผนที่เสมอ (แต่ไม่ย้ายแผนที่ถ้ามีตำแหน่งที่บันทึกไว้)
    getCurrentLocationOnMapOpen();
  };

  // ฟังก์ชันสำหรับดึงตำแหน่งปัจจุบันเมื่อเปิดแผนที่
  const getCurrentLocationOnMapOpen = () => {
    if (!navigator.geolocation) {
      toast({
        title: "ไม่รองรับ GPS",
        description: "เบราว์เซอร์ของคุณไม่รองรับการใช้งาน GPS",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // ย้ายแผนที่ไปยังตำแหน่งปัจจุบันเฉพาะเมื่อไม่มีตำแหน่งที่บันทึกไว้
        if (mapInstanceRef.current && !savedLocation) {
          mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
          mapInstanceRef.current.setZoom(15);
        }
        
        // เพิ่มหรืออัปเดต marker ตำแหน่งปัจจุบัน
        updateCurrentLocationMarker(latitude, longitude);
        
        // แปลงพิกัดเป็นที่อยู่
        getAddressFromCoordinates(latitude, longitude).then(address => {
          setCurrentLocation({ lat: latitude, lng: longitude, address });
        }).catch(() => {
          setCurrentLocation({ lat: latitude, lng: longitude });
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = "ไม่สามารถดึงตำแหน่งได้";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "ไม่สามารถดึงตำแหน่งได้ในขณะนี้";
            break;
          case error.TIMEOUT:
            errorMessage = "หมดเวลาการดึงตำแหน่ง";
            break;
        }
        
        toast({
          title: "ข้อผิดพลาด",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Cleanup เมื่อปิดแผนที่
  useEffect(() => {
    if (!isOpen) {
      // Cleanup Google Maps
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      
      // รีเซ็ตข้อมูลเมื่อปิดแผนที่
      setSelectedLocation(null);
      setIsMarkerVisible(false);
      setSearchQuery("");
      
      // ถ้ามีการล้างตำแหน่ง ให้รีเซ็ต savedLocation ด้วย
      if (wasLocationCleared) {
        setSavedLocation(null);
        setWasLocationCleared(false);
      }
    }
  }, [isOpen, wasLocationCleared]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>เลือกตำแหน่งร้าน</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* ช่องค้นหาและปุ่มเลือกตำแหน่ง */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder="ค้นหาตำแหน่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchLocation(searchQuery);
                }
              }}
              className="flex-1 h-9"
            />
            <Button
              onClick={() => searchLocation(searchQuery)}
              disabled={isSearching || !searchQuery.trim()}
              variant="outline"
              size="sm"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  ค้นหา
                </>
              )}
            </Button>
            <Button
              onClick={handleLocationSelect}
              disabled={!selectedLocation || !isMarkerVisible}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              เลือกตำแหน่งนี้
            </Button>

          </div>

          {/* แสดงข้อมูลตำแหน่งที่เลือก */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-700">ตำแหน่งที่เลือก:</h4>
                {selectedLocation && isMarkerVisible ? (
                  <p className="text-sm text-gray-600">
                    {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">โปรดเลือกตำแหน่งบนแผนที่</p>
                )}
              </div>
              {isMarkerVisible && (
                <Button
                  onClick={handleClearLocation}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50 ml-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  ล้าง
                </Button>
              )}
            </div>
          </div>

          {/* แผนที่ */}
          <div 
            ref={mapRef} 
            className="flex-1 w-full rounded-lg border"
            style={{ minHeight: '400px' }}
          />

        </CardContent>
      </Card>
    </div>
  );
}

// เพิ่ม type declaration สำหรับ Leaflet
declare global {
  interface Window {
    L: any;
  }
} 