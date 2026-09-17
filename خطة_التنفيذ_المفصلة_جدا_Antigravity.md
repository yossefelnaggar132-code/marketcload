# خطة التنفيذ المفصّلة (احترافية) — ماركت بليس أثاث دمياط
## دليل يومي/تفصيلي للتنفيذ على Antigravity

كل أسبوع في الخطة السابقة اتقسم هنا لخطوات أصغر (2-4 أيام لكل خطوة)، وكل خطوة معاها **Prompt احترافي كامل** يشمل: أسماء الجداول والأعمدة بالضبط، حالات الخطأ (Error States)، حالات التحميل (Loading States)، الحالات الفارغة (Empty States)، وقواعد التحقق (Validation). الهدف إنك تنسخ الـPrompt كامل زي ما هو ومتحتاجش تضيف تفاصيل بنفسك.

---

## المرحلة 0: التحضير (يوم 1-3)

### الخطوة 0.1: إنشاء المشروع الأساسي (يوم 1)

**Prompt:**
```
أنشئ مشروع Next.js 14 جديد بالمواصفات التالية:
- App Router (وليس Pages Router)
- TypeScript
- Tailwind CSS
- ESLint مفعّل
- بنية المجلدات: app/ (للصفحات)، components/ (مكونات مشتركة)، lib/ (دوال مساعدة واتصالات)، types/ (تعريفات TypeScript)

ثبّت المكتبات التالية:
- @supabase/supabase-js
- @supabase/ssr
- react-hook-form (لإدارة الفورمز)
- zod (للتحقق من صحة البيانات)
- @hookform/resolvers (لربط zod مع react-hook-form)
- date-fns (للتعامل مع التواريخ)
- lucide-react (للأيقونات)

أنشئ ملف types/database.ts فارغ سأضع فيه أنواع البيانات لاحقًا.
أنشئ ملف .env.local.example فيه المتغيرات المطلوبة بدون قيم فعلية:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**معيار الإنجاز:**
- [ ] `npm run dev` يشتغل بدون أخطاء.
- [ ] بنية المجلدات موجودة بالكامل.

### الخطوة 0.2: إعداد اتصال Supabase (يوم 2)

**Prompt:**
```
أنشئ اتصال Supabase بطريقة صحيحة لمشروع Next.js 14 App Router، بالملفات التالية:

1. lib/supabase/client.ts: دالة createClient() تستخدم في Client Components، تستخدم @supabase/ssr's createBrowserClient.

2. lib/supabase/server.ts: دالة createClient() async تستخدم في Server Components وServer Actions، تستخدم @supabase/ssr's createServerClient مع التعامل الصحيح مع cookies من next/headers.

3. lib/supabase/middleware.ts: دالة updateSession(request) تستخدم في middleware.ts لتحديث جلسة المستخدم (session) في كل طلب.

4. middleware.ts في الجذر: يستدعي updateSession ويطبّقها على كل المسارات ماعدا الملفات الثابتة (_next/static, _next/image, favicon.ico).

اشرح لي في تعليقات الكود (comments) الفرق بين استخدام client.ts وserver.ts ومتى أستخدم كل واحد.
```

**معيار الإنجاز:**
- [ ] عند تشغيل استعلام تجريبي (`select * from` على جدول فاضي) من صفحة، مفيش خطأ اتصال.

### الخطوة 0.3: رفع المشروع على GitHub وربطه بـVercel (يوم 3)

**Prompt:**
```
أنشئ ملف .gitignore مناسب لمشروع Next.js (يستثني node_modules, .env.local, .next, وغيرها من ملفات النظام).
أنشئ ملف README.md بسيط يشرح: اسم المشروع، وصف مختصر، خطوات التشغيل المحلي (npm install, نسخ .env.local.example إلى .env.local وملء القيم, npm run dev).
```

**معيار الإنجاز:**
- [ ] المشروع مرفوع على GitHub بدون رفع `.env.local` بالخطأ.
- [ ] مربوط بـVercel وأي Push على main يعمل Deploy تلقائي (حتى لو الموقع لسه فاضي).

---

## المرحلة 1: قاعدة البيانات (الأسبوع 1-2)

### الخطوة 1.1: جداول المستخدمين والمعارض (يوم 1-2)

**Prompt:**
```
أنا أبني منصة ماركت بليس أثاث. اكتب لي SQL migration (ملف supabase/migrations/001_users_vendors.sql) ينشئ الجداول التالية:

جدول profiles:
- id: uuid, primary key, مرتبط بـ auth.users(id) on delete cascade
- role: text, not null, check (role in ('customer', 'vendor', 'admin')), default 'customer'
- full_name: text, not null
- phone: text
- avatar_url: text
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

جدول vendors:
- id: uuid, primary key, default gen_random_uuid()
- profile_id: uuid, not null, references profiles(id) on delete cascade, unique
- business_name: text, not null
- commercial_registration_number: text
- description: text
- logo_url: text
- tier: text, not null, check (tier in ('basic', 'verified', 'premium')), default 'basic'
- status: text, not null, check (status in ('pending', 'approved', 'rejected', 'suspended')), default 'pending'
- rating_average: numeric(2,1), default 0
- total_sales: integer, default 0
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

أضف Trigger يحدّث updated_at تلقائيًا عند أي تعديل على الصف في الجدولين.

أضف Trigger على auth.users بحيث عند إنشاء مستخدم جديد، يُنشأ تلقائيًا صف مقابل في profiles (بالـ id نفسه والبيانات من raw_user_meta_data).

فعّل Row Level Security على الجدولين، وأضف Policies:
- profiles: كل مستخدم يقدر يقرأ ويعدّل بياناته هو فقط (auth.uid() = id). الأدمن يقدر يقرأ الكل.
- vendors: أي حد يقدر يقرأ المعارض بحالة status='approved' (عرض عام). صاحب المعرض يقدر يقرأ ويعدّل بيانات معرضه هو فقط. الأدمن يقدر يقرأ ويعدّل كل شيء.
```

**معيار الإنجاز:**
- [ ] الجدولين ظاهرين في Supabase Table Editor بكل الأعمدة الصحيحة.
- [ ] عند إنشاء مستخدم تجريبي من Supabase Auth، يظهر صف تلقائي في profiles.
- [ ] محاولة قراءة بيانات مستخدم آخر (من مستخدم عادي) تفشل بسبب RLS.

### الخطوة 1.2: جداول المنتجات والتفاعل (يوم 3-4)

**Prompt:**
```
اكتب SQL migration (ملف supabase/migrations/002_products.sql) للجداول التالية:

جدول products:
- id: uuid, primary key, default gen_random_uuid()
- vendor_id: uuid, not null, references vendors(id) on delete cascade
- title: text, not null
- description: text
- price: numeric(10,2), not null, check (price > 0)
- category: text, not null, check (category in ('bedroom', 'living_room', 'kitchen', 'dining_room', 'office', 'other'))
- post_type: text, not null, check (post_type in ('available', 'portfolio')), default 'available'
- status: text, not null, check (status in ('active', 'inactive', 'sold')), default 'active'
- media_urls: text[], not null, default '{}'
- media_type: text, check (media_type in ('image', 'video')), default 'image'
- trending_score: numeric(10,4), default 0
- views_count: integer, default 0
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

جدول product_customization_options:
- id: uuid, primary key, default gen_random_uuid()
- product_id: uuid, not null, references products(id) on delete cascade
- option_name: text, not null (مثال: "الخامة", "اللون", "المقاس")
- option_values: text[], not null (مثال: ['خشب زان', 'خشب MDF'])
- created_at: timestamptz, default now()

