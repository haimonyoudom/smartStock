# Task: Improve SmartStock Mobile Responsiveness

I want you to improve the responsive design of my existing SmartStock Vue.js application, especially for mobile devices.

I will provide a screenshot showing the current mobile layout. Use it as a reference to identify and fix the responsive issues.

## 1. Navigation
- Keep the current horizontal navigation menu on desktop.
- On mobile, replace the horizontal navigation links with a hamburger menu.
- When clicked, display a collapsible navigation menu.
- Keep the logo and account information accessible.
- Prevent horizontal scrolling in the navigation.

## 2. Products Page
The current products table is too wide for mobile screens.

On desktop:
- Keep the existing table layout and all columns.

On mobile:
- Hide less important columns, such as SKU.
- Keep important information visible: Product, Price, Stock, and Status.
- Replace the Edit and Activate text links with a three-dot action menu.
- Clicking the menu should show available actions.
- Alternatively, if a table is still difficult to use, consider a mobile product-card layout.

## 3. Search and Add Product
- On desktop, keep the search input and Add Product button beside each other.
- On mobile, stack them vertically.
- Make both controls fit the available screen width.
- Keep comfortable spacing and touch-friendly button sizes.

## 4. Other Responsive Improvements
- Adjust padding and margins for smaller screens.
- Reduce heading and text sizes only when necessary.
- Make cards stack vertically on mobile.
- Ensure forms, dropdowns, buttons and modals fit mobile screens.
- Prevent content from overflowing horizontally.

## 5. Technical Requirements
- Continue using the existing Vue.js architecture and Bootstrap.
- Use custom CSS media queries where Bootstrap utilities are insufficient.
- Follow a mobile-first responsive approach.
- Avoid unnecessary changes to the existing desktop design.
- Do not use `overflow-x: hidden` simply to hide horizontal scrolling. Fix the actual overflowing elements.
- Avoid duplicating components or business logic unnecessarily.
- Reuse existing components and Pinia stores.

## 6. Testing
Test the responsive layout at these viewport widths:
- 375px (small mobile)
- 390px (mobile)
- 768px (tablet)
- 1024px (small desktop)
- 1440px (desktop)

Verify that:
- The overall page has no unwanted horizontal scrolling.
- Navigation works correctly.
- Tables or product cards are usable on mobile.
- Buttons and menus remain accessible.
- Existing functionality is not broken.

## Important Instructions
Before making changes:
1. Inspect the existing project structure and components.
2. Identify the CSS and components responsible for the current layout.
3. Explain briefly what you plan to change.

Then implement the improvements.

Do not redesign the entire application. Preserve the existing SmartStock visual identity, colors, typography and functionality. Focus on making the mobile experience feel intentionally designed for smartphones rather than a compressed desktop layout.