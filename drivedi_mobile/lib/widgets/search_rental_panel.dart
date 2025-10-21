import 'package:flutter/material.dart';
import 'date_range_picker_page.dart';
import '../screens/available_cars_screen.dart';
import '../screens/pickup_location_screen.dart';
import '../screens/car_type_selection_screen.dart'; // ✅ เพิ่ม import หน้าประเภทรถ
import 'package:remixicon/remixicon.dart';

class SearchRentalPanel extends StatefulWidget {
  final DateTime initialPickup;
  final DateTime initialDrop;
  final void Function(DateTime pickup, DateTime drop)? onChanged;

  const SearchRentalPanel({
    super.key,
    required this.initialPickup,
    required this.initialDrop,
    this.onChanged,
  });

  @override
  State<SearchRentalPanel> createState() => _SearchRentalPanelState();
}

class _SearchRentalPanelState extends State<SearchRentalPanel> {
  late DateTime _pickup;
  late DateTime _drop;
  String _pickupLocation = 'สนามบินดอนเมือง';
  String _carType = 'รถเก๋ง'; // ✅ เพิ่ม state สำหรับประเภทรถ

  @override
  void initState() {
    super.initState();
    _pickup = widget.initialPickup;
    _drop = widget.initialDrop;
  }

  void _update(DateTime p, DateTime d) {
    setState(() {
      _pickup = p;
      _drop = d;
    });
    widget.onChanged?.call(_pickup, _drop);
  }

  final Color blue = const Color(0xFF1677FF);
  final Color lightBlue = const Color(0xFF5AA9FF);
  final Color chipBg = const Color(0xFFF0F3F9);

  String _two(int n) => n.toString().padLeft(2, '0');
  String _dateStr(DateTime dt) =>
      '${_two(dt.day)}/${_two(dt.month)}/${dt.year}';
  String _timeStr(DateTime dt) =>
      '${_two(dt.hour)}:${_two(dt.minute)} น.';

  /// 🔹 เปิดหน้าเลือกวัน–เวลา
  Future<void> _openCalendarPage() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => DateRangePickerPage(
          initialPickup: _pickup,
          initialDrop: _drop,
        ),
      ),
    );

    if (result is Map<String, DateTime>) {
      final newPickup = result['pickup']!;
      final newDrop = result['drop']!;
      _update(newPickup, newDrop);
    }
  }

  /// 🔹 เปิดหน้าเลือกจุดรับรถ
  Future<void> _selectPickupLocation() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const PickupLocationScreen()),
    );

    if (result != null && result.isNotEmpty) {
      setState(() => _pickupLocation = result);
    }
  }

  /// 🔹 เปิดหน้าเลือกประเภทรถ (mock)
  Future<void> _selectCarType() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const CarTypeSelectionScreen()),
    );

    if (result != null && result.isNotEmpty) {
      setState(() => _carType = result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // ✅ จุดรับรถ
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: _selectPickupLocation,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                  color: chipBg, borderRadius: BorderRadius.circular(12)),
              child: Row(
                children: [
                  Expanded(
                    child: _InfoCell(
                      icon: Icons.location_on_outlined,
                      title: 'จุดรับรถ',
                      value: _pickupLocation,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          // ✅ วัน–เวลารับ/คืน
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: _openCalendarPage,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                  color: chipBg, borderRadius: BorderRadius.circular(12)),
              child: Row(
                children: [
                  Expanded(
                    child: _DateCell(
                      title: 'วัน–เวลารับรถ',
                      date: _dateStr(_pickup),
                      time: _timeStr(_pickup),
                    ),
                  ),
                  SizedBox(
                    width: 58,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color:
                                const Color.fromARGB(255, 248, 248, 248),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.amber, width: 1),
                          ),
                          child: const Icon(Remix.arrow_right_long_line,
                              size: 20, color: Colors.blue),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 1),
                  Expanded(
                    child: _DateCell(
                      title: 'วัน–เวลาคืนรถ',
                      date: _dateStr(_drop),
                      time: _timeStr(_drop),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          // ✅ ประเภทรถ (กดได้)
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: _selectCarType,
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                  color: chipBg, borderRadius: BorderRadius.circular(12)),
              child: Row(
                children: [
                  Expanded(
                    child: _InfoCell(
                      icon: Icons.directions_car,
                      title: 'ประเภทรถ',
                      value: _carType,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          // ✅ ปุ่มค้นหา
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => AvailableCarsScreen(
                    initialPickup: _pickup,
                    initialDrop: _drop,
                    pickupLocation: _pickupLocation,
                  ),
                ),
              );
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [lightBlue.withOpacity(1), blue],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text('ค้นหารถว่าง',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w500)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// ---------- Date Cell ----------
class _DateCell extends StatelessWidget {
  final String title;
  final String date;
  final String time;

  const _DateCell({
    required this.title,
    required this.date,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    const grey = Color(0xFF7C8592);
    const textDark = Color(0xFF1F2937);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.calendar_month_outlined, color: grey, size: 18),
            const SizedBox(width: 6),
            Text(title,
                style: const TextStyle(
                    fontSize: 12,
                    color: grey,
                    fontWeight: FontWeight.w500,
                    height: 1.1)),
          ],
        ),
        const SizedBox(height: 6),
        Text(date,
            style: const TextStyle(
                fontSize: 15,
                color: textDark,
                fontWeight: FontWeight.w500,
                height: 1.1)),
        const SizedBox(height: 6),
        Text(time,
            style: const TextStyle(
                fontSize: 15,
                color: textDark,
                fontWeight: FontWeight.w500,
                height: 1.0)),
      ],
    );
  }
}

/// ---------- Info Cell ----------
class _InfoCell extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _InfoCell({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    const grey = Color(0xFF7C8592);
    const textDark = Color(0xFF1F2937);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: grey, size: 18),
            const SizedBox(width: 6),
            Text(title,
                style: const TextStyle(
                    fontSize: 12,
                    color: grey,
                    fontWeight: FontWeight.w500,
                    height: 1.1)),
          ],
        ),
        const SizedBox(height: 6),
        Text(value,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
                fontSize: 15,
                color: textDark,
                fontWeight: FontWeight.w500,
                height: 1.1)),
      ],
    );
  }
}
