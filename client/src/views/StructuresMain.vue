<template>
    <div>
      <h1>STRUCTUES PAGE</h1>
      <h2>{{ userData }}</h2>
      <div v-if="structureData">
        <div v-for="struct in structureData" :key="struct" class="h-80 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700"> 
          <h1 class="text-xl">{{struct.structure}} </h1>
          <hr/>
          <p> {{struct.description}}</p>
          <p> {{struct.training}} </p>
        </div>


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
        structureData: null,
      };
    },
    async mounted() {
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/owner/structuresData`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id}),
          }      
      );
      let structureData = await rpnse.json();
      this.structureData =  structureData;

    },
  };
  </script>
  
  <style scoped></style>
  