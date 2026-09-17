# 🪑 ماركت بليس أثاث دمياط (Damietta Furniture Marketplace)

> **المنصة الرقمية الأولى التي تجمع نخبة صناع ومعارض أثاث دمياط بالعملاء مباشرة من الورشة إلى المنزل مع ضمان الجودة والدفع الآمن.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20RLS-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![TestSprite](https://img.shields.io/badge/Tests-100%25%20Passed-brightgreen?style=flat&logo=testinglibrary)](https://testsprite.com/)

---

## 🌟 نظرة عامة عن المشروع (Overview)

تُعد مدينة دمياط عاصمة صناعة الأثاث في الشرق الأوسط، حيث تضم آلاف الورش والحرفيين المهرة في صناعة الأثاث من خشب الزان الروماني والأرو الطبيعي. يهدف **ماركت بليس أثاث دمياط** إلى رقمنة هذه الصناعة وتوفير تجربة تسوق موثوقة تلغي السماسرة غير المعتمدين وتضمن حق المشتري والصانع على حدٍ سواء.

---

## ✨ المميزات الرئيسية (Key Features)

### 1. 🖼️ فيد تفاعلي للأثاث (Dynamic Feed & Trending)
- استعراض أحدث غرف النوم، الصالونات، المطابخ، وغرف السفرة المعروضة من ورش دمياط.
- خوارزمية ذكية تحسب رواج القطع وتفاعل الزوار (Likes, Saves, Views).
- فلترة متقدمة حسب الفئة، نوع الخشب، والسعر.

### 2. 📝 طلبات التفصيل المخصص (Custom RFQ System)
- إمكانية طلب تصنيع وتفصيل أثاث بمقاسات ومواصفات خاصة.
- توزيع آلي للطلب على الورش المتخصصة في الفئة المطلوبة بدمياط.
- مقارنة عروض الأسعار المقدمة من أكثر من صانع واختيار الأنسب.

### 3. 🏪 لوحة تحكم المعرض وبروفايل الورشة (Vendor Center)
- تسجيل المعارض بالرقم القومي أو السجل التجاري والبطاقة الضريبية.
- إدارة المعروضات بين (قطع جاهزة للبيع الفوري) و(معرض أعمال سابق Portfolio).
- شارات توثيق للمعارض الموثوقة (`Verified` / `Premium`) لزيادة أولوية الظهور.

### 4. 💳 إتمام الطلبات والدفع الآمن (Escrow & Checkout)
- دعم الدفع الإلكتروني عبر بوابة الدفع (بطاقات بنكية، فودافون كاش، إنستاباي).
- دعم الدفع عند الاستلام والمعاينة (COD).
- حفظ أموال المشتري في حساب ضمان وسيط حتى تأكيد الاستلام ومطابقة خشب الزان.

### 5. 🛡️ توثيق الاستلام وفض النزاعات (Delivery & Dispute Resolution)
- **مهلة معاينة 72 ساعة** بعد تسليم الأثاث للتأكد من سلامة الخشب والدهانات.
- إمكانية توثيق الاستلام ورفع صور الغرفة بعد التركيب.
- مركز فض النزاعات لفتح شكاوى الجودة وتجميد المستحقات فوراً للتدخل الإداري.

---

## 🛠️ البنية التقنية (Tech Stack)

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/) + [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + RTL First-Class Support
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Row-Level Security)
- **State Management**: Reactive Local Storage & Global Event Store
- **Automated Testing**: [TestSprite CLI](https://testsprite.com/) E2E AI Testing

---

## 📂 هيكلية المجلدات (Project Structure)

```bash
damietta-furniture-marketplace/
├── app/
│   ├── admin/                # لوحة الإدارة ومراقبة النزاعات والمعارض
│   ├── login/                # تسجيل الدخول الموحد (مع تجربة سريعة للأدوار)
│   ├── signup/               # تسجيل حساب عميل جديد
│   ├── orders/               # متابعة الطلبات، صفحة الدفع، وتأكيد الاستلام والنزاعات
│   │   └── [id]/
│   │       ├── checkout/     # صفحة الدفع (Paymob / COD)
│   │       ├── confirm-delivery/ # توثيق الاستلام بالصور
│   │       └── dispute/      # مركز فتح شكاوى الجودة
│   ├── products/[id]/        # تفاصيل القطعة وتخصيص الخشب والأبعاد
│   ├── rfq/                  # نظام المناقصات وطلبات التفصيل المخصص
│   │   ├── new/              # نشر طلب تفصيل جديد
│   │   └── [id]/             # مقارنة عروض الأسعار المقدمة
│   ├── vendor/               # لوحة تحكم المعرض ورفع قطع جديدة
│   │   ├── dashboard/
│   │   └── signup/           # تسجيل ورشة أو معرض جديد بدمياط
│   ├── vendors/[id]/         # بروفايل المعرض العام للزوار
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # الصفحة الرئيسية وفيد المعروضات
├── components/               # المكونات القابلة لإعادة الاستخدام (Navbar, Cards, Tabs, Badges)
├── lib/                      # دوال Supabase والمخزن العام والبيانات الافتراضية
├── supabase/
│   └── migrations/           # مخططات الـ SQL و RLS Policies لـ PostgreSQL
├── testsprite-plans/         # سيناريوهات وخطط الفحص التلقائي E2E
├── types/                    # تعريفات TypeScript لكافة كيانات النظام
└── package.json
```

---

## 🚀 التشغيل المحلي (Getting Started)

### المتطلبات المسبقة:
- Node.js 18+ مثبت على جهازك
- npm أو yarn

### خطوات التثبيت والتشغيل:

1. **استنساخ المستودع (Clone):**
   ```bash
   git clone https://github.com/yossefelnaggar132-code/marketcload.git
   cd marketcload
   ```

2. **تثبيت الحزم (Install Dependencies):**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة:**
   انسخ ملف `.env.local.example` إلى `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

4. **تشغيل خادم التطوير:**
   ```bash
   npm run dev
   ```
   افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

---

## 🧪 فحص واختبار المشروع عبر TestSprite

المشروع متوافق ومفحوص بالكامل عبر **TestSprite CLI**:

```bash
# تشغيل فحص الفيد والبحث
testsprite test run f4729a7c-f078-4ba1-a030-8d75bbaf9948 --local 3000 --local-host localhost

# تشغيل فحص طلبات التفصيل RFQ
testsprite test run 416b4c41-5308-4eec-be9f-b7204696cf84 --local 3000 --local-host localhost

# تشغيل فحص لوحة المعرض
testsprite test run 42ba1540-f8d5-410b-9d76-a4d5568f490f --local 3000 --local-host localhost

# تشغيل فحص لوحة الإدارة والنزاعات
testsprite test run 9e61d329-0b0a-4f5d-b3a5-6818bd010360 --local 3000 --local-host localhost
```

---

## 📚 التوثيق ودليل التطوير (Documentation)

للمطورين والمهندسين الراغبين في المساهمة أو متابعة التطوير:
- 🏛️ **[دليل البنية المعمارية وهندسة النظام (Architecture Guide)](docs/ARCHITECTURE.md)**
- 📋 **[وثيقة متطلبات المنتج الرسمية (PRD)](docs/PRD_ماركت_بليس_أثاث_دمياط.md)**
- 🗺️ **[خطة التنفيذ ومراحل العمل التفصيلية (24-Week Roadmap)](docs/خطة_التنفيذ_التفصيلية_Antigravity.md)**
- 🤝 **[دليل وقواعد المساهمة في المشروع (Contributing Guidelines)](CONTRIBUTING.md)**

---

## 📄 الترخيص (License)

هذا المشروع مرخص تحت رخصة **[MIT License](LICENSE)** — متاح للتطوير والإنتاج التجاري. جميع الحقوق محفوظة © 2026.

