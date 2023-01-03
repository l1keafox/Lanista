<template>
  <div>
    <h1>PROFILE PAGE</h1>
    <h2>{{ userData }}</h2>
    <h2>{{ ownerData }}</h2>
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
    console.log(  this.userData._id );
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/users/owner`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id}),
        }      
    );
    let ditto = await rpnse.json();
    console.log("WHAT",ditto);
    this.ownerData =  ditto;
  },
};
</script>

<style scoped></style>
