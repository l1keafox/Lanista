<template>
    <div>
      <h1>STRUCTUES PAGE</h1>
      <h2>{{ userData }}</h2>
      <div v-if="ownerData">
        <h2>{{ ownerData.structures }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  import auth from "./../mixins/auth";
  export default {
    name: "StructuresMain",
    data() {
      return {
        userData: auth.getUser(),
        ownerData: null,
      };
    },
    async mounted() {
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/users/owner`,
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
  
  <style scoped></style>
  