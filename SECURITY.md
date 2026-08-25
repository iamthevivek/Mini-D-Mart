# Security Architecture & Policies — OneMart

## 1. Executive Summary & Threat Model
OneMart is designed with security-by-design principles, implementing defense-in-depth across the network, authentication, authorization, business logic, data persistence, and auditing layers.

```
+-----------------------------------------------------------------------------+
|                               Security Layers                               |
+-----------------------------------------------------------------------------+
| 1. Perimeter / Transport   : HTTPS, Strict CORS Origin Whitelist, Headers   |
| 2. Identity & Access       : Stateless JWT (HS256 256-bit), BCrypt Hashing  |
| 3. Authorization (RBAC)    : Granular Method Security (@EnableMethodSec)    |
| 4. Input & Data Integrity  : Jakarta Bean Validation, DTO Sanitization      |
| 5. Concurrency & Logic     : Transactional Stock Locking, Slot Capacity Gate|
| 6. Audit & Visibility      : Asynchronous Tamper-evident Audit Logs         |
+-----------------------------------------------------------------------------+
```

---

## 2. Authentication & Credential Management
- **Stateless Bearer Authentication**: Built on Spring Security 6 / OAuth2 Resource Server with JWT decoding and signature verification.
- **Cryptographic Signing**: Uses HMAC-SHA256 (`HS256`) with a cryptographically strong 256-bit Base64-encoded secret key (`JWT_SECRET`).
- **Token Expiration**: Access tokens are configured with configurable validity (`JWT_EXPIRATION_MS`, default 24 hours).
- **Password Protection**: Passwords are never stored in plaintext. They are salted and hashed using `BCryptPasswordEncoder` with standard cost factor 10.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint Pattern | Method | CUSTOMER | STAFF | MANAGER | ADMIN | Public |
|---|---|---|---|---|---|---|
| `/api/auth/register` | POST | - | - | - | - | Yes |
| `/api/auth/login` | POST | - | - | - | - | Yes |
| `/api/auth/me` | GET | Yes | Yes | Yes | Yes | - |
| `/api/categories`, `/api/products` | GET | Yes | Yes | Yes | Yes | Yes |
| `/api/slots` | GET | Yes | Yes | Yes | Yes | Yes |
| `/api/cart/**` | ALL | Yes | - | - | - | - |
| `/api/orders/customer/**` | ALL | Yes | - | - | - | - |
| `/api/returns/customer/**` | ALL | Yes | - | - | - | - |
| `/api/orders/staff/**` | ALL | - | Yes | Yes | Yes | - |
| `/api/returns/staff/**` | ALL | - | Yes | Yes | Yes | - |
| `/api/products/**` (write) | POST/PUT/DELETE | - | - | Yes | Yes | - |
| `/api/categories/**` (write) | POST/PUT/DELETE | - | - | Yes | Yes | - |
| `/api/slots/**` (write) | POST/PUT/DELETE | - | - | Yes | Yes | - |
| `/api/analytics/**` | GET | - | - | Yes | Yes | - |
| `/api/users/**` | ALL | - | - | - | Yes | - |
| `/api/admin/audit-logs/**` | GET | - | - | - | Yes | - |

---

## 4. OWASP Top 10 Protections & Mitigations

### A01: Broken Access Control
- **IDOR Protection**: Order lookup and cancellation services enforce ownership validation (`order.getUser().getId().equals(authenticatedUserId)`). Non-admin users cannot manipulate or view another user's order or return request.
- **Role Elevation Prevention**: Public registration endpoint strictly forces role assignment to `CUSTOMER`. Role modification is isolated to `/api/users/{id}/role` accessible strictly by `ADMIN`.

### A02: Cryptographic Failures
- Secrets externalized into environment variables with zero hardcoded credentials in production configurations.
- Enforced minimum secret key entropy (at least 32 decoded bytes).

### A03: Injection (SQL & Command Injection)
- **Parameterized Queries**: All database interactions use Spring Data JPA / Hibernate parameterized queries and criteria builders, completely mitigating SQL injection.
- **Input Sanitization**: Strings are trimmed, normalized, and validated through Jakarta Validation annotations (`@NotBlank`, `@Size`, `@DecimalMin`).

### A04: Insecure Design & Race Conditions
- **Inventory Overselling Protection**: Stock decrement occurs inside transactional boundaries (`@Transactional`). In case of concurrent orders attempting to claim the same stock, stock counts are validated before reservation.
- **Pickup Slot Overbooking Prevention**: Slot capacity is validated before reservation; booked count is incremented atomically.
- **Return Fraud Mitigation**: Eligibility engine enforces delivered status check, 7-day return window validation, non-perishable category constraint, and prevents duplicate return requests for the same order item.

### A05: Security Misconfiguration
- Disabled CSRF for stateless REST architecture while enabling strict CORS configuration with configurable whitelist (`FRONTEND_URL`).
- Spring Boot actuator and test endpoints disabled in production profile.

### A09: Security Logging & Monitoring
- All sensitive administrative and operational actions (role changes, stock adjustments, order cancellations, return approvals) generate persistent records in the `audit_logs` table containing action, actor ID, email, role, IP address, and timestamp.

---

## 5. Security Incident Response
If you discover any security issue or vulnerability:
1. Please report responsibly by opening an issue or contacting the security administrator at `security@onemart.com`.
2. Provide reproducible steps and impact analysis.
