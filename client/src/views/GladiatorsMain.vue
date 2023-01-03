<template>
  <div>
    <h1>Gladiators</h1>
    <div  v-if="ownerData"  > 
        <div v-for="glad in ownerData.gladiators" :key="glad.name"> 
            <h2>{{glad.name}} </h2>
        <h2>{{glad.hits}} </h2>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
    
  name: "GladiatorMain",
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
        body: JSON.stringify({ "id": this.userData._id }),
      }
    );
    let ownerData = await rpnse.json();
    this.ownerData = ownerData;
  },
};
</script>

<style scoped></style>
