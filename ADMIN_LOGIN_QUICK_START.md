# Admin Login - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Environment Variables
Create `.env.local` and add:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Access Admin Panel
Open browser: http://localhost:3000/admin

### Step 4: Login
- You'll be redirected to `/admin/login`
- Enter your username and password
- Click "Sign In"
- You're now in the admin panel! 🎉

---

## 📊 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Access Flow                             │
└─────────────────────────────────────────────────────────────────┘

1. User navigates to /admin
                │
                ▼
2. Middleware intercepts request
                │
                ▼
3. Check for admin_session cookie
                │
        ┌───────┴───────┐
        │               │
    ✓ Valid         ✗ Invalid/Missing
        │               │
        ▼               ▼
4. Allow access   Redirect to /admin/login?next=/admin
        │               │
        │               ▼
        │         5. Show login form
        │               │
        │               ▼
        │         6. User submits credentials
        │               │
        │               ▼
        │         7. POST /api/admin/auth
        │               │
        │         8. Validate credentials
        │               │
        │         ┌─────┴─────┐
        │         │           │
        │     ✓ Valid     ✗ Invalid
        │         │           │
        │         ▼           ▼
        │   9. Set cookie  Show error
        │         │
        │         ▼
        │   10. Redirect to /admin
        │         │
        └─────────┴──────────▼
              11. User accesses admin panel
```

---

## 🔐 Security Checklist

- [x] **HTTP-Only Cookies** - JavaScript cannot access session
- [x] **Secure in Production** - HTTPS-only transmission
- [x] **SameSite Protection** - CSRF attack prevention
- [x] **7-Day Expiration** - Automatic logout after 1 week
- [x] **Environment Secrets** - Never committed to Git
- [x] **Route Protection** - All /admin/* routes secured
- [x] **Redirect Preservation** - Returns to intended page

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `app/admin/login/page.tsx` | Login UI with 4 auth methods |
| `app/api/admin/auth/route.ts` | Login/logout API endpoints |
| `middleware.ts` | Route protection & redirect |
| `lib/admin-auth.ts` | Auth validation utilities |
| `.env.local` | Your credentials (NOT in Git) |

---

## 🔑 Auth Methods Available

| Method | Status | Requirements |
|--------|--------|--------------|
| **Username/Password** | ✅ Ready | ADMIN_USERNAME, ADMIN_PASSWORD |
| **Google OAuth** | ⚙️ Optional | Supabase config |
| **Email OTP** | ⚙️ Optional | Supabase config |
| **Password Reset** | ⚙️ Optional | Supabase config |
| **Registration** | ⚙️ Optional | Supabase config |

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
```

### Testing Login
```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Test with curl
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}' \
  -c cookies.txt -v
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Admin credentials not configured" | Add ADMIN_USERNAME and ADMIN_PASSWORD to .env.local |
| Cannot login | Check credentials match .env.local exactly |
| Redirect loop | Verify /admin/login is excluded in middleware |
| Session not persisting | Enable cookies in browser |
| Google OAuth fails | Configure Supabase credentials |

---

## 📞 Support

For detailed documentation, see [ADMIN_LOGIN_GUIDE.md](./ADMIN_LOGIN_GUIDE.md)

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Set strong ADMIN_PASSWORD (min 16 chars)
- [ ] Configure environment variables on hosting platform
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Test login functionality
- [ ] Verify all admin routes are protected
- [ ] Document credentials securely
- [ ] Set up backup admin access
- [ ] Enable monitoring/logging

---

**বাংলায়**: এডমিন প্যানেলে ঢোকার জন্য `.env.local` ফাইলে `ADMIN_USERNAME` এবং `ADMIN_PASSWORD` সেট করুন, তারপর `/admin` এ যান এবং লগইন করুন।
