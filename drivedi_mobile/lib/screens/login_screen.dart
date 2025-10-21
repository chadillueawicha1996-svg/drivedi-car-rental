import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  bool _isValidEmail = false;

  @override
  void initState() {
    super.initState();
    _emailCtrl.addListener(_onEmailChanged);
  }

  @override
  void dispose() {
    _emailCtrl
      ..removeListener(_onEmailChanged)
      ..dispose();
    super.dispose();
  }

  void _onEmailChanged() {
    final email = _emailCtrl.text.trim();
    final regex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    setState(() => _isValidEmail = regex.hasMatch(email));
  }

  void _onNext() {
    // TODO: ดำเนินการ login ด้วยอีเมล
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // แตะพื้นที่ว่าง -> ปิดคีย์บอร์ด
      onTap: () => FocusScope.of(context).unfocus(),
      behavior: HitTestBehavior.translucent,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.black),
        ),
        body: SafeArea(
          child: Stack(
            children: [
              Align(
                alignment: Alignment.topCenter,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 520),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // โลโก้ชิดซ้าย
                        Padding(
                          padding: const EdgeInsets.only(top: 20),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: Image.asset(
                              'assets/images/logoDD2.png',
                              width: 55,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),

                        const SizedBox(height: 15),

                        // หัวเรื่อง
                        Text(
                          'ยินดีต้อนรับกลับมา!',
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(
                                fontWeight: FontWeight.w600,
                                fontSize: 28,
                                height: 1.15,
                              ),
                        ),
                        const SizedBox(height: 15),
                        Text(
                          'เข้าสู่ระบบสมาชิกติดต่อสะดวกกับเราได้ง่ายกว่า',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(
                                fontWeight: FontWeight.w100,
                                fontSize: 16,
                                color: Colors.black,
                                height: 1.2,
                              ),
                        ),

                        const SizedBox(height: 40),

                        // ช่องอีเมล
                        TextField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          textAlignVertical: TextAlignVertical.center,
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.symmetric(vertical: 10),
                            prefixIcon: Padding(
                              padding: EdgeInsets.only(left: 0, right: 12),
                              child: Icon(
                                FontAwesomeIcons.envelope,
                                size: 20,
                              ),
                            ),
                            prefixIconConstraints:
                                BoxConstraints(minWidth: 0, minHeight: 0),
                            hintText: 'ที่อยู่อีเมล',
                            hintStyle: TextStyle(color: Colors.black45),
                            border: UnderlineInputBorder(),
                            focusedBorder: UnderlineInputBorder(
                              borderSide:
                                  BorderSide(color: Color(0xFF0073FF), width: 1),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // ปุ่ม "ถัดไป"
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: _isValidEmail ? _onNext : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0073FF),
                              disabledBackgroundColor: const Color.fromARGB(255, 179, 218, 255),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                              elevation: 0,
                            ),
                            child: Text('ถัดไป',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              color: Colors.white),
                              
                          ),
                        ),
                        ),

                        const SizedBox(height: 18),

                        // เส้นคั่น + "หรือ"
                        Row(
                          children: [
                            Expanded(
                                child: Container(
                                    height: 1, color: Colors.grey.shade300)),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 12),
                              child: Text(
                                'หรือ',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(color: Colors.black,
                                        fontWeight: FontWeight.w500,
                                        fontSize: 16
                                        ),
                              ),
                            ),
                            Expanded(
                                child: Container(
                                    height: 1, color: Colors.grey.shade300)),
                          ],
                        ),

                        const SizedBox(height: 14),

                        // โทรศัพท์ → เขียว
                        Theme(
                          data: Theme.of(context).copyWith(
                            outlinedButtonTheme: OutlinedButtonThemeData(
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF10B981),
                              ),
                            ),
                          ),
                          child: _AuthOutlineButton(
                            icon: Remix.phone_line,
                            label: 'เบอร์โทรศัพท์',
                            onTap: () {},
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Facebook → ฟ้า
                        Theme(
                          data: Theme.of(context).copyWith(
                            outlinedButtonTheme: OutlinedButtonThemeData(
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF1877F2),
                              ),
                            ),
                          ),
                          child: _AuthOutlineButton(
                            icon: Remix.facebook_circle_fill,
                            label: 'เข้าสู่ระบบ Facebook',
                            onTap: () {},
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Google → แดง
                        Theme(
                          data: Theme.of(context).copyWith(
                            outlinedButtonTheme: OutlinedButtonThemeData(
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFFDB4437),
                              ),
                            ),
                          ),
                          child: _AuthOutlineButton(
                            icon: Remix.google_fill,
                            label: 'เข้าสู่ระบบ Google',
                            onTap: () {},
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Apple → ดำ
                        Theme(
                          data: Theme.of(context).copyWith(
                            outlinedButtonTheme: OutlinedButtonThemeData(
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.black,
                              ),
                            ),
                          ),
                          child: _AuthOutlineButton(
                            icon: Remix.apple_fill,
                            label: 'เข้าสู่ระบบ Apple',
                            onTap: () {},
                          ),
                        ),

                        const SizedBox(height: 18),

                        // ข้อกำหนด/นโยบาย
                        Center(
                          child: RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    fontSize: 12,
                                    color: Colors.black54,
                                    height: 1.4,
                                  ),
                              children: const [
                                TextSpan(
                                  text:
                                      'การลงชื่อสมัครใช้บริการ DriveDi ท่านได้ยอมรับและตกลงตาม ',
                                  style: TextStyle(color: Colors.black),
                                ),
                                TextSpan(
                                  text: 'เงื่อนไขการให้บริการ',
                                  style: TextStyle(
                                      color: Color(0xFF0073FF),
                                      fontWeight: FontWeight.w400),
                                ),
                                TextSpan(text: ' และ '),
                                TextSpan(
                                  text: 'นโยบายความเป็นส่วนตัว',
                                  style: TextStyle(
                                      color: Color(0xFF0073FF),
                                      fontWeight: FontWeight.w400),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ปุ่มขอบ พร้อมไอคอนซ้ายกลาง
class _AuthOutlineButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const _AuthOutlineButton({
    required this.icon,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return SizedBox(
      height: 48,
      width: double.infinity,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          // ห้ามกำหนด foregroundColor ที่นี่ (จะไปบังคับสีไอคอน)
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
          padding: EdgeInsets.zero,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Icon(
                  icon,
                  size: 22, // ไอคอนจะรับสีจาก Theme (outlinedButtonTheme.foregroundColor)
                ),
              ),
            ),
            Text(
              label,
              style: (t.titleMedium ??
                      const TextStyle(fontSize: 16, fontWeight: FontWeight.w500))
                  .copyWith(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                    color: const Color(0xFF1A1A1A), // ล็อกสีข้อความให้ไม่เปลี่ยนตามไอคอน
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
