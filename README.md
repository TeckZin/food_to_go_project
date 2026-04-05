# Food To Go (FTG)

Live site: https://www.foodtogo.live/
Alternate: https://food-to-go-5706f.web.app/

---

## Overview

Food To Go is a web application for college students to browse and order pre-made meals.
The app supports authentication, cart and order flows, item management, and role-based permissions for admin and manager users.

---

## Tech Stack

- Vue 3 (`<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- GSAP
- Firebase Auth
- Firebase Firestore
- Firebase Storage
- Firebase Hosting

---

## Features

### User Features
- Browse menu items
- Add items to cart
- Manage account information
- View orders
- Email verification during signup

### Admin / Manager Features
- Add new store items
- Edit item details
- Delete items
- Manage user roles and permissions

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Restart the dev server after editing environment variables.

---

## Install

```bash
npm install
```

---

## Development

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Firebase Deploy

```bash
firebase login
npm run build
firebase deploy --only hosting
```

---

## Tailwind Setup

Make sure your CSS includes:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Example theme extension:

```ts
theme: {
  extend: {
    fontFamily: {
      pragati: ["Pragati Narrow", "sans-serif"],
      jacques: ["Jacques Francois", "serif"],
      inter: ["Inter", "sans-serif"],
    },
    colors: {
      cream_yellow: "#DBCFB0",
      background: "#272B34",
    },
  },
}
```

---

## GSAP Example

```ts
import { onMounted } from "vue"
import { gsap } from "gsap"

onMounted(() => {
  gsap.from(".hero", { opacity: 0, y: 20, duration: 0.6 })
})
```

---

## Project Structure

```text
src/
├── App.vue
├── assets/
│   ├── foodlogo-trans.png
│   ├── foodtogo.png
│   ├── test_items/
│   │   └── cheese_burger.jpg
│   └── vue.svg
├── components/
│   ├── AboutComponent.vue
│   ├── AccountComponent.vue
│   ├── AccountSideComponent.vue
│   ├── AddItemCard.vue
│   ├── AddItemModal.vue
│   ├── AddToCartModal.vue
│   ├── EditAccountComponent.vue
│   ├── EditItemModal.vue
│   ├── nav.ts
│   ├── NavBar.vue
│   ├── OrderAccountsComponent.vue
│   ├── RolePermissionComponent.vue
│   ├── SettingComponent.vue
│   └── UsersTableComponent.vue
├── helper/
│   ├── cartFunction.ts
│   ├── itemsFunction.ts
│   ├── orderFunction.ts
│   ├── roleFunction.ts
│   ├── rolesFunction.cjs
│   └── userFunction.ts
├── lib/
│   ├── authActions.ts
│   └── firebase.ts
├── main.ts
├── router/
│   └── index.ts
├── secrets/
│   └── serviceAccountKey.json
├── style.css
└── views/
    ├── AccountView.vue
    ├── AuthView.vue
    ├── ContactView.vue
    ├── HomeView.vue
    ├── NotFoundView.vue
    ├── ShoppingCartView.vue
    ├── StoreView.vue
    └── VerifyRequired.vue
```

---

## File-by-File Breakdown

### `src/App.vue`
Root application component. It usually renders the router view and serves as the main shell for the app.

### `src/main.ts`
Application entry point. It creates the Vue app, registers plugins, loads global styles, and mounts the app.

### `src/style.css`
Global stylesheet. Used for shared styling, Tailwind imports, and any app-wide CSS rules.

---

## Assets

### `src/assets/foodlogo-trans.png`
Transparent version of the Food To Go logo used in the UI.

### `src/assets/foodtogo.png`
Main logo or branding image for the application.

### `src/assets/test_items/cheese_burger.jpg`
Sample food item image used for testing or placeholder content.

### `src/assets/vue.svg`
Default Vue asset, typically kept from the starter template or used as a small framework icon.

---

## Components

### `src/components/AboutComponent.vue`
Displays the About section content for the landing page or home page.

### `src/components/AccountComponent.vue`
Main account-related component, likely used to show user account information or account controls.

### `src/components/AccountSideComponent.vue`
Sidebar component for the account page. Usually contains profile info, navigation tabs, or quick account actions.

### `src/components/AddItemCard.vue`
Card component used to trigger item creation, often shown alongside store items for admin or manager users.

### `src/components/AddItemModal.vue`
Modal form for creating a new store item, including fields such as name, category, price, and image upload.

### `src/components/AddToCartModal.vue`
Modal used to add an item to the shopping cart, potentially including quantity or item-specific options.

### `src/components/EditAccountComponent.vue`
Form component for updating user profile/account details.

### `src/components/EditItemModal.vue`
Modal form for editing an existing store item and likely also deleting it.

### `src/components/nav.ts`
Helper or config file for navigation-related data, such as menu links or tab definitions.

### `src/components/NavBar.vue`
Top navigation bar for the site. Handles routing links, account access, and optional scrolling to sections like About.

### `src/components/OrderAccountsComponent.vue`
Account-page component for displaying user orders or order history.

### `src/components/RolePermissionComponent.vue`
Admin/manager component for viewing or updating user roles and permission settings.

### `src/components/SettingComponent.vue`
Settings UI for account preferences such as profile data, toggles, or display preferences.

### `src/components/UsersTableComponent.vue`
Table component for listing users, likely used in admin role management views.

---

## Helpers

### `src/helper/cartFunction.ts`
Contains cart-related logic such as adding items, removing items, updating quantities, or syncing cart data.

### `src/helper/itemsFunction.ts`
Contains item-related Firebase logic such as fetching, creating, editing, deleting, and uploading item data/images.

### `src/helper/orderFunction.ts`
Contains order-related functions such as creating orders, reading order history, or updating order status.

### `src/helper/roleFunction.ts`
Contains client-side role utilities, such as checking whether a user is an admin or manager.

### `src/helper/rolesFunction.cjs`
Node/CommonJS script used for role assignment, likely with Firebase Admin SDK and custom claims.

### `src/helper/userFunction.ts`
Contains user-related Firestore or profile functions such as reading and updating user records.

---

## Library / Firebase Setup

### `src/lib/authActions.ts`
Auth helper file containing reusable Firebase authentication actions such as login, signup, logout, and verification email flows.

### `src/lib/firebase.ts`
Firebase configuration and initialization file. Exports configured Firebase services such as Auth, Firestore, and Storage.

---

## Router

### `src/router/index.ts`
Defines all app routes and route guards, including protected routes and email-verification checks.

---

## Views

### `src/views/AccountView.vue`
Main account page view. Likely combines sidebar, profile editing, settings, and order history components.

### `src/views/AuthView.vue`
Authentication page for login and signup flows.

### `src/views/ContactView.vue`
Contact page view, currently likely a simple form or static contact section.

### `src/views/HomeView.vue`
Landing page view for the app. Typically includes the hero section, About section, and navigation.

### `src/views/NotFoundView.vue`
404 page shown when a route does not exist.

### `src/views/ShoppingCartView.vue`
Shopping cart page where users review selected items before ordering.

### `src/views/StoreView.vue`
Store or menu page where users browse available food items and admins/managers manage item cards.

### `src/views/VerifyRequired.vue`
Page shown to users who need to verify their email before accessing protected routes.

---

## Secrets

### `src/secrets/serviceAccountKey.json`
Firebase Admin service account key used for privileged server-side actions such as assigning roles.
This file is sensitive and should never be committed to version control.

---

## Security Notes

Add these to `.gitignore`:

```gitignore
secrets/
.env
dist/
node_modules/
```

Important:
- Do not expose `serviceAccountKey.json`
- Only use the service account on trusted local scripts or secure backend environments
- Keep Firebase client config in `.env`

---

## Firebase Notes

- Firebase Storage image paths follow this structure:

```text
food-images/<category>/<item-id>.jpg
```

- Public users can read allowed data
- Only admins/managers should have write access
- Email verification is required for protected user flows

---

## Git Workflow

Always branch from `dev`:

```bash
git checkout dev
git pull origin dev
```

Create a feature branch:

```bash
git checkout -b dt-123
```

Commit changes:

```bash
git add .
git commit -m "dt-123: description"
```

Push branch:

```bash
git push -u origin dt-123
```

Create a pull request:
- From: `dt-123`
- To: `dev`
- Do not open PRs directly into `main`

---

## Future Improvements

- Payment integration
- Real-time order tracking
- Better admin analytics dashboard
- Improved responsive design
- Stronger order status workflow

