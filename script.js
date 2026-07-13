// ========================================
// Shalaby OMS - JavaScript
// Version: 1.0
// ========================================

'use strict';

// ========================================
// Global Variables
// ========================================
let currentOrder = null;

// ========================================
// Navigation Functions
// ========================================

/**
 * Navigate to a specific page
 * @param {string} page - The page URL to navigate to
 */
function navigateTo(page) {
    // Add exit animation
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = page;
    }, 200);
}

// ========================================
// Page Load Animations
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    // Fade in page on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize page-specific functionality
    initializePage();
});

// ========================================
// Initialize Page Functions
// ========================================
function initializePage() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'new-order':
            initializeNewOrderPage();
            break;
        case 'update-order':
            initializeUpdateOrderPage();
            break;
    }
}

/**
 * Get current page name
 * @returns {string} Page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

// ========================================
// Home Page Functions
// ========================================
function initializeHomePage() {
    console.log('Home page initialized');
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.action-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// ========================================
// New Order Page Functions
// ========================================
function initializeNewOrderPage() {
    console.log('New Order page initialized');
    
    const form = document.getElementById('newOrderForm');
    
    if (form) {
        form.addEventListener('submit', handleNewOrderSubmit);
        
        // Add input validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('customerPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
        
        // Price formatting
        const priceInput = document.getElementById('price');
        if (priceInput) {
            priceInput.addEventListener('blur', formatPrice);
        }
    }
}

/**
 * Handle new order form submission
 * @param {Event} e - Form submit event
 */
function handleNewOrderSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Get form data
    const formData = getFormData(form);
    
    console.log('New Order Data:', formData);
    
    // TODO: Send data to Google Sheets API
    // saveOrderToSheet(formData);
    
    // Show success modal
    showSuccessModal();
}

/**
 * Get form data as object
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data
 */
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Get all form fields
    data.customerName = document.getElementById('customerName')?.value || '';
    data.customerPhone = document.getElementById('customerPhone')?.value || '';
    data.governorate = document.getElementById('governorate')?.value || '';
    data.address = document.getElementById('address')?.value || '';
    data.product = document.getElementById('product')?.value || '';
    data.quantity = document.getElementById('quantity')?.value || '';
    data.price = document.getElementById('price')?.value || '';
    data.shippingCompany = document.getElementById('shippingCompany')?.value || '';
    data.paymentMethod = document.getElementById('paymentMethod')?.value || '';
    data.orderSource = document.getElementById('orderSource')?.value || '';
    data.notes = document.getElementById('notes')?.value || '';
    data.timestamp = new Date().toISOString();
    data.status = 'جديد';
    
    return data;
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Is form valid
 */
function validateForm(form) {
    let isValid = true;
    
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateInput({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate single input
 * @param {Event} e - Input blur event
 * @returns {boolean} Is input valid
 */
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Check if required
    if (input.hasAttribute('required') && !value) {
        showValidationError(input);
        return false;
    }
    
    // Check phone number
    if (input.id === 'customerPhone' && value) {
        if (!isValidPhone(value)) {
            showValidationError(input, 'رقم التليفون غير صحيح');
            return false;
        }
    }
    
    // Check price
    if (input.id === 'price' && value) {
        if (parseFloat(value) <= 0) {
            showValidationError(input, 'السعر يجب أن يكون أكبر من صفر');
            return false;
        }
    }
    
    // Check quantity
    if (input.id === 'quantity' && value) {
        if (parseInt(value) <= 0) {
            showValidationError(input, 'الكمية يجب أن تكون أكبر من صفر');
            return false;
        }
    }
    
    clearValidationError(e);
    return true;
}

/**
 * Check if phone number is valid
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid
 */
function isValidPhone(phone) {
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Show validation error
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message (optional)
 */
function showValidationError(input, message = null) {
    input.classList.add('is-invalid');
    
    if (message) {
        const feedback = input.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
}

/**
 * Clear validation error
 * @param {Event} e - Input event
 */
function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('is-invalid');
}

/**
 * Format phone number
 * @param {Event} e - Input event
 */
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substr(0, 11);
    }
    
    e.target.value = value;
}

/**
 * Format price
 * @param {Event} e - Input blur event
 */
function formatPrice(e) {
    const value = parseFloat(e.target.value);
    
    if (!isNaN(value)) {
        e.target.value = value.toFixed(2);
    }
}

/**
 * Show success modal
 */
function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

/**
 * Close modal and reset form
 */
function closeModalAndReset() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
    modal.hide();
    
    // Reset form
    const form = document.getElementById('newOrderForm');
    if (form) {
        form.reset();
        
        // Clear validation
        form.querySelectorAll('.is-invalid').forEach(input => {
            input.classList.remove('is-invalid');
        });
    }
}

