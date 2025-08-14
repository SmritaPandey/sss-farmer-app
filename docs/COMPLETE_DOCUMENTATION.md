# SSS Farmer App - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Features and Functionality](#features-and-functionality)
4. [User Interface Design](#user-interface-design)
5. [Data Models](#data-models)
6. [API Integration](#api-integration)
7. [Development Setup](#development-setup)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Guide](#deployment-guide)
10. [Maintenance and Support](#maintenance-and-support)

## Project Overview

### Purpose
The SSS (Sahakar Se Samriddhi) Farmer App is a comprehensive mobile application designed to serve approximately 2.5 crore farmers in Uttar Pradesh, India. The application acts as a single-window platform integrating 7,500+ Primary Agricultural Credit Societies (PACS) and multiple government departments to provide seamless access to agricultural services, government schemes, and market information.

### Vision
To digitally empower farmers by providing a unified platform for accessing agricultural services, government benefits, and market opportunities while promoting cooperative farming and financial inclusion.

### Mission
- Simplify access to government schemes and subsidies
- Enable efficient communication between farmers and PACS
- Provide real-time market information and pricing
- Facilitate digital transactions and record-keeping
- Support multilingual accessibility for diverse farmer communities

### Target Audience
- **Primary Users**: Farmers (Small, Marginal, and Large scale)
- **Secondary Users**: PACS staff, FPO/Buyers, Department Officers
- **Administrative Users**: State Admins, Nodal Officers, System Integrators

### Key Benefits
- **For Farmers**: Easy access to schemes, services, and market information
- **For PACS**: Streamlined operations and better farmer engagement
- **For Government**: Improved service delivery and policy implementation tracking
- **For Ecosystem**: Enhanced transparency and data-driven decision making

## Technical Architecture

### Technology Stack

#### Frontend (Mobile Application)
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router v5 (file-based routing)
- **State Management**: React Hooks with Local Storage
- **UI Components**: Custom components with React Native base components
- **Internationalization**: Custom i18n context for Hindi/English support
- **Styling**: StyleSheet API with custom theme system
- **Icons**: @expo/vector-icons with custom agricultural icon set

#### Backend Integration
- **API Architecture**: RESTful services with BFF (Backend for Frontend) pattern
- **Authentication**: Phone OTP-based authentication with JWT tokens
- **Data Storage**: AsyncStorage for local caching and offline support
- **Push Notifications**: Expo Notifications service
- **File Handling**: Expo Image Picker and Document Picker

#### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint configuration
- **Version Control**: Git
- **Build System**: Expo EAS Build
- **Testing**: Jest (configured but not extensively implemented)

#### Platform Support
- **Android**: Primary target platform
- **iOS**: Secondary support
- **Web**: Development preview support

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   API Gateway   │    │   Backend       │
│   (React Native)│◄──►│   (BFF Pattern) │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   Integration   │    │   External APIs │
│   (AsyncStorage)│    │   Adapters      │    │   (Dept Systems)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Framework
- **Authentication**: Multi-factor authentication with OTP
- **Data Encryption**: AES encryption for sensitive data
- **API Security**: JWT tokens with expiration
- **Device Security**: Biometric authentication support
- **Privacy**: GDPR-compliant data handling

## Features and Functionality

### Core Features

#### 1. User Onboarding and Authentication
- **Language Selection**: Hindi/English language preference
- **Phone Verification**: OTP-based mobile number verification
- **Consent Management**: Data sharing and notification permissions
- **Farmer ID Linking**: 16-digit unique farmer ID verification and linking
- **Profile Creation**: Comprehensive farmer profile setup

#### 2. Farmer Profile Management
- **Personal Information**: Name, father's name, contact details
- **Agricultural Data**: Land holdings, crop details, livestock information
- **Financial Information**: Bank account details (masked for security)
- **Location Data**: District, block, tehsil, and PACS association
- **Document Management**: KYC documents and certificates storage

#### 3. Government Schemes Discovery
- **Scheme Catalog**: Browse available government schemes
- **Eligibility Check**: Automated eligibility assessment
- **Application Status**: Track scheme application progress
- **Document Requirements**: List of required documents for each scheme
- **Benefit Calculator**: Calculate potential benefits from schemes

#### 4. Service Requests
- **Loan Applications**: Apply for agricultural loans and subsidies
- **Fertilizer Requests**: Express interest in fertilizer procurement
- **Sell Produce**: Register intent to sell agricultural produce
- **MSP Registration**: Pre-registration for Minimum Support Price centers
- **Service Tracking**: Monitor request status and timeline

#### 5. PACS Services Integration
- **Directory**: Complete PACS directory with contact information
- **Inventory Information**: Real-time fertilizer and input availability
- **Service Catalog**: Available services at each PACS center
- **Location Services**: Find nearest PACS centers

#### 6. Market Information
- **Procurement Status**: MSP center information and status
- **Price Information**: Current market rates for crops
- **Quality Standards**: Crop quality requirements and grading
- **Transportation**: Logistics and transportation arrangements

#### 7. Notifications and Communications
- **In-app Notifications**: Real-time updates and alerts
- **SMS Integration**: Fallback SMS notifications
- **WhatsApp Integration**: Rich media notifications via WhatsApp
- **IVR Support**: Voice-based notifications for non-literate users

#### 8. Digital Identity and Certificates
- **Farmer ID Card**: Digital farmer identity card
- **QR Code**: Machine-readable farmer identification
- **Certificate Storage**: Digital certificates and documents
- **Sharing Functionality**: Share documents via various channels

#### 9. Helpdesk and Support
- **Ticket Creation**: Raise support tickets and grievances
- **Ticket Tracking**: Monitor resolution progress
- **FAQ Section**: Common questions and answers
- **Contact Information**: Direct contact with support teams

### Advanced Features

#### 1. Multilingual Support
- **Language Toggle**: Switch between Hindi and English
- **Font Scaling**: Accessibility-compliant text sizing
- **Cultural Adaptation**: Localized content and imagery
- **Voice Support**: Text-to-speech capabilities (planned)

#### 2. Offline Functionality
- **Data Caching**: Store frequently accessed data locally
- **Offline Forms**: Complete forms without internet connectivity
- **Sync Mechanism**: Automatic data synchronization when online
- **Offline Maps**: Basic location services without internet

#### 3. Accessibility Features
- **Screen Reader Support**: Compatible with accessibility tools
- **High Contrast Mode**: Enhanced visibility for visual impairments
- **Large Text Support**: Scalable font sizes
- **Voice Navigation**: Audio guidance for navigation

## User Interface Design

### Design Philosophy
The app follows a **farmer-first design approach** with emphasis on:
- **Simplicity**: Intuitive navigation and minimal cognitive load
- **Cultural Relevance**: Colors and imagery relevant to Indian agriculture
- **Accessibility**: Support for users with varying digital literacy
- **Performance**: Fast loading and responsive interactions

### Visual Design System

#### Color Palette
- **Primary Brand Colors**:
  - Saffron: `#FF9933` (Represents Indian heritage)
  - Green: `#138808` (Agricultural theme)
  - White: `#FFFFFF` (Clean and pure)

- **Secondary Colors**:
  - Light Saffron: `#FFF4E6`
  - Light Green: `#F0F9FF`
  - Gray shades for text and backgrounds

#### Typography
- **Primary Font**: System default fonts for better performance
- **Heading Sizes**: 24px, 20px, 18px for hierarchy
- **Body Text**: 16px for readability
- **Caption Text**: 14px for supporting information

#### Iconography
- **Agricultural Icons**: Custom designed icons for farming activities
- **System Icons**: Standard iOS/Android icons for common actions
- **Accessibility**: All icons have proper labels and descriptions

### Screen Layout Patterns

#### 1. Header Pattern
```
┌─────────────────────────────────────────┐
│  [Back] [Screen Title]    [Notifications]│
└─────────────────────────────────────────┘
```

#### 2. Card Layout
```
┌─────────────────────────────────────────┐
│  [Icon] [Title]                         │
│         [Description]                   │
│         [Action Button]                 │
└─────────────────────────────────────────┘
```

#### 3. Form Layout
```
┌─────────────────────────────────────────┐
│  [Field Label]                          │
│  [Input Field]                          │
│  [Validation Message]                   │
│                                         │
│  [Submit Button]                        │
└─────────────────────────────────────────┘
```

### Navigation Structure

#### Tab Navigation (Primary)
1. **Home** - Dashboard with quick actions
2. **Explore** - Discover services and schemes

#### Stack Navigation (Secondary)
- Onboarding flow (Language → OTP → Consent → Registration)
- Profile management screens
- Service-specific flows (Loans, Fertilizer, etc.)
- Settings and support screens

### User Experience Guidelines

#### 1. Information Hierarchy
- **Primary Information**: Most important content at the top
- **Secondary Information**: Supporting details below primary
- **Actions**: Clear call-to-action buttons

#### 2. Feedback Mechanisms
- **Loading States**: Progress indicators for all async operations
- **Success Messages**: Confirmation for completed actions
- **Error Handling**: Clear error messages with recovery options
- **Validation**: Real-time form validation with helpful hints

#### 3. Performance Considerations
- **Image Optimization**: Compressed images for faster loading
- **Lazy Loading**: Load content as needed
- **Caching Strategy**: Cache frequently accessed data
- **Offline Graceful Degradation**: Meaningful offline experience

## Data Models

### Core Data Entities

#### 1. Farmer Profile
```typescript
interface FarmerProfile {
  id: string;                    // Internal ID
  farmerId: string;              // 16-digit unique farmer ID
  uid: string;                   // User authentication ID
  phone: string;                 // Mobile number
  name: string;                  // Full name
  fatherName: string;            // Father's name
  dateOfBirth?: string;          // Date of birth
  gender?: 'male' | 'female' | 'other';
  
  // Location Information
  district: string;              // District name
  block: string;                 // Block/Tehsil name
  village?: string;              // Village name
  pincode: string;               // PIN code
  
  // Agricultural Information
  pacsName?: string;             // Associated PACS
  farmerTypes: string[];         // Farmer categories
  landHoldings: LandHolding[];   // Land ownership details
  crops: CropDetail[];           // Crop information
  livestock: LivestockDetail[];  // Livestock information
  
  // Financial Information
  bankMasked?: string;           // Masked bank account
  
  // Documents and Media
  photoUri?: string;             // Profile photo
  documents: Document[];         // KYC and other documents
  
  // Preferences
  languagePreference: 'hi' | 'en';
  notificationConsent: boolean;
  dataSharing consent: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}
```

#### 2. Land Holding
```typescript
interface LandHolding {
  id: string;
  surveyNumber: string;          // Survey/Khasra number
  area: number;                  // Area in acres/hectares
  unit: 'acres' | 'hectares';
  landType: 'irrigated' | 'rainfed' | 'barren';
  ownershipType: 'owned' | 'leased' | 'sharecrop';
  documents: string[];           // Land document references
}
```

#### 3. Service Request
```typescript
interface ServiceRequest {
  id: string;
  farmerId: string;              // Reference to farmer
  type: 'loan' | 'fertilizer' | 'sell' | 'msp' | 'grievance';
  title: string;                 // Request title
  description: string;           // Request description
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Request-specific data
  payload: any;                  // Type-specific request data
  documents: string[];           // Supporting documents
  
  // Assignment and Processing
  assignedTo?: string;           // PACS/Officer assignment
  assignedAt?: string;
  processingNotes?: string[];
  
  // Timeline
  timeline: RequestTimeline[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
}
```

#### 4. Government Scheme
```typescript
interface GovernmentScheme {
  id: string;
  title: string;                 // Scheme name
  description: string;           // Scheme description
  department: string;            // Implementing department
  category: 'loan' | 'subsidy' | 'insurance' | 'direct_benefit';
  
  // Eligibility
  eligibilityCriteria: EligibilityCriterion[];
  targetBeneficiaries: string[];
  
  // Benefits
  benefits: string[];            // List of benefits
  maxAmount?: number;            // Maximum benefit amount
  subsidyPercentage?: number;    // Subsidy percentage
  
  // Application Process
  applicationProcess: string[];   // Step-by-step process
  requiredDocuments: string[];   // Required documents
  applicationDeadline?: string;   // Last date to apply
  
  // Status and Meta
  isActive: boolean;
  startDate: string;
  endDate?: string;
  
  // Additional Information
  contactInfo?: ContactInfo;
  officialWebsite?: string;
  faqs: FAQ[];
}
```

#### 5. PACS Information
```typescript
interface PACSInfo {
  id: string;
  name: string;                  // PACS name
  code: string;                  // Unique PACS code
  
  // Location
  district: string;
  block: string;
  village: string;
  address: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  
  // Contact Information
  phone?: string;
  email?: string;
  officerName?: string;
  
  // Services
  services: string[];            // Available services
  inventory: InventoryItem[];    // Current inventory
  operatingHours: OperatingHours;
  
  // Status
  isActive: boolean;
  lastUpdated: string;
}
```

#### 6. Notification
```typescript
interface Notification {
  id: string;
  farmerId: string;              // Target farmer
  type: 'scheme' | 'request' | 'general' | 'emergency';
  channel: 'in_app' | 'sms' | 'whatsapp' | 'ivr';
  
  // Content
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  
  // Delivery
  sentAt: string;
  readAt?: string;
  deliveredAt?: string;
  isRead: boolean;
  
  // Priority and Scheduling
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  expiresAt?: string;
}
```

### Data Relationships

#### Entity Relationship Overview
```
Farmer (1:N) ServiceRequest
Farmer (1:N) Notification  
Farmer (N:1) PACS
Farmer (N:M) GovernmentScheme (through applications)
ServiceRequest (1:N) RequestTimeline
GovernmentScheme (1:N) EligibilityCriterion
PACS (1:N) InventoryItem
```

### Data Storage Strategy

#### Local Storage (AsyncStorage)
- User authentication tokens
- Farmer profile cache
- Application preferences
- Offline form data
- Recently viewed schemes
- Notification cache

#### Server Storage
- Master farmer profiles
- Service request records
- Government scheme catalog
- PACS directory and inventory
- Transaction logs
- Analytics data

## API Integration

### Authentication APIs

#### 1. Send OTP
```http
POST /auth/otp/send
Content-Type: application/json

{
  "phone": "+91XXXXXXXXXX"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "uuid",
  "expiresIn": 300
}
```

#### 2. Verify OTP
```http
POST /auth/otp/verify
Content-Type: application/json

{
  "phone": "+91XXXXXXXXXX",
  "otp": "123456",
  "otpId": "uuid"
}

Response:
{
  "success": true,
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "uid": "user_id",
    "phone": "+91XXXXXXXXXX"
  }
}
```

### Farmer Identity APIs

#### 1. Validate Farmer ID
```http
POST /identity/farmer-id/validate
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmerId": "1234567890123456"
}

Response:
{
  "success": true,
  "isValid": true,
  "profile": {
    "name": "John Farmer",
    "district": "Lucknow",
    "block": "Mohanlalganj"
  }
}
```

#### 2. Link Farmer ID
```http
POST /identity/farmer-id/link
Authorization: Bearer {token}
Content-Type: application/json

{
  "uid": "user_id",
  "farmerId": "1234567890123456"
}

Response:
{
  "success": true,
  "linked": true,
  "profile": { /* farmer profile */ }
}
```

### Profile Management APIs

#### 1. Get Profile
```http
GET /profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "profile": {
    "id": "farmer_id",
    "name": "John Farmer",
    "phone": "+91XXXXXXXXXX",
    "district": "Lucknow",
    // ... complete profile
  }
}
```

#### 2. Update Profile
```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "farmer@example.com",
  "crops": [
    {"name": "Wheat", "area": 2.5, "season": "Rabi"}
  ]
}

Response:
{
  "success": true,
  "profile": { /* updated profile */ }
}
```

### Schemes Discovery APIs

#### 1. Get Schemes
```http
GET /schemes?district=Lucknow&category=subsidy&eligibleOnly=true
Authorization: Bearer {token}

Response:
{
  "success": true,
  "schemes": [
    {
      "id": "pm_kisan",
      "title": "PM-Kisan Samman Nidhi",
      "description": "Income support scheme",
      "eligibilityStatus": "eligible",
      "maxBenefit": 6000
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

#### 2. Get Scheme Details
```http
GET /schemes/pm_kisan
Authorization: Bearer {token}

Response:
{
  "success": true,
  "scheme": {
    "id": "pm_kisan",
    "title": "PM-Kisan Samman Nidhi",
    "description": "Direct income support",
    "benefits": ["₹6000 per year", "Direct bank transfer"],
    "eligibility": ["Small farmers", "Land ownership"],
    "documents": ["Aadhaar", "Bank details", "Land records"],
    "applicationDeadline": "2024-03-31"
  }
}
```

### Service Request APIs

#### 1. Create Request
```http
POST /requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "loan",
  "title": "Agricultural Loan Application",
  "description": "Loan for purchasing farming equipment",
  "payload": {
    "amount": 50000,
    "purpose": "Equipment purchase",
    "duration": 12
  },
  "documents": ["income_certificate", "land_record"]
}

Response:
{
  "success": true,
  "request": {
    "id": "req_123",
    "status": "pending",
    "trackingId": "TRK123456"
  }
}
```

#### 2. Get Requests
```http
GET /requests?status=pending&limit=20
Authorization: Bearer {token}

Response:
{
  "success": true,
  "requests": [
    {
      "id": "req_123",
      "type": "loan",
      "title": "Agricultural Loan",
      "status": "processing",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastUpdate": "2024-01-16T14:20:00Z"
    }
  ]
}
```

### PACS Services APIs

#### 1. Get PACS Directory
```http
GET /pacs?district=Lucknow&block=Mohanlalganj
Authorization: Bearer {token}

Response:
{
  "success": true,
  "pacs": [
    {
      "id": "pacs_001",
      "name": "Mohanlalganj PACS",
      "address": "Village Road, Mohanlalganj",
      "phone": "+91XXXXXXXXXX",
      "services": ["Fertilizer", "Seeds", "Loans"],
      "distance": 2.5
    }
  ]
}
```

#### 2. Get PACS Inventory
```http
GET /pacs/pacs_001/inventory
Authorization: Bearer {token}

Response:
{
  "success": true,
  "inventory": [
    {
      "item": "Urea",
      "quantity": 500,
      "unit": "bags",
      "price": 300,
      "availability": "in_stock",
      "lastUpdated": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Notification APIs

#### 1. Get Notifications
```http
GET /notifications?unread=true&limit=50
Authorization: Bearer {token}

Response:
{
  "success": true,
  "notifications": [
    {
      "id": "notif_001",
      "type": "scheme",
      "title": "New Scheme Available",
      "message": "PM-Kisan registration is now open",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### 2. Mark as Read
```http
POST /notifications/read
Authorization: Bearer {token}
Content-Type: application/json

{
  "notificationIds": ["notif_001", "notif_002"]
}

Response:
{
  "success": true,
  "markedCount": 2
}
```

### Error Handling

#### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid farmer ID format",
    "details": {
      "field": "farmerId",
      "expectedFormat": "16-digit numeric string"
    }
  }
}
```

#### Common Error Codes
- `AUTH_REQUIRED` - Authentication token required
- `AUTH_EXPIRED` - Token has expired
- `INVALID_REQUEST` - Request format is invalid
- `FARMER_ID_NOT_FOUND` - Farmer ID does not exist
- `ELIGIBILITY_CHECK_FAILED` - Scheme eligibility check failed
- `SERVICE_UNAVAILABLE` - External service temporarily unavailable
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Development Setup

### Prerequisites

#### System Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Git**: Latest version
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

#### Development Tools
- **VS Code**: Recommended IDE with React Native extensions
- **Expo CLI**: Global installation required
- **Android SDK**: API level 21 or higher
- **iOS SDK**: iOS 13.0 or higher (for iOS development)

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd sss-farmer-app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Install Expo CLI (if not already installed)
```bash
npm install -g @expo/cli
```

#### 4. Configure Environment
Create environment configuration files:

`.env.local`:
```env
API_BASE_URL=https://api.example.com
OTP_SERVICE_URL=https://otp.example.com
NOTIFICATION_SERVICE_URL=https://notifications.example.com
```

#### 5. Start Development Server
```bash
npm run start
# or
expo start
```

### Development Workflow

#### 1. Running on Devices

**Android Emulator:**
```bash
npm run android
# or
expo run:android
```

**iOS Simulator:**
```bash
npm run ios
# or
expo run:ios
```

**Physical Device:**
- Install Expo Go app from App Store/Play Store
- Scan QR code from development server

#### 2. Development Scripts

**Start Development Server:**
```bash
npm run start
```

**Run Linting:**
```bash
npm run lint
```

**Type Checking:**
```bash
npx tsc --noEmit
```

**Reset Project:**
```bash
npm run reset-project
```

### Project Structure

```
sss-farmer-app/
├── app/                          # Screen components (Expo Router)
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx             # Home screen
│   │   └── explore.tsx           # Explore screen
│   ├── onboarding/               # Onboarding flow
│   │   ├── language.tsx          # Language selection
│   │   ├── otp.tsx              # OTP verification
│   │   ├── consent.tsx          # Consent screen
│   │   ├── farmer-id.tsx        # Farmer ID linking
│   │   └── registration.tsx     # Profile registration
│   ├── profile.tsx              # Profile screen
│   ├── govt-schemes.tsx         # Government schemes
│   ├── loan-request.tsx         # Loan application
│   ├── fertilizer-request.tsx   # Fertilizer request
│   ├── notifications.tsx        # Notifications
│   └── settings.tsx             # Settings
├── components/                   # Reusable components
│   ├── UI/                      # Basic UI components
│   ├── FarmerCard.tsx           # Farmer ID card component
│   ├── BackgroundImage.tsx      # Background component
│   └── Tile.tsx                 # Card tile component
├── constants/                    # App constants
│   ├── Colors.ts                # Color definitions
│   ├── Theme.ts                 # Theme configuration
│   ├── models.ts                # Data models
│   └── mockData.ts              # Mock data for development
├── contexts/                     # React contexts
│   └── i18n.tsx                 # Internationalization context
├── hooks/                        # Custom React hooks
│   ├── useColorScheme.ts        # Theme hook
│   └── useThemeColor.ts         # Color hook
├── assets/                       # Static assets
│   ├── images/                  # Image files
│   ├── icons/                   # Icon files
│   └── fonts/                   # Font files
├── docs/                        # Documentation
│   ├── solution-blueprint.md    # Technical blueprint
│   ├── mobile-screens-map.md    # Screen mapping
│   └── icons-guide.md           # Icon usage guide
├── scripts/                     # Build and utility scripts
├── android/                     # Android-specific code
├── ios/                         # iOS-specific code (if needed)
├── package.json                 # Dependencies and scripts
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
├── tsconfig.json                # TypeScript configuration
└── eslint.config.js             # ESLint configuration
```

### Configuration Files

#### 1. Expo Configuration (`app.json`)
```json
{
  "expo": {
    "name": "SSS Farmer App",
    "slug": "sss-farmer-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "platforms": ["ios", "android", "web"],
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      ["expo-image-picker", {
        "photosPermission": "The app accesses your photos to let you share them."
      }]
    ],
    "scheme": "sss-farmer-app",
    "newArchEnabled": true
  }
}
```

#### 2. TypeScript Configuration (`tsconfig.json`)
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Best Practices

#### 1. Code Organization
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow React Native best practices
- Use consistent naming conventions
- Organize imports properly

#### 2. State Management
- Use React hooks for local state
- Implement AsyncStorage for persistent data
- Use context for global state when needed
- Avoid prop drilling

#### 3. Performance Optimization
- Implement lazy loading for screens
- Use FlatList for large lists
- Optimize images and assets
- Implement proper caching strategies

#### 4. Error Handling
- Implement try-catch blocks for async operations
- Provide meaningful error messages
- Implement fallback UI for errors
- Log errors for debugging

## Testing Strategy

### Testing Framework

#### Unit Testing
- **Framework**: Jest (React Native default)
- **Coverage**: Components, utilities, and business logic
- **Mocking**: API calls and external dependencies

#### Integration Testing
- **Framework**: React Native Testing Library
- **Scope**: Component interactions and user flows
- **Focus**: Critical user journeys

#### End-to-End Testing
- **Framework**: Detox (planned)
- **Scope**: Complete user workflows
- **Devices**: Android and iOS simulators

### Test Categories

#### 1. Component Tests
```typescript
// Example: FarmerCard component test
import React from 'react';
import { render } from '@testing-library/react-native';
import FarmerCard from '@/components/FarmerCard';

describe('FarmerCard', () => {
  it('renders farmer information correctly', () => {
    const props = {
      name: 'John Farmer',
      farmerId: '1234567890123456',
      district: 'Lucknow',
      block: 'Mohanlalganj'
    };
    
    const { getByText } = render(<FarmerCard {...props} />);
    
    expect(getByText('John Farmer')).toBeTruthy();
    expect(getByText('1234567890123456')).toBeTruthy();
  });
});
```

#### 2. API Integration Tests
```typescript
// Example: Authentication API test
import { sendOTP, verifyOTP } from '@/services/auth';

describe('Authentication API', () => {
  it('should send OTP successfully', async () => {
    const result = await sendOTP('+91XXXXXXXXXX');
    expect(result.success).toBe(true);
    expect(result.otpId).toBeDefined();
  });

  it('should verify OTP correctly', async () => {
    const result = await verifyOTP('+91XXXXXXXXXX', '123456', 'otpId');
    expect(result.success).toBe(true);
    expect(result.accessToken).toBeDefined();
  });
});
```

#### 3. User Flow Tests
```typescript
// Example: Onboarding flow test
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithNavigation } from '@/test-utils';
import OnboardingScreen from '@/app/onboarding/language';

describe('Onboarding Flow', () => {
  it('completes language selection and moves to OTP', async () => {
    const { getByText, getByTestId } = renderWithNavigation(<OnboardingScreen />);
    
    fireEvent.press(getByText('हिंदी'));
    fireEvent.press(getByText('Continue'));
    
    await waitFor(() => {
      expect(getByTestId('otp-screen')).toBeTruthy();
    });
  });
});
```

### Testing Configuration

#### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Test Execution

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- FarmerCard.test.tsx
```

#### Continuous Integration
- Integrate with GitHub Actions or similar CI/CD pipeline
- Run tests on every pull request
- Generate coverage reports
- Block merges if tests fail

### Mock Data and Fixtures

#### Test Data Setup
```typescript
// test-data/farmer-profiles.ts
export const mockFarmerProfile = {
  id: 'farmer_123',
  farmerId: '1234567890123456',
  name: 'Test Farmer',
  phone: '+91XXXXXXXXXX',
  district: 'Lucknow',
  block: 'Mohanlalganj'
};

export const mockSchemes = [
  {
    id: 'pm_kisan',
    title: 'PM-Kisan Samman Nidhi',
    status: 'eligible'
  }
];
```

#### API Mocking
```typescript
// __mocks__/api.ts
export const mockAPI = {
  sendOTP: jest.fn().mockResolvedValue({
    success: true,
    otpId: 'mock_otp_id'
  }),
  
  verifyOTP: jest.fn().mockResolvedValue({
    success: true,
    accessToken: 'mock_token'
  }),
  
  getProfile: jest.fn().mockResolvedValue({
    success: true,
    profile: mockFarmerProfile
  })
};
```

## Deployment Guide

### Build Configuration

#### EAS Build Setup (`eas.json`)
```json
{
  "cli": {
    "version": ">= 0.52.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Deployment Environments

#### 1. Development Environment
- **Purpose**: Active development and testing
- **API**: Development backend services
- **Features**: Debug mode, mock services enabled
- **Access**: Development team only

#### 2. Staging Environment
- **Purpose**: Pre-production testing and QA
- **API**: Staging backend services with production-like data
- **Features**: Production configuration, limited debug features
- **Access**: QA team and stakeholders

#### 3. Production Environment
- **Purpose**: Live application for end users
- **API**: Production backend services
- **Features**: Optimized performance, analytics enabled
- **Access**: General public through app stores

### Build Process

#### 1. Android Build
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production

# Local build (if needed)
expo run:android --variant release
```

#### 2. iOS Build
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production

# Local build (if needed)
expo run:ios --configuration Release
```

### Pre-deployment Checklist

#### Code Quality
- [ ] All tests passing
- [ ] Code review completed
- [ ] Linting issues resolved
- [ ] TypeScript compilation successful
- [ ] Performance benchmarks met

#### Security
- [ ] Secrets and API keys properly configured
- [ ] Authentication flows tested
- [ ] Data encryption verified
- [ ] Permission requests appropriate

#### Functionality
- [ ] All features working as expected
- [ ] Offline functionality tested
- [ ] Error handling verified
- [ ] Accessibility features functional

#### Performance
- [ ] App startup time acceptable
- [ ] Memory usage optimized
- [ ] Image and asset optimization complete
- [ ] Network request efficiency verified

### App Store Deployment

#### Google Play Store (Android)

**Requirements:**
- Signed APK/AAB file
- App listing details (title, description, screenshots)
- Privacy policy URL
- Content rating questionnaire
- Target audience specification

**Steps:**
1. Create Google Play Console account
2. Create new application
3. Upload signed bundle
4. Complete store listing
5. Submit for review

**Configuration:**
```json
// app.json - Android specific
{
  "android": {
    "package": "com.sss.farmerapp",
    "versionCode": 1,
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ],
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

#### Apple App Store (iOS)

**Requirements:**
- Apple Developer Account
- App Store Connect access
- Signed IPA file
- App metadata and screenshots
- App review guidelines compliance

**Steps:**
1. Configure App Store Connect
2. Upload build via Xcode or EAS
3. Complete app information
4. Submit for App Review
5. Release after approval

### Post-deployment Monitoring

#### Analytics Setup
- Firebase Analytics for user behavior
- Crashlytics for crash reporting
- Custom events for feature usage
- Performance monitoring

#### Error Tracking
- Real-time error monitoring
- Automated alert system
- Error categorization and prioritization
- User impact assessment

#### Performance Monitoring
- App startup time tracking
- API response time monitoring
- Memory and CPU usage tracking
- User experience metrics

### Rollback Procedures

#### Emergency Rollback
1. **Immediate Actions:**
   - Stop new user acquisitions
   - Communicate with stakeholders
   - Assess impact and scope

2. **Technical Rollback:**
   - Revert to previous stable version
   - Update backend compatibility
   - Monitor system stability

3. **Communication:**
   - Notify users of known issues
   - Provide timeline for resolution
   - Document lessons learned

#### Gradual Rollout Strategy
- Use staged rollouts (5% → 25% → 50% → 100%)
- Monitor key metrics at each stage
- Have automated rollback triggers
- Maintain communication channels

## Maintenance and Support

### Support Structure

#### 1. Technical Support Levels

**Level 1 - User Support:**
- Basic app usage guidance
- Account-related issues
- Feature explanations
- FAQ and self-help resources

**Level 2 - Technical Issues:**
- App functionality problems
- Data synchronization issues
- Performance-related complaints
- Integration failures

**Level 3 - Development Support:**
- Critical system failures
- Security incidents
- Data integrity issues
- Architecture-level problems

#### 2. Support Channels

**In-App Support:**
- Help & FAQ section
- Ticket creation system
- Chat support integration
- Video tutorials

**External Channels:**
- Dedicated helpline number
- Email support
- WhatsApp support
- Regional language support

**Self-Service:**
- Comprehensive FAQ database
- Video tutorial library
- User guide documentation
- Community forums

### Maintenance Activities

#### 1. Regular Maintenance

**Daily Tasks:**
- Monitor system health and performance
- Review error logs and crash reports
- Check API response times
- Monitor user feedback

**Weekly Tasks:**
- Update mock data and test scenarios
- Review and respond to user feedback
- Analyze usage patterns and metrics
- Security scan and vulnerability assessment

**Monthly Tasks:**
- Performance optimization review
- Database maintenance and cleanup
- Backup verification and testing
- User experience analysis

**Quarterly Tasks:**
- Comprehensive security audit
- Technology stack updates
- Feature usage analysis
- Capacity planning review

#### 2. Preventive Maintenance

**Code Maintenance:**
- Regular dependency updates
- Code refactoring for optimization
- Technical debt reduction
- Documentation updates

**Infrastructure Maintenance:**
- Server maintenance and updates
- Database optimization
- CDN and caching improvements
- Security patches and updates

### Update Management

#### 1. App Updates

**Minor Updates (Bug Fixes):**
- Release cycle: Bi-weekly
- Content: Bug fixes, small improvements
- Testing: Automated tests + smoke testing
- Rollout: Gradual release over 3-7 days

**Major Updates (Features):**
- Release cycle: Monthly/Quarterly
- Content: New features, major improvements
- Testing: Comprehensive testing across all devices
- Rollout: Staged release with close monitoring

**Critical Updates (Security):**
- Release cycle: As needed (urgent)
- Content: Security fixes, critical bug fixes
- Testing: Focused testing on affected areas
- Rollout: Fast-track approval and deployment

#### 2. Backend Updates

**API Updates:**
- Backward compatibility maintenance
- Versioning strategy implementation
- Gradual deprecation of old endpoints
- Clear migration documentation

**Database Updates:**
- Schema migration planning
- Data integrity verification
- Performance impact assessment
- Rollback procedures preparation

### Performance Monitoring

#### 1. Key Performance Indicators (KPIs)

**Technical KPIs:**
- App crash rate (target: <0.1%)
- API response time (target: <2 seconds)
- App startup time (target: <3 seconds)
- Memory usage (target: <200MB)

**User Experience KPIs:**
- User retention rate
- Feature adoption rate
- Support ticket volume
- User satisfaction score

**Business KPIs:**
- Active user count
- Service request completion rate
- Government scheme enrollment rate
- PACS engagement metrics

#### 2. Monitoring Tools

**Application Performance:**
- Firebase Performance Monitoring
- Crashlytics for crash reporting
- Custom analytics dashboard
- Real-time alerting system

**Infrastructure Monitoring:**
- Server health monitoring
- Database performance tracking
- API gateway metrics
- CDN performance analysis

### Security Maintenance

#### 1. Security Monitoring

**Continuous Monitoring:**
- Real-time threat detection
- Anomaly detection in user behavior
- API access pattern analysis
- Data access audit trails

**Regular Security Tasks:**
- Vulnerability scanning
- Penetration testing
- Security configuration review
- Compliance assessment

#### 2. Incident Response

**Security Incident Response Plan:**
1. **Detection and Analysis** (0-1 hour)
   - Incident identification and classification
   - Impact assessment
   - Stakeholder notification

2. **Containment and Eradication** (1-4 hours)
   - Immediate threat containment
   - System isolation if necessary
   - Vulnerability patching

3. **Recovery and Lessons Learned** (4-24 hours)
   - System restoration
   - User communication
   - Post-incident analysis
   - Process improvement

### Documentation Maintenance

#### 1. Technical Documentation

**Code Documentation:**
- Inline code comments
- API documentation updates
- Architecture decision records
- Database schema documentation

**Operational Documentation:**
- Deployment procedures
- Troubleshooting guides
- Monitoring playbooks
- Incident response procedures

#### 2. User Documentation

**User Guides:**
- Feature tutorials and walkthroughs
- Step-by-step process guides
- FAQ updates based on support tickets
- Video tutorial creation and updates

**Training Materials:**
- PACS staff training modules
- Government officer training materials
- Farmer education resources
- Technical training for support staff

### Continuous Improvement

#### 1. Feedback Loop

**User Feedback Collection:**
- In-app feedback mechanisms
- Regular user surveys
- Focus group sessions
- Usage analytics analysis

**Stakeholder Feedback:**
- Regular stakeholder meetings
- Government department feedback
- PACS feedback collection
- Support team insights

#### 2. Enhancement Planning

**Feature Prioritization:**
- User impact assessment
- Development effort estimation
- Business value analysis
- Technical feasibility review

**Roadmap Planning:**
- Quarterly feature planning
- Annual roadmap development
- Stakeholder alignment meetings
- Resource allocation planning

This comprehensive documentation provides a complete overview of the SSS Farmer App, covering all aspects from technical architecture to deployment and maintenance. The documentation serves as a reference for developers, project managers, stakeholders, and support teams involved in the project.
