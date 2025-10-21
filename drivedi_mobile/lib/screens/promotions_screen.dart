import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'notification_screen.dart';
import 'language_screen.dart';
import 'promotion_detail_screen.dart';

class PromotionsScreen extends StatelessWidget {
  const PromotionsScreen({super.key});

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
              'สิทธิพิเศษ',
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
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
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
        body: const TabBarView(
          children: [
            _PromotionGrid(tabKey: 'all'),
            _PromotionGrid(tabKey: 'rent'),
            _PromotionGrid(tabKey: 'coupon'),
            _PromotionGrid(tabKey: 'news'),
          ],
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

class _ProportionalTabsState extends State<_ProportionalTabs> {
  TabController? _controller;

  static const _labelStyle = TextStyle(fontSize: 14, fontWeight: FontWeight.w700);

  double _textWidth(String s) {
    final tp = TextPainter(
      text: const TextSpan(text: '', style: _labelStyle),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    );
    tp.text = TextSpan(text: s, style: _labelStyle);
    tp.layout();
    return tp.width + 24; // padding ซ้าย/ขวา ต่อปุ่ม
  }

  void _handleTabChange() {
    if (!mounted) return;
    setState(() {});
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final newController = DefaultTabController.of(context);
    if (_controller != newController) {
      _controller?.removeListener(_handleTabChange);
      _controller = newController;
      _controller?.addListener(_handleTabChange);
    }
  }

  @override
  void dispose() {
    _controller?.removeListener(_handleTabChange);
    _controller = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final widths = widget.labels.map(_textWidth).toList();
    final total = widths.fold<double>(0, (sum, w) => sum + w);
    final flexes = widths.map((w) => ((w / total) * 1000).round().clamp(1, 1000)).toList();
    final currentIndex = _controller?.index ?? 0;

    return Row(
      children: [
        // กล่องแท็บทั้งหมด (สัดส่วนตามข้อความ)
        Expanded(
          child: Row(
            children: [
              for (int i = 0; i < widget.labels.length; i++)
                Expanded(
                  flex: flexes[i],
                  child: _TabButton(
                    label: widget.labels[i],
                    selected: currentIndex == i,
                    onTap: () => _controller?.animateTo(i),
                    selectedColor: widget.selectedColor,
                    unselectedColor: widget.unselectedColor,
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Icon(Icons.expand_more, size: 18, color: widget.unselectedColor),
        const SizedBox(width: 4),
      ],
    );
  }
}

/// ปุ่มแท็บเดี่ยว
class _TabButton extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final Color selectedColor;
  final Color unselectedColor;

  const _TabButton({
    required this.label,
    required this.selected,
    required this.onTap,
    required this.selectedColor,
    required this.unselectedColor,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      curve: Curves.easeOut,
      height: 38,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: selected
          ? BoxDecoration(
              color: const Color(0xFFE3F2FD),
              borderRadius: BorderRadius.circular(8),
            )
          : const BoxDecoration(),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Center(
          child: Text(
            label,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: selected ? selectedColor : unselectedColor,
            ),
          ),
        ),
      ),
    );
  }
}

//
// ---------------- Grid ----------------
class _PromotionGrid extends StatelessWidget {
  final String tabKey;
  const _PromotionGrid({required this.tabKey});

  @override
  Widget build(BuildContext context) {
    final data = _mockPromotions
        .where((p) => tabKey == 'all' ? true : p.tags.contains(tabKey))
        .toList();

    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 15, 16, 16),
      itemCount: data.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.0,
      ),
      itemBuilder: (_, i) => _PromotionCard(item: data[i]),
    );
  }
}

class _PromotionCard extends StatelessWidget {
  final Promo item;
  const _PromotionCard({required this.item});

