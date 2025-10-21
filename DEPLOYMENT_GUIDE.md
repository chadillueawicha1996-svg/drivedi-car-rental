# Railway Deployment Guide

## ขั้นตอนการ Deploy ไปยัง Railway

### 1. เตรียมไฟล์สำหรับ Deploy

สร้างไฟล์ `railway.json` (สร้างแล้ว)
สร้างไฟล์ `Procfile`:
```
web: npm start
```

### 2. อัปเดต package.json
เพิ่ม scripts สำหรับ production:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. สร้างไฟล์ .env สำหรับ Railway
```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
PORT=3001
NODE_ENV=production
```

### 4. ขั้นตอน Deploy

1. ไปที่ https://railway.app
2. สมัครสมาชิกด้วย GitHub
3. คลิก "New Project"
4. เลือก "Deploy from GitHub repo"
5. เลือก repository ของคุณ
6. Railway จะ build และ deploy อัตโนมัติ

### 5. เชื่อมต่อ Database

1. ใน Railway Dashboard
2. คลิก "Add Service" > "Database" > "MySQL"
3. Railway จะสร้าง MySQL database ให้
4. คัดลอก connection string
5. อัปเดต environment variables

### 6. ตั้งค่า Environment Variables

ใน Railway Dashboard:
- DB_HOST: mysql host
- DB_USER: mysql user  
- DB_PASSWORD: mysql password
- DB_NAME: database name
- PORT: 3001
- NODE_ENV: production

### 7. อัปเดต Flutter App

เปลี่ยน baseUrl ใน car_service.dart:
```dart
static const String baseUrl = 'https://your-app-name.railway.app';
```

## วิธีอื่นๆ

### ใช้ Render.com
1. ไปที่ https://render.com
2. สมัครสมาชิก
3. เชื่อมต่อ GitHub
4. สร้าง Web Service
5. เลือก repository
6. ตั้งค่า environment variables

### ใช้ Vercel
1. ไปที่ https://vercel.com
2. สมัครสมาชิกด้วย GitHub
3. Import project
4. Deploy

## ข้อดี-ข้อเสีย

### Railway
✅ ฟรี
✅ รองรับ MySQL
✅ Auto-deploy จาก GitHub
❌ อาจช้าในบางครั้ง

### Render
✅ ฟรี
✅ เร็ว
✅ รองรับหลาย database
❌ จำกัด bandwidth

### Vercel
✅ เร็วมาก
✅ ฟรี
❌ รองรับแค่ serverless functions
❌ ไม่เหมาะกับ MySQL

## แนะนำ
ใช้ **Railway** เพราะ:
- ฟรี
- รองรับ MySQL
- ง่ายต่อการใช้งาน
- มี auto-deploy
