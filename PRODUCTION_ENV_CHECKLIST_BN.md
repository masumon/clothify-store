# Clothify Production Environment Checklist

এই checklist `.env.local` এবং Vercel Project Settings -> Environment Variables দুই জায়গার জন্যই প্রযোজ্য।

## 1) Required Core Keys

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_SESSION_SECRET=your_long_random_secret
NEXT_PUBLIC_SITE_URL=https://clothify-store-main.vercel.app
```

ব্যাখ্যা:

- `NEXT_PUBLIC_SUPABASE_URL`: আপনার Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: frontend/public key
- `SUPABASE_SERVICE_ROLE_KEY`: server-only secret key
- `ADMIN_USERNAME`: admin login username বা email
- `ADMIN_PASSWORD`: admin password
- `ADMIN_SESSION_SECRET`: session signing secret, কমপক্ষে 32+ random characters দিন
- `NEXT_PUBLIC_SITE_URL`: production domain

## 2) Optional Admin Supabase Login

```env
NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH=true
ADMIN_SUPABASE_ALLOWED_EMAILS=owner@example.com,manager@example.com
```

ব্যাখ্যা:

- `NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH=true` দিলে admin login page-এ Google/OTP flow দেখাবে
- `ADMIN_SUPABASE_ALLOWED_EMAILS` এ comma-separated allowed emails দিন

## 3) WhatsApp Alerts + Smoke Test

```env
WHATSAPP_NOTIFY_ENABLED=true
WHATSAPP_NOTIFY_WEBHOOK_URL=https://your-webhook-endpoint
WHATSAPP_NOTIFY_WEBHOOK_SECRET=your_webhook_secret
WHATSAPP_NOTIFY_ORDER_EVENTS=true
WHATSAPP_NOTIFY_SECURITY_EVENTS=true
WHATSAPP_NOTIFY_TIMEOUT_MS=10000
```

ব্যাখ্যা:

- order created এবং security lockout alert পাঠাবে
- admin dashboard থেকে smoke test চালানো যাবে

## 4) Upstash Redis For Multi-Instance Consistency

```env
UPSTASH_REDIS_REST_URL=https://your-upstash-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

এগুলো দিলে:

- rate limit সব serverless instance-এ shared হবে
- webhook delivery logs shared থাকবে
- latency/error monitoring logs instance-safe থাকবে

এগুলো না দিলে:

- app safe memory fallback-এ চলবে
- single-instance local/dev okay
- multi-instance production consistency কমে যাবে

## 5) Sentry Monitoring

```env
SENTRY_DSN=https://server-dsn@o0.ingest.sentry.io/0
NEXT_PUBLIC_SENTRY_DSN=https://client-dsn@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.2
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.2
```

এগুলো দিলে:

- server API exception capture হবে
- browser/client exception capture হবে
- latency trace sampling চালু হবে

## 6) OpenAI For Better Multilingual SUMONIX

```env
OPENAI_API_KEY=your_openai_api_key
SUMONIX_TRANSLATION_MODEL=gpt-4o-mini
```

`OPENAI_API_KEY` না থাকলে:

- SUMONIX fallback translation mode-এ চলবে
- কাজ করবে, কিন্তু quality best হবে না

## 7) Vercel এ কিভাবে বসাবেন

Vercel Dashboard -> Project -> `Settings` -> `Environment Variables`

Format:

- `Key`: env key name
- `Value`: env value
- `Environment`: `Production`, `Preview`, `Development` যেগুলো দরকার select করুন

Recommended:

- production secrets: `Production` + `Preview`
- local-only test value: `.env.local`

## 8) Admin Health Check দিয়ে Verify

নতুন admin monitoring panel থেকে এখন আপনি:

- `Run Health Check`
- `Send WhatsApp Smoke`

চালাতে পারবেন।

Health Check দেখাবে:

- Supabase ready কি না
- Upstash configured কি না
- Sentry configured কি না
- Admin auth secret আছে কি না
- WhatsApp webhook configured কি না
- OpenAI configured কি না

## 9) Minimum Ready-To-Use Production Set

শুধু minimum production ready করতে এই 10টা key অবশ্যই দিন:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_SITE_URL=
WHATSAPP_NOTIFY_WEBHOOK_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

এর পর recommended:

```env
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
OPENAI_API_KEY=
```
