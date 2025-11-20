/**
 * 1SM Winter Break MCAT Bootcamp - Interactive Pricing Calculator
 * 
 * This script handles:
 * - Progressive question disclosure
 * - Dynamic pricing calculation
 * - Line item display with discounts
 * - Payment plan selection
 * - Stripe payment link routing
 */

// ========================================
// Pricing Constants
// ========================================
const PRICING = {
  bootcamp: {
    regular: 3750,
    discount1SM: 2260,
    discounted: 1490
  },
  weekly: {
    regular: 980,
    discount1SM: 490,
    discounted: 490
  }
};

// Stripe Payment Links Configuration
const STRIPE_LINKS = {
  bootcampOnly: {
    oneTime: 'https://buy.stripe.com/9B628q8YUdAH2KBcE1fIB3Y',
    twoMonths: 'https://buy.stripe.com/dRmfZgfni0NV5WNbzXfIB3Z',
    threeMonths: 'https://buy.stripe.com/fZueVcfnibsz4SJ7jHfIB44'
  },
  bootcampWithWeekly: {
    oneTime: 'https://buy.stripe.com/eVq4gy0sofIPdpf5bzfIB40',
    twoMonths: 'https://buy.stripe.com/dRm28q7UQfIPgBrgUhfIB42',
    threeMonths: 'https://buy.stripe.com/cNi5kC2Aw2W3gBrbzXfIB43'
  },
  bootcampOnlyNon1SM: {
    oneTime: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section',
    twoMonths: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section',
    threeMonths: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section'
  },
  bootcampWithWeeklyNon1SM: {
    oneTime: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section',
    twoMonths: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section',
    threeMonths: 'https://1sourcemedicine.com/mcat-bootcamp/#pricing-section'
  }
};

// ========================================
// State Management
// ========================================
const state = {
  is1SMStudent: null,
  addWeekly: null,
  paymentPlan: null
};

// ========================================
// DOM Elements Cache
// ========================================
const elements = {
  question2: null,
  question3: null,
  lineItems: null,
  amountDue: null,
  originalAmount: null,
  discountedAmount: null,
  checkoutButton: null,
  installmentAgreement: null,
  countdown: {
    container: null,
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    milliseconds: null
  }
};

// ========================================
// Initialization
// ========================================
function init() {
  // Cache DOM elements
  elements.question2 = document.getElementById('question-2');
  elements.question3 = document.getElementById('question-3');
  elements.lineItems = document.getElementById('line-items');
  elements.amountDue = document.getElementById('amount-due');
  elements.originalAmount = document.getElementById('original-amount');
  elements.discountedAmount = document.getElementById('discounted-amount');
  elements.checkoutButton = document.getElementById('checkout-button');
  elements.installmentAgreement = document.getElementById('installment-agreement');
  
  // Cache countdown elements
  elements.countdown.container = document.getElementById('countdown-container');
  elements.countdown.days = document.getElementById('days');
  elements.countdown.hours = document.getElementById('hours');
  elements.countdown.minutes = document.getElementById('minutes');
  elements.countdown.seconds = document.getElementById('seconds');
  elements.countdown.milliseconds = document.getElementById('milliseconds');
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize amount due display with base price
  updateAmountDueDisplay();
  
  // Start countdown timer
  initCountdown();
  
  console.log('✓ Interactive pricing calculator initialized');
}

// ========================================
// Event Listeners Setup
// ========================================
function setupEventListeners() {
  // Question 1: Are you a 1SM student?
  document.querySelectorAll('input[name="is-1sm-student"]').forEach(radio => {
    radio.addEventListener('change', handleQuestion1Change);
  });
  
  // Question 2: Add weekly check-ins?
  document.querySelectorAll('input[name="add-weekly"]').forEach(radio => {
    radio.addEventListener('change', handleQuestion2Change);
  });
  
  // Question 3: Payment plan
  document.querySelectorAll('input[name="payment-plan"]').forEach(radio => {
    radio.addEventListener('change', handleQuestion3Change);
  });
  
  // Checkout button
  elements.checkoutButton.addEventListener('click', handleCheckout);
}

// ========================================
// Question 1 Handler: 1SM Student Status
// ========================================
function handleQuestion1Change(event) {
  state.is1SMStudent = event.target.value === 'yes';
  
  // Show question 2
  showElement(elements.question2);
  
  // Update line items (to add discount if 1SM student)
  updateLineItems();
  
  // Update pricing display
  updateAmountDueDisplay();
  
  // Reset subsequent questions
  resetQuestion2();
  resetQuestion3();
}

// ========================================
// Question 2 Handler: Add Weekly Check-ins
// ========================================
function handleQuestion2Change(event) {
  state.addWeekly = event.target.value === 'yes';
  
  // Show question 3
  showElement(elements.question3);
  
  // Update line items and pricing
  updateLineItems();
  updateAmountDueDisplay();
  
  // Reset question 3
  resetQuestion3();
}

