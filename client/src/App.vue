<template>
  <div class="flex h-full ">
    <!-- -->
    <div class="bg-blue-900 w-48"> 
        <SideNav @logged="update"/>
    </div>
    <div class="bg-slate-900 grow "> 
      <WelcomeMain/>
    </div>
  </div>

</template>

<script>
import WelcomeMain from "./views/WelcomeMain.vue";
import SideNav from '@/components/SideNav.vue';
import auth from "./mixins/auth";

export default {
  name: 'App',
  components: {
    SideNav,
    WelcomeMain
  },
  data(){
    return {
      isLoggedIn: auth.loggedIn()
    }
  },
  methods:{
            update(){
                this.isLoggedIn = auth.loggedIn();
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
  color:rgb(200, 200, 200)
  }
  #app{
    height: 100vh;
    width: 100vw;
  }
</style>
