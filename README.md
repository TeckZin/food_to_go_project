# Food To Go (FTG)

Live site: https://www.foodtogo.live/ || https://food-to-go-5706f.web.app/

Food To Go is a web application for college students to browse and order pre-made meals.

Built with:
- Vue 3 (`<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- GSAP
- Firebase Hosting

---

## Environment Variables

Create a `.env` file in the root:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

Restart dev server after editing env variables.

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

## Tailwind Setup

Ensure:

@tailwind base;
@tailwind components;
@tailwind utilities;

In `tailwind.config`:

theme: {
  extend: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
  },
}

---

## GSAP

Install:

npm install gsap

Example:

import { onMounted } from "vue"
import gsap from "gsap"

onMounted(() => {
  gsap.from(".hero", { opacity: 0, y: 10, duration: 0.6 })
})

---

## Firebase Deploy

firebase login

npm run build

firebase deploy --only hosting

---

## Git Workflow

Always branch from dev.

git checkout dev
git pull origin dev

Create feature branch:

git checkout -b dt-123

Commit:

git add .
git commit -m "dt-123: description"

Push:

git push -u origin dt-123

Create PR:
dt-123 → dev (NOT main)

---

## Project Structure

src/ — app source
public/ — static assets
dist/ — production build output

