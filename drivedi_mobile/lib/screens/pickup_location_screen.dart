import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class PickupLocationScreen extends StatefulWidget {
  const PickupLocationScreen({super.key});

  @override
  State<PickupLocationScreen> createState() => _PickupLocationScreenState();
}

class _PickupLocationScreenState extends State<PickupLocationScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _query = '';

  // ===== สถานที่ยอดนิยม (โหมดปกติ) =====
  static const List<String> _popularAirports = [
    'สนามบินสุวรรณภูมิ',
    'สนามบินดอนเมือง',
    'สนามบินเชียงใหม่',
    'สนามบินภูเก็ต',
    'สนามบินนครศรีธรรมราช',
  ];

  // ===== 77 จังหวัด =====
  static const List<String> _provinces = [
    'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท',
    'ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม','นครพนม',
    'นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์',
    'ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พะเยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์',
    'แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง',
    'ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ',
    'สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย',
    'หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์','อุทัยธานี','อุบลราชธานี',
  ];

  /// จังหวัดที่มี dropdown (สถานที่ย่อย)
  static final Map<String, List<String>> _provincePlaces = {
    'กรุงเทพมหานคร': [
      'สนามบินสุวรรณภูมิ',
      'สนามบินดอนเมือง',
      'แอร์พอร์ตลิงก์ รามคำแหง',
      'สถานีกลางบางซื่อ',
      'Sixt วิภาวดี รังสิต',
      'มหาวิทยาลัยหอการค้าไทย',
      'BTS บางหว้า',
      'ถนนสาทรเหนือ (อาคารโครนอส สาทร)',
      'เซ็นทรัล บางนา',
      'BTS อุดมสุข',
      'สถานีขนส่งสายใต้',
      'โลตัส บางนา',
      'BTS วุฒากาศ',
      'ห้ายรายฏร์',
      'เกตะร่มเกล้า',
      'BTS อารีย์',
    ],
    'เชียงใหม่': ['สนามบินเชียงใหม่','นิมมาน','ตัวเมืองเชียงใหม่'],
    'ชลบุรี': ['พัทยาเหนือ','พัทยากลาง','สนามบินอู่ตะเภา'],
    'ภูเก็ต': ['สนามบินภูเก็ต','ป่าตอง','ตัวเมืองภูเก็ต'],
    'ขอนแก่น': ['สนามบินขอนแก่น','ตัวเมืองขอนแก่น'],
    'กระบี่': ['ท่าอากาศยานกระบี่','อ่าวนาง','ตัวเมืองกระบี่'],
  };

  final Set<String> _expanded = {};

  void _onSelect(String name) => Navigator.pop(context, name);

  // -------- ค้นหาเฉพาะ dropdown & ดึงทั้งจังหวัดหากชื่อจังหวัดแมตช์ --------
  List<_SearchResultItem> _buildSearchResults(String q) {
    if (q.isEmpty) return const [];
    final kw = q.toLowerCase();
    final List<_SearchResultItem> results = [];

    // A) ถ้าชื่อจังหวัดตรง ให้ดึงสถานที่ย่อยทั้งหมดของจังหวัดนั้น
    _provincePlaces.forEach((prov, places) {
      if (prov.toLowerCase().contains(kw)) {
        for (final place in places) {
          results.add(_SearchResultItem(type: _ResultType.place, label: place, subtitle: prov));
        }
      }
    });

    // B) ชื่อสถานที่ตรงกับคำค้น
    _provincePlaces.forEach((prov, places) {
      for (final place in places) {
        if (place.toLowerCase().contains(kw)) {
          results.add(_SearchResultItem(type: _ResultType.place, label: place, subtitle: prov));
        }
      }
    });

    // C) จังหวัดที่ไม่มี dropdown แต่ชื่อจังหวัดตรง -> แสดง "ตัวเมือง{จังหวัด}"
    for (final prov in _provinces) {
      final hasDropdown = _provincePlaces.containsKey(prov);
      if (!hasDropdown && prov.toLowerCase().contains(kw)) {
        results.add(_SearchResultItem(type: _ResultType.province, label: 'ตัวเมือง$prov', subtitle: prov));
      }
    }

    // กันซ้ำ
    final seen = <String>{};
    return results.where((e) => seen.add('${e.type}_${e.label}_${e.subtitle ?? ''}')).toList();
  }

  @override
  Widget build(BuildContext context) {
    final hasQuery = _query.isNotEmpty;
    final results = _buildSearchResults(_query);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(PickupLocationHeader.totalHeight),
        child: PickupLocationHeader(
          controller: _searchCtrl,
          onChanged: (v) {
            setState(() {
              _query = v.trim();
              if (_query.isNotEmpty) _expanded.clear();
            });
          },
          onBack: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!hasQuery) ...[
              const _SectionTitle('สถานที่ยอดนิยม'),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: EdgeInsets.zero,
                itemCount: _popularAirports.length,
                itemBuilder: (context, i) {
                  final name = _popularAirports[i];
                  return _PopularItem(
                    title: name,
                    onTap: () => _onSelect(name),
                    isLast: i == _popularAirports.length - 1,
                  );
                },
              ),
              Container(height: 8, color: const Color(0xFFF3F4F6)),
              const _SectionTitle('จังหวัดทั้งหมด'),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: EdgeInsets.zero,
                itemCount: _provinces.length,
                itemBuilder: (context, i) {
                  final province = _provinces[i];
                  final places = _provincePlaces[province] ?? ['ตัวเมือง$province'];
                  final expanded = _expanded.contains(province);
                  return Column(
                    children: [
                      _ProvinceHeader(
                        title: province,
                        expanded: expanded,
                        onTap: () {
                          setState(() {
                            expanded ? _expanded.remove(province) : _expanded.add(province);
                          });
                        },
                      ),
                      _ExpandableDropdown(
                        expanded: expanded,
                        duration: const Duration(milliseconds: 260),
                        fadeCurveIn: Curves.easeOutCubic,
                        fadeCurveOut: Curves.easeInCubic,
                        slideDy: -0.04,
                        child: _DropdownList(items: places, onSelect: _onSelect),
                      ),
                    ],
                  );
                },
              ),
] else ...[
  if (results.isEmpty)
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        // 🔹 ข้อความแจ้งกลางจอ (ตามภาพตัวอย่าง)
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Center(
            child: Text(
              'ไม่พบคำค้นหาของคุณ โปรดลองเปลี่ยนคำค้นหา',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Color.fromARGB(255, 0, 0, 0), // เทาเข้มนุ่ม ๆ
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),

        // 🔹 แสดง "จังหวัดทั้งหมด" ต่อเลย
        const _SectionTitle('จังหวัดทั้งหมด'),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: EdgeInsets.zero,
          itemCount: _provinces.length,
          itemBuilder: (context, i) {
            final province = _provinces[i];
            final places = _provincePlaces[province];
            final expanded = _expanded.contains(province);

            return Column(
              children: [
                _ProvinceHeader(
                  title: province,
                  expanded: expanded,
                  onTap: () {
                    setState(() {
                      expanded
                          ? _expanded.remove(province)
                          : _expanded.add(province);
                    });
                  },
                ),
                if (places != null)
                  _ExpandableDropdown(
                    expanded: expanded,
                    duration: const Duration(milliseconds: 260),
                    fadeCurveIn: Curves.easeOutCubic,
                    fadeCurveOut: Curves.easeInCubic,
                    slideDy: -0.04,
                    child: _DropdownList(
                      items: places,
                      onSelect: _onSelect,
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    )
  else
    ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.zero,
      itemCount: results.length,
      itemBuilder: (context, i) {
        final r = results[i];
        return _SearchResultTile(
          data: r,
          query: _query,
          onTap: () => _onSelect(r.label),
          isLast: i == results.length - 1,
        );
      },
    ),
],

          ],
        ),
      ),
    );
  }
}

