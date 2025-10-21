import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';

class CarTypeSelectionScreen extends StatelessWidget {
  const CarTypeSelectionScreen({super.key, this.initialSelected = ''});

  /// ประเภทรถที่ถูกเลือกไว้ก่อนหน้า -> ใช้โชว์ติ๊กถูก
  final String initialSelected;

  static const _items = <_CarTypeItem>[
    _CarTypeItem(label: 'รถเก๋ง', icon: Remix.roadster_line),
    _CarTypeItem(label: 'รถ SUV', icon: Remix.truck_line),
    _CarTypeItem(label: 'รถตู้', icon: Remix.bus_line),
    _CarTypeItem(label: 'รถปิคอัพ', icon: Remix.truck_line),
    _CarTypeItem(label: 'รถมอเตอร์ไซค์', icon: Remix.motorbike_line), // ✅ เพิ่มมอเตอร์ไซค์
  ];

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF1677FF);

    return Scaffold(
      backgroundColor: Colors.white,
appBar: AppBar(
  title: const Text(
    'เลือกประเภทรถ',
    style: TextStyle(color: Color(0xFF1A1A1A), fontWeight: FontWeight.w600, fontSize: 16),
  ),
  backgroundColor: Colors.white,
  centerTitle: true,
  elevation: 0,
  // 🔒 ปิดอาการเปลี่ยนสีเวลาเลื่อน (M3)
  scrolledUnderElevation: 0,                // ปิดเงา/ยกพื้นตอนมีสกอลล์คร่อม AppBar
  surfaceTintColor: Colors.transparent,     // ปิดทับสีพื้นผิว
  iconTheme: const IconThemeData(color: Colors.black87),
),

      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 24),
        itemCount: _items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 5), // ❌ ไม่มี Divider เส้นกรอบ
        itemBuilder: (context, i) {
          final item = _items[i];
          final isPrevSelected = item.label == initialSelected;

          return InkWell(
            borderRadius: BorderRadius.circular(6),
            onTap: () => Navigator.pop(context, item.label),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              child: Row(
                children: [
                  Icon(item.icon, size: 22, color: const Color.fromARGB(255, 125, 125, 125)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      item.label,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color.fromARGB(255, 0, 0, 0),
                        fontWeight: FontWeight.w500,
                        height: 1.2,
                      ),
                    ),
                  ),
                  // ✅ ติ๊กถูกเฉพาะ “ตัวที่เลือกไว้ก่อนหน้า”
                  if (isPrevSelected)
                    const Icon(Remix.check_line, size: 20, color: blue),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _CarTypeItem {
  final String label;
  final IconData icon;
  const _CarTypeItem({required this.label, required this.icon});
}
