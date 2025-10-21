import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CreditCard, Calendar, Clock, MapPin } from "lucide-react";
import { Navigation } from "@/user/components/Navigation";


const PAYMENT_METHODS = [
  { key: "card", label: "บัตรเครดิต / เดบิต" },
  { key: "bitpay", label: "BitPay" },
  { key: "bank", label: "โอนผ่านธนาคาร" },
  { key: "qr", label: "สแกนจ่าย (QR Code)" },
];

export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // ใช้ is_admin จาก currentUser แทน isAdmin แยก
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // ตรวจสอบ is_admin จาก currentUser
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setIsAdmin(userData.is_admin === 1);
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const price = params.get("price") || "3000";

  const bookingData = {
    carId: params.get("carId"),
    carName: params.get("carName"),
    price: params.get("price"),
    pickupDate: params.get("pickupDate"),
    returnDate: params.get("returnDate"),
    time: params.get("time"),
    location: params.get("location")
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      return;
    }
    // TODO: Implement payment processing
    navigate("/booking-confirmation");
  };

  return (
    <>
      <Navigation />

      <section className="py-8 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                ชำระเงิน
              </h1>

              {/* Security/Info Box */}
              <div className="flex items-center mb-4 bg-blue-50 rounded p-3 text-blue-900">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <span className="font-semibold">ข้อมูลการชำระเงิน</span>
                <span className="ml-2 text-xs text-gray-600">- ข้อมูลบัตรทั้งหมดได้รับการเข้ารหัสปลอดภัยและได้รับการปกป้องอย่างเต็มที่</span>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-4 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.key}
                    className={`px-4 py-2 rounded font-semibold border ${selectedPaymentMethod === m.key ? "bg-blue-100 text-blue-700 border-blue-500" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                    onClick={() => setSelectedPaymentMethod(m.key)}
                    type="button"
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Booking Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-3">สรุปรายละเอียดการจอง</h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>รถ:</span>
                    <span className="font-medium">{bookingData.carName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่รับรถ:</span>
                    <span className="font-medium">{bookingData.pickupDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่คืนรถ:</span>
                    <span className="font-medium">{bookingData.returnDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>เวลา:</span>
                    <span className="font-medium">{bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>สถานที่:</span>
                    <span className="font-medium">{bookingData.location}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">ยอดรวม:</span>
                    <span className="font-bold text-blue-600">฿{bookingData.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Content */}
              {selectedPaymentMethod === "card" && (
                <div className="mb-6">
                  <div className="flex gap-2 mb-2">
                    <img src="/images/visa.svg" alt="visa" className="h-6" />
                    <img src="/images/mastercard.svg" alt="mastercard" className="h-6" />
                    <img src="/images/jcb.svg" alt="jcb" className="h-6" />
                    <img src="/images/amex.svg" alt="amex" className="h-6" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <input className="border rounded px-3 py-2 w-full" placeholder="ชื่อบนบัตร *" />
                    <input className="border rounded px-3 py-2 w-full" placeholder="หมายเลขบัตรเครดิต / เดบิต *" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input className="border rounded px-3 py-2 w-full" placeholder="วันหมดอายุ *" />
                    <input className="border rounded px-3 py-2 w-full" placeholder="รหัส CVC / CVV *" />
                  </div>
                </div>
              )}
              {selectedPaymentMethod === "bitpay" && (
                <div className="mb-6 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <img src="/images/bitpay.svg" alt="bitpay" className="h-6" />
                    <img src="/images/btc.svg" alt="btc" className="h-6" />
                    <img src="/images/eth.svg" alt="eth" className="h-6" />
                    <img src="/images/usdt.svg" alt="usdt" className="h-6" />
                  </div>
                  <div className="text-gray-600 text-sm">รองรับการชำระเงินด้วย BitPay, Bitcoin, Ethereum, USDT ฯลฯ</div>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold">ดำเนินการต่อด้วย BitPay</button>
                </div>
              )}
              {selectedPaymentMethod === "bank" && (
                <div className="mb-6">
                  <div className="text-gray-700 font-semibold mb-2">โอนเงินผ่านธนาคาร</div>
                  <div className="bg-gray-100 rounded p-3 mb-2">
                    <div>ธนาคาร: <span className="font-bold">กสิกรไทย</span></div>
                    <div>ชื่อบัญชี: <span className="font-bold">บริษัท รถเช่าไทย จำกัด</span></div>
                    <div>เลขที่บัญชี: <span className="font-bold">123-4-56789-0</span></div>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">คัดลอกเลขที่บัญชี</button>
                </div>
              )}
              {selectedPaymentMethod === "qr" && (
                <div className="mb-6 flex flex-col items-center">
                  <div className="text-gray-700 font-semibold mb-2">สแกนจ่ายด้วย Mobile Banking</div>
                  <img src="/images/qr-mock.png" alt="QR Code" className="w-40 h-40 mb-2 border rounded" />
                  <div className="text-xs text-gray-500">โปรดสแกน QR Code เพื่อชำระเงิน</div>
                </div>
              )}

              {/* Terms and Confirm */}
              <div className="flex items-center mb-4">
                <input type="checkbox" id="agree" checked={isAdmin} onChange={() => {}} className="mr-2" />
                <label htmlFor="agree" className="text-sm text-gray-700">ฉันได้อ่านและยอมรับ <a href="#" className="text-blue-600 underline">ข้อตกลงและเงื่อนไข</a> ของบริษัท</label>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-red-500">ชำระเงินออนไลน์: ฿{price}</div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded font-semibold disabled:opacity-50" disabled={!isAdmin} onClick={handleSubmit}>จองตอนนี้</button>
              </div>
              <div className="mt-4 text-xs text-gray-500">* โปรดตรวจสอบข้อมูลการชำระเงินให้ถูกต้องก่อนยืนยันการจอง</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
} 