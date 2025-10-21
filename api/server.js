import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// เพิ่มการตั้งค่า header size
app.use((req, res, next) => {
  res.setHeader('Access-Control-Max-Age', '86400');
  next();
});

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

// สร้างโฟลเดอร์สำหรับเก็บรูปภาพ
const uploadDir = './public/uploads/cars';
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// ตรวจสอบสิทธิ์การเขียนไฟล์
try {
  const testFile = path.join(uploadDir, 'test.txt');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('Upload directory is writable');
} catch (error) {
  console.error('Upload directory is not writable:', error);
}

// Serve static files from public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use(express.static('public'));

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์แบบ unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    // ตรวจสอบประเภทไฟล์
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น'));
    }
  }
});

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

// Import config
import config from './config.js';

// Database connection
const pool = mysql.createPool(config.database);

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT API ENDPOINTS
// ============================================================================

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, user_type, display_name, first_name, last_name, birth_date, phone_number } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(`
      INSERT INTO users (email, password, user_type, display_name, first_name, last_name, birth_date, phone_number) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, user_type, display_name, first_name, last_name, birth_date, phone_number]);

    res.status(201).json({ 
      message: 'ลงทะเบียนสำเร็จ', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

// Check Email Exists
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    res.json({ 
      exists: users.length > 0 
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // Check if user is admin
    const isAdmin = user.is_admin === 1;

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        display_name: user.display_name,
        first_name: user.first_name,
        last_name: user.last_name,
        is_admin: user.is_admin,
        email_verified: user.email_verified
      },
      isAdmin: isAdmin
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});

// Get Display Name
app.post('/api/get-display-name', async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await pool.execute('SELECT display_name FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      res.json({ displayName: users[0].display_name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting display name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Display Name
app.put('/api/update-display-name', async (req, res) => {
  try {
    const { email, display_name } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE users SET display_name = ? WHERE email = ?',
      [display_name, email]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'อัปเดตชื่อแสดงสำเร็จ' });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตชื่อแสดง' });
  }
});

// Update User Profile
app.put('/api/update-profile', async (req, res) => {
  try {
    const { email, first_name, last_name, birth_date, phone_number } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE users SET
        first_name = ?,
        last_name = ?,
        birth_date = ?,
        phone_number = ?
      WHERE email = ?
    `, [first_name, last_name, birth_date, phone_number, email]);

    if (result.affectedRows > 0) {
      res.json({ message: 'อัปเดตโปรไฟล์สำเร็จ' });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
  }
});

// Change Password
app.post('/api/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Verify current password
    const [users] = await pool.execute('SELECT password FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email]);

    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
  }
});

// Email Verification
app.post('/api/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE users SET email_verified = 1 WHERE email = ?',
      [email]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'ยืนยันอีเมลสำเร็จ' });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยืนยันอีเมล' });
  }
});

// Update Email Verification Status
app.put('/api/update-email-verification', async (req, res) => {
  try {
    const { email, email_verified } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE users SET email_verified = ? WHERE email = ?',
      [email_verified, email]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'อัปเดตสถานะการยืนยันอีเมลสำเร็จ' });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Error updating email verification:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการยืนยันอีเมล' });
  }
});

// Update Email
app.put('/api/update-email', async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;
    
    // Check if new email already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [newEmail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'อีเมลใหม่ถูกใช้งานแล้ว' });
    }
    
    const [result] = await pool.execute(
      'UPDATE users SET email = ? WHERE email = ?',
      [newEmail, currentEmail]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'อัปเดตอีเมลสำเร็จ' });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตอีเมล' });
  }
});

// ============================================================================
// CAR MANAGEMENT API ENDPOINTS
// ============================================================================

// Upload Car Image
app.post('/api/upload-car-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
    }

    // สร้าง URL สำหรับรูปภาพ
    const imageUrl = `/uploads/cars/${req.file.filename}`;
    
    res.json({ 
      message: 'อัปโหลดรูปภาพสำเร็จ',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
  }
});

