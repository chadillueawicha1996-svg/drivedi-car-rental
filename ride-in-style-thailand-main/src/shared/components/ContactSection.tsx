
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">ติดต่อเรา</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมให้บริการ
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">โทรศัพท์</h3>
                  <p className="text-gray-600">02-123-4567</p>
                  <p className="text-gray-600">080-123-4567</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">อีเมล</h3>
                  <p className="text-gray-600">info@rentcarpro.com</p>
                  <p className="text-gray-600">support@rentcarpro.com</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">ที่อยู่</h3>
                  <p className="text-gray-600">123 ถนนสุขุมวิท</p>
                  <p className="text-gray-600">กรุงเทพฯ 10110</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">เวลาทำการ</h3>
                  <p className="text-gray-600">จันทร์-อาทิตย์</p>
                  <p className="text-gray-600">24 ชั่วโมง</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h3>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input id="name" placeholder="กรอกชื่อของคุณ" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input id="email" type="email" placeholder="example@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" placeholder="080-123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">ข้อความ</Label>
                  <Textarea id="message" placeholder="กรอกข้อความของคุณ..." rows={5} />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg py-6">
                  ส่งข้อความ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
