#!/bin/bash

# Railway Deployment Script
# สคริปต์นี้จะช่วยเตรียมไฟล์สำหรับ deploy ไปยัง Railway

echo "🚀 Preparing for Railway deployment..."

# ตรวจสอบว่ามีไฟล์ที่จำเป็นหรือไม่
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

# สร้างไฟล์ .gitignore ถ้ายังไม่มี
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.production
uploads/
*.log
.DS_Store
EOF
fi

# สร้างไฟล์ README.md สำหรับ deployment
echo "📝 Creating README.md..."
cat > README.md << EOF
# DriveDi API

Shared API server for DriveDi car rental application.

## Features

- User authentication and registration
- Car management
- Image upload
- Email notifications
- MySQL database integration

## Environment Variables

Copy \`env.example\` to \`.env\` and configure:

- DB_HOST: MySQL host
- DB_USER: MySQL username
- DB_PASSWORD: MySQL password
- DB_NAME: Database name
- PORT: Server port (default: 3001)
- JWT_SECRET: Secret key for JWT tokens

## Deployment

This project is configured for Railway deployment.

1. Connect your GitHub repository to Railway
2. Add MySQL database service
3. Configure environment variables
4. Deploy!

## API Endpoints

- POST /api/register - User registration
- POST /api/login - User login
- GET /api/cars - Get all cars
- POST /api/register-car - Register new car
- And more...

## License

MIT
EOF

echo "✅ Files prepared for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push code to GitHub repository"
echo "2. Go to https://railway.app"
echo "3. Create new project from GitHub repo"
echo "4. Add MySQL database service"
echo "5. Configure environment variables"
echo "6. Deploy!"
echo ""
echo "🔗 Railway: https://railway.app"
echo "📚 Documentation: https://docs.railway.app"
