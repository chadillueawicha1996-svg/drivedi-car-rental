import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'การแจ้งเตือน',
          style: TextStyle(
            color: Color.fromARGB(255, 26, 26, 26),
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
        backgroundColor: Colors.white,
        centerTitle: true, // 🩶 ให้หัวเรื่องอยู่ตรงกลาง (สวยขึ้น)
        elevation: 0, // ปิดเงา AppBar เดิม
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1), // ความสูงของเส้น
          child: Container(
            color: Colors.grey.shade300, // 🎨 สีเส้นใต้หัวเรื่อง
            height: 1,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: const Center(
        child: Text(
          'หน้านี้คือหน้าแจ้งเตือน 🔔',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
