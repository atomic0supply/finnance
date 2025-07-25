# 👤 User Rules - Finnance Project

## 🌐 Language Preferences

### **Primary Language**
- **Interface Language**: Español (Spanish)
- **Code Language**: English (variables, functions, comments)
- **Documentation**: Spanish for user docs, English for technical docs
- **Error Messages**: Spanish for user-facing, English for developer logs

### **Code Comments & Documentation**
```typescript
// ✅ PREFERRED: English comments in code
const calculateTotalExpenses = (transactions: Transaction[]) => {
  // Filter transactions by expense type
  return transactions.filter(t => t.type === 'expense');
};

// ✅ PREFERRED: Spanish for user-facing text
const errorMessages = {
  invalidAmount: 'El monto debe ser mayor a cero',
  requiredField: 'Este campo es obligatorio'
};
```

## 🎨 Code Style Preferences

### **TypeScript Strictness**
- **Strict Mode**: Always enabled
- **No Implicit Any**: Forbidden
- **Explicit Return Types**: Required for all functions
- **Interface over Type**: Prefer interfaces for object shapes

```typescript
// ✅ PREFERRED
interface TransactionData {
  id: string;
  amount: number;
  description: string;
}

function createTransaction(data: TransactionData): Promise<Transaction> {
  // Implementation
}

// ❌ AVOID
const createTransaction = (data: any) => {
  // Implementation
};
```

### **Component Structure Preferences**
```typescript
// ✅ PREFERRED: Functional components with explicit typing
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function TransactionForm({ title, onSubmit }: Props) {
  // Component logic
}

// ❌ AVOID: Default exports without clear typing
export default function ({ title, onSubmit }: any) {
  // Component logic
}
```

## 🔧 Development Preferences

### **Package Management**
- **Primary**: npm (use npm commands by default)
- **Alternative**: yarn (only when specified)
- **Lock Files**: Always commit package-lock.json

### **Import Style**
```typescript
// ✅ PREFERRED: Named imports when possible
import { useState, useEffect } from 'react';
import { Button, Card } from '@/components/ui';

// ✅ ACCEPTABLE: Default imports for single exports
import React from 'react';
import Head from 'next/head';

// ❌ AVOID: Wildcard imports
import * as React from 'react';
```

### **File Organization**
```
// ✅ PREFERRED: Co-located files
components/
  TransactionCard/
    TransactionCard.tsx
    TransactionCard.test.tsx
    TransactionCard.stories.tsx
    index.ts

// ✅ ACCEPTABLE: Separated by type
components/
  TransactionCard.tsx
__tests__/
  TransactionCard.test.tsx
```

## 🎯 UI/UX Preferences

### **Component Library**
- **Primary**: shadcn/ui components
- **Customization**: Extend with Tailwind classes
- **Icons**: Lucide React (consistent iconography)

### **Design Tokens**
```typescript
// ✅ PREFERRED: Use design system tokens
<Button className="bg-primary text-primary-foreground">
  Guardar Transacción
</Button>

// ❌ AVOID: Arbitrary values
<Button className="bg-blue-500 text-white">
  Guardar Transacción
</Button>
```

### **Responsive Design**
- **Approach**: Mobile-first
- **Breakpoints**: Use Tailwind default breakpoints
- **Testing**: Always test on mobile, tablet, desktop

## 📊 Data Handling Preferences

### **State Management**
- **Global State**: Zustand for complex app state
- **Local State**: React useState for component-specific state
- **Server State**: React Query/SWR for API data (future implementation)

```typescript
// ✅ PREFERRED: Zustand store structure
interface FinanceStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions with clear naming
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}
```

### **Form Handling**
- **Library**: React Hook Form (preferred)
- **Validation**: Zod schemas for type-safe validation
- **Error Display**: Inline errors with clear messaging

```typescript
// ✅ PREFERRED: Form with validation
const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'Selecciona una categoría')
});

type TransactionForm = z.infer<typeof transactionSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<TransactionForm>({
  resolver: zodResolver(transactionSchema)
});
```

## 🚨 Error Handling Preferences

### **User-Facing Errors**
- **Language**: Spanish with clear, actionable messages
- **Toast Notifications**: Use Sonner for non-blocking feedback
- **Form Errors**: Inline validation with helpful hints

```typescript
// ✅ PREFERRED: User-friendly error messages
const errorMessages = {
  networkError: 'No se pudo conectar al servidor. Verifica tu conexión.',
  validationError: 'Por favor revisa los campos marcados en rojo.',
  permissionError: 'No tienes permisos para realizar esta acción.'
};
```

