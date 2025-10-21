import React, { useState } from 'react';
import { LinkIcon, Facebook, Instagram, Twitter, Chrome, Apple, Smartphone, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  email: string;
  isConnected: boolean;
  lastSync: string;
  icon: React.ComponentType<any>;
}

interface AccountConnectionProps {
  user: any;
}

export function AccountConnection({ user }: AccountConnectionProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  // Mock data - ในอนาคตจะดึงจาก API
  const connectedAccounts: ConnectedAccount[] = [
    {
      id: '1',
      platform: 'Google',
      username: 'user@gmail.com',
      email: 'user@gmail.com',
      isConnected: true,
      lastSync: '2024-01-15T10:30:00Z',
      icon: Chrome
    },
    {
      id: '2',
      platform: 'Facebook',
      username: 'user.facebook',
      email: 'user@facebook.com',
      isConnected: true,
      lastSync: '2024-01-14T15:45:00Z',
      icon: Facebook
    },
    {
      id: '3',
      platform: 'Apple',
      username: 'user@icloud.com',
      email: 'user@icloud.com',
      isConnected: false,
      lastSync: '',
      icon: Apple
    }
  ];

  const availablePlatforms = [
    { id: 'google', name: 'Google', icon: Chrome, color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'apple', name: 'Apple', icon: Apple, color: 'bg-black' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'ไม่เคยเชื่อมต่อ';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConnect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowConnectModal(true);
  };

  const handleDisconnect = (accountId: string) => {
    // ในอนาคตจะส่ง API call เพื่อยกเลิกการเชื่อมต่อ
    console.log('Disconnecting account:', accountId);
  };

  const handleSync = (accountId: string) => {
    // ในอนาคตจะส่ง API call เพื่อซิงค์ข้อมูล
    console.log('Syncing account:', accountId);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <LinkIcon className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">การเชื่อมต่อบัญชี</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          เชื่อมต่อบัญชีอื่นๆ เพื่อเข้าสู่ระบบได้ง่ายขึ้น และซิงค์ข้อมูลระหว่างแอปพลิเคชัน
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">ความปลอดภัย</p>
              <p>การเชื่อมต่อบัญชีจะใช้ OAuth 2.0 ที่ปลอดภัย และไม่เก็บรหัสผ่านของคุณ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">บัญชีที่เชื่อมต่อแล้ว</h3>
        <div className="space-y-4">
          {connectedAccounts.map((account) => {
            const PlatformIcon = account.icon;
            
            return (
              <div
                key={account.id}
                className="border rounded-xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <PlatformIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800">{account.platform}</h4>
                      <p className="text-sm text-gray-600">{account.username}</p>
                      <p className="text-xs text-gray-500">
                        ซิงค์ล่าสุด: {formatDate(account.lastSync)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {account.isConnected ? (
                      <>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">เชื่อมต่อแล้ว</span>
                        </div>
                        <button
                          onClick={() => handleSync(account.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          ซิงค์
                        </button>
                        <button
                          onClick={() => handleDisconnect(account.id)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          ยกเลิก
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(account.platform.toLowerCase())}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        เชื่อมต่อ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Platforms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">เชื่อมต่อบัญชีใหม่</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availablePlatforms.map((platform) => {
            const PlatformIcon = platform.icon;
            const isConnected = connectedAccounts.some(
              account => account.platform.toLowerCase() === platform.id
            );
            
            return (
              <button
                key={platform.id}
                onClick={() => handleConnect(platform.id)}
                disabled={isConnected}
                className={`p-4 border rounded-xl transition-all duration-200 ${
                  isConnected
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <PlatformIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{platform.name}</span>
                  {isConnected && (
                    <div className="flex items-center text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      เชื่อมต่อแล้ว
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <Smartphone className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">การเข้าสู่ระบบด้วยมือถือ</h4>
          </div>
          <p className="text-sm text-gray-600">
            เปิดใช้งานการเข้าสู่ระบบด้วย SMS หรือแอปพลิเคชัน Authenticator
          </p>
          <button className="mt-3 text-blue-600 text-sm hover:text-blue-700">
            ตั้งค่า →
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">การแจ้งเตือนทางอีเมล</h4>
          </div>
          <p className="text-sm text-gray-600">
            รับการแจ้งเตือนเมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่
          </p>
          <button className="mt-3 text-blue-600 text-sm hover:text-blue-700">
            จัดการ →
          </button>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              เชื่อมต่อกับ {selectedPlatform}
            </h3>
            <p className="text-gray-600 mb-6">
              คุณจะถูกนำไปยังหน้าเข้าสู่ระบบของ {selectedPlatform} เพื่อยืนยันการเชื่อมต่อ
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  // ในอนาคตจะเปิด OAuth flow
                  console.log('Connecting to:', selectedPlatform);
                  setShowConnectModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เชื่อมต่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
