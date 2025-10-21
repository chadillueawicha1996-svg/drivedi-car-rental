import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface ChangePasswordFormProps {
  user: any;
}

export const ChangePasswordForm = ({ user }: ChangePasswordFormProps) => {
  const [step, setStep] = useState(1); // 1 = ตรวจสอบรหัสเดิม, 2 = ใส่รหัสใหม่
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ตรวจสอบรหัสผ่านเดิม
  const handleVerifyCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: currentPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2); // ไปขั้นตอนที่ 2
        setError("");
      } else {
        setError("รหัสผ่านเดิมไม่ถูกต้อง");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  // เปลี่ยนรหัสผ่านใหม่
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ตรวจสอบว่ารหัสผ่านใหม่ตรงกัน
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    // ตรวจสอบความยาวรหัสผ่านใหม่
    if (newPassword.length < 6) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("เปลี่ยนรหัสผ่านสำเร็จ!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setSuccess("");
          // Refresh page to update user session
          window.location.reload();
        }, 2000);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  // กลับไปขั้นตอนที่ 1
  const handleBackToStep1 = () => {
    setStep(1);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-white rounded-2xl p-8 w-full">
      <h2 className="text-2xl font-medium mb-8 text-gray-800">เปลี่ยนรหัสผ่าน</h2>
      
      {step === 1 ? (
        // ขั้นตอนที่ 1: ตรวจสอบรหัสผ่านเดิม
        <form onSubmit={handleVerifyCurrentPassword} className="space-y-6">
          <p className="text-gray-600 mb-6">โปรดกรอกรหัสผ่านเดิม เพื่อตั้งรหัสผ่านใหม่</p>
          
          {/* รหัสผ่านเดิม */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">รหัสผ่านเดิม</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="รหัสผ่านเดิม"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ลิงก์ลืมรหัสผ่าน */}
          <div className="text-left">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ฉันลืมรหัสผ่าน?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Next Button */}
          <button
            type="submit"
            disabled={isLoading || !currentPassword}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
          >
            {isLoading ? "กำลังตรวจสอบ..." : "ถัดไป"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>
      ) : (
        // ขั้นตอนที่ 2: ใส่รหัสผ่านใหม่
        <form onSubmit={handleChangePassword} className="space-y-6">
          <p className="text-gray-600 mb-6">กรอกรหัสผ่านใหม่ของคุณ</p>
          
          {/* รหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">รหัสผ่านใหม่</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ยืนยันรหัสผ่านใหม่ */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">ยืนยันรหัสผ่านใหม่</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 border border-green-200 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Back and Save Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleBackToStep1}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition"
            >
              กลับ
            </button>
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
            >
              {isLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "บันทึก"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 