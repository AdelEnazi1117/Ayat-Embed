# Ayat Embed | مضمّن الآيات

> **A beautiful, open-source tool for generating embeddable Quranic verses for websites.**

> **أداة مفتوحة المصدر لإنشاء آيات قرآنية قابلة للتضمين في المواقع الإلكترونية.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

**Live Demo:** [https://ayatembed.adelenazi.cloud](https://ayatembed.adelenazi.cloud)

**جربها هنا:** [https://ayatembed.adelenazi.cloud](https://ayatembed.adelenazi.cloud)

---

## Video Introduction | شرح للأداة

[![Watch the video](https://img.youtube.com/vi/P64S5pfiCeE/maxresdefault.jpg)](https://youtu.be/P64S5pfiCeE)

---

## About | نبذة

**Ayat Embed** is a Micro-SaaS tool designed to help developers and content creators easily embed Quranic verses into their websites. It provides a highly customizable interface to select verses, adjust styles, and generate embed codes (iFrame or HTML) that look great on any device.

**مضمّن الآيات** هو أداة مصغرة (Micro-SaaS) صممت لمساعدة المطورين وصناع المحتوى على تضمين الآيات القرآنية في مواقعهم بسهولة. توفر الأداة واجهة قابلة للتخصيص بالكامل لاختيار الآيات، وتعديل الأنماط، وتوليد أكواد التضمين (iFrame أو HTML) التي تظهر بشكل رائع على جميع الأجهزة.

Built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**, it prioritizes performance, accessibility, and aesthetics.

تم بناؤه باستخدام **Next.js 16**، **Tailwind CSS v4**، و **TypeScript**، مع التركيز على الأداء، وإمكانية الوصول، والجماليات.

---

## Features | المميزات

- **High-Quality QPC V2 Script | الرسم العثماني (QPC V2)**
  Uses the industry-standard QPC V2 (King Fahd Complex) fonts with dynamic loading for pixel-perfect Quranic script.

  استخدام خطوط مجمع الملك فهد (QPC V2) مع تحميل ديناميكي لضمان دقة الرسم العثماني.

- **Complete Quran Access | الوصول الكامل للقرآن**
  Access all 114 Surahs with authentic script.

  الوصول إلى جميع السور الـ 114 بالرسم العثماني الأصيل.

- **Verse Ranges | نطاق الآيات**
  Select single verses or a range of verses (e.g., Al-Fatiha 1-7).

  اختيار آية واحدة أو مجموعة من الآيات (مثل: الفاتحة 1-7).

- **Bilingual Interface | واجهة ثنائية اللغة**
  Full support for both English (LTR) and Arabic (RTL) interfaces.

  دعم كامل للواجهتين الإنجليزية (LTR) والعربية (RTL).

- **Live Preview | معاينة مباشرة**
  See your changes in real-time as you customize.

  شاهد تغييراتك في الوقت الفعلي أثناء التخصيص.

- **Advanced Customization | تخصيص متطور**

  - **Colors | الألوان**: Custom presets and pickers for Accent, Background, and Text colors.
  - **Display Options | خيارات العرض**: Show/Hide translations, verse numbers, and references.
  - **Dynamic Layout | تخطيط ديناميكي**: Support for continuous verse display or one verse per line.

- **Smart Export | تصدير ذكي**
  - **iFrame**: Specific auto-resizing script to prevent scrollbars.
  - **Pure HTML**: Static HTML for full control and offline usage.

---

## Tech Stack | التقنيات المستخدمة

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [FontAwesome](https://fontawesome.com/)
- **Fonts**:
  - _QPC V2_ (Quranic Text | الخط القرآني من مجمع الملك فهد)
  - _Amiri Quran_ (Quranic fallback | خط أميري للقرآن)
  - _IBM Plex Sans Arabic_ (Arabic UI | واجهة عربية)
  - _Inter_ (English UI | واجهة إنجليزية)
- **API**: Quran.Foundation Content API (v4)
- **Performance**: Secure server-side proxy with **Response Caching** (1-hour TTL) to minimize latency and upstream calls.

---

## Quick Start | البدء السريع

### Prerequisites | المتطلبات الأساسية

- Node.js 20+
- npm 9+

### Installation | التثبيت

1.  **Clone the repository | استنساخ المستودع:**

    ```bash
    git clone https://github.com/AdelEnazi1117/ayat-embed.git
    cd ayat-embed
    ```

2.  **Install dependencies | تثبيت الاعتمادات:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables | تهيئة متغيرات البيئة:**

    Copy `env.example` → `.env.local` and set your credentials:
    قم بنسخ `env.example` إلى `.env.local` وقم بتعيين بيانات الاعتماد الخاصة بك:

    - `QF_CLIENT_ID`: Your Quran.Foundation Client ID.
    - `QF_CLIENT_SECRET`: Your Quran.Foundation Client Secret.
    - `QF_ENV`: `prelive` or `production`.

4.  **Run the development server | تشغيل خادم التطوير:**

    ```bash
    npm run dev
    ```

5.  **Open locally | الفتح محلياً:**
    Visit `http://localhost:3000` in your browser.
    قم بزيارة `http://localhost:3000` في متصفحك.

---

## Docker Deployment | النشر باستخدام دوكر

The project includes a `Dockerfile` for easy containerization.
يتضمن المشروع ملف `Dockerfile` لسهولة الحاويات.

1.  **Build the image | بناء الصورة:**

    ```bash
    docker build -t ayat-embed .
    ```

2.  **Run the container | تشغيل الحاوية:**
    ```bash
    docker run -p 3000:3000 --env-file .env.local ayat-embed
    ```

---

## Project Structure | هيكل المشروع

```
src/
├── app/
│   ├── page.tsx            # Main Builder Dashboard
│   ├── layout.tsx          # Root Layout
│   ├── globals.css         # Tailwind v4 Theme & Base Styles
│   ├── api/quran/          # Security-hardened Proxy with Caching
│   └── embed/              # Dynamic Embed Route System
├── components/
│   ├── QuranCard.tsx       # Core rendering component (Dynamic Fonts)
│   ├── Footer.tsx          # Application footer
│   └── LanguageToggle.tsx  # Locale switcher
├── lib/
│   ├── api.ts              # API utilities & data mapping
│   ├── quranFonts.ts       # Font loading logic for QPC V2
│   └── constants.ts        # Style presets & Defaults
└── types/
    └── index.ts            # TypeScript definitions
```

---

## Usage | طريقة الاستخدام

1.  **Search & Select | بحث واختيار**: Use the dropdown to find a Surah by name or number.

    (استخدم القائمة للبحث عن السورة بالاسم أو الرقم).

2.  **Set Range | تحديد النطاق**: Choose the starting and ending Ayah.

    (اختر آية البداية والنهاية).

3.  **Style | التنسيق**:

    - Toggle _Translation_ for English meaning.
      (تبديل ظهور الترجمة).
    - Toggle _Verse Numbers_ or _Reference_.
      (تبديل ظهور أرقام الآيات والسورة).
    - Adjust _Accent Color_ to match your brand.
      (تعديل لون التمييز ليناسبك).

4.  **Export | تصدير**:
    - Click **Export Code** to copy the snippet.
      (اضغط على "تصدير الكود").
    - Paste it into your HTML or CMS.
      (لصقه في كود HTML أو مدونتك وموقعك).

---

## Contributing | المساهمة

Contributions are welcome! Please feel free to submit a Pull Request.

المساهمات مرحب بها! لا تتردد في إرسال طلب سحب (Pull Request).

1.  Fork the project. (عمل نسخة من المشروع).
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`). (إنشاء فرع للميزة الجديدة).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`). (حفظ التغييرات).
4.  Push to the branch (`git push origin feature/AmazingFeature`). (رفع التغييرات للفرع).
5.  Open a Pull Request. (فتح طلب سحب).

---

## License | التراخيص

Distributed under the MIT License. See `LICENSE` for more information.

موزع تحت رخصة MIT. انظر ملف `LICENSE` للمزيد من المعلومات.

---

## Author | المؤلف

**Adel Enazi** (عادل العنزي)

- Website: [adelenazi.dev](https://adelenazi.dev)
- X (Twitter): [@AdelEnizy](https://x.com/AdelEnizy)
- GitHub: [@AdelEnazi1117](https://github.com/AdelEnazi1117)
- LinkedIn: [Adel Enazi](https://www.linkedin.com/in/adelenazi/)

---

## Acknowledgments | شكر وتقدير

- [Quran.Foundation](https://quran.foundation/) for the comprehensive API and QPC V2 assets.
(شكر لمؤسسة القرآن على الواجهة البرمجية الشاملة).
- [KFQPC](https://qurancomplex.gov.sa/) for the King Fahd Complex Quranic fonts. 
(شكر لمجمع الملك فهد لطباعة المصحف الشريف على الخطوط القرآنية).
