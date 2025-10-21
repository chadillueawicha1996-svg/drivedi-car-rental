import 'package:flutter/material.dart';

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // ค่า mockup: เลือก "ไทย" ไว้
    const currentSelected = 'ไทย';
    final dividerColor = Colors.grey.shade300;

    final languages = [
      'ไทย',
      'English',
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA), // พื้นหลังเทาอ่อน
      appBar: AppBar(
        title: const Text(
          'ภาษา',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: dividerColor),
        ),
        iconTheme: const IconThemeData(color: Colors.black),
        actions: const [
          Icon(Icons.save_outlined, color: Colors.black26),
          SizedBox(width: 6),
          Padding(
            padding: EdgeInsets.only(right: 10),
            child: Center(
              child: Text(
                'บันทึก',
                style: TextStyle(
                  color: Colors.black26, // โทนอ่อน = เหมือนปิดการใช้งาน
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          // กล่องภาษาขาวมุมโค้ง
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                for (int i = 0; i < languages.length; i++)
                  ListTile(
                    
                    title: Text(
                      languages[i],
                      style: const TextStyle(fontSize: 17, color: Colors.black87),
                    ),
                    trailing: languages[i] == currentSelected
                        ? const Icon(Icons.check, color: Color(0xFF1E88E5))
                        : const SizedBox.shrink(),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
