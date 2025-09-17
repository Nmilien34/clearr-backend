# Clearr API - Frontend Quick Reference

## Base URL
```
http://localhost:3000 (development)
https://your-render-url.com (production)
```

## Authentication
Add this header to protected endpoints:
```javascript
headers: {
  'Authorization': 'Bearer ' + userToken,
  'Content-Type': 'application/json'
}
```

## Quick Endpoint List

### 🔓 **Public Endpoints (No Auth Required)**
```javascript
// Send OTP
POST /api/send-otp
Body: { "phoneNumber": "+1234567890" }

// Verify OTP & Login/Signup
POST /api/verify-otp
Body: {
  "phoneNumber": "+1234567890",
  "otpCode": "123456",
  "fullName": "John Doe",  // Required for new users
  "email": "john@email.com" // Optional
}
```

### 🔒 **Protected Endpoints (Require Auth Token)**

#### User Management
```javascript
// Get user profile
GET /api/users/:userId

// Update profile
POST /api/update-profile
Body: { "fullName": "New Name", "email": "new@email.com" }

// Complete onboarding
POST /api/complete-onboarding
Body: { "preferredMode": "professional" }

// Delete account
POST /api/delete-account
Body: { "confirmDelete": true, "reason": "Optional reason" }
```

#### Modes Management
```javascript
// Get user's modes
GET /api/users/:userId/modes

// Create new mode
POST /api/users/:userId/modes
Body: {
  "name": "Work Mode",
  "description": "For workplace communication",
  "isDefault": true,
  "prompt": "Make messages professional"
}

// Update mode
PUT /api/users/:userId/modes/:modeId
Body: { "name": "Updated Name", "isDefault": true }

// Delete mode
DELETE /api/users/:userId/modes/:modeId

// Set default mode
PUT /api/users/:userId/selected-mode
Body: { "modeId": "mode123" }
```

#### Translations
```javascript
// Create translation
POST /api/translations
Body: {
  "translationInput": "I'm so angry about this!",
  "modeId": "mode123" // Optional - uses default if not provided
}

// Get translation history
GET /api/translations/history/:userId?limit=20&skip=0

// Get specific translation
GET /api/translations/:translationId

// Regenerate translation (get new version)
POST /api/translations/:translationId/regenerate

// Delete translation
DELETE /api/translations/:translationId
```

## Typical Frontend Flow

### 1. Authentication Flow
```javascript
// Step 1: Send OTP
const otpResponse = await fetch('/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: '+1234567890' })
});

// Step 2: Verify OTP
const authResponse = await fetch('/api/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    otpCode: '123456',
    fullName: 'John Doe' // Only for new users
  })
});

const { token, user, isNewUser } = authResponse.data;
// Save token for future requests
```

### 2. First-Time User Setup
```javascript
// If isNewUser === true, create first mode
const modeResponse = await fetch(`/api/users/${userId}/modes`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Personal',
    description: 'For personal conversations',
    isDefault: true
  })
});
```

### 3. Translation Flow
```javascript
// Translate a message
const translationResponse = await fetch('/api/translations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    translationInput: "I'm frustrated with this situation!",
    modeId: selectedModeId // Optional
  })
});

const { translation, translationOutput } = translationResponse.data;
// translationOutput is an array of enhanced message versions
```

## Response Format
All responses follow this format:
```javascript
{
  "success": true/false,
  "message": "Description",
  "data": { /* actual data */ },
  "statusCode": 200
}
```

## Error Codes
- `400` - Bad request (validation errors)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (can't access resource)
- `404` - Not found
- `500` - Server error

## Important Notes
1. **Phone Format**: Always use E.164 format (`+1234567890`)
2. **User IDs**: Get from auth response, use in subsequent calls
3. **Mode System**: Users must have at least one mode to translate
4. **Token Storage**: Save JWT token securely for authenticated requests
5. **Default Mode**: If no modeId provided, uses user's default mode