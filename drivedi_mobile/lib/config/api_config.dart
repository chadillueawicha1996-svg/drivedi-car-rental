// Production API Configuration
// ไฟล์นี้ใช้สำหรับเปลี่ยน baseUrl เมื่อ deploy แล้ว

class ApiConfig {
  // Development (Local)
  static const String devBaseUrl = 'http://localhost:3001';
  
  // Production (Railway)
  static const String prodBaseUrl = 'https://your-app-name.railway.app';
  
  // เลือก environment
  static const bool isProduction = false; // เปลี่ยนเป็น true เมื่อ deploy แล้ว
  
  static String get baseUrl {
    return isProduction ? prodBaseUrl : devBaseUrl;
  }
}

// วิธีใช้งาน:
// import 'api_config.dart';
// final response = await http.get(Uri.parse('${ApiConfig.baseUrl}/api/cars'));
