import 'package:flutter/material.dart';
import '../widgets/car_card.dart';

/// หน้าจอทดสอบการแปลงข้อมูลจาก API
class DataConversionTestScreen extends StatefulWidget {
  const DataConversionTestScreen({super.key});

  @override
  State<DataConversionTestScreen> createState() => _DataConversionTestScreenState();
}

class _DataConversionTestScreenState extends State<DataConversionTestScreen> {
  String _testResult = '';
  bool _isLoading = false;

  void _testDataConversion() {
    setState(() {
      _isLoading = true;
      _testResult = '';
    });

    try {
      // ข้อมูลตัวอย่างจาก API
      final Map<String, dynamic> testData = {
        "id": 10,
        "user_id": 14,
        "brand": "HONDA",
        "model": "Civic FE",
        "sub_model": "RS",
        "year": 2025,
        "color": "ขาว",
        "plate_number": "7434",
        "car_type": "sedan",
        "transmission": "cvt",
        "seats": 4,
        "fuel_type": "gasoline",
        "engine_size": "2.0",
        "doors": 2,
        "luggage": 1,
        "price": "2000.00",
        "price_type": "per_day",
        "pickup_area": "s",
        "shop_location": "ไม่ระบุ",
        "shop_latitude": "13.77977666",
        "shop_longitude": "100.56039333",
        "after_hours_service": "ไม่ระบุ",
        "normal_hours": "ไม่ระบุ",
        "insurance": 1,
        "roadside_assistance": 1,
        "free_cancellation": 1,
        "unlimited_mileage": 1,
        "unlimited_route": 1,
        "status": "approved",
        "owner_name": "Admin",
        "images": [
          "http://localhost:3001/uploads/cars/car-1754078024343-865054316.jpg",
          "http://localhost:3001/uploads/cars/car-1754084180560-69261301.JPG"
        ],
        "pickup_fee": "100.00",
        "delivery_fee": "100.00",
        "deposit_amount": "1000.00"
      };

      // ทดสอบการแปลงข้อมูล
      final car = CarItem.fromApi(testData, days: 2);
      
      setState(() {
        _testResult = '''
✅ การแปลงข้อมูลสำเร็จ!

ข้อมูลรถยนต์:
- ID: ${car.id}
- ชื่อ: ${car.title}
- ราคาต่อวัน: ฿${car.pricePerDay}
- ราคารวม (2 วัน): ฿${car.totalPrice}
- ประตู: ${car.doors}
- ที่นั่ง: ${car.seats}
- ประกัน: ${car.insurance}
- ละติจูด: ${car.shopLatitude}
- ลองจิจูด: ${car.shopLongitude}
- ค่าส่ง: ฿${car.pickupFee}
- ค่าจัดส่ง: ฿${car.deliveryFee}
- เงินมัดจำ: ฿${car.depositAmount}
- จำนวนรูป: ${car.images.length}
- แท็ก: ${car.tags.join(', ')}

การแปลงข้อมูลทำงานได้ถูกต้อง!
        ''';
      });
    } catch (e) {
      setState(() {
        _testResult = '❌ เกิดข้อผิดพลาด: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ทดสอบการแปลงข้อมูล'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'ทดสอบการแปลงข้อมูลจาก API เป็น CarItem',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            ElevatedButton(
              onPressed: _isLoading ? null : _testDataConversion,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: _isLoading 
                ? const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      ),
                      SizedBox(width: 10),
                      Text('กำลังทดสอบ...'),
                    ],
                  )
                : const Text('ทดสอบการแปลงข้อมูล'),
            ),
            
            const SizedBox(height: 20),
            
            if (_testResult.isNotEmpty)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _testResult.contains('✅') 
                        ? Colors.green.shade50 
                        : Colors.red.shade50,
                    border: Border.all(
                      color: _testResult.contains('✅') 
                          ? Colors.green.shade200 
                          : Colors.red.shade200,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      _testResult,
                      style: TextStyle(
                        color: _testResult.contains('✅') 
                            ? Colors.green.shade700 
                            : Colors.red.shade700,
                        fontSize: 14,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
