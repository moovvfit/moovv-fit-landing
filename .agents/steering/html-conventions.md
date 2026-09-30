---
inclusion: auto
name: HTML Conventions
description: "HTML structure: semantic elements, accessibility, page templates."
---

# HTML Conventions

## 🏗️ Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | Moovv</title>
  <meta name="description" content="...">
  <!-- OG tags -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <nav>...</nav>
  </header>
  
  <main>
    <section id="hero">...</section>
    <section id="features">...</section>
    <!-- More sections -->
  </main>
  
  <footer>...</footer>
  
  <script src="js/main.js"></script>
</body>
</html>
```

## 🔤 Heading Hierarchy
Always maintain logical order:
```html
<h1>Page Title</h1>         <!-- One per page -->
  <h2>Section Title</h2>
    <h3>Subsection</h3>
      <h4>Detail</h4>
```

## ♿ Accessibility
```html
<!-- Images -->
<img src="..." alt="Descriptive text about the image">

<!-- Decorative images -->
<img src="..." alt="" role="presentation">

<!-- Links -->
<a href="..." aria-label="Learn more about features">Learn more</a>

<!-- Buttons -->
<button type="button" aria-expanded="false">Menu</button>

<!-- Skip link -->
<a href="#main" class="skip-link">Skip to main content</a>
```

## 📱 Responsive Images
```html
<img 
  src="image-800.jpg" 
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
  loading="lazy"
>
```

## 🔗 Navigation Pattern
```html
<nav aria-label="Main navigation">
  <a href="/" class="logo">
    <img src="images/Logo.svg" alt="Moovv">
  </a>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="/for-physios/">For Physios</a></li>
  </ul>
</nav>
```

## ⚠️ Avoid
- `<div>` when semantic element exists
- Empty `href="#"` — use buttons
- Missing `alt` attributes
- Skipping heading levels
