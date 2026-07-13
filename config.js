// ========================================
// Shalaby OMS - Configuration
// Version: 1.0
// ========================================

/**
 * Configuration object for Shalaby OMS
 * 
 * Instructions:
 * 1. Replace SHEET_ID with your Google Sheets ID
 * 2. Set up Google Sheets API and get your API_URL
 * 3. Generate authentication TOKEN
 * 4. Never commit sensitive credentials to public repositories
 */

const CONFIG = {
    // Google Sheets Configuration
    SHEET_ID: '',  // Your Google Sheets ID here
    API_URL: '',   // Your API endpoint URL here
    TOKEN: '',     // Your authentication token here
    
    // Application Settings
    APP_NAME: 'Shalaby OMS',
    APP_VERSION: '1.0',
    
    // API Settings
    API_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    
    // Sheet Names (if using multiple sheets)
    SHEETS: {
        ORDERS: 'Orders',
        CUSTOMERS: 'Customers',
        PRODUCTS: 'Products',
        SETTINGS: 'Settings'
    },
    
    // Order Status Options
    ORDER_STATUS: [
        'جديد',
        'جارى المراجعة',
        'جارى التجهيز',
        'تم الشحن',
        'تم التسليم',
        'ملغى',
        'مرتجع'
    ],
    
    // Governorates List
    GOVERNORATES: [
        'القاهرة',
        'الجيزة',
        'الإسكندرية',
        'الدقهلية',
        'الشرقية',
        'القليوبية',
        'البحيرة',
        'الغربية',
        'المنوفية',
        'كفر الشيخ',
        'دمياط',
        'بورسعيد',
        'الإسماعيلية',
        'السويس',
        'المنيا',
        'بني سويف',
        'الفيوم',
        'أسيوط',
        'سوهاج',
        'قنا',
        'أسوان',
        'الأقصر',
        'البحر الأحمر',
        'الوادي الجديد',
        'مطروح',
        'شمال سيناء',
        'جنوب سيناء'
    ],
    
    // Shipping Companies
    SHIPPING_COMPANIES: [
        'البريد المصري',
        'أرامكس',
        'فيدكس',
        'سمسا',
        'DHL',
        'بوستا',
        'ماي واي',
        'فاست كارجو',
        'أخرى'
    ],
    
    // Payment Methods
    PAYMENT_METHODS: [
        'كاش عند الاستلام',
        'تحويل بنكي',
        'فودافون كاش',
        'فيزا',
        'إنستا باي',
        'محفظة إلكترونية'
    ],
    
    // Order Sources
    ORDER_SOURCES: [
        'فيسبوك',
        'إنستجرام',
        'تيك توك',
        'واتساب',
        'الموقع الإلكتروني',
        'مكالمة هاتفية',
        'عميل سابق',
        'أخرى'
    ],
    
    // Feature Flags
    FEATURES: {
        ENABLE_NOTIFICATIONS: true,
        ENABLE_ANALYTICS: true,
        ENABLE_AUTO_SAVE: true,
        ENABLE_OFFLINE_MODE: false
    },
    
    // Validation Rules
    VALIDATION: {
        PHONE_MIN_LENGTH: 11,
        PHONE_MAX_LENGTH: 11,
        NAME_MIN_LENGTH: 3,
        NAME_MAX_LENGTH: 100,
        ADDRESS_MIN_LENGTH: 10,
        ADDRESS_MAX_LENGTH: 500
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.SHEETS);
Object.freeze(CONFIG.FEATURES);
Object.freeze(CONFIG.VALIDATION);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Console warning if credentials are not set
if (!CONFIG.SHEET_ID || !CONFIG.API_URL || !CONFIG.TOKEN) {
    console.warn(
        '%c⚠️ Configuration Warning',
        'background: #FFC107; color: #000; font-size: 14px; font-weight: bold; padding: 5px 10px;'
    );
    console.warn('Google Sheets credentials are not configured.');
    console.warn('Please update config.js with your credentials.');
    console.warn('See documentation for setup instructions.');
}
