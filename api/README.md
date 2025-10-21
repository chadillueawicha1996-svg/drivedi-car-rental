# DriveDi API

Shared API server for DriveDi car rental application.

## Features

- User authentication and registration
- Car management
- Image upload
- Email notifications
- MySQL database integration

## Environment Variables

Copy `env.example` to `.env` and configure:

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
