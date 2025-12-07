# Ayat Embed | مضمّن الآيات

> **A beautiful, open-source tool for generating embeddable Quranic verses for websites.**

> **أداة مفتوحة المصدر لإنشاء آيات قرآنية قابلة للتضمين في المواقع الإلكترونية.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

**Live Demo:** [https://ayatembed.adelenazi.cloud](https://ayatembed.adelenazi.cloud)

**جربها هنا:** [https://ayatembed.adelenazi.cloud](https://ayatembed.adelenazi.cloud)

---

## Video Introduction | شرح للأداة

<!-- Replace VIDEO_ID_HERE with your YouTube video ID -->
<!-- [![Watch the video](https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg)](https://youtu.be/VIDEO_ID_HERE) -->

_[YouTube Video: not nooooow]_

---

## About | نبذة

**Ayat Embed** is a Micro-SaaS tool designed to help developers and content creators easily embed Quranic verses into their websites. It provides a highly customizable interface to select verses, adjust styles, and generate embed codes (iFrame or HTML) that look great on any device.

**مضمّن الآيات** هو أداة مصغرة (Micro-SaaS) صممت لمساعدة المطورين وصناع المحتوى على تضمين الآيات القرآنية في مواقعهم بسهولة. توفر الأداة واجهة قابلة للتخصيص بالكامل لاختيار الآيات، وتعديل الأنماط، وتوليد أكواد التضمين (iFrame أو HTML) التي تظهر بشكل رائع على جميع الأجهزة.

Built with **Next.js**, **Tailwind CSS**, and **TypeScript**, it priorities performance, accessibility, and aesthetics.

تم بناؤه باستخدام **Next.js**، **Tailwind CSS**، و **TypeScript**، مع التركيز على الأداء، وإمكانية الوصول، والجماليات.

---

## Features | المميزات

- **Complete Quran Access | الوصول الكامل للقرآن**
  Access all 114 Surahs with authentic Uthmanic script.

  الوصول إلى جميع السور الـ 114 بالرسم العثماني.

- **Verse Ranges | نطاق الآيات**
  Select single verses or a range of verses (e.g., Al-Fatiha 1-7).

  اختيار آية واحدة أو مجموعة من الآيات (مثل: الفاتحة 1-7).

- **Bilingual Interface | واجهة ثنائية اللغة**
  Full support for both English (LTR) and Arabic (RTL) interfaces.

  دعم كامل للواجهتين الإنجليزية (LTR) والعربية (RTL).

- **Live Preview | معاينة مباشرة**
  See your changes in real-time as you customize.

  شاهد تغييراتك في الوقت الفعلي أثناء التخصيص.

- **Advanced Customization | تخصيص أكثر**

  - **Colors | الألوان**: Custom presets and pickers for Accent, Background, and Text colors.

  (إعدادات مسبقة ومنتقي ألوان).

  - **Visibility Toggles | خيارات الإظهار**: Show/Hide translations, verse numbers, references, and decorative lines.

  (إظهار/إخفاء الترجمة، أرقام الآيات، المراجع).

  - **Transparent Mode | الوضع الشفاف**: Seamless integration with your website's background.

  (دمج سلس مع خلفية موقعك).

- **Smart Export | تصدير ذكي**
  - **iFrame**: specific auto-resizing script to prevent scrollbars. (سكربت تغيير حجم تلقائي لمنع ظهور أشرطة التمرير).
  - **Pure HTML**: Static HTML for full control. (كود HTML ثابت للتحكم الكامل).

---

## Tech Stack | التقنيات المستخدمة

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [FontAwesome](https://fontawesome.com/) & [Lucide React](https://lucide.dev/)
- **Fonts**:
  - _Kitab_ (Quranic Text | الخط القرآني)
  - _IBM Plex Sans Arabic_ (Arabic UI | واجهة عربية)
  - _Inter_ (English UI | واجهة إنجليزية)
- **API**: [AlQuran Cloud](https://alquran.cloud/api)

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AdelEnazi1117/ayat-embed.git
    cd ayat-embed
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open locally:**
    Visit `http://localhost:3000` in your browser.

---

## Docker Deployment

The project includes a `Dockerfile` for easy containerization.

1.  **Build the image:**

    ```bash
    docker build -t ayat-embed .
    ```

2.  **Run the container:**
    ```bash
    docker run -p 3000:3000 ayat-embed
    ```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Main Builder Dashboard
│   ├── layout.tsx          # Root Layout (Fonts, Metadata)
│   ├── globals.css         # Global Styles & Tailwind
│   ├── how-to-use/         # "How to Use" Page
│   ├── docs/               # Documentation Page
│   └── embed/
│       └── [surah]/        # Dynamic Embed Routes
│           └── [ayah]/     # Handles single or range verses
├── components/
│   ├── QuranCard.tsx       # Core component that displays the verse
│   ├── Footer.tsx          # Application footer
│   └── LanguageToggle.tsx  # Locale switcher
├── lib/
│   ├── api.ts              # API utilities
│   ├── constants.ts        # Configuration & Helpers
│   └── translations.ts     # UI Translation strings
└── types/
    └── index.ts            # TypeScript definitions
```

---

## Usage | طريقة الاستخدام

1.  **Search & Select | بحث واختيار**: Use the dropdown to find a Surah by name or number.

(استخدم القائمة للبحث عن السورة بالاسم أو الرقم). 2. **Set Range | تحديد النطاق**: Choose the starting and ending Ayah.

(اختر آية البداية والنهاية). 3. **Style | التنسيق**: - Toggle _Translation_ for English meaning.

    (تبديل ظهور الترجمة).
    - Toggle _Verse Numbers_ or _Reference_.

    (تبديل ظهور أرقام الآيات والسورة).
    - Adjust _Accent Color_ to match your brand.

    (تعديل لون التمييز ليناسبك).

4.  **Export | تصدير**:

    - Click **Export Code** to copy the snippet.

    (اضغط على "نسخ الكود").

    - Paste it into your HTML or CMS.

    (لصقه في كود HTML أو نظام إدارة المحتوى).

---

## Contributing | المساهمة

Contributions are welcome! Please feel free to submit a Pull Request.
المساهمات مرحب بها! لا تتردد في إرسال طلب سحب (Pull Request).

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## License | التراخيص

Distributed under the MIT License. See `LICENSE` for more information.
موزع تحت رخصة MIT. انظر ملف `LICENSE` للمزيد من المعلومات.

---

## Author | المؤلف

**Adel Enazi** (عادل العنزي)

- Website: [adelenazi.dev](https://adelenazi.dev)
- Twitter: [@AdelEnizy](https://x.com/AdelEnizy)
- GitHub: [@AdelEnazi1117](https://github.com/AdelEnazi1117)
- LinkedIn: [Adel Enazi](https://www.linkedin.com/in/adelenazi/)

---

## Acknowledgments | شكر وتقدير

- [AlQuran Cloud](https://alquran.cloud/) for the amazing API. (للواجهة البرمجية الرائعة).
- [Kitab Font](https://github.com/nuqayah/kitab-font) for the beautiful Quranic typography. (للخط القرآني الجميل).
