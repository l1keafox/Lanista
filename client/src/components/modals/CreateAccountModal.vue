<template>
  <BaseModal noClose="true">
    <template v-slot:header>
      <h1>Create Account</h1>
    </template>

    <template v-slot:content>
      <div role="alert" class="container mx-auto w-[100rem] max-w-lg">
          <div class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center">
            <div class="flex flex-col text-sm rounded-md">
              <input class="mb-2 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 " type="text" placeholder="Username" v-model="username"/>
              <input class="mb-2 border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500" type="email" placeholder="Email" v-model="email" />
              <input class="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500" type="password" placeholder="Password" v-model="password" />
            </div>
          </div>
      </div>
    </template>

    <template v-slot:footer >
      <button @click="$emit('createAcct',{username,password,email})" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Create Account</button>
      <button @click="$emit('createAcct',{})" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Close</button>
  </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
</script>

<style scoped>

</style>