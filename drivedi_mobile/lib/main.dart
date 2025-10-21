import 'package:flutter/material.dart';
import 'widgets/main_navigation.dart';
import 'screens/welcome_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  // เพิ่มการตั้งค่า image cache
  WidgetsFlutterBinding.ensureInitialized();
  
  // เพิ่มขนาด cache สำหรับภาพ
  PaintingBinding.instance.imageCache.maximumSize = 500; // เพิ่มจำนวนภาพที่ cache
  PaintingBinding.instance.imageCache.maximumSizeBytes = 200 << 20; // 200MB
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DriveDi Mobile',
      theme: ThemeData(
        useMaterial3: true,
        textTheme: GoogleFonts.promptTextTheme(),   // ทั้งแอปใช้ Prompt
      ),
      home: const AppInitializer(),
      debugShowCheckedModeBanner: false,
      scrollBehavior: const MaterialScrollBehavior().copyWith(overscroll: false),
      // เพิ่ม builder เพื่อ wrap ด้วย RepaintBoundary
      builder: (context, child) {
        return RepaintBoundary(
          child: child!,
        );
      },
    );
  }
}

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Preload ภาพสำคัญๆ ก่อน
    try {
      await Future.wait([
        precacheImage(const AssetImage('assets/images/bg_1.JPG'), context),
        precacheImage(const AssetImage('assets/images/wellcome_screen.png'), context),
      ]);
    } catch (e) {
      // ถ้า preload ไม่ได้ ให้ข้ามไป
    }
    
    // จำลองการโหลดข้อมูลแอป (เช่น API calls, etc.)
    await Future.delayed(const Duration(milliseconds: 1000));
    
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const WelcomeScreen();
    }
    
    return const MainNavigationScreen();
  }
}
