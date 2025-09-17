# Clearr Backend API Documentation

## Base URL
`http://localhost:3000` (development)

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints (`/api`)

### 1. Send OTP
**POST** `/api/send-otp`

**Description:** Send OTP to phone number for verification

**Request Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Verification code sent successfully",
  "statusCode": 200
}

// Error (400)
{
  "success": false,
  "message": "Invalid phone number format",
  "statusCode": 400
}
```

### 2. Verify OTP
**POST** `/api/verify-otp`

**Description:** Verify OTP and authenticate user (login/signup)

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "otpCode": "123456",
  "fullName": "John Doe", // Required for new users
  "email": "john@example.com" // Optional
}
```

**Response:**
```json
// Success - New User (201)
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "userId123",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "email": "john@example.com",
      "preferredMode": "personal",
      "notificationEnabled": true,
      "isActive": true,
      "isVerified": true,
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    "token": "jwt_token_here",
    "isNewUser": true
  },
  "statusCode": 201
}

// Success - Existing User (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "isNewUser": false
  },
  "statusCode": 200
}
```

### 3. Update Profile
**POST** `/api/update-profile` 🔒

**Description:** Update user profile information

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "newemail@example.com",
  "preferredMode": "professional",
  "notificationEnabled": false,
  "pushToken": "firebase_push_token"
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  },
  "statusCode": 200
}
```

### 4. Complete Onboarding
**POST** `/api/complete-onboarding` 🔒

**Description:** Complete user onboarding process

**Request Body:**
```json
{
  "preferredMode": "professional", // Optional, defaults to "personal"
  "notificationEnabled": true // Optional, defaults to true
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Onboarding completed successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### 5. Delete Account
**POST** `/api/delete-account` 🔒

**Description:** Delete user account (soft delete)

**Request Body:**
```json
{
  "confirmDelete": true, // Required - must be true to confirm deletion
  "reason": "Not using the app anymore" // Optional - for analytics
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Account deactivated successfully",
  "statusCode": 200
}

// Error - Missing confirmation (400)
{
  "success": false,
  "message": "Account deletion must be confirmed",
  "statusCode": 400
}
```

---

## User Endpoints (`/api/users`) 🔒

### 1. Get User Profile
**GET** `/api/users/:userId`

**Description:** Get user profile by ID

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "userId123",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "email": "john@example.com",
    "preferredMode": "professional",
    "notificationEnabled": true,
    "translationIds": ["transId1", "transId2"],
    "contextTraining": ["example1", "example2"],
    "isActive": true,
    "createdAt": "2023-12-01T10:00:00.000Z"
  },
  "statusCode": 200
}
```

### 2. Get User's Modes
**GET** `/api/users/:userId/modes`

**Description:** Get all communication modes for a user

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Modes retrieved successfully",
  "data": [
    {
      "_id": "modeId123",
      "userId": "userId123",
      "name": "Professional",
      "description": "For workplace communication",
      "isDefault": true,
      "isActive": true,
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    {
      "_id": "modeId456",
      "userId": "userId123",
      "name": "Family Chat",
      "description": "For family conversations",
      "isDefault": false,
      "isActive": true,
      "createdAt": "2023-12-01T11:00:00.000Z"
    }
  ],
  "statusCode": 200
}
```

### 3. Update Mode
**PUT** `/api/users/:userId/modes/:modeId`

**Description:** Update a specific communication mode

**Request Body:**
```json
{
  "name": "Updated Professional",
  "description": "Updated description for workplace communication",
  "isDefault": true
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Mode updated successfully",
  "data": {
    "_id": "modeId123",
    "userId": "userId123",
    "name": "Updated Professional",
    "description": "Updated description for workplace communication",
    "isDefault": true,
    "isActive": true,
    "updatedAt": "2023-12-01T12:00:00.000Z"
  },
  "statusCode": 200
}
```

### 4. Create New Mode
**POST** `/api/users/:userId/modes`

**Description:** Create a new custom communication mode

**Request Body:**
```json
{
  "name": "Team Meetings",
  "description": "For team meeting communications",
  "isDefault": false,
  "prompt": "Transform messages to be clear and action-oriented for team meetings"
}
```

**Response:**
```json
// Success (201)
{
  "success": true,
  "message": "Mode created successfully",
  "data": {
    "mode": {
      "_id": "newModeId",
      "userId": "userId123",
      "name": "Team Meetings",
      "description": "For team meeting communications",
      "isDefault": false,
      "isActive": true,
      "createdAt": "2023-12-01T13:00:00.000Z"
    },
    "prompt": {
      "_id": "promptId",
      "modeId": "newModeId",
      "prompt": "Transform messages to be clear and action-oriented for team meetings",
      "isActive": true,
      "createdAt": "2023-12-01T13:00:00.000Z"
    }
  },
  "statusCode": 201
}
```

### 5. Delete Mode
**DELETE** `/api/users/:userId/modes/:modeId`

