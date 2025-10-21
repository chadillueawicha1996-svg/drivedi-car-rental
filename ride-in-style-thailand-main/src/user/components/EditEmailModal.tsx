import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { EmailVerificationModal } from "./EmailVerificationModal";

interface EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSave: (newEmail: string) => void;
}

export const EditEmailModal = ({ isOpen, onClose, currentEmail, onSave }: EditEmailModalProps) => {
  const [email, setEmail] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // รีเซ็ต email เมื่อ modal เปิด
  useEffect(() => {
    if (isOpen) {
      setEmail(currentEmail);
      setError("");
      setShowVerificationModal(false);
    }
  }, [isOpen, currentEmail]);

  // ตรวจสอบว่า email เปลี่ยนจากเดิมหรือไม่
  const isEmailChanged = email.trim() !== currentEmail.trim();
  const isEmailValid = email.trim() !== "" && email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // เก็บอีเมลใหม่และแสดง verification modal (ไม่ส่ง OTP ซ้ำ)
      setNewEmail(email.trim());
      setShowVerificationModal(true);
      // ไม่เรียก onClose() เพื่อให้ verification modal แสดง
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = async () => {
    // เมื่อยืนยัน OTP สำเร็จแล้ว จึงอัปเดตฐานข้อมูล
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      
      // อัปเดตอีเมล
      const updateEmailResponse = await fetch("http://localhost:3001/api/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldEmail: user.email,
          newEmail: newEmail
        }),
      });

      const updateEmailData = await updateEmailResponse.json();

      if (updateEmailData.success) {
        // อัปเดต localStorage
        const updatedUser = { ...user, email: newEmail };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        
        // เรียก onSave เพื่ออัปเดตโปรไฟล์และตั้งสถานะยืนยันแล้ว
        onSave(newEmail);
        setShowVerificationModal(false);
      } else {
        console.error("Failed to update email after verification:", updateEmailData.error);
      }
    } catch (error) {
      console.error("Error updating email after verification:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-sm mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex-1"></div>
            <h2 className="text-lg font-medium text-gray-900 flex-1 text-center">แก้ไขอีเมล</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-1 flex justify-end"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                อีเมล (เพื่อรับข้อมูลยืนยันการจอง)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="กรุณากรอกอีเมล"
                  required
                />
              </div>

            </div>

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
                type="submit"
                disabled={isLoading || !isEmailValid || !isEmailChanged}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? "กำลังส่ง OTP..." : "ยืนยัน"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={newEmail}
        onVerified={handleEmailVerified}
        skipToOtp={true}
      />
    </>
  );
}; 