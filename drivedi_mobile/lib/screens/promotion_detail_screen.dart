import 'package:flutter/material.dart';
import 'promotions_screen.dart'; // ใช้ Promo จากไฟล์นี้
import '../widgets/search_rental_panel.dart';

class PromotionDetailScreen extends StatelessWidget {
  final Promo item;
  const PromotionDetailScreen({super.key, required this.item});

  String _two(int n) => n.toString().padLeft(2, '0');
  String _dateStr(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';

  @override
  Widget build(BuildContext context) {
    const text = Color(0xFF111827);
    const subText = Color(0xFF6B7280);
    const line = Color(0xFFE5E7EB);
    const green = Color(0xFF10B981);
    const linkBlue = Color(0xFF1677FF);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
  'รายละเอียด',
  style: TextStyle(
    color: text,
    fontSize: 16, // 👈 ปรับขนาดฟอนต์จากค่ามาตรฐาน (~20) ให้เล็กลง
    fontWeight: FontWeight.w600,
  ),
),

        elevation: 0,
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: text),
        actions: [
          IconButton(icon: const Icon(Icons.ios_share), onPressed: () {}),
        ],
      ),
      body: ListView(
        children: [
          // ===== รูปด้านบน + ป้าย "ไฮไลท์และโน้ต" =====
          Stack(
            children: [
              Hero(
                tag: 'promo-image-${item.imageUrl}',
                child: AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Image.network(
                    item.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) =>
                        Container(color: const Color(0xFFE5E7EB)),
                  ),
                ),
              ),
              Positioned(
                left: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.55),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'ไฮไลท์และโน้ต',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // ===== หัวเรื่องหลัก =====
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              item.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: text,
                height: 1.35,
              ),
            ),
          ),

          // ===== วันที่ =====
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 2, 16, 16),
            child: Row(
              children: [
                const Icon(Icons.calendar_today_outlined, size: 18, color: subText),
                const SizedBox(width: 8),
                Text(
                  '${_dateStr(item.start)} - ${_dateStr(item.end)}',
                  style: const TextStyle(fontSize: 14, color: subText, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          const Divider(height: 24, thickness: 1, color: line),

          // ===== รายละเอียด =====
          if (item.detailIntroBold.isNotEmpty ||
              item.detailBody.isNotEmpty ||
              item.infoRowText.isNotEmpty) ...[
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Text(
                'รายละเอียด',
                style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w700, color: text),
              ),
            ),
            if (item.detailIntroBold.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                child: Text(
                  item.detailIntroBold,
                  style: const TextStyle(
                    fontSize: 16,
                    height: 1.6,
                    color: text,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            if (item.detailIntroBold.isNotEmpty) const SizedBox(height: 16),
            if (item.detailBody.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                child: Text(
                  item.detailBody,
                  style: const TextStyle(fontSize: 14.5, height: 1.6, color: text),
                ),
              ),
            if (item.detailBody.isNotEmpty) const SizedBox(height: 12),
            if (item.infoRowText.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.smartphone, color: Color(0xFF374151), size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        item.infoRowText,
                        style: const TextStyle(fontSize: 14.5, height: 1.6, color: text),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            const Divider(height: 24, thickness: 1, color: line),
          ],

          // ===== ข้อกำหนดและเงื่อนไข + วิธีรับส่วนลด =====
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Text(
              'ข้อกำหนดและเงื่อนไข',
              style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w700, color: text),
            ),
          ),

          // วิธีรับส่วนลด
          if (item.howToBullets.isNotEmpty || item.howToLink.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Row(
                children: const [
                  Icon(Icons.local_offer, color: green, size: 20),
                  SizedBox(width: 8),
                  Text('วิธีรับส่วนลด', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: text)),
                ],
              ),
            ),
            for (final b in item.howToBullets)
              Padding(
                padding: const EdgeInsets.fromLTRB(48, 0, 16, 8),
                child: _Bullet(text: b),
              ),
            if (item.howToLink.isNotEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(48, 0, 16, 24),
                child: Text(
                  item.howToLink,
                  style: const TextStyle(
                    fontSize: 14.5,
                    height: 1.6,
                    color: linkBlue,
                    decoration: TextDecoration.underline,
                    decorationThickness: 1.5,
                  ),
                ),
              ),
          ],

          // บล็อก "ข้อกำหนดและเงื่อนไขการใช้ส่วนลด"
          if (item.termsEmph.isNotEmpty || item.terms.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: const [
                  Icon(Icons.push_pin, color: Color(0xFFEF4444), size: 20),
                  SizedBox(width: 8),
                  Text('ข้อกำหนดและเงื่อนไขการใช้ส่วนลด',
                      style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.w700, color: text)),
                ],
              ),
            ),
            ...[
              for (final e in item.termsEmph)
                Padding(
                  padding: const EdgeInsets.fromLTRB(48, 0, 16, 6),
                  child: _BulletRich(bold: e.bold, rest: e.rest),
                ),
              for (final t in item.terms)
                Padding(
                  padding: const EdgeInsets.fromLTRB(48, 0, 16, 6),
                  child: _Bullet(text: t),
                ),
            ],
            const SizedBox(height: 16),
          ],

          // ===== พาเนลค้นหารถเช่า (จากไฟล์ ../widgets/search_rental_panel.dart) =====
     
Padding(
  padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
  child: Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.4),
          blurRadius: 6,
          offset: const Offset(0, 1),
        ),
      ],
    ),
    child: SearchRentalPanel(
      initialPickup: DateTime.now().add(const Duration(hours: 1)),
      initialDrop: DateTime.now().add(const Duration(days: 2, hours: 1)),
    ), // ✅ พาเนลค้นหารถเช่าพร้อมเงา
  ),
),

        ],
      ),
    );
  }
}

/// ================== Widgets ย่อย ==================

class _Bullet extends StatelessWidget {
  final String text;
  const _Bullet({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 8),
          width: 6,
          height: 6,
          decoration: const BoxDecoration(
            color: Color(0xFF111827),
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 14.5, height: 1.6, color: Color(0xFF111827)),
          ),
        ),
      ],
    );
  }
}

class _BulletRich extends StatelessWidget {
  final String bold;
  final String rest;
  const _BulletRich({required this.bold, required this.rest});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 8),
          width: 6,
          height: 6,
          decoration: const BoxDecoration(
            color: Color(0xFF111827),
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(color: Color(0xFF111827), fontSize: 14.5, height: 1.6),
              children: [
                TextSpan(text: 'ลูกค้า '),
                TextSpan(text: bold, style: const TextStyle(fontWeight: FontWeight.w700)),
                TextSpan(text: rest),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
