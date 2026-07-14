// Shalaby OMS - Configuration

const CONFIG = {
    SHEET_ID: '1a9Ix_FL1aB3G-OBzCE24hSkPrFaXk5QT5vVqFq3_B6A',
    API_URL: 'https://script.google.com/macros/s/AKfycbwZZ6FFZrTkX9jlc87UcftWefbCefBB-4SGRN2j9LKydwq6kvfFnWYifB0SD6BMjEuO1A/exec',
    TOKEN: '',
    
    APP_NAME: 'Shalaby OMS',
    APP_VERSION: '1.0',
    
    API_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    
    SHEETS: {
        ORDERS: 'Orders',
        CUSTOMERS: 'Customers',
        PRODUCTS: 'Products',
        SETTINGS: 'Settings'
    },
    
    ORDER_STATUS: [
        'جديد',
        'جارى المراجعة',
        'جارى التجهيز',
        'تم الشحن',
        'تم التسليم',
        'ملغى',
        'مرتجع'
    ],
    
    GOVERNORATES: [
        'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
        'القليوبية', 'البحيرة', 'الغربية', 'المنوفية', 'كفر الشيخ',
        'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'المنيا',
        'بني سويف', 'الفيوم', 'أسيوط', 'سوهاج', 'قنا',
        'أسوان', 'الأقصر', 'البحر الأحمر', 'الوادي الجديد', 'مطروح',
        'شمال سيناء', 'جنوب سيناء'
    ],
    
    SHIPPING_COMPANIES: [
        'البريد المصري', 'أرامكس', 'فيدكس', 'سمسا', 'DHL',
        'بوستا', 'ماي واي', 'فاست كارجو', 'أخرى'
    ],
    
    PAYMENT_METHODS: [
        'كاش عند الاستلام', 'تحويل بنكي', 'فودافون كاش',
        'فيزا', 'إنستا باي', 'محفظة إلكترونية'
    ],
    
    ORDER_SOURCES: [
        'فيسبوك', 'إنستجرام', 'تيك توك', 'واتساب',
        'الموقع الإلكتروني', 'مكالمة هاتفية', 'عميل سابق', 'أخرى'
    ],
    
    FEATURES: {
        ENABLE_NOTIFICATIONS: true,
        ENABLE_ANALYTICS: true,
        ENABLE_AUTO_SAVE: true,
        ENABLE_OFFLINE_MODE: false
    },
    
    VALIDATION: {
        PHONE_MIN_LENGTH: 11,
        PHONE_MAX_LENGTH: 11,
        NAME_MIN_LENGTH: 3,
        NAME_MAX_LENGTH: 100,
        ADDRESS_MIN_LENGTH: 10,
        ADDRESS_MAX_LENGTH: 500
    }
};

Object.freeze(CONFIG);

if (!CONFIG.SHEET_ID || !CONFIG.API_URL) {
    console.warn('%c⚠️ Configuration Warning', 'background: #FFC107; color: #000; font-size: 14px; font-weight: bold; padding: 5px 10px;');
    console.warn('Google Sheets credentials are not configured.');
}
