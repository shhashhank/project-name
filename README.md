# E-commerce Backend API

A scalable NestJS-based e-commerce backend with a clean, modular architecture designed for easy feature expansion.

## 🏗️ Architecture Overview

This project follows a **feature-based modular architecture** with clear separation of concerns:

```
src/
├── modules/                 # Feature modules
│   ├── products/           # Product management
│   │   ├── controllers/    # HTTP controllers
│   │   ├── services/       # Business logic
│   │   ├── dto/           # Data transfer objects
│   │   └── entities/      # Database models
│   └── orders/            # Order management (future)
│       ├── controllers/
│       ├── services/
│       ├── dto/
│       └── entities/
├── common/                 # Shared utilities
│   ├── dto/               # Common DTOs
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Request/response interceptors
│   └── filters/           # Exception filters
├── config/                # Configuration files
├── database/              # Database-related files
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
└── app.module.ts          # Root module
```

## 🚀 Features

### ✅ Implemented
- **Product Management**: Full CRUD operations with UUID primary keys
- **Database Integration**: PostgreSQL with Sequelize ORM
- **API Documentation**: Swagger/OpenAPI integration
- **Validation**: Class-validator integration with UUID validation
- **Error Handling**: Comprehensive error management
- **TypeScript**: Full type safety
- **Security**: UUID-based IDs for better security and distributed systems support

### 🔄 Planned Features
- **Order Management**: Complete order lifecycle
- **User Authentication**: JWT-based auth
- **Payment Integration**: Stripe/PayPal support
- **Inventory Management**: Stock tracking
- **Email Notifications**: Order confirmations
- **File Upload**: Product images
- **Caching**: Redis integration
- **Testing**: Unit and integration tests

## 📋 API Endpoints

### Products
- `POST /products` - Create a new product
- `GET /products` - Get all active products
- `GET /products/:id` - Get product by ID (UUID)
- `PATCH /products/:id` - Update a product (UUID)
- `DELETE /products/:id` - Delete a product (UUID)

## 🛠️ Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb nestjs_db_test
   ```

5. **Run the application**
   ```bash
   npm run start:dev
   ```

## 🔧 Configuration

### Database Configuration
The database configuration is centralized in `src/config/database.config.ts`:

```typescript
export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'shashankshekhar',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestjs_db_test',
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== 'production',
  // ... more config
};
```

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
NODE_ENV=development
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🏛️ Architecture Principles

### 1. **Modular Design**
- Each feature is a separate module
- Clear separation of concerns
- Easy to add new features

### 2. **Scalability**
- Feature-based folder structure
- Reusable components
- Centralized configuration

### 3. **Maintainability**
- Consistent naming conventions
- TypeScript for type safety
- Comprehensive error handling

### 4. **Extensibility**
- Easy to add new modules
- Shared utilities in common folder
- Standardized DTOs and responses

## 🔄 Adding New Features

### 1. Create a new module
```bash
mkdir -p src/modules/feature-name/{controllers,services,dto,entities}
```

### 2. Create the entity
```typescript
// src/modules/feature-name/entities/feature.entity.ts
@Table({ tableName: 'features' })
export class Feature extends Model {
  // ... entity definition
}
```

### 3. Create DTOs
```typescript
// src/modules/feature-name/dto/create-feature.dto.ts
export class CreateFeatureDto {
  // ... DTO definition
}
```

### 4. Create service
```typescript
// src/modules/feature-name/services/feature.service.ts
@Injectable()
export class FeatureService {
  // ... service methods
}
```

### 5. Create controller
```typescript
// src/modules/feature-name/controllers/feature.controller.ts
@Controller('features')
export class FeatureController {
  // ... controller methods
}
```

### 6. Create module
```typescript
// src/modules/feature-name/feature.module.ts
@Module({
  imports: [SequelizeModule.forFeature([Feature])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### 7. Import in app module
```typescript
// src/app.module.ts
imports: [
  // ... other imports
  FeatureModule,
]
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Performance Considerations

- Database connection pooling configured
- Proper indexing on database tables
- Efficient query patterns
- Error handling and logging

## 🔒 Security

- Input validation with class-validator
- SQL injection prevention with Sequelize
- Proper error handling (no sensitive data exposure)
- Environment variable configuration

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DB_HOST=your_production_db_host
   # ... other production configs
   ```

3. **Run migrations**
   ```bash
   npm run migration:run
   ```

4. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include Swagger documentation
4. Add error handling
5. Write tests for new features

## 📄 License

This project is licensed under the MIT License.