جدول post_interactions:
- id: uuid, primary key, default gen_random_uuid()
- product_id: uuid, not null, references products(id) on delete cascade
- user_id: uuid, not null, references profiles(id) on delete cascade
- type: text, not null, check (type in ('like', 'save', 'comment'))
- comment_text: text (يُستخدم فقط لو type='comment')
- created_at: timestamptz, default now()
- unique constraint على (product_id, user_id, type) لمنع تكرار اللايك/الحفظ من نفس المستخدم لنفس المنتج (لا ينطبق على comment)

أضف index على products(category), products(vendor_id), products(trending_score desc), post_interactions(product_id), post_interactions(user_id).

فعّل RLS:
- products: أي حد يقدر يقرأ المنتجات بحالة status='active'. المعرض صاحب المنتج يقدر يعدّل/يحذف منتجاته فقط. الأدمن يقدر كل شيء.
- product_customization_options: نفس صلاحيات products (تابعة له).
- post_interactions: أي مستخدم مسجّل يقدر يضيف تفاعل باسمه هو فقط (auth.uid() = user_id)، ويقدر يحذف تفاعله هو فقط. القراءة عامة للجميع.
```

**معيار الإنجاز:**
- [ ] تقدر تضيف منتج تجريبي عبر Table Editor وتتحقق من الـ constraints (مثلًا سعر سالب يُرفض).
- [ ] الـ unique constraint يمنع لايك مكرر من نفس المستخدم.

### الخطوة 1.3: جداول الطلبات وRFQ (يوم 5-6)

**Prompt:**
```
اكتب SQL migration (ملف supabase/migrations/003_orders.sql) للجداول التالية:

جدول orders:
- id: uuid, primary key, default gen_random_uuid()
- customer_id: uuid, not null, references profiles(id)
- vendor_id: uuid, not null, references vendors(id)
- product_id: uuid, references products(id)
- order_type: text, not null, check (order_type in ('direct', 'custom', 'rfq'))
- customization_selections: jsonb (يخزن اختيارات العميل من خيارات التخصيص، مثال: {"الخامة": "خشب زان", "اللون": "بني"})
- quantity: integer, not null, default 1
- unit_price: numeric(10,2), not null
- total_price: numeric(10,2), not null
- platform_fee: numeric(10,2), default 0
- payment_method: text, check (payment_method in ('online', 'cod'))
- payment_status: text, not null, check (payment_status in ('pending', 'paid', 'failed', 'refunded')), default 'pending'
- order_status: text, not null, check (order_status in ('pending_confirmation', 'confirmed', 'in_production', 'ready_for_shipping', 'shipped', 'delivered_confirmed', 'disputed', 'cancelled')), default 'pending_confirmation'
- shipped_at: timestamptz
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

جدول rfq_requests:
- id: uuid, primary key, default gen_random_uuid()
- customer_id: uuid, not null, references profiles(id)
- category: text, not null
- specifications: text, not null
- budget_min: numeric(10,2)
- budget_max: numeric(10,2)
- status: text, not null, check (status in ('open', 'closed', 'fulfilled')), default 'open'
- created_at: timestamptz, default now()

جدول rfq_offers:
- id: uuid, primary key, default gen_random_uuid()
- rfq_id: uuid, not null, references rfq_requests(id) on delete cascade
- vendor_id: uuid, not null, references vendors(id)
- price: numeric(10,2), not null
- notes: text
- estimated_days: integer
- status: text, not null, check (status in ('pending', 'accepted', 'rejected')), default 'pending'
- created_at: timestamptz, default now()
- unique constraint على (rfq_id, vendor_id) لمنع تكرار عرض من نفس المعرض على نفس الـRFQ

أضف triggers لتحديث updated_at.

فعّل RLS:
- orders: العميل يقدر يقرأ طلباته هو فقط. المعرض يقدر يقرأ الطلبات المرتبطة به هو فقط ويعدّل order_status فقط. الأدمن يقدر كل شيء.
- rfq_requests: العميل صاحب الطلب يقدر يقرأ ويعدّل طلبه. المعارض تقدر تقرأ كل الطلبات المفتوحة (status='open') في فئتها. الأدمن يقدر كل شيء.
- rfq_offers: المعرض يقدر يضيف عرضًا باسمه هو فقط ويعدّله. العميل صاحب الـRFQ يقدر يقرأ كل العروض على طلبه.
```

**معيار الإنجاز:**
- [ ] تقدر تنشئ طلب تجريبي وتتحقق من كل الـ constraints.
- [ ] الـ unique constraint على rfq_offers يمنع عرض مكرر من نفس المعرض.

### الخطوة 1.4: جداول التسليم والنزاعات (يوم 7)

**Prompt:**
```
اكتب SQL migration (ملف supabase/migrations/004_delivery_disputes.sql) للجداول التالية:

جدول delivery_confirmations:
- id: uuid, primary key, default gen_random_uuid()
- order_id: uuid, not null, references orders(id) on delete cascade, unique
- proof_media_url: text
- confirmation_type: text, check (confirmation_type in ('manual', 'auto')), default 'manual'
- confirmed_at: timestamptz
- deadline_at: timestamptz (يُحسب: shipped_at + 72 ساعة)
- created_at: timestamptz, default now()

جدول disputes:
- id: uuid, primary key, default gen_random_uuid()
- order_id: uuid, not null, references orders(id), unique
- customer_id: uuid, not null, references profiles(id)
- reason: text, not null
- evidence_urls: text[], default '{}'
- status: text, not null, check (status in ('open', 'under_review', 'resolved_customer', 'resolved_vendor', 'resolved_partial')), default 'open'
- resolution_notes: text
- resolved_by: uuid, references profiles(id)
- resolved_at: timestamptz
- created_at: timestamptz, default now()

فعّل RLS:
- delivery_confirmations: العميل صاحب الطلب يقدر يقرأ ويعدّل. المعرض المرتبط بالطلب يقدر يقرأ فقط. الأدمن كل شيء.
- disputes: العميل صاحب النزاع يقدر يقرأ ويُنشئ. المعرض المرتبط بالطلب يقدر يقرأ فقط. الأدمن يقدر يقرأ ويعدّل الكل (لحسم النزاع).
```

**معيار الإنجاز:**
- [ ] كل الجداول (10 جداول إجمالًا) ظاهرة وتعمل بعلاقاتها الصحيحة.
- [ ] راجع مخطط العلاقات (ERD) في Supabase للتأكد من عدم وجود علاقة مفقودة.

---

## المرحلة 2: تسجيل الدخول (الأسبوع 3-4)

### الخطوة 2.1: صفحة تسجيل العميل (يوم 1-2)

**Prompt:**
```
أنشئ صفحة app/(auth)/signup/page.tsx لتسجيل عميل جديد، بالمواصفات:

الفورم (باستخدام react-hook-form + zod):
- full_name: نص مطلوب، 3 أحرف على الأقل
- email: بريد إلكتروني صحيح، مطلوب
- phone: رقم هاتف مصري صحيح (يبدأ بـ 01 وطوله 11 رقم)، مطلوب
- password: 8 أحرف على الأقل، يحتوي رقم وحرف واحد على الأقل
- confirm_password: يجب أن يطابق password