**Description:** Delete a communication mode (soft delete)

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Mode deleted successfully",
  "statusCode": 200
}
```

### 6. Update Selected Mode
**PUT** `/api/users/:userId/selected-mode`

**Description:** Set the default/selected mode for a user

**Request Body:**
```json
{
  "modeId": "modeId123"
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Selected mode updated successfully",
  "statusCode": 200
}
```

### 7. Get User Statistics
**GET** `/api/users/:userId/stats`

**Description:** Get user's usage statistics

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "totalTranslations": 145,
    "translationsByMode": {
      "professional": 85,
      "personal": 45,
      "casual": 15
    },
    "joinedDate": "2023-12-01T10:00:00.000Z"
  },
  "statusCode": 200
}
```

---

## Translation Endpoints (`/api/translations`) 🔒

### 1. Create Translation
**POST** `/api/translations`

**Description:** Create a new message translation

**Request Body:**
```json
{
  "translationInput": "I'm so angry that you forgot our anniversary again!",
  "modeId": "modeId123" // Optional - uses default mode if not provided
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Translation completed successfully",
  "data": {
    "translation": {
      "_id": "translationId123",
      "userId": "userId123",
      "mode": "Professional",
      "translationInput": "I'm so angry that you forgot our anniversary again!",
      "translationOutput": [
        "I was really looking forward to celebrating our anniversary together, and I felt hurt when it passed by. These special moments mean a lot to me, and I'd love to find ways we can both remember and celebrate them."
      ],
      "isActive": true,
      "createdAt": "2023-12-01T14:00:00.000Z"
    },
    "translationOutput": [
      "I was really looking forward to celebrating our anniversary together, and I felt hurt when it passed by. These special moments mean a lot to me, and I'd love to find ways we can both remember and celebrate them."
    ]
  },
  "statusCode": 200
}

// Error - No default mode (400)
{
  "success": false,
  "message": "No default mode found. Please create a mode first.",
  "statusCode": 400
}

// Error - Harmful content (400)
{
  "success": false,
  "message": "Cannot process this type of content",
  "statusCode": 400
}
```

### 2. Get Translation History
**GET** `/api/translations/history/:userId?limit=20&skip=0`

**Description:** Get translation history for a user

**Query Parameters:**
- `limit` (optional): Number of translations to return (default: 20)
- `skip` (optional): Number of translations to skip (default: 0)

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Translation history retrieved",
  "data": [
    {
      "_id": "translationId123",
      "userId": "userId123",
      "mode": "Professional",
      "translationInput": "Original message",
      "translationOutput": ["Enhanced message"],
      "createdAt": "2023-12-01T14:00:00.000Z"
    },
    // ... more translations
  ],
  "statusCode": 200
}
```

### 3. Get Specific Translation
**GET** `/api/translations/:translationId`

**Description:** Get a specific translation by ID

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Translation retrieved successfully",
  "data": {
    "_id": "translationId123",
    "userId": "userId123",
    "mode": "Professional",
    "translationInput": "Original message",
    "translationOutput": ["Enhanced message"],
    "isActive": true,
    "createdAt": "2023-12-01T14:00:00.000Z"
  },
  "statusCode": 200
}
```

### 4. Regenerate Translation
**POST** `/api/translations/:translationId/regenerate`

**Description:** Generate a new version of an existing translation

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Translation regenerated successfully",
  "data": {
    "translation": {
      "_id": "translationId123",
      "translationOutput": [
        "Original enhanced message",
        "New regenerated version"
      ]
      // ... other fields
    },
    "newOutput": ["New regenerated version"]
  },
  "statusCode": 200
}
```

### 5. Update Selected Version
**PATCH** `/api/translations/:translationId/selected-version`

**Description:** Update which version of the translation is selected

**Request Body:**
```json
{
  "selectedIndex": 1
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Selected version updated successfully"
}
```

### 6. Delete Translation
**DELETE** `/api/translations/:translationId`

**Description:** Delete a translation (soft delete)

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Translation deleted successfully",
  "statusCode": 200
}
```

---

## Error Response Format

All endpoints follow this error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400 // or appropriate error code
}
```

### Common Error Codes:
- `400` - Bad Request (validation errors, missing required fields)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (access denied to resource)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server issues)

---

## Rate Limiting & Usage Notes

1. **Authentication**: Phone-only OTP system, no passwords required
2. **Mode System**: Users create custom communication modes with optional prompts
3. **AI Processing**: Uses OpenAI GPT-4 for message transformation
4. **Content Safety**: Basic filtering for harmful content (self-harm, violence)
5. **Data Storage**: All translations and user data stored in MongoDB
6. **Token Expiry**: JWT tokens expire after 7 days

---

## Example Workflow

1. **User Registration/Login:**
   ```
   POST /api/send-otp → POST /api/verify-otp
   ```

2. **Create First Mode:**
   ```
   POST /api/users/:userId/modes
   ```

3. **Translate Message:**
   ```
   POST /api/translations
   ```

4. **View History:**
   ```
   GET /api/translations/history/:userId
   ```