/// ---------- Header ----------
class PickupLocationHeader extends StatelessWidget {
  const PickupLocationHeader({
    super.key,
    required this.controller,
    required this.onChanged,
    required this.onBack,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onBack;

  static const double _appTitleHeight = 56;
  static const double _searchHeight = 60;
  static const double totalHeight = _appTitleHeight + _searchHeight;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            SizedBox(
              height: _appTitleHeight,
              child: Row(
                children: [
                  _BackButton(onPressed: onBack),
                  const Expanded(
                    child: Center(
                      child: Text(
                        'จุดรับรถ',
                        style: TextStyle(color: Colors.black, fontWeight: FontWeight.w600, fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            SizedBox(
              height: _searchHeight,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
    fontSize: 14,        // ← ปรับตรงนี้ตามต้องการ (เช่น 14, 15, 16)
  ),
                  controller: controller,
                  onChanged: onChanged,
                  decoration: InputDecoration(
                    hintText: 'พิมพ์ชื่อสถานที่เพื่อค้นหา',
                    hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
                    prefixIcon: const Icon(Icons.search, color: Colors.black, size: 22),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF1677FF), width: 1.2),
                    ),
suffixIcon: ValueListenableBuilder<TextEditingValue>(
  valueListenable: controller,
  builder: (context, value, _) {
    if (value.text.isEmpty) return const SizedBox.shrink();
    return IconButton(
      icon: const Icon(
        Remix.close_circle_fill, // ✅ ใช้ไอคอนใหม่
        size: 20,
        color: Color(0xFF9CA3AF), // เทาอ่อนดูสบายตา
      ),
      onPressed: () {
        controller.clear();
        onChanged('');
        FocusScope.of(context).unfocus();
      },
    );
  },
),

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

/// ---------- ปุ่มย้อนกลับ ----------
class _BackButton extends StatelessWidget {
  const _BackButton({required this.onPressed});
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onPressed,
        child: const SizedBox(
          width: 44,
          height: 44,
          child: Center(child: Icon(Icons.arrow_back_ios_new_rounded, color: Colors.black)),
        ),
      ),
    );
  }
}

/// ---------- Section Title ----------
class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.title);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
      child: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color.fromARGB(255, 171, 171, 171)),
      ),
    );
  }
}