// ========================================
// Question 3 Handler: Payment Plan
// ========================================
function handleQuestion3Change(event) {
  state.paymentPlan = event.target.value;
  
  // Update line items to show total and installment info
  updateLineItems();
  
  // Update amount due display (with installment division if applicable)
  updateAmountDueDisplay();
  
  // Enable checkout button
  elements.checkoutButton.disabled = false;
  
  // Show/hide installment agreement
  updateInstallmentAgreement();
}

// ========================================
// Update Line Items Display
// ========================================
function updateLineItems() {
  const lineItemsHTML = [];
  
  // Base bootcamp (always shown)
  lineItemsHTML.push(`
    <div class="line-item">
      <span class="line-item-label">1SM Winter Break MCAT Bootcamp</span>
      <span class="line-item-amount">+ $${PRICING.bootcamp.regular.toLocaleString()}</span>
    </div>
  `);
  
  // 1SM Student discount (only after Q1 is answered as Yes)
  if (state.is1SMStudent === true) {
    lineItemsHTML.push(`
      <div class="line-item discount">
        <span class="line-item-label">1SM existing student Bootcamp discount (60% Black Friday)</span>
        <span class="line-item-amount">− $${PRICING.bootcamp.discount1SM.toLocaleString()}</span>
      </div>
    `);
  }
  
  // Weekly check-ins (only after Q2 is answered as Yes)
  if (state.addWeekly === true) {
    lineItemsHTML.push(`
      <div class="line-item">
        <span class="line-item-label">Weekly personalized check-ins</span>
        <span class="line-item-amount">+ $${PRICING.weekly.regular.toLocaleString()}</span>
      </div>
    `);
    
    // Weekly discount (only if 1SM student AND weekly selected)
    if (state.is1SMStudent === true) {
      lineItemsHTML.push(`
        <div class="line-item discount">
          <span class="line-item-label">1SM existing student check-in discount (50% Black Friday)</span>
          <span class="line-item-amount">− $${PRICING.weekly.discount1SM.toLocaleString()}</span>
        </div>
      `);
    }
  }
  
  // If payment plan is selected, show total and installment details
  if (state.paymentPlan) {
    const totalAmount = calculateTotalAmount();
    
    lineItemsHTML.push(`<div class="line-item-separator"></div>`);
    lineItemsHTML.push(`
      <div class="line-item total">
        <span class="line-item-label">Total amount due</span>
        <span class="line-item-amount">$${totalAmount.toLocaleString()}</span>
      </div>
    `);
    
    // Show installment breakdown if applicable
    if (state.paymentPlan !== 'one-time') {
      const numInstallments = state.paymentPlan === '2-months' ? 2 : 3;
      const perMonth = Math.round(totalAmount / numInstallments);
      
      // Format: "$1980 / 3 monthly installments = $660 per month"
      lineItemsHTML.push(`
        <div class="line-item installment-info">
          <span class="line-item-label">$${totalAmount.toLocaleString()} / ${numInstallments} monthly installments = $${perMonth.toLocaleString()} per month</span>
        </div>
      `);
      
      // Format: "3 months × $660/month = $1,980"
      lineItemsHTML.push(`
        <div class="line-item installment-info">
          <span class="line-item-label">${numInstallments} months × $${perMonth.toLocaleString()}/month = $${totalAmount.toLocaleString()}</span>
        </div>
      `);
    }
  }
  
  elements.lineItems.innerHTML = lineItemsHTML.join('');
}

// ========================================
// Update Amount Due Display
// ========================================
function updateAmountDueDisplay() {
  const totalAmount = calculateTotalAmount();
  const regularAmount = calculateRegularAmount();
  
  // Determine the amount to display (divided by installments if applicable)
  let displayAmount = totalAmount;
  let displayRegularAmount = regularAmount;
  
  if (state.paymentPlan && state.paymentPlan !== 'one-time') {
    const numInstallments = state.paymentPlan === '2-months' ? 2 : 3;
    displayAmount = Math.ceil(totalAmount / numInstallments);
    displayRegularAmount = Math.ceil(regularAmount / numInstallments);
  }
  
  if (state.is1SMStudent) {
    // Show strikethrough original and discounted price
    elements.originalAmount.textContent = `$${displayRegularAmount.toLocaleString()}`;
    elements.originalAmount.classList.add('strikethrough');
    elements.discountedAmount.textContent = `$${displayAmount.toLocaleString()}`;
    elements.discountedAmount.classList.add('visible');
  } else {
    // Show only regular price
    elements.originalAmount.textContent = `$${displayAmount.toLocaleString()}`;
    elements.originalAmount.classList.remove('strikethrough');
    elements.discountedAmount.classList.remove('visible');
  }
}

// ========================================
// Calculate Total Amount
// ========================================
function calculateTotalAmount() {
  let total = 0;
  
  // Base bootcamp
  if (state.is1SMStudent) {
    total += PRICING.bootcamp.discounted;
  } else {
    total += PRICING.bootcamp.regular;
  }
  
  // Weekly check-ins
  if (state.addWeekly) {
    if (state.is1SMStudent) {
      total += PRICING.weekly.discounted;
    } else {
      total += PRICING.weekly.regular;
    }
  }
  
  return total;
}

