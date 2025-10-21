import { useState, useEffect } from "react";
import { User, Calendar, Check } from "lucide-react";
import { EditEmailModal } from "./EditEmailModal";
import { EmailVerificationModal } from "./EmailVerificationModal";

interface ProfileManagementFormProps {
  user: any;
}

export const ProfileManagementForm = ({ user }: ProfileManagementFormProps) => {
  const [birthDate, setBirthDate] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const response = await fetch('/api/get-user-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setDisplayName(data.displayName || generateDisplayName(user.email));
          setUserEmail(data.email || user.email);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setBirthDate(data.birthDate || "");
          setPhoneNumber(data.phoneNumber || "");
          setEmailVerified(data.emailVerified || false);
        } else {
          // Fallback to user data from props
          setDisplayName(generateDisplayName(user.email));
          setUserEmail(user.email);

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to user data from props
        setDisplayName(generateDisplayName(user.email));
        setUserEmail(user.email);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  const generateDisplayName = (email: string) => {
    // Generate a display name from email (e.g., first part of email)
    const emailPart = email.split('@')[0];
    return emailPart || 'DHfcqm2uqM';
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      console.log('Saving profile data:', {
        email: user.email,
        displayName,
        firstName,
        lastName,
        birthDate,
        phoneNumber
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/update-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email,
          displayName,
          firstName,
          lastName,
          birthDate,
          phoneNumber
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.log('Could not parse error response as JSON');
        }
        
        setSaveMessage(errorMessage);
        setTimeout(() => setSaveMessage(""), 5000);
        return;
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        setSaveMessage('เกิดข้อผิดพลาด: ไม่สามารถอ่านข้อมูลจากเซิร์ฟเวอร์ได้');
        setTimeout(() => setSaveMessage(""), 5000);
        return;
      }

      console.log('Response data:', responseData);

      if (responseData.success) {
        setSaveMessage("บันทึกข้อมูลสำเร็จ!");
        // อัปเดต localStorage เมื่อบันทึกสำเร็จ
        localStorage.setItem("displayName", displayName);
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(`เกิดข้อผิดพลาด: ${responseData.error || 'ไม่ทราบสาเหตุ'}`);
        setTimeout(() => setSaveMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      
      if (error.name === 'AbortError') {
        errorMessage = 'การเชื่อมต่อช้าเกินไป กรุณาลองใหม่อีกครั้ง';
      } else if (error.message) {
        errorMessage = `เกิดข้อผิดพลาด: ${error.message}`;
      }
      
      setSaveMessage(errorMessage);
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    try {
      const response = await fetch('/api/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          oldEmail: user.email, 
          newEmail: newEmail 
        }),
      });

      if (response.ok) {
        setUserEmail(newEmail);
        // Update localStorage with new email
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.email = newEmail;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        console.error('Failed to update email');
      }
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Management Section */}
      <div className="bg-white rounded-2xl p-8 w-full">
        <h2 className="text-2xl font-medium mb-8 text-gray-800">จัดการบัญชีโปรไฟล์</h2>
        
        {/* Profile Display Name */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">ชื่อแสดงบนโปรไฟล์ (30 ตัวอักษร)</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 30) {
                    setDisplayName(newValue);
                  }
                }}
                maxLength={30}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm text-gray-600 mb-2">ชื่อ (ตามบัตรประชาชน)</label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="ชื่อ"
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">นามสกุล (ตามบัตรประชาชน)</label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="นามสกุล"
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">วันเกิด (สิทธิพิเศษเฉพาะคุณ)</label>
            <div className="relative max-w-48">
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${birthDate ? 'text-gray-800' : 'text-gray-400'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white rounded-2xl p-8 w-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-gray-600">อีเมล (เพื่อรับข้อมูลยืนยันการจอง)</label>
            {emailVerified ? (
              <div className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span className="text-sm">ยืนยันแล้ว</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                <span className="text-sm">ยังไม่ยืนยัน</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{userEmail}</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="text-blue-600 text-sm hover:text-blue-700 underline"
                >
                  แก้ไข
                </button>
              </div>
            </div>
            {!emailVerified && (
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowVerificationModal(true)}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  ยืนยันอีเมล
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="bg-white rounded-2xl p-8 w-full">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-gray-600">เบอร์โทรศัพท์ (ใช้ติดต่อกับร้านเช่า)</label>
            <div className={`flex items-center ${phoneNumber ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${phoneNumber ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{phoneNumber ? 'ยืนยันแล้ว' : 'ยังไม่ทําการยืนยัน'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pl-0 pr-3 py-3 rounded-lg">
            <div className="flex items-center flex-1">
              <span className="mr-3 text-xl">🇹🇭</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ยังไม่ได้ทำการยืนยันเบอร์โทร"
                className="flex-1 border-none outline-none bg-transparent text-gray-800"
              />
            </div>
            <button className="text-blue-600 text-sm hover:text-blue-700 underline">
              แก้ไข
            </button>
          </div>
        </div>
      </div>

      {/* Account Management Section */}
      <div className="bg-white rounded-2xl p-8 w-full">
        
          <label className="block text-sm text-gray-600 mb-2">จัดการบัญชี</label>
          <div className="flex items-center justify-between">
            <span className="text-gray-800">ลบบัญชีผู้ใช้ของคุณ</span>
            <button className="text-red-600 text-sm">ลบ</button>
          </div>
        
      </div>

      {/* Save Section */}
      <div className="bg-white rounded-2xl p-8 w-full">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            saveMessage.includes('สำเร็จ') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Save Button */}
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
        >
          {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>

      {/* Edit Email Modal */}
      <EditEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={userEmail}
        onSave={(newEmail) => {
          setUserEmail(newEmail);
          setEmailVerified(true); // ตั้งสถานะยืนยันแล้วเพราะได้ยืนยัน OTP แล้ว
          setShowEmailModal(false);
        }}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={userEmail}
        onVerified={() => {
          setEmailVerified(true);
          setShowVerificationModal(false);
        }}
      />
    </div>
  );
}; 
