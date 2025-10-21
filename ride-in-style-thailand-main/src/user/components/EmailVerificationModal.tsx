import { useState, useEffect, useRef } from "react";
import { X, ArrowLeft } from "lucide-react";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
  skipToOtp?: boolean; // เพิ่ม prop เพื่อข้ามไปหน้า OTP เลย
}

export const EmailVerificationModal = ({ isOpen, onClose, email, onVerified, skipToOtp = false }: EmailVerificationModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1 = ส่ง OTP, 2 = กรอก OTP
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // รีเซ็ต state เมื่อ modal เปิด
  useEffect(() => {
    if (isOpen && email && email.trim() !== "") {
      // รีเซ็ต state ทั้งหมด
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess("");
      setCountdown(0);
      
      // ถ้า skipToOtp เป็น true ให้ไปหน้า OTP เลย
      if (skipToOtp) {
        setStep(2);
        // ส่ง OTP อัตโนมัติ
        setTimeout(() => handleSendOtp(), 100);
      } else {
        setStep(1); // เริ่มต้นที่ step 1 (หน้ายืนยันอีเมล)
      }
    }
  }, [isOpen, email, skipToOtp]);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:3001/api/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setCountdown(300); // 5 นาที
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการส่ง OTP");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // รับได้แค่ 1 ตัวอักษร
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // ย้ายไปช่องถัดไป
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // ย้ายไปช่องก่อนหน้า
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");

    try {
      const response = await fetch("http://localhost:3001/api/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("ยืนยันอีเมลสำเร็จ!");
        setTimeout(() => {
          onVerified();
          onClose();
        }, 2000);
      } else {
        setError(data.error || "OTP ไม่ถูกต้อง");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsSendingOtp(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:3001/api/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCountdown(300); // 5 นาที
        setSuccess("ส่ง OTP ใหม่แล้ว");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการส่ง OTP");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    setCountdown(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {step === 2 && (
            <button
              onClick={handleBackToStep1}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-medium text-gray-900">
            {step === 1 ? "ยืนยันอีเมล" : "กรอกรหัสยืนยัน"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // ขั้นตอนที่ 1: ส่ง OTP
            <div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  อีเมลที่ต้องการยืนยัน
                </label>
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <span className="text-gray-800">{email}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                เราจะส่งรหัส OTP ไปยังอีเมลของคุณเพื่อยืนยัน
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {isSendingOtp ? "กำลังส่ง..." : "ส่ง OTP"}
                </button>
              </div>
            </div>
          ) : (
            // ขั้นตอนที่ 2: กรอก OTP
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  ระบุรหัสผ่านทาง อีเมล ที่ส่งไปยัง
                </p>
                <p className="text-blue-500 text-sm mb-6">{email}</p>
                
                {/* OTP Input Fields */}
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-mono border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      maxLength={1}
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 bg-green-100 text-green-700 border border-green-200 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? "กำลังยืนยัน..." : "ยืนยัน"}
                </button>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ไม่ได้รับรหัสผ่าน?{" "}
                  {countdown > 0 ? (
                    <span className="text-gray-400">
                      ขออีกครั้งใน {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} วินาที
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="text-blue-500 hover:text-blue-600 underline"
                    >
                      {isSendingOtp ? "กำลังส่ง..." : "ขออีกครั้ง"}
                    </button>
                  )}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 