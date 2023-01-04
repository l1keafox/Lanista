<template>
  <div>
    <h1>PROFILE PAGE</h1>
    <h2>Username:  {{ userData.username }}</h2>
    <div v-if="ownerData">
      <h2>GOLD: {{ ownerData.gold }}</h2>
      <h2>FAME: {{ ownerData.fame }}</h2>
    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
  name: "ProfileMain",
  data() {
    return {
      userData: auth.getUser(),
      ownerData: null,
    };
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id}),
        }      
    );
    let ownerData = await rpnse.json();
    this.ownerData =  ownerData;
  },
};
</script>

<style scoped>
</style>
