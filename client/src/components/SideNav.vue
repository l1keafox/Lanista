<template>
  <br/>
  <h1  @click="$emit('changeMain','WelcomeMain')" class="cursor-pointer text-3xl text-center font-bold"> LANISTA </h1>
  <br/>
  <div v-if="!isLoggedIn" class = "flex flex-col">
    <button class="m-2 cursor-pointer sideOptions" @click="showLogin" :key="isLoggedIn"> Login </button>
    <button class="m-2 cursor-pointer sideOptions" @click="showCreateAcct" :key="isLoggedIn"> Create Account </button>
  </div>
  <div v-else>

    <div :class="smallCard"> 
      <template v-if="userData">
      <h2>Username:  {{ userData.username }}</h2>
      </template>
      <hr/>
      <div v-if="ownerData">
        <h2>GOLD: {{ ownerData.gold }}</h2>
        <h2>FAME: {{ ownerData.fame }}</h2>
      </div>
      <hr/>
  
    </div>
    <div class="m-2 cursor-pointer sideOptions" @click="doLogOut">Logout</div>
    <!-- <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','ProfileMain')" >Profile</div> -->
    <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','GladiatorsMain')" >Gladiators</div>
    <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','StructuresMain')" >School</div>
    <!-- <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','TrainingMain')" >Training</div> -->
    <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','CombatMain')" >Combat</div>
    <div class="m-2 cursor-pointer sideOptions" @click="$emit('changeMain','StoreMain')" >Store</div>
    
  </div>
  
  <div v-if="showLoginModal">
    <LoginVue id="vue" @close="closePopup" @trylogin="tryLogin" />
  </div>
  <div v-if="showCreateModal">
    <CreateAccount id="vue" @close="closePopup" @createAcct="createAcct" />
  </div>
  
</template>

<script>
import auth from "./../mixins/auth";

import LoginVue from "./LoginVue.vue";
import CreateAccount from "./CreateAccount.vue";

export default {
  name: "SideNav",
  inject: ["card", "cardTitle","smallCard"],
  data() {
    return {
      showLoginModal: false,
      ownerData: null,
      userData: auth.getUser(),
      showCreateModal: false,
      isLoggedIn: auth.loggedIn(),
    };
  },
  components: {
    LoginVue,
    CreateAccount
  },
  async mounted() {
    if(this.isLoggedIn){
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": auth.getUser()._id}),
        }      
    );
    let ownerData = await rpnse.json();
    this.ownerData =  ownerData;

      }
  },
  emits: ['logged','changeMain'],
  methods: {
    async doLogOut(){
        auth.logout();
        this.$emit('logged');
    },
    async createAcct({username,password,email}){
      console.log('trying create');
      if(!username || !password || !email){
        this.showCreateModal = false;
        return;
      }
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/users/createAcct`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "username": username, "password": password,"email":email }),
        }
      );     
      let det = await rpnse.json(); 
      if (rpnse.status === 200) {
        this.isLoggedIn = true;
        auth.login(det.token);
      } else {
        alert("Cannot Create Acct");
      }
      this.$emit('logged');
      this.showCreateModal = false;

    },

    async tryLogin({ username, password }) {
      if(!username || !password){
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
      this.showCreateModal = false;
    },
    showLogin() {
      this.showLoginModal = !this.showLoginModal;
      console.log(this.showLoginModal);
    },
    showCreateAcct() {
      this.showCreateModal = !this.showCreateModal;
      console.log(this.showLoginModal);
    },
  },
};
</script>

<style scoped>
#vue {
  opacity: 1;
}
.sideOptions{
  background-color: rgb(200, 200, 200);
  color: black;
  padding: 1rem;
}
</style>
