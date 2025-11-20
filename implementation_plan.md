# 1SM Winter Break MCAT Bootcamp Checkout Page – Implementation Plan

This document is the **source of truth** for implementing the Winter Break MCAT Bootcamp checkout page.

- Tech stack: **Static HTML + CSS + vanilla JS**
- Hosting: **GitHub Pages**
- Embedding: **Softr Custom Code block** (via iframe or inline HTML/JS)
- Audience: **Current 1SM students only**

---

## 0. Project goals

We want a **private checkout page** (not on the main marketing site) that:

1. Shows **three payment options** for the Winter Break MCAT Bootcamp:
   - One‑time payment
   - Two monthly installments
   - Three monthly installments
2. Has a **toggle** to add:
   - **Weekly planning / check‑in sessions with a tutor** (fixed add‑on package)
3. When the toggle is ON:
   - All three plans **switch** to "bootcamp + weekly sessions" pricing
   - Discount messages show:
     - 50% off bootcamp for 1SM students
     - No discount on weekly sessions
   - We also show the **combined total** and **total savings** clearly
4. Each card has a **Stripe Payment Link** (no Stripe API, just links).

---

## 1. Business rules and pricing (authoritative)

These numbers should be treated as **hard‑coded business rules**.

### 1.1 Base bootcamp (no weekly sessions)

- Product: **Winter Break MCAT Bootcamp**
- Regular price: **$3,750**
- 1SM student discount: marketed as **"50% off"**
- Discounted price for 1SM students: **$1,875**
- Offer window: **Black Friday discount until December 1, 11:59 p.m. Pacific**

Payment variants (bootcamp only):

1. **One‑time payment**
   - Student pays: **$1,875 once**
   - Button text (suggested):  
     `One-time payment – $1,875`
   - Stripe link: `BOOTCAMP_ONLY_ONETIME` (placeholder; replace with real URL)

2. **Two monthly installments**
   - Student pays: **$938 / month** for **2 months**
   - Button text:  
     `2 monthly payments – $938/month`
   - Stripe link: `BOOTCAMP_ONLY_2MO`

3. **Three monthly installments**
   - Student pays: **$625 / month** for **3 months**
   - Button text:  
     `3 monthly payments – $625/month`
   - Stripe link: `BOOTCAMP_ONLY_3MO`

### 1.2 Bootcamp + weekly tutor sessions (add‑on ON)

Add‑on component:

- Product: **Weekly planning / check‑in sessions with a tutor**
- Regular price: **$980**
- 1SM discount: **No discount** → **$980** extra when purchased with bootcamp.

Combined package:

- Bootcamp discounted: **$1,875**
- Weekly sessions: **$980** (no discount)
- **Total student price**:  
  $1,875 + $980 = **$2,855**
- Combined regular price:  
  $3,750 + $980 = **$4,730**
- **Total savings for 1SM students**:  
  $4,730 – $2,855 = **$1,875**

Payment variants (bootcamp + weekly sessions):

1. **One‑time payment**
   - Student pays: **$2,855 once**
   - Button text:  
     `One-time payment – $2,855`
   - Show breakdown:
     - Bootcamp: `$3,750 → $1,875 (50% off for 1SM students)`
     - Weekly check‑ins: `$980` (no discount)
     - Combined: `$4,730 → $2,855 (you save $1,875)`
   - Stripe link: `BOOTCAMP_PLUS_WEEKLY_ONETIME`

2. **Two monthly installments**
   - Student pays: **$1,428 / month** for **2 months**  
     (2 × 1,428 = 2,856)
   - Button text:  
     `2 monthly payments – $1,428/month`
   - Same breakdown text as one‑time card.
   - Stripe link: `BOOTCAMP_PLUS_WEEKLY_2MO`

3. **Three monthly installments**
   - Student pays: **$952 / month** for **3 months**  
     (3 × 952 = 2,856)
   - Button text:  
     `3 monthly payments – $952/month`
   - Same breakdown text.
   - Stripe link: `BOOTCAMP_PLUS_WEEKLY_3MO`

**Requirement:** For the "bootcamp + weekly" state, always show:

- Bootcamp discount (50% off, 3,750 → 1,875)
- Weekly add‑on (no discount, 980 → 980)
- Combined original vs combined discounted (4,730 → 2,855, save 1,875)

---

## 2. UX / UI design spec

### 2.1 Page sections

1. **Header**
   - Title:  
     `Winter Break MCAT Bootcamp — 1SM Student Pricing`
   - Subtitle:  
     `Exclusive Black Friday pricing for current 1SM students through Dec 1, 11:59 p.m. Pacific Time.`
   - Optional small text: `Payments secured by Stripe. Existing 1SM students only.`

2. **Add‑on toggle section**
   - Short heading: `Add weekly tutor check-in sessions?`
   - Description text (under heading):  
     `Weekly planning & accountability sessions during the bootcamp. Normally $980, 1SM students get 50% off.`
   - Toggle UI:
     - Implemented as `<input type="checkbox">` with visually styled slider.
     - Labels:
       - Left side label: “Bootcamp only”
       - Right side label: “Bootcamp + weekly check-ins”
     - Checkbox ID: `weekly-addon-toggle` (used in JS).

3. **Plans grid (3 cards)**
   - Each card = one payment option.
   - Desktop: 3 columns in a row.
   - Mobile: stack cards vertically.

4. **Fine print / footer**
   - Mentions:
     - Offer date limit.
     - That this is for current 1SM students.
     - Stripe handles secure payments, etc.

### 2.2 Card layout (per plan)

Each plan card includes:

- **Plan title**
  - “One-time payment”
  - “2 monthly installments”
  - “3 monthly installments”

