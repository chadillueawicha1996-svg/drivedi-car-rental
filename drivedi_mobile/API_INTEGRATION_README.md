# การเชื่อมต่อ Flutter App กับ API Server

## ภาพรวม
Flutter app ได้รับการอัปเดตให้เชื่อมต่อกับ API server ที่ `server.js` เพื่อดึงข้อมูลรถยนต์จริงจากฐานข้อมูล

## ไฟล์ที่สร้าง/แก้ไข

### 1. `lib/services/car_service.dart` (ใหม่)
Service class สำหรับเรียก API endpoints:
- `getAllCars()` - ดึงข้อมูลรถยนต์ทั้งหมด
- `getCarById(int carId)` - ดึงข้อมูลรถยนต์ตาม ID
- `getUserCars(String email)` - ดึงข้อมูลรถยนต์ของผู้ใช้
- `createBooking()` - สร้างการจองรถ
- `getUserBookings()` - ดึงข้อมูลการจองของผู้ใช้
- `cancelRental()` - ยกเลิกการจอง

### 2. `lib/widgets/car_card.dart` (แก้ไข)
อัปเดต CarItem model:
- เพิ่มฟิลด์ใหม่ที่ตรงกับ API response
- เพิ่ม factory constructor `CarItem.fromApi()` สำหรับแปลงข้อมูลจาก API
- รองรับการแสดงข้อมูลรูปภาพจาก API

### 3. `lib/screens/available_cars_screen.dart` (แก้ไข)
อัปเดตให้ใช้ข้อมูลจาก API:
- เพิ่ม state management สำหรับ loading และ error
- เรียกใช้ `CarService.getAllCars()` แทน mock data
- เพิ่ม UI สำหรับแสดง loading, error และ empty states
- รีเฟรชข้อมูลเมื่อเปลี่ยนวันที่เช่า

### 4. `lib/screens/api_test_screen.dart` (ใหม่)
หน้าจอทดสอบการเชื่อมต่อ API:
- ทดสอบการดึงข้อมูลรถยนต์ทั้งหมด
- ทดสอบการดึงข้อมูลรถยนต์ตาม ID
- แสดงผลลัพธ์และข้อผิดพลาด

## การใช้งาน

### 1. เริ่มต้น API Server
```bash
cd api
PORT=3001 node server.js
```

หรือใช้สคริปต์ที่เตรียมไว้:
```bash
cd api
./start-server.sh
```

Server จะรันที่ `http://localhost:3001`

### ⚠️ การแก้ไขปัญหา "Connection refused"

หากพบข้อผิดพลาด "Connection refused" ให้ทำตามขั้นตอนนี้:

1. **ตรวจสอบว่า server ทำงานอยู่หรือไม่:**
```bash
curl http://localhost:3001/api/cars
```

2. **หาก server ไม่ทำงาน ให้เริ่มใหม่:**
```bash
cd api
PORT=3001 node server.js
```

3. **หาก port ถูกใช้งานอยู่:**
```bash
# หา process ที่ใช้ port 3001
lsof -i :3001

# ปิด process (แทน PID ด้วยหมายเลขที่ได้)
kill -9 PID
```

4. **ตรวจสอบว่า MySQL database ทำงานอยู่:**
   - เปิด XAMPP Control Panel
   - เริ่ม MySQL service

### ⚠️ การแก้ไขปัญหา "type 'String' is not a subtype of type 'int'"

หากพบข้อผิดพลาดนี้ หมายความว่าข้อมูลจาก API มีฟิลด์ที่เป็น String แต่โค้ด Flutter คาดหวังเป็น int:

**ฟิลด์ที่มีปัญหา:**
- `price`: "2000.00" (String) → แปลงเป็น int
- `shop_latitude`: "13.77977666" (String) → แปลงเป็น double  
- `shop_longitude`: "100.56039333" (String) → แปลงเป็น double
- `pickup_fee`: "100.00" (String) → แปลงเป็น int
- `delivery_fee`: "100.00" (String) → แปลงเป็น int
- `deposit_amount`: "1000.00" (String) → แปลงเป็น int

**การแก้ไข:**
ใช้ `int.tryParse()` และ `double.tryParse()` ใน `CarItem.fromApi()` method:

```dart
int pricePerDay = int.tryParse(data['price']?.toString() ?? '0') ?? 0;
double latitude = double.tryParse(data['shop_latitude']?.toString() ?? '0') ?? 0.0;
```

**ไฟล์ที่แก้ไข:**
- `lib/widgets/car_card.dart` - อัปเดต CarItem model และ fromApi method
- `lib/screens/data_conversion_test_screen.dart` - หน้าจอทดสอบการแปลงข้อมูล

### 2. รัน Flutter App
```bash
cd drivedi_mobile
flutter run
```

### 3. ทดสอบการเชื่อมต่อ
- เปิดหน้า "Available Cars" เพื่อดูข้อมูลรถยนต์จาก API
- หรือเปิดหน้า "API Test" เพื่อทดสอบการเชื่อมต่อโดยตรง

## API Endpoints ที่ใช้

### GET `/api/cars`
ดึงข้อมูลรถยนต์ทั้งหมดที่ได้รับการอนุมัติ
```json
{
  "id": 1,
  "brand": "Toyota",
  "model": "Camry",
  "year": 2020,
  "price": 1500,
  "status": "approved",
  "images": ["http://localhost:3001/uploads/cars/image1.jpg"],
  "owner_name": "John Doe"
}
```

### GET `/api/cars/:carId`
ดึงข้อมูลรถยนต์ตาม ID พร้อมรายละเอียดครบถ้วน

## การจัดการ Error
- แสดง loading indicator ขณะดึงข้อมูล
- แสดง error message เมื่อเกิดข้อผิดพลาด
- ปุ่ม "ลองใหม่" สำหรับ retry
- แสดงข้อความเมื่อไม่มีข้อมูลรถยนต์

## การปรับแต่งเพิ่มเติม

### เปลี่ยน Base URL
แก้ไขใน `car_service.dart`:
```dart
static const String baseUrl = 'http://your-server-url:port';
```

### เพิ่ม Authentication
เพิ่ม headers สำหรับ authentication:
```dart
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer $token',
}
```

### เพิ่ม Error Handling
สามารถเพิ่ม retry logic หรือ fallback data ได้ใน `_loadCars()` method

## หมายเหตุ
- ต้องแน่ใจว่า API server รันอยู่ก่อนเปิด Flutter app
- ตรวจสอบ network permissions ใน Android/iOS
- สำหรับ production ควรใช้ HTTPS แทน HTTP