### **Developer Errors**
- **Language**: English for technical details
- **Logging**: Console errors in development, proper logging in production
- **Stack Traces**: Include in development, exclude in production

## 🔒 Security Preferences

### **Authentication**
- **Library**: Clerk (current migration target)
- **Fallback**: JWT implementation (current)
- **Session Management**: Secure, HTTP-only cookies when possible

### **Data Validation**
- **Client-Side**: TypeScript + Zod for user experience
- **Server-Side**: Always validate again for security
- **Sanitization**: Sanitize all user inputs

## 📱 Performance Preferences

### **Optimization Strategy**
- **Bundle Size**: Monitor and minimize
- **Code Splitting**: Implement for large pages/components
- **Image Optimization**: Always use Next.js Image component
- **Lazy Loading**: For non-critical components

### **Performance Budgets**
```typescript
// Performance targets to maintain
const performanceTargets = {
  firstContentfulPaint: '< 1.5s',
  largestContentfulPaint: '< 2.5s',
  timeToInteractive: '< 3s',
  bundleSize: '< 250KB gzipped',
  lighthouseScore: '>= 95'
};
```

## 🧪 Testing Preferences

### **Testing Strategy**
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API routes and component integration
- **E2E Tests**: Critical user flows with Playwright
- **Visual Tests**: Storybook for component documentation

### **Test Coverage Goals**
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **API Routes**: 85%+ coverage
- **Critical Flows**: 100% E2E coverage

## 📝 Documentation Preferences

### **Code Documentation**
```typescript
/**
 * Calculates the total amount for transactions within a date range
 * @param transactions - Array of transactions to analyze
 * @param startDate - Start date for the range (inclusive)
 * @param endDate - End date for the range (inclusive)
 * @returns Total amount as a positive number
 */
function calculateTotalInRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  // Implementation
}
```

### **README Structure**
- **Spanish**: User-facing documentation
- **English**: Technical setup and development guides
- **Examples**: Always include code examples
- **Troubleshooting**: Common issues and solutions

## 🚀 Deployment Preferences

### **Environment Variables**
```env
# ✅ PREFERRED: Clear, descriptive names
DATABASE_URL=postgresql://user:pass@host:port/dbname
NEXT_PUBLIC_APP_NAME=Finnance
CLERK_SECRET_KEY=sk_test_...

# ❌ AVOID: Abbreviated or unclear names
DB_URL=postgresql://...
APP=Finnance
SECRET=sk_test_...
```

### **Build Process**
- **Type Checking**: Must pass before deployment
- **Linting**: Zero errors, warnings acceptable with justification
- **Testing**: All tests must pass
- **Performance**: Lighthouse audit for major changes

## 🎨 Styling Preferences

### **CSS Architecture**
- **Framework**: Tailwind CSS with utility-first approach
- **Components**: shadcn/ui as base, extend with Tailwind
- **Custom Styles**: Minimal, only when necessary
- **Responsive**: Mobile-first with Tailwind breakpoints

### **Color System**
```typescript
// ✅ PREFERRED: Use semantic color names
<div className="bg-primary text-primary-foreground">
  Content
</div>

// ✅ ACCEPTABLE: Tailwind colors for specific cases
<div className="bg-green-100 text-green-800">
  Success message
</div>

// ❌ AVOID: Hardcoded hex values
<div style={{ backgroundColor: '#3b82f6' }}>
  Content
</div>
```

## 🔄 Workflow Preferences

### **Git Workflow**
- **Branching**: Feature branches from main
- **Commits**: Conventional commits format
- **PRs**: Required for main branch
- **Reviews**: At least one approval required

### **Development Cycle**
1. **Feature Planning**: Clear requirements and acceptance criteria
2. **Development**: TDD approach when possible
3. **Testing**: Manual and automated testing
4. **Review**: Code review and feedback
5. **Deployment**: Staging first, then production
6. **Monitoring**: Track performance and errors post-deployment

## 🎯 Personal Preferences

### **Code Editor Setup**
- **Primary**: VS Code with recommended extensions
- **Extensions**: ESLint, Prettier, TypeScript, Tailwind IntelliSense
- **Theme**: Adaptable (respect user's system preference)
- **Formatting**: Auto-format on save

### **Communication Style**
- **Questions**: Ask for clarification when requirements are unclear
- **Solutions**: Provide multiple options when possible
- **Explanations**: Include reasoning behind technical decisions
- **Feedback**: Constructive and specific feedback on code

### **Learning Approach**
- **Stay Updated**: Keep up with Next.js, React, and web development trends
- **Best Practices**: Follow industry standards and patterns
- **Documentation**: Read official docs before third-party resources
- **Experimentation**: Try new features in development environment first
