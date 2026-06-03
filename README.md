<div align="center">

<img src="images/logo.png" alt="Furniro Logo" width="72" height="72">

# Furniro — Furniture E-Commerce Website

**A production-grade, fully responsive furniture e-commerce frontend**  
built with pure HTML5, Tailwind CSS, and Vanilla JavaScript ES6+

<br>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com)

<br>

[🌐 Live Demo](#) &nbsp;·&nbsp; [📐 Figma Design](https://www.figma.com/community/file/1263721389823616616/furniture-ecommerce-website-ui) &nbsp;·&nbsp; [🐛 Report a Bug](#) &nbsp;·&nbsp; [✨ Request Feature](#)

<br>

![Furniro Preview](https://via.placeholder.com/900x480/3A3A3A/B88E2F?text=Furniro+E-Commerce+Preview)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages](#-pages)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Design System](#-design-system)
- [JavaScript Architecture](#-javascript-architecture)
- [localStorage API](#-localstorage-api)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🪑 Overview

**Furniro** is a fully responsive, pixel-perfect furniture e-commerce frontend inspired by a professional Figma community design. Built entirely with **semantic HTML5**, a **custom Tailwind CSS** design system, and **zero frameworks** on the JavaScript side, it demonstrates production-level frontend engineering without the overhead of React or Vue.

The project was developed as part of an intensive full-stack training program at the **Information Technology Institute (ITI)**, covering real-world UI patterns including dynamic product rendering, client-side filtering, cart state management, live search, and product comparison — all wired to a `products.json` data source.

> **Why Furniro stands out:** Every interactive feature — search, cart, wishlist, comparison — is built from scratch using modern Vanilla JS (ES6+ modules, `fetch`, `localStorage`, `MutationObserver`, custom events), proving deep browser-API knowledge without framework dependency.

---

## ✨ Features

### 🛍️ Core Shopping Experience
- **Dynamic Product Rendering** — Products loaded asynchronously from `products.json` via the Fetch API and injected into the DOM
- **Category Filtering** — Client-side filter bar on the Shop page (All, Sofa, Beds, Chairs, etc.) with smooth transitions
- **Pagination** — "Show More" pagination controls with configurable page size
- **Product Detail Page** — Dynamic routing via URL query params (`product.html?id=X`) with image gallery, size picker, quantity controls, and add-to-cart
- **Shopping Cart** — Full cart management: add, remove, update quantity, subtotal calculation, localStorage persistence

### 🔍 Search
- **Live Search Overlay** — Slide-down search panel activated from any page's navbar
- **Real-time Filtering** — Debounced (220ms) client-side search across product name, category, and description
- **Smart Results** — Up to 8 results shown as interactive cards; overflow redirects to Shop with query preserved
- **Keyboard Accessible** — `Escape` to close, autofocus on open

### ⚖️ Product Comparison
- **Compare Bar** — Persistent fixed bottom bar that appears when 1+ products are queued
- **Up to 3 Products** — Side-by-side visual and specification comparison
- **Spec Table** — Compares: Price, Rating, Category, Discount, Availability, Warranty, Material, Dimensions, Description
- **"Best" Badges** — Automatically highlights winning values (lowest price, highest rating) across columns
- **localStorage Persistence** — Compare list survives page navigation

### ♥ Wishlist
- **Heart Toggle** — Like/unlike products from any card on any page
- **Persistent State** — Wishlist stored in `localStorage` and restored on every page load
- **Visual Feedback** — Filled/outlined heart icon state synced across navigation

### 🎨 UI/UX Enhancements
- **Scroll-to-Top Button** — Smooth-scroll FAB appears after 450px scroll depth
- **Toast Notifications** — Non-blocking feedback for cart, wishlist, and comparison actions
- **Responsive Design** — Mobile-first layouts across all 7 pages (320px → 1440px+)
- **Hover Animations** — Card overlays, image zoom, button transitions throughout

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Markup** | HTML5 (Semantic) | Page structure, accessibility, SEO |
| **Styling** | Tailwind CSS v3 (compiled) | Utility-first design system + custom components |
| **Interactivity** | Vanilla JavaScript ES6+ | All dynamic behavior — no frameworks |
| **Data** | JSON (`products.json`) | Product data source (simulated API) |
| **Icons** | Font Awesome 6.5 | UI iconography |
| **Typography** | Google Fonts — Montserrat, Playfair Display | Brand typography system |
| **Persistence** | Web Storage API (`localStorage`) | Cart, wishlist, compare list |
| **Build** | Tailwind CLI | CSS compilation from `style.css` → `output.css` |

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero banner, featured products grid, promo section, room inspiration gallery |
| **Shop** | `shop.html` | Full product catalogue with category filter, sort, and pagination |
| **Product Detail** | `product.html` | Individual product view — gallery, specs, size picker, add to cart |
| **Shopping Cart** | `cart.html` | Cart summary, quantity controls, subtotal, checkout CTA |
| **Compare** | `compare.html` | Side-by-side product spec comparison table (up to 3 items) |
| **About Us** | `about.html` | Brand story, stats, core values, founders, why-choose-us |
| **Contact** | `contact.html` | Contact form with validation, map, business info |

---

## 🗂️ Project Structure

```
furniro/
│
├── index.html               # Home page
├── shop.html                # Shop / catalogue page
├── product.html             # Product detail page
├── cart.html                # Shopping cart page
├── compare.html             # Product comparison page
├── about.html               # About Us page
├── contact.html             # Contact page
│
├── script.js                # Core JS — product rendering, cart, filters, routing
├── furniro-extras.js        # Enhancement layer — search, compare, wishlist, scroll-top
│
├── products.json            # Product data (id, name, price, category, rating, image…)
│
├── style.css                # Tailwind source — @layer components, custom classes
├── output.css               # Compiled CSS (do not edit directly)
├── tailwind.config.js       # Tailwind config — custom colors, fonts, extensions
│
└── images/
    ├── logo.png
    ├── header.png
    ├── page-header.jpg
    ├── gallery/             # Room inspiration images
    │   ├── Rectangle 36.png
    │   ├── Rectangle 38.png
    │   ├── Rectangle 39.png
    │   └── Rectangle 40.png
    ├── services/            # Service strip icons
    │   ├── trophy 1.png
    │   ├── guarantee.png
    │   ├── shipping.png
    │   └── customer-support.png
    └── products/            # Product photography
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+ (for Tailwind CLI)
- A local web server (VS Code Live Server, `npx serve`, or any static server)
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/nadakhalifa183/furniro.git
cd furniro
```

**2. Install Tailwind CLI**
```bash
npm install
```

**3. Compile Tailwind CSS**

For one-time build:
```bash
npx tailwindcss -i ./style.css -o ./output.css --minify
```

For watch mode during development:
```bash
npx tailwindcss -i ./style.css -o ./output.css --watch
```

**4. Start a local development server**

Using VS Code Live Server (recommended): right-click `index.html` → *Open with Live Server*

Or using Node:
```bash
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ **Important:** The project must be served from a local server (not opened as a `file://` URL) because product data is loaded via `fetch('products.json')`, which requires HTTP.

---

## 🎨 Design System

Furniro uses a custom Tailwind theme defined in `tailwind.config.js`:

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#B88E2F` | Gold accent — CTAs, highlights, icons, borders |
| `primary-grey` | `#333333` | Primary dark text |
| `primary-grey-light` | `#666666` | Body text, secondary labels |
| `primary-grey-light-pro` | `#9F9F9F` | Placeholder text, muted elements |
| `primary-light` | `#F4F5F7` | Page backgrounds, section fills |
| `primary-beige` | `#F9F1E7` | Card backgrounds, hover fills |
| `primary-red` | `#eb6f72` | Discount badges, error states |

### Typography

| Role | Font | Weight |
|------|------|--------|
| **Display / Headings** | Playfair Display | 600, 700 |
| **Body / UI** | Montserrat | 400, 500, 600, 700, 800 |

### Spacing & Breakpoints
Tailwind's default spacing scale is used throughout. The layout is mobile-first with primary breakpoints at `sm` (640px), `md` (768px), `lg` (1024px), and `xl` (1280px).

---

## ⚙️ JavaScript Architecture

The JS layer is split into two files for clean separation of concerns:

### `script.js` — Core Application
```
├── Product Data Layer
│   ├── fetchProducts()        — loads products.json
│   ├── allProducts[]          — global product cache
│   └── filteredProducts[]     — category/search filtered subset
│
├── Rendering
│   ├── renderProducts()       — injects product cards into #products-grid
│   ├── renderProductCard()    — builds individual card HTML
│   └── renderPagination()     — show more / page controls
│
├── Cart Module
│   ├── addToCart(id, qty)     — adds item, syncs to localStorage
│   ├── removeFromCart(id)     — removes item
│   ├── updateCartBadge()      — syncs navbar counter
│   └── renderCartPage()       — full cart page render
│
├── Product Detail
│   ├── loadProductDetail()    — reads ?id= from URL, renders page
│   └── initGallery()          — image switching
│
└── Filters & Events
    ├── initCategoryFilter()   — binds filter pill clicks
    └── initSortSelect()       — price/name sort
```

### `furniro-extras.js` — Enhancement Layer
```
├── Search Overlay
│   ├── initSearch()           — injects overlay DOM + CSS
│   ├── openSearch()           — activates panel
│   ├── closeSearch()          — deactivates + clears
│   └── doSearch(query)        — async filter + render results
│
├── Product Comparison
│   ├── initCompare()          — injects compare bar DOM + CSS
│   ├── addToCompare(id)       — toggle product in/out of list
│   ├── _refreshCompare()      — re-renders bar slots
│   ├── _injectComparePills()  — adds Compare buttons to cards
│   └── _highlightPills()      — syncs active state on pills
│
├── Wishlist
│   ├── initWishlist()         — observes product grid
│   └── _restoreWishlist()     — re-applies liked state from localStorage
│
└── Scroll-to-Top
    └── initScrollTop()        — injects FAB + scroll listener
```

All features in `furniro-extras.js` are fully **self-contained**: they inject their own DOM and styles, require no changes to existing HTML, and boot automatically on `DOMContentLoaded`.

---

## 💾 localStorage API

The project uses three `localStorage` keys:

| Key | Type | Contents |
|-----|------|----------|
| `furniroCart` | `Array<{id, qty}>` | Cart items with quantities |
| `furniroWishlist` | `Array<number>` | IDs of liked products |
| `furniroCompare` | `Array<number>` | IDs of products queued for comparison (max 3) |

All keys are namespaced with the `furniro` prefix to avoid collisions with other projects on the same origin.

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <strong>🏠 Home Page</strong><br>
      <img src="https://via.placeholder.com/420x260/F9F1E7/B88E2F?text=Home+Page" alt="Home Page" width="420">
    </td>
    <td align="center">
      <strong>🛍️ Shop Page</strong><br>
      <img src="https://via.placeholder.com/420x260/F4F5F7/3A3A3A?text=Shop+Page" alt="Shop Page" width="420">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>📦 Product Detail</strong><br>
      <img src="https://via.placeholder.com/420x260/FFFFFF/B88E2F?text=Product+Detail" alt="Product Detail" width="420">
    </td>
    <td align="center">
      <strong>🛒 Shopping Cart</strong><br>
      <img src="https://via.placeholder.com/420x260/F4F5F7/3A3A3A?text=Shopping+Cart" alt="Shopping Cart" width="420">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>⚖️ Product Compare</strong><br>
      <img src="https://via.placeholder.com/420x260/3A3A3A/B88E2F?text=Compare+Page" alt="Compare Page" width="420">
    </td>
    <td align="center">
      <strong>🏢 About Us</strong><br>
      <img src="https://via.placeholder.com/420x260/F9F1E7/3A3A3A?text=About+Page" alt="About Page" width="420">
    </td>
  </tr>
</table>

> 💡 Replace the placeholder images above with real screenshots of your project for maximum CV impact.

---

## 🗺️ Roadmap

Future improvements planned for this project:

- [ ] **Backend Integration** — Connect to a real REST API (ASP.NET Core Web API)
- [ ] **User Authentication** — Login/register with JWT, persisted wishlist per user
- [ ] **Checkout Flow** — Multi-step checkout with address, payment (Stripe API)
- [ ] **Product Reviews** — Star rating + text reviews with optimistic UI updates
- [ ] **Admin Dashboard** — CRUD interface for products, orders, and customers
- [ ] **Progressive Web App** — Service worker + offline support + installable
- [ ] **Accessibility Audit** — Full WCAG 2.1 AA compliance pass
- [ ] **Performance** — Image lazy-loading, Critical CSS, `preload` for LCP assets

---

## 👩‍💻 Author

<div align="center">

<img src="https://via.placeholder.com/100/B88E2F/FFFFFF?text=NK" alt="Nada Khalifa" width="100" style="border-radius:50%">

### Nada Elsayed Khalifa

**Full-Stack .NET Developer & Generative AI Engineer**

*Trainee at Information Technology Institute (ITI) — ICC Program*  
*B.Sc. Computers and Information — Menofia University*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/nada-khalifa-75a487291)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nadakhalifa183)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nadakhalifa2402@gmail.com)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

The UI design is based on the [Furniture E-Commerce Website UI](https://www.figma.com/community/file/1263721389823616616/furniture-ecommerce-website-ui) Figma community file, used for educational purposes.

---

<div align="center">

Made with ♥ and a lot of ☕ &nbsp;|&nbsp; **Furniro** © 2024

⭐ **Star this repo** if you found it useful!

</div>
