import React, { useState } from 'react';

interface ReviewSectionProps {
  shopId: string;
  ownerName: string; // ชื่อของคนผู้ปล่อยเช่าจากฐานข้อมูล
  location: string;
  rating: number;
  bookingSuccessRate: number;
  recommendationRate: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  shopId,
  ownerName,
  location,
  rating,
  bookingSuccessRate,
  recommendationRate
}) => {
  const [activeTab, setActiveTab] = useState<'car' | 'shop'>('car');

  return (
   
    <div>
      {/* Title */}
      <h2 className="text-xl font-medium text-[rgb(25,26,32)] leading-7 mb-6">รีวิวร้านเช่า</h2>
      
      {/* Shop Information - Outside the main review frame */}
      <div className="flex items-center mb-6">
        {/* Shop Icon */}
        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mr-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded"></div>
        </div>
        
        {/* Shop Details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4z" clipRule="evenodd" />
              </svg>
              LOCAL
            </span>
            <span className="text-gray-700 font-medium">{ownerName}</span>
          </div>
          <p className="text-gray-600">{location}</p>
        </div>
      </div>

      {/* Main Review Frame - Only contains the title and metrics */}
      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Review Metrics */}
        <div className="flex">
          {/* Rating */}
          <div className="flex-1 border-r border-gray-300 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center mb-2">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-bold text-gray-800 ml-2">{rating}</span>
              </div>
              <span className="text-sm text-gray-500">ดีมาก</span>
            </div>
          </div>
          
          {/* Booking Success Rate */}
          <div className="flex-1 border-r border-gray-300 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-800 ml-2">{bookingSuccessRate}%</span>
              </div>
              <span className="text-sm text-gray-500">ได้รถคันที่จอง</span>
            </div>
          </div>
          
          {/* Recommendation Rate */}
          <div className="flex-1 p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center relative">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {/* Small stars above */}
                  <div className="absolute -top-1 -right-1 flex">
                    <svg className="w-2 h-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-2 h-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800 ml-2">{recommendationRate}%</span>
              </div>
              <span className="text-sm text-gray-500">แนะนำ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Review Scores */}
      <div className="rounded-md overflow-hidden mt-6">
        {/* Tab Navigation */}
        <div className="flex">
          <button 
            onClick={() => setActiveTab('car')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === 'car' 
                ? 'bg-blue-600 text-white rounded-l-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-l-md'
            }`}
          >
            คะแนนรถคันนี้
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === 'shop' 
                ? 'bg-blue-600 text-white rounded-r-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-r-md'
            }`}
          >
            คะแนนร้าน
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'car' ? (
          <div className="flex">
            {/* Left Column - Car Score */}
            <div className="flex-1 p-4">
              <div className="space-y-3">
                {/* Value for Money */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">คุ้มค่ากับเงินที่จ่าย</span>
                    <span className="text-sm font-semibold text-gray-800">4.6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                {/* On Time */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">ตรงต่อเวลา</span>
                    <span className="text-sm font-semibold text-gray-800">4.6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Car Score */}
            <div className="flex-1 p-4">
              <div className="space-y-3">
                {/* Car Cleanliness */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">ความสะอาดของรถ</span>
                    <span className="text-sm font-semibold text-gray-800">4.7</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                {/* Car Performance */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">ประสิทธิภาพของรถ</span>
                    <span className="text-sm font-semibold text-gray-800">4.5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex">
            {/* Left Column - Shop Score */}
            <div className="flex-1 p-4">
              <div className="space-y-3">
                {/* Value for Money */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">คุ้มค่ากับเงินที่จ่าย</span>
                    <span className="text-sm font-semibold text-gray-800">4.8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                
                {/* Overall Car Condition */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">สภาพรถโดยรวม</span>
                    <span className="text-sm font-semibold text-gray-800">4.9</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Shop Score */}
            <div className="flex-1 p-4">
              <div className="space-y-3">
                {/* On Time */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">ตรงต่อเวลา</span>
                    <span className="text-sm font-semibold text-gray-800">4.7</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                {/* Staff Attentiveness */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">ความใส่ใจของเจ้าหน้าที่</span>
                    <span className="text-sm font-semibold text-gray-800">4.9</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
