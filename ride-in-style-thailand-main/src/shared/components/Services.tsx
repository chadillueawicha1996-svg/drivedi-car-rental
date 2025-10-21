
import { Card, CardContent } from "@/shared/components/ui/card";
import { Shield, Clock, Headphones, MapPin, CreditCard, Wrench } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "ประกันภัยครอบคลุม",
    description: "ความคุ้มครองเต็มรูปแบบ รวมประกันชั้น 1"
  },
  {
    icon: Clock,
    title: "บริการ 24 ชั่วโมง",
    description: "พร้อมให้บริการทุกวัน ไม่มีวันหยุด"
  },
  {
    icon: Headphones,
    title: "ฝ่ายบริการลูกค้า",
    description: "ทีมงานมืออาชีพพร้อมช่วยเหลือ"
  },
  {
    icon: MapPin,
    title: "จุดรับส่งทั่วประเทศ",
    description: "สาขาครอบคลุมทุกจังหวัดท่องเที่ยว"
  },
  {
    icon: CreditCard,
    title: "ชำระเงินง่าย",
    description: "รองรับการชำระหลายช่องทาง"
  },
  {
    icon: Wrench,
    title: "ตรวจสภาพก่อนส่งมอบ",
    description: "รถทุกคันผ่านการตรวจสอบคุณภาพ"
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">บริการของเรา</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เราให้บริการครบวงจรเพื่อความสะดวกและปลอดภัยสูงสุด
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 text-white rounded-full mb-6">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