/// ---------- Province Header ----------
class _ProvinceHeader extends StatelessWidget {
  const _ProvinceHeader({
    required this.title,
    required this.expanded,
    required this.onTap,
  });

  final String title;
  final bool expanded;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const Color activeColor = Color(0xFF1677FF);
    const Color normalTextColor = Color(0xFF111827);
    const Color arrowInactive = Color(0xFF6B7280);

    return InkWell(
      onTap: onTap,
      child: Container(
        height: 48,
        color: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(8)),
              alignment: Alignment.center,
              child: const Icon(FontAwesomeIcons.locationDot, color: Color(0xFF1677FF), size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(fontSize: 14, color: expanded ? activeColor : normalTextColor, fontWeight: FontWeight.w500),
              ),
            ),
            AnimatedRotation(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              turns: expanded ? 0.5 : 0.0,
              child: Icon(Remix.arrow_down_s_line, color: expanded ? activeColor : arrowInactive, size: 20),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Dropdown list ----------
class _DropdownList extends StatelessWidget {
  final List<String> items;
  final ValueChanged<String> onSelect;
  const _DropdownList({required this.items, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(items.length, (idx) {
        final isLast = idx == items.length - 1;
        return _PopularItem(title: items[idx], onTap: () => onSelect(items[idx]), isLast: isLast);
      }),
    );
  }
}

/// ---------- Popular Item ----------
class _PopularItem extends StatelessWidget {
  const _PopularItem({required this.title, required this.onTap, this.isLast = false});
  final String title;
  final VoidCallback onTap;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    // base style จากธีม -> ฟอนต์ Prompt จะถูกใช้แน่นอน
    final base = Theme.of(context).textTheme.bodyMedium?.copyWith(
      fontSize: 14,
      color: const Color(0xFF111827),
      fontWeight: FontWeight.w500,
    );

    return InkWell(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: isLast ? 6 : 0),
        height: 48,
        color: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(8)),
              alignment: Alignment.center,
              child: const Icon(Remix.building_fill, color: Color(0xFF6B7280), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(title, overflow: TextOverflow.ellipsis, style: base),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- Expandable controller (เฟด + สไลด์ + ยืด/หด) ----------
class _ExpandableDropdown extends StatefulWidget {
  final bool expanded;
  final Widget child;
  final Duration duration;
  final Curve fadeCurveIn;
  final Curve fadeCurveOut;
  final double slideDy;

  const _ExpandableDropdown({
    required this.expanded,
    required this.child,
    this.duration = const Duration(milliseconds: 260),
    this.fadeCurveIn = Curves.easeOutCubic,
    this.fadeCurveOut = Curves.easeInCubic,
    this.slideDy = -0.04,
  });

  @override
  State<_ExpandableDropdown> createState() => _ExpandableDropdownState();
}

class _ExpandableDropdownState extends State<_ExpandableDropdown>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl =
      AnimationController(vsync: this, duration: widget.duration);
  late Animation<double> _fade;
  late Animation<Offset> _slide;
  late Animation<double> _size;

  @override
  void initState() {
    super.initState();
    _fade = CurvedAnimation(parent: _ctrl, curve: widget.fadeCurveIn, reverseCurve: widget.fadeCurveOut);
    _slide = Tween<Offset>(begin: Offset(0, widget.slideDy), end: Offset.zero).animate(_fade);
    _size = CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut);
    if (widget.expanded) _ctrl.value = 1;
  }

  @override
  void didUpdateWidget(covariant _ExpandableDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.expanded != oldWidget.expanded) {
      widget.expanded ? _ctrl.forward() : _ctrl.reverse();
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: FadeTransition(
        opacity: _fade,
        child: SlideTransition(
          position: _slide,
          child: SizeTransition(
            sizeFactor: _size,
            axisAlignment: -1.0,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}

/// ---------- Model สำหรับผลการค้นหา ----------
enum _ResultType { province, place }

class _SearchResultItem {
  final _ResultType type;
  final String label;
  final String? subtitle;
  const _SearchResultItem({required this.type, required this.label, this.subtitle});
}

/// ---------- helper: สร้าง spans ไฮไลต์ทุกตำแหน่ง (ไม่ยุ่งฟอนต์) ----------
List<TextSpan> highlightAllSpans(
  String text,
  String query, {
  required TextStyle matchStyle,
}) {
  if (query.isEmpty) return [TextSpan(text: text)];
  final lower = text.toLowerCase();
  final q = query.toLowerCase();

  final spans = <TextSpan>[];
  int start = 0;
  while (true) {
    final idx = lower.indexOf(q, start);
    if (idx < 0) {
      spans.add(TextSpan(text: text.substring(start))); // ใช้ style จาก root
      break;
    }
    if (idx > start) spans.add(TextSpan(text: text.substring(start, idx))); // root style
    spans.add(TextSpan(text: text.substring(idx, idx + q.length), style: matchStyle));
    start = idx + q.length;
  }
  return spans;
}

/// ---------- Tile แสดงผลการค้นหา ----------
class _SearchResultTile extends StatelessWidget {
  const _SearchResultTile({
    required this.data,
    required this.query,
    required this.onTap,
    required this.isLast,
  });

  final _SearchResultItem data;
  final String query;
  final VoidCallback onTap;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    // base/match style จาก Theme (จะใช้ Prompt ตามที่ตั้งไว้ใน main.dart)
    final titleBase = Theme.of(context).textTheme.titleMedium?.copyWith(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      height: 1.2,
      color: const Color(0xFF111827),
    );
    final titleMatch = titleBase?.copyWith(
      color: const Color(0xFF1677FF),
      fontWeight: FontWeight.w500,
      
    );

    final subBase = Theme.of(context).textTheme.bodyMedium?.copyWith(
      fontSize: 13,
      height: 1.2,
      color: const Color(0xFF9CA3AF),
      fontWeight: FontWeight.w400,
    );
    final subMatch = subBase?.copyWith(
      color: const Color(0xFF1677FF),
      fontWeight: FontWeight.w500,
    );

    return InkWell(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: isLast ? 6 : 0),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        height: 48,
        color: Colors.white,
        child: Row(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: const Icon(Remix.building_fill, color: Color(0xFF6B7280), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    text: TextSpan(
                      style: titleBase, // ✅ ใช้ฟอนต์จากธีม (Prompt)
                      children: highlightAllSpans(data.label, query, matchStyle: titleMatch!),
                    ),
                  ),
                  if (data.subtitle != null)
                    RichText(
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      text: TextSpan(
                        style: subBase, // ✅ ใช้ฟอนต์จากธีม (Prompt)
                        children: highlightAllSpans(data.subtitle!, query, matchStyle: subMatch!),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
