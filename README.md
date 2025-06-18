# Aryon Security Frontend

A modern, production-ready React application for managing security policy recommendations. Built with Create React App, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Architecture**: Feature-based folder structure with clear separation of concerns
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Responsive Design**: Mobile-first responsive design with dark/light mode support
- **Performance**: Code splitting, lazy loading, and optimized bundle size
- **Testing**: Comprehensive test coverage with Jest and React Testing Library
- **Accessibility**: WCAG compliant with proper ARIA attributes and keyboard navigation
- **Error Handling**: Robust error boundaries and user-friendly error messages
- **State Management**: React Query for server state, Context API for client state
- **Authentication**: JWT-based authentication with protected routes

## 🏗️ Architecture

### Folder Structure

\`\`\`
src/
├── components/            # Reusable UI components
│   ├── common/           # Generic components (ErrorBoundary, LoadingSpinner)
│   ├── layout/           # Layout components (Header, Sidebar, Navigation)
│   ├── routing/          # Routing components
│   └── ui/               # Base UI components (Button, Input, Card)
├── features/             # Feature-based modules
│   ├── auth/            # Authentication feature
│   ├── dashboard/       # Dashboard feature
│   └── recommendations/ # Recommendations feature
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── providers/           # React context providers
├── services/            # API services
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
\`\`\`

## 🛠️ Tech Stack

- **Framework**: Create React App
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **State Management**: React Query + Context API
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **HTTP Client**: Axios with interceptors

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

\`\`\`env
REACT_APP_API_URL=http://localhost:3001
\`\`\`

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start the development server**: `npm start`
4. **Open your browser** to `http://localhost:3000`

## 📱 Features

- **Dashboard**: Overview of security recommendations
- **Recommendations**: Browse, filter, and manage security recommendations
- **Archive**: View and restore archived recommendations
- **Authentication**: Secure login with JWT tokens
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🔐 Authentication

Default login credentials:
- **Username**: admin
- **Password**: password

## 🤝 Contributing

1. Follow the established folder structure
2. Write tests for new features
3. Use TypeScript strictly
4. Follow accessibility guidelines
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.
