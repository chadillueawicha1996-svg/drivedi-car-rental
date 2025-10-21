import { useEffect, useState, useRef } from "react";
import { Car, ChevronDown, User, LogOut, Settings, FileText, Link as LinkIcon, Lock, Bell, Calendar, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/shared/components/ui/sheet";

export const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRentDropdown, setShowRentDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const authBtnRef = useRef(null);
  const userBtnRef = useRef(null);
  const navigate = useNavigate();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      setUser(userData);
      
      // ตรวจสอบสิทธิ์ admin: is_admin === 1 หรือ isAdmin === true เพื่อความเข้ากันได้
      const isAdminUser = (userData?.is_admin === 1) || (userData?.isAdmin === true) || (localStorage.getItem("isAdmin") === "true");
      setIsAdmin(isAdminUser);
      
      console.log('🔍 Navigation: Checking admin status');
      console.log('👤 User data:', userData);
      console.log('🔑 is_admin value:', userData?.is_admin, 'Type:', typeof userData?.is_admin);
      console.log('🔑 isAdmin value:', userData?.isAdmin, 'Type:', typeof userData?.isAdmin);
      console.log('🔐 Final admin status:', isAdminUser);
      
      // ใช้ display_name จาก localStorage ก่อน (ถ้ามี)
      const storedDisplayName = localStorage.getItem("displayName");
      if (storedDisplayName) {
        setDisplayName(storedDisplayName);
      } else if (userData && userData.email) {
        // ดึงชื่อแสดงจาก API เฉพาะเมื่อไม่มีใน localStorage
        try {
          const response = await fetch("http://localhost:3001/api/get-display-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userData.email }),
          });
          
          if (response.ok) {
            const data = await response.json();
            const name = data.displayName || userData.email;
            setDisplayName(name);
            localStorage.setItem("displayName", name);
          } else {
            setDisplayName(userData.email);
            localStorage.setItem("displayName", userData.email);
          }
        } catch (error) {
          console.error("Error fetching display name:", error);
          setDisplayName(userData.email);
          localStorage.setItem("displayName", userData.email);
        }
      } else {
        setDisplayName("");
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (authBtnRef.current && !authBtnRef.current.contains(event.target)) {
        setShowAuthDropdown(false);
      }
      if (userBtnRef.current && !userBtnRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      setShowRentDropdown(false);
      setShowHelpDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    setUser(null);
    setIsAdmin(false);
    setShowUserDropdown(false);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 relative">
        {/* Logo ซ้าย */}
        <div className="flex items-center min-w-[180px]">
          <Car className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-xl font-normal bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">RentCar Pro</span>
        </div>
        {/* เมนูตรงกลาง */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex space-x-10">
            {/* เช่ารถกับ Drivehub Dropdown */}
            <div className="relative"
              onMouseEnter={() => setShowRentDropdown(true)}
              onMouseLeave={() => setShowRentDropdown(false)}
            >
              <button
                className="flex items-center tw-subtitle hover:text-blue-600 transition-colors bg-transparent border-0 focus:outline-none"
                onFocus={() => setShowRentDropdown(true)}
                onBlur={() => setShowRentDropdown(false)}
                onClick={() => { window.location.href = '/'; }}
              >
                เช่ารถกับ Drivehub <ChevronDown className={`ml-1 w-5 h-5 transition-transform duration-200  ${showRentDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showRentDropdown && (
                <>
                  {/* Invisible bridge: สูง 2.25rem = mt-9 */}
                  <div
                    className="absolute left-0 top-full w-72"
                    style={{ height: '2.25rem', pointerEvents: 'auto' }}
                    onMouseEnter={() => setShowRentDropdown(true)}
                    onMouseLeave={() => setShowRentDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-9 w-72 z-50 animate-slide-down"
                    style={{filter:'drop-shadow(0 6px 24px rgba(0,0,0,0.13))'}}
                    onMouseEnter={() => setShowRentDropdown(true)}
                    onMouseLeave={() => setShowRentDropdown(false)}
                  >
                    {/* Arrow (border) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        left: '28px',
                        width: 0,
                        height: 0,
                        borderLeft: '9px solid transparent',
                        borderRight: '9px solid transparent',
                        borderBottom: '9px solid #e5e7eb',
                        zIndex: 1,
                      }}
                    />
                    {/* Arrow (fill) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '29px',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid #fff',
                        zIndex: 2,
                      }}
                    />
                    <div className="bg-white rounded-[18px] border border-gray-100 p-4 pt-4" style={{boxShadow:'0 6px 24px rgba(0,0,0,0.13)'}}>
                      <div className="text-base text-[#232B3A] font-normal mb-3 text-left leading-snug cursor-default">
                        เมนูย่อยเช่ารถกับ Drivehub (ตัวอย่าง)
                      </div>
                      <button className="w-full bg-[#0080FF] hover:bg-blue-700 text-white rounded-[10px] py-2 text-base font-normal mb-3 transition cursor-pointer">
                        เมนูย่อย 1
                      </button>
                      <button className="w-full border-2 border-[#0080FF] text-[#0080FF] rounded-[10px] py-2 text-base font-normal bg-white hover:bg-blue-50 transition cursor-pointer">
                        เมนูย่อย 2
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* ความช่วยเหลือ Dropdown */}
            <div className="relative"
              onMouseEnter={() => setShowHelpDropdown(true)}
              onMouseLeave={() => setShowHelpDropdown(false)}
            >
              <button
                className="flex items-center tw-subtitle hover:text-blue-600 transition-colors bg-transparent border-0 focus:outline-none"
                onFocus={() => setShowHelpDropdown(true)}
                onBlur={() => setShowHelpDropdown(false)}
              >
                ความช่วยเหลือ <ChevronDown className={`ml-1 w-5 h-5 transition-transform duration-200 ${showHelpDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showHelpDropdown && (
                <>
                  {/* Invisible bridge: สูง 2.25rem = mt-9 */}
                  <div
                    className="absolute left-0 top-full w-72"
                    style={{ height: '2.25rem', pointerEvents: 'auto' }}
                    onMouseEnter={() => setShowHelpDropdown(true)}
                    onMouseLeave={() => setShowHelpDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-9 w-72 z-50 animate-slide-down"
                    style={{filter:'drop-shadow(0 6px 24px rgba(0,0,0,0.13))'}}
                    onMouseEnter={() => setShowHelpDropdown(true)}
                    onMouseLeave={() => setShowHelpDropdown(false)}
                  >
                    {/* Arrow (border) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        left: '28px',
                        width: 0,
                        height: 0,
                        borderLeft: '9px solid transparent',
                        borderRight: '9px solid transparent',
                        borderBottom: '9px solid #e5e7eb',
                        zIndex: 1,
                      }}
                    />
                    {/* Arrow (fill) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '29px',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid #fff',
                        zIndex: 2,
                      }}
                    />
                    <div className="bg-white rounded-[18px] border border-gray-100 p-4 pt-4" style={{boxShadow:'0 6px 24px rgba(0,0,0,0.13)'}}>
                      <div className="text-base text-[#232B3A] font-normal mb-3 text-left leading-snug cursor-default">
                        เมนูย่อยความช่วยเหลือ (ตัวอย่าง)
                      </div>
                      <button className="w-full bg-[#0080FF] hover:bg-blue-700 text-white rounded-[10px] py-2 text-base font-normal mb-3 transition cursor-pointer">
                        FAQ
                      </button>
                      <button className="w-full border-2 border-[#0080FF] text-[#0080FF] rounded-[10px] py-2 text-base font-normal bg-white hover:bg-blue-50 transition cursor-pointer">
                        ติดต่อเรา
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* User Menu (แสดงเมื่อ login แล้ว) */}
            {user ? (
              <div className="relative" ref={userBtnRef}
                onMouseEnter={() => {
                  if (closeTimeout.current) clearTimeout(closeTimeout.current);
                  setShowUserDropdown(true);
                }}
                onMouseLeave={() => {
                  closeTimeout.current = setTimeout(() => setShowUserDropdown(false), 180);
                }}
              >
                <button
                  className="flex items-center tw-subtitle hover:text-blue-600 transition-colors bg-transparent border-0 focus:outline-none"
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setShowUserDropdown(false)}
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-5 h-5 mr-2" />
                  {displayName || user.email}
                  <ChevronDown className={`ml-1 w-5 h-5 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showUserDropdown && (
                  <>
                    {/* Invisible bridge */}
                    <div
                      className="absolute left-0 top-full w-80"
                      style={{ height: '2.25rem', pointerEvents: 'auto' }}
                      onMouseEnter={() => setShowUserDropdown(true)}
                      onMouseLeave={() => setShowUserDropdown(false)}
                    />
                    <div className="absolute left-0 top-full mt-9 w-80 z-50 animate-slide-down"
                      style={{filter:'drop-shadow(0 6px 24px rgba(0,0,0,0.13))'}}
                      onMouseEnter={() => setShowUserDropdown(true)}
                      onMouseLeave={() => setShowUserDropdown(false)}
                    >
                      {/* Arrow (border) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-9px',
                          left: '28px',
                          width: 0,
                          height: 0,
                          borderLeft: '9px solid transparent',
                          borderRight: '9px solid transparent',
                          borderBottom: '9px solid #e5e7eb',
                          zIndex: 1,
                        }}
                      />
                      {/* Arrow (fill) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '29px',
                          width: 0,
                          height: 0,
                          borderLeft: '8px solid transparent',
                          borderRight: '8px solid transparent',
                          borderBottom: '8px solid #fff',
                          zIndex: 2,
                        }}
                      />
                      <div className="bg-white rounded-[18px] border border-gray-100 p-4 pt-4" style={{boxShadow:'0 6px 24px rgba(0,0,0,0.13)'}}>
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); navigate("/bookings"); }}
                        >
                          <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                          การจองของฉัน
                        </button>
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); navigate("/profile"); }}
                        >
                          <User className="w-4 h-4 mr-3 text-blue-600" />
                          จัดการบัญชีโปรไฟล์
                          <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                            ยังไม่ได้ทำการยืนยัน
                          </span>
                        </button>
                        {/* Admin Dashboard - แสดงสำหรับทุกคนที่ login แล้ว */}
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); navigate("/admin"); }}
                        >
                          <Settings className="w-4 h-4 mr-3 text-blue-600" />
                          Admin Dashboard
                        </button>
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); }}
                        >
                          <LinkIcon className="w-4 h-4 mr-3 text-blue-600" />
                          การเชื่อมโยงบัญชี
                        </button>
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); }}
                        >
                          <Lock className="w-4 h-4 mr-3 text-blue-600" />
                          เปลี่ยนรหัสผ่าน
                        </button>
                        <button
                          className="w-full flex items-center text-left text-sm text-[#232B3A] hover:bg-gray-50 rounded-lg px-3 py-2 transition mb-2"
                          onClick={() => { setShowUserDropdown(false); }}
                        >
                          <Bell className="w-4 h-4 mr-3 text-blue-600" />
                          การแจ้งเตือน
            </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          className="w-full flex items-center text-left text-sm text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 transition"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          ออกจากระบบ
            </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Auth Menu (แสดงเมื่อยังไม่ได้ login) */
            <div className="relative" ref={authBtnRef}
              onMouseEnter={() => {
                if (closeTimeout.current) clearTimeout(closeTimeout.current);
                setShowAuthDropdown(true);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(() => setShowAuthDropdown(false), 180);
              }}
            >
              <button
                className="flex items-center tw-subtitle hover:text-blue-600 transition-colors bg-transparent border-0 focus:outline-none"
                onMouseEnter={() => setShowAuthDropdown(true)}
                onMouseLeave={() => setShowAuthDropdown(false)}
                onFocus={() => setShowAuthDropdown(true)}
                onBlur={() => setShowAuthDropdown(false)}
              >
                สมัครสมาชิก/ลงชื่อเข้าใช้
                <ChevronDown className={`ml-1 w-5 h-5 transition-transform duration-200 ${showAuthDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showAuthDropdown && (
                <>
                  {/* Invisible bridge: สูง 2.25rem = mt-9 */}
                  <div
                    className="absolute left-0 top-full w-72"
                    style={{ height: '2.25rem', pointerEvents: 'auto' }}
                    onMouseEnter={() => setShowAuthDropdown(true)}
                    onMouseLeave={() => setShowAuthDropdown(false)}
                  />
                <div className="absolute left-0 top-full mt-9 w-72 z-50 animate-slide-down"
                  style={{filter:'drop-shadow(0 6px 24px rgba(0,0,0,0.13))'}}
                  onMouseEnter={() => setShowAuthDropdown(true)}
                  onMouseLeave={() => setShowAuthDropdown(false)}
                >
                    {/* Arrow (border) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        left: '28px',
                        width: 0,
                        height: 0,
                        borderLeft: '9px solid transparent',
                        borderRight: '9px solid transparent',
                        borderBottom: '9px solid #e5e7eb',
                        zIndex: 1,
                      }}
                    />
                    {/* Arrow (fill) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '29px',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid #fff',
                        zIndex: 2,
                      }}
                    />
                  <div className="bg-white rounded-[18px] border border-gray-100 p-4 pt-4" style={{boxShadow:'0 6px 24px rgba(0,0,0,0.13)'}}>
                      <div className="text-base text-[#232B3A] font-normal mb-3 text-center leading-snug cursor-default">
                      รับส่วนลดพิเศษสำหรับสมาชิก Drivehub<br />พร้อมการจองที่รวดเร็วและไม่ยุ่งยาก!
                    </div>
                    <button
                        className="w-full bg-[#0080FF] hover:bg-blue-700 text-white rounded-[10px] py-2 text-base font-normal mb-3 transition cursor-pointer"
                      onClick={() => { setShowAuthDropdown(false); window.location.href = '/login'; }}
                    >
                      เข้าสู่ระบบ
                    </button>
                    <div className="border-t border-gray-200 my-3"></div>
                      <div className="text-center text-sm text-[#232B3A] mb-2 cursor-default">เข้าเว็บไซต์ Drivehub เป็นครั้งแรกใช่ไหม?</div>
                    <button
                        className="w-full border-2 border-[#0080FF] text-[#0080FF] rounded-[10px] py-2 text-base font-normal bg-white hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => { setShowAuthDropdown(false); window.location.href = '/register'; }}
                    >
                      สมัครสมาชิกเลย
                    </button>
                  </div>
                </div>
                </>
              )}
            </div>
            )}
          </div>
        </div>
        {/* ขวา: ปุ่มเมนูมือถือ */}
        <div className="min-w-[180px] flex justify-end md:min-w-[180px]">
          {/* แสดง Hamburger บนมือถือ */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>เมนู</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <SheetClose asChild>
                    <Link to="/" className="block px-3 py-2 rounded-lg text-base hover:bg-gray-100">หน้าแรก</Link>
                  </SheetClose>
                  {/* กลุ่มเมนูเช่ารถกับ Drivehub */}
                  <div>
                    <div className="px-3 py-2 text-sm text-gray-500">เช่ารถกับ Drivehub</div>
                    <div className="space-y-1 px-1">
                      <SheetClose asChild>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => navigate("/")}>เมนูย่อย 1</button>
                      </SheetClose>
                      <SheetClose asChild>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => navigate("/")}>เมนูย่อย 2</button>
                      </SheetClose>
                    </div>
                  </div>
                  {/* กลุ่มความช่วยเหลือ */}
                  <div className="pt-2">
                    <div className="px-3 py-2 text-sm text-gray-500">ความช่วยเหลือ</div>
                    <div className="space-y-1 px-1">
                      <SheetClose asChild>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">FAQ</button>
                      </SheetClose>
                      <SheetClose asChild>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">ติดต่อเรา</button>
                      </SheetClose>
                    </div>
                  </div>
                  {/* ผู้ใช้ */}
                  {user ? (
                    <div className="pt-2">
                      <div className="px-3 py-2 text-sm text-gray-500">บัญชีผู้ใช้</div>
                      <div className="space-y-1 px-1">
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => navigate("/bookings")}>การจองของฉัน</button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => navigate("/profile")}>จัดการบัญชีโปรไฟล์</button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => navigate("/admin")}>Admin Dashboard</button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50" onClick={handleLogout}>ออกจากระบบ</button>
                        </SheetClose>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="px-3 py-2 text-sm text-gray-500">เข้าสู่ระบบ</div>
                      <div className="space-y-1 px-1">
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/login")}>เข้าสู่ระบบ</button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button className="w-full text-left px-3 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => navigate("/register")}>สมัครสมาชิก</button>
                        </SheetClose>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