- **Product description**
  - For bootcamp only state:  
    `Winter Break MCAT Bootcamp (1SM student discount)`
  - For combined state:  
    `Winter Break MCAT Bootcamp + weekly tutor planning/check-in sessions (1SM student pricing)`

- **Discount area**
  - Bootcamp‑only state:
    - Original price text with strikethrough: `Normally $3,750`
    - Badge/pill: `≈50% off for 1SM students`
  - Combined state:
    - Line 1: `Bootcamp: $3,750 → $1,875 (50% off for 1SM students)`
    - Line 2: `Weekly check-ins: $980 (no discount)`
    - Line 3 (savings summary):  
      `Total value $4,730 → $2,855 — you save $1,875`

- **Price area**
  - Main price text (large, prominent)
  - Subtext that clarifies schedule

  Bootcamp only:
  - Card 1: `$1,875` / `One-time payment`
  - Card 2: `$938/month` / `2 monthly payments (total $1,875)`
  - Card 3: `$625/month` / `3 monthly payments`

  Bootcamp + weekly:
  - Card 1: `$2,855` / `One-time payment`
  - Card 2: `$1,428/month` / `2 monthly payments (total $2,855)`
  - Card 3: `$952/month` / `3 monthly payments (total $2,855)`

- **Feature list**
  - Same (or almost same) features across cards, varying only by whether weekly sessions are included.
  - Example bullets for bootcamp only:
    - “Live small-group MCAT sessions over winter break”
    - “Comprehensive content review and strategy”
    - “Practice exams & analytics”
  - Example bullets for combined package (toggle ON):
    - All bootcamp bullets
    - Plus: “10 weekly planning & accountability check-ins with a tutor”

- **Primary CTA button**
  - Text includes payment structure, e.g.:
    - `One-time payment – $1,875`
    - `2 monthly payments – $938/month`
    - `3 monthly payments – $625/month`
  - `href` = Stripe payment link for this plan in current state.
  - `target="_blank"`, `rel="noopener noreferrer"`.

### 2.3 Visual look & feel

- Card style:
  - White background
  - Soft border radius (e.g., 10–12px)
  - Subtle box shadow
- Colors:
  - Neutral background behind cards, e.g., light gray or off‑white.
  - Primary accent color can align with 1SM brand (to be chosen in CSS).
- Layout:
  - Use CSS `flex` or `grid` for the 3 cards with consistent `gap`.
- Responsive:
  - `max-width: ~1100px` container centered.
  - Media query to stack cards on narrow screens.

- Optional: mark one card (e.g. 3‑month plan or one‑time plan) with a small ribbon:
  - “Most popular” or “Best value”.

---

## 3. Frontend behaviour (JS) and data model

We want **clean, data‑driven JS**:

### 3.1 DOM hooks

Each plan card will use `data-` attributes to link to configuration:

- Container: `<article class="plan-card" data-plan="oneTime">`
- Text hooks (per card):
  - `[data-role="plan-title"]`
  - `[data-role="product-label"]`
  - `[data-role="discount-lines"]`
  - `[data-role="price-main"]`
  - `[data-role="price-sub"]`
  - `[data-role="cta"]`

Checkbox toggle:

- `<input type="checkbox" id="weekly-addon-toggle">`  

### 3.2 JS configuration object

Central JS config (in `script.js`):

```js
const PRICING_CONFIG = {
  base: {
    productLabel: 'Winter Break MCAT Bootcamp (1SM student discount)',
    discounts: [
      'Normally $3,750',
      '≈50% off for 1SM students'
    ],
    plans: {
      oneTime: {
        title: 'One-time payment',
        mainPrice: '$1,875',
        subPrice: 'Pay in full today',
        ctaLabel: 'One-time payment – $1,875',
        stripeUrl: 'https://stripe.link/BOOTCAMP_ONLY_ONETIME'
      },
      twoMonths: {
        title: '2 monthly installments',
        mainPrice: '$938/month',
        subPrice: '2 monthly payments (total $1,875)',
        ctaLabel: '2 monthly payments – $938/month',
        stripeUrl: 'https://stripe.link/BOOTCAMP_ONLY_2MO'
      },
      threeMonths: {
        title: '3 monthly installments',
        mainPrice: '$625/month',
        subPrice: '3 monthly payments',
        ctaLabel: '3 monthly payments – $625/month',
        stripeUrl: 'https://stripe.link/BOOTCAMP_ONLY_3MO'
      }
    }
  },
  withWeekly: {
    productLabel:
      'Winter Break MCAT Bootcamp + weekly tutor planning/check-in sessions (1SM student pricing)',
    discounts: [
      'Bootcamp: $3,750 → $1,875 (50% off for 1SM students)',
      'Weekly check-ins: $980 (no discount)',
      'Total value $4,730 → $2,855 — you save $1,875'
    ],
    plans: {
      oneTime: {
        title: 'One-time payment',
        mainPrice: '$2,855',
        subPrice: 'Pay in full today',
        ctaLabel: 'One-time payment – $2,855',
        stripeUrl: 'https://stripe.link/BOOTCAMP_PLUS_WEEKLY_ONETIME'
      },
      twoMonths: {
        title: '2 monthly installments',
        mainPrice: '$1,428/month',
        subPrice: '2 monthly payments (total $2,855)',
        ctaLabel: '2 monthly payments – $1,428/month',
        stripeUrl: 'https://stripe.link/BOOTCAMP_PLUS_WEEKLY_2MO'
      },
      threeMonths: {
        title: '3 monthly installments',
        mainPrice: '$952/month',
        subPrice: '3 monthly payments (total $2,855)',
        ctaLabel: '3 monthly payments – $952/month',
        stripeUrl: 'https://stripe.link/BOOTCAMP_PLUS_WEEKLY_3MO'
      }
    }
  }
};
