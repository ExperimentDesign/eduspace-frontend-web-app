# EduSpace - Educational Space Management System

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.x-41B883)](https://primevue.org/)

EduSpace is a comprehensive educational space management system built with Vue 3. It provides a complete solution for managing classrooms, shared spaces, resources, reservations, and breakdown reports for educational institutions.

## ✨ Features

### For Administrators (RoleAdmin)

- **Dashboard Analytics**: Real-time overview of institutional metrics and key statistics
- **Classroom Management**: Create, update, and manage classrooms with resource tracking
- **Shared Spaces**: Manage common areas and facilities
- **Resource Allocation**: Track and manage classroom resources and equipment
- **Teacher Management**: Register and manage teacher profiles with enhanced forms
- **Reports Overview**: Monitor and manage facility breakdown reports

### For Teachers (RoleTeacher)

- **Personal Dashboard**: Enhanced view of assigned classrooms and active reservations
- **Reservation System**: Book shared spaces with interactive calendar and validation
- **Weekly Calendar**: Visual calendar with drag-and-drop reservation management
- **Breakdown Reports**: Submit and track facility maintenance requests
- **Profile Management**: Update personal information and contact details

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eduspace-frontend-web-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
# Create .env file in root directory
VITE_API_BASE_URL=https://localhost:7238/api/v1
```

4. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
eduspace-frontend-web-app/
├── src/
│   ├── iam/                                    # Identity & Access Management
│   │   ├── pages/                              # Authentication pages
│   │   │   ├── sign-in.component.vue
│   │   │   └── verify-code.component.vue
│   │   └── services/
│   │       └── authentication.service.js
│   ├── dashboard-admin/                        # Admin Dashboard
│   │   └── pages/
│   │       ├── home-admin.component.vue
│   │       └── personal-data.component.vue
│   ├── dashboard-teacher/                      # Teacher Dashboard
│   │   └── pages/
│   │       ├── home-teacher.component.vue
│   │       └── reservations.component.vue
│   ├── classroom-space-resource-management/    # Classroom & Resources
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── reservation-management/                 # Reservation System
│   │   ├── components/
│   │   │   ├── create-reservation-dialog.vue
│   │   │   ├── reservation-toolbar.component.vue
│   │   │   └── weekly-calendar.component.vue
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── breakdown-report-management/            # Breakdown Reports
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── personal-data/                          # Teacher Registration
│   │   ├── components/
│   │   │   ├── add-teacher-form.component.vue
│   │   │   └── teacher-card.component.vue
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── shared/                                 # Shared Components & Services
│   │   ├── components/
│   │   ├── services/
│   │   │   └── http-common.js
│   │   └── utils/
│   ├── store/                                  # Vuex State Management
│   │   └── modules/
│   │       └── user.js
│   ├── router/                                 # Vue Router Configuration
│   │   └── index.js
│   ├── App.vue                                 # Root Component
│   ├── main.js                                 # Application Entry Point
│   └── style.css                               # Global Styles
├── public/                                     # Static Assets
├── .env                                        # Environment Variables
├── .gitignore                                  # Git Ignore Rules
├── package.json                                # Dependencies
├── vite.config.js                              # Vite Configuration
└── README.md                                   # Project Documentation
```

## 🏗️ Architecture

### Domain-Driven Design

EduSpace follows a domain-driven design pattern with modules organized by business domain. Each domain contains:

- **Model**: Entity definitions and data structures
- **Services**: API communication layer
- **Pages**: Vue components for UI
- **Components**: Reusable UI components

### Key Technologies

- **Vue 3**: Progressive JavaScript framework with Composition API
- **PrimeVue 4**: Rich UI component library (Aura theme)
- **Vuex**: Centralized state management
- **Vue Router**: Official router for Vue.js
- **FullCalendar**: Calendar integration for reservations
- **Axios**: HTTP client for API communication
- **Vite**: Next-generation frontend tooling

### Authentication Flow

1. User signs in with email/password → `AuthenticationService.signIn()`
2. Verification code sent to email → User redirected to `/verify-code`
3. User enters code → `AuthenticationService.verifyCode()`
4. Token + user data stored in localStorage and Vuex store
5. HTTP interceptor automatically adds Bearer token to all API requests

### State Management

- **Vuex Store**: Single store module for user state
- **Persistence**: State persisted to localStorage
- **Data Stored**: user object, id, role, token, authentication status

### Routing & Guards

- Navigation guard checks authentication and role
- Role-based redirects:
  - `RoleAdmin` → `/dashboard-admin/home-admin`
  - `RoleTeacher` → `/dashboard-teacher/home-teacher`
- Automatic redirect to login for unauthenticated users

## 🔐 Authentication

### Sign Up

```javascript
POST /authentication/sign-up
{
  "username": "string",
  "password": "string",
  "role": "string"
}
```

### Sign In

```javascript
POST /authentication/sign-in
{
  "username": "string",
  "password": "string"
}
```

### Verify Code

```javascript
POST /authentication/verify-code
{
  "username": "string",
  "code": "string"
}
```

## 🔌 API Integration

### Base URL

Configured in `.env` as `VITE_API_BASE_URL`

### Date Formats

- **DateOnly**: `YYYY-MM-DD` (e.g., `2025-10-20`)
- **TimeOnly**: `HH:mm:ss` (e.g., `14:30:00`)
- **DateTime**: `YYYY-MM-DDTHH:mm:ss` (e.g., `2025-10-20T14:30:00`)

### HTTP Client

All services use a centralized HTTP client (`src/shared/services/http-common.js`) that:

- Automatically injects Bearer token
- Handles common errors (401, 404, 409, 500)
- Provides user-friendly error messages
- Manages logout on authentication failures

## 🎨 UI Components

### PrimeVue Integration

All PrimeVue components are globally registered with `pv-` prefix:

```vue
<pv-button label="Submit" />
<pv-data-table :value="data" />
<pv-dialog v-model:visible="visible" />
<pv-calendar v-model="date" />
<pv-multi-select v-model="selected" :options="options" />
```

### Theme

- **Preset**: Aura
- **Dark Mode**: Disabled

### Toast Notifications

```javascript
this.$toast.add({
  severity: "success",
  summary: "Title",
  detail: "Message",
  life: 3000,
});
```

## 🛠️ Development Guidelines

### Adding New Routes

1. Add route to `src/router/index.js`
2. Set `meta.title` for document title
3. Navigation guard handles auth checks automatically
4. Place role-specific routes under `/dashboard-admin/*` or `/dashboard-teacher/*`

### Adding New API Services

1. Create service file in appropriate domain folder
2. Import shared HTTP client: `import http from "../../shared/services/http-common.js";`
3. Export service methods that return promises
4. Token injection happens automatically

### Component Naming Convention

- All Vue components use `.component.vue` suffix
- Page components in `pages/` folders
- Reusable components in `components/` folders

### User Role Access

```javascript
// Check role via Vuex getter
const userRole = store.getters["user/userRole"];

if (userRole === "RoleAdmin") {
  // Admin-specific logic
}
```

## 📦 Domain Modules

### Identity & Access Management (IAM)

- User authentication with email verification
- Two-factor authentication (2FA)
- Session management with JWT tokens

### Classroom Management

- CRUD operations for classrooms
- Teacher assignment
- Resource tracking and allocation

### Reservation Management

- Shared space booking with conflict validation
- Interactive weekly calendar view
- Drag-and-drop reservation creation
- Duration limits and time slot management
- Real-time availability checking

### Breakdown Report Management

- Facility issue reporting
- Status tracking (Pending, InProgress, Resolved)
- Priority levels and assignments

### Personal Data

- Teacher registration with enhanced forms
- Profile management
- Contact information updates
- Advanced form validation

## 🔒 Security

### Authentication

- JWT-based authentication
- Two-factor authentication via email verification
- Secure password hashing (BCrypt on backend)

### Data Protection

- LocalStorage for session persistence
- Automatic token refresh handling
- Secure HTTPS communication
- Automatic logout on token expiration

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
