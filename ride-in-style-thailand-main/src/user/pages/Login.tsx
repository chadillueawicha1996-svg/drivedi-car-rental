import { useState } from "react";
import { FaFacebook, FaGoogle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Navigation } from "@/user/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  // ตรวจสอบอีเมล
  const handleCheckEmail = async () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:3001/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.exists) {
        // อีเมลมีอยู่แล้ว - แสดงฟอร์มรหัสผ่าน
        setShowPasswordForm(true);
        setSuccess("กรุณากรอกรหัสผ่าน");
      } else {
        // อีเมลไม่มี - ไปหน้า register
        setError("อีเมลนี้ยังไม่มีในระบบ กรุณาสมัครสมาชิก");
        setTimeout(() => navigate("/register"), 2000);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
    } finally {
      setIsLoading(false);
    }
  };

  // เข้าสู่ระบบ
  const handleLogin = async () => {
    if (!password) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess("เข้าสู่ระบบสำเร็จ! กำลังไปหน้าหลัก...");
        
        // เพิ่ม is_admin field เข้าไปในข้อมูลผู้ใช้
        const userWithAdmin = {
          ...data.user,
          is_admin: data.user.is_admin || 0 // ใช้ค่า is_admin จาก API หรือ default เป็น 0
        };
        
        // บันทึกข้อมูลผู้ใช้ใน localStorage (รวม is_admin)
        localStorage.setItem("currentUser", JSON.stringify(userWithAdmin));
        
        // บันทึก is_admin แยกเพื่อความเข้ากันได้กับโค้ดเดิม
        localStorage.setItem("isAdmin", userWithAdmin.is_admin === 1 ? "true" : "false");
        
        // ดึงและบันทึก display_name
        try {
          const displayRes = await fetch("http://localhost:3001/api/get-display-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.user.email }),
          });
          
          if (displayRes.ok) {
            const displayData = await displayRes.json();
            localStorage.setItem("displayName", displayData.displayName || data.user.email);
          }
        } catch (error) {
          console.error("Error fetching display name:", error);
          localStorage.setItem("displayName", data.user.email);
        }
        
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <section className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/public/images/hero/kran.JPG')"}}>
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-light text-[#232B3A] text-center mb-2">ยินดีต้อนรับกลับมา!</h2>
          <div className="text-[#232B3A] text-center mb-6">เข้าสู่ระบบสมาชิกเพื่อติดตามสถานะกับเราได้ง่ายกว่า</div>
          
          {/* Email Check */}
          <div className="flex items-center border rounded-lg px-3 py-2 mb-3 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="อีเมล"
              className="bg-transparent outline-none flex-1 text-[#232B3A] placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={showPasswordForm}
            />
            <button
              type="button"
              className="ml-2 text-xs px-3 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition disabled:opacity-50"
              onClick={handleCheckEmail}
              disabled={!email || showPasswordForm || isLoading}
            >
              {isLoading ? "กำลังตรวจสอบ..." : "ถัดไป"}
            </button>
          </div>

          {error && <div className="text-red-500 text-xs mb-2 text-left">{error}</div>}
          {success && <div className="text-green-600 text-xs mb-2 text-left">{success}</div>}

          {/* Password Form (แสดงเมื่ออีเมลมีในระบบ) */}
          {showPasswordForm && (
            <div className="space-y-3 mb-4">
              <div>
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="w-full border rounded-lg px-3 py-2 text-[#232B3A] placeholder-gray-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-[#0080FF] hover:bg-blue-700 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
              >
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-gray-400">หรือ</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center border border-gray-200 rounded-lg py-2 mb-3 bg-white hover:bg-gray-50 transition">
            <FaPhoneAlt className="text-yellow-400 ml-2 mr-3" />
            <span className="text-[#232B3A] flex-1 text-left">เบอร์โทรศัพท์</span>
          </button>
          <button className="w-full flex items-center border border-gray-200 rounded-lg py-2 mb-3 bg-white hover:bg-gray-50 transition">
            <FaFacebook className="text-blue-600 ml-2 mr-3" />
            <span className="text-[#232B3A] flex-1 text-left">เข้าสู่ระบบด้วย Facebook</span>
          </button>
          <button className="w-full flex items-center border border-gray-200 rounded-lg py-2 mb-3 bg-white hover:bg-gray-50 transition">
            <FaGoogle className="text-[#EA4335] ml-2 mr-3" />
            <span className="text-[#232B3A] flex-1 text-left">เข้าสู่ระบบด้วย Google</span>
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="w-full bg-[#0080FF] hover:bg-blue-700 text-white font-medium rounded-lg py-2 mt-2 mb-3 transition"
          >
            สมัครสมาชิกเลย
          </button>

          {/* Terms */}
          <div className="text-xs text-center text-gray-400">
            การลงชื่อสมัครใช้บริการ Drivehub ทำให้ได้รับทราบและยอมรับตาม<br />
            <a href="#" className="text-blue-500 underline">เงื่อนไขการให้บริการ</a> และ <a href="#" className="text-blue-500 underline">นโยบายความเป็นส่วนตัว</a>
          </div>
        </div>
      </section>
    </>
  );
} 