// Register Car
app.post('/api/register-car', async (req, res) => {
  try {
    const {
      user_id, brand, model, sub_model, year, color, plate_number, car_type,
      transmission, seats, fuel_type, engine_size, doors, luggage, price,
      price_type, pickup_area, shop_location, after_hours_service, normal_hours,
      insurance, roadside_assistance, free_cancellation, unlimited_mileage, unlimited_route
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO cars (
        user_id, brand, model, sub_model, year, color, plate_number, car_type,
        transmission, seats, fuel_type, engine_size, doors, luggage, price,
        price_type, pickup_area, shop_location, after_hours_service, normal_hours,
        insurance, roadside_assistance, free_cancellation, unlimited_mileage, unlimited_route
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id, brand, model, sub_model, year, color, plate_number, car_type,
      transmission, seats, fuel_type, engine_size, doors, luggage, price,
      price_type, pickup_area, shop_location, after_hours_service, normal_hours,
      insurance, roadside_assistance, free_cancellation, unlimited_mileage, unlimited_route
    ]);

    res.status(201).json({
      message: 'ลงทะเบียนรถสำเร็จ',
      carId: result.insertId
    });
  } catch (error) {
    console.error('Error registering car:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียนรถ' });
  }
});

// Get Cars by User
app.get('/api/user-cars/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [cars] = await pool.execute(`
      SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);

    res.json(cars);
  } catch (error) {
    console.error('Error fetching user cars:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรถ' });
  }
});

// Get All Cars
app.get('/api/cars', async (req, res) => {
  try {
    const [cars] = await pool.execute(`
      SELECT c.*, u.display_name as owner_name 
      FROM cars c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.status = 'approved'
      ORDER BY c.created_at DESC
    `);

    // ดึงข้อมูลรูปภาพสำหรับแต่ละรถ (ถ้ามี)
    for (let car of cars) {
      try {
        const [images] = await pool.execute(`
          SELECT image_url FROM car_images WHERE car_id = ? ORDER BY id ASC
        `, [car.id]);
        car.images = images.map(img => `http://localhost:3001${img.image_url}`);
      } catch (error) {
        console.log(`No images found for car ${car.id}`);
        car.images = [];
      }
    }

    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรถ' });
  }
});

// Get Car by ID
app.get('/api/cars/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    
    const [cars] = await pool.execute(`
      SELECT c.*, u.display_name as owner_name, u.phone_number as owner_phone
      FROM cars c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.id = ?
    `, [carId]);

    if (cars.length === 0) {
      return res.status(404).json({ error: 'ไม่พบรถที่ระบุ' });
    }

    const car = cars[0];

    // ดึงข้อมูลรูปภาพสำหรับรถคันนี้ (ถ้ามี)
    try {
      const [images] = await pool.execute(`
        SELECT image_url FROM car_images WHERE car_id = ? ORDER BY id ASC
      `, [carId]);
      car.images = images.map(img => `http://localhost:3001${img.image_url}`);
    } catch (error) {
      console.log(`No images found for car ${carId}`);
      car.images = [];
    }

    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรถ' });
  }
});

// ============================================================================
// BOOKING MANAGEMENT API ENDPOINTS
// ============================================================================

