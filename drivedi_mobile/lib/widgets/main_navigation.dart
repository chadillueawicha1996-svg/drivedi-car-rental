import 'package:flutter/material.dart';
import '../screens/home_screen.dart';
import '../screens/promotions_screen.dart';
import '../screens/rentals_screen.dart';
import '../screens/profile_screen.dart';
import 'package:remixicon/remixicon.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  bool _isHomeLoading = true;

  // Cache screens ไว้เพื่อไม่ให้สร้างใหม่ทุกครั้ง
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    // สร้าง screens ครั้งเดียวและ cache ไว้
    _screens = [
      HomeScreen(
        onLoadingChanged: (isLoading) {
          setState(() {
            _isHomeLoading = isLoading;
          });
        },
      ),
      const PromotionsScreen(),
      const MapScreen(),
      const ProfileScreen(),
    ];
  }

  final List<BottomNavigationBarItem> _navigationItems = const [
    BottomNavigationBarItem(
      icon: Icon(Remix.home_5_line),
      activeIcon: Icon(Remix.home_5_fill),
      label: 'ค้นหารถเช่า',
    ),
    BottomNavigationBarItem(
      icon: Icon(Remix.gift_2_line),
      activeIcon: Icon(Remix.gift_2_fill),
      label: 'โปรโมชั่น',
    ),
    BottomNavigationBarItem(
      icon: Icon(Remix.roadster_line),
      activeIcon: Icon(Remix.roadster_fill),
      label: 'เช่ารถของฉัน',
    ),
    BottomNavigationBarItem(
      icon: Icon(Remix.user_3_line),
      activeIcon: Icon(Remix.user_3_fill),
      label: 'บัญชี',
    ),
  ];

  void _onTapNav(int index) {
    if (index == _currentIndex) return;
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens, // ใช้ screens ที่ cache ไว้แล้ว
      ),
      // ซ่อน bottom navigation bar เมื่อ HomeScreen กำลังโหลด
      bottomNavigationBar: (_isHomeLoading && _currentIndex == 0) 
          ? null 
          : Container(
              decoration: BoxDecoration(
                color: Colors.white, // ✅ พื้นหลัง nav สีขาว
                border: const Border(
                  top: BorderSide(
                    color: Color(0xFFE0E0E0), // ✅ เส้นสีเทาบางด้านบน
                    width: 0.5,
                  ),
                ),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(
                  splashFactory: NoSplash.splashFactory, // ❌ ปิด ripple effect
                  highlightColor: Colors.transparent,
                  splashColor: Colors.transparent,
                ),
                child: BottomNavigationBar(
                  type: BottomNavigationBarType.fixed,
                  backgroundColor: Colors.transparent, // ✅ ใช้สีจาก Container แทน
                  currentIndex: _currentIndex,
                  onTap: _onTapNav,
                  items: _navigationItems,
                  selectedItemColor: const Color(0xFF0073FF), // ✅ สีฟ้าเมื่อถูกเลือก
                  unselectedItemColor: Colors.grey.shade600,
                  selectedFontSize: 11,
                  unselectedFontSize: 11,
                  showUnselectedLabels: true,
                  elevation: 0, // ❌ ปิดเงา เพราะเรามีเส้นบนแทน
                ),
              ),
            ),
    );
  }
}
