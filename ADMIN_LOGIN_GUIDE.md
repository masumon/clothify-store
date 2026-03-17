# Admin Login Functionality - Complete Guide

## Overview

The Clothify Store admin panel includes a comprehensive authentication system that protects all admin routes and ensures only authorized users can access administrative features.

## Features

### 🔐 Multiple Authentication Methods

1. **Username/Password Login** (Primary Method)
   - Secure credential-based authentication
   - Session cookie with 7-day expiration
   - HTTP-only cookies for enhanced security

2. **Google OAuth**
   - Sign in with Google account
   - Seamless integration with Supabase Auth

3. **Email OTP (One-Time Password)**
   - Passwordless authentication via email
   - 6-digit verification code

4. **Password Reset**
   - Email-based password recovery
   - Secure reset link generation

5. **Account Registration**
   - New admin account creation
   - Email verification required

## Setup Instructions

### 1. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Admin Credentials (Username/Password Login)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# Supabase Configuration (Required for OAuth, OTP, and Registration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Environment Setup Priority

- **Minimum Setup** (Username/Password only): `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- **Full Features** (All auth methods): All Supabase credentials + Admin credentials

## How It Works

### Authentication Flow

1. **User accesses admin panel** → Navigates to `/admin` or any `/admin/*` route

2. **Middleware checks authentication** → Validates session cookie or HTTP Basic Auth

3. **If not authenticated** → Redirects to `/admin/login?next=/admin/[requested-path]`

4. **User logs in** → Submits credentials via login form

5. **API validates credentials** → Checks against `ADMIN_USERNAME` and `ADMIN_PASSWORD`

6. **Session created** → Secure HTTP-only cookie set with 7-day expiration

7. **Redirect to destination** → User redirected to originally requested page

### Protected Routes

All routes under `/admin/*` and `/api/admin/*` are protected, **except**:
- `/admin/login` - Login page (public)
- `/api/admin/auth` - Authentication API (public)

## File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Login page with all auth methods
│   ├── page.tsx               # Admin dashboard (protected)
│   ├── products/page.tsx      # Products management (protected)
│   ├── orders/page.tsx        # Orders management (protected)
│   └── settings/page.tsx      # Settings page (protected)
│
├── api/
│   └── admin/
│       └── auth/
│           └── route.ts       # Login/logout API endpoints

lib/
└── admin-auth.ts              # Authentication utility functions

middleware.ts                   # Route protection middleware
```

## Security Features

### 🔒 Security Measures

1. **HTTP-Only Cookies**
   - Session cookies cannot be accessed via JavaScript
   - Prevents XSS attacks

2. **Secure Cookies in Production**
   - HTTPS-only cookies when `NODE_ENV=production`
   - Prevents man-in-the-middle attacks

3. **SameSite Protection**
   - `sameSite: "lax"` cookie attribute
   - Prevents CSRF attacks

4. **Environment-Based Credentials**
   - Admin credentials stored in environment variables
   - Never committed to version control

5. **HTTP Basic Auth Fallback**
   - Support for API clients
   - Backward compatibility

6. **Session Expiration**
   - 7-day session timeout
   - Automatic re-authentication required

## API Reference

### POST `/api/admin/auth`

**Login endpoint**

Request:
```json
{
  "username": "admin",
  "password": "securepassword"
}
```

Response (Success):
```json
{
  "success": true
}
```
- Sets `admin_session` cookie

Response (Error):
```json
{
  "error": "Invalid credentials"
}
```

### DELETE `/api/admin/auth`

**Logout endpoint**

Response:
```json
{
  "success": true
}
```
- Clears `admin_session` cookie

## Utility Functions

### `isSessionAuthorized(req: NextRequest): boolean`

Checks if the request has a valid admin session cookie.

```typescript
import { isSessionAuthorized } from '@/lib/admin-auth';

if (isSessionAuthorized(request)) {
  // User is authenticated via session
}
```

### `isAdminAuthorized(req: NextRequest): boolean`

Checks if the request has valid HTTP Basic Auth credentials.

```typescript
import { isAdminAuthorized } from '@/lib/admin-auth';

if (isAdminAuthorized(request)) {
  // User is authenticated via Basic Auth
}
```

## Usage Examples

### Protecting Custom API Routes

```typescript
// app/api/custom-admin/route.ts
import { NextRequest } from 'next/server';
import { isSessionAuthorized, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isSessionAuthorized(req)) {
    return unauthorizedResponse();
  }

  // Your protected logic here
  return Response.json({ data: 'Protected data' });
}
```

### Adding Logout Button

```tsx
// components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

## Troubleshooting

### Common Issues

1. **"Admin credentials are not configured on this server"**
   - Solution: Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` to `.env.local`

2. **Redirect loop on login page**
   - Check that `/admin/login` is excluded in middleware matcher
   - Verify middleware configuration is correct

3. **Session not persisting**
   - Ensure cookies are enabled in browser
   - Check `secure` cookie setting matches environment (HTTP vs HTTPS)

4. **Google OAuth not working**
   - Verify Supabase credentials are configured
   - Check Supabase dashboard for OAuth provider setup

## Testing

### Manual Testing Steps

1. **Test Unauthenticated Access**
   ```bash
   # Should redirect to /admin/login
   curl -I http://localhost:3000/admin
   ```

2. **Test Login**
   ```bash
   # Should return session cookie
   curl -X POST http://localhost:3000/api/admin/auth \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}' \
     -c cookies.txt
   ```

3. **Test Authenticated Access**
   ```bash
   # Should return 200 OK
   curl -I http://localhost:3000/admin -b cookies.txt
   ```

4. **Test Logout**
   ```bash
   # Should clear session cookie
   curl -X DELETE http://localhost:3000/api/admin/auth -b cookies.txt
   ```

## Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols

2. **Rotate Credentials Regularly**
   - Change admin credentials periodically
   - Update environment variables on all deployments

3. **Use HTTPS in Production**
   - Always use HTTPS for production deployments
   - Ensures secure cookie transmission

4. **Monitor Login Attempts**
   - Implement rate limiting for login endpoints
   - Track failed authentication attempts

5. **Keep Dependencies Updated**
   - Regularly update Next.js and Supabase packages
   - Apply security patches promptly

## Next Steps

After setting up admin login:

1. ✅ Set admin credentials in environment variables
2. ✅ Test login with username/password
3. ✅ Configure Supabase for additional auth methods (optional)
4. ✅ Deploy to production with HTTPS
5. ✅ Share login credentials with authorized team members
6. ✅ Document your custom admin workflows

## Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [HTTP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)

---

**বাংলায় সংক্ষিপ্ত গাইড**

## এডমিন লগইন কিভাবে কাজ করে

১. **এডমিন প্যানেলে যান** → `/admin` অথবা যেকোনো `/admin/*` পেজে যান

২. **লগইন পেজে রিডাইরেক্ট হবে** → আপনি authenticated না থাকলে `/admin/login` পেজে নিয়ে যাবে

৩. **ইউজারনেম এবং পাসওয়ার্ড দিন** → আপনার এডমিন credentials দিয়ে লগইন করুন

৪. **একটিভ হবে** → সফল লগইনের পর ৭ দিনের জন্য session তৈরি হবে

৫. **এডমিন প্যানেলে এক্সেস পাবেন** → আপনি এখন সকল admin features ব্যবহার করতে পারবেন

**প্রয়োজনীয় Environment Variables:**
- `ADMIN_USERNAME` - আপনার এডমিন ইউজারনেম
- `ADMIN_PASSWORD` - আপনার এডমিন পাসওয়ার্ড

এই দুটি variable `.env.local` ফাইলে যোগ করুন এবং সার্ভার রিস্টার্ট করুন।
