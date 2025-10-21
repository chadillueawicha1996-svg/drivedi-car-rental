import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

/// ---------------- App ----------------
class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

/// ---------------- Home (จำเวลาที่เคยเลือกไว้) ----------------
class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late DateTime _pickup;
  late DateTime _drop;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _pickup = DateTime(now.year, now.month, now.day, 10, 0);
    _drop   = DateTime(now.year, now.month, now.day + 2, 12, 0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Demo หน้าหลัก')),
      body: Center(
        child: ElevatedButton(
          child: const Text('เปิด DateRangePicker'),
          onPressed: () async {
            final result = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => DateRangePickerPage(
                  initialPickup: _pickup,
                  initialDrop: _drop,
                ),
              ),
            );
            if (result != null) {
              setState(() {
                _pickup = result['pickup'] as DateTime;
                _drop   = result['drop'] as DateTime;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Pickup: $_pickup\nDrop:   $_drop')),
              );
            }
          },
        ),
      ),
    );
  }
}

/// ---------------- DateRangePicker Page ----------------
class DateRangePickerPage extends StatefulWidget {
  final DateTime initialPickup;
  final DateTime initialDrop;

  const DateRangePickerPage({
    super.key,
    required this.initialPickup,
    required this.initialDrop,
  });

  @override
  State<DateRangePickerPage> createState() => _DateRangePickerPageState();
}

class _DateRangePickerPageState extends State<DateRangePickerPage> {
  // สี/ขนาด
  final Color blue = const Color(0xFF1677FF);
  final Color rangeFill = const Color.fromARGB(255, 179, 227, 255);

  static const double kCellHeight = 44;
  static const double kCircleSize = kCellHeight;

  late DateTime _start;
  late DateTime _end;
  late TimeOfDay _pickupTime;
  late TimeOfDay _dropTime;
  bool _pickStartPhase = true;

  // Anchor ใต้เส้นของแถวเวลา + Overlay
  final LayerLink _timeRowAnchor = LayerLink();
  final GlobalKey _anchorKey = GlobalKey();
  OverlayEntry? _timeOverlay;

  // dropdown state
  static const double _panelHeight = 360;
  bool? _openForPickup; // true=รับรถ, false=ส่งคืน, null=ปิดทั้งหมด

  bool get _isDropdownOpen => _timeOverlay != null;

  @override
  void initState() {
    super.initState();
    _start = _atStartOfDay(widget.initialPickup);
    _end   = _atStartOfDay(widget.initialDrop);
    if (!_end.isAfter(_start)) _end = _start;
    _pickupTime = TimeOfDay(hour: widget.initialPickup.hour, minute: widget.initialPickup.minute);
    _dropTime   = TimeOfDay(hour: widget.initialDrop.hour,   minute: widget.initialDrop.minute);
  }

  @override
  void dispose() {
    _hideDropdown(rebuild: false); // ปิด overlay แบบเงียบตอนออกจากหน้า
    super.dispose();
  }

  DateTime _atStartOfDay(DateTime d) => DateTime(d.year, d.month, d.day);
  String _two(int n) => n.toString().padLeft(2, '0');

  String _thaiMonthShort(int m) {
    const mm = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return mm[m];
  }
  String _thaiMonthFull(int m) {
    const mm = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return mm[m];
  }

  String _headerRangeText(DateTime s, DateTime e) =>
      '${s.day} ${_thaiMonthShort(s.month)} ${s.year} - ${e.day} ${_thaiMonthShort(e.month)} ${e.year}';

  List<DateTime> _monthsToRender() {
    final first = DateTime(DateTime.now().year, DateTime.now().month, 1);
    return List.generate(12, (i) => DateTime(first.year, first.month + i, 1));
  }

