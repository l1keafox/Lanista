<template>
  <MainViewVue/>
</template>

<script>
import MainViewVue from "./views/MainView.vue";

export default {
  name: 'App',
  components: {
    MainViewVue
  },
  data(){
    return {
    }
  },
  mounted(){
  },
  provide(){
    return{
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
    height: 100vh;
    width: 100vw;
  }
</style>
