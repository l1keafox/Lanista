<template>
  <BaseModal noClose="true">
    <template v-slot:header>
      <h1>Login To Lanista</h1>
    </template>

    <template v-slot:content>
      <div role="alert" class="container mx-auto w-[100rem] max-w-lg">
        <div
          class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center"
        >
          <div class="flex flex-col text-sm rounded-md">
            <input
              class="mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500"
              type="text"
              placeholder="Username"
              v-model="username"
            />
            <input
              class="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500"
              type="password"
              placeholder="Password"
              v-model="password"
            />
          </div>
          <div class="mt-5 flex justify-around text-sm text-gray-600 w-full">
            <a href="#">Forgot password?</a>
            <a href="#">Sign up</a>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex flex-col w-[100%]">
        <button
          @click="$emit('trylogin', { username, password })"
          class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300"
          type="submit"
        >
          Login
        </button>
        <button
          @click="$emit('trylogin', {})"
          class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300"
          type="submit"
        >
          Close
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup></script>

<style scoped></style>
