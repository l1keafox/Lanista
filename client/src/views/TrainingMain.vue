<template>
    <div>
      <h1>Training PAGE</h1>
      <!-- <h2>{{ trainingData.training }}</h2> -->
      <div v-if="trainingData" class="flex flex-wrap">
        <div v-for="train in trainingData" :key="train" class="h-80 aspect-[5/7] p-3 m-3 hover:bg-slate-200 cursor-default select-none flex flex-col bg-slate-700"> 
          <h1>{{train.name}} </h1>
          <hr/>
          <p> {{train.description}}</p>
        </div>
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
        trainingData: null,
      };
    },
    async mounted() {
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/owner/trainingData`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id}),
          }      
      );
      let trainingData = await rpnse.json();
      this.trainingData =  trainingData;

    },
  };
  </script>
  
  <style scoped></style>
  