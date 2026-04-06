# Food To Go (FTG)

Live Site
https://www.foodtogo.live/
https://food-to-go-5706f.web.app/

---

## Overview

Food To Go is a web application for college students to browse and order pre-made meals.

The system includes:
- Authentication with email verification
- Shopping cart and checkout flow
- Order confirmation page
- Admin/manager item management
- Role-based access control using Firebase custom claims

---

## Tech Stack

- Vue 3
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
- Checkout with structured address fields
- View order confirmation
- Email verification during signup

### Admin / Manager Features
- Add new store items
- Edit item details
- Delete items
- Manage user roles and permissions

---

## Checkout Flow

The checkout system includes:
- Structured address input:
  - Street
  - Apartment / Unit
  - City
  - State
  - Postal Code
  - Country
- Campus location input
- Map preview that updates based on address
- Order confirmation page after submission

Note:
Current implementation redirects to a confirmation page instead of writing to Firestore orders.

---

## Environment Variables

Create a `.env` file in the project root:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

Restart the dev server after editing environment variables.

---

## Install

npm install

---

## Development

npm run dev

---

## Production Build

npm run build
npm run preview

---

## Firebase Deploy

npm run build
firebase deploy --only hosting

---

## Project Structure

src/
├── components/
├── helper/
├── lib/
├── router/
├── views/
│   ├── CheckoutView.vue
│   ├── ConfirmView.vue
├── assets/
├── App.vue
├── main.ts

---

## Firebase Notes

- Roles are stored using Firebase custom claims
- Firestore stores user profile data
- Storage path format:

food-images/<category>/<item-id>.jpg

- Users must refresh token after role changes

---

## Security Notes

Add to `.gitignore`:

secrets/
.env
dist/
node_modules/

Do not expose service account keys.

---

## Future Improvements

- Enable Firestore order persistence
- Add payment integration
- Improve delivery tracking
- Add real-time order updates

