import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
import { Navigation } from "@/user/components/Navigation";


export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const bookingData = {
    carId: params.get("carId"),
    carName: params.get("carName"),
    price: params.get("price"),
    pickupDate: params.get("pickupDate"),
    returnDate: params.get("returnDate"),
    time: params.get("time"),
    location: params.get("location")
  };

  return (
    <>
      <Navigation />

      <section className="py-8 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">การจองสำเร็จ!</h1>
                <p className="text-gray-600">ขอบคุณที่ใช้บริการของเรา</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-3">รายละเอียดการจอง</h2>
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

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate("/")} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  กลับหน้าหลัก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
} 