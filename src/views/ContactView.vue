<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import { createContactMessage } from "@/helper/contactFunction"

type ContactOption = {
  name: string
  role: string
  email: string
  isAll?: boolean
}

const name = ref("")
const email = ref("")
const subject = ref("")
const message = ref("")
const successMsg = ref("")
const errorMsg = ref("")

const COOLDOWN_SECONDS = 30
const cooldownSecondsLeft = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const contacts: ContactOption[] = [
  {
    name: "Teck Zin Tan",
    role: "Lead Engineer",
    email: "none",
  },
  {
    name: "Ryan Conlon",
    role: "Engineer",
    email: "none",
  },
  {
    name: "Thomas Do",
    role: "Engineer",
    email: "none",
  },
  {
    name: "All Engineers",
    role: "Team",
    email: "all",
    isAll: true,
  },
]

const selectedContact = ref<ContactOption>(contacts[0]!)
const inputClass =
  "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-white/40"

const btnClass =
  "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"

const canSubmit = computed(() => cooldownSecondsLeft.value === 0)

function selectContact(contact: ContactOption) {
  selectedContact.value = contact
  subject.value = contact.isAll
    ? "Message for All Engineers"
    : `Message for ${contact.name}`
}

function startCooldown() {
  cooldownSecondsLeft.value = COOLDOWN_SECONDS

  if (cooldownTimer) clearInterval(cooldownTimer)

  cooldownTimer = setInterval(() => {
    if (cooldownSecondsLeft.value <= 1) {
      cooldownSecondsLeft.value = 0
      if (cooldownTimer) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
      return
    }

    cooldownSecondsLeft.value -= 1
  }, 1000)
}

async function submitForm() {
  successMsg.value = ""
  errorMsg.value = ""

  if (!canSubmit.value) {
    errorMsg.value = `Please wait ${cooldownSecondsLeft.value}s before sending another message.`
    return
  }

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    errorMsg.value = "Please fill out name, email, and message."
    return
  }

  try {
    await createContactMessage({
      senderName: name.value.trim(),
      senderEmail: email.value.trim(),
      subject:
        subject.value.trim() ||
        (selectedContact.value.isAll
          ? "Message for All Engineers"
          : `Message for ${selectedContact.value.name}`),
      message: message.value.trim(),
      targetName: selectedContact.value.name,
      targetEmail: selectedContact.value.email,
      targetRole: selectedContact.value.role,
    })

    successMsg.value = selectedContact.value.isAll
      ? "Message for all engineers sent successfully."
      : `Message for ${selectedContact.value.name} sent successfully.`

    name.value = ""
    email.value = ""
    subject.value = ""
    message.value = ""
    startCooldown()
  } catch (error) {
    console.error("contact submit error:", error)
    errorMsg.value = "Failed to send message. Please try again."
  }
}

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<template>
  <main class="min-h-screen bg-[#272B34] px-4 pb-10 sm:px-6">
    <div class="mb-8 sm:mb-10">
      <NavBar class="w-full" />
    </div>

    <div
      class="mx-auto w-full max-w-3xl rounded-lg border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      <h1 class="text-center text-4xl font-pragati text-white sm:text-5xl">
        CONTACT
      </h1>

      <p class="mt-3 text-center text-sm text-white/70 sm:text-base">
        Send us a message and we’ll get back to you soon.
      </p>

      <div class="mt-8">
        <p class="mb-3 text-sm text-white/50">Contact a team member</p>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            v-for="contact in contacts"
            :key="contact.email + contact.name"
            type="button"
            @click="selectContact(contact)"
            class="rounded-lg border px-4 py-3 text-left transition"
            :class="
              selectedContact.email === contact.email &&
              selectedContact.name === contact.name
                ? 'border-cream_yellow bg-cream_yellow/10 text-white'
                : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
            "
          >
            <p class="font-inter text-base">{{ contact.name }}</p>
            <p class="text-sm text-white/50">{{ contact.role }}</p>
          </button>
        </div>

        <div
          class="mt-4 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
        >
          Sending to:
          <span class="font-medium text-white">{{ selectedContact.name }}</span>
          —
          <span>
            {{ selectedContact.isAll ? "All team members" : selectedContact.email }}
          </span>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <div>
          <label class="mb-1 block text-sm text-white/50">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Your name"
            :class="inputClass"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/50">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Your email"
            :class="inputClass"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/50">Subject</label>
          <input
            v-model="subject"
            type="text"
            placeholder="Subject"
            :class="inputClass"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/50">Message</label>
          <textarea
            v-model="message"
            rows="6"
            placeholder="Write your message here..."
            :class="inputClass"
          />
        </div>

        <p v-if="successMsg" class="text-sm text-green-300">
          {{ successMsg }}
        </p>

        <p v-if="errorMsg" class="text-sm text-red-300">
          {{ errorMsg }}
        </p>

        <button :class="btnClass" :disabled="!canSubmit" @click="submitForm">
          {{ canSubmit ? "Send Message" : `Please wait ${cooldownSecondsLeft}s` }}
        </button>
      </div>
    </div>
  </main>
</template>
