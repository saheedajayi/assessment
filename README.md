# Aryon Security Frontend

> A modern React application built with TypeScript, Vite, and Tailwind CSS for enterprise security management.

---

## 🚀 **Features**

- **Modern Stack** — Built with React 18, TypeScript, and Vite for fast development
- **Responsive Design** — Mobile-first approach with Tailwind CSS
- **Authentication** — Secure authentication with httpOnly cookies
- **Security** — Content Security Policy (CSP) implementation and input sanitization
- **State Management** — React Query for server state and Context API for client state
- **Testing** — Comprehensive test suite with Jest, React Testing Library, and Cypress
- **Accessibility** — WCAG compliant components and keyboard navigation
- **Dark Mode** — Built-in theme switching capability

---

## 🛡️ **Security Features**

### 🍪 **HttpOnly Cookies**
- Authentication tokens stored in secure httpOnly cookies
- Automatic CSRF protection
- No token exposure to JavaScript

### 🔒 **Content Security Policy (CSP)**
- Strict CSP headers to prevent XSS attacks
- Whitelisted domains for external resources
- Inline script and style restrictions

### 🧹 **Input Sanitization**
- All user inputs are sanitized before rendering
- HTML content filtering to prevent XSS
- URL validation for external links
- CSS injection prevention

---

## 📦 **Installation**

### **Prerequisites**
```bash
Node.js 18+
npm or yarn
```

### **Setup**
```bash
# Clone the repository
git clone <repository-url>
cd aryonsecurityfrontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧪 **Testing**

### **Unit Tests**
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **End-to-End Tests**
```bash
# Run Cypress tests
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### **Test Factories**
The project uses factory patterns for generating test data:

```typescript
// Create a recommendation with default values
const recommendation = RecommendationFactory.create()

// Create a recommendation with specific overrides
const awsRecommendation = RecommendationFactory.createAWS({
  title: "Custom AWS Recommendation"
})

// Create multiple recommendations
const recommendations = RecommendationFactory.createMany(5)
```

---

## 🏗️ **Architecture**

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   └── common/         # Common components
├── features/           # Feature-based modules
│   ├── auth/          # Authentication feature
│   ├── recommendations/ # Recommendations feature
│   └── dashboard/     # Dashboard feature
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── providers/         # React context providers
├── services/          # API services
├── types/             # TypeScript type definitions
└── __test__/          # Test files and factories
```

### **Key Technologies**

| Technology | Purpose |
|------------|---------|
| **React 18** | Latest React with concurrent features |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | High-quality component library |
| **React Query** | Server state management |
| **React Hook Form** | Form handling with validation |
| **Zod** | Schema validation |
| **Axios** | HTTP client with interceptors |

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=Aryon Security
```

### **CSP Configuration**
Content Security Policy is configured in `app/layout.tsx`:

```typescript
meta httpEquiv="Content-Security-Policy" content={`
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' http://localhost:3001;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`}
```

---

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

### **Docker Support**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Standards**
- ✅ Follow TypeScript strict mode
- ✅ Use ESLint and Prettier for code formatting
- ✅ Write tests for new features
- ✅ Follow conventional commit messages
- ✅ Maintain 70%+ test coverage

---

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

For support and questions:
- 📝 Create an issue in the repository
- 👥 Contact the development team
- 📚 Check the documentation wiki

---

## 🔄 **Changelog**

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.