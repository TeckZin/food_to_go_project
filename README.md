# Food To Go (FTG)

Live site: https://www.foodtogo.live/
Alternate: https://food-to-go-5706f.web.app/

---

## Overview

Food To Go is a full-stack web application designed for college students to browse, order, and manage pre-made meals.

It includes authentication, role-based permissions, item management, and order tracking.

---

## Tech Stack

- Vue 3 (`<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- GSAP (animations)
- Firebase (Auth, Firestore, Storage, Hosting)

---

## Features

### User Features
- Browse food items
- Add to cart
- Place orders
- Account management
- Email verification

### Admin / Manager Features
- Add items
- Edit items
- Delete items
- Role-based permissions

---

## Environment Variables

Create a `.env` file in the root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Restart dev server after updating env variables.

---

## Installation

```
npm install
```

---

## Development

```
npm run dev
```

---

## Production Build

```
npm run build
npm run preview
```

---

## Firebase Deployment

```
firebase login
npm run build
firebase deploy --only hosting
```

---

## Tailwind Setup

Ensure in your CSS:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Example config:

```
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

```
import { onMounted } from "vue"
import { gsap } from "gsap"

onMounted(() => {
  gsap.from(".hero", { opacity: 0, y: 20, duration: 0.6 })
})
```

---

## Project Structure

```
src/
├── assets/
│   ├── foodlogo-trans.png
│   ├── foodtogo.png
│   └── test_items/
│       └── cheese_burger.jpg
│
├── components/
│   ├── AboutComponent.vue
│   ├── AccountComponent.vue
│   ├── AccountSideComponent.vue
│   ├── AddItemCard.vue
│   ├── AddItemModal.vue
│   ├── AddToCartModal.vue
│   ├── EditAccountComponent.vue
│   ├── EditItemModal.vue
│   ├── NavBar.vue
│   ├── OrderAccountsComponent.vue
│   ├── RolePermissionComponent.vue
│   ├── SettingComponent.vue
│   └── UsersTableComponent.vue
│
├── helper/
│   ├── cartFunction.ts
│   ├── itemsFunction.ts
│   ├── orderFunction.ts
│   ├── roleFunction.ts
│   ├── rolesFunction.cjs
│   └── userFunction.ts
│
├── lib/
│   ├── authActions.ts
│   └── firebase.ts
│
├── router/
│   └── index.ts
│
├── views/
│   ├── AccountView.vue
│   ├── AuthView.vue
│   ├── ContactView.vue
│   ├── HomeView.vue
│   ├── NotFoundView.vue
│   ├── ShoppingCartView.vue
│   ├── StoreView.vue
│   └── VerifyRequired.vue
│
├── secrets/
│   └── serviceAccountKey.json
│
├── App.vue
├── main.ts
├── style.css
```

---

## Security Notes

- `secrets/serviceAccountKey.json` should NEVER be committed
- Add to `.gitignore`:

```
secrets/
.env
```

---

## Git Workflow

Always branch from `dev`:

```
git checkout dev
git pull origin dev
```

Create feature branch:

```
git checkout -b dt-123
```

Commit:

```
git add .
git commit -m "dt-123: description"
```

Push:

```
git push -u origin dt-123
```

Create PR:
- From: `dt-123`
- To: `dev` (NOT main)

---

## Notes

- Firebase Storage paths follow:
  `food-images/<category>/<item-id>.jpg`
- Only admins/managers can write data
- Public users have read access

---

## Future Improvements

- Payment integration
- Real-time order tracking
- Admin dashboard analytics
- Mobile responsiveness improvements



