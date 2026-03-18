# Clothify Ready-to-Use Setup (Bangla)

এই ফাইলটি আপনার production setup দ্রুত শেষ করার জন্য step-by-step checklist।

## 1) Hardening Status (Done)

- `next` আপডেট: `16.1.7`
- `jspdf` আপডেট: `4.2.1`
- `npm audit --omit=dev`: `0 vulnerabilities`

## 2) OpenAI API Key কোথায় পাবেন

1. OpenAI Platform এ সাইন-ইন করুন: `https://platform.openai.com/`
2. Billing/usage enable করুন।
3. API Key তৈরি করুন: `https://platform.openai.com/api-keys`
4. `.env.local` এ বসান:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
SUMONIX_TRANSLATION_MODEL=gpt-4o-mini
```

5. Server restart দিন।

## 3) WhatsApp Webhook কিভাবে পাবেন

সবচেয়ে দ্রুত 2টা পথ:

### Option A (Fastest): Make/Zapier/Pipedream Webhook

1. Make/Zapier/Pipedream এ নতুন scenario/flow খুলুন।
2. Trigger হিসেবে `Custom Webhook` নিন।
3. যে webhook URL পাবেন, `.env.local` এ বসান:

```env
WHATSAPP_NOTIFY_ENABLED=true
WHATSAPP_NOTIFY_WEBHOOK_URL=https://your-webhook-url
WHATSAPP_NOTIFY_WEBHOOK_SECRET=your-secret
WHATSAPP_NOTIFY_ORDER_EVENTS=true
WHATSAPP_NOTIFY_SECURITY_EVENTS=true
```

4. Flow এর পরের step এ WhatsApp channel (আপনার provider) দিয়ে message send করুন।
5. Incoming header `x-webhook-secret` verify করুন (security).

### Option B (Official): Meta WhatsApp Cloud API

1. Meta developers এ app + WhatsApp product add করুন।
2. Temporary token/phone number ID নিয়ে Graph API test করুন।
3. Webhook callback URL configure করুন।
4. callback URL হিসেবে আপনার middleware/webhook receiver endpoint দিন।
5. Verify token match করিয়ে webhook verification complete করুন।

Official docs:
- `https://developers.facebook.com/docs/whatsapp/cloud-api/get-started`
- `https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks`

## 4) `.env.local` Final Template

নিচের keys পূরণ থাকলে এই project ready:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH=false

NEXT_PUBLIC_SITE_URL=https://your-domain.com

WHATSAPP_NOTIFY_ENABLED=true
WHATSAPP_NOTIFY_WEBHOOK_URL=...
WHATSAPP_NOTIFY_WEBHOOK_SECRET=...
WHATSAPP_NOTIFY_ORDER_EVENTS=true
WHATSAPP_NOTIFY_SECURITY_EVENTS=true

OPENAI_API_KEY=...
SUMONIX_TRANSLATION_MODEL=gpt-4o-mini
```

## 5) Verify Checklist (Run Order)

```bash
npm install
npm run lint
npm run build
npm audit --omit=dev
```

Expected:
- lint: no errors (warnings থাকতে পারে)
- build: success
- audit: `0 vulnerabilities`

## 6) Runtime Smoke Test

1. একটি test order place করুন
2. নিশ্চিত করুন webhook endpoint message পেয়েছে
3. admin login failed attempts দিলে security alert notification trigger হচ্ছে কিনা দেখুন
4. SUMONIX এ বাংলা/ইংরেজি prompt দিয়ে multilingual reply verify করুন
