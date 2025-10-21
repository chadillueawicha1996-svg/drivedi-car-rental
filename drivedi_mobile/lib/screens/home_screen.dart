import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'notification_screen.dart';
import 'language_screen.dart';
import 'welcome_screen.dart';
import '../widgets/search_rental_panel.dart'; // 👈 นำเข้าไฟล์ที่แยกไว้

class HomeScreen extends StatefulWidget {
  final Function(bool)? onLoadingChanged;
  
  const HomeScreen({super.key, this.onLoadingChanged});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with AutomaticKeepAliveClientMixin {
  // Loading state
  bool _isLoading = true;
  
  // Static cached image เพื่อไม่ให้โหลดใหม่
  static Image? _cachedBackgroundImage;

  @override
  bool get wantKeepAlive => true; // ให้ Flutter เก็บ widget ไว้ในหน่วยความจำ

  @override
  void initState() {
    super.initState();
    _preloadImageAndSimulateLoading();
  }

  Future<void> _preloadImageAndSimulateLoading() async {
    // สร้าง cached image ครั้งเดียวเท่านั้น
    _cachedBackgroundImage ??= Image.asset(
        'assets/images/bg_1.JPG',
        fit: BoxFit.cover,
      );
    
    // จำลองการโหลดข้อมูลอื่นๆ (เช่น API calls, etc.)
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      
      // แจ้งให้ MainNavigationScreen รู้ว่าโหลดเสร็จแล้ว
      widget.onLoadingChanged?.call(false);
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // จำเป็นสำหรับ AutomaticKeepAliveClientMixin
    
    // แสดง Welcome Screen ขณะโหลด
    if (_isLoading) {
      return const Scaffold(
        body: WelcomeScreen(),
      );
    }
    
    return Scaffold(
      body: Stack(
        children: [
          // พื้นหลังรูป - ใช้ cached image
          Positioned.fill(
            child: _cachedBackgroundImage ?? Image.asset(
              'assets/images/bg_1.JPG',
              fit: BoxFit.cover,
            ),
          ),
          // Gradient ทับรูป
          Positioned.fill(
            child: RepaintBoundary(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      const Color(0xFF0050B4).withOpacity(1.0),
                      const Color(0xFF0073FF).withOpacity(0.55),
                      const Color(0xFF0073FF).withOpacity(0.0),
                    ],
                    stops: const [0.0, 0.55, 1.0],
                  ),
                ),
              ),
            ),
          ),

          // Header
          Positioned(
            top: 55,
            left: 0,
            right: 0,
            child: RepaintBoundary(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.directions_car_filled, color: Colors.white),
                        SizedBox(width: 8),
                        Text('DRIVEDI',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 20)),
                      ],
                    ),
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const NotificationScreen()),
                          ),
                          child: const Icon(Remix.notification_3_line,
                              color: Colors.white),
                        ),
                        const SizedBox(width: 12),
                        GestureDetector(
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const LanguageScreen()),
                          ),
                          child: const Icon(Remix.global_line,
                              color: Colors.white),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ข้อความหัว
          Positioned(
            top: 140,
            left: 0,
            right: 0,
            child: RepaintBoundary(
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start, // ชิดซ้าย
                  children: [
                    Text('หารถเช่าเดินทางกัน!',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w700)),
                    SizedBox(height: 6),
                    Text('ค้นหาสถานที่ด้านล่างได้เลย',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w400)),
                            
                  ],
                ),
              ),
            ),
          ),

          // แผงค้นหาลอยด้านล่าง
          Positioned(
            left: 16,
            right: 16,
            bottom: 250,
            child: RepaintBoundary(
              child: Container(
                padding: const EdgeInsets.all(2.2),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                ),
                child: Padding(
                  padding: EdgeInsets.all(2), // ขอบสีฟ้า
                  child: SearchRentalPanel(
                    initialPickup: DateTime.now().add(const Duration(hours: 1)),
                    initialDrop: DateTime.now().add(const Duration(days: 2, hours: 1)),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
