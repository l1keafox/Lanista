<template>
  <h1  @click="$emit('changeMain','WelcomeMain')"> LANISTA </h1>
  <div v-if="!isLoggedIn" class="m-2" @click="showLogin" :key="isLoggedIn">
    Login
  </div>
  <div v-else>
    <div class="m-2" @click="doLogOut">Logout</div>
    <div class="m-2" @click="$emit('changeMain','ProfileMain')" >Profile</div>
  </div>
  
  
  
  <div v-if="showLoginModal">
    <LoginVue id="vue" @close="closePopup" @trylogin="tryLogin" />
  </div>
</template>

<script>
import auth from "./../mixins/auth";

import LoginVue from "./LoginVue.vue";
export default {
  name: "SideNav",
  data() {
    return {
      showLoginModal: false,
      isLoggedIn: auth.loggedIn(),
    };
  },
  components: {
    LoginVue,
  },
  mounted() {},
  emits: ['logged'],
  methods: {
    async doLogOut(){
        auth.logout();
        this.$emit('logged');
    },
    

    async tryLogin({ username, password }) {
      if(!username && !username){
        this.showLoginModal = false;
        return;
      }
      console.log("Trying login", username, password);
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "username": username, "password": password }),
        }
      );
      let det = await rpnse.json();
      if (rpnse.status === 200) {
        this.isLoggedIn = true;
        auth.login(det.token);
      } else {
        alert("Cannot login");
      }
      this.$emit('logged');
      this.showLoginModal = false;
    },
    closePopup() {
      this.showLoginModal = false;
    },
    showLogin() {
      this.showLoginModal = !this.showLoginModal;
      console.log(this.showLoginModal);
    },
  },
};
</script>

<style scoped>
#vue {
  opacity: 1;
}
</style>
