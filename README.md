# EduSpace - Web Application

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.x-41B883)](https://primevue.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Production](https://img.shields.io/badge/status-production-green)](https://eduspace-frontend-web-app-production.up.railway.app/)

EduSpace is a comprehensive educational space management system built with Vue 3. This web application provides robust capabilities for managing classrooms, shared spaces, resources, reservations, meetings, and breakdown reports for educational institutions.

> **Deployment**: This application is deployed in production at [https://eduspace-frontend-web-app-production.up.railway.app/](https://eduspace-frontend-web-app-production.up.railway.app/)

## Features
### For Administrators (RoleAdmin)
- **Dashboard Analytics**: Real-time overview of institutional metrics
- **Classroom Management**: Create, update, and manage classrooms
- **Shared Spaces**: Manage common areas and facilities
- **Resource Allocation**: Track and manage classroom resources
- **Meeting Coordination**: Schedule and organize meetings with teachers
- **Teacher Management**: Register, edit, delete and manage teacher profiles
- **Reports Overview**: Monitor facility breakdown reports

### For Teachers (RoleTeacher)
- **Personal Dashboard**: View assigned classrooms and upcoming meetings
- **Reservation System**: Book shared spaces with calendar integration
- **Breakdown Reports**: Submit facility maintenance requests
- **Meeting Participation**: View and participate in scheduled meetings
- **Profile Management**: Update personal information

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ExperimentDesign/eduspace-frontend-web-app.git
cd eduspace-frontend-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file in root directory
VITE_API_BASE_URL=https://eduspace-platform-production.up.railway.app/api/v1
# For local development: https://localhost:7238/api/v1
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

### Lint Code

```bash
npm run lint
```

## Project Structure

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
│   │       └── home-admin.component.vue
│   ├── dashboard-teacher/                      # Teacher Dashboard
│   │   └── pages/
│   │       └── home-teacher.component.vue
│   ├── classroom-space-resource-management/    # Classroom & Resources
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── reservation-management/                 # Reservation System
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── meeting-management/                     # Meeting Management
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── breakdown-report-management/            # Breakdown Reports
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── personal-data/                          # Teacher Management
│   │   ├── model/
│   │   ├── pages/
│   │   └── services/
│   ├── shared/                                 # Shared Components & Services
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── store/                                  # Vuex State Management
│   │   └── modules/
│   │       └── user.js
│   ├── router/                                 # Vue Router Configuration
│   │   └── index.js
│   ├── locales/                                # Internationalization
│   │   ├── en.json
│   │   └── es.json
│   ├── App.vue                                 # Root Component
│   ├── main.js                                 # Application Entry Point
│   └── i18n.js                                 # i18n Configuration
├── public/                                     # Static Assets
├── .env                                        # Environment Variables
├── package.json                                # Dependencies
├── vite.config.js                              # Vite Configuration
└── README.md                                   # Documentation
```

## Architecture

### Domain-Driven Design

EduSpace follows a domain-driven design pattern with modules organized by business domain. Each domain contains:
- **Model**: Entity definitions and data structures
- **Services**: API communication layer
- **Pages**: Vue components for UI

### Key Technologies

- **Vue 3**: Progressive JavaScript framework with Composition API
- **PrimeVue 4**: Rich UI component library with Aura preset theme
- **Vuex**: Centralized state management with localStorage persistence
- **Vue Router**: Official router with role-based navigation guards
- **FullCalendar**: Calendar integration for reservation management
- **Axios**: HTTP client with automatic JWT injection
- **Vite**: Next-generation frontend build tool
- **ESLint**: Code quality and consistency

### Authentication Flow

1. User signs in with email/password → `AuthenticationService.signIn()`
2. Verification code sent to email → User redirected to `/verify-code`
3. User enters code → `AuthenticationService.verifyCode()`
4. Token + user data stored in localStorage and Vuex store
5. HTTP interceptor automatically adds Bearer token to all API requests

### State Management

- **Vuex Store**: Single store module for user state
- **Persistence**: State persisted to localStorage
- **Data Stored**: user object, id, role, token, authentication status, profile, classrooms, meetings
- **Actions**: signIn, verifyCodeAndLogin, signOut
- **Getters**: isAuthenticated, currentUser, userRole, userToken, userId, userProfile, userClassrooms, userMeetings

### Routing & Guards

- Navigation guard checks authentication and role
- Role-based redirects:
  - `RoleAdmin` → `/dashboard-admin/home-admin`
  - `RoleTeacher` → `/dashboard-teacher/home-teacher`
- Automatic redirect to login for unauthenticated users

## Authentication

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

## API Integration

### Base URL
Configured in `.env` as `VITE_API_BASE_URL`

### Date Formats
- **DateOnly**: `YYYY-MM-DD` (e.g., `2025-10-20`)
- **TimeOnly**: `HH:mm:ss` (e.g., `14:30:00`)
- **DateTime**: `YYYY-MM-DDTHH:mm:ss` (e.g., `2025-10-20T14:30:00`)

### HTTP Client
All services use a centralized HTTP client (`src/shared/services/http-common.js`) that:
- Automatically injects Bearer token from Vuex store
- Handles common errors:
  - **401 Unauthorized**: Auto logout and redirect to login
  - **404 Not Found**: Resource not found message
  - **409 Conflict**: Conflict with existing resource
  - **500 Server Error**: Server error message
- Network error detection and handling
- Extracts user-friendly error messages from backend responses

## UI Components

### PrimeVue Integration
All PrimeVue components are globally registered with `pv-` prefix:

```vue
<pv-button label="Submit" />
<pv-data-table :value="data" />
<pv-dialog v-model:visible="visible" />
```

### Theme
- **Preset**: Aura
- **Dark Mode**: Disabled

### Toast Notifications
```javascript
this.$toast.add({
  severity: 'success',
  summary: 'Title',
  detail: 'Message',
  life: 3000
});
```

## Available Scripts

All npm scripts from `package.json`:

```bash
npm run dev      # Start development server on http://localhost:5173
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

## Development Guidelines

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
const userRole = store.getters['user/userRole'];

if (userRole === 'RoleAdmin') {
  // Admin-specific logic
}
```

## Domain Modules

### Identity & Access Management (IAM)
- User authentication
- Email verification (2FA)
- Session management

### Classroom Management
- CRUD operations for classrooms
- Teacher assignment
- Resource tracking

### Reservation Management
- Shared space booking
- Calendar view
- Conflict prevention

### Meeting Management
- Meeting scheduling
- Teacher participation
- Classroom allocation

### Breakdown Report Management
- Facility issue reporting
- Status tracking (Pending, InProgress, Resolved)
- Priority levels

### Personal Data
- Teacher registration
- Teacher editing with dynamic forms
- Teacher deletion with constraint validation
- Profile management
- Contact information

## Security

### Authentication
- JWT-based authentication
- Two-factor authentication via email
- Secure password hashing (BCrypt on backend)

### Authorization
- Role-based access control (RBAC)
- Protected routes with navigation guards
- API endpoint protection via Bearer tokens

### Data Protection
- LocalStorage for session persistence
- Automatic token refresh handling
- Secure HTTP-only communication

## Code Quality

```bash
# Lint code with ESLint
npm run lint
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue in the GitHub repository.

## Technology Stack Details

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Vue 3 | Progressive JavaScript framework |
| UI Library | PrimeVue 4 | Component library with Aura theme |
| State Management | Vuex | Centralized store with persistence |
| Routing | Vue Router | Navigation with role-based guards |
| HTTP Client | Axios | API communication with interceptors |
| Calendar | FullCalendar | Reservation calendar views |
| Build Tool | Vite | Fast development and production builds |
| Linting | ESLint | Code quality and consistency |

## Related Projects

This is part of the EduSpace ecosystem:
- **Backend API**: [eduspace-platform](https://github.com/ExperimentDesign/eduspace-platform) - .NET 8.0 Web API
- **Mobile App**: [eduspace-mobile](https://github.com/ExperimentDesign/eduspace-mobile) - Flutter application
- **Landing Page**: [landing-page](https://github.com/ExperimentDesign/landing-page) - Static marketing site

## Deployment

### Production Environment
- **Frontend URL**: https://eduspace-frontend-web-app-production.up.railway.app/
- **Backend API URL**: https://eduspace-platform-production.up.railway.app/api/v1
- **Platform**: Railway (Frontend & Backend)

### Development Environment
- **Frontend**: http://localhost:5173
- **Backend**: https://localhost:7238/api/v1 (when running locally)

---

**Built with Vue.js and PrimeVue**