عند الإرسال:
1. استخدم supabase.auth.signUp مع تمرير full_name وphone في options.data (raw_user_meta_data)
2. لو نجح: أظهر رسالة نجاح "تم إنشاء الحساب، تحقق من بريدك الإلكتروني لتفعيله" (لو تفعيل البريد مفعّل) أو وجّه مباشرة لصفحة /feed (لو التفعيل غير مطلوب)
3. لو فشل: أظهر رسالة خطأ واضحة (مثال: "هذا البريد مستخدم بالفعل" لو كان الخطأ duplicate email)

حالات الواجهة المطلوبة:
- Loading state: تعطيل الزرار وإظهار spinner أثناء الإرسال
- Error state: رسالة خطأ حمراء تحت الفورم
- تصميم: استخدم Tailwind، فورم في منتصف الصفحة، متجاوب مع الموبايل، اتجاه RTL بالكامل (dir="rtl")

أضف رابط أسفل الفورم: "عندك معرض؟ سجّل هنا" يوجّه لـ /vendor/signup
وأضف رابط: "عندك حساب بالفعل؟ سجّل دخول" يوجّه لـ /login
```

**معيار الإنجاز:**
- [ ] تسجيل عميل تجريبي ينجح ويظهر في Supabase Auth وفي جدول profiles.
- [ ] رسائل الخطأ تظهر بوضوح (جرّب بريد مكرر، باسورد قصير).

### الخطوة 2.2: صفحة تسجيل المعرض (يوم 3)

**Prompt:**
```
أنشئ صفحة app/(auth)/vendor/signup/page.tsx لتسجيل معرض جديد، مشابهة لصفحة العميل لكن بحقول إضافية:
- business_name: اسم المعرض، نص مطلوب
- commercial_registration_number: رقم السجل التجاري، نص مطلوب
- description: وصف مختصر للمعرض (اختياري، حتى 500 حرف)

عند الإرسال:
1. أنشئ المستخدم عبر supabase.auth.signUp مع role='vendor' في raw_user_meta_data
2. بعد نجاح إنشاء المستخدم، أنشئ صف في جدول vendors بـ profile_id = المستخدم الجديد، status='pending'
3. وجّه المستخدم لصفحة /vendor/pending-approval تعرض رسالة: "طلبك قيد المراجعة، سيتم التواصل معك خلال 48 ساعة"

تأكد من معالجة حالة الفشل الجزئي (لو المستخدم اتسجل في Auth لكن فشل إنشاء صف vendors) بعرض رسالة واضحة للمستخدم يتواصل بيها مع الدعم.
```

**معيار الإنجاز:**
- [ ] تسجيل معرض تجريبي ينشئ صفوف في auth.users وprofiles وvendors بشكل صحيح ومترابط.

### الخطوة 2.3: تسجيل الدخول والـMiddleware (يوم 4-5)

**Prompt:**
```
أنشئ صفحة app/(auth)/login/page.tsx بفورم: email، password، مع validation بسيط (بريد صحيح، باسورد غير فارغ).

عند الإرسال:
1. supabase.auth.signInWithPassword
2. لو نجح: اجلب role من جدول profiles، ووجّه:
   - customer → /feed
   - vendor (status='approved') → /vendor/dashboard
   - vendor (status='pending') → /vendor/pending-approval
   - admin → /admin
3. لو فشل: أظهر "البريد الإلكتروني أو كلمة المرور غير صحيحة"

أنشئ middleware.ts في جذر المشروع:
- يستخدم updateSession من lib/supabase/middleware.ts لتحديث الجلسة في كل طلب
- يحمي المسارات: أي مسار يبدأ بـ /vendor يتطلب تسجيل دخول + role=vendor، وإلا يوجّه لـ /login
- أي مسار يبدأ بـ /admin يتطلب role=admin، وإلا يوجّه لصفحة 403 أو /login
- المسارات العامة (/, /feed, /login, /signup, /vendor/signup) لا تتطلب تسجيل دخول

أنشئ زرار "تسجيل خروج" في مكون Header يستدعي supabase.auth.signOut() ويوجّه لـ /login
```

**معيار الإنجاز:**
- [ ] تسجيل دخول عميل يوجّه لـ /feed، معرض معتمد يوجّه للوحة تحكمه، معرض pending يوجّه لصفحة الانتظار.
- [ ] محاولة دخول /vendor/dashboard بدون تسجيل دخول تعيدك لـ /login تلقائيًا.

### الخطوة 2.4: لوحة الأدمن للموافقة على المعارض (يوم 6-8)

**Prompt:**
```
أنشئ صفحة app/admin/vendors/page.tsx (Server Component) تعرض قائمة المعارض بحالة status='pending' في جدول (Table)، بالأعمدة: اسم المعرض، رقم السجل التجاري، البريد الإلكتروني (من profiles عبر join)، تاريخ التسجيل.

لكل صف زرارين: "قبول" و"رفض" (استخدم Server Action).
- زرار قبول: يحدّث vendors.status = 'approved'
- زرار رفض: يفتح نافذة صغيرة (Modal) لكتابة سبب الرفض (اختياري)، ثم يحدّث status='rejected'

أضف Tabs أعلى الصفحة: "قيد المراجعة" (pending) / "معتمدة" (approved) / "مرفوضة" (rejected) / "الكل"

حالات الواجهة:
- Empty state: لو مفيش معارض في التصنيف المختار، أظهر رسالة "لا توجد معارض حاليًا" مع أيقونة مناسبة
- Loading state أثناء تنفيذ القبول/الرفض: تعطيل الزرار المضغوط فقط مع spinner صغير بداخله
```

**معيار الإنجاز:**
- [ ] الأدمن يقدر يوافق أو يرفض معرض تجريبي ويظهر التغيير فورًا في الواجهة.

---

## المرحلة 3: رفع المنتجات ولوحة تحكم المعرض (الأسبوع 5-8)

### الخطوة 3.1: إعداد Supabase Storage (يوم 1)

**Prompt:**
```
اكتب لي التعليمات (كخطوات، وليس كود فقط) لإنشاء Storage Bucket في Supabase اسمه "product-media":
- عام (public) للقراءة
- الكتابة مسموحة فقط للمستخدمين المسجلين من نوع vendor
- حد أقصى لحجم الملف: 50 ميجابايت
- الأنواع المسموحة: image/jpeg, image/png, image/webp, video/mp4, video/quicktime

اكتب أيضًا Storage Policy (SQL) تسمح فقط للمعرض صاحب الملف برفعه، مع تسمية الملفات بنمط: {vendor_id}/{product_id}/{timestamp}-{filename}
```

**معيار الإنجاز:**
- [ ] رفع ملف تجريبي من Storage UI في Supabase ينجح ويظهر رابط عام صحيح.

### الخطوة 3.2: فورم رفع منتج - الجزء الأساسي (يوم 2-3)

**Prompt:**
```
أنشئ صفحة app/vendor/products/new/page.tsx بفورم إنشاء منتج جديد (react-hook-form + zod):

الحقول:
- title: نص، مطلوب، 5-100 حرف
- description: نص طويل (textarea)، مطلوب، 20-1000 حرف
- price: رقم، مطلوب، أكبر من 0
- category: قائمة اختيار (select) من: غرف نوم (bedroom)، صالونات (living_room)، مطابخ (kitchen)، غرف سفرة (dining_room)، مكاتب (office)، أخرى (other)
- post_type: أزرار اختيار (radio) بين "متاح للبيع" (available) و"تم تسليمه بالفعل - عرض فقط" (portfolio)، مع نص توضيحي صغير تحت كل خيار يشرح الفرق