// Create Booking
app.post('/api/create-booking', async (req, res) => {
  try {
    console.log('📝 Received booking request:', req.body);
    
    const {
      car_id, renter_id, owner_id, start_date, end_date, start_time, end_time,
      total_price, pickup_location, delivery_fee, pickup_fee, deposit_amount, note
    } = req.body;

    console.log('📝 Executing SQL with values:', [
      car_id, renter_id, owner_id, start_date, end_date, start_time, end_time,
      total_price, pickup_location, delivery_fee, pickup_fee, deposit_amount, note
    ]);

    const [result] = await pool.execute(`
      INSERT INTO car_bookings (
        car_id, renter_id, owner_id, start_date, end_date, start_time, end_time,
        total_price, pickup_location, delivery_fee, pickup_fee, deposit_amount, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      car_id, renter_id, owner_id, start_date, end_date, start_time, end_time,
      total_price, pickup_location, delivery_fee, pickup_fee, deposit_amount, note
    ]);

    console.log('✅ Booking created successfully with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'สร้างการจองสำเร็จ',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false, 
      error: 'เกิดข้อผิดพลาดในการสร้างการจอง' 
    });
  }
});

// Get User Bookings
app.get('/api/user-bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [bookings] = await pool.execute(`
      SELECT cb.*, c.brand as car_brand, c.model as car_model,
             renter.display_name as renter_name, owner.display_name as owner_name
      FROM car_bookings cb
      LEFT JOIN cars c ON cb.car_id = c.id
      LEFT JOIN users renter ON cb.renter_id = renter.id
      LEFT JOIN users owner ON cb.owner_id = owner.id
      WHERE cb.renter_id = ? OR cb.owner_id = ?
      ORDER BY cb.created_at DESC
    `, [userId, userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' });
  }
});

// Get User Car Rentals (for renters)
app.get('/api/user-car-rentals/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // ดึง user ID จาก email
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบผู้ใช้' 
      });
    }
    
    const userId = users[0].id;
    
    // ดึงข้อมูลการเช่ารถที่ผู้ใช้เป็นคนเช่า (renter)
    const [rentals] = await pool.execute(`
      SELECT 
        cb.id,
        cb.car_id,
        cb.renter_id,
        cb.owner_id,
        cb.start_date,
        cb.end_date,
        cb.start_time,
        cb.end_time,
        cb.total_price,
        cb.pickup_location,
        cb.status,
        cb.created_at,
        cb.updated_at,
        c.brand as car_brand,
        c.model as car_model,
        c.plate_number,
        c.year as car_year,
        c.color as car_color,
        c.transmission,
        c.seats,
        c.fuel_type,
        c.engine_size,
        c.car_type,
        owner.display_name as owner_name,
        owner.phone_number as owner_phone
      FROM car_bookings cb
      LEFT JOIN cars c ON cb.car_id = c.id
      LEFT JOIN users owner ON cb.owner_id = owner.id
      WHERE cb.renter_id = ?
      ORDER BY cb.created_at DESC
    `, [userId]);

    // ดึงข้อมูลรูปภาพสำหรับแต่ละรถ
    for (let rental of rentals) {
      try {
        const [images] = await pool.execute(`
          SELECT image_url FROM car_images WHERE car_id = ? ORDER BY id ASC LIMIT 1
        `, [rental.car_id]);
        rental.carImage = images.length > 0 ? `http://localhost:3001${images[0].image_url}` : '/placeholder-car.svg';
      } catch (error) {
        console.log(`No images found for car ${rental.car_id}`);
        rental.carImage = '/placeholder-car.svg';
      }
    }

    res.json({
      success: true,
      rentals: rentals
    });
  } catch (error) {
    console.error('Error fetching user car rentals:', error);
    res.status(500).json({ 
      success: false, 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเช่ารถ' 
    });
  }
});

