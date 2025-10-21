import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'notification_screen.dart';
import 'language_screen.dart';
import 'login_screen.dart';
import 'resgister_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // ✅ พื้นหลัง: ฟ้า 3 ส่วน + ขาว 1 ส่วน
Column(
  children: [
    Expanded(
      flex: 4,
      child: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/bg_city.png'), // ✅ รูปพื้นหลังใหม่
            fit: BoxFit.cover, // ให้พอดีกับพื้นที่
            alignment: Alignment.topCenter, // จัดตำแหน่งด้านบน
          ),
        ),
      ),
    ),
    Expanded(flex: 1, child: Container(color: Colors.white)),
  ],
),


          // ✅ โลโก้ + DRIVEDI + สโลแกน = หน่วยเดียวกัน (โลโก้ "ติด" DRIVEDI)
          Positioned(
            top: 80, // ปรับได้ตามต้องการ
            left: 0,
            right: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // โลโก้
                Image.asset(
                  'assets/images/logoDD.png',
                  width: 130, // ใช้ค่าคงที่ (ไม่สร้างตัวแปร)
                  fit: BoxFit.contain,
                ),

                // DRIVEDI — ดึงขึ้นให้ "ติด" โลโก้จริง ๆ
                Transform.translate(
                  offset: const Offset(0, -35), // ค่าคงที่
                  child: const Text(
                    'DRIVEDI',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,          // ค่าคงที่
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.0,
                      height: 1.0,           // บีบ line-height ให้แนบมากขึ้น
                    ),
                  ),
                ),

                // สโลแกน
                const Text(
                  'เพื่อนแทนทุกการเดินทาง',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,            // ค่าคงที่
                    fontWeight: FontWeight.w600,
                    height: 1.1,
                  ),
                ),
              ],
            ),
          ),

          // คงไว้ตามเดิม (ไม่ลบอะไรออก)
          Align(
            alignment: const Alignment(0, 0.55),
            child: Image.asset(
              'assets/images/logo.png',
              width: 340,
              fit: BoxFit.contain,
            ),
          ),

          // ✅ ปุ่ม + สมัครฟรี
          Align(
            alignment: const Alignment(0, 0.90),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
SizedBox(
  width: 400,
  height: 50,
  child: ElevatedButton(
    style: ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF0073FF),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
    onPressed: () {
      // ✅ กดแล้วไปหน้า Login
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    },
    child: const Text(
      'เข้าสู่ระบบ',
      style: TextStyle(
        color: Colors.white,
        fontSize: 16,
        fontWeight: FontWeight.w500,
      ),
    ),
  ),
),

                const SizedBox(height: 35),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'ยังไม่เคยเป็นสมาชิก ',
                      style: TextStyle(color: Colors.black, fontSize: 16,
                      fontWeight: FontWeight.w500),
                    ),
                    GestureDetector(
                      onTap: () {
                              Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const ResgisterScreen()),
      );
                      },
                      child: const Text(
                        'สมัครฟรี!',
                        style: TextStyle(
                          color: Color(0xFF0073FF),
                          fontWeight: FontWeight.w500,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ✅ Header ด้านบน (ปุ่ม notification + ภาษา)
          Positioned(
            top: 55,
            left: 0,
            right: 0,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const NotificationScreen()),
                    ),
                    child: const Icon(Remix.notification_3_line, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const LanguageScreen()),
                    ),
                    child: const Icon(Remix.global_line, color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