  String _two(int n) => n.toString().padLeft(2, '0');
  String _dateStr(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PromotionDetailScreen(item: item),
          ),
        );
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.4),
              blurRadius: 6,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            AspectRatio(
              aspectRatio: 16 / 8.3,
              child: Hero(
                tag: 'promo-image-${item.imageUrl}',
                child: Image.network(
                  item.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(color: const Color(0xFFE5E7EB)),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w500,
                        height: 1.25,
                      ),
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined,
                            size: 12, color: Color(0xFF9CA3AF)),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            '${_dateStr(item.start)} - ${_dateStr(item.end)}',
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w500,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------- Model + Mock JSON + Mapper ----------------

class _EmphTerm {
  final String bold;
  final String rest;
  const _EmphTerm({required this.bold, required this.rest});

  factory _EmphTerm.fromJson(Map<String, dynamic> j) =>
      _EmphTerm(bold: j['bold'] as String? ?? '', rest: j['rest'] as String? ?? '');

  Map<String, dynamic> toJson() => {'bold': bold, 'rest': rest};
}

class Promo {
  final String id;
  final String title;
  final String imageUrl;
  final DateTime start;
  final DateTime end;
  final List<String> tags;

  // รายละเอียด
  final String detailIntroBold;
  final String detailBody;
  final String infoRowText;
  final List<String> howToBullets;
  final String howToLink;
  final List<_EmphTerm> termsEmph;
  final List<String> terms;

  const Promo({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.start,
    required this.end,
    required this.tags,
    this.detailIntroBold = '',
    this.detailBody = '',
    this.infoRowText = '',
    this.howToBullets = const [],
    this.howToLink = '',
    this.termsEmph = const [],
    this.terms = const [],
  });

  factory Promo.fromJson(Map<String, dynamic> j) => Promo(
        id: j['id'] as String? ?? UniqueKey().toString(),
        title: j['title'] as String? ?? '',
        imageUrl: j['imageUrl'] as String? ?? '',
        start: DateTime.parse(j['start'] as String),
        end: DateTime.parse(j['end'] as String),
        tags: (j['tags'] as List? ?? []).map((e) => e.toString()).toList(),
        detailIntroBold: j['detailIntroBold'] as String? ?? '',
        detailBody: j['detailBody'] as String? ?? '',
        infoRowText: j['infoRowText'] as String? ?? '',
        howToBullets:
            (j['howToBullets'] as List? ?? []).map((e) => e.toString()).toList(),
        howToLink: j['howToLink'] as String? ?? '',
        termsEmph: (j['termsEmph'] as List? ?? [])
            .map((e) => _EmphTerm.fromJson(Map<String, dynamic>.from(e)))
            .toList(),
        terms: (j['terms'] as List? ?? []).map((e) => e.toString()).toList(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'imageUrl': imageUrl,
        'start': start.toIso8601String(),
        'end': end.toIso8601String(),
        'tags': tags,
        'detailIntroBold': detailIntroBold,
        'detailBody': detailBody,
        'infoRowText': infoRowText,
        'howToBullets': howToBullets,
        'howToLink': howToLink,
        'termsEmph': termsEmph.map((e) => e.toJson()).toList(),
        'terms': terms,
      };
}

// ===== Mock JSON =====
final List<Map<String, dynamic>> _mockJson = [
  {
    'id': 'p1',
    'title': 'สมาชิก HomeCard รับส่วนลด 100 บาท เมื่อเช่ารถ...',
    'imageUrl':
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    'start': '2024-03-15',
    'end': '2024-11-30',
    'tags': ['all', 'rent'],
    'detailIntroBold':
        'สมาชิกบัตร HomeCard จาก HomePro และ\nMegaHome รับส่วนลด 100 บาท เมื่อเช่ารถทั่วไทยกับ\nDrivehub',
    'detailBody':
        'รับส่วนลด 100 บาท เมื่อเช่ารถกับ Drivehub ผ่านเว็บไซต์และแอปพลิเคชัน\nใช้ได้กับรถเช่าหลากหลายประเภทรถในเครือร้านค้าที่ร่วมรายการ',
    'infoRowText': 'รับสิทธิ์ผ่านแอปฯ HomeCard แล้วนำโค้ดมาใช้งาน',
    'howToBullets': [
      'กดรับโค้ดในแอปฯ HomeCard',
      'กรอกโค้ดในขั้นตอนชำระเงินบนเว็บไซต์/แอปฯ Drivehub',
    ],
    'howToLink': 'https://www.drivehub.co',
    'terms': [
      'ใช้ได้เฉพาะการเช่ารายวันบนสาขาที่มีสัญลักษณ์ Local',
      'จองและรับรถภายในวันที่ 30 พฤศจิกายน 2568',
      'ไม่ร่วมรายการช่วงวันหยุดสงกรานต์ 13–16 เม.ย. 2568',
      '1 สิทธิ์/บัญชี/เดือน, สิทธิ์มีจำนวนจำกัด',
      'โค้ดไม่สามารถเปลี่ยนเป็นเงินสดและไม่สามารถคืนเงินได้',
    ],
  },
];

// แปลง JSON -> โมเดล
final List<Promo> _mockPromotions =
    _mockJson.map((e) => Promo.fromJson(e)).toList();