رفع الوسائط:
- منطقة سحب وإفلات (Drag & Drop) أو زرار اختيار ملفات، تسمح بصورة واحدة أو أكثر (حتى 5 صور)، أو فيديو واحد (حتى 60 ثانية، حتى 50 ميجا)
- معاينة (Preview) للصور/الفيديو المختارة قبل الرفع، مع إمكانية حذف أي ملف قبل الإرسال النهائي
- شريط تقدم (Progress bar) أثناء الرفع الفعلي لكل ملف

عند الإرسال:
1. ارفع الملفات إلى Storage bucket "product-media" أولًا، احصل على الروابط العامة
2. أنشئ صف في جدول products بالبيانات + media_urls (مصفوفة الروابط) + media_type (image أو video حسب النوع المرفوع)
3. بعد النجاح: وجّه لصفحة /vendor/products مع رسالة نجاح (Toast notification)

معالجة الأخطاء:
- لو فشل رفع أي ملف: أظهر رسالة خطأ محددة لهذا الملف، واسمح بإعادة المحاولة بدون فقدان باقي البيانات المدخلة في الفورم
- لو الفورم غير مكتمل: أظهر رسائل validation تحت كل حقل ناقص
```

**معيار الإنجاز:**
- [ ] رفع منتج تجريبي بصورتين ينجح، والملفات تظهر بروابط صحيحة في جدول products.
- [ ] محاولة رفع فيديو أكبر من 50 ميجا تُرفض برسالة واضحة.

### الخطوة 3.3: خيارات التخصيص (يوم 4)

**Prompt:**
```
أضف لصفحة app/vendor/products/new/page.tsx قسمًا اختياريًا "خيارات التخصيص" يظهر فقط لو post_type='available':

- زرار "أضف خيار تخصيص" يضيف صف جديد فيه: حقل اسم الخيار (مثال: الخامة)، وحقل قيم مفصولة بفاصلة يتحول لعرض Tags تفاعلية (يكتب المعرض "خشب زان" ويضغط Enter فتتحول لـ Tag، وهكذا)
- زرار "حذف" بجانب كل خيار لإزالته
- يمكن إضافة عدة خيارات (بلا حد أقصى معقول، مثلًا حتى 10)

عند إرسال الفورم، بعد إنشاء صف المنتج في products، أنشئ صفوف مقابلة في product_customization_options لكل خيار (بـ product_id, option_name, option_values).

لو المعرض لم يضف أي خيار تخصيص، لا تُنشئ أي صف (القسم اختياري بالكامل).
```

**معيار الإنجاز:**
- [ ] إضافة منتج بخياري تخصيص (خامة، لون) ينشئ صفين في product_customization_options مرتبطين بالمنتج الصحيح.

### الخطوة 3.4: صفحة إدارة المنتجات (يوم 5-6)

**Prompt:**
```
أنشئ صفحة app/vendor/products/page.tsx تعرض كل منتجات المعرض الحالي (حسب المستخدم المسجّل دخوله) في شكل جدول أو بطاقات:

كل صف/بطاقة يعرض: الصورة المصغّرة الأولى، العنوان، السعر، الفئة، الحالة (نشط/غير نشط/مباع)، نوع المنشور (متاح/portfolio)، عدد اللايكات، عدد المشاهدات.

أزرار لكل منتج: "تعديل" (يوجّه لـ /vendor/products/[id]/edit)، "حذف" (يفتح تأكيد Modal قبل الحذف الفعلي)، وزرار لتبديل الحالة نشط/غير نشط بسرعة (Toggle).

أضف فلتر أعلى الصفحة: حسب الحالة (الكل/نشط/غير نشط/مباع)، وحسب نوع المنشور (الكل/متاح/portfolio).

حالة فارغة: لو المعرض ماعندوش منتجات، أظهر رسالة ودّية "لم تقم بإضافة أي منتج بعد" مع زرار كبير "أضف منتجك الأول" يوجّه لـ /vendor/products/new.
```

**معيار الإنجاز:**
- [ ] كل منتجات المعرض التجريبي تظهر بشكل صحيح، والحذف والتعديل يعملان فعليًا.

### الخطوة 3.5: صفحة تعديل منتج (يوم 7)

**Prompt:**
```
أنشئ صفحة app/vendor/products/[id]/edit/page.tsx تشبه صفحة إنشاء منتج جديد، لكن:
- تُحمَّل البيانات الحالية للمنتج (من Server Component) وتُملأ في الفورم تلقائيًا (defaultValues في react-hook-form)
- خيارات التخصيص الحالية تظهر معبّأة وقابلة للتعديل/الحذف/الإضافة
- الصور/الفيديو الحالي يظهر في المعاينة، مع إمكانية حذف ملف موجود أو إضافة ملفات جديدة
- عند الحفظ: حدّث صف المنتج (UPDATE وليس INSERT)، واحذف/أضف صفوف product_customization_options حسب التعديلات

تحقق أمني: تأكد Server-side أن vendor_id للمنتج يطابق المستخدم الحالي قبل السماح بالتعديل، وإلا أعد توجيهه لصفحة خطأ 403.
```

**معيار الإنجاز:**
- [ ] تعديل منتج تجريبي (تغيير السعر وإضافة صورة) ينجح ويظهر التحديث فورًا.
- [ ] محاولة تعديل منتج معرض آخر (عبر تغيير الـ URL يدويًا) تُرفض.

### الخطوة 3.6: لوحة تحكم المعرض الرئيسية وبروفايله العام (يوم 8-9)

**Prompt:**
```
أنشئ صفحة app/vendor/dashboard/page.tsx (Server Component) تعرض للمعرض الحالي:
- بطاقات إحصائية: عدد المنتجات (نشطة)، عدد الطلبات الجديدة (order_status='pending_confirmation')، إجمالي المبيعات (من vendors.total_sales)، التصنيف الحالي (tier) مع شارة بصرية
- قائمة بآخر 5 طلبات واردة مع رابط "عرض الكل" لصفحة /vendor/orders
- تنبيه بصري لو status='pending' (لسه محتاج موافقة الأدمن) بمنع الوصول لباقي اللوحة

أنشئ صفحة عامة app/vendors/[id]/page.tsx (يشوفها أي زائر) تعرض:
- اسم المعرض، الوصف، الشعار، شارة التصنيف (badge ذهبي لـpremium، أزرق لـverified، بدون شارة لـbasic)
- شبكة (Grid) بكل منتجاته المتاحة للبيع (post_type='available' AND status='active')
- التقييم (rating_average) بنجوم
```

**معيار الإنجاز:**
- [ ] لوحة التحكم تعرض أرقامًا صحيحة مطابقة لقاعدة البيانات الفعلية.
- [ ] بروفايل المعرض العام يظهر بشكل صحيح لزائر غير مسجّل دخول.

---

## المرحلة 4: الفيد التفاعلي (الأسبوع 9-12)

### الخطوة 4.1: بنية صفحة الفيد الأساسية (يوم 1-2)

**Prompt:**
```
أنشئ صفحة app/feed/page.tsx تعرض منتجات (post_type='available' AND status='active') في شكل شبكة بطاقات متجاوبة (2 أعمدة موبايل، 4 أعمدة ديسكتوب).

أضف Tabs أفقية قابلة للتمرير أعلى الصفحة للفئات: الكل، غرف نوم، صالونات، مطابخ، غرف سفرة، مكاتب، أخرى. الضغط على تاب يفلتر المنتجات بدون إعادة تحميل الصفحة (استخدم useState أو searchParams في URL).

