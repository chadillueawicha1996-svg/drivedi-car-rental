/**
 * AdminDashboard Component
 * 
 * This component is accessible to all authenticated users.
 * Users must be logged in to access this dashboard.
 * 
 * Expected user data structure in localStorage:
 * {
 *   "id": 1,
 *   "email": "user@example.com",
 *   "display_name": "User Name",
 *   ...other user fields
 * }
 * 
 * Features:
 * - Dashboard statistics
 * - User management
 * - Car management
 * - Booking management
 * - Reports and settings
 */

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Import components
import DashboardStats from '../DashboardStats';
import DashboardTabs from '../DashboardTabs';
import UsersManagement from '../UsersManagement';
import CarsManagement from '../CarsManagement';
import BookingsManagement from '../BookingsManagement';
import Sidebar from '../Sidebar';
import PlaceholderContent from '../PlaceholderContent';

interface DashboardStatsData {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  pendingCars: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

interface User {
  id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  user_type: string;
  birth_date: string;
  phone_number: string;
  email_verified: boolean;
  created_at: string;
  is_admin?: number;
}

interface RecentUser {
  id: number;
  email: string;
  display_name: string;
  user_type: string;
  created_at: string;
  email_verified: boolean;
}

interface RecentCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  user_id: number;
  owner_name: string;
}

interface CarData {
  id: number;
  brand: string;
  model: string;
  sub_model: string;
  year: number;
  color: string;
  plate_number: string;
  car_type: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  engine_size: string;
  doors: number;
  luggage: number;
  price: number;
  price_type: string;
  pickup_area: string;
  shop_location: string;
  after_hours_service: string;
  normal_hours: string;
  insurance: boolean;
  roadside_assistance: boolean;
  free_cancellation: boolean;
  unlimited_mileage: boolean;
  unlimited_route: boolean;
  status: string;
  user_id: number;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

interface RecentBooking {
  id: number;
  car_brand: string;
  car_model: string;
  renter_name: string;
  owner_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

interface Booking {
  id: number;
  car_brand: string;
  car_model: string;
  renter_name: string;
  owner_name: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  pickup_datetime: string;
  return_datetime: string;
  pickup_location: string;
  note: string;
  total_price: number;
  delivery_fee: string;
  pickup_fee: string;
  deposit_amount: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingCars: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentCars, setRecentCars] = useState<RecentCar[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissionChecking, setPermissionChecking] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check user authentication on component mount
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        console.log('🔍 Checking user authentication...');
        
        // Get user data from localStorage
        const userData = localStorage.getItem('currentUser');
        console.log('📦 User data from localStorage:', userData);
        
        if (!userData) {
          console.log('❌ No user data found, redirecting to home');
          setPermissionChecking(false);
          navigate('/');
          return;
        }

        const user = JSON.parse(userData);
        console.log('👤 Parsed user data:', user);
        
        // Set current user for display
        setCurrentUser(user);

