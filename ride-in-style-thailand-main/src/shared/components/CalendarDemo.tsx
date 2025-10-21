import React, { useState } from 'react';
import { CustomCalendar } from './CustomCalendar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface CalendarDemoProps {
  className?: string;
}

export const CalendarDemo: React.FC<CalendarDemoProps> = ({ className = "" }) => {
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // ตัวอย่างวันที่ที่ถูกปิดใช้งาน (เช่น วันหยุด)
  const disabledDates = [
    new Date(2024, 11, 25), // วันคริสต์มาส
    new Date(2024, 11, 26), // วันหยุด
    new Date(2024, 11, 31), // วันปีใหม่
    new Date(2025, 0, 1),   // วันปีใหม่
  ];

  // ตัวอย่างวันที่สูงสุด (เช่น 6 เดือนข้างหน้า)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);

  const handleRangeSelect = (range: { from: Date; to: Date } | null) => {
    setSelectedRange(range);
    if (range) {
      setShowCalendar(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysDifference = (from: Date, to: Date) => {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ปฏิทินจองรถ</h1>
        <p className="text-gray-600">เลือกช่วงวันที่ที่ต้องการจองรถของคุณ</p>
      </div>

      {/* Calendar Trigger */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            เลือกวันที่
          </CardTitle>
          <CardDescription>
            คลิกเพื่อเปิดปฏิทินและเลือกช่วงวันที่
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full"
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {selectedRange 
              ? `${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`
              : 'เลือกช่วงวันที่'
            }
          </Button>

          {showCalendar && (
            <div className="absolute z-50 mt-2">
              <CustomCalendar
                selectedRange={selectedRange}
                onRangeSelect={handleRangeSelect}
                onClose={() => setShowCalendar(false)}
                minDate={new Date()}
                maxDate={maxDate}
                disabledDates={disabledDates}
                allowSingleDay={false}
                showTodayButton={true}
                showClearButton={true}
                showCloseButton={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Range Display */}
      {selectedRange && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              รายละเอียดการจอง
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่เริ่มต้น:</span>
                <Badge variant="secondary">{formatDate(selectedRange.from)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่สิ้นสุด:</span>
                <Badge variant="secondary">{formatDate(selectedRange.to)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">จำนวนวัน:</span>
                <Badge variant="outline">
                  {getDaysDifference(selectedRange.from, selectedRange.to)} วัน
                </Badge>
              </div>
            </div>
            
            <Button 
              onClick={() => setSelectedRange(null)}
              variant="destructive"
              className="w-full"
            >
              ล้างการเลือก
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              การเลือกช่วงวันที่
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              เลือกช่วงวันที่ได้อย่างยืดหยุ่น ตั้งแต่ 1 วันขึ้นไป พร้อมการแสดงผลแบบ visual feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              การนำทางด้วยคีย์บอร์ด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              ใช้ปุ่มลูกศรเพื่อนำทางระหว่างวันที่ และ Enter เพื่อเลือกวันที่
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              วันที่ถูกปิดใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              รองรับการปิดใช้งานวันที่เฉพาะ เช่น วันหยุด หรือวันที่ไม่สามารถจองได้
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ตัวอย่างการใช้งาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>การใช้งานพื้นฐาน</CardTitle>
              <CardDescription>ปฏิทินสำหรับการเลือกช่วงวันที่ทั่วไป</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CustomCalendar
  selectedRange={selectedRange}
  onRangeSelect={setSelectedRange}
  onClose={() => setShowCalendar(false)}
/>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>การใช้งานขั้นสูง</CardTitle>
              <CardDescription>ปฏิทินที่มีการกำหนดค่าขั้นสูง</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CustomCalendar
  selectedRange={selectedRange}
  onRangeSelect={setSelectedRange}
  minDate={new Date()}
  maxDate={maxDate}
  disabledDates={disabledDates}
  allowSingleDay={false}
  showTodayButton={true}
  showClearButton={true}
  showCloseButton={true}
/>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 