كل بطاقة منتج تعرض: الوسائط الأولى (صورة أو أول فريم من فيديو)، العنوان، السعر (منسّق بالجنيه المصري)، اسم المعرض مع شارة التصنيف، وأزرار التفاعل (لايك، حفظ، كومنت) بأيقونات من lucide-react.

Infinite scroll أو Pagination (اختر Infinite scroll): حمّل أول 20 منتج، وعند الوصول لآخر الصفحة حمّل 20 إضافية تلقائيًا.

حالة فارغة: لو مفيش منتجات في الفئة المختارة، أظهر رسالة "لا توجد منتجات في هذه الفئة حاليًا" مع رسم توضيحي بسيط.
```

**معيار الإنجاز:**
- [ ] الفيد يعرض كل المنتجات النشطة، والفلترة حسب الفئة تعمل فعليًا.
- [ ] التمرير لأسفل يحمّل منتجات إضافية بدون توقف.

### الخطوة 4.2: التفاعل (لايك/حفظ) (يوم 3)

**Prompt:**
```
أنشئ Client Component باسم components/ProductCard.tsx يحتوي على منطق التفاعل:

- زرار اللايك (قلب): عند الضغط، تحقق أولًا لو المستخدم مسجّل دخول (وإلا وجّهه لـ/login)، ثم أضف/احذف صف في post_interactions بـ type='like' (Optimistic UI: غيّر شكل القلب وزوّد/قلّل العداد فورًا قبل انتظار رد السيرفر، وارجع للحالة السابقة لو فشل الطلب).
- نفس المنطق لزرار الحفظ (bookmark) بـ type='save'.
- اعرض عدد اللايكات الحالي بجانب القلب.

استخدم useOptimistic hook من React لتطبيق الـ Optimistic Updates بشكل نظيف.

عند تحميل الفيد لأول مرة، تحقق (Server-side) هل المستخدم الحالي عامل لايك/حفظ لكل منتج مسبقًا، وأظهر الحالة الصحيحة من البداية (قلب ممتلئ لو عامل لايك).
```

**معيار الإنجاز:**
- [ ] الضغط على لايك يحدّث الشكل فورًا (بدون تأخير محسوس) ويُسجَّل في قاعدة البيانات.
- [ ] إعادة تحميل الصفحة تُظهر حالة اللايك/الحفظ الصحيحة كما تركها المستخدم.

### الخطوة 4.3: التعليقات (يوم 4)

**Prompt:**
```
أنشئ مكون components/CommentSection.tsx يظهر كـ Modal أو Drawer عند الضغط على أيقونة الكومنت في ProductCard:

- قائمة بكل التعليقات الحالية على المنتج (اسم المستخدم، صورته، النص، الوقت النسبي "منذ 5 دقائق" باستخدام date-fns)
- فورم بسيط أسفل القائمة: حقل نص + زرار إرسال، لإضافة تعليق جديد (ينشئ صف في post_interactions بـ type='comment' وcomment_text)
- Validation: التعليق لا يمكن أن يكون فارغًا، حد أقصى 500 حرف
- ترتيب التعليقات: الأحدث أولًا

حالة فارغة: لو مفيش تعليقات، أظهر "كن أول من يعلّق على هذا المنتج"
```

**معيار الإنجاز:**
- [ ] إضافة تعليق تجريبي يظهر فورًا في القائمة بدون إعادة تحميل الصفحة.

### الخطوة 4.4: خوارزمية Trending (يوم 5-7)

**Prompt:**
```
أنشئ Supabase Database Function بلغة SQL اسمها calculate_trending_scores():

المعادلة لكل منتج:
trending_score = (
  (SELECT COUNT(*) FROM post_interactions WHERE product_id = products.id AND type='like' AND created_at > now() - interval '72 hours') * 1 +
  (SELECT COUNT(*) FROM post_interactions WHERE product_id = products.id AND type='comment' AND created_at > now() - interval '72 hours') * 2 +
  (SELECT COUNT(*) FROM post_interactions WHERE product_id = products.id AND type='save' AND created_at > now() - interval '72 hours') * 3
) / POWER((EXTRACT(EPOCH FROM (now() - products.created_at)) / 3600) + 2, 1.2)

الدالة تحدّث عمود trending_score لكل صف في جدول products.

بعد إنشاء الدالة، أنشئ Supabase Edge Function (Deno) في supabase/functions/update-trending-scores/index.ts تستدعي هذه الـ Database Function عبر RPC.

اكتب لي أيضًا تعليمات (بالخطوات) لجدولة هذه الـ Edge Function للعمل كل ساعة تلقائيًا باستخدام Supabase Cron (pg_cron extension).

عدّل صفحة app/feed/page.tsx بحيث يكون الترتيب الافتراضي داخل كل فئة حسب trending_score تنازليًا بدلًا من created_at.
```

**معيار الإنجاز:**
- [ ] تشغيل الدالة يدويًا (عبر SQL Editor في Supabase) يحدّث القيم بشكل منطقي.
- [ ] منتج بتفاعل حديث مرتفع يظهر أعلى من منتج أقدم بتفاعل أقل عند تحديث الفيد.

---

## المرحلة 5: الطلبات، التخصيص، وRFQ (الأسبوع 13-16)

### الخطوة 5.1: صفحة تفاصيل المنتج (يوم 1-2)

**Prompt:**
```
أنشئ صفحة app/products/[id]/page.tsx (Server Component) تعرض تفاصيل منتج واحد:

- معرض صور/فيديو (Gallery) بكل الوسائط المرفوعة، مع إمكانية التنقل بينها
- العنوان، الوصف الكامل، السعر، الفئة
- بطاقة المعرض (اسمه، شارة تصنيفه، تقييمه) قابلة للضغط للانتقال لبروفايله
- أزرار التفاعل (لايك/حفظ/كومنت) كما في الفيد
- لو post_type='available': زرار "اطلب الآن" بارز، ولو فيه خيارات تخصيص، زرار "اطلب بمواصفات مخصصة"
- لو post_type='portfolio': شارة واضحة "منتج تم تسليمه سابقًا - للعرض فقط" بدون زرار طلب، مع رسالة "أعجبك هذا التصميم؟ تواصل مع المعرض لطلب تصميم مشابه"
```

**معيار الإنجاز:**
- [ ] الصفحة تعرض كل بيانات المنتج بشكل صحيح، والفرق بين available وportfolio واضح بصريًا.

### الخطوة 5.2: فورم الطلب المباشر (يوم 3)

**Prompt:**
```
أنشئ Modal/صفحة app/products/[id]/order/page.tsx لتأكيد طلب مباشر (order_type='direct'):

- عرض ملخص المنتج (صورة، اسم، سعر)
- حقل كمية (quantity) بحد أدنى 1
- عرض السعر الإجمالي المحسوب تلقائيًا (price × quantity)
- اختيار طريقة الدفع: "دفع إلكتروني" أو "الدفع عند الاستلام"
- زرار "تأكيد الطلب"

عند التأكيد: أنشئ صف في orders بـ order_type='direct', unit_price=price المنتج, total_price المحسوب, order_status='pending_confirmation', payment_status='pending'.
وجّه المستخدم حسب طريقة الدفع المختارة: لو "دفع إلكتروني" → صفحة الدفع (سنبنيها لاحقًا)، لو "عند الاستلام" → صفحة تأكيد بسيطة "تم استلام طلبك".

