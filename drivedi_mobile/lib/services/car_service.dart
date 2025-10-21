import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class CarService {
  static String get baseUrl => ApiConfig.baseUrl;
  
  /// ดึงข้อมูลรถยนต์ทั้งหมด
  static Future<List<Map<String, dynamic>>> getAllCars() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/cars'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> cars = json.decode(response.body);
        return cars.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to load cars: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching cars: $e');
      throw Exception('Failed to fetch cars: $e');
    }
  }

  /// ดึงข้อมูลรถยนต์ตาม ID
  static Future<Map<String, dynamic>> getCarById(int carId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/cars/$carId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else if (response.statusCode == 404) {
        throw Exception('Car not found');
      } else {
        throw Exception('Failed to load car: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching car: $e');
      throw Exception('Failed to fetch car: $e');
    }
  }

  /// ดึงข้อมูลรถยนต์ของผู้ใช้
  static Future<List<Map<String, dynamic>>> getUserCars(String email) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/get-user-cars?email=$email'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> cars = data['cars'];
          return cars.cast<Map<String, dynamic>>();
        } else {
          throw Exception(data['error'] ?? 'Failed to load user cars');
        }
      } else {
        throw Exception('Failed to load user cars: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching user cars: $e');
      throw Exception('Failed to fetch user cars: $e');
    }
  }

  /// สร้างการจองรถ
  static Future<Map<String, dynamic>> createBooking(Map<String, dynamic> bookingData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/create-booking'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(bookingData),
      );

      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to create booking');
      }
    } catch (e) {
      print('Error creating booking: $e');
      throw Exception('Failed to create booking: $e');
    }
  }

  /// ดึงข้อมูลการจองของผู้ใช้
  static Future<List<Map<String, dynamic>>> getUserBookings(String email) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user-car-rentals/$email'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> rentals = data['rentals'];
          return rentals.cast<Map<String, dynamic>>();
        } else {
          throw Exception(data['error'] ?? 'Failed to load user bookings');
        }
      } else {
        throw Exception('Failed to load user bookings: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching user bookings: $e');
      throw Exception('Failed to fetch user bookings: $e');
    }
  }

  /// ยกเลิกการจอง
  static Future<Map<String, dynamic>> cancelRental(int rentalId, String userEmail) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/cancel-rental/$rentalId'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({'userEmail': userEmail}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to cancel rental');
      }
    } catch (e) {
      print('Error cancelling rental: $e');
      throw Exception('Failed to cancel rental: $e');
    }
  }
}
