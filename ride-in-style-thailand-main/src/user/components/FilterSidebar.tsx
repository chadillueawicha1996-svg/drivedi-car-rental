import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const MIN_PRICE = 0;
const MAX_PRICE = 30000;

type FilterSidebarProps = {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  carName: string;
  setCarName: (name: string) => void;
};

export const FilterSidebar = ({ priceRange, setPriceRange, carName, setCarName }: FilterSidebarProps) => {
  const handleReset = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setCarName("");
  };

  return (
    <aside className="w-full max-w-xs bg-white rounded-2xl shadow p-4 sticky top-24 hidden lg:block">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-lg">กรองตาม</span>
        <button
          className="text-blue-600 text-sm font-semibold hover:underline"
          onClick={handleReset}
          type="button"
        >
          รีเซ็ตทั้งหมด
        </button>
      </div>
      {/* ค้นหาชื่อรถ */}
      <div className="mb-6">
        <label htmlFor="car-name-search" className="block text-sm font-semibold mb-1">ค้นหาชื่อรถ</label>
        <input
          id="car-name-search"
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="เช่น Toyota, Honda..."
          value={carName}
          onChange={e => setCarName(e.target.value)}
        />
      </div>
      {/* ราคา */}
      <div className="mb-6">
        <div className="flex items-center justify-between cursor-pointer select-none">
          <span className="font-semibold">ราคาต่อวัน</span>
          <span className="text-xs">฿ {priceRange[0].toLocaleString()} - ฿ {priceRange[1].toLocaleString()}</span>
        </div>
        <div className="mt-4 px-1">
          <Slider
            range
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={priceRange}
            onChange={(vals: number[] | number) => Array.isArray(vals) && setPriceRange([vals[0], vals[1]])}
            allowCross={false}
            trackStyle={[{ backgroundColor: '#2563eb', height: 6 }]}
            handleStyle={[
              { borderColor: '#2563eb', backgroundColor: '#2563eb', opacity: 1, boxShadow: 'none', height: 16, width: 16, marginTop: -5 },
              { borderColor: '#2563eb', backgroundColor: '#2563eb', opacity: 1, boxShadow: 'none', height: 16, width: 16, marginTop: -5 }
            ]}
            railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
            dotStyle={{ display: 'none' }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>฿ {MIN_PRICE.toLocaleString()}</span>
            <span>฿ {MAX_PRICE.toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* Diamond benefits */}
      <details open className="mb-4">
        <summary className="font-semibold flex items-center gap-2 cursor-pointer select-none">
          <span className="inline-block w-5 h-5 text-yellow-700">{/* ไอคอน diamond */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 7.62l5.34-.78L10 2z"/></svg>
          </span>
          Diamond benefits
          <span className="text-gray-400 text-xs ml-1">?</span>
        </summary>
        <div className="mt-2 space-y-2 pl-1">
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Diamond Discount
            </span>
            <span>฿ 600</span>
          </label>
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> One-Dollar Freeze
            </span>
            <span>฿ 600</span>
          </label>
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Price Drop Protector
            </span>
            <span>฿ 600</span>
          </label>
        </div>
      </details>
      {/* Insurance included */}
      <details className="mb-4">
        <summary className="font-semibold flex items-center gap-2 cursor-pointer select-none">
          Insurance included <span className="text-gray-400 text-xs ml-1">?</span>
        </summary>
        <div className="mt-2 space-y-2 pl-1">
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Collision Damage Waiver
            </span>
            <span>฿ 600</span>
          </label>
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Theft Protection
            </span>
            <span>฿ 600</span>
          </label>
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Third Party Liability Protection
            </span>
            <span>฿ 600</span>
          </label>
          <label className="flex items-center justify-between text-sm cursor-pointer">
            <span>
              <input type="checkbox" className="mr-2 accent-blue-600" /> Full coverage
            </span>
            <span>฿ 800</span>
          </label>
        </div>
      </details>
      {/* Accordion อื่นๆ */}
      <details className="mb-2">
        <summary className="font-semibold cursor-pointer select-none">ข้อมูลรถรับส่ง</summary>
      </details>
      <details className="mb-2">
        <summary className="font-semibold cursor-pointer select-none">Policies</summary>
      </details>
      <details className="mb-2">
        <summary className="font-semibold cursor-pointer select-none">ความจุ</summary>
      </details>
      <details className="mb-2">
        <summary className="font-semibold cursor-pointer select-none">ตัวเลือกรถยนต์</summary>
      </details>
      <details>
        <summary className="font-semibold cursor-pointer select-none">Eco-friendly options</summary>
      </details>
    </aside>
  );
}; 