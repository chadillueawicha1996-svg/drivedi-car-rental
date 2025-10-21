// Database Configuration
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rentcar_db',
    port: process.env.DB_PORT || 3306,
    socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  email: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  },
  server: {
    port: process.env.PORT || 3001
  }
};

export default config; 