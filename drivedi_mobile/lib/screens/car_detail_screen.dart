import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'package:ionicons/ionicons.dart';

class CarDetailScreen extends StatelessWidget {
  final String title;
  final String imageUrl;

  const CarDetailScreen({
    super.key,
    required this.title,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    const Color lightGrey = Color(0xFFF5F5F5);

    // ----- Helpers -----
    Widget specItem({
      required IconData icon,
      required String title,
      required String value,
    }) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: lightGrey,
              borderRadius: BorderRadius.circular(20),
            ),
            alignment: Alignment.center,
            child: Icon(icon, color: Colors.black54, size: 18),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style:
                        const TextStyle(fontSize: 13, color: Colors.black54)),
                const SizedBox(height: 0),
                Text(value,
                    style: const TextStyle(
                        fontSize: 15,
                        color: Colors.black87,
                        fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
      );
    }

    Widget sectionTitle(String text) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.black87,
              fontWeight: FontWeight.w700,
            ),
          ),
        );

    Widget featureItem(String text) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              const Icon(
                Icons.check_circle_rounded,
                // โทนเหลืองใกล้ของตัวอย่าง
                color: Color(0xFFFFC107),
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  text,
                  style: const TextStyle(
                    fontSize: 15,
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        );

    // mock features ตามภาพตัวอย่าง
    const List<String> convenienceFeatures = [
      'Apple CarPlay',
      'Bluetooth',
    ];

    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: lightGrey,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.only(left: 8, top: 6),
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black87),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SafeArea(
        top: false,
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ===== รูปด้านบน (อยากสูงขึ้นปรับ aspectRatio ได้) =====
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        AspectRatio(
                          aspectRatio: 16 / 11, // << เพิ่มความสูงของรูป
                          child: Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (c, e, s) =>
                                Container(color: lightGrey),
                            loadingBuilder: (c, child, progress) {
                              if (progress == null) return child;
                              return const Center(
                                  child:
                                      CircularProgressIndicator(strokeWidth: 2));
                            },
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 22 + 8),

                    // ===== กล่องรายละเอียดหลัก (สเปค) =====
                    Transform.translate(
                      offset: const Offset(0, -45),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Container(
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                            ),
                            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  title,
                                  style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w800),
                                ),
                                const SizedBox(height: 14),
                                GridView(
                                  physics:
                                      const NeverScrollableScrollPhysics(),
                                  padding: EdgeInsets.zero,
                                  shrinkWrap: true,
                                  gridDelegate:
                                      const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    mainAxisExtent: 40,
                                    crossAxisSpacing: 12,
                                    mainAxisSpacing: 10,
                                  ),
                                  children: [
                                    specItem(
                                        icon: Ionicons.car_outline,
                                        title: 'ประเภทรถ',
                                        value: 'รถเก๋ง 4 ประตู'),
                                    specItem(
                                        icon: Ionicons.git_compare_outline,
                                        title: 'ระบบเกียร์',
                                        value: 'เกียร์ออโต้'),
                                    specItem(
                                        icon: Remix.gas_station_line,
                                        title: 'ระบบเชื้อเพลิง',
                                        value: 'น้ำมันเบนซิน'),
                                    specItem(
                                        icon: Ionicons.speedometer_outline,
                                        title: 'ความจุเครื่องยนต์',
                                        value: '1800 cc'),
                                    specItem(
                                        icon: Ionicons.person_outline,
                                        title: 'จำนวนที่นั่ง',
                                        value: '5 ที่นั่ง'),
                                    specItem(
                                        icon: Remix.door_open_line,
                                        title: 'จำนวนประตู',
                                        value: '4 ประตู'),
                                    specItem(
                                        icon: Ionicons.briefcase_outline,
                                        title: 'จำนวนสัมภาระ',
                                        value: '2 ใบ'),
                                  ],
                                ),
                                const SizedBox(height: 24),
                              ],
                            ),
                          ),

                          // ===== ปุ่มแชร์ / หัวใจ / ตัวนับรูป =====
                          Positioned(
                            right: 66,
                            top: -22,
                            child: _CircleAction(
                                icon: Remix.share_2_line, onTap: () {}),
                          ),
                          Positioned(
                            right: 12,
                            top: -22,
                            child: _CircleAction(
                                icon: Remix.heart_line, onTap: () {}),
                          ),
                          Positioned(
                            left: 12,
                            top: -50,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black87.withOpacity(0.65),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Row(
                                children: [
                                  Icon(Remix.camera_line,
                                      size: 16, color: Colors.white),
                                  SizedBox(width: 6),
                                  Text('1/10',
                                      style: TextStyle(
                                          color: Colors.white, fontSize: 12)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                     const SizedBox(height: 16),

                    // ===== กล่องแยก: รายละเอียดรถ / อุปกรณ์อำนวยความสะดวก =====
Transform.translate(
  offset: const Offset(0, -45),
  child: Stack(
    clipBehavior: Clip.none,
    children: [
      Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ---------- หัวข้อ ----------
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text(
                'รายละเอียดรถ',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                ),
              ),
            ),
            const SizedBox(height: 8),
            // ---------- เส้นคั่น (เต็มขอบจอ) ----------
            Container(
              width: double.infinity,
              height: 1,
              color: const Color(0xFFE0E0E0),
            ),

            // ---------- เนื้อหา ----------
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'อุปกรณ์อำนวยความสะดวกภายในรถ',
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ---------- รายการเช็กลิสต์ ----------
                  Row(
                    children: const [
                      Icon(Icons.check_circle_rounded,
                          color: Color(0xFFFFC107), size: 20),
                      SizedBox(width: 10),
                      Text(
                        'Apple CarPlay',
                        style: TextStyle(fontSize: 15, color: Colors.black87),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: const [
                      Icon(Icons.check_circle_rounded,
                          color: Color(0xFFFFC107), size: 20),
                      SizedBox(width: 10),
                      Text(
                        'Bluetooth',
                        style: TextStyle(fontSize: 15, color: Colors.black87),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    ],
  ),
),

                     const SizedBox(height: 16),

                    // ===== กล่องแยก: รายละเอียดรถ / อุปกรณ์อำนวยความสะดวก =====
Transform.translate(
  offset: const Offset(0, -45),
  child: Stack(
    clipBehavior: Clip.none,
    children: [
      Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ---------- หัวข้อ ----------
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text(
                'รีวิวร้านเช่า',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                ),
              ),
            ),
            const SizedBox(height: 8),
            // ---------- เส้นคั่น (เต็มขอบจอ) ----------
            Container(
              width: double.infinity,
              height: 1,
              color: const Color(0xFFE0E0E0),
            ),

            // ---------- เนื้อหา ----------
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'อุปกรณ์อำนวยความสะดวกภายในรถ',
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ---------- รายการเช็กลิสต์ ----------
                  Row(
                    children: const [
                      Icon(Icons.check_circle_rounded,
                          color: Color(0xFFFFC107), size: 20),
                      SizedBox(width: 10),
                      Text(
                        'Apple CarPlay',
                        style: TextStyle(fontSize: 15, color: Colors.black87),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: const [
                      Icon(Icons.check_circle_rounded,
                          color: Color(0xFFFFC107), size: 20),
                      SizedBox(width: 10),
                      Text(
                        'Bluetooth',
                        style: TextStyle(fontSize: 15, color: Colors.black87),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    ],
  ),
),


                    const SizedBox(height: 16),
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

class _CircleAction extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _CircleAction({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Color.fromARGB(136, 101, 101, 101),
            blurRadius: 1,
            spreadRadius: 1,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: const SizedBox(
            width: 44,
            height: 44,
            child: Center(
              child: Icon(Icons.favorite_border, size: 22, color: Colors.black87),
            ),
          ),
        ),
      ),
    );
  }
}
