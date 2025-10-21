import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const specialLocations = [
  {
    id: 1,
    name: "นครศรีธรรมราช",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/นครศรีธรรมราช.webp",
    localPrice: 599,
    bigPrice: 689,
  },
  {
    id: 2,
    name: "อุบลราชธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุบลราชธานี.webp",
    localPrice: 799,
    bigPrice: 619,
  },
  {
    id: 3,
    name: "อุดรธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุดรธานี.webp",
    localPrice: 699,
    bigPrice: 619,
  },
  {
    id: 4,
    name: "ภูเก็ต",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/ภูเก็ต.webp",
    localPrice: 450,
    bigPrice: 709,
  },
  {
    id: 1,
    name: "นครศรีธรรมราช",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/นครศรีธรรมราช.webp",
    localPrice: 599,
    bigPrice: 689,
  },
  {
    id: 2,
    name: "อุบลราชธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุบลราชธานี.webp",
    localPrice: 799,
    bigPrice: 619,
  },
  {
    id: 3,
    name: "อุดรธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุดรธานี.webp",
    localPrice: 699,
    bigPrice: 619,
  },
  {
    id: 4,
    name: "ภูเก็ต",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/ภูเก็ต.webp",
    localPrice: 450,
    bigPrice: 709,
  },
  {
    id: 1,
    name: "นครศรีธรรมราช",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/นครศรีธรรมราช.webp",
    localPrice: 599,
    bigPrice: 689,
  },
  {
    id: 2,
    name: "อุบลราชธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุบลราชธานี.webp",
    localPrice: 799,
    bigPrice: 619,
  },
  {
    id: 3,
    name: "อุดรธานี",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/อุดรธานี.webp",
    localPrice: 699,
    bigPrice: 619,
  },
  {
    id: 4,
    name: "ภูเก็ต",
    company: "บริษัทรถเช่าที่ให้บริการ",
    image: "/images/featuredcars/ภูเก็ต.webp",
    localPrice: 450,
    bigPrice: 709,
  },
];

export const FeaturedCars = () => {
  // กำหนดจำนวนการ์ดต่อหน้าแบบ responsive
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(specialLocations.length / cardsPerPage);

  // อัปเดตตามขนาดหน้าจอ
  React.useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerPage(1);
      } else if (width < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(4);
      }
    };
    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // ใช้ callback ที่ปลอดภัยและอ่านง่าย
  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // เพิ่ม handler สำหรับปุ่มเช่ารถยนต์และมอเตอร์ไซค์
  const handleCarClick = (loc) => {
    // ตัวอย่าง: ไปหน้าอื่น หรือ console.log
    console.log('เช่ารถยนต์', loc);
    // เช่น navigate(`/car/${loc.id}`)
  };
  const handleMotorcycleClick = (loc) => {
    console.log('เช่ารถมอเตอร์ไซค์', loc);
    // เช่น navigate(`/motorcycle/${loc.id}`)
  };

  // Drag/Swipe support (mobile + desktop)
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffsetPercent, setDragOffsetPercent] = useState(0);

  useEffect(() => {
    // reset offset when page changes externally
    setDragOffsetPercent(0);
  }, [page]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 1;
    const dx = e.clientX - dragStartX;
    const percent = (dx / width) * 100;
    setDragOffsetPercent(percent);
  };

  const endDrag = (e?: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    const threshold = 12; // percent of width to trigger page change
    if (dragOffsetPercent <= -threshold) {
      // swipe left → next
      setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
    } else if (dragOffsetPercent >= threshold) {
      // swipe right → prev
      setPage((prev) => (prev > 0 ? prev - 1 : prev));
    }
    setDragOffsetPercent(0);
  };

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="title-font-black">รถเช่าราคาพิเศษ</h2>
        <p className="text-lg text-gray-600 mb-8">รวมการค้นหารถเช่าจากทั่วประเทศ</p>
        <div className="relative min-h-[360px]">
          {totalPages > 1 && (
            <>
              {page > 0 && (
                <button
                  aria-label="Prev"
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 items-center justify-center active:scale-95 hover:scale-105 transition-all border border-gray-200"
                  style={{ transform: "translateY(-130%) translateX(-25%)" }}
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
              {page < totalPages - 1 && (
                <button
                  aria-label="Next"
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 items-center justify-center active:scale-95 hover:scale-105 transition-all border border-gray-200"
                  style={{ transform: "translateY(-130%) translateX(25%)" }}
                  onClick={handleNext}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </>
          )}
          <div className="overflow-hidden relative min-h-[360px] w-full" ref={containerRef}>
            <div
              ref={trackRef}
              className={`flex w-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} `}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={(e) => isDragging && endDrag(e)}
              style={{
                transform: `translateX(calc(-${page * 100}% + ${dragOffsetPercent}%))`,
                transition: isDragging ? 'none' : 'transform 500ms ease-in-out',
                touchAction: 'pan-y',
              }}
            >
              {specialLocations.map((loc, idx) => (
                <div
                  key={loc.id + loc.name + loc.image + idx}
                  className="flex-shrink-0 px-2 sm:px-3 box-border"
                  style={{ minWidth: 0, flexBasis: `${100 / cardsPerPage}%`, maxWidth: `${100 / cardsPerPage}%` }}
                >
                  <div className="bg-white rounded-xl shadow flex flex-col p-0 overflow-hidden h-full">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-40 object-cover object-center rounded-t-xl"
                      style={{ display: 'block' }}
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg sm:text-xl font-light">{loc.name}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{loc.company}</p>
                      <div className="flex w-full gap-x-3 sm:gap-x-4 mt-2 mb-2">
                        {/* ฝั่งซ้าย: รถเช่าท้องถิ่น */}
                        <button
                          type="button"
                          className="flex flex-col items-start flex-1 bg-transparent p-0 border-0 text-left cursor-pointer focus:outline-none group"
                          onClick={() => handleCarClick(loc)}
                        >
                          <span className="bg-orange-400 text-white px-2 py-1 rounded text-[10px] sm:text-xs mb-1 group-hover:bg-orange-500 transition">เช่ารถยนต์</span>
                          <div>
                            <div className="text-gray-500 text-[11px] sm:text-xs">ราคาขั้นต่ำ</div>
                            <div className="font-bold text-base sm:text-lg">{loc.localPrice} บาท/วัน</div>
                          </div>
                        </button>
                        {/* ฝั่งขวา: รถเช่ารายใหญ่ */}
                        <button
                          type="button"
                          className="flex flex-col items-start flex-1 border-l border-gray-300 px-3 sm:px-4 bg-transparent p-0 border-0 text-left cursor-pointer focus:outline-none group"
                          onClick={() => handleMotorcycleClick(loc)}
                        >
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] sm:text-xs mb-1 group-hover:bg-blue-600 transition">เช่ารถมอเตอร์ไซค์</span>
                          <div>
                            <div className="text-gray-500 text-[11px] sm:text-xs">ราคาขั้นต่ำ</div>
                            <div className="font-bold text-base sm:text-lg">{loc.bigPrice} บาท/วัน</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dot indicator */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === page ? 'bg-blue-500' : 'bg-gray-300'} transition-all`}
                  aria-label={`Go to page ${idx + 1}`}
                  onClick={() => setPage(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