// ========================================
// Calculate Regular (Non-Discounted) Amount
// ========================================
function calculateRegularAmount() {
  let total = PRICING.bootcamp.regular;
  
  if (state.addWeekly) {
    total += PRICING.weekly.regular;
  }
  
  return total;
}

// ========================================
// Update Installment Agreement Text
// ========================================
function updateInstallmentAgreement() {
  if (state.paymentPlan === 'one-time') {
    hideElement(elements.installmentAgreement);
    return;
  }
  
  const numInstallments = state.paymentPlan === '2-months' ? 2 : 3;
  const totalAmount = calculateTotalAmount();
  const perMonth = Math.round(totalAmount / numInstallments);
  
  elements.installmentAgreement.innerHTML = `
    By signing up for this plan, I am agreeing to payment of <strong>${numInstallments}</strong> 
    monthly installments of <strong>$${perMonth.toLocaleString()}</strong> each.
  `;
  
  showElement(elements.installmentAgreement);
}

// ========================================
// Get Stripe Payment Link
// ========================================
function getStripeLink() {
  const planType = state.paymentPlan === 'one-time' ? 'oneTime' 
    : state.paymentPlan === '2-months' ? 'twoMonths' 
    : 'threeMonths';
  
  if (state.is1SMStudent) {
    if (state.addWeekly) {
      return STRIPE_LINKS.bootcampWithWeekly[planType];
    } else {
      return STRIPE_LINKS.bootcampOnly[planType];
    }
  } else {
    if (state.addWeekly) {
      return STRIPE_LINKS.bootcampWithWeeklyNon1SM[planType];
    } else {
      return STRIPE_LINKS.bootcampOnlyNon1SM[planType];
    }
  }
}

// ========================================
// Handle Checkout
// ========================================
function handleCheckout() {
  if (!state.paymentPlan) {
    alert('Please select a payment plan before proceeding.');
    return;
  }
  
  const stripeUrl = getStripeLink();
  
  // Track the event (for analytics)
  trackEvent('checkout_initiated', {
    is_1sm_student: state.is1SMStudent,
    add_weekly: state.addWeekly,
    payment_plan: state.paymentPlan,
    total_amount: calculateTotalAmount()
  });
  
  // Redirect to Stripe
  window.open(stripeUrl, '_blank', 'noopener,noreferrer');
}

// ========================================
// Reset Functions
// ========================================
function resetQuestion2() {
  state.addWeekly = null;
  document.querySelectorAll('input[name="add-weekly"]').forEach(radio => {
    radio.checked = false;
  });
  hideElement(elements.question3);
  // Update line items to remove weekly items
  updateLineItems();
}

function resetQuestion3() {
  state.paymentPlan = null;
  document.querySelectorAll('input[name="payment-plan"]').forEach(radio => {
    radio.checked = false;
  });
  elements.checkoutButton.disabled = true;
  hideElement(elements.installmentAgreement);
  // Reset amount due display to full amount
  updateAmountDueDisplay();
}

// ========================================
// Utility Functions
// ========================================
function showElement(element) {
  if (element) {
    element.style.display = 'block';
    // Trigger reflow for animation
    void element.offsetWidth;
  }
}

function hideElement(element) {
  if (element) {
    element.style.display = 'none';
  }
}

function trackEvent(eventName, eventData = {}) {
  console.log('📊 Event tracked:', eventName, eventData);
  
  // Integrate with analytics service here
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
}

// ========================================
// Countdown Timer
// ========================================
let countdownInterval = null;

function initCountdown() {
  // Target: Midnight PT on December 2, 2025 (end of Dec 1)
  const targetDate = new Date('2025-12-02T00:00:00-08:00'); // Pacific Time
  
  function updateCountdown() {
    const now = new Date();
    const timeRemaining = targetDate - now;
    
    if (timeRemaining <= 0) {
      // Countdown expired
      clearInterval(countdownInterval);
      if (elements.countdown.container) {
        elements.countdown.container.innerHTML = '<div class="countdown-expired">This offer has expired</div>';
      }
      return;
    }
    
    // Calculate time components
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(timeRemaining % 1000);
    
    // Update display
    if (elements.countdown.days) {
      elements.countdown.days.textContent = String(days).padStart(2, '0');
    }
    if (elements.countdown.hours) {
      elements.countdown.hours.textContent = String(hours).padStart(2, '0');
    }
    if (elements.countdown.minutes) {
      elements.countdown.minutes.textContent = String(minutes).padStart(2, '0');
    }
    if (elements.countdown.seconds) {
      elements.countdown.seconds.textContent = String(seconds).padStart(2, '0');
    }
    if (elements.countdown.milliseconds) {
      elements.countdown.milliseconds.textContent = String(milliseconds).padStart(3, '0');
    }
  }
  
  // Update immediately
  updateCountdown();
  
  // Update every 50ms for smooth millisecond display
  countdownInterval = setInterval(updateCountdown, 50);
}

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
});

// ========================================
// Initialize on DOM Ready
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ========================================
// Export for testing (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRICING,
    calculateTotalAmount,
    calculateRegularAmount,
    getStripeLink
  };
}
