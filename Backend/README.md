# Clearr Backend

A modern Node.js/TypeScript backend API for the Clearr application.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **Security**: Helmet.js for security headers, CORS support
- **Logging**: Morgan for HTTP logging + custom request logging
- **Error Handling**: Centralized error handling with custom error classes
- **Code Quality**: ESLint + Prettier for code formatting
- **Testing**: Jest setup for unit testing
- **Environment**: Environment variable management with dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your configuration.

3. **Build the project:**
   ```bash
   npm run build
   ```

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run dev:watch` | Start development server with nodemon |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── index.ts              # Main application entry point
├── types/                # TypeScript type definitions
│   └── index.ts
├── middleware/           # Express middleware
│   └── errorHandler.ts
├── routes/               # API routes
│   └── index.ts
└── utils/                # Utility functions
    └── logger.ts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Add other environment variables as needed
```

### TypeScript Configuration

The project uses a strict TypeScript configuration with:
- Strict type checking enabled
- Source maps for debugging
- Declaration files generation
- Modern ES2020 target

## 🧪 Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📝 API Endpoints

### Base URL: `http://localhost:3000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/health` | GET | Health check |
| `/api/v1/health` | GET | API health check |
| `/api/v1/example` | GET | Example endpoint |

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request body parsing and validation
- **Error Handling**: Secure error responses (no sensitive data in production)

## 📊 Logging

The application includes comprehensive logging:
- HTTP request logging with Morgan
- Custom request/response logging
- Error logging with stack traces
- Development-only debug logging

## 🚀 Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Environment setup:**
   - Set `NODE_ENV=production`
   - Configure production environment variables
   - Set up proper logging and monitoring

## 🤝 Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 📄 License

ISC License
