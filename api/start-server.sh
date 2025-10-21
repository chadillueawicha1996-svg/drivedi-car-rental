#!/bin/bash

# สคริปต์สำหรับเริ่ม API Server
echo "🚀 กำลังเริ่ม API Server..."

# ตรวจสอบว่า port 3001 ว่างหรือไม่
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 ถูกใช้งานอยู่ กำลังปิด process เดิม..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
fi

# เริ่ม server
cd "$(dirname "$0")"
PORT=3001 node server.js
