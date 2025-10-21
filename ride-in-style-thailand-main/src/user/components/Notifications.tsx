import React, { useState } from 'react';
import { Bell, Settings, Mail, Smartphone, Calendar, Car, CreditCard, Shield, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'booking' | 'payment' | 'system' | 'promotion';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    booking: boolean;
    payment: boolean;
    system: boolean;
    promotion: boolean;
  };
}

interface NotificationsProps {
  user: any;
}

export function Notifications({ user }: NotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'การจองรถสำเร็จ',
      message: 'การจองรถ Toyota Camry สำหรับวันที่ 15-17 มกราคม 2024 สำเร็จแล้ว',
      type: 'success',
      category: 'booking',
      isRead: false,
      timestamp: '2024-01-15T10:30:00Z',
      actionUrl: '/bookings/1'
    },
    {
      id: '2',
      title: 'การชำระเงินสำเร็จ',
      message: 'การชำระเงินจำนวน 4,500 บาท สำเร็จแล้ว ขอบคุณที่ใช้บริการ',
      type: 'success',
      category: 'payment',
      isRead: false,
      timestamp: '2024-01-15T09:15:00Z',
      actionUrl: '/payments/1'
    },
    {
      id: '3',
      title: 'โปรโมชั่นพิเศษ',
      message: 'รับส่วนลด 20% สำหรับการเช่ารถในเดือนกุมภาพันธ์ 2024',
      type: 'info',
      category: 'promotion',
      isRead: true,
      timestamp: '2024-01-14T16:00:00Z'
    },
    {
      id: '4',
      title: 'การบำรุงรักษา',
      message: 'รถที่คุณจองจะได้รับการบำรุงรักษาตามกำหนดเวลา',
      type: 'info',
      category: 'system',
      isRead: true,
      timestamp: '2024-01-13T14:30:00Z'
    },
    {
      id: '5',
      title: 'การยกเลิกการจอง',
      message: 'การจองรถ Honda CR-V สำหรับวันที่ 20-25 มกราคม 2024 ถูกยกเลิกแล้ว',
      type: 'warning',
      category: 'booking',
      isRead: false,
      timestamp: '2024-01-12T11:45:00Z'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: {
      booking: true,
      payment: true,
      system: true,
      promotion: false
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'เมื่อสักครู่';
    } else if (diffInHours < 24) {
      return `${diffInHours} ชั่วโมงที่แล้ว`;
    } else {
      return date.toLocaleDateString('th-TH', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return XCircle;
      case 'error':
        return XCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking':
        return Car;
      case 'payment':
        return CreditCard;
      case 'system':
        return Settings;
      case 'promotion':
        return Bell;
      default:
        return Bell;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(notif => !notif.isRead)
    : notifications;

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bell className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">การแจ้งเตือน</h2>
          {unreadCount > 0 && (
            <span className="ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              อ่านทั้งหมด
            </button>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className="text-gray-600 hover:text-gray-700"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ทั้งหมด ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'unread'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ยังไม่ได้อ่าน ({unreadCount})
        </button>
      </div>

      {activeTab === 'settings' ? (
        /* Notification Settings */
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">การแจ้งเตือน</h3>
            
            {/* Notification Channels */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">อีเมล</h4>
                    <p className="text-sm text-gray-600">รับการแจ้งเตือนทางอีเมล</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">Push Notifications</h4>
                    <p className="text-sm text-gray-600">รับการแจ้งเตือนในแอปพลิเคชัน</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">SMS</h4>
                    <p className="text-sm text-gray-600">รับการแจ้งเตือนทางข้อความ</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sms}
                    onChange={(e) => setSettings(prev => ({ ...prev, sms: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Notification Categories */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">ประเภทการแจ้งเตือน</h4>
              <div className="space-y-3">
                {Object.entries(settings.categories).map(([category, enabled]) => {
                  const CategoryIcon = getCategoryIcon(category);
                  const categoryLabels = {
                    booking: 'การจองรถ',
                    payment: 'การชำระเงิน',
                    system: 'ระบบ',
                    promotion: 'โปรโมชั่น'
                  };
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <CategoryIcon className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="text-sm text-gray-800">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [category]: e.target.checked
                            }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('all')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับไปดูการแจ้งเตือน
          </button>
        </div>
      ) : (
        /* Notification List */
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const NotificationIcon = getNotificationIcon(notification.type);
            const CategoryIcon = getCategoryIcon(notification.category);
            
            return (
              <div
                key={notification.id}
                className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                    <NotificationIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">{notification.title}</h4>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          <span>{notification.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            อ่านแล้ว
                          </button>
                        )}
                        {notification.actionUrl && (
                          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            ดูรายละเอียด
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredNotifications.length === 0 && activeTab !== 'settings' && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {activeTab === 'unread' ? 'ไม่มีการแจ้งเตือนที่ยังไม่ได้อ่าน' : 'ไม่มีการแจ้งเตือน'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'unread' 
              ? 'คุณได้อ่านการแจ้งเตือนทั้งหมดแล้ว' 
              : 'คุณจะได้รับการแจ้งเตือนที่นี่เมื่อมีกิจกรรมใหม่'
            }
          </p>
        </div>
      )}
    </div>
  );
}
