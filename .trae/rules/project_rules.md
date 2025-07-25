# 🏗️ Project Rules - Finnance Application

## 📋 Project Overview

**Finnance** is a comprehensive personal finance management application built with modern web technologies. This document defines the architectural decisions, coding standards, and development practices that must be followed throughout the project lifecycle.

## 🎯 Core Principles

### **1. User-Centric Design**
- All features must solve real user problems
- User experience takes precedence over technical convenience
- Accessibility is a requirement, not an option
- Performance directly impacts user satisfaction

### **2. Maintainability First**
- Code should be self-documenting and easy to understand
- Consistent patterns and conventions across the codebase
- Comprehensive testing strategy for long-term stability
- Clear separation of concerns and modular architecture

### **3. Security by Design**
- Security considerations in every development decision
- Never trust user input, validate everything
- Principle of least privilege for user permissions
- Regular security audits and updates

### **4. Scalability from Day One**
- Architecture must support growth to millions of users
- Database design with performance and scale in mind
- Caching strategies for improved performance
- Monitoring and observability built-in

## 🏛️ Architecture Rules

### **Frontend Architecture**
```typescript
// MANDATORY: Use App Router for all new pages
// app/dashboard/page.tsx ✅
// pages/dashboard.tsx ❌

// MANDATORY: TypeScript strict mode
// tsconfig.json must have "strict": true

// MANDATORY: Component composition over inheritance
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// ✅ REQUIRED: Explicit prop interfaces
export function Button({ variant, size, children }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }))}>{children}</button>;
}
```

### **Backend Architecture**
```typescript
// MANDATORY: API Route handlers with proper typing
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Always validate input
    const body = await request.json();
    const validatedData = TransactionSchema.parse(body);
    
    // Business logic
    const result = await createTransaction(validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    // Consistent error handling
    return handleApiError(error);
  }
}

// MANDATORY: Database operations through service layer
// Direct database access in API routes is FORBIDDEN
```

### **Database Rules**
```sql
-- MANDATORY: Use PostgreSQL with proper indexing
-- DATABASE: postgresql://potg:potg@192.168.1.87:5484/financie

-- REQUIRED: All tables must have
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Business fields
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  
  -- MANDATORY: Indexes for performance
  INDEX idx_transactions_user_id (user_id),
  INDEX idx_transactions_created_at (created_at),
  INDEX idx_transactions_category (category)
);
```

## 📁 Project Structure (IMMUTABLE)

```
finnance/
├── src/
│   ├── app/                    # Next.js App Router (ONLY routing)
│   │   ├── (auth)/            # Route groups for layout
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles ONLY
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui base components (READ-ONLY)
│   │   ├── forms/            # Form-specific components
│   │   ├── charts/           # Data visualization components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions and configurations
│   │   ├── db/               # Database utilities and schemas
│   │   ├── auth/             # Authentication utilities
│   │   ├── validations/      # Zod schemas
│   │   └── utils.ts          # General utilities
│   ├── stores/               # Zustand state management
│   ├── types/                # TypeScript type definitions
│   ├── hooks/                # Custom React hooks
│   └── styles/               # Additional styling (minimal)
├── docs/                     # Project documentation
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── tests/                    # Test files (mirror src structure)
```

## 🔒 Security Rules (NON-NEGOTIABLE)

### **Authentication & Authorization**
```typescript
// MANDATORY: All API routes must verify authentication
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // MANDATORY: Verify user permissions
  if (!hasPermission(user, 'transactions:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Continue with authorized logic
}

// FORBIDDEN: Exposing sensitive data in client-side code
// ❌ Never do this
const API_SECRET = 'secret123'; // This will be visible in browser
```

### **Data Protection**
```typescript
// MANDATORY: Input validation on all endpoints
const CreateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1).max(255),
  category: z.string().min(1),
  user_id: z.string().uuid() // Must be validated
});

// MANDATORY: SQL injection prevention
// ✅ Use parameterized queries
const transactions = await db.query(
  'SELECT * FROM transactions WHERE user_id = $1',
  [userId]
);

// ❌ FORBIDDEN: String concatenation
const transactions = await db.query(
  `SELECT * FROM transactions WHERE user_id = '${userId}'`
);
```

### **Environment Variables**
```env
# MANDATORY: Use environment variables for all secrets
DATABASE_URL=postgresql://potg:potg@192.168.1.87:5484/financie
CLERK_SECRET_KEY=sk_live_...
JWT_SECRET=your-super-secret-key

# FORBIDDEN: Hardcoded secrets in code
# FORBIDDEN: Committing .env files to git
# MANDATORY: Use .env.example for documentation
```

## 📊 Database Rules (STRICT)

