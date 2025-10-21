import 'package:flutter/material.dart';
import 'notification_screen.dart';
import 'language_screen.dart';
import 'package:remixicon/remixicon.dart';



class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF1677FF);

    const tabs = [
      'ทั้งหมด',
      'โปรโมชั่นรถเช่า',
      'คูปองส่วนลด',
      'ข่าวสารทั่วไป',
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        backgroundColor: Colors.white,

        // ---------------- Header ----------------
        appBar: AppBar(
          toolbarHeight: 44,
          backgroundColor: Colors.white,
          elevation: 0,
          leadingWidth: 0,
          titleSpacing: 0,
          title: const Padding(
            padding: EdgeInsets.only(left: 16.0),
            child: Text(
              'การจองรถของฉัน',
              style: TextStyle(
                color: Color(0xFF111827),
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 10),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                    visualDensity: const VisualDensity(horizontal: -4, vertical: -4),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const NotificationScreen()),
                      );
                    },
                    icon: const Icon(Remix.notification_3_line, color: Color(0xFF111827)),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                    visualDensity: const VisualDensity(horizontal: -4, vertical: -4),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LanguageScreen()),
                      );
                    },
                    icon: const Icon(Remix.global_line, color: Color(0xFF111827)),
                  ),
                ],
              ),
            ),
          ],

          // ---------------- เมนู (สัดส่วนตามข้อความ) + เส้นแบ่งบน/ล่าง + 'V' ท้ายแถบ ----------------
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(56),
            child: Container(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 8), // บน=ล่าง เท่ากัน
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(
                  top: BorderSide(color: Color(0xFFE5E7EB), width: 1),
                  bottom: BorderSide(color: Color(0xFFE5E7EB), width: 1),
                ),
              ),
              child: _ProportionalTabs(
                labels: tabs,
                selectedColor: blue,
                unselectedColor: const Color(0xFF6B7280),
              ),
            ),
          ),
        ),

        // ---------------- เนื้อหาแต่ละแท็บ ----------------
        body: TabBarView(
          physics: const NeverScrollableScrollPhysics(), // ปิดการเลื่อนซ้ายขวา
          children: tabs.map((label) {
            return Center(
              child: Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF111827),
                  fontWeight: FontWeight.w600,
                  fontSize: 24,
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

/// เมนูแบบกำหนดความกว้างตามข้อความ (ไม่ใช้ TabBar)
class _ProportionalTabs extends StatefulWidget {
  final List<String> labels;
  final Color selectedColor;
  final Color unselectedColor;

  const _ProportionalTabs({
   
    required this.labels,
    required this.selectedColor,
    required this.unselectedColor,
  });

  @override
  State<_ProportionalTabs> createState() => _ProportionalTabsState();
}
class _ProportionalTabsState extends State<_ProportionalTabs> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: widget.labels.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(widget.labels.length, (index) {
        final bool isSelected = _tabController.index == index;
        return Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                _tabController.index = index;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isSelected ? widget.selectedColor : Colors.transparent,
                    width: 2,
                  ),
                ),
              ),
              child: Center(
                child: Text(
                  widget.labels[index],
                  style: TextStyle(
                    color: isSelected ? widget.selectedColor : widget.unselectedColor,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}
