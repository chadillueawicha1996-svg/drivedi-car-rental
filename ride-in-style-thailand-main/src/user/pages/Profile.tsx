import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/user/components/Navigation";
import { ProfileManagementForm } from "@/user/components/ProfileManagementForm";
import { ChangePasswordForm } from "@/user/components/ChangePasswordForm";
import { AddCarForm } from "@/user/components/AddCarForm";
import { MyRentalCars } from "@/user/components/MyRentalCars";
import { EditCarInformation } from "@/user/components/EditCarInformation";
import { MyCoupons } from "@/user/components/MyCoupons";
import { MyCarRentals } from "@/user/components/MyCarRentals";
import { AccountConnection } from "@/user/components/AccountConnection";
import { Notifications } from "@/user/components/Notifications";
import { Breadcrumb } from "@/shared/components/Breadcrumb";
import { 
  User, 
  FileText, 
  Settings, 
  Link as LinkIcon, 
  Lock, 
  Bell, 
  LogOut, 
  ChevronRight,
  ArrowRight,
  Users,
  Gift,
  Car,
  Plus
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showCarManagementForm, setShowCarManagementForm] = useState(false);
  const [showCarSubMenu, setShowCarSubMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("profile");
  const [carManagementTab, setCarManagementTab] = useState<"add" | "list">("add");
  const [editingCar, setEditingCar] = useState<any>(null);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [showMyCoupons, setShowMyCoupons] = useState(false);
  const [showMyCarRentals, setShowMyCarRentals] = useState(false);
  const [showAccountConnection, setShowAccountConnection] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // ใช้ display_name จาก localStorage ก่อน (ถ้ามี)
      const storedDisplayName = localStorage.getItem("displayName");
      if (storedDisplayName) {
        setDisplayName(storedDisplayName);
      } else if (userData && userData.email) {
        // ดึงชื่อแสดงจาก API เฉพาะเมื่อไม่มีใน localStorage
        fetch("http://localhost:3001/api/get-display-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        })
        .then(response => response.json())
        .then(data => {
          const name = data.displayName || userData.email;
          setDisplayName(name);
          localStorage.setItem("displayName", name);
        })
        .catch(error => {
          console.error("Error fetching display name:", error);
          setDisplayName(userData.email);
          localStorage.setItem("displayName", userData.email);
        });
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleManageCars = () => {
    setShowCarSubMenu(!showCarSubMenu);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowCarManagementForm(false);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowMyCoupons(false);
    setShowMyCarRentals(false);
    setShowAccountConnection(false);
    setShowNotifications(false);
    setCurrentSection("profile");
  };

  const handleCarSubMenu = (tab: "add" | "list") => {
    setShowCarManagementForm(true);
    setShowCarSubMenu(true); // ค้างไว้
    setCarManagementTab(tab);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowMyCoupons(false);
    setShowMyCarRentals(false);
    setShowAccountConnection(false);
    setShowNotifications(false);
    setCurrentSection("manage-cars");
  };

  const handleShowMyCoupons = () => {
    setShowMyCoupons(true);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowCarManagementForm(false);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowMyCarRentals(false);
    setShowAccountConnection(false);
    setShowNotifications(false);
    setCurrentSection("my-coupons");
  };

  const handleShowMyCarRentals = () => {
    setShowMyCarRentals(true);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowCarManagementForm(false);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowMyCoupons(false);
    setShowAccountConnection(false);
    setShowNotifications(false);
    setCurrentSection("my-car-rentals");
  };

  const handleShowAccountConnection = () => {
    setShowAccountConnection(true);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowCarManagementForm(false);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowMyCoupons(false);
    setShowMyCarRentals(false);
    setShowNotifications(false);
    setCurrentSection("account-connection");
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
    setShowProfileForm(false);
    setShowChangePasswordForm(false);
    setShowCarManagementForm(false);
    setShowEditCarForm(false);
    setEditingCar(null);
    setShowMyCoupons(false);
    setShowMyCarRentals(false);
    setShowAccountConnection(false);
    setCurrentSection("notifications");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <div className="w-full px-4 py-4 bg-white">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={
              currentSection === "manage-profile" 
                ? [
                    { label: "หน้าแรก", path: "/" },
                    { label: "โปรไฟล์", path: "#" },
                    { label: "จัดการบัญชีโปรไฟล์", isActive: true }
                  ]
                : currentSection === "change-password"
                ? [
                    { label: "หน้าแรก", path: "/" },
                    { label: "โปรไฟล์", path: "#" },
                    { label: "เปลี่ยนรหัสผ่าน", isActive: true }
                  ]
                : currentSection === "manage-cars"
                ? [
                    { label: "หน้าแรก", path: "/" },
                    { label: "โปรไฟล์", path: "#" },
                    { label: "จัดการรถให้เช่า", isActive: true }
                  ]
                : [
                    { label: "หน้าแรก", path: "/" },
                    { label: "โปรไฟล์", isActive: true }
                  ]
            } 
          />
        </div>

        {/* Full width divider */}
        <div className="w-full border-b border-gray-200"></div>

        <div className="flex">
          <div className="max-w-sm ml-40 px-4 mt-4">
            {/* Profile Card */}
            <div className="bg-blue-600 rounded-2xl p-8 mb-6 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <div className="text-lg font-medium mb-2">{displayName || user.email}</div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-2xl p-4 mb-6">
              <div className="space-y-1">
                <button 
                  onClick={handleShowMyCoupons}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">คูปองของฉัน</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button 
                  onClick={handleShowMyCarRentals}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">การเช่ารถของฉัน</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* แสดงเมนู "จัดการรถให้เช่า" เฉพาะผู้ปล่อยเช่า */}
                {user.user_type === "owner" && (
                  <div>
                    <button 
                      onClick={handleManageCars}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center">
                        <Car className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="text-gray-800">จัดการรถให้เช่า</span>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ease-in-out ${
                          showCarSubMenu ? 'rotate-90' : 'rotate-0'
                        }`} 
                      />
                    </button>
                    
                    {/* เมนูย่อย */}
                    <div 
                      className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        showCarSubMenu 
                          ? 'max-h-32 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <button 
                        onClick={() => handleCarSubMenu("add")}
                        className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out text-sm"
                      >
                        <Plus className="w-4 h-4 mr-3 text-blue-600" />
                        <span className="text-gray-700">เพิ่มรถใหม่</span>
                      </button>
                      <button 
                        onClick={() => handleCarSubMenu("list")}
                        className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out text-sm"
                      >
                        <Car className="w-4 h-4 mr-3 text-blue-600" />
                        <span className="text-gray-700">รถเช่าของฉัน</span>
                      </button>
                    </div>
                  </div>
                )}



                <button 
                  onClick={() => {
                    setShowProfileForm(true); // เปิดเสมอ ไม่ปิด
                    setShowChangePasswordForm(false);
                    setShowCarManagementForm(false);
                    setShowEditCarForm(false);
                    setEditingCar(null);
                    setShowMyCoupons(false);
                    setShowMyCarRentals(false);
                    setShowAccountConnection(false);
                    setShowNotifications(false);
                    setCurrentSection("manage-profile");
                  }}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800 whitespace-nowrap">จัดการบัญชีโปรไฟล์</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mr-2">
                      ยังไม่ได้ทำการยืนยัน
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button 
                  onClick={handleShowAccountConnection}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">การเชื่อมต่อบัญชี</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button 
                  onClick={() => {
                    setShowChangePasswordForm(true); // เปิดเสมอ ไม่ปิด
                    setShowProfileForm(false);
                    setShowCarManagementForm(false);
                    setShowEditCarForm(false);
                    setEditingCar(null);
                    setShowMyCoupons(false);
                    setShowMyCarRentals(false);
                    setShowAccountConnection(false);
                    setShowNotifications(false);
                    setCurrentSection("change-password");
                  }}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">เปลี่ยนรหัสผ่าน</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button 
                  onClick={handleShowNotifications}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">การแจ้งเตือน</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-2 hover:bg-red-50 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-3 text-red-600" />
                    <span className="text-red-600">ออกจากระบบ</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Invite Friends Banner */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Users className="w-6 h-6 mr-3" />
                    <h3 className="text-lg font-medium">ชวนเพื่อนเป็นสมาชิก</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-1">รับส่วนลดสูงสุด 200 บาท ทันที!</p>
                  <p className="text-xs opacity-75">ได้ทั้งเพื่อนทั้งเรา</p>
                  <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg mt-3 flex items-center hover:bg-yellow-300 transition">
                    ชวนเพื่อนเลย
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <div className="hidden md:block">
                  {/* Placeholder for illustration */}
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Management Form - Right Side */}
          {showProfileForm && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <ProfileManagementForm user={user} />
            </div>
          )}

          {/* Change Password Form - Right Side */}
          {showChangePasswordForm && (
            <div className="ml-4 mt-4 flex-1 mr-40">
              <ChangePasswordForm user={user} />
            </div>
          )}

          {/* Add Car Form - Right Side */}
          {showCarManagementForm && carManagementTab === "add" && !showEditCarForm && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <AddCarForm 
                user={user}
                onCarAdded={() => {
                  setCarManagementTab("list");
                }}
                onCancel={() => setCarManagementTab("list")}
              />
            </div>
          )}

          {/* My Rental Cars - Right Side */}
          {showCarManagementForm && carManagementTab === "list" && !showEditCarForm && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <MyRentalCars 
                user={user}
                onEditCar={(car) => {
                  setEditingCar(car);
                  setShowEditCarForm(true);
                }}
              />
            </div>
          )}

          {/* Edit Car Information - Right Side */}
          {showEditCarForm && editingCar && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <EditCarInformation 
                user={user}
                car={editingCar}
                onCarUpdated={() => {
                  setShowEditCarForm(false);
                  setEditingCar(null);
                }}
                onBackToList={() => {
                  setShowEditCarForm(false);
                  setEditingCar(null);
                }}
              />
            </div>
          )}

          {/* My Coupons - Right Side */}
          {showMyCoupons && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <MyCoupons user={user} />
            </div>
          )}

          {/* My Car Rentals - Right Side */}
          {showMyCarRentals && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <MyCarRentals user={user} />
            </div>
          )}

          {/* Account Connection - Right Side */}
          {showAccountConnection && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <AccountConnection user={user} />
            </div>
          )}

          {/* Notifications - Right Side */}
          {showNotifications && (
            <div className="ml-4 mt-4 flex-1 mr-40 pb-5">
              <Notifications user={user} />
            </div>
          )}
        </div>
      </div>
    </>
  );
} 