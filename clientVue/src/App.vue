<template>
  <LandingPage/>
</template>

<script>
import LandingPage from "./views/LandingPage";
export default {
  name: 'App',
  components: {
    LandingPage
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
