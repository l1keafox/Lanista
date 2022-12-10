<template>
  <div v-if="this.isLoggedIn">
  </div>
  <div v-else>
    <LandingPage/>
  </div>
</template>

<script>
import LandingPage from "./views/LandingPage";
export default {
  name: 'App',
  components: {
    LandingPage
  },
  data(){
    return {
      isLoggedIn: false
    }
  },
  provide(){
    return{
      isLoggedIn:this.isLoggedIn
    }
  }
}
</script>

<style>
body{
  background-color: rgb(30, 30, 30);
  height: 100vh;
  width: 100vw;
  }
  #app{
    height: 100%;
    width: 100%;
    }
</style>
