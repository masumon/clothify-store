# Clothify এডমিন প্যানেল গাইড (বাংলা)

এই গাইডটি স্টোর ম্যানেজার/এডমিনের জন্য। দৈনিক অপারেশন, অর্ডার ম্যানেজমেন্ট, প্রোডাক্ট কন্ট্রোল, স্টোর সেটিংস এবং রিপোর্টিং ধাপগুলো এখানে সংক্ষেপে দেওয়া হয়েছে।

---

## ১) এডমিন লগইন

১. ব্রাউজারে `/admin` ভিজিট করুন।  
২. লগইন পেজে Username/Password দিন।  
৩. সফল হলে Dashboard এ প্রবেশ করবেন।

### Optional Login Methods

`NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH=true` হলে OTP/Google/Register tab দেখা যাবে।  
না দিলে শুধু Username/Password মোড থাকবে।

---

## ২) Dashboard ব্যবহার

Dashboard এ আপনি দেখতে পারবেন:

১. Sales summary (today/7d/30d)  
২. Pending/Delivered/Returned/Cancelled trend  
৩. Traffic sources, top pages, visitor regions  
৪. Notifications (pending/cancel/return alert)  
৫. Quick links: Orders, Products, Settings

### Date Range Filter

উপরে `Today / Last 7 Days / Last 30 Days` বাটন থেকে range পরিবর্তন করুন।

---

## ৩) Products & Inventory Management

`/admin/products` থেকে:

১. নতুন প্রোডাক্ট upload করুন  
২. Category/Name/Price/Sizes সেট করুন  
৩. Stock, Featured, Campaign badge আপডেট করুন  
৪. Product `Publish` বা `Draft` করুন  
৫. Search + Category filter ব্যবহার করুন  
৬. Bulk action করুন:
- Bulk Publish  
- Bulk Draft  
- Bulk Delete  

### ভালো প্রোডাক্ট এন্ট্রি নিয়ম

১. পরিষ্কার নাম দিন (category + style + fabric)  
২. সঠিক ছবি ব্যবহার করুন  
৩. সাইজ/স্টক রিয়েলটাইম রাখুন  
৪. ভুল/ডুপ্লিকেট প্রোডাক্ট draft করুন, delete না করলেও হবে

---

## ৪) Orders Command Center

`/admin/orders` থেকে:

১. Customer list, amount, status, courier, payment দেখুন  
২. Search/filter করুন (status/courier/payment/date)  
৩. Order status update করুন:
- Pending  
- Processing  
- Shipped  
- Delivered  
- Completed  
- Returned  
- Cancelled  
৪. Courier-wise রিপোর্ট দেখুন  
৫. PDF export করুন (filtered report)

### দৈনিক অর্ডার অপারেশন

১. Pending order যাচাই  
২. Payment method/TRX check  
৩. Courier dispatch update  
৪. Delivered/Returned final status update

---

## ৫) Store Settings

`/admin/settings` থেকে:

১. Store name, slogan, address আপডেট  
২. Contact phone + WhatsApp number সেট  
৩. bKash number ও QR upload  
৪. Logo upload  
৫. Save করে frontend reflect হয়েছে কিনা যাচাই

---

## ৬) SUMONIX AI (Admin Assist ব্যবহার কৌশল)

এডমিন রুটে SUMONIX AI দিয়ে analytics প্রশ্ন করা যায়।

### ভালো প্রশ্ন টেমপ্লেট

১. `আজকের sales, pending, delivered summary দিন`  
২. `গত ৫ দিনে কোন product বেশি বিক্রি হয়েছে?`  
৩. `কোন courier-এ cancellation বেশি?`  
৪. `restock alert দিন`  
৫. `traffic source + drop-off insight দিন`

### ভালো ফলের জন্য

১. সময় পরিসীমা দিন (আজ/৭ দিন/৩০ দিন)  
২. metric উল্লেখ করুন (sales/order/status/source)  
৩. action-oriented প্রশ্ন করুন (কি করবো / কী পরিবর্তন করবো)

---

## ৭) প্রতিদিনের Admin Checklist

১. Dashboard দেখে anomalies চিহ্নিত করুন  
২. Pending order কমিয়ে আনুন  
৩. Stock কমে যাওয়া প্রোডাক্ট restock plan করুন  
৪. Draft product review করে publish করুন  
৫. Settings (payment number/QR/WhatsApp) ঠিক আছে কিনা যাচাই  
৬. শেষ রিপোর্ট PDF export করে সংরক্ষণ করুন

---

## ৮) নিরাপত্তা চেকলিস্ট (Admin)

১. শক্তিশালী `ADMIN_PASSWORD` ব্যবহার করুন  
২. `ADMIN_SESSION_SECRET` দীর্ঘ ও random রাখুন  
৩. `.env.local` কখনও public repo তে push করবেন না  
৪. ভুল login প্রচেষ্টা monitor করুন  
৫. Admin credential নিয়মিত rotate করুন

---

## ৯) Troubleshooting

১. **লগইন হচ্ছে না**  
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` `.env.local` এ ঠিক আছে কিনা দেখুন  
- server restart দিন  

২. **Orders/Products দেখাচ্ছে না**  
- Supabase credentials verify করুন  
- table policy/migration check করুন  

৩. **Image upload fail**  
- storage bucket permission এবং API upload route check করুন  

৪. **Report PDF export issue**  
- browser popup/download allow কিনা দেখুন  

---

## ১০) অপারেশনাল নোট

১. Admin guide এবং Client guide আলাদা ব্যবহারযোগ্য ডকুমেন্ট।  
২. এই গাইড Sumonix backend-এর সাথে সরাসরি bind করা হয়নি (আপনার নির্দেশনা অনুযায়ী)।  
৩. তবুও এখানে দেওয়া প্রশ্ন টেমপ্লেট ফলো করলে SUMONIX থেকে বেশি প্রাসঙ্গিক উত্তর পাওয়া যাবে।