### **Schema Design**
```sql
-- MANDATORY: All tables must follow this pattern
CREATE TABLE table_name (
  -- Primary key (always UUID)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign keys with proper references
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Audit fields (MANDATORY)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Business fields with proper constraints
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  
  -- Indexes for performance (MANDATORY for foreign keys)
  INDEX idx_table_name_user_id (user_id),
  INDEX idx_table_name_created_at (created_at)
);
```

### **Migration Rules**
```typescript
// MANDATORY: Use Prisma for schema management
// File: prisma/schema.prisma

model Transaction {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  amount      Decimal  @db.Decimal(12, 2)
  description String   @db.VarChar(255)
  category    String   @db.VarChar(100)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
  @@map("transactions")
}
```

## 🎨 UI/UX Rules (ENFORCED)

### **Design System**
```typescript
// MANDATORY: Use only approved components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// FORBIDDEN: Creating custom buttons outside the design system
// ❌ Don't create custom button components
const CustomButton = ({ children }: { children: React.ReactNode }) => (
  <button className="custom-styles">{children}</button>
);

// ✅ Extend existing components if needed
const PrimaryButton = ({ children, ...props }: ButtonProps) => (
  <Button variant="default" {...props}>{children}</Button>
);
```

### **Styling Rules**
```typescript
// MANDATORY: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  
// FORBIDDEN: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>

// FORBIDDEN: Custom CSS files (except globals.css)
// styles/custom.css ❌

// ✅ ALLOWED: CSS variables for theming in globals.css
:root {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
}
```

### **Accessibility Requirements**
```typescript
// MANDATORY: All interactive elements must have proper labels
<Button aria-label="Guardar transacción" onClick={handleSave}>
  <Save className="h-4 w-4" />
</Button>

// MANDATORY: Form inputs must have associated labels
<Label htmlFor="amount">Monto</Label>
<Input id="amount" name="amount" type="number" required />

// MANDATORY: Proper heading hierarchy
<h1>Dashboard</h1>
  <h2>Transacciones Recientes</h2>
    <h3>Enero 2025</h3>
```

## 🧪 Testing Rules (MANDATORY)

### **Test Coverage Requirements**
```typescript
// REQUIRED: Minimum test coverage
const coverageThresholds = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  // Critical paths require 100% coverage
  './src/lib/auth/': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100
  }
};
```

### **Test Structure**
```typescript
// MANDATORY: Test file naming
// TransactionCard.tsx -> TransactionCard.test.tsx
// utils.ts -> utils.test.ts

// MANDATORY: Test structure
describe('TransactionCard', () => {
  // Setup
  const mockTransaction = {
    id: '1',
    amount: 100,
    description: 'Test transaction',
    category: 'food'
  };

  // Happy path
  it('should display transaction information correctly', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    expect(screen.getByText('Test transaction')).toBeInTheDocument();
  });

  // Edge cases
  it('should handle missing optional fields', () => {
    const transactionWithoutCategory = { ...mockTransaction, category: undefined };
    render(<TransactionCard transaction={transactionWithoutCategory} />);
    expect(screen.getByText('Sin categoría')).toBeInTheDocument();
  });

  // Error cases
  it('should handle null transaction gracefully', () => {
    render(<TransactionCard transaction={null} />);
    expect(screen.getByText('Transacción no disponible')).toBeInTheDocument();
  });
});
```

## 📦 Dependency Management

### **Allowed Dependencies**
```json
{
  "dependencies": {
    // CORE (Required)
    "next": "15.3.4",
    "react": "^19.0.0",
    "typescript": "^5",
    
    // UI (Approved)
    "@radix-ui/*": "latest",
    "tailwindcss": "^4",
    "lucide-react": "latest",
    
    // Database (Required)
    "@prisma/client": "latest",
    "prisma": "latest",
    
    // Authentication (Approved)
    "@clerk/nextjs": "latest",
    
    // State Management (Approved)
    "zustand": "latest",
    
    // Validation (Required)
    "zod": "latest",
    
    // Utilities (Approved)
    "date-fns": "latest",
    "clsx": "latest"
  }
}
```

### **Forbidden Dependencies**
```json
{
  // ❌ FORBIDDEN: Alternative frameworks
  "vue": "NO",
  "angular": "NO",
  "svelte": "NO",
  
  // ❌ FORBIDDEN: Alternative styling
  "styled-components": "NO",
  "emotion": "NO",
  "bootstrap": "NO",
  
  // ❌ FORBIDDEN: jQuery or similar
  "jquery": "NO",
  "lodash": "NO", // Use native JS instead
  
  // ❌ FORBIDDEN: Moment.js (use date-fns)
  "moment": "NO"
}
```

## 🚀 Performance Rules

