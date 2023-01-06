<template>
    <div>
      <h1>Training PAGE</h1>
      <!-- <h2>{{ trainingData.training }}</h2> -->
      <div v-if="trainingData" class="flex flex-wrap">
        <div v-for="train in trainingData" :key="train" :class="card"> 
          <h1 :class="cardTitle">{{train.training}} </h1>
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
    inject: ['card','cardTitle'],
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
  