  void _onTapDay(DateTime d) {
    final day = _atStartOfDay(d);
    setState(() {
      if (_pickStartPhase) {
        _start = day; _end = day; _pickStartPhase = false;
      } else {
        if (d.isBefore(_start)) { _end = _start; _start = d; }
        else { _end = d; }
        _pickStartPhase = true;
      }
    });
  }

// ---------- เปิด/ปิด (toggle) dropdown ใต้เส้น + overlay ทับปฏิทิน ----------
void _showDropdownUnderLine({required bool forPickup}) {
  // ถ้าเปิดอยู่และเป็นช่องเดิม -> ปิด (toggle)
  if (_isDropdownOpen && _openForPickup == forPickup) {
    _hideDropdown(); // จะ setState ให้ลูกศรลงและปิด overlay
    return;
  }

  // ถ้าเปิดอยู่แต่เป็นอีกช่อง -> ปิดของเดิมก่อนแล้วค่อยเปิดของใหม่
  _hideDropdown();

  // set ช่องที่กำลังเลือก (เพื่อหมุนลูกศร)
  setState(() => _openForPickup = forPickup);

  // Y ของ anchor ใต้เส้น
  final rb = _anchorKey.currentContext!.findRenderObject() as RenderBox;
  final anchorDy = rb.localToGlobal(Offset.zero).dy;

  _timeOverlay = OverlayEntry(
    builder: (_) => _UnderLineTimeDropdown(
      link: _timeRowAnchor,
      blue: blue,
      initial: forPickup ? _pickupTime : _dropTime,
      panelHeight: _panelHeight,
      anchorDy: anchorDy,
      onSelected: (t) {
        setState(() {
          if (forPickup) {
            _pickupTime = t;
          } else {
            _dropTime = t;
          }
        });
        _hideDropdown(); // ปิดแบบปกติ ให้ UI รีเฟรชลูกศรลง
      },
      onDismiss: () => _hideDropdown(),
    ),
  );

  Overlay.of(context, rootOverlay: true).insert(_timeOverlay!);
}


  // ปิด overlay; rebuild=false = ปิดแบบเงียบ (ไม่ setState)
  void _hideDropdown({bool rebuild = true}) {
    _timeOverlay?.remove();
    _timeOverlay = null;

    if (rebuild) {
      if (mounted) {
        setState(() => _openForPickup = null);
      } else {
        _openForPickup = null;
      }
    } else {
      _openForPickup = null;
    }
  }

  /// ปุ่มตกลง รวมผล
  void _submit() {
    final pickup = DateTime(_start.year, _start.month, _start.day, _pickupTime.hour, _pickupTime.minute);
    DateTime drop = DateTime(_end.year, _end.month, _end.day, _dropTime.hour, _dropTime.minute);
    if (!drop.isAfter(pickup)) drop = pickup.add(const Duration(hours: 1));
    if (!mounted) return;
    Navigator.pop(context, {'pickup': pickup, 'drop': drop});
  }

