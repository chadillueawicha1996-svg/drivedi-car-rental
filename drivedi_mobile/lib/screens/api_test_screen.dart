import 'package:flutter/material.dart';
import '../services/car_service.dart';

/// หน้าจอทดสอบการเชื่อมต่อ API
class ApiTestScreen extends StatefulWidget {
  const ApiTestScreen({super.key});

  @override
  State<ApiTestScreen> createState() => _ApiTestScreenState();
}

class _ApiTestScreenState extends State<ApiTestScreen> {
  bool _isLoading = false;
  String _result = '';
  String _error = '';

  Future<void> _testGetAllCars() async {
    setState(() {
      _isLoading = true;
      _error = '';
      _result = '';
    });

    try {
      final cars = await CarService.getAllCars();
      setState(() {
        _result = '✅ ดึงข้อมูลรถยนต์สำเร็จ!\n\nจำนวนรถ: ${cars.length}\n\n';
        for (int i = 0; i < cars.length && i < 3; i++) {
          final car = cars[i];
          _result += 'รถที่ ${i + 1}:\n';
          _result += '- ID: ${car['id']}\n';
          _result += '- ยี่ห้อ: ${car['brand']}\n';
          _result += '- รุ่น: ${car['model']}\n';
          _result += '- ปี: ${car['year']}\n';
          _result += '- ราคา: ฿${car['price']}\n';
          _result += '- สถานะ: ${car['status']}\n\n';
        }
        if (cars.length > 3) {
          _result += '... และอีก ${cars.length - 3} คัน\n';
        }
      });
    } catch (e) {
      setState(() {
        _error = '❌ เกิดข้อผิดพลาด: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _testGetCarById() async {
    setState(() {
      _isLoading = true;
      _error = '';
      _result = '';
    });

    try {
      // ทดสอบดึงรถคันแรก
      final cars = await CarService.getAllCars();
      if (cars.isNotEmpty) {
        final carId = cars[0]['id'];
        final car = await CarService.getCarById(carId);
        
        setState(() {
          _result = '✅ ดึงข้อมูลรถยนต์ตาม ID สำเร็จ!\n\n';
          _result += 'ID: ${car['id']}\n';
          _result += 'ยี่ห้อ: ${car['brand']}\n';
          _result += 'รุ่น: ${car['model']}\n';
          _result += 'ปี: ${car['year']}\n';
          _result += 'สี: ${car['color']}\n';
          _result += 'ทะเบียน: ${car['plate_number']}\n';
          _result += 'ราคา: ฿${car['price']}\n';
          _result += 'เจ้าของ: ${car['owner_name']}\n';
          _result += 'รูปภาพ: ${car['images']?.length ?? 0} รูป\n';
        });
      } else {
        setState(() {
          _error = '❌ ไม่มีข้อมูลรถยนต์ในระบบ';
        });
      }
    } catch (e) {
      setState(() {
        _error = '❌ เกิดข้อผิดพลาด: $e';
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
        title: const Text('ทดสอบ API'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'ทดสอบการเชื่อมต่อ API',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetAllCars,
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
                      Text('กำลังโหลด...'),
                    ],
                  )
                : const Text('ทดสอบดึงข้อมูลรถยนต์ทั้งหมด'),
            ),
            
            const SizedBox(height: 10),
            
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetCarById,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('ทดสอบดึงข้อมูลรถยนต์ตาม ID'),
            ),
            
            const SizedBox(height: 20),
            
            if (_error.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  border: Border.all(color: Colors.red.shade200),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _error,
                  style: TextStyle(
                    color: Colors.red.shade700,
                    fontSize: 14,
                  ),
                ),
              ),
            
            if (_result.isNotEmpty)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    border: Border.all(color: Colors.green.shade200),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      _result,
                      style: TextStyle(
                        color: Colors.green.shade700,
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
