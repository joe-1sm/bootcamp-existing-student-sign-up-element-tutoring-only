# 1SM Winter Break MCAT Bootcamp - Checkout Page

A sleek and modern checkout page for the Winter Break MCAT Bootcamp, designed for current 1SM students with exclusive pricing options.

## 🎨 Design Features

- **Primary Brand Color**: #961a32 (Burgundy)
- **Secondary Colors**: Shades of silver/gray and white/black
- **Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **Smooth Animations**: Professional fade-in effects and transitions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🚀 Quick Start

### Viewing Locally

1. Simply open `index.html` in your web browser
2. No build process or dependencies required!

### Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Push these files to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Go to repository Settings → Pages
4. Select the branch (usually `main`) and root directory
5. Click Save
6. Your page will be live at: `https://[username].github.io/[repo-name]/`

## 📦 Files Included

- `index.html` - Main HTML structure with semantic markup
- `styles.css` - Complete styling with brand colors and responsive design
- `script.js` - Interactive pricing logic and toggle functionality
- `README.md` - This file
- `implementation_plan.md` - Original project specifications

## 🔧 Configuration

### Updating Stripe Payment Links

To connect real Stripe payment links, edit the `PRICING_CONFIG` object in `script.js`:

```javascript
const PRICING_CONFIG = {
  base: {
    plans: {
      oneTime: {
        stripeUrl: 'YOUR_ACTUAL_STRIPE_LINK_HERE'
      },
      // ... update other links
    }
  },
  withWeekly: {
    plans: {
      oneTime: {
        stripeUrl: 'YOUR_ACTUAL_STRIPE_LINK_HERE'
      },
      // ... update other links
    }
  }
};
```

### Customizing Pricing

All pricing is centralized in the `PRICING_CONFIG` object in `script.js`. Update the values there to change:
- Prices
- Payment plan descriptions
- Discount messages
- Product labels

## 📱 Embedding in Softr

### Option 1: Direct Embed (Recommended)

1. Host on GitHub Pages
2. In Softr, add a **Custom Code** block
3. Use an iframe:

```html
<iframe 
  src="https://[username].github.io/[repo-name]/" 
  width="100%" 
  height="2000px" 
  frameborder="0"
  style="border: none; overflow: hidden;">
</iframe>
```

### Option 2: Inline HTML/JS

1. Copy the entire contents of `index.html`, `styles.css`, and `script.js`
2. In Softr, add a **Custom Code** block
3. Paste the combined code (wrap CSS in `<style>` tags and JS in `<script>` tags)

**Note**: Option 1 is recommended as it's easier to maintain and update.

## ✨ Features

### Dynamic Pricing Toggle

- Toggle between "Bootcamp Only" and "Bootcamp + Weekly Check-ins"
- Real-time price updates with smooth animations
- Clear discount breakdown for both options

### Three Payment Plans

1. **One-time payment** - Full payment upfront
2. **2 monthly installments** - Spread over 2 months
3. **3 monthly installments** - Spread over 3 months (lowest monthly payment)

### Responsive Design

- Desktop: 3 cards side-by-side
- Tablet: Stacked layout
- Mobile: Optimized single-column view

### Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast ratios for text
- Focus indicators for interactive elements

## 🎯 Business Rules

### Base Bootcamp Pricing
- Regular Price: $3,750
- 1SM Student Price: $1,875 (50% off)
- Payment options: $1,875 one-time, $938/mo × 2, or $625/mo × 3

### With Weekly Check-ins
- Regular Price: $4,730 (bootcamp $3,750 + weekly $980)
- 1SM Student Price: $2,855 (bootcamp $1,875 + weekly $980)
- Total Savings: $1,875
- Payment options: $2,855 one-time, $1,428/mo × 2, or $952/mo × 3

## 🔒 Security

- All payments processed through Stripe
- No sensitive data stored or processed on this page
- Secure HTTPS connection required for production

## 📊 Analytics (Optional)

The script includes placeholder functions for analytics tracking. To enable:

1. Add your analytics script (Google Analytics, Mixpanel, etc.) to `index.html`
2. The `trackEvent()` function will automatically log events
3. CTA clicks are tracked with plan type and add-on status

## 🐛 Troubleshooting

### Prices not updating when toggling?
- Check browser console for JavaScript errors
- Ensure `data-plan` attributes match config keys
- Verify `data-role` attributes are present on all elements

### Styling looks broken?
- Make sure `styles.css` is in the same directory as `index.html`
- Check that the file path in the `<link>` tag is correct
- Clear browser cache and reload

### Toggle not working?
- Verify `script.js` is loaded (check browser console)
- Ensure the checkbox has `id="weekly-addon-toggle"`

## 🎨 Customization Tips

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-burgundy: #961a32;  /* Change this for different primary color */
    --gray-500: #6b7280;          /* Adjust secondary colors */
}
```

### Adding More Features to Cards

Edit the `features-list` in `index.html`. Use class `weekly-feature` for features that only show with add-on.

### Changing the "Most Popular" Ribbon

The middle card (2 monthly installments) has the ribbon by default. To change:
- Move class `plan-card-featured` to a different card
- Move the `<div class="ribbon">` element

## 📄 License

Proprietary - © 2025 1SM. All rights reserved.

## 📞 Support

Questions? Contact us at support@1sm.com

---

**Built with ❤️ for 1SM students**

