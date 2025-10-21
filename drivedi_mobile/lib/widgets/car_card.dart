import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'package:ionicons/ionicons.dart';

/// ===== Model =====
class CarItem {
  final int id;
  final String title;
  final String imageUrl;
  final int photoCount;
  final List<String> tags;
  final String insurance;
  final String badge;
  final String companyCode;
  final String companyName;
  final double rating;
  final int reviewCount;
  final String payHint;
  final int pricePerDay;
  final int totalPrice;
  final int days;
  
  // ข้อมูลเพิ่มเติมจาก API
  final String brand;
  final String model;
  final String subModel;
  final int year;
  final String color;
  final String plateNumber;
  final String carType;
  final String transmission;
  final int seats;
  final String fuelType;
  final String engineSize;
  final int doors;
  final int luggage;
  final String priceType;
  final String pickupArea;
  final String shopLocation;
  final String afterHoursService;
  final String normalHours;
  final bool roadsideAssistance;
  final bool freeCancellation;
  final bool unlimitedMileage;
  final bool unlimitedRoute;
  final String status;
  final String ownerName;
  final List<String> images;
  final double shopLatitude;
  final double shopLongitude;
  final int pickupFee;
  final int deliveryFee;
  final int depositAmount;

  CarItem({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.photoCount,
    required this.tags,
    required this.insurance,
    required this.badge,
    required this.companyCode,
    required this.companyName,
    required this.rating,
    required this.reviewCount,
    required this.payHint,
    required this.pricePerDay,
    required this.totalPrice,
    required this.days,
    required this.brand,
    required this.model,
    required this.subModel,
    required this.year,
    required this.color,
    required this.plateNumber,
    required this.carType,
    required this.transmission,
    required this.seats,
    required this.fuelType,
    required this.engineSize,
    required this.doors,
    required this.luggage,
    required this.priceType,
    required this.pickupArea,
    required this.shopLocation,
    required this.afterHoursService,
    required this.normalHours,
    required this.roadsideAssistance,
    required this.freeCancellation,
    required this.unlimitedMileage,
    required this.unlimitedRoute,
    required this.status,
    required this.ownerName,
    required this.images,
    required this.shopLatitude,
    required this.shopLongitude,
    required this.pickupFee,
    required this.deliveryFee,
    required this.depositAmount,
  });

  /// Helper function สำหรับแปลงข้อมูลเป็น int
  static int _parseToInt(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.round();
    
    // แปลง string ที่มีทศนิยมเป็น int
    String strValue = value.toString();
    if (strValue.contains('.')) {
      // ถ้ามีจุดทศนิยม ให้แปลงเป็น double ก่อน แล้วค่อยแปลงเป็น int
      double? doubleValue = double.tryParse(strValue);
      return doubleValue?.round() ?? 0;
    }
    
    return int.tryParse(strValue) ?? 0;
  }

