export type Language = "ar" | "en";

export const translations = {
  ar: {
    appTitle: "مضمّن الآيات",
    appSubtitle: "أنشئ آيات قرآنية قابلة للتضمين في موقعك ومدونتك",
    howToUse: "كيفية الاستخدام",

    selectVerse: "اختر الآيات",
    surah: "السورة",
    ayah: "الآية",
    fromAyah: "من الآية",
    toAyah: "إلى الآية",
    verse: "آية",
    loading: "جاري التحميل...",
    selectSurah: "اختر السورة",
    searchSurah: "ابحث عن سورة...",
    noResultsFound: "لا توجد نتائج",
    verses: "آيات",
    versesSelected: "آيات محددة",
    maxVersesNote: "الحد الأقصى 30 آية",

    customizeStyle: "تخصيص المظهر",
    theme: "السمة",
    accentColor: "اللون المميز",
    backgroundColor: "لون الخلفية",
    textColor: "لون النص",
    infoTextColor: "اختر لون النص للآية والترجمة",
    showTranslation: "إظهار الترجمة",
    showReference: "إظهار المرجع",
    showVerseNumbers: "إظهار أرقام الآيات",
    showAccentLine: "إظهار الخط الجانبي",
    transparentBackground: "خلفية شفافة",
    showBrackets: "إظهار الأقواس",
    resetStyles: "إعادة تعيين",
    randomStyle: "نمط عشوائي",

    customColor: "لون مخصص",
    styles: "الأنماط",
    showBackground: "إظهار الخلفية",

    infoShowTranslation: "عرض الترجمة الإنجليزية للآية أسفل النص العربي",
    infoShowReference: "عرض اسم السورة ورقم الآية في أسفل البطاقة",
    infoShowVerseNumbers: "عرض رقم الآية بالأرقام العربية داخل الأقواس",
    infoShowAccentLine: "عرض الخط الملون على الجانب الأيمن من البطاقة",
    infoTransparentBg: "جعل خلفية البطاقة شفافة لتتناسب مع خلفية موقعك",
    infoAccentColor: "اختر اللون المميز للأقواس والخط الجانبي والمرجع",
    infoBackgroundColor: "اختر لون خلفية البطاقة",
    infoExportCode: "انسخ الكود لتضمينه في موقعك",
    infoShowBrackets: "عرض الأقواس حول أرقام الآيات في النص العربي",

    exportCode: "تصدير الكود",
    iframe: "إطار مضمن",
    pureHtml: "HTML خام",
    copyToClipboard: "نسخ إلى الحافظة",
    copied: "تم النسخ!",

    livePreview: "معاينة مباشرة",
    previewNote: "هذه المعاينة توضح كيف ستظهر الآيات في موقعك",

    developedBy: "تطوير",
    developerName: "عادل العنزي",
    documentation: "التوثيق",
    sourceCode: "الكود المصدري",
    openSourceProject: "مشروع مفتوح المصدر",
    allRightsReserved: "جميع الحقوق محفوظة",

    errorLoading: "خطأ في تحميل الآية",
    invalidVerse: "آية غير صالحة",
    checkNumbers: "يرجى التحقق من أرقام السورة والآية",

    howToUseTitle: "كيفية استخدام مضمّن الآيات",
    howToUseIntro: "دليل شامل لإنشاء وتضمين آيات قرآنية جميلة في موقعك",
    step1Title: "اختر الآيات",
    step1Desc:
      "حدد السورة والآيات التي تريد تضمينها. يمكنك اختيار آية واحدة أو نطاق من الآيات.",
    step2Title: "خصص المظهر",
    step2Desc:
      "اختر الألوان والخيارات التي تناسب تصميم موقعك. يمكنك إظهار أو إخفاء الترجمة والمرجع وأرقام الآيات.",
    step3Title: "انسخ الكود",
    step3Desc: "اختر نوع الكود (iFrame أو HTML خام) وانسخه إلى موقعك.",
    iframeVsHtml: "iFrame مقابل HTML خام",
    iframeDesc:
      "استخدم iFrame للحصول على تحديثات تلقائية وسهولة التضمين. الكود أقصر ويتم تحميل الآية من خادمنا.",
    htmlDesc:
      "استخدم HTML الخام للتحكم الكامل والعمل بدون اتصال بالإنترنت. الكود مستقل تماماً.",
    backToHome: "العودة للرئيسية",

    docTitle: "التوثيق",
    docIntro: "ميزات وخصائص مضمّن الآيات",
    docApiSection: "واجهة برمجة التطبيقات",
    docApiDesc:
      "يستخدم هذا المشروع api.alquran.cloud للحصول على النص القرآني والترجمات.",
    docApiProxyDesc:
      "يستخدم هذا التطبيق وكيل API داخلي للوصول بشكل آمن إلى واجهة برمجة تطبيقات Quran Foundation. يتعامل الوكيل مع المصادقة والتخزين المؤقت تلقائياً.",
    docAvailableEndpoints: "النقاط المتاحة",
    docFetchesSurahs: "جلب قائمة جميع السور",
    docFetchesVerse: "جلب آية محددة (مثال: 1:1)",
    docFetchesChapter: "جلب جميع الآيات لسورة",
    docFeatures: "الميزات",
    docOAuth2Auth: "المصادقة OAuth2 تتم على جانب الخادم",
    docCacheInfo: "تخزين مؤقت لمدة ساعة مع إعادة التحقق من الصلاحية",
    docBasmalaStripping: "إزالة البسملة تلقائياً للسور 2-114",
    docMaxVerses: "حد أقصى 30 آية لكل طلب",
    docEmbedParams: "معاملات رابط التضمين",
    docEmbedParamsDesc:
      "يتم تمرير جميع خيارات تخصيص التضمين كمعاملات استعلام URL. يجب توفير الألوان كقيم hex بدون بادئة #.",
    docBaseUrlFormat: "تنسيق رابط الأساس",
    docForVerseRanges: "للنطاقات:",
    docAvailableParams: "المعاملات المتاحة",
    docAccentColorDesc: "لون المميز (hex بدون #، مثال: f97316)",
    docBgColorDesc: "لون الخلفية (hex بدون #)",
    docTextColorDesc: "لون النص (hex بدون #)",
    docThemeDesc: 'السمة: "dark" أو "light"',
    docTranslationDesc: 'إظهار الترجمة: "true" أو "false"',
    docReferenceDesc: 'إظهار المرجع: "true" أو "false"',
    docVerseNumbersDesc: 'إظهار أرقام الآيات: "true" أو "false"',
    docAccentLineDesc: 'إظهار الخط الجانبي: "true" أو "false"',
    docTransparentBgDesc: 'خلفية شفافة: "true" أو "false"',
    docBracketsDesc: 'إظهار الأقواس حول أرقام الآيات: "true" أو "false"',
    docLangDesc: 'لغة الواجهة: "ar" أو "en"',
    docEmbedIdDesc: "معرف فريد للتضمين للتواصل عبر postMessage (يتم إنشاؤه تلقائياً)",
    docExample: "مثال",
    docEmbedProtocol: "بروتوكول تواصل التضمين",
    docEmbedProtocolDesc:
      "تتواصل التضمينات مع النافذة الأصلية عبر postMessage لضبط الارتفاع ديناميكياً.",
    docHeightUpdate: "رسالة تحديث الارتفاع",
    docHeightUpdateDesc:
      "يرسل التضمين هذه الرسالة تلقائياً عند تغيير ارتفاع المحتوى. يستمع سكريبت النافذة الأصلية لهذه الرسالة لضبط ارتفاع iframe ديناميكياً.",
    docParentListener: "مستمع النافذة الأصلية",
    docCustomization: "خيارات التخصيص",
    docEmbedding: "طرق التضمين",
    docSupport: "الدعم والمساعدة",
    docSupportDesc:
      "إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى فتح issue في مستودع GitHub.",

    colors: {
      Orange: "برتقالي",
      Gold: "ذهبي",
      Emerald: "زمردي",
      Blue: "أزرق",
      Purple: "بنفسجي",
      Rose: "وردي",
      Teal: "أخضر مزرق",
      Indigo: "نيلي",
      Navy: "كحلي",
      Black: "أسود",
      "Dark Gray": "رمادي داكن",
      "Dark Blue": "أزرق داكن",
      "Dark Green": "أخضر داكن",
      White: "أبيض",
      "Light Gray": "رمادي فاتح",
      Cream: "كريمي",
    },
    ready: "جاهز",
    version: "نسخة",
    developer: "المطور",
  },
  en: {
    appTitle: "Ayat Embed",
    appSubtitle: "Generate beautiful embeddable verses",
    howToUse: "How to Use",

    selectVerse: "Select Verses",
    surah: "Surah",
    ayah: "Ayah",
    fromAyah: "From Ayah",
    toAyah: "To Ayah",
    verse: "Verse",
    loading: "Loading...",
    selectSurah: "Select Surah",
    searchSurah: "Search surah...",
    noResultsFound: "No results found",
    verses: "verses",
    versesSelected: "verses selected",
    maxVersesNote: "Maximum 30 verses",

    customizeStyle: "Customize Style",
    theme: "Theme",
    accentColor: "Accent Color",
    backgroundColor: "Background Color",
    textColor: "Text Color",
    infoTextColor: "Choose the text color for the verse and translation",
    showTranslation: "Show Translation",
    showReference: "Show Reference",
    showVerseNumbers: "Show Verse Numbers",
    showAccentLine: "Show Accent Line",
    transparentBackground: "Transparent Background",
    showBrackets: "Show Brackets",
    resetStyles: "Reset",
    randomStyle: "Random Style",

    customColor: "Custom Color",
    styles: "Styles",
    showBackground: "Show Background",

    infoShowTranslation:
      "Display the English translation below the Arabic text",
    infoShowReference:
      "Show the Surah name and Ayah number at the bottom of the card",
    infoShowVerseNumbers:
      "Display verse numbers in Arabic numerals within the brackets",
    infoShowAccentLine:
      "Show the colored accent line on the right side of the card",
    infoTransparentBg:
      "Make the card background transparent to match your website",
    infoAccentColor:
      "Choose the accent color for brackets, side line, and reference",
    infoBackgroundColor: "Choose the background color for the card",
    infoExportCode: "Copy the code to embed on your website",
    infoShowBrackets:
      "Display brackets around verse numbers in the Arabic text",

    exportCode: "Export Code",
    iframe: "iFrame",
    pureHtml: "Pure HTML",
    copyToClipboard: "Copy to Clipboard",
    copied: "Copied!",

    livePreview: "Live Preview",
    previewNote:
      "This preview shows exactly how the verses will appear on your website",

    developedBy: "Developed by",
    developerName: "Adel Enazi",
    documentation: "Documentation",
    sourceCode: "Source Code",
    openSourceProject: "Open Source Project",
    allRightsReserved: "All Rights Reserved",

    errorLoading: "Error loading verse",
    invalidVerse: "Invalid Verse",
    checkNumbers: "Please check the Surah and Ayah numbers",

    howToUseTitle: "How to Use Ayat Embed",
    howToUseIntro:
      "A comprehensive guide to creating and embedding beautiful Quranic verses on your website with Ayat Embed",
    step1Title: "Select Verses",
    step1Desc:
      "Choose the Surah and verses you want to embed. You can select a single verse or a range of verses (up to 30).",
    step2Title: "Customize Style",
    step2Desc:
      "Pick colors and options that match your website design. You can show or hide translation, reference, and verse numbers.",
    step3Title: "Copy the Code",
    step3Desc:
      "Choose the code type (iFrame or Pure HTML) and paste it into your website.",
    iframeVsHtml: "iFrame vs Pure HTML",
    iframeDesc:
      "Use iFrame for automatic updates and easy embedding. The code is shorter and the verse loads from our server.",
    htmlDesc:
      "Use Pure HTML for full control and offline functionality. The code is completely standalone.",
    backToHome: "Back to Home",

    docTitle: "Documentation",
    docIntro: "Ayat Embed documentation",
    docApiSection: "API Reference",
    docApiDesc:
      "This project uses api.alquran.cloud to fetch Quranic text and translations.",
    docApiProxyDesc:
      "This application uses an internal API proxy to securely access the Quran Foundation API. The proxy handles authentication and caching automatically.",
    docAvailableEndpoints: "Available Endpoints",
    docFetchesSurahs: "Fetches the list of all Surahs",
    docFetchesVerse: "Fetches a specific verse (e.g., 1:1)",
    docFetchesChapter: "Fetches all verses for a chapter",
    docFeatures: "Features",
    docOAuth2Auth: "OAuth2 authentication handled server-side",
    docCacheInfo: "1-hour cache with stale-while-revalidate",
    docBasmalaStripping: "Automatic Basmala stripping for Surahs 2-114",
    docMaxVerses: "Maximum 30 verses per request limit",
    docEmbedParams: "Embed URL Parameters",
    docEmbedParamsDesc:
      "All embed customization options are passed as URL query parameters. Colors should be provided as hex values without the # prefix.",
    docBaseUrlFormat: "Base URL Format",
    docForVerseRanges: "For verse ranges:",
    docAvailableParams: "Available Parameters",
    docAccentColorDesc: "Accent color (hex without #, e.g., f97316)",
    docBgColorDesc: "Background color (hex without #)",
    docTextColorDesc: "Text color (hex without #)",
    docThemeDesc: 'Theme: "dark" or "light"',
    docTranslationDesc: 'Show translation: "true" or "false"',
    docReferenceDesc: 'Show reference: "true" or "false"',
    docVerseNumbersDesc: 'Show verse numbers: "true" or "false"',
    docAccentLineDesc: 'Show accent line: "true" or "false"',
    docTransparentBgDesc: 'Transparent background: "true" or "false"',
    docBracketsDesc: 'Show brackets around verse numbers: "true" or "false"',
    docLangDesc: 'UI language: "ar" or "en"',
    docEmbedIdDesc: "Unique embed ID for postMessage communication (auto-generated)",
    docExample: "Example",
    docEmbedProtocol: "Embed Communication Protocol",
    docEmbedProtocolDesc:
      "Embeds communicate with their parent window via postMessage for dynamic height adjustment.",
    docHeightUpdate: "Height Update Message",
    docHeightUpdateDesc:
      "The embed automatically sends this message when its content height changes. The parent window script listens for this message to adjust the iframe height dynamically.",
    docParentListener: "Parent Window Listener",
    docCustomization: "Customization Options",
    docEmbedding: "Embedding Methods",
    docSupport: "Support & Help",
    docSupportDesc:
      "If you encounter any issues or have suggestions, please open an issue on the GitHub repository.",

    colors: {
      Orange: "Orange",
      Gold: "Gold",
      Emerald: "Emerald",
      Blue: "Blue",
      Purple: "Purple",
      Rose: "Rose",
      Teal: "Teal",
      Indigo: "Indigo",
      Navy: "Navy",
      Black: "Black",
      "Dark Gray": "Dark Gray",
      "Dark Blue": "Dark Blue",
      "Dark Green": "Dark Green",
      White: "White",
      "Light Gray": "Light Gray",
      Cream: "Cream",
    },
    ready: "Ready",
    version: "Version",
    developer: "Developer",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function getTranslation(lang: Language) {
  return translations[lang];
}
