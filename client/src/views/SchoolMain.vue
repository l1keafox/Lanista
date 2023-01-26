<template>
    <div class = "w-full overflow-x-hidden">

      <div v-if="structureData" class ="flex overflow-x-auto">
        <div v-for="struct in structureData" :key="struct" :class="smallCard"> 
          <h1 :class="cardTitle">{{struct.structure}} </h1>
          <hr/>
          <p> {{struct.description}}</p>
          <p> {{struct.training}} </p>
        </div>
      </div>      
      <hr/>

      <div v-if="trainingData" class="flex overflow-x-auto">
        <div v-for="train in trainingData" :key="train" :class="smallCard"> 
          <h1 :class="cardTitle">{{train.training}} </h1>
          <hr/>
          <p> {{train.description}}</p>
        </div>
      </div>
      <hr/>
      <div v-if="learningData" class="flex overflow-x-auto">
        <div v-for="skill in learningData" :key="skill" :class="smallCard"> 
          <h1 :class="cardTitle">{{skill.learning}} </h1>
          <hr/>
          <p> {{skill.description}}</p>
          <p> learning speed: {{skill.learnSpeed}}</p>
        </div>
      </div>      
      <hr/>
      <div v-if="inventory" class="flex overflow-x-auto">
          <div v-for="item in inventory" :key="item" :class="smallCard"> 
            <h2 :class="cardTitle">{{ item.item }}</h2>
            <hr/>
            <h2>amount:{{ item.amount }}</h2>
            <h2>abilities:{{ item.abilities }}</h2>
            <h2>slot:{{ item.slot }}</h2>
            <h2>maintenance:{{ item.maintenance }}</h2>
          </div>
      </div>

    </div>
  </template>
  
  <script>
  import auth from "../mixins/auth";
  export default {
    name: "StructuresMain",
    data() {
      return {
        userData: auth.getUser(),
        structureData: null,
        trainingData: null,
        inventory:null,
        learningData:null

      };
    },
    inject: ['card','cardTitle','smallCard'],
    async mounted() {
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/owner/structuresData/${this.userData.ownerId}`,
        {
            headers: { "Content-Type": "application/json" },
          }      
      );
      this.structureData = await rpnse.json();

      const rpnse3 = await fetch(
        `http://${window.location.hostname}:3001/owner/trainingData`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id}),
          }      
      );
      let trainingData = await rpnse3.json();
      this.trainingData =  trainingData;


      const rpnse2 = await fetch(
        `http://${window.location.hostname}:3001/owner/learningData`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id}),
          }      
      );
      let learningData = await rpnse2.json();
      this.learningData =  learningData;
      const inventory = await fetch(
      `http://${window.location.hostname}:3001/owner/inventoryData`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id}),
        }      
    );
    this.inventory = await inventory.json();      
    },
  };
  </script>
  
  <style scoped></style>
  