تحقق: يجب أن يكون المستخدم مسجّل دخول كعميل قبل الوصول لهذه الصفحة.
```

**معيار الإنجاز:**
- [ ] طلب تجريبي ينشئ صف صحيح في orders بكل البيانات المطلوبة.

### الخطوة 5.3: فورم طلب التخصيص (يوم 4)

**Prompt:**
```
أنشئ صفحة app/products/[id]/customize/page.tsx (تظهر فقط لو المنتج عنده product_customization_options):

- لكل خيار تخصيص (مثل "الخامة")، اعرض أزرار اختيار (radio buttons) بالقيم المتاحة (مثل "خشب زان"، "خشب MDF")
- المستخدم يجب أن يختار قيمة واحدة لكل خيار متاح قبل المتابعة
- عرض ملخص الاختيارات النهائية قبل التأكيد
- نفس حقول الكمية وطريقة الدفع كما في الطلب المباشر

عند التأكيد: أنشئ صف في orders بـ order_type='custom', customization_selections (JSONB يحتوي كل الاختيارات مثل {"الخامة": "خشب زان", "اللون": "بني"}).
```

**معيار الإنجاز:**
- [ ] طلب تخصيص تجريبي يحفظ الاختيارات بشكل صحيح في عمود customization_selections.

### الخطوة 5.4: صفحات "طلباتي" و"الطلبات الواردة" (يوم 5-6)

**Prompt:**
```
أنشئ صفحة app/orders/page.tsx للعميل تعرض كل طلباته (من جدول orders where customer_id = current user)، مرتبة من الأحدث، مع فلتر حسب order_status.
كل طلب يظهر كبطاقة: صورة المنتج، اسم المعرض، السعر، حالة الطلب (بألوان مختلفة لكل حالة: أصفر لـpending، أزرق لـin_production، أخضر لـdelivered_confirmed، أحمر لـdisputed)، وزرار "عرض التفاصيل" يوجّه لصفحة /orders/[id].

أنشئ صفحة app/vendor/orders/page.tsx للمعرض تعرض الطلبات الواردة له (vendor_id = current vendor)، بنفس الفكرة، لكن مع إمكانية تحديث order_status عبر قائمة منسدلة (Select) بالتسلسل المنطقي المسموح فقط (مثلًا لا يمكن الرجوع من shipped إلى pending_confirmation).

أنشئ صفحة app/orders/[id]/page.tsx (Server Component) تعرض التفاصيل الكاملة لطلب واحد: كل بيانات المنتج، الكمية، السعر الإجمالي، طريقة الدفع، حالة الطلب، مع Timeline بصري يوضح مراحل الطلب (تم الطلب → مؤكد → قيد التصنيع → جاهز للشحن → تم الشحن → تم التأكيد).
```

**معيار الإنجاز:**
- [ ] العميل يشوف طلباته فقط، المعرض يشوف طلباته فقط (تحقق RLS يعمل).
- [ ] تحديث حالة الطلب من المعرض ينعكس فورًا في صفحة العميل.

### الخطوة 5.5: نظام RFQ - إنشاء الطلب (يوم 7-8)

**Prompt:**
```
أنشئ صفحة app/rfq/new/page.tsx بفورم:
- category: قائمة اختيار (نفس فئات المنتجات)
- specifications: textarea مطلوب، 20-1000 حرف، مع نص إرشادي "اذكر المقاسات، الخامة المفضلة، اللون، وأي تفاصيل أخرى"
- budget_min وbudget_max: حقلين رقميين اختياريين (نطاق ميزانية تقريبي)

عند الإرسال: أنشئ صف في rfq_requests بـ status='open'.
بعد الإنشاء، ابحث عن كل المعارض (status='approved') التي لديها منتج واحد على الأقل في نفس الفئة، وأنشئ لهم إشعارًا (سجل بسيط في جدول notifications إن وُجد، أو على الأقل تأكد أن استعلام /vendor/rfqs سيظهر لهم هذا الطلب تلقائيًا لأنه بنفس الفئة).

وجّه العميل بعد الإرسال لصفحة /rfq/[id] لمتابعة العروض الواردة.
```

**معيار الإنجاز:**
- [ ] RFQ تجريبي يُنشأ بنجاح ويظهر في قائمة الطلبات المفتوحة لفئته.

### الخطوة 5.6: نظام RFQ - عروض المعارض (يوم 9-10)

**Prompt:**
```
أنشئ صفحة app/vendor/rfqs/page.tsx تعرض للمعرض كل RFQs المفتوحة (status='open') في نفس فئة منتجاته، مرتبة من الأحدث. كل طلب يعرض: الفئة، المواصفات، نطاق الميزانية، وزرار "قدّم عرضًا" (لو المعرض لم يقدّم عرضًا من قبل على هذا الطلب تحديدًا - تحقق من الـunique constraint).

الزرار يفتح فورم صغير: السعر المقترح (price)، ملاحظات (notes، اختياري)، المدة المتوقعة بالأيام (estimated_days).

عند التقديم: أنشئ صف في rfq_offers بـ status='pending'. أظهر رسالة نجاح، وحدّث الزرار ليصبح "تم تقديم عرضك" (معطّل).
```

**معيار الإنجاز:**
- [ ] عرض تجريبي من معرض يظهر بشكل صحيح، ومحاولة تقديم عرض ثانٍ من نفس المعرض على نفس الطلب تُمنع.

### الخطوة 5.7: نظام RFQ - مقارنة واختيار العروض (يوم 11-12)

**Prompt:**
```
أنشئ صفحة app/rfq/[id]/page.tsx (يشوفها العميل صاحب الطلب فقط) تعرض:
- تفاصيل طلبه الأصلي (المواصفات، الميزانية)
- جدول مقارنة بكل العروض المقدّمة: اسم المعرض (رابط لبروفايله)، شارة تصنيفه، السعر، الملاحظات، المدة المتوقعة، تقييم المعرض (rating_average)
- ترتيب افتراضي: الأرخص أولًا، مع إمكانية إعادة الترتيب حسب السعر أو التقييم
- زرار "اختيار هذا العرض" بجانب كل عرض

عند اختيار عرض:
1. حدّث rfq_offers.status='accepted' للعرض المختار، و'rejected' لباقي العروض على نفس الطلب
2. حدّث rfq_requests.status='fulfilled'
3. أنشئ صف جديد في orders بـ order_type='rfq', vendor_id من العرض المختار, unit_price=السعر المتفق عليه, order_status='pending_confirmation'
4. وجّه العميل لصفحة /orders/[id] الجديدة

حالة فارغة: لو لسه مفيش عروض على الطلب، أظهر رسالة "بانتظار عروض من المعارض، سيصلك إشعار عند وصول أول عرض".
```

**معيار الإنجاز:**
- [ ] اختيار عرض تجريبي ينشئ طلبًا فعليًا في orders، ويرفض باقي العروض تلقائيًا.

---

## المرحلة 6: الدفع، تأكيد الاستلام، والنزاعات (الأسبوع 17-20)

### الخطوة 6.1: إعداد Paymob (يوم 1-2)

**Prompt:**
```
اشرح لي خطوة بخطوة كيف أنشئ حساب Paymob (Sandbox) وأحصل على: API Key، Integration ID (للبطاقات)، HMAC Secret.
بعد ما أحصل عليهم وأضعهم في .env.local، ابنِ لي:

1. lib/paymob.ts: دالة createPaymentIntention(order) ترسل طلبًا لـ Paymob's Intention API (v1/intention/) بالبيانات المطلوبة (amount بالقرش، currency EGP، بيانات العميل، بيانات الطلب)، وترجع رابط صفحة الدفع (payment_key/iframe URL).