  /// สร้าง CarItem จากข้อมูล API
  factory CarItem.fromApi(Map<String, dynamic> data, {int days = 1}) {
    // สร้าง tags จากข้อมูลรถ
    List<String> tags = [];
    if (data['car_type'] != null) tags.add('${data['car_type']}');
    if (data['transmission'] != null) tags.add(data['transmission']);
    if (data['engine_size'] != null) tags.add('${data['engine_size']}');
    if (data['fuel_type'] != null) tags.add(data['fuel_type']);

    // ดึงรูปภาพหลัก
    String imageUrl = '/placeholder-car.svg';
    List<String> images = [];
    if (data['images'] != null && data['images'].isNotEmpty) {
      images = List<String>.from(data['images']);
      imageUrl = images.isNotEmpty ? images[0] : '/placeholder-car.svg';
    }

    // คำนวณราคารวม - รองรับทั้ง number และ string
    print('🔍 Debug price data: ${data['price']} (type: ${data['price'].runtimeType})');
    int pricePerDay = _parseToInt(data['price']);
    print('🔍 Parsed pricePerDay: $pricePerDay');
    int totalPrice = pricePerDay * days;

    return CarItem(
      id: data['id'] ?? 0,
      title: '${data['brand'] ?? ''} ${data['model'] ?? ''} ${data['year'] ?? ''}',
      imageUrl: imageUrl,
      photoCount: images.length,
      tags: tags,
      insurance: data['insurance'] == 1 ? 'ฟรีประกันภัยชั้น 1' : 'ไม่มีประกัน',
      badge: 'LOCAL',
      companyCode: 'C${data['id']?.toString().padLeft(5, '0') ?? '00000'}',
      companyName: data['owner_name'] ?? 'บริษัทเช่ารถ',
      rating: 4.5, // ค่าเริ่มต้น
      reviewCount: 0, // ค่าเริ่มต้น
      payHint: 'จ่ายเงินสด หรือโอนผ่านแอป',
      pricePerDay: pricePerDay,
      totalPrice: totalPrice,
      days: days,
      brand: data['brand'] ?? '',
      model: data['model'] ?? '',
      subModel: data['sub_model'] ?? '',
      year: data['year'] ?? 0,
      color: data['color'] ?? '',
      plateNumber: data['plate_number'] ?? '',
      carType: data['car_type'] ?? '',
      transmission: data['transmission'] ?? '',
      seats: data['seats'] ?? 0,
      fuelType: data['fuel_type'] ?? '',
      engineSize: data['engine_size'] ?? '',
      doors: data['doors'] ?? 0,
      luggage: data['luggage'] ?? 0,
      priceType: data['price_type'] ?? '',
      pickupArea: data['pickup_area'] ?? '',
      shopLocation: data['shop_location'] ?? '',
      afterHoursService: data['after_hours_service'] ?? '',
      normalHours: data['normal_hours'] ?? '',
      roadsideAssistance: data['roadside_assistance'] == 1,
      freeCancellation: data['free_cancellation'] == 1,
      unlimitedMileage: data['unlimited_mileage'] == 1,
      unlimitedRoute: data['unlimited_route'] == 1,
      status: data['status'] ?? '',
      ownerName: data['owner_name'] ?? '',
      images: images,
      shopLatitude: double.tryParse(data['shop_latitude']?.toString() ?? '0') ?? 0.0,
      shopLongitude: double.tryParse(data['shop_longitude']?.toString() ?? '0') ?? 0.0,
      pickupFee: _parseToInt(data['pickup_fee']),
      deliveryFee: _parseToInt(data['delivery_fee']),
      depositAmount: _parseToInt(data['deposit_amount']),
    );
  }
}


/// ===== Card UI (with image slider) =====
class CarCard extends StatefulWidget {
  final CarItem car;
  final VoidCallback onFavorite;
  final VoidCallback onShare;
  final VoidCallback onDetail;

  const CarCard({
    super.key,
    required this.car,
    required this.onFavorite,
    required this.onShare,
    required this.onDetail,
  });

  @override
  State<CarCard> createState() => _CarCardState();
}

class _CarCardState extends State<CarCard> {
  late final PageController _pageCtrl;
  int _currentIndex = 0;

  List<String> get _images {
    // ถ้า API ไม่มี images ให้ fallback ไปที่ imageUrl ตัวเดียว
    if (widget.car.images.isNotEmpty) return widget.car.images;
    return [widget.car.imageUrl];
  }

