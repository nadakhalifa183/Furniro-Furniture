<div align="center">
<img src="images/logo.png" alt="Furniro Logo" width="72" height="72">

# Furniro — Furniture E-Commerce Website
A fully responsive, modern furniture e-commerce frontend.

*Built using pure HTML5, Tailwind CSS, and Vanilla JavaScript (ES6+)*

<br>

🌐 [Live Demo](https://nadakhalifa183.github.io/Furniro-Furniture/) · 📐 [Figma Design]([https://www.figma.com/](https://www.figma.com/design/PAj8TZ0SSH6Lg4Csvj1BY4/Furniture-eCommerce-Website-UI--Community-?node-id=1-3&p=f&t=id3P5BlhoO0evVDR-0)) · 🐛 [Report a Bug](https://github.com/nadakhalifa183/furniro/issues)

<br>

</div>

---

## 🪑 Overview
Furniro is a pixel-perfect, mobile-friendly furniture store website inspired by a professional Figma design. It was built from scratch without using heavy frameworks like React or Vue to demonstrate strong core web development skills. 

This project was developed during training at the **Information Technology Institute (ITI)** to practice building real-world user interfaces, dynamic product filtering, shopping carts, and comparison tools using a local product database (`products.json`).

---

## ✨ Features

* **🛍️ Dynamic Shopping** — Products are loaded instantly from a JSON file. Users can view individual item details by clicking on them.
* **🔍 Live Search Overlay** — A responsive, real-time search bar accessible from any page.
* **🛒 Full Shopping Cart** — Add items, change quantities, view real-time price totals, and remove products. 
* **⚖️ Product Comparison** — Compare up to 3 products side-by-side on a clean specification table that automatically highlights the lowest price and highest rating.
* **💾 Persistent Storage** — Your cart, wishlist, and comparison choices are safely saved using the browser's `localStorage` so they don't disappear when you refresh the page.
* **📱 100% Responsive** — Perfectly optimized for all screens, from small smartphones to large desktops.

---

## 🗂️ Project Structure

```text
furniro/
├── index.html               # Home Page
├── shop.html                # Shop Catalog Page
├── product.html             # Product Details Page
├── cart.html                # Shopping Cart Page
├── compare.html             # Product Comparison Page
├── about.html               # About Us Page
├── contact.html             # Contact Page
├── script.js                # Core logic (Products, Cart, Filters)
├── furniro-extras.js        # UI features (Search, Wishlist, Compare)
├── products.json            # Product database
├── style.css                # Tailwind CSS source file
├── output.css               # Final compiled CSS
└── images/                  # Project graphics and product photos
