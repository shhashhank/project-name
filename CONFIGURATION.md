# Configuration Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration (for future auth)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Email Configuration (for future notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Configuration (for future integration)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create database**:
   ```bash
   createdb nestjs_db_test
   ```
3. **Update environment variables** with your database credentials
4. **Run the application** - tables will be created automatically in development mode

## Development vs Production

### Development
- `NODE_ENV=development`
- `synchronize: true` (auto-creates tables)
- `logging: true` (SQL queries logged)
- Detailed error messages

### Production
- `NODE_ENV=production`
- `synchronize: false` (use migrations)
- `logging: false` (no SQL logging)
- Minimal error messages
- Connection pooling enabled

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database
3. **Rotate JWT secrets** regularly
4. **Use HTTPS** in production
5. **Validate all inputs** (already implemented with class-validator) 