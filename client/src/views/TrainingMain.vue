<template>
    <div>
      <h1>Training PAGE</h1>
      <div v-if="ownerData">
        <h2>{{ ownerData.training }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  import auth from "./../mixins/auth";
  export default {
    name: "TrainingMain",
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
  
  <style scoped></style>
  