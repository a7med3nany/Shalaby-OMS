// ========================================
// Shalaby OMS - JavaScript
// Version: 1.0
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

async function handleNewOrderSubmit(e) {

    e.preventDefault();

    const form = e.target;

    if (!validateForm(form)) {
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');

    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'جارى الحفظ...';

    try {

        const formData = getFormData(form);

        const payload = {

            customer: formData.customerName,
            phone: formData.customerPhone,
            governorate: formData.governorate,
            address: formData.address,
            product: formData.product,
            quantity: formData.quantity,
            price: formData.price,
            shipping: formData.shippingCompany,
            payment: formData.paymentMethod,
            source: formData.orderSource,
            notes: formData.notes

        };

        const response = await fetch(CONFIG.API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if(result.success){

            const orderNumberElement =
                document.getElementById('generatedOrderId');

            if(orderNumberElement){
                orderNumberElement.textContent =
                    result.orderId;
            }

            showSuccessModal();

        }else{

            alert(result.message || "حدث خطأ أثناء التسجيل");

        }

    }

    catch(error){

        console.error(error);

        alert("فشل الاتصال بالخادم");

    }

    finally{

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

    }

}
function getFormData(form) {
    const data = {};
    
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

// Update Order Page Functions
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

function searchOrder() {
    const orderId = document.getElementById('searchOrderId')?.value.trim();
    const phone = document.getElementById('searchPhone')?.value.trim();
    
    if (!orderId && !phone) {
        alert('من فضلك أدخل رقم الأوردر أو رقم الموبايل');
        return;
    }
    
    showLoading();
    
    if (orderId) {
        console.log('Searching by Order ID:', orderId);
    } else if (phone) {
        console.log('Searching by Phone:', phone);
    }
    
    setTimeout(() => {
        showNoResults();
        hideLoading();
    }, 1500);
}

function displayOrderDetails(order) {
    currentOrder = order;
    
    document.getElementById('noResults').style.display = 'none';
    
    document.getElementById('displayOrderId').textContent = order.orderId || '-';
    document.getElementById('displayOrderDate').textContent = order.orderDate || '-';
    document.getElementById('displayCustomerName').textContent = order.customerName || '-';
    document.getElementById('displayPhone').textContent = order.phone || '-';
    document.getElementById('displayProduct').textContent = order.product || '-';
    document.getElementById('displayPrice').textContent = order.price || '-';
    document.getElementById('displayAddress').textContent = order.address || '-';
    document.getElementById('displayShipping').textContent = order.shippingCompany || '-';
    document.getElementById('displayPayment').textContent = order.paymentMethod || '-';
    
    const statusBadge = document.getElementById('currentStatusBadge');
    statusBadge.textContent = order.status || 'جديد';
    statusBadge.className = 'status-badge ' + getStatusClass(order.status || 'جديد');
    
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
    
    currentOrder.status = newStatus;
    
    const statusBadge = document.getElementById('currentStatusBadge');
    statusBadge.textContent = newStatus;
    statusBadge.className = 'status-badge ' + getStatusClass(newStatus);
    
    showUpdateSuccessModal();
    
    document.getElementById('updateStatusForm').reset();
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
console.log('%c Shalaby OMS v1.0 ', 'background: #D32F2F; color: white; font-size: 16px; font-weight: bold; padding: 5px 10px;');
console.log('%c Powered by OROOJ Agency ', 'background: #111; color: white; font-size: 12px; padding: 3px 8px;');
