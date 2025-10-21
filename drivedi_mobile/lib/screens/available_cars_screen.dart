import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import '../widgets/search_rental_panel.dart';
import '../widgets/car_card.dart';
import '../widgets/quick_actions_bar.dart';
import '../services/car_service.dart';
import 'car_detail_screen.dart';

class AvailableCarsScreen extends StatefulWidget {
  final DateTime initialPickup;
  final DateTime initialDrop;
  final String pickupLocation;

  const AvailableCarsScreen({
    super.key,
    required this.initialPickup,
    required this.initialDrop,
    required this.pickupLocation,
  });

  @override
  State<AvailableCarsScreen> createState() => _AvailableCarsScreenState();
}

class _AvailableCarsScreenState extends State<AvailableCarsScreen> {
  final Color blue = const Color(0xFF0073FF);
  final Color lightGrey = const Color(0xFFF5F5F5);

  late DateTime _start;
  late DateTime _end;
  late String _pickupLocation;
  
  // ข้อมูลรถยนต์จาก API
  List<CarItem> _cars = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _start = widget.initialPickup;
    _end = widget.initialDrop;
    _pickupLocation = widget.pickupLocation;
    _loadCars();
  }

  /// ดึงข้อมูลรถยนต์จาก API
  Future<void> _loadCars() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final carsData = await CarService.getAllCars();
      final days = _end.difference(_start).inDays + 1;
      
      final cars = carsData.map((data) => CarItem.fromApi(data, days: days)).toList();
      
      setState(() {
        _cars = cars;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  String _headerRangeText(DateTime s, DateTime e) {
    String f(DateTime d) =>
        '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year.toString().substring(2)} '
        '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
    return '${f(s)} – ${f(e)}';
  }

  void _openSearchPanel() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.3),
      builder: (context) => FractionallySizedBox(
        heightFactor: 0.4,
        child: SearchRentalPanel(
          initialPickup: _start,
          initialDrop: _end,
          onChanged: (pickup, drop) {
            setState(() {
              _start = pickup;
              _end = drop;
            });
            // โหลดข้อมูลรถใหม่เมื่อเปลี่ยนวันที่
            _loadCars();
          },
        ),
      ),
    );
  }

  /// สร้าง UI สำหรับแสดงรายการรถยนต์
  Widget _buildCarList() {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text(
              'กำลังโหลดข้อมูลรถยนต์...',
              style: TextStyle(fontSize: 16, color: Colors.black54),
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'เกิดข้อผิดพลาด',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadCars,
              child: const Text('ลองใหม่'),
            ),
          ],
        ),
      );
    }

    if (_cars.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.car_rental_outlined,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              'ไม่พบรถยนต์',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black54,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'ไม่มีรถยนต์ว่างในช่วงเวลาที่เลือก',
              style: TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
      itemCount: _cars.length + 1,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        if (index == 0) {
          // 🔹 ส่วนหัวผลการค้นหา
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Text(
                      'ผลการค้นหา: ',
                      style: TextStyle(
                          fontSize: 15,
                          color: Colors.black,
                          fontWeight: FontWeight.w600),
                    ),
                    Text(
                      'รถว่างทั้งหมด',
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.black,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'พบรถว่าง ${_cars.length} คัน',
                  style: const TextStyle(fontSize: 14, color: Colors.black45),
                ),
              ],
            ),
          );
        }

        final car = _cars[index - 1];
        return CarCard(
          car: car,
          onFavorite: () {
            // TODO: เพิ่มฟังก์ชันเพิ่มรถในรายการโปรด
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('เพิ่ม ${car.title} ในรายการโปรด')),
            );
          },
          onShare: () {
            // TODO: เพิ่มฟังก์ชันแชร์รถยนต์
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('แชร์ ${car.title}')),
            );
          },
          onDetail: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => CarDetailScreen(
                  title: car.title,
                  imageUrl: car.imageUrl,
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final String topLine =
        (_pickupLocation.isEmpty) ? 'เลือกจุดรับรถ' : _pickupLocation;

    return Scaffold(
      backgroundColor: lightGrey,
      appBar: AppBar(
        leading: const BackButton(color: Colors.black87),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: InkWell(
          onTap: _openSearchPanel,
          borderRadius: BorderRadius.circular(6),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                topLine,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11,
                  color: Colors.blueAccent,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                _headerRangeText(_start, _end),
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        actions: [
          IconButton(
            tooltip: 'เปิดแผงค้นหารถเช่า',
            onPressed: _openSearchPanel,
            icon: const Icon(Remix.heart_line, color: Colors.black),
          ),
        ],
      ),

      body: Column(
        children: [
          const Divider(height: 1, color: Colors.black12),

          // 🔹 แถบปุ่ม
          QuickActionsBar(
            onHelp: () {},
            onSort: () {},
            onAssistSearch: () {},
          ),

          // 🔹 ใช้ ListView ครอบหัว + รายการรถ (เลื่อนพร้อมกัน)
          Expanded(
            child: _buildCarList(),
          ),
        ],
      ),
    );
  }
}

