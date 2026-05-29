// ===================================
// CONTACT PAGE - FORM HANDLING
// Category selection, validation, submit
// ===================================

// ===== STATE =====
let selectedCategory = null;

// ===== DOM ELEMENTS =====
const categoryCards = document.querySelectorAll('.category-card');
const categoryError = document.getElementById('categoryError');
const categoryInput = document.getElementById('categoryInput');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successState = document.getElementById('successState');
const formSection = document.querySelector('.section-form');
const categorySection = document.querySelector('.section-category');

// ===== FORM FIELDS =====
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const commentsInput = document.getElementById('comments');

// ===== ERROR ELEMENTS =====
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const commentsError = document.getElementById('commentsError');

// ===== URL PARAMETER DETECTION =====
const urlParams = new URLSearchParams(window.location.search);
const intentParam = urlParams.get('intent');

// ===== AUTO-SELECT CATEGORY FROM URL =====
if (intentParam) {
    const categoryMap = {
        'investor': 'investor',
        'partner': 'partner',
        'vendor': 'vendor',
        'customer': 'customer',
        'call': 'investor', // Schedule a call → investor category
        'general': 'general'
    };
    
    const targetCategory = categoryMap[intentParam.toLowerCase()];
    if (targetCategory) {
        // Find and select the matching card
        categoryCards.forEach(card => {
            if (card.dataset.category === targetCategory) {
                selectCategory(card, targetCategory);
            }
        });
    }
}

// ===== CATEGORY CARD SELECTION =====
categoryCards.forEach(card => {
    // Click event
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        selectCategory(card, category);
    });
    
    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const category = card.dataset.category;
            selectCategory(card, category);
        }
    });
});

function selectCategory(card, category) {
    // Remove selected state from all cards
    categoryCards.forEach(c => c.classList.remove('selected'));
    
    // Add selected state to clicked card
    card.classList.add('selected');
    
    // Update state
    selectedCategory = category;
    categoryInput.value = category;
    
    // Hide error if visible
    categoryError.classList.remove('visible');
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm() {
    let isValid = true;
    
    // Clear all errors
    clearErrors();
    
    // Check category
    if (!selectedCategory) {
        categoryError.classList.add('visible');
        isValid = false;
    }
    
    // Check full name
    if (!fullNameInput.value.trim()) {
        showError(fullNameInput, fullNameError, 'Name is required');
        isValid = false;
    }
    
    // Check email
    if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email');
        isValid = false;
    }
    
    // Check comments
    if (!commentsInput.value.trim()) {
        showError(commentsInput, commentsError, 'Message is required');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
}

function clearErrors() {
    // Remove error classes from inputs
    const inputs = [fullNameInput, emailInput, phoneInput, commentsInput];
    inputs.forEach(input => input.classList.remove('error'));
    
    // Hide error messages
    const errors = [fullNameError, emailError, phoneError, commentsError];
    errors.forEach(error => {
        error.classList.remove('visible');
        error.textContent = '';
    });
    
    // Hide category error
    categoryError.classList.remove('visible');
}

// ===== REAL-TIME ERROR CLEARING =====
fullNameInput.addEventListener('input', () => {
    if (fullNameInput.classList.contains('error')) {
        fullNameInput.classList.remove('error');
        fullNameError.classList.remove('visible');
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        emailInput.classList.remove('error');
        emailError.classList.remove('visible');
    }
});

commentsInput.addEventListener('input', () => {
    if (commentsInput.classList.contains('error')) {
        commentsInput.classList.remove('error');
        commentsError.classList.remove('visible');
    }
});

// ===== FORM SUBMISSION =====
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        // Scroll to first error
        if (!selectedCategory) {
            // Highlight category section
            categoryError.classList.add('visible');
            categorySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add shake animation to category cards
            categoryCards.forEach(card => {
                card.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    card.style.animation = '';
                }, 500);
            });
        } else {
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Prepare form data
    const formData = {
        category: selectedCategory,
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        comments: commentsInput.value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString(),
        source: 'website_contact_form'
    };
    
    // Simulate API call (replace with actual endpoint)
    try {
        await submitToBackend(formData);
        
        // Success - show success state
        showSuccessState();
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Something went wrong. Please try again or email us directly at hello@xvender.com');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// ===== BACKEND SUBMISSION (PLACEHOLDER) =====
async function submitToBackend(formData) {
    // TODO: Replace with actual API endpoint
    // For now, simulate a delay
    
    console.log('Form data:', formData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, you would do:
    /*
    const response = await fetch('https://api.xvender24.com/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return await response.json();
    */
    
    // For demo purposes, always succeed
    return { success: true };
}

// ===== SHOW SUCCESS STATE =====
function showSuccessState() {
    // Fade out form and category sections
    formSection.style.transition = 'opacity 0.3s ease';
    formSection.style.opacity = '0';
    categorySection.style.transition = 'opacity 0.3s ease';
    categorySection.style.opacity = '0';
    
    setTimeout(() => {
        // Hide form sections
        formSection.style.display = 'none';
        categorySection.style.display = 'none';
        
        // Show success state
        successState.style.display = 'block';
        setTimeout(() => {
            successState.classList.add('visible');
        }, 50);
        
        // Scroll to success state
        successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// ===== ACCESSIBILITY: FOCUS MANAGEMENT =====
document.addEventListener('DOMContentLoaded', () => {
    // Log initialization
    console.log('Contact form initialized');
    
    // If category was pre-selected from URL, scroll to form
    if (selectedCategory) {
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }
});

// ===== REDUCED MOTION SUPPORT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion detected - simplified animations');
}
