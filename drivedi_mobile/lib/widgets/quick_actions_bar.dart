import 'package:flutter/material.dart';
import 'package:remixicon/remixicon.dart';

/// =============================================================
///  แถบปุ่ม 3 คอลัมน์ (ซ้ายชิดซ้าย/กลาง/ขวาชิดขวา) + เว้นขอบซ้ายขวาเล็กน้อย
/// =============================================================
class QuickActionsBar extends StatelessWidget {
  final VoidCallback? onHelp;
  final VoidCallback? onSort;
  final VoidCallback? onAssistSearch;

  const QuickActionsBar({
    super.key,
    this.onHelp,
    this.onSort,
    this.onAssistSearch,
  });

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF0073FF);

    return Material(
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        child: Row(
          children: [
            Expanded(
              child: QuickButton(
                icon: Remix.question_line,
                iconTint: blue,
                label: 'ช่วยเหลือ',
                onTap: onHelp,
                align: MainAxisAlignment.start,
                textAlign: TextAlign.left,
              ),
            ),
            Expanded(
              child: QuickButton(
                icon: Remix.arrow_up_down_line,
                iconTint: blue,
                label: 'เรียงผลตาม',
                onTap: onSort,
                align: MainAxisAlignment.center,
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: QuickButton(
                icon: Remix.equalizer_2_line,
                iconTint: blue,
                label: 'ช่วยค้นหา',
                onTap: onAssistSearch,
                align: MainAxisAlignment.end,
                textAlign: TextAlign.right,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class QuickButton extends StatelessWidget {
  final IconData icon;
  final Color iconTint;
  final String label;
  final VoidCallback? onTap;
  final MainAxisAlignment align;
  final TextAlign textAlign;

  const QuickButton({
    super.key,
    required this.icon,
    required this.iconTint,
    required this.label,
    required this.onTap,
    this.align = MainAxisAlignment.center,
    this.textAlign = TextAlign.center,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Ink(
        padding: const EdgeInsets.symmetric(vertical: 8),
        color: Colors.white,
        child: Row(
          mainAxisAlignment: align,
          children: [
            Icon(icon, size: 22, color: iconTint),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                label,
                textAlign: textAlign,
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