        // Sync display name like Navigation component
        const storedDisplayName = localStorage.getItem('displayName');
        if (storedDisplayName) {
          setDisplayName(storedDisplayName);
        } else if (user && user.email) {
          try {
            const resp = await fetch('http://localhost:3001/api/get-display-name', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email }),
            });
            if (resp.ok) {
              const data = await resp.json();
              const name = data.displayName || user.display_name || '';
              if (name) {
                setDisplayName(name);
                localStorage.setItem('displayName', name);
              }
            }
          } catch (e) {
            // ignore and keep fallback
          }
        }
        
        console.log('✅ User authenticated, proceeding to fetch dashboard data');
        // User is authenticated, proceed to fetch dashboard data
        setPermissionChecking(false);
        fetchDashboardData();
      } catch (error) {
        console.error('❌ Error checking user authentication:', error);
        // Error occurred, redirect to home
        setPermissionChecking(false);
        navigate('/');
      }
    };

    checkUserAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    }
    if (activeTab === 'cars') {
      fetchAllCars();
    }
    if (activeTab === 'bookings') {
      fetchAllBookings();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      console.log('🚀 Fetching dashboard data...');
      setLoading(true);
      
      // ดึงข้อมูลสถิติ
      console.log('📊 Fetching dashboard stats...');
      const statsResponse = await fetch('http://localhost:3001/api/admin/dashboard-stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Dashboard stats loaded:', statsData);
        setStats(statsData);
      } else {
        console.warn('⚠️ Failed to fetch dashboard stats:', statsResponse.status);
        // Set fallback data
        setStats({
          totalUsers: 0,
          totalCars: 0,
          totalBookings: 0,
          totalRevenue: 0,
          pendingCars: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0
        });
      }

      // ดึงข้อมูล users ล่าสุด
      console.log('👥 Fetching recent users...');
      const usersResponse = await fetch('http://localhost:3001/api/admin/recent-users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ Recent users loaded:', usersData);
        setRecentUsers(usersData);
      } else {
        console.warn('⚠️ Failed to fetch recent users:', usersResponse.status);
        setRecentUsers([]);
      }

      // ดึงข้อมูล cars ล่าสุด
      console.log('🚗 Fetching recent cars...');
      const carsResponse = await fetch('http://localhost:3001/api/admin/recent-cars');
      if (carsResponse.ok) {
        const carsData = await carsResponse.json();
        console.log('✅ Recent cars loaded:', carsData);
        setRecentCars(carsData);
      } else {
        console.warn('⚠️ Failed to fetch recent cars:', carsResponse.status);
        setRecentCars([]);
      }

      // ดึงข้อมูล bookings ล่าสุด
      console.log('📅 Fetching recent bookings...');
      const bookingsResponse = await fetch('http://localhost:3001/api/admin/recent-bookings');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        console.log('✅ Recent bookings loaded:', bookingsData);
        setRecentBookings(bookingsData);
      } else {
        console.warn('⚠️ Failed to fetch recent bookings:', bookingsResponse.status);
        setRecentBookings([]);
      }
      
      console.log('🎉 Dashboard data loading completed');
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Set fallback data on complete failure
      setStats({
        totalUsers: 0,
        totalCars: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingCars: 0,
        activeBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0
      });
      setRecentUsers([]);
      setRecentCars([]);
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/all-users');
      if (response.ok) {
        const usersData = await response.json();
        setAllUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAllCars = async () => {
    try {
      setCarsLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/all-cars');
      if (response.ok) {
        const carsData = await response.json();
        setAllCars(carsData);
      }
    } catch (error) {
      console.error('Error fetching all cars:', error);
    } finally {
      setCarsLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await fetch('/api/admin/all-bookings');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
        console.log('✅ ดึงข้อมูลการจองสำเร็จ:', data.bookings.length, 'รายการ');
      } else {
        console.error('❌ ไม่สามารถดึงข้อมูลการจองได้:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  // ฟังก์ชันเปลี่ยนสิทธิ์ผู้ใช้
  const changeUserRole = async (userId: number, newRole: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/change-user-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          is_admin: newRole
        }),
      });

      if (response.ok) {
        // อัปเดตข้อมูลใน state
        setAllUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, is_admin: newRole }
              : user
          )
        );
        
        // แสดงข้อความสำเร็จ
        console.log(`✅ Changed user ${userId} role to ${newRole === 1 ? 'Admin' : 'User'}`);
      } else {
        console.error('❌ Failed to change user role');
      }
    } catch (error) {
      console.error('❌ Error changing user role:', error);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    // แสดงรายละเอียดการจอง (สามารถเพิ่ม modal หรือ dialog ได้)
    console.log('📋 ดูรายละเอียดการจอง:', booking);
    
    const timeInfo = booking.start_time && booking.end_time 
      ? `\nเวลา: ${booking.start_time} - ${booking.end_time}`
      : '\nเวลา: ไม่ระบุ';
    
    const datetimeInfo = booking.pickup_datetime && booking.return_datetime
      ? `\n\n📅 วันที่และเวลารับรถ: ${new Date(booking.pickup_datetime).toLocaleString('th-TH')}\n📅 วันที่และเวลาคืนรถ: ${new Date(booking.return_datetime).toLocaleString('th-TH')}`
      : '';
    
    const locationInfo = booking.pickup_location 
      ? `\nสถานที่: ${booking.pickup_location}`
      : '\nสถานที่: ไม่ระบุ';
    
    const feeInfo = `\nค่าส่งรถ: ฿${parseFloat(booking.delivery_fee || '0').toLocaleString('th-TH')}\nค่ารับรถ: ฿${parseFloat(booking.pickup_fee || '0').toLocaleString('th-TH')}\nค่ามัดจำ: ฿${parseFloat(booking.deposit_amount || '0').toLocaleString('th-TH')}`;
    
    alert(`รายละเอียดการจอง:\nรถ: ${booking.car_brand} ${booking.car_model}\nผู้จอง: ${booking.renter_name}\nเจ้าของ: ${booking.owner_name}\nสถานะ: ${booking.status}${timeInfo}${datetimeInfo}${locationInfo}${feeInfo}\n\nราคารวม: ฿${parseFloat(booking.total_price.toString()).toLocaleString('th-TH')}`);
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/update-booking-status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ อัปเดตสถานะการจองสำเร็จ');
        // รีเฟรชข้อมูลการจอง
        fetchAllBookings();
      } else {
        console.error('❌ ไม่สามารถอัปเดตสถานะได้:', result.error);
        alert('ไม่สามารถอัปเดตสถานะได้: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const handleMenuClick = (menuId: string) => {
    setActiveTab(menuId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardStats stats={stats} />
            <DashboardTabs
              recentUsers={recentUsers}
              recentCars={recentCars}
              recentBookings={recentBookings}
            />
    </>
  );
      case 'users':
        return (
          <UsersManagement
            users={allUsers}
            loading={usersLoading}
            onRefresh={fetchAllUsers}
            onRoleChange={changeUserRole}
          />
        );
      case 'cars':
        return (
          <CarsManagement
            cars={allCars}
            loading={carsLoading}
            onRefresh={fetchAllCars}
          />
        );
      case 'bookings':
        return (
          <BookingsManagement
            bookings={bookings}
            loading={bookingsLoading}
            onRefresh={fetchAllBookings}
            onViewBooking={handleViewBooking}
            onUpdateStatus={handleUpdateBookingStatus}
          />
        );
      case 'reports':
        return <PlaceholderContent type="reports" />;
      case 'settings':
        return <PlaceholderContent type="settings" />;
      default:
        return (
          <>
            <DashboardStats stats={stats} />
            <DashboardTabs
              recentUsers={recentUsers}
              recentCars={recentCars}
              recentBookings={recentBookings}
            />
          </>
        );
    }
  };

  // Show loading while checking user authentication
  if (permissionChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onMenuClick={handleMenuClick}
          displayName={displayName || currentUser?.display_name || 'Dashboard Panel'}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-0' : '-ml-64'
        }`}>
          {/* Top bar (like Navigation) */}
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="border-0 shadow-none rounded-md hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
                title={isSidebarOpen ? 'ซ่อนเมนู' : 'แสดงเมนู'}
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
          {/* Content Body */}
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;