  @override
  void initState() {
    super.initState();
    _pageCtrl = PageController();
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final borderR = BorderRadius.circular(10);
    final imgs = _images; // shorthand

    return Material(
      color: Colors.white,
      elevation: 0,
      borderRadius: borderR,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: borderR,
          border: Border.all(color: Colors.black12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ---------- รูป + ปุ่มลอย ----------
            Stack(
              clipBehavior: Clip.none,
              children: [
                // สไลด์รูปโค้งครบ 4 มุม
                ClipRRect(
                  borderRadius: borderR,
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: PageView.builder(
                      controller: _pageCtrl,
                      itemCount: imgs.length,
                      onPageChanged: (i) => setState(() => _currentIndex = i),
                      itemBuilder: (context, i) {
                        return SafeNetworkImage(
                          url: imgs[i],
                          aspectRatio: 16 / 9,
                          fit: BoxFit.cover,
                        );
                      },
                    ),
                  ),
                ),

                // ตัวนับรูป (อยู่ในกรอบรูป)
                Positioned(
                  left: 10,
                  bottom: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black87.withOpacity(0.65),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(Remix.camera_line, size: 16, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(
                          '${_currentIndex + 1}/${imgs.length}',
                          style: const TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),

                // ปุ่มลอยลงมากึ่งกลางระหว่างรูปกับเนื้อหา
                Positioned(
                  right: 66,
                  bottom: -20,
                  child: _circleBtn(icon: Remix.share_2_line, onTap: widget.onShare),
                ),
                Positioned(
                  right: 12,
                  bottom: -20,
                  child: _circleBtn(icon: Remix.heart_line, onTap: widget.onFavorite),
                ),

                // (ออปชัน) จุดบอกตำแหน่งสไลด์ที่กึ่งกลางล่าง
                if (imgs.length > 1)
                  Positioned(
                    bottom: 10,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(imgs.length, (i) {
                        final active = i == _currentIndex;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 220),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          height: 6,
                          width: active ? 16 : 6,
                          decoration: BoxDecoration(
                            color: active
                                ? Colors.white
                                : Colors.white.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(6),
                          ),
                        );
                      }),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 24),

            // ---------- เนื้อหา ----------
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // หัวข้อ
                  Text(
                    widget.car.title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 6),

                  // แท็กสเปก
                  Wrap(
                    alignment: WrapAlignment.start,
                    spacing: 10,
                    runSpacing: 6,
                    children: List.generate(widget.car.tags.length, (index) {
                      return Row(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          if (index != 0) ...[
                            Transform.translate(
                              offset: const Offset(0, 1),
                              child: Container(
                                width: 2,
                                height: 2,
                                decoration: const BoxDecoration(
                                  color: Colors.black38,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                          ],
                          Text(
                            widget.car.tags[index],
                            style: const TextStyle(
                              color: Colors.black54,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      );
                    }),
                  ),

                  const SizedBox(height: 10),

                  // ประกัน
                  Row(
                    children: [
                      const Icon(Remix.shield_check_line,
                          size: 18, color: Color(0xFF0073FF)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.car.insurance,
                          style: const TextStyle(fontSize: 13, color: Colors.black87),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // แถวบริษัท / badge / rating
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: const BoxDecoration(
                          color: Color(0xFFFF6F2D),
                          borderRadius: BorderRadius.only(
                            topRight: Radius.circular(4),
                            bottomLeft: Radius.circular(4),
                            bottomRight: Radius.circular(4),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Ionicons.storefront_outline, size: 13, color: Colors.white),
                            SizedBox(width: 4),
                            Text(
                              'LOCAL',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.car.companyCode} ${widget.car.companyName}',
                        style: const TextStyle(fontSize: 13, color: Colors.black87),
                      ),
                      const Spacer(),
                      const Icon(Remix.star_fill, size: 18, color: Color(0xFFFFB800)),
                      const SizedBox(width: 4),
                      Text(
                        '${widget.car.rating.toStringAsFixed(1)} (${widget.car.reviewCount} รีวิว)',
                        style: const TextStyle(
                          fontSize: 13,
                          color: Colors.black,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  const Divider(height: 1, color: Colors.black12),
                  const SizedBox(height: 10),

                  // แถวราคา + วิธีชำระเงิน
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Icon(Remix.cash_line, size: 18, color: Color(0xFF00A86B)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.car.payHint,
                          style: const TextStyle(color: Colors.black54, fontSize: 13),
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '฿${widget.car.pricePerDay}',
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: Colors.black87,
                            ),
                          ),
                          Text(
                            'รวม ${widget.car.days} วัน ฿${widget.car.totalPrice}',
                            style: const TextStyle(fontSize: 12, color: Colors.black45),
                          ),
                          if (widget.car.depositAmount > 0) const SizedBox(height: 2),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // ✅ พื้นเทา + ปุ่มรายละเอียด
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFFF5F5F5),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(10),
                  bottomRight: Radius.circular(10),
                  topLeft: Radius.circular(10),
                  topRight: Radius.circular(10),
                ),
              ),
              margin: const EdgeInsets.only(top: 10),
              padding: const EdgeInsets.fromLTRB(14, 4, 14, 3),
              child: Align(
                alignment: Alignment.centerRight,
                child: SizedBox(
                  width: 140,
                  child: ElevatedButton(
                    onPressed: widget.onDetail,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2A7BFF),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      elevation: 0,
                    ),
                    child: const Text(
                      'รายละเอียดรถเช่า',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
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

  Widget _circleBtn({
    required IconData icon,
    required VoidCallback onTap,
  }) {
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


/// ===== รูปจากเน็ตแบบปลอดภัย (มี loader + fallback) =====
class SafeNetworkImage extends StatelessWidget {
  final String url;
  final double aspectRatio;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final String? fallbackAsset;

  const SafeNetworkImage({
    super.key,
    required this.url,
    this.aspectRatio = 16 / 9,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.fallbackAsset,
  });

  @override
  Widget build(BuildContext context) {
    final child = Image.network(
      url,
      fit: fit,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return const Center(child: CircularProgressIndicator(strokeWidth: 2));
      },
      errorBuilder: (context, error, stackTrace) {
        if (fallbackAsset != null) {
          return Image.asset(fallbackAsset!, fit: fit);
        }
        return Container(
          color: Colors.grey[200],
          child: const Center(
            child: Icon(Icons.broken_image, size: 48, color: Colors.grey),
          ),
        );
      },
    );

    final img = AspectRatio(aspectRatio: aspectRatio, child: child);

    if (borderRadius != null) {
      return ClipRRect(borderRadius: borderRadius!, child: img);
    }
    return img;
  }
}