// ========================================
// Update Order Page Functions
// ========================================
function initializeUpdateOrderPage() {
    console.log('Update Order page initialized');
    
    const searchForm = document.querySelector('.search-card');
    const updateForm = document.getElementById('updateStatusForm');
    
    // Add enter key support for search
    const searchInputs = document.querySelectorAll('#searchOrderId, #searchPhone');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchOrder();
            }
        });
    });
    
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateStatus);
    }
}

/**
 * Search for order
 */
function searchOrder() {
    const orderId = document.getElementById('searchOrderId')?.value.trim();
    const phone = document.getElementById('searchPhone')?.value.trim();
    
    // Validate search input - prioritize order ID
    if (!orderId && !phone) {
        alert('من فضلك أدخل رقم الأوردر أو رقم الموبايل');
        return;
    }
    
    // Show loading
    showLoading();
    
    // TODO: Replace with actual API call
    // Search by order ID first, then by phone if order ID is empty
    if (orderId) {
        console.log('Searching by Order ID:', orderId);
        // searchOrderInSheetById(orderId);
    } else if (phone) {
        console.log('Searching by Phone:', phone);
        // searchOrderInSheetByPhone(phone);
    }
    
    // Simulate API call - will be removed when implementing real API
    setTimeout(() => {
        // TODO: Replace this with actual API response
        // For now, show no results
        showNoResults();
        hideLoading();
    }, 1500);
}

/**
 * Display order details
 * @param {Object} order - Order data
 */
function displayOrderDetails(order) {
    currentOrder = order;
    
    // Hide no results
    document.getElementById('noResults').style.display = 'none';
    
    // Populate order details
    document.getElementById('displayOrderId').textContent = order.orderId || '-';
    document.getElementById('displayOrderDate').textContent = order.orderDate || '-';
    document.getElementById('displayCustomerName').textContent = order.customerName || '-';
    document.getElementById('displayPhone').textContent = order.phone || '-';
    document.getElementById('displayProduct').textContent = order.product || '-';
    document.getElementById('displayPrice').textContent = order.price || '-';
    document.getElementById('displayAddress').textContent = order.address || '-';
    document.getElementById('displayShipping').textContent = order.shippingCompany || '-';
    document.getElementById('displayPayment').textContent = order.paymentMethod || '-';
    
    // Update status badge
    const statusBadge = document.getElementById('currentStatusBadge');
    statusBadge.textContent = order.status || 'جديد';
    statusBadge.className = 'status-badge ' + getStatusClass(order.status || 'جديد');
    
    // Show order details card
    const orderCard = document.getElementById('orderDetailsCard');
    orderCard.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        orderCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Get status CSS class
 * @param {string} status - Status text
 * @returns {string} CSS class
 */
function getStatusClass(status) {
    const statusMap = {
        'جديد': 'status-new',
        'جارى المراجعة': 'status-reviewing',
        'جارى التجهيز': 'status-preparing',
        'تم الشحن': 'status-shipped',
        'تم التسليم': 'status-delivered',
        'ملغى': 'status-cancelled',
        'مرتجع': 'status-returned'
    };
    
    return statusMap[status] || '';
}

/**
 * Handle update status form submission
 * @param {Event} e - Form submit event
 */
function handleUpdateStatus(e) {
    e.preventDefault();
    
    const newStatus = document.getElementById('newStatus')?.value;
    
    if (!newStatus) {
        alert('من فضلك اختر الحالة الجديدة');
        return;
    }
    
    if (!currentOrder) {
        alert('لم يتم اختيار أوردر');
        return;
    }
    
    console.log('Update Status:', {
        orderId: currentOrder.orderId,
        oldStatus: currentOrder.status,
        newStatus: newStatus
    });
    
    // TODO: Update status in Google Sheets
    // updateOrderStatusInSheet(currentOrder.orderId, newStatus);
    
    // Update current order
    currentOrder.status = newStatus;
    
    // Update status badge
    const statusBadge = document.getElementById('currentStatusBadge');
    statusBadge.textContent = newStatus;
    statusBadge.className = 'status-badge ' + getStatusClass(newStatus);
    
    // Show success modal
    showUpdateSuccessModal();
    
    // Reset form
    document.getElementById('updateStatusForm').reset();
}

/**
 * Show update success modal
 */
function showUpdateSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
    modal.show();
}