### **Bundle Size Limits**
```typescript
// MANDATORY: Bundle size limits
const bundleSizeLimits = {
  'pages/index': '150KB',
  'pages/dashboard': '200KB',
  'pages/transactions': '180KB',
  'components/ui': '50KB'
};

// MANDATORY: Code splitting for large pages
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazyReports = lazy(() => import('./Reports'));
```

### **Performance Budgets**
```typescript
// REQUIRED: Performance targets
const performanceTargets = {
  firstContentfulPaint: 1500, // 1.5s
  largestContentfulPaint: 2500, // 2.5s
  timeToInteractive: 3000, // 3s
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100 // 100ms
};
```

### **Database Performance**
```sql
-- MANDATORY: Query optimization rules
-- 1. Always use indexes for WHERE clauses
-- 2. Limit result sets with pagination
-- 3. Use specific columns instead of SELECT *
-- 4. Use proper JOIN conditions

-- ✅ GOOD
SELECT t.id, t.amount, t.description 
FROM transactions t 
WHERE t.user_id = $1 
ORDER BY t.created_at DESC 
LIMIT 50 OFFSET $2;

-- ❌ BAD
SELECT * FROM transactions;
```

## 🔄 Git Workflow Rules

### **Branch Naming**
```bash
# MANDATORY: Branch naming convention
feature/transaction-filters    # New features
bugfix/calculation-error      # Bug fixes
hotfix/security-patch         # Critical fixes
chore/update-dependencies     # Maintenance tasks
```

### **Commit Messages**
```bash
# MANDATORY: Conventional commits format
feat(transactions): add filter by date range
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
test(utils): add tests for currency formatting
chore(deps): update Next.js to v15.3.4
```

### **Pull Request Rules**
```markdown
<!-- MANDATORY: PR template -->
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements in production code
```

## 📊 Monitoring Rules

### **Logging Standards**
```typescript
// MANDATORY: Structured logging
const logger = {
  info: (message: string, metadata?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: error?.message,
      stack: error?.stack
    }));
  }
};

// FORBIDDEN: Plain console.log in production
// ❌ console.log('User logged in');
// ✅ logger.info('User authenticated', { userId: user.id });
```

### **Error Tracking**
```typescript
// MANDATORY: Error boundaries for all major components
<ErrorBoundary fallback={<ErrorFallback />}>
  <TransactionList />
</ErrorBoundary>

// MANDATORY: Global error handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason);
  // Send to monitoring service
});
```

## 🚨 Deployment Rules

### **Environment Validation**
```typescript
// MANDATORY: Environment validation at startup
const requiredEnvVars = [
  'DATABASE_URL',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter(name => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### **Build Process**
```json
{
  "scripts": {
    "build": "npm run validate && npm run lint && npm run type-check && next build",
    "validate": "node scripts/validate-env.js",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

## 🔄 Continuous Integration

### **Required Checks**
```yaml
# MANDATORY: CI pipeline checks
- name: Type Check
  run: npm run type-check
  
- name: Lint Check
  run: npm run lint
  
- name: Unit Tests
  run: npm run test:coverage
  
- name: Build Check
  run: npm run build
  
- name: E2E Tests
  run: npm run test:e2e
```

### **Quality Gates**
- ✅ All tests must pass
- ✅ Coverage must be >= 80%
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Build must succeed
- ✅ Bundle size within limits

## 📚 Documentation Requirements

### **Code Documentation**
```typescript
/**
 * MANDATORY: JSDoc for all public functions
 * Calculates the total expenses for a given time period
 * 
 * @param transactions - Array of transactions to analyze
 * @param startDate - Start date for calculation (inclusive)
 * @param endDate - End date for calculation (inclusive)
 * @returns The total amount of expenses as a number
 * @throws {Error} When date range is invalid
 * 
 * @example
 * ```typescript
 * const total = calculateExpenses(transactions, startDate, endDate);
 * console.log(`Total expenses: $${total}`);
 * ```
 */
function calculateExpenses(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  // Implementation
}
```

### **API Documentation**
```typescript
// MANDATORY: OpenAPI documentation for all endpoints
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionRequest'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
```

## 🎯 Success Metrics

### **Technical KPIs**
- **Build Time**: < 2 minutes
- **Test Coverage**: >= 80%
- **Bundle Size**: < 250KB gzipped
- **Lighthouse Score**: >= 95
- **API Response Time**: < 200ms (95th percentile)
- **Database Query Time**: < 50ms (average)

### **Quality Metrics**
- **Zero Production Errors**: No unhandled exceptions
- **Security Score**: A+ on security headers
- **Accessibility Score**: AA compliance minimum
- **Performance Budget**: Within defined limits

These rules are **NON-NEGOTIABLE** and must be followed by all contributors to maintain code quality, security, and project consistency.
