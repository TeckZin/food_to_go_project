<script setup lang="ts">
import { ref } from "vue"

const name = ref("")
const email = ref("")
const subject = ref("")
const message = ref("")
const successMsg = ref("")
const errorMsg = ref("")

const inputClass =
  "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-white/40"

const btnClass =
  "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-white hover:bg-white/15"

function submitForm() {
  successMsg.value = ""
  errorMsg.value = ""

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    errorMsg.value = "Please fill out name, email, and message."
    return
  }

  successMsg.value = "Message sent successfully."
  name.value = ""
  email.value = ""
  subject.value = ""
  message.value = ""
}
</script>

<template>
  <main class="min-h-screen bg-[#272B34] px-6 py-10">
    <div class="mx-auto w-full max-w-2xl rounded-lg border border-white/10 bg-white/5 p-6">
      <h1 class="text-center text-5xl font-pragati text-white">CONTACT</h1>
      <p class="mt-3 text-center text-white/70">
        Send us a message and we’ll get back to you soon.
      </p>

      <div class="mt-8 space-y-4">
        <div>
          <label class="mb-1 block text-sm text-white/50">Name</label>
          <input v-model="name" type="text" placeholder="Your name" :class="inputClass" />
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/50">Email</label>
          <input v-model="email" type="email" placeholder="Your email" :class="inputClass" />
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/50">Subject</label>
          <input v-model="subject" type="text" placeholder="Subject" :class="inputClass" />
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

        <button :class="btnClass" @click="submitForm">
          Send Message
        </button>
      </div>
    </div>
  </main>
</template>
