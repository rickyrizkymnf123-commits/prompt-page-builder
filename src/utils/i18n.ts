export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Header & Navigation
    appTitle: 'Landing Page',
    appSubtitle: 'Builder V.12',
    adminBadge: 'Admin',
    switchLang: 'Language / Bahasa',
    generator: 'Generator',
    quickPrompt: 'Prompt Cepat',
    competitorSpy: 'Competitor Spy',
    creativeSync: 'Creative Sync',
    fiveSecond: 'Tes 5 Detik',
    auditLp: 'Audit LP',
    templates: 'Template',
    affiliate: 'Affiliate',
    savedProjects: 'Proyek Tersimpan',
    resetForm: 'Reset Form',
    generateMasterPrompt: 'Generate Master Prompt →',
    generateAgain: 'Generate Ulang ⚡',
    
    // Steps
    step1Title: 'Framework & Tone',
    step2Title: 'Produk, Tujuan & Saluran Traffic',
    step3Title: 'Target Market & Awareness',
    step4Title: 'Detail Produk, Penawaran & Aksi CTA',
    step5Title: 'Visual, Warna Brand & Tipografi 🎨',
    step6Title: 'Struktur Section',
    step7Title: 'Platform & Device Target',
    stepSalesNotifTitle: 'Sales Notification Popup 🔔',
    stepCountdownTitle: 'Urgency: Countdown & Sisa Kuota ⏳',

    // Form Labels
    frameworkLabel: 'Model Framework Copywriting',
    frameworkPlaceholder: 'Pilih model framework (cth: PAS, AIDCA, BAB)...',
    frameworkGuideBtn: 'ℹ️ Panduan Lengkap Framework',
    gayaBahasaLabel: 'Gaya Bahasa (Tone of Voice)',
    gayaBahasaPlaceholder: 'Pilih tone bahasa...',
    
    tipeProdukLabel: 'Tipe Produk / Model Bisnis',
    tipeProdukPlaceholder: 'Pilih tipe produk / isi manual...',
    tujuanUtamaLabel: 'Tujuan Utama Landing Page',
    tujuanUtamaPlaceholder: 'Pilih tujuan konversi (Sales, WA, Lead Gen)...',
    trafficCategoryLabel: 'Target Saluran Iklan / Traffic (Opsional)',
    trafficCategoryPlaceholder: 'Pilih saluran iklan (Meta Ads, TikTok, Google)...',

    awarenessLabel: 'Level Awareness Calon Pembeli',
    awarenessPlaceholder: 'Pilih level awareness...',
    targetAudienceLabel: 'Target Audience Spesifik',
    targetAudiencePlaceholder: 'Pilih target audience atau tulis manual...',

    namaProdukLabel: 'Nama Produk *',
    namaProdukPlaceholder: 'Isi nama produk...',
    pricingStructureTitle: 'Struktur Harga & Penawaran',
    noPriceModeLabel: 'Mode Landing Page Tanpa Harga (Non-Komersial / Lead Gen)',
    noPriceModeDesc: 'Aktifkan jika landing page untuk pendaftaran agen pulsa/PPOB, download aplikasi, webinar gratis, atau profil bisnis.',
    benefitDescLabel: 'Deskripsi, Keunggulan & Benefit Utama',
    benefitDescPlaceholder: 'Deskripsikan fitur, layanan, keunggulan, atau alasan mengapa calon pembeli/mitra harus bergabung sekarang...',
    ctaModeTitle: 'Mode Aksi Tombol & Formulir (Call To Action)',
    ctaTextLabel: 'Teks Tombol CTA',

    colorBrandLabel: 'Pilihan Warna Brand Utama',
    customColorLabel: 'Warna Kustom:',
    themeStyleLabel: 'Tema Nuansa Halaman (Theme Style)',
    archetypeLabel: 'Gaya Desain (Visual Archetype)',

    sectionsTitle: 'Pilih Section yang Ingin Ditampilkan',
    metaCapiTitle: 'Meta Conversions API (CAPI) CTWA',
    nextFeatureBadge: '🚀 Next Feature (Segera Hadir)',

    platformTargetLabel: 'Platform Target',
    deviceTargetLabel: 'Device Target',

    // Buttons
    saveToDb: 'Simpan ke Database',
    openEdit: 'Buka & Edit',
    backToPrompt: '← Kembali ke Prompt',
    saveAsTemplate: '⭐ Simpan Sebagai Template Kustom',
    copyPrompt: 'Salin Prompt',
    copied: 'Tersalin!',
    liveEditor: 'Buka Live Editor →',
  },
  en: {
    // Header & Navigation
    appTitle: 'Landing Page',
    appSubtitle: 'Builder V.12',
    adminBadge: 'Admin',
    switchLang: 'Language / Bahasa',
    generator: 'Generator',
    quickPrompt: 'Quick Prompt',
    competitorSpy: 'Competitor Spy',
    creativeSync: 'Creative Sync',
    fiveSecond: '5-Sec Test',
    auditLp: 'LP Audit',
    templates: 'Templates',
    affiliate: 'Affiliate',
    savedProjects: 'Saved Projects',
    resetForm: 'Reset Form',
    generateMasterPrompt: 'Generate Master Prompt →',
    generateAgain: 'Regenerate ⚡',

    // Steps
    step1Title: 'Framework & Tone',
    step2Title: 'Product, Goal & Traffic Channel',
    step3Title: 'Target Market & Awareness',
    step4Title: 'Product Details, Offer & CTA Actions',
    step5Title: 'Visuals, Brand Color & Typography 🎨',
    step6Title: 'Section Structure',
    step7Title: 'Platform & Target Device',
    stepSalesNotifTitle: 'Sales Notification Popup 🔔',
    stepCountdownTitle: 'Urgency: Countdown & Seat Limit ⏳',

    // Form Labels
    frameworkLabel: 'Copywriting Framework Model',
    frameworkPlaceholder: 'Select framework (e.g. PAS, AIDCA, BAB)...',
    frameworkGuideBtn: 'ℹ️ Complete Framework Guide',
    gayaBahasaLabel: 'Tone of Voice',
    gayaBahasaPlaceholder: 'Select tone of voice...',
    
    tipeProdukLabel: 'Product Type / Business Model',
    tipeProdukPlaceholder: 'Select product type / enter custom...',
    tujuanUtamaLabel: 'Main Landing Page Goal',
    tujuanUtamaPlaceholder: 'Select conversion goal (Sales, WA, Lead Gen)...',
    trafficCategoryLabel: 'Traffic / Ad Channel (Optional)',
    trafficCategoryPlaceholder: 'Select ad channel (Meta Ads, TikTok, Google)...',

    awarenessLabel: 'Buyer Awareness Level',
    awarenessPlaceholder: 'Select awareness level...',
    targetAudienceLabel: 'Specific Target Audience',
    targetAudiencePlaceholder: 'Select target audience or enter custom...',

    namaProdukLabel: 'Product Name *',
    namaProdukPlaceholder: 'Enter product name...',
    pricingStructureTitle: 'Pricing Structure & Offer',
    noPriceModeLabel: 'No-Price / Free Landing Page Mode (Lead Gen)',
    noPriceModeDesc: 'Enable if landing page is for free registration, app download, free webinar, or business profile.',
    benefitDescLabel: 'Main Description, Features & Key Benefits',
    benefitDescPlaceholder: 'Describe features, services, advantages, or reasons why prospects should take action now...',
    ctaModeTitle: 'Button & Form Action Mode (Call To Action)',
    ctaTextLabel: 'CTA Button Text',

    colorBrandLabel: 'Main Brand Color',
    customColorLabel: 'Custom Color:',
    themeStyleLabel: 'Page Theme Style',
    archetypeLabel: 'Design Archetype (Visual Look)',

    sectionsTitle: 'Select Sections to Include',
    metaCapiTitle: 'Meta Conversions API (CAPI) for WhatsApp',
    nextFeatureBadge: '🚀 Next Feature (Coming Soon)',

    platformTargetLabel: 'Target Platform',
    deviceTargetLabel: 'Target Device',

    // Buttons
    saveToDb: 'Save to Database',
    openEdit: 'Open & Edit',
    backToPrompt: '← Back to Prompt',
    saveAsTemplate: '⭐ Save as Custom Template',
    copyPrompt: 'Copy Prompt',
    copied: 'Copied!',
    liveEditor: 'Open Live Editor →',
  },
};
