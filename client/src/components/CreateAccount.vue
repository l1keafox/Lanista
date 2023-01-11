<template>

    <div class="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal" >
      <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
          <div class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
            <div class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center">
              <div class="mb-8 flex justify-center">
                  <h1>Create Account</h1>
              </div>
              <div class="flex flex-col text-sm rounded-md">
                <input class="mb-2 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 " type="text" placeholder="Username" v-model="username"/>
                <input class="mb-2 border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500" type="email" placeholder="Email" v-model="email" />
                <input class="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500" type="password" placeholder="Password" v-model="password" />
              </div>
              <button @click="$emit('createAcct',{username,password,email})" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Create Account</button>
              <button @click="$emit('createAcct',{})" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Close</button>
              <div class="mt-5 flex justify-between text-sm text-gray-600">
              </div>
            </div>
          </div>
      </div>
  </div>      
  </template>

<script>
  export default {
      name:"CreateAccount",
      data(){
        return {
          username:"",
          email:"",
          password:""
        }
      },
  }
</script>

<style scoped>
</style>