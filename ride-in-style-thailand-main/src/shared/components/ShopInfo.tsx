import React from 'react';

interface ShopInfoProps {
  shopId: string;
  shopName: string;
  location: string;
}

export const ShopInfo: React.FC<ShopInfoProps> = ({
  shopId,
  shopName,
  location
}) => {
  return (
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
          <span className="text-gray-700 font-medium">{shopId} {shopName}</span>
        </div>
        <p className="text-gray-600">{location}</p>
      </div>
    </div>
  );
};
