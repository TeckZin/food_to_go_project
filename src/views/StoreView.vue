<script setup lang="ts">
import { onMounted } from "vue"
import { gsap } from "gsap"
import NavBar from "@/components/NavBar.vue"
import cheeseBurger from "@/assets/test_items/cheese_burger.jpg"

onMounted(() => {
  gsap.from(".store-card", {
    opacity: 0,
    y: 60,
    scale: 0.85,
    duration: 0.6,
    ease: "back.out(1.7)",
    stagger: 0.15,
  })
})

const ItemTag = {
  BEST_SELLING: "best_selling",
  POPULAR: "popular",
  NEW: "new",
  HOT: "hot",
} as const

const ItemCategory = {
  BURGERS: "burgers",
  SANDWICHES: "sandwiches",
  SIDES: "sides",
  DRINKS: "drinks",
  PIZZA: "pizza",
  DESSERT: "dessert",
} as const

type ItemTag = (typeof ItemTag)[keyof typeof ItemTag]
type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory]

type StoreItem = {
  id: string
  name: string
  category: ItemCategory
  description: string
  price: number
  image_url: string
  calories: number
  qty: number
  old_price?: number
  tag?: ItemTag
}

const items: StoreItem[] = [
  {
    id: "test-1",
    name: "Classic Burger",
    category: ItemCategory.BURGERS,
    description: "Juicy grilled beef patty with lettuce, tomato, and house sauce.",
    price: 8.99,
    old_price: 10.99,
    image_url: cheeseBurger,
    calories: 650,
    qty: 1,
    tag: ItemTag.BEST_SELLING,
  },
  {
    id: "test-2",
    name: "Crispy Chicken Sandwich",
    category: ItemCategory.SANDWICHES,
    description: "Crispy fried chicken with pickles and spicy mayo on a toasted bun.",
    price: 9.49,
    old_price: 11.49,
    image_url: "https://placehold.co/500x500/png?text=Chicken",
    calories: 720,
    qty: 1,
    tag: ItemTag.POPULAR,
  },
  {
    id: "test-3",
    name: "Loaded Fries",
    category: ItemCategory.SIDES,
    description: "Golden fries topped with cheese sauce, bacon bits, and scallions.",
    price: 5.99,
    old_price: 7.49,
    image_url: "https://placehold.co/500x500/png?text=Fries",
    calories: 540,
    qty: 1,
    tag: ItemTag.POPULAR,
  },
  {
    id: "test-4",
    name: "Iced Matcha Latte",
    category: ItemCategory.DRINKS,
    description: "Smooth iced matcha with milk, lightly sweetened and refreshing.",
    price: 4.99,
    old_price: 5.99,
    image_url: "https://placehold.co/500x500/png?text=Matcha",
    calories: 180,
    qty: 1,
    tag: ItemTag.NEW,
  },
  {
    id: "test-5",
    name: "Pepperoni Pizza Slice",
    category: ItemCategory.PIZZA,
    description: "Hot oversized slice with pepperoni, mozzarella, and rich tomato sauce.",
    price: 4.5,
    old_price: 5.5,
    image_url: "https://placehold.co/500x500/png?text=Pizza",
    calories: 430,
    qty: 1,
    tag: ItemTag.HOT,
  },
  {
    id: "test-6",
    name: "Chocolate Brownie",
    category: ItemCategory.DESSERT,
    description: "Rich chocolate brownie with a soft center and crisp top.",
    price: 3.75,
    old_price: 4.5,
    image_url: "https://placehold.co/500x500/png?text=Brownie",
    calories: 320,
    qty: 1,
  },
]
</script>

<template>
  <div class="min-h-screen w-full bg-[#272B34] text-white">
    <section class="mx-auto w-full max-w-[1600px] px-6 py-10 md:px-10">
      <div class="mb-10">
        <NavBar class="w-full" />
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <article
          v-for="item in items"
          :key="item.id"
          class="store-card overflow-hidden rounded-[2rem] border border-white/10 bg-[#1F232B] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <div class="relative border-b border-white/10 bg-[#303642] px-6 py-6">
            <div
              v-if="item.tag"
              class="absolute left-5 top-5 rounded-full border border-[#DBCFB0]/60 px-3 py-1 font-inter text-xs font-semibold tracking-wide text-[#DBCFB0]"
            >
              {{ item.tag }}
            </div>

            <div class="flex min-h-[320px] items-center justify-center pt-10">
              <img
                :src="item.image_url"
                :alt="item.name"
                class="h-[240px] w-[240px] rounded-[1.5rem] object-cover shadow-lg"
              />
            </div>
          </div>

          <div class="px-6 py-6">
            <p class="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-[#DBCFB0]">
              {{ item.category }}
            </p>

            <h2 class="mt-3 font-inter text-3xl font-bold text-white">
              {{ item.name }}
            </h2>

            <p class="mt-3 min-h-[72px] font-inter text-base leading-7 text-white/70">
              {{ item.description }}
            </p>

            <p class="mt-2 font-inter text-sm text-white/50">
              {{ item.calories }} cal · Qty: {{ item.qty }}
            </p>

            <div class="mt-5 flex items-center gap-3 font-inter">
              <span
                v-if="item.old_price"
                class="text-2xl font-semibold text-white/35 line-through"
              >
                ${{ item.old_price.toFixed(2) }}
              </span>
              <span class="text-3xl font-bold text-[#DBCFB0]">
                ${{ item.price.toFixed(2) }}
              </span>
            </div>

            <button
              class="mt-6 w-full rounded-full bg-[#DBCFB0] px-6 py-4 font-inter text-sm font-extrabold uppercase tracking-[0.18em] text-[#272B34] transition hover:scale-[1.01]"
            >
              Order Now
            </button>

            <p
              class="mt-4 text-center font-inter text-sm font-medium uppercase tracking-wide text-white/50"
            >
              Fast pickup on campus
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