/**
 * Show loading spinner
 */
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('orderDetailsCard').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

/**
 * Show no results message
 */
function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('orderDetailsCard').style.display = 'none';
}

// ========================================
// Google Sheets API Functions (Placeholder)
// ========================================

/**
 * Save order to Google Sheets
 * @param {Object} orderData - Order data to save
 */
async function saveOrderToSheet(orderData) {
    try {
        // TODO: Implement Google Sheets API integration
        console.log('Saving to Google Sheets:', orderData);
        
        /*
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.TOKEN}`
            },
            body: JSON.stringify({
                sheetId: CONFIG.SHEET_ID,
                data: orderData
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save order');
        }
        
        return await response.json();
        */
        
        return true;
    } catch (error) {
        console.error('Error saving order:', error);
        alert('حدث خطأ أثناء حفظ الأوردر');
        return false;
    }
}

/**
 * Search order in Google Sheets by ID
 * @param {string} orderId - Order ID
 */
async function searchOrderInSheetById(orderId) {
    try {
        // TODO: Implement Google Sheets API integration
        console.log('Searching by Order ID in Google Sheets:', orderId);
        
        /*
        const response = await fetch(
            `${CONFIG.API_URL}?sheetId=${CONFIG.SHEET_ID}&orderId=${orderId}`,
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.TOKEN}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to search order');
        }
        
        const data = await response.json();
        
        if (data && data.order) {
            displayOrderDetails(data.order);
        } else {
            showNoResults();
        }
        */
        
        return null;
    } catch (error) {
        console.error('Error searching order by ID:', error);
        showNoResults();
        return null;
    }
}

/**
 * Search order in Google Sheets by phone
 * @param {string} phone - Phone number
 */
async function searchOrderInSheetByPhone(phone) {
    try {
        // TODO: Implement Google Sheets API integration
        console.log('Searching by Phone in Google Sheets:', phone);
        
        /*
        const response = await fetch(
            `${CONFIG.API_URL}?sheetId=${CONFIG.SHEET_ID}&phone=${phone}`,
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.TOKEN}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to search order');
        }
        
        const data = await response.json();
        
        if (data && data.order) {
            displayOrderDetails(data.order);
        } else {
            showNoResults();
        }
        */
        
        return null;
    } catch (error) {
        console.error('Error searching order by phone:', error);
        showNoResults();
        return null;
    }
}

/**
 * Update order status in Google Sheets
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status
 */
async function updateOrderStatusInSheet(orderId, newStatus) {
    try {
        // TODO: Implement Google Sheets API integration
        console.log('Updating status in Google Sheets:', { orderId, newStatus });
        
        /*
        const response = await fetch(CONFIG.API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.TOKEN}`
            },
            body: JSON.stringify({
                sheetId: CONFIG.SHEET_ID,
                orderId: orderId,
                status: newStatus
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        return await response.json();
        */
        
        return true;
    } catch (error) {
        console.error('Error updating status:', error);
        alert('حدث خطأ أثناء تحديث الحالة');
        return false;
    }
}

// ========================================
// Utility Functions
// ========================================

/**
 * Format date to Arabic locale
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate unique order ID
 * @returns {string} Order ID
 */
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return `${parseFloat(amount).toFixed(2)} جنيه`;
}

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ========================================
// Console Info
// ========================================
console.log('%c Shalaby OMS v1.0 ', 'background: #D32F2F; color: white; font-size: 16px; font-weight: bold; padding: 5px 10px;');
console.log('%c Powered by OROOJ Agency ', 'background: #111; color: white; font-size: 12px; padding: 3px 8px;');
