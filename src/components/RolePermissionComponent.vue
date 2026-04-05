<script setup lang="ts">
defineProps<{
  currentRole: string
  canViewUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAssignRoles: boolean
  canResetPasswords: boolean
}>()

</script>

<template>
  <div class="space-y-4 text-white">
    <h2 class="text-3xl font-pragati">Role &amp; Permissions</h2>
    <p class="text-white/70">Your current access level and permissions.</p>

    <div class="space-y-3">
      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">Current Role</p>
            <p class="text-white/60">Assigned from Firebase custom claims</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ currentRole || "none" }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">View Users</p>
            <p class="text-white/60">See all users in the system</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ canViewUsers ? "Allowed" : "Not allowed" }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">Edit Users</p>
            <p class="text-white/60">Modify other user account details</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ canEditUsers ? "Allowed" : "Not allowed" }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">Delete Users</p>
            <p class="text-white/60">Remove users from the system</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ canDeleteUsers ? "Allowed" : "Not allowed" }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">Assign Roles</p>
            <p class="text-white/60">Set customer, manager, or admin roles</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ canAssignRoles ? "Allowed" : "Not allowed" }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-md border border-white/10 bg-white/5 p-4">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-medium">Reset Passwords</p>
            <p class="text-white/60">Reset passwords for other users</p>
          </div>

          <div class="text-left md:text-right">
            <p>{{ canResetPasswords ? "Allowed" : "Not allowed" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