// Cancel Car Rental
app.put('/api/cancel-rental/:rentalId', async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'อีเมลไม่ถูกต้อง' 
      });
    }

    // ดึง user ID จาก email
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบผู้ใช้' 
      });
    }

    const userId = users[0].id;

    // ตรวจสอบว่าการจองนี้เป็นของผู้ใช้นี้จริงหรือไม่
    const [rentals] = await pool.execute(`
      SELECT id, status, start_date FROM car_bookings 
      WHERE id = ? AND renter_id = ?
    `, [rentalId, userId]);

    if (rentals.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบการจองที่ระบุ' 
      });
    }

    const rental = rentals[0];

    // ตรวจสอบว่าสามารถยกเลิกได้หรือไม่
    if (rental.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'การจองนี้ถูกยกเลิกไปแล้ว' 
      });
    }

    if (rental.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'ไม่สามารถยกเลิกการจองที่เสร็จสิ้นแล้วได้' 
      });
    }

    // ตรวจสอบว่าวันเริ่มเช่ายังไม่มาถึง
    const startDate = new Date(rental.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 ของวันนี้

    if (startDate <= today) {
      return res.status(400).json({ 
        success: false, 
        error: 'ไม่สามารถยกเลิกการจองที่เริ่มแล้วได้' 
      });
    }

    // อัปเดตสถานะเป็นยกเลิก
    const [result] = await pool.execute(`
      UPDATE car_bookings 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [rentalId]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการยกเลิกการจอง' 
      });
    }

    res.json({
      success: true,
      message: 'ยกเลิกการจองสำเร็จ'
    });

  } catch (error) {
    console.error('Error cancelling rental:', error);
    res.status(500).json({ 
      success: false, 
      error: 'เกิดข้อผิดพลาดในการยกเลิกการจอง' 
    });
  }
});

// ============================================================================
// ADMIN DASHBOARD API ENDPOINTS
// ============================================================================

// Dashboard Stats
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    // Count total users
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Count total cars
    const [carCount] = await pool.execute('SELECT COUNT(*) as count FROM cars');
    
    // Count cars by status
    const [carStatusCounts] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM cars 
      GROUP BY status
    `);
    
    // Count total bookings
    const [bookingCount] = await pool.execute('SELECT COUNT(*) as count FROM car_bookings');
    
    // Count bookings by status
    const [bookingStatusCounts] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM car_bookings 
      GROUP BY status
    `);
    
    // Calculate total revenue from completed bookings
    const [revenueResult] = await pool.execute(`
      SELECT COALESCE(SUM(total_price), 0) as total_revenue 
      FROM car_bookings 
      WHERE status = 'completed'
    `);
    
    // Process status counts
    const pendingCars = carStatusCounts.find(row => row.status === 'pending')?.count || 0;
    const activeBookings = bookingStatusCounts.find(row => row.status === 'confirmed')?.count || 0;
    const completedBookings = bookingStatusCounts.find(row => row.status === 'completed')?.count || 0;
    const cancelledBookings = bookingStatusCounts.find(row => row.status === 'cancelled')?.count || 0;
    
    const stats = {
      totalUsers: userCount[0].count,
      totalCars: carCount[0].count,
      totalBookings: bookingCount[0].count,
      totalRevenue: parseFloat(revenueResult[0].total_revenue) || 0,
      pendingCars,
      activeBookings,
      completedBookings,
      cancelledBookings
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recent Users
app.get('/api/admin/recent-users', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, email, display_name, user_type, created_at, email_verified
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recent Cars
app.get('/api/admin/recent-cars', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.id, c.brand, c.model, c.year, c.price, c.status, c.user_id,
             u.display_name as owner_name
      FROM cars c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC 
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recent Bookings
app.get('/api/admin/recent-bookings', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        cb.id,
        c.brand as car_brand,
        c.model as car_model,
        renter.display_name as renter_name,
        owner.display_name as owner_name,
        cb.start_date,
        cb.end_date,
        cb.total_price,
        cb.status
      FROM car_bookings cb
      LEFT JOIN cars c ON cb.car_id = c.id
      LEFT JOIN users renter ON cb.renter_id = renter.id
      LEFT JOIN users owner ON cb.owner_id = owner.id
      ORDER BY cb.created_at DESC 
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All Users for Admin
app.get('/api/admin/all-users', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        email,
        display_name,
        first_name,
        last_name,
        user_type,
        birth_date,
        phone_number,
        email_verified,
        is_admin,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All Cars for Admin
app.get('/api/admin/all-cars', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.id,
        c.brand,
        c.model,
        c.sub_model,
        c.year,
        c.color,
        c.plate_number,
        c.car_type,
        c.transmission,
        c.seats,
        c.fuel_type,
        c.engine_size,
        c.doors,
        c.luggage,
        c.price,
        c.price_type,
        c.pickup_area,
        c.shop_location,
        c.after_hours_service,
        c.normal_hours,
        c.insurance,
        c.roadside_assistance,
        c.free_cancellation,
        c.unlimited_mileage,
        c.unlimited_route,
        c.status,
        c.user_id,
        c.created_at,
        c.updated_at,
        u.display_name as owner_name
      FROM cars c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change User Role API
app.put('/api/admin/change-user-role', async (req, res) => {
  try {
    const { userId, is_admin } = req.body;

    if (userId === undefined || is_admin === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId and is_admin' 
      });
    }

    const [result] = await pool.execute(`
      UPDATE users 
      SET is_admin = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [is_admin, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully'
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// API endpoint สำหรับดึงข้อมูลการจองทั้งหมดสำหรับแอดมิน
app.get('/api/admin/all-bookings', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        cb.id,
        cb.car_id,
        c.brand as car_brand,
        c.model as car_model,
        c.sub_model as car_sub_model,
        c.year as car_year,
        c.plate_number,
        renter.display_name as renter_name,
        renter.email as renter_email,
        renter.phone_number as renter_phone,
        owner.display_name as owner_name,
        owner.email as owner_email,
        cb.start_date,
        cb.end_date,
        cb.start_time,
        cb.end_time,
        cb.pickup_datetime,
        cb.return_datetime,
        cb.total_price,
        cb.delivery_fee,
        cb.pickup_fee,
        cb.deposit_amount,
        cb.pickup_location,
        cb.note,
        cb.status,
        cb.created_at,
        cb.updated_at
      FROM car_bookings cb
      LEFT JOIN cars c ON cb.car_id = c.id
      LEFT JOIN users renter ON cb.renter_id = renter.id
      LEFT JOIN users owner ON cb.owner_id = owner.id
      ORDER BY cb.created_at DESC
    `);
    
    res.json({
      success: true,
      bookings: rows
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// API endpoint สำหรับอัปเดตสถานะการจอง
app.put('/api/admin/update-booking-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'สถานะไม่ถูกต้อง' 
      });
    }

    const [result] = await pool.execute(`
      UPDATE car_bookings 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบการจองที่ระบุ' 
      });
    }

    res.json({
      success: true,
      message: 'อัปเดตสถานะการจองสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// ============================================================================
// CAR MANAGEMENT API ENDPOINTS
// ============================================================================

// Get user's cars
app.get('/api/get-user-cars', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'อีเมลไม่ถูกต้อง' 
      });
    }

    // Get user ID from email
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบผู้ใช้' 
      });
    }

    const userId = users[0].id;

    // Get cars owned by this user
    const [cars] = await pool.execute(`
      SELECT 
        id,
        brand,
        model,
        sub_model,
        year,
        color,
        plate_number,
        car_type,
        transmission,
        seats,
        fuel_type,
        engine_size,
        doors,
        luggage,
        price,
        price_type,
        pickup_area,
        shop_location,
        shop_latitude,
        shop_longitude,
        after_hours_service,
        normal_hours,
        insurance,
        roadside_assistance,
        free_cancellation,
        unlimited_mileage,
        unlimited_route,
        pickup_fee,
        delivery_fee,
        deposit_amount,
        status,
        created_at,
        updated_at
      FROM cars 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    // ดึงข้อมูลรูปภาพสำหรับแต่ละรถ (ถ้ามี)
    for (let car of cars) {
      try {
        const [images] = await pool.execute(`
          SELECT image_url FROM car_images WHERE car_id = ? ORDER BY id ASC
        `, [car.id]);
        car.images = images.map(img => `http://localhost:3001${img.image_url}`);
      } catch (error) {
        console.log(`No images found for car ${car.id}`);
        car.images = [];
      }
    }

    res.json({
      success: true,
      cars: cars
    });

  } catch (error) {
    console.error('Error fetching user cars:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Update car information
app.put('/api/update-car/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      brand, model, sub_model, year, color, plate_number, car_type,
      transmission, seats, fuel_type, engine_size, doors, luggage, price,
      price_type, pickup_area, shop_location, after_hours_service, normal_hours,
      insurance, roadside_assistance, free_cancellation, unlimited_mileage, unlimited_route
    } = req.body;
    
    if (!brand || !model || !year || !color || !plate_number || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'ข้อมูลไม่ครบถ้วน' 
      });
    }

    // Debug: แสดงข้อมูลที่ได้รับ
    console.log('Received update data:', {
      brand, model, sub_model, year, color, plate_number, car_type,
      transmission, seats, fuel_type, engine_size, doors, luggage, price,
      price_type, pickup_area, shop_location, after_hours_service, normal_hours,
      insurance, roadside_assistance, free_cancellation, unlimited_mileage, unlimited_route
    });

    // ตรวจสอบและจำกัดความยาวของข้อมูล
    const truncatedData = {
      brand: brand?.substring(0, 50) || '',
      model: model?.substring(0, 50) || '',
      sub_model: sub_model?.substring(0, 50) || '',
      year: year,
      color: color?.substring(0, 30) || '',
      plate_number: plate_number?.substring(0, 20) || '',
      car_type: car_type?.substring(0, 30) || 'sedan', // ใช้ค่า default เมื่อเป็นสตริงว่าง
      transmission: transmission?.substring(0, 30) || '',
      seats: seats,
      fuel_type: fuel_type?.substring(0, 30) || '',
      engine_size: engine_size?.substring(0, 20) || '',
      doors: doors,
      luggage: luggage,
      price: price,
      price_type: price_type?.substring(0, 20) || '',
      pickup_area: pickup_area?.substring(0, 100) || '',
      shop_location: shop_location?.substring(0, 200) || '',
      after_hours_service: after_hours_service?.substring(0, 100) || '',
      normal_hours: normal_hours?.substring(0, 100) || '',
      insurance: insurance,
      roadside_assistance: roadside_assistance,
      free_cancellation: free_cancellation,
      unlimited_mileage: unlimited_mileage,
      unlimited_route: unlimited_route
    };

    // Debug: แสดงข้อมูลที่ถูกตัดท้าย
    console.log('Truncated data:', truncatedData);

    // อัปเดทข้อมูลรถ
    const [result] = await pool.execute(`
      UPDATE cars SET
        brand = ?, model = ?, sub_model = ?, year = ?, color = ?, plate_number = ?,
        car_type = ?, transmission = ?, seats = ?, fuel_type = ?, engine_size = ?,
        doors = ?, luggage = ?, price = ?, price_type = ?, pickup_area = ?,
        shop_location = ?, after_hours_service = ?, normal_hours = ?, insurance = ?,
        roadside_assistance = ?, free_cancellation = ?, unlimited_mileage = ?,
        unlimited_route = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      truncatedData.brand, truncatedData.model, truncatedData.sub_model, truncatedData.year, 
      truncatedData.color, truncatedData.plate_number, truncatedData.car_type,
      truncatedData.transmission, truncatedData.seats, truncatedData.fuel_type, 
      truncatedData.engine_size, truncatedData.doors, truncatedData.luggage, 
      truncatedData.price, truncatedData.price_type, truncatedData.pickup_area,
      truncatedData.shop_location, truncatedData.after_hours_service, truncatedData.normal_hours,
      truncatedData.insurance, truncatedData.roadside_assistance, truncatedData.free_cancellation, 
      truncatedData.unlimited_mileage, truncatedData.unlimited_route, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบรถที่ระบุ' 
      });
    }

    res.json({
      success: true,
      message: 'อัปเดทข้อมูลรถสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Delete user's car
app.delete('/api/delete-car/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'อีเมลไม่ถูกต้อง' 
      });
    }

    // Get user ID from email
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบผู้ใช้' 
      });
    }

    const userId = users[0].id;

    // Check if car belongs to this user
    const [cars] = await pool.execute('SELECT id FROM cars WHERE id = ? AND user_id = ?', [id, userId]);
    if (cars.length === 0) {
      return res.status(403).json({ 
        success: false, 
        error: 'ไม่มีสิทธิ์ลบรถคันนี้' 
      });
    }

    // Delete the car
    const [result] = await pool.execute('DELETE FROM cars WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'ไม่พบรถที่ระบุ' 
      });
    }

    res.json({
      success: true,
      message: 'ลบรถสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Shared API Server running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'rentcar_db'}`);
});