2. app/api/payment/create/route.ts: API route (POST) يستقبل order_id، يجلب بيانات الطلب من قاعدة البيانات، يستدعي createPaymentIntention، ويرجع رابط الدفع للـFrontend.

3. app/api/payment/webhook/route.ts: API route (POST) يستقبل Webhook من Paymob بعد إتمام الدفع، يتحقق من صحة الـ HMAC signature (مهم جدًا للأمان)، وإذا نجح الدفع يحدّث orders.payment_status='paid' ويحسب platform_fee (نسبة صغيرة من total_price، القيمة تُحدَّد من متغير بيئة COMMISSION_RATE_LOCAL).
```

**معيار الإنجاز:**
- [ ] عملية دفع Sandbox تجريبية تنجح كاملة من البداية للنهاية، والـ Webhook يحدّث حالة الطلب فعليًا.

### الخطوة 6.2: صفحة إتمام الدفع (يوم 3)

**Prompt:**
```
أنشئ صفحة app/orders/[id]/checkout/page.tsx تظهر بعد تأكيد الطلب (لو اختار العميل "دفع إلكتروني"):

- ملخص الطلب (المنتج، الكمية، السعر الإجمالي)
- زرار "ادفع الآن" يستدعي app/api/payment/create ويفتح رابط الدفع (Paymob iframe) في نفس الصفحة أو نافذة جديدة
- صفحة app/orders/[id]/payment-success/page.tsx تظهر بعد نجاح الدفع (redirect من Paymob) تعرض "تم الدفع بنجاح" مع رابط لتفاصيل الطلب
- صفحة app/orders/[id]/payment-failed/page.tsx تظهر لو فشل الدفع، مع زرار "إعادة المحاولة"
```

**معيار الإنجاز:**
- [ ] دورة الدفع الكاملة (نجاح وفشل) تعمل وتوجّه المستخدم للصفحة الصحيحة.

### الخطوة 6.3: تأكيد الاستلام (يوم 4-5)

**Prompt:**
```
أنشئ صفحة app/orders/[id]/confirm-delivery/page.tsx تظهر فقط لو order_status='shipped':

- رفع صورة أو فيديو قصير كإثبات استلام (نفس منطق رفع الوسائط المستخدم في المنتجات، لكن bucket منفصل اسمه "delivery-proofs")
- زرارين: "تأكيد الاستلام - كل شيء تمام" و"الإبلاغ عن مشكلة" (يوجّه لصفحة فتح النزاع)

عند تأكيد الاستلام: أنشئ صف في delivery_confirmations بـ confirmation_type='manual', confirmed_at=now(). حدّث orders.order_status='delivered_confirmed'.

أنشئ Supabase Edge Function في supabase/functions/auto-confirm-deliveries/index.ts:
- تُشغَّل عبر Cron كل ساعة
- تبحث عن كل orders بحالة order_status='shipped' مر عليها أكثر من 72 ساعة منذ shipped_at بدون تأكيد يدوي أو نزاع مفتوح
- تحدّثها تلقائيًا: order_status='delivered_confirmed', تنشئ صف delivery_confirmations بـ confirmation_type='auto'

اكتب لي تعليمات جدولة هذه الـFunction كل ساعة عبر pg_cron.
```

**معيار الإنجاز:**
- [ ] تأكيد استلام يدوي يعمل ويحدّث الحالة فورًا.
- [ ] تشغيل الـEdge Function يدويًا على طلب تجريبي (بتاريخ shipped_at قديم) يؤكده تلقائيًا بشكل صحيح.

### الخطوة 6.4: نظام النزاعات - فتح النزاع (يوم 6-7)

**Prompt:**
```
أنشئ صفحة app/orders/[id]/dispute/page.tsx:

- فورم: سبب النزاع (قائمة اختيار: "المنتج تالف"، "المنتج مختلف عن الوصف"، "لم يصل المنتج"، "أخرى" مع حقل نص لو اختار أخرى)
- رفع أدلة (صور/فيديو، حتى 5 ملفات) - bucket منفصل "dispute-evidence"
- وصف تفصيلي للمشكلة (textarea مطلوب)

عند الإرسال: أنشئ صف في disputes بـ status='open'. حدّث orders.order_status='disputed'.
أظهر رسالة "تم فتح النزاع، سيتم مراجعته خلال 48 ساعة" مع رقم مرجعي للنزاع.
```

**معيار الإنجاز:**
- [ ] فتح نزاع تجريبي بأدلة يحدّث حالة الطلب فورًا لـ"disputed".

### الخطوة 6.5: نظام النزاعات - مراجعة الأدمن (يوم 8-10)

**Prompt:**
```
أنشئ صفحة app/admin/disputes/page.tsx تعرض كل النزاعات (status='open' أو 'under_review') مرتبة من الأقدم (أولوية للأقدم).

أنشئ صفحة app/admin/disputes/[id]/page.tsx تعرض تفاصيل نزاع واحد بالكامل:
- تفاصيل الطلب الأصلي (المنتج، السعر، المعرض، العميل)
- سبب النزاع ووصفه وكل الأدلة المرفوعة (معرض صور/فيديو)
- تاريخ تأكيد الاستلام (إن وُجد) وأي صور إثبات تسليم من المعرض (إن وُجدت)

فورم اتخاذ القرار:
- قائمة اختيار: "لصالح العميل - استرداد كامل"، "لصالح المعرض - رفض النزاع"، "حل وسط - استرداد جزئي" (مع حقل نسبة الاسترداد لو اختار هذا الخيار)
- حقل ملاحظات القرار (resolution_notes)

عند الحفظ: حدّث disputes.status (resolved_customer/resolved_vendor/resolved_partial)، disputes.resolved_by=admin id الحالي، disputes.resolved_at=now(). حدّث orders.order_status بناءً على القرار.
```

**معيار الإنجاز:**
- [ ] الأدمن يقدر يراجع نزاعًا تجريبيًا ويتخذ قرارًا، والحالة تتحدث بشكل صحيح ومترابط بين الجدولين.

---

## المرحلة 7: التصنيف، الاختبار، والإطلاق (الأسبوع 21-24)

### الخطوة 7.1: نظام تصنيف المعارض (يوم 1-2)

**Prompt:**
```
أنشئ صفحة app/admin/vendors/[id]/page.tsx (تفاصيل معرض واحد للأدمن) تعرض:
- كل بيانات المعرض، إحصائياته (عدد المنتجات، إجمالي المبيعات، متوسط التقييم)
- قائمة اختيار لتغيير tier يدويًا (basic/verified/premium) مع زرار حفظ

عدّل خوارزمية الترتيب في app/feed/page.tsx (أو في الدالة calculate_trending_scores إن كانت الأنسب) بحيث يُضرب trending_score في معامل إضافي حسب tier المعرض المرتبط بالمنتج:
- premium: ×1.3
- verified: ×1.15
- basic: ×1.0

أنشئ مكون components/VendorBadge.tsx يعرض شارة بصرية بجانب اسم المعرض في كل مكان (الفيد، صفحة المنتج، البروفايل، نتائج RFQ): شارة ذهبية بأيقونة تاج لـpremium، شارة زرقاء بعلامة صح لـverified، بدون شارة لـbasic.
```

**معيار الإنجاز:**
- [ ] ترقية معرض تجريبي لـpremium ترفع منتجاته فعليًا في ترتيب الفيد.
- [ ] الشارات تظهر صحيحة في كل الصفحات المذكورة.

### الخطوة 7.2: صفحة بحث وفلترة عامة (يوم 3)

**Prompt:**
```
أنشئ صفحة app/search/page.tsx تتيح للعميل البحث في المنتجات بالاسم/الوصف، مع فلاتر جانبية: الفئة، نطاق السعر (slider من - إلى)، تصنيف المعرض (basic/verified/premium)، نوع المنشور (متاح/portfolio).