  List<Widget> _buildMonthSlivers({
    required DateTime month,
    required String thaiMonthFull,
    required DateTime start,
    required DateTime end,
    required Color blue,
    required Color rangeFill,
    required Color textColor,
    required void Function(DateTime) onTapDay,
  }) {
    return [
      SliverPersistentHeader(
        pinned: true,
        delegate: _MonthHeaderDelegate(month: month, titleText: '$thaiMonthFull ${month.year}'),
      ),
      SliverToBoxAdapter(
        child: _MonthDaysGrid(
          month: month, start: start, end: end,
          blue: blue, rangeFill: rangeFill, textColor: textColor, onTapDay: onTapDay,
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    const textColor = Color(0xFF0F172A);

    return WillPopScope(
      onWillPop: () async {
        // ถ้าเปิด dropdown อยู่ -> ปิดแบบเงียบ แล้วอนุญาต pop ทันที
        if (_isDropdownOpen) {
          _hideDropdown(rebuild: false);
          return true;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          leading: const BackButton(color: Colors.black87),
          backgroundColor: Colors.white,
          elevation: 0.5,
          centerTitle: true,
          title: Column(
            children: [
              const Text('เลือกช่วงวัน–เวลา', style: TextStyle(fontSize: 12, color: Colors.black87, fontWeight: FontWeight.w500)),
              const SizedBox(height: 2),
              Text(_headerRangeText(_start, _end), style: TextStyle(fontSize: 15, color: blue, fontWeight: FontWeight.w500)),
            ],
          ),
        ),
        body: Column(
          children: [
// ---------- แถวเลือกเวลา + เส้นบน/ล่าง ----------
Container(
  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
  decoration: const BoxDecoration(
    border: Border(
      top: BorderSide(color: Color(0xFFE5E7EB), width: 0.8),    // ✅ เส้นบน
      bottom: BorderSide(color: Color(0xFFE5E7EB), width: 0.8), // ✅ เส้นล่าง (คงเดิม)
    ),
    color: Colors.white,
  ),
  child: Row(
    children: [
      Expanded(
        child: _TimeField(
          label: 'เวลารับรถ',
          value: '${_two(_pickupTime.hour)}:${_two(_pickupTime.minute)} น.',
          isOpen: _openForPickup == true,
          accent: blue,
          onTap: () => _showDropdownUnderLine(forPickup: true),
        ),
      ),
      const SizedBox(width: 1),
      Expanded(
        child: _TimeField(
          label: 'เวลาส่งคืนรถ',
          value: '${_two(_dropTime.hour)}:${_two(_dropTime.minute)} น.',
          isOpen: _openForPickup == false,
          accent: blue,
          onTap: () => _showDropdownUnderLine(forPickup: false),
        ),
      ),
    ],
  ),
),

            // ---------- จุดยึด (Anchor) ใต้เส้น ----------
            CompositedTransformTarget(
              key: _anchorKey,
              link: _timeRowAnchor,
              child: const SizedBox(height: 0, width: double.infinity),
            ),

            // ---------- ปฏิทินหลายเดือน ----------
            Expanded(
              child: CustomScrollView(
                slivers: [
                  for (final m in _monthsToRender())
                    SliverMainAxisGroup(
                      slivers: _buildMonthSlivers(
                        month: m,
                        thaiMonthFull: _thaiMonthFull(m.month),
                        start: _start,
                        end: _end,
                        blue: blue,
                        rangeFill: rangeFill,
                        textColor: textColor,
                        onTapDay: _onTapDay,
                      ),
                    ),
                  const SliverPadding(padding: EdgeInsets.only(bottom: 16)),
                ],
              ),
            ),

            // ปุ่มตกลงล่างสุดของหน้า
            SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: blue,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('ตกลง', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500, color: Colors.white)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Time field (ลูกศรหมุนขึ้นเมื่อเปิด) ----------
class _TimeField extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onTap;
  final bool isOpen;
  final Color accent;

  const _TimeField({
    required this.label,
    required this.value,
    required this.onTap,
    required this.isOpen,
    required this.accent,
  });

  @override
  Widget build(BuildContext context) {
    final arrowColor = isOpen ? accent : const Color(0xFF6B7280);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280), fontWeight: FontWeight.w500)),
                  const SizedBox(height: 2),
                  Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.black87)),
                ],
              ),
            ),
            AnimatedRotation(
              turns: isOpen ? 0.5 : 0.0, // 180°
              duration: const Duration(milliseconds: 180),
              curve: Curves.easeOut,
              child: Icon(Icons.keyboard_arrow_down_rounded, color: arrowColor),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Dropdown ใต้เส้น (Overlay) ----------
class _UnderLineTimeDropdown extends StatefulWidget {
  final LayerLink link;
  final Color blue;
  final TimeOfDay initial;
  final double panelHeight;   // ความสูง dropdown
  final double anchorDy;      // Y ของใต้เส้น (จุดเริ่มปฏิทิน)
  final ValueChanged<TimeOfDay> onSelected;
  final VoidCallback onDismiss;

  const _UnderLineTimeDropdown({
    required this.link,
    required this.blue,
    required this.initial,
    required this.panelHeight,
    required this.anchorDy,
    required this.onSelected,
    required this.onDismiss,
  });

  @override
  State<_UnderLineTimeDropdown> createState() => _UnderLineTimeDropdownState();
}

class _UnderLineTimeDropdownState extends State<_UnderLineTimeDropdown> {
  late FixedExtentScrollController _ctrl;
  int _currentIndex = 0; // index กลาง (ใช้เปลี่ยนสีตัวหนังสือ)

  // แสดงทุก 30 นาที (ปรับเป็น 15 หรือ 1 ได้)
  final int _step = 30;
  late final List<TimeOfDay> _slots = List.generate((24 * 60) ~/ _step, (i) {
    final m = i * _step; return TimeOfDay(hour: m ~/ 60, minute: m % 60);
  });

  int _indexFromTime(TimeOfDay t) {
    final m = t.hour * 60 + t.minute;
    return (m / _step).round().clamp(0, _slots.length - 1);
  }

  String _fmt(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')} น.';

  @override
  void initState() {
    super.initState();
    _currentIndex = _indexFromTime(widget.initial);
    _ctrl = FixedExtentScrollController(initialItem: _currentIndex);
  }

  @override
  Widget build(BuildContext context) {
    final screenW = MediaQuery.of(context).size.width;

    return Stack(
      children: [
        // Overlay ทับ "เฉพาะปฏิทินด้านล่าง" (จากใต้เส้น + ความสูง dropdown ลงไป)
        Positioned(
          left: 0, right: 0,
          top: widget.anchorDy + widget.panelHeight,
          bottom: 0,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onDismiss,
            child: Container(color: Colors.black.withOpacity(0.25)),
          ),
        ),

        // แผง dropdown ชิดใต้เส้น (ไม่มีเงา + ดันขึ้น -0.5px ให้ทับเส้นพอดี)
        CompositedTransformFollower(
          link: widget.link,
          showWhenUnlinked: false,
          offset: const Offset(0, -0.5), // 🟢 ปิดรอยต่อ/เงาคั่นเส้น
          child: Material(
            color: Colors.transparent,
            child: Container(
              width: screenW,
              height: widget.panelHeight,
              decoration: const BoxDecoration(
                color: Colors.white,
                // ❌ ตัดเงากรอบนอกเพื่อไม่ให้เกิดฟุ้งคั่นเส้น
                // boxShadow: [ ... ],
                // (ถ้าอยากมีเส้นกั้นบางๆด้านบนแทนเงา ให้ปลดคอมเมนต์บรรทัดล่าง)
                border: Border(top: BorderSide(color: Color(0xFFE5E7EB), width: 0.5)),
              ),
              child: Column(
                children: [
                  // ล้อหมุน + ไฮไลต์กลาง
                  Expanded(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        IgnorePointer(
                          child: Container(
                            height: 44,
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E7EB),
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        ListWheelScrollView.useDelegate(
                          controller: _ctrl,
                          physics: const FixedExtentScrollPhysics(),
                          itemExtent: 44,
                          perspective: 0.002,
                          diameterRatio: 1.9,
                          overAndUnderCenterOpacity: 0.4,
                          squeeze: 1.05,
                          onSelectedItemChanged: (i) => setState(() => _currentIndex = i),
                          childDelegate: ListWheelChildBuilderDelegate(
                            childCount: _slots.length,
                            builder: (ctx, i) {
                              final isSel = i == _currentIndex;
                              return Center(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  child: Text(
                                    _fmt(_slots[i]),
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: isSel ? const Color(0xFF111827) : const Color(0xFF9CA3AF),
                                      fontWeight: isSel ? FontWeight.w500 : FontWeight.w500,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

// ปุ่ม "ตกลง" ใน dropdown
Padding(
  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
  child: SizedBox(
    width: double.infinity,
    height: 56,
    child: OutlinedButton(
      style: OutlinedButton.styleFrom(
        backgroundColor: Colors.white,
        side: BorderSide(color: widget.blue, width: 1.2), // ✅ เส้นรอบปุ่ม
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      onPressed: () {
        final idx = _ctrl.selectedItem.clamp(0, _slots.length - 1);
        widget.onSelected(_slots[idx]);
      },
      child: Text(
        'ตกลง',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: widget.blue, // ✅ ตัวอักษรสีฟ้า
        ),
      ),
    ),
  ),
),

                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// ---------- Sliver Header ----------
class _MonthHeaderDelegate extends SliverPersistentHeaderDelegate {
  final DateTime month;
  final String titleText;

  _MonthHeaderDelegate({required this.month, required this.titleText});

  static const double _titleHeight = 40;
  static const double _weekdayHeight = 32;
  static const double _verticalPad = 12;

  @override
  double get minExtent => _titleHeight + _weekdayHeight + _verticalPad;
  @override
  double get maxExtent => _titleHeight + _weekdayHeight + _verticalPad;

  static const int weekStart = DateTime.sunday;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    const thaiShort = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    final weekStart0 = weekStart % 7;
    final header = List.generate(7, (i) => thaiShort[(weekStart0 + i) % 7]);

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SizedBox(
            height: _titleHeight,
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(titleText, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
            ),
          ),
          SizedBox(
            height: _weekdayHeight,
            child: Row(
              children: List.generate(7, (i) {
                final idx = (weekStart0 + i) % 7;
                final isSun = idx == 0;
                final isSat = idx == 6;
                final color = (isSun || isSat) ? const Color.fromARGB(255, 255, 0, 0) : const Color(0xFF6B7280);
                return Expanded(
                  child: Center(
                    child: Text(header[i], style: TextStyle(fontSize: 14, color: color, fontWeight: FontWeight.w500)),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _MonthHeaderDelegate old) {
    return old.month != month || old.titleText != titleText;
  }
}

/// ---------- Grid ของวันที่ ----------
class _MonthDaysGrid extends StatelessWidget {
  final DateTime month;
  final DateTime start;
  final DateTime end;
  final Color blue;
  final Color rangeFill;
  final Color textColor;
  final void Function(DateTime) onTapDay;

  const _MonthDaysGrid({
    required this.month,
    required this.start,
    required this.end,
    required this.blue,
    required this.rangeFill,
    required this.textColor,
    required this.onTapDay,
  });

  int _daysInMonth(DateTime m) {
    final firstNext = DateTime(m.year, m.month + 1, 1);
    return firstNext.subtract(const Duration(days: 1)).day;
  }

  bool _isSameDay(DateTime a, DateTime b) => a.year == b.year && a.month == b.month && a.day == b.day;
  int _weekday0(int weekday) => weekday % 7;

  @override
  Widget build(BuildContext context) {
    const double kCellHeight = _DateRangePickerPageState.kCellHeight;
    const double kCircleSize = _DateRangePickerPageState.kCircleSize;

    const int weekStart = DateTime.sunday;
    final int weekStart0 = weekStart % 7;

    final firstDay = DateTime(month.year, month.month, 1);
    final firstDay0 = _weekday0(firstDay.weekday);
    final int firstCol = (firstDay0 - weekStart0 + 7) % 7;

    final days = _daysInMonth(month);
    final totalCells = firstCol + days;
    final rows = (totalCells / 7).ceil();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: List.generate(rows, (r) {
          return Row(
            children: List.generate(7, (c) {
              final cellIndex = r * 7 + c;
              final dayNumber = cellIndex - firstCol + 1;

              if (dayNumber < 1 || dayNumber > days) {
                return const Expanded(child: SizedBox(height: kCellHeight));
              }

              final date = DateTime(month.year, month.month, dayNumber);
              final isStart = _isSameDay(date, start);
              final isEnd = _isSameDay(date, end);
              final inRange = date.isAfter(start) && date.isBefore(end);
              final isSingle = isStart && isEnd;

              return Expanded(
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTapDay(date),
                  child: SizedBox(
                    height: kCellHeight,
                    child: LayoutBuilder(
                      builder: (context, cons) {
                        final half = cons.maxWidth / 2;
                        return Stack(
                          alignment: Alignment.center,
                          clipBehavior: Clip.none,
                          children: [
                            if (inRange) Positioned.fill(child: Container(color: rangeFill)),
                            if (isStart && !isSingle)
                              Positioned(left: half, right: 0, top: 0, bottom: 0, child: Container(color: rangeFill)),
                            if (isEnd && !isSingle)
                              Positioned(left: 0, right: half, top: 0, bottom: 0, child: Container(color: rangeFill)),
                            if (isStart || isEnd)
                              Container(width: kCircleSize, height: kCircleSize, decoration: BoxDecoration(color: blue, shape: BoxShape.circle)),
                            Text(
                              '$dayNumber',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: (isStart || isEnd) ? Colors.white : textColor),
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              );
            }),
          );
        }),
      ),
    );
  }
}
