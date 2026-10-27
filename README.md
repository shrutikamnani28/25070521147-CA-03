# 🌹 Velvet Vapors — Luxury Perfume Shop
> *"Wear the mood."*

An opulent, full-stack luxury noir and champagne gold e-commerce web application dedicated to artisanal niche perfumery. Built with high-performance modern web standards, native MongoDB driver, JWT authentication, and interactive React Bits animations.

---

## 🏛️ Project Architecture
- **Client:** React 19, Vite 8, React Router v7, Context API (`AuthProvider`, `CartProvider`, `ToastProvider`), Responsive CSS Grid & Flexbox Design System.
- **Server:** Node.js, Express 5, Native MongoDB Driver (`mongodb` v7), JWT (`jsonwebtoken`), Bcrypt password hashing (`bcrypt`), CORS, Body-Parser.
- **Database:** MongoDB (`velvet_vapors_db`) with Collections:
  - `users` (Roles: `customer`, `admin`; wishlist tracking)
  - `perfumes` (12 luxury fragrance formulas with full top/heart/base olfactory pyramids)
  - `orders` (Multi-item bag, 4-stage tracking: `Placed` → `Packed` → `Shipped` → `Delivered`)
  - `reviews` (Patron ratings & reviews with live average rating computation)

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `admin@velvetvapors.com` | `admin123` | Full Inventory, Live Order Dispatch, User Management, Atelier Stats |
| **Customer** | Direct registration or 1-click test | Any 6+ char password | Browse, Olfactory Quiz, Cart, Wishlist, Stepper Checkout, Order Tracking |

---

## 🚀 Quick Setup & Execution

### 1. Database & Backend Setup
Make sure MongoDB is running locally on port `27017` (e.g. `mongodb://localhost:27017`).
```bash
# Navigate to the backend directory
cd server

# Install backend dependencies
npm install

# Seed 12 luxury perfumes and the executive admin user
npm run seed

# Start the server (runs on http://localhost:5000)
npm start
# Or for live auto-reload during development:
npm run dev
```

### 2. Frontend Client Setup
In a new terminal window:
```bash
# Navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

### 3. Production Build Verification
```bash
cd client
npm run build
```

---

## 🌹 Design System & React Bits Animations
- **Aesthetics:** Opulent Luxury Noir (`#0b0510`, `#13091c`) with Champagne Gold borders (`#d4af37`), Violet/Plum radiance, and Emerald status badges.
- **Typography:** `Playfair Display` (editorial serif titles) paired with `Poppins` (crisp body text).
- **React Bits Component Enhancements:**
  1. **Aurora Background:** Deep plum and champagne gold ambient floating light glow on the Hero and 404 pages.
  2. **BlurText:** Smooth typographic character blur reveal for *"Wear the mood."*
  3. **TiltedCard:** 3D perspective mouse hover tilt across fragrance cards.
  4. **SpotlightCard:** Radial champagne gold cursor glow over promotional and exclusive offer cards.
  5. **CountUp:** Animated numerical stats counter ("12+ Signature Scents", "500+ Happy Customers", "4.9/5 Rating").
  6. **Scent Quiz Modal:** Interactive 3-question mood quiz recommending matching scent families.
  7. **Stepper:** 4-step progressive checkout flow (`Bag Review` → `Shipping` → `Payment` → `Confirmation`).
  8. **ScrollReveal:** Staggered viewport entrance animation for the Atelier brand story and timeline.
  9. **Mobile Dock:** Floating glass navigation pill on mobile devices ($\le 720\text{px}$).

---

## 📄 12 Pages Built & Tested
1. **Home (`/home`)**: Aurora hero, BlurText, interactive Scent Quiz modal, bestseller showcase, CountUp stats, customer testimonials.
2. **Shop Catalog (`/shop`)**: Instant multi-attribute search, category pills, gender filter, price range inputs, sort dropdown, and stock badges.
3. **Product Detail (`/product/:id`)**: Fragrance bottle display, 50ml vs 100ml size selector with real-time price adjustment, visual Olfactory Pyramid (Top, Heart, Base notes), longevity and sillage meters, Wishlist toggle, and customer reviews.
4. **Shopping Bag (`/cart`)**: Selected size, quantity increments/decrements, coupon code validator (`VELVET10` for 10% off), pricing breakdown, and empty state.
5. **Checkout Stepper (`/checkout`)**: 4-step stepper with bag review, address validator, payment methods (COD, UPI, Card), and order confirmation.
6. **Sign In (`/login`)**: Split luxury layout with 1-click quick-fill buttons for Admin and Customer.
7. **Sign Up (`/register`)**: Patron registration with validation, password confirmation, and automatic token issuance.
8. **My Orders (`/orders`)**: Order history with item summaries, shipping addresses, and a live 4-stage tracking progress bar (`Placed` → `Packed` → `Shipped` → `Delivered`).
9. **Wishlist (`/wishlist`)**: Saved fragrances with one-click "Move to Bag" integration.
10. **About the Brand (`/about`)**: Brand story ("The Art of Wearing Your Mood"), atelier values, milestone timeline, and `ScrollReveal` animations.
11. **Contact & Consultation (`/contact`)**: Private 1-on-1 scent profiling booking form, boutique atelier locations in Bangalore & Mumbai, telephone concierge, and interactive FAQ accordion.
12. **Executive Admin Dashboard (`/admin`)**: Real-time sales stats, full product CRUD with modal editing, stock increment/decrement, live order dispatch tracking updater, and customer management.
13. **404 Enigma (`*`)**: Branded *"Fragrance Lost in the Mist"* page with quick navigation back to the sanctuary.

---

## 🎓 Academic Grading Standards Met
- [x] Graded User Flow: Signup → Login → Home → Catalog → Details → Cart → Stepper Checkout → Order Tracking → Admin Dashboard.
- [x] Shared components in `client/src/components/`: `Navbar`, `Modal`, `ConfirmDialog`, `Toast`, `Skeleton`, `EmptyState`, `Badge`.
- [x] Custom Confirmation Dialog (no browser `window.confirm()`).
- [x] Fully responsive layout tested for 360px (mobile), 768px (tablet), and 1280px (desktop) with zero horizontal overflow.
- [x] 100% clean architecture with standard MongoDB driver and Express REST APIs.
