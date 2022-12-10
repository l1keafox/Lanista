<template>
    <div class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center">
        <div class="mb-8 flex justify-center">
            <h1>Lanista</h1>
        </div>
        <div class="flex flex-col text-sm rounded-md">
          <input class="mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 " type="text" placeholder="Username or Email id" v-model="username"/>
          <input class="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500" type="password" placeholder="Password" v-model="password" />
        </div>
        <button @click="tryLogin" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Sign in</button>
        <div class="mt-5 flex justify-between text-sm text-gray-600">
          <a href="#">Forgot password?</a>
          <a href="#">Sign up</a>
        </div>
      </div>
    </template>

<script>
    export default {
        name:"LoginVue",
        data(){
          return {
            username:"",
            password:""
          }
        },
        methods:{
          async tryLogin(){
            console.log({username: this.username, password:this.password});
            console.log( process.env );
            const user = await fetch("/users/login",{
              method: 'POST', 
              body: JSON.stringify({username: this.username, password:this.password})
            });
            console.log(user);
          }
        }
    }
</script>

<style scoped>

</style>