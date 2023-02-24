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
        <div v-for="train in trainingData" :key="train" :class="smallCard" class="flex justify-between"> 
          <h1 :class="cardTitle">{{train.training}} <hr/> </h1>
          
          <p> {{train.description}}</p>
          <button class="bg-red-500 text-black"> disable</button>
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
    inject: ['card','cardTitle','smallCard','apiCall'],
    async mounted() {
      const rpnse = await fetch(
        this.apiCall.value +
        `/owner/structuresData/${this.userData.ownerId}`,
        {
            headers: { "Content-Type": "application/json" },
          }      
      );
      this.structureData = await rpnse.json();

      const rpnse3 = await fetch(
        this.apiCall.value +
        `/owner/trainingData/${this.userData.ownerId}`,
        {
            headers: { "Content-Type": "application/json" },
          }      
      );
      this.trainingData = await rpnse3.json();

      const rpnse2 = await fetch(
        this.apiCall.value +
        `/owner/learningData/${this.userData.ownerId}`,
        {
            headers: { "Content-Type": "application/json" },
          }      
      );
      this.learningData = await rpnse2.json();

      const inventory = await fetch(
        this.apiCall.value +
        `/owner/inventoryData/${this.userData.ownerId}`,{ headers: { "Content-Type": "application/json" }});
      this.inventory = await inventory.json();      
    },
  };
  </script>
  
  <style scoped></style>
  