استخدم Supabase full-text search (أو ilike بسيط للبداية) على عمودي title وdescription في جدول products.

أضف حقل بحث في الـHeader العام للموقع يوجّه لهذه الصفحة مع query parameter.
```

**معيار الإنجاز:**
- [ ] البحث عن كلمة موجودة في عنوان منتج تجريبي يُرجع النتيجة الصحيحة.

### الخطوة 7.3: تحسينات تجربة المستخدم العامة (يوم 4-5)

**Prompt:**
```
راجع كل صفحات المشروع وتأكد من توفر ما يلي في كل صفحة تتفاعل مع قاعدة البيانات:
1. Loading state واضح (Skeleton loaders بدلًا من شاشة بيضاء فارغة) أثناء جلب البيانات
2. Error state (رسالة خطأ ودّية + زرار "إعادة المحاولة") لو فشل الاتصال بقاعدة البيانات
3. Empty state مناسب لكل قائمة يُحتمل أن تكون فارغة
4. تأكد أن كل الصفحات تدعم RTL بشكل صحيح بالكامل (اتجاه النصوص، الأيقونات، المسافات)
5. تأكد من التجاوب (Responsiveness) على شاشات الموبايل الصغيرة (375px) والتابلت والديسكتوب

اعرض لي قائمة بأي صفحة تفتقد لأي من هذه العناصر مع اقتراح الإصلاح.
```

**معيار الإنجاز:**
- [ ] كل الصفحات الأساسية (فيد، منتج، طلبات، لوحة المعرض) تحتوي على الحالات الثلاث (تحميل/خطأ/فارغ).

### الخطوة 7.4: اختبار شامل يدوي (يوم 6-9)

**قائمة سيناريوهات الاختبار (نفّذها يدويًا وسجّل النتيجة):**
- [ ] تسجيل عميل جديد → تسجيل دخول → تصفح الفيد → لايك/حفظ/كومنت
- [ ] تسجيل معرض جديد → انتظار موافقة أدمن → رفع منتج بصور وفيديو → إضافة خيارات تخصيص
- [ ] عميل يطلب منتج مباشر → دفع إلكتروني (Sandbox) → المعرض يحدّث حالة الطلب حتى "تم الشحن"
- [ ] عميل يؤكد الاستلام بالصورة → التأكيد يظهر في الطلب
- [ ] عميل يفتح نزاع بدلًا من التأكيد → الأدمن يراجعه ويتخذ قرارًا
- [ ] عميل ينشئ RFQ → معرضين مختلفين يقدمان عرضين → العميل يقارن ويختار عرضًا → يتحوّل لطلب فعلي
- [ ] الطلب الذي لا يُؤكَّد لمدة 72 ساعة (محاكاة بتعديل التاريخ يدويًا في قاعدة البيانات) يتأكد تلقائيًا
- [ ] الأدمن يرقّي معرضًا لـPremium → منتجاته تظهر أعلى في الفيد فعليًا

**Prompt لمساعدتك في المراجعة:**
```
راجع الكود الكامل للمشروع، خصوصًا:
1. كل الأماكن التي تتحقق من صلاحيات المستخدم (RLS policies وأي تحقق إضافي في الكود) - تأكد عدم وجود ثغرة تسمح لمستخدم بالوصول لبيانات ليست له
2. كل الأماكن التي تتعامل مع الأموال (حساب platform_fee، تحديث payment_status) - تأكد من دقة الحسابات ومعالجة كل حالة فشل ممكنة
3. أي استعلام قاعدة بيانات بطيء محتمل (استعلامات بدون index مناسب، أو N+1 queries)
اعرض قائمة بأولوية الإصلاحات (عاجل / متوسط / منخفض).
```

**معيار الإنجاز:**
- [ ] كل السيناريوهات أعلاه تمت بنجاح بدون أخطاء قاتلة.
- [ ] قائمة موثقة بأي مشاكل متبقية وخطة لحلها.

### الخطوة 7.5: النشر على بيئة الإنتاج (يوم 10-11)

**Prompt:**
```
جهّز المشروع للنشر النهائي على Vercel:
1. اعرض لي قائمة كاملة بكل environment variables المطلوبة في بيئة الإنتاج (Supabase production URL/keys، Paymob production keys بدل Sandbox، أي مفتاح آخر مستخدم في المشروع)
2. تأكد أن كل الـ Webhook URLs (مثل Paymob webhook) تشير للدومين الفعلي وليس localhost
3. راجع next.config.js وتأكد من إعدادات الصور (next/image domains) تتضمن رابط Supabase Storage
4. اكتب لي قائمة تحقق نهائية (Pre-launch checklist) قبل الضغط على زرار "الإطلاق الفعلي"
```

**معيار الإنجاز:**
- [ ] الموقع يعمل بالكامل على رابط Production حقيقي.
- [ ] عملية دفع حقيقية (بمبلغ صغير تجريبي) تنجح بأموال حقيقية (وليس Sandbox).

### الخطوة 7.6: الإطلاق التجريبي المحدود (يوم 12-14)

**المهام (بدون Prompt برمجي — مهام تشغيلية):**
- [ ] تواصل شخصيًا مع 5-10 معارض حقيقية في دمياط، اشرح لهم المنصة، وساعدهم في التسجيل الأول خطوة بخطوة.
- [ ] راقب لوحة الأدمن يوميًا للموافقة على المعارض الجديدة بسرعة.
- [ ] ادعُ 10-20 شخصًا من معارفك لتجربة الشراء كعملاء واطلب منهم ملاحظات صريحة.
- [ ] احتفظ بقناة تواصل مباشرة (واتساب مثلًا) مع أول المعارض والعملاء لحل أي مشكلة فورًا خلال أول أسبوعين.

**معيار الإنجاز النهائي:**
- [ ] أول عملية بيع حقيقية بالكامل (من التصفح حتى تأكيد الاستلام) تمت بنجاح بدون تدخل يدوي منك في قاعدة البيانات.

---

## ملحق: نصائح للتعامل مع Antigravity بكفاءة عبر كل الخطوات

1. **انسخ الـPrompt كامل كما هو** — كل التفاصيل (أسماء الأعمدة، القيم المسموحة، حالات الواجهة) موجودة عمدًا لتقليل الحاجة لتوضيح إضافي.
2. **لو Antigravity أنتج كودًا يخالف تفصيلة في الـPrompt، صحّحه فورًا** بردّ مباشر: "غيّر كذا ليطابق كذا" بدل قبول الكود كما هو.
3. **بعد كل خطوة، اختبرها يدويًا فورًا** قبل الانتقال للخطوة التالية — الأخطاء المتراكمة أصعب بكثير في التتبع لاحقًا.
4. **احفظ كل Migration SQL في مجلد منفصل ومرقّم** (001_, 002_...) حتى لو لم تستخدم Supabase CLI رسميًا، لتقدر ترجع لأي نسخة قديمة من قاعدة البيانات عند الحاجة.
5. **لأي Prompt يتضمن أموالًا أو صلاحيات، اطلب من Antigravity شرح الكود سطرًا بسطر** قبل الدمج النهائي.
