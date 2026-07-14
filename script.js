// ========================================
// Shalaby OMS - JavaScript
// Version: 1.2 (Fixed: Phone Zero, Search API, CORS, Update Status)
// ========================================

'use strict';

// Global Variables
let currentOrder = null;

// Navigation Functions
function navigateTo(page) {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = page;
    }, 200);
}

// Page Load Animations
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    initializePage();
});

// Initialize Page Functions
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

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

// Home Page Functions
function initializeHomePage() {
    console.log('Home page initialized');
    
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

// New Order Page Functions
function initializeNewOrderPage() {
    console.log('New Order page initialized');
    
    const form = document.getElementById('newOrderForm');
    
    if (form) {
        form.addEventListener('submit', handleNewOrderSubmit);
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
        
        const phoneInput = document.getElementById('customerPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
        
        const priceInput = document.getElementById('price');
        if (priceInput) {
            priceInput.addEventListener('blur', formatPrice);
        }
    }
}

// ========================================
// handleNewOrderSubmit - GET request + phone as string
// ========================================
async function handleNewOrderSubmit(e) {
    e.preventDefault();

    const form = e.target;

    if (!validateForm(form)) return;

    const submitBtn = form.querySelector("button[type='submit']");
    const oldText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = "جارى الحفظ...";

    const formData = getFormData(form);

    try {
        const params = new URLSearchParams();
        params.append('customer', formData.customerName);
        params.append('phone', String(formData.customerPhone));
        params.append('governorate', formData.governorate);
        params.append('address', formData.address);
        params.append('product', formData.product);
        params.append('quantity', formData.quantity);
        params.append('price', formData.price);
        params.append('shipping', formData.shippingCompany);
        params.append('payment', formData.paymentMethod);
        params.append('source', formData.orderSource);
        params.append('notes', formData.notes);

        const apiUrl = CONFIG.API_URL + "?" + params.toString();
        console.log("API URL:", apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

        const response = await fetch(apiUrl, {
            method: "GET",
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        const result = await response.json();
        console.log("Response:", result);

        if (result.success) {
            const id = document.getElementById("generatedOrderId");
            if (id) {
                id.innerText = "رقم الأوردر : " + result.orderId;
            }
            showSuccessModal();
        } else {
            alert(result.message || "حدث خطأ أثناء الحفظ");
        }

    } catch (err) {
        console.error("Error:", err);
        
        if (err.name === 'AbortError') {
            alert("انتهى وقت الانتظار. تأكد من اتصال الإنترنت.");
        } else if (err.message.includes('Failed to fetch')) {
            alert("تعذر الاتصال بالخادم. تأكد من الرابط.");
        } else {
            alert("خطأ: " + err.message);
        }
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldText;
    }
}

function getFormData(form) {
    const data = {};
    
    data.customerName = document.getElementById('customerName')?.value?.trim() || '';
    data.customerPhone = document.getElementById('customerPhone')?.value?.trim() || '';
    data.governorate = document.getElementById('governorate')?.value || '';
    data.address = document.getElementById('address')?.value?.trim() || '';
    data.product = document.getElementById('product')?.value?.trim() || '';
    data.quantity = document.getElementById('quantity')?.value || '1';
    data.price = document.getElementById('price')?.value || '0';
    data.shippingCompany = document.getElementById('shippingCompany')?.value || '';
    data.paymentMethod = document.getElementById('paymentMethod')?.value || '';
    data.orderSource = document.getElementById('orderSource')?.value || '';
    data.notes = document.getElementById('notes')?.value?.trim() || '';
    data.timestamp = new Date().toISOString();
    data.status = 'جديد';
    
    return data;
}

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

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        showValidationError(input);
        return false;
    }
    
    if (input.id === 'customerPhone' && value) {
        if (!isValidPhone(value)) {
            showValidationError(input, 'رقم التليفون غير صحيح');
            return false;
        }
    }
    
    if (input.id === 'price' && value) {
        if (parseFloat(value) <= 0) {
            showValidationError(input, 'السعر يجب أن يكون أكبر من صفر');
            return false;
        }
    }
    
    if (input.id === 'quantity' && value) {
        if (parseInt(value) <= 0) {
            showValidationError(input, 'الكمية يجب أن تكون أكبر من صفر');
            return false;
        }
    }
    
    clearValidationError(e);
    return true;
}

function isValidPhone(phone) {
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showValidationError(input, message = null) {
    input.classList.add('is-invalid');
    
    if (message) {
        const feedback = input.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
}

function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('is-invalid');
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substr(0, 11);
    }
    
    e.target.value = value;
}

function formatPrice(e) {
    const value = parseFloat(e.target.value);
    
    if (!isNaN(value)) {
        e.target.value = value.toFixed(2);
    }
}

function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function closeModalAndReset() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
    modal.hide();
    
    const form = document.getElementById('newOrderForm');
    if (form) {
        form.reset();
        
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
    
    const updateForm = document.getElementById('updateStatusForm');
    
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

// ========================================
// searchOrder - connected to API
// ========================================
async function searchOrder() {
    const orderId = document.getElementById('searchOrderId')?.value.trim();
    const phone = document.getElementById('searchPhone')?.value.trim();
    
    if (!orderId && !phone) {
        alert('من فضلك أدخل رقم الأوردر أو رقم الموبايل');
        return;
    }
    
    showLoading();
    
    try {
        const params = new URLSearchParams();
        params.append('action', 'search');
        if (orderId) params.append('orderId', orderId);
        if (phone) params.append('phone', phone);
        
        const apiUrl = CONFIG.API_URL + "?" + params.toString();
        console.log("Search URL:", apiUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);
        
        const response = await fetch(apiUrl, {
            method: "GET",
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const result = await response.json();
        console.log("Search Result:", result);
        
        if (result.success && result.order) {
            displayOrderDetails(result.order);
        } else {
            showNoResults();
            if (result.message) {
                alert(result.message);
            }
        }
        
    } catch (err) {
        console.error("Search Error:", err);
        alert("تعذر الاتصال بالخادم");
        showNoResults();
    } finally {
        hideLoading();
    }
}

// ========================================
// displayOrderDetails - store order properly
// ========================================
function displayOrderDetails(order) {
    console.log("displayOrderDetails received:", order);
    
    // ✅ Store order with guaranteed orderId
    currentOrder = {
        orderId: order.orderId || order.orderID || order.id || '',
        orderDate: order.orderDate || '',
        orderTime: order.orderTime || '',
        customerName: order.customerName || '',
        phone: order.phone || '',
        governorate: order.governorate || '',
        address: order.address || '',
        product: order.product || '',
        quantity: order.quantity || '',
        price: order.price || '',
        shipping: order.shipping || '',
        payment: order.payment || '',
        source: order.source || '',
        status: order.status || 'جديد',
        notes: order.notes || ''
    };
    
    console.log("currentOrder set to:", currentOrder);
    
    document.getElementById('noResults').style.display = 'none';
    
    document.getElementById('displayOrderId').textContent = currentOrder.orderId || '-';
    document.getElementById('displayOrderDate').textContent = currentOrder.orderDate || '-';
    document.getElementById('displayCustomerName').textContent = currentOrder.customerName || '-';
    document.getElementById('displayPhone').textContent = currentOrder.phone || '-';
    document.getElementById('displayProduct').textContent = currentOrder.product || '-';
    document.getElementById('displayPrice').textContent = currentOrder.price || '-';
    document.getElementById('displayAddress').textContent = currentOrder.address || '-';
    document.getElementById('displayShipping').textContent = currentOrder.shipping || '-';
    document.getElementById('displayPayment').textContent = currentOrder.payment || '-';
    
    const statusBadge = document.getElementById('currentStatusBadge');
    statusBadge.textContent = currentOrder.status || 'جديد';
    statusBadge.className = 'status-badge ' + getStatusClass(currentOrder.status || 'جديد');
    
    const orderCard = document.getElementById('orderDetailsCard');
    orderCard.style.display = 'block';
    
    setTimeout(() => {
        orderCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

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

// ========================================
// handleUpdateStatus - send to API
// ========================================
async function handleUpdateStatus(e) {
    e.preventDefault();
    
    const newStatus = document.getElementById('newStatus')?.value;
    
    console.log("=== UPDATE DEBUG START ===");
    console.log("newStatus:", newStatus);
    console.log("currentOrder:", currentOrder);
    
    if (!newStatus) {
        alert('من فضلك اختر الحالة الجديدة');
        return;
    }
    
    if (!currentOrder) {
        alert('لم يتم اختيار أوردر');
        console.error("currentOrder is null!");
        return;
    }
    
    // ✅ Get orderId safely
    const orderId = currentOrder.orderId;
    console.log("orderId:", orderId);
    
    if (!orderId) {
        alert('رقم الأوردر غير موجود');
        console.error("orderId is empty!", currentOrder);
        return;
    }
    
    try {
        const params = new URLSearchParams();
        params.append('action', 'update');
        params.append('orderId', orderId);
        params.append('newStatus', newStatus);
        
        const apiUrl = CONFIG.API_URL + "?" + params.toString();
        console.log("Update URL:", apiUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);
        
        const response = await fetch(apiUrl, {
            method: "GET",
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        console.log("Response status:", response.status);
        
        const result = await response.json();
        console.log("Update Result:", result);
        
        if (result.success) {
            // ✅ Update UI
            currentOrder.status = newStatus;
            
            const statusBadge = document.getElementById('currentStatusBadge');
            statusBadge.textContent = newStatus;
            statusBadge.className = 'status-badge ' + getStatusClass(newStatus);
            
            showUpdateSuccessModal();
            document.getElementById('updateStatusForm').reset();
        } else {
            alert('خطأ: ' + (result.message || 'حدث خطأ أثناء التحديث'));
        }
        
    } catch (err) {
        console.error("Update Error:", err);
        alert('تعذر الاتصال بالخادم: ' + err.message);
    }
    console.log("=== UPDATE DEBUG END ===");
}

function showUpdateSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
    modal.show();
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('orderDetailsCard').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('orderDetailsCard').style.display = 'none';
}

// Console Info
console.log('%c Shalaby OMS v1.2 ', 'background: #D32F2F; color: white; font-size: 16px; font-weight: bold; padding: 5px 10px;');
console.log('%c Powered by OROOJ Agency ', 'background: #111; color: white; font-size: 12px; padding: 3px 8px;');
