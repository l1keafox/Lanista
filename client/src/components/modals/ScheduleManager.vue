<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold" >Manage Schedule</h3>
      <BaseTabs :tabs="tabs" v-model="currentTab"/>
    </template>

    <template v-slot:content>
      <div id="weekDiv" class="flex overflow-x-auto z-20 justify-center items-center bg-slate-400 ">
        <template v-if="gladiatorData && currentTab=='Week'">
        <div v-for="(day, key2) in gladiatorData.schedule[0]" :key="key2">
          <h1>Day {{ key2 }}</h1>
          <div class="relative flex-auto bg-slate-300">
            <div
              v-for="(event, key) in day"
              :key="key"
              class="text-slate-800 w-48 flex justify-around border border-sky-200">
              {{ key }}:00 Event
              <div>
            <!-- <div  @mouseover="showToolTip( createTool(event) )" @mouseleave="hideToolTip"> -->
              <select :name="key" class="text-slate-800 schedule" >
                <option value="fir">{{ event }}</option>
                <template
                  v-for="(training, index) in trainingData"
                  :key="index">
                  <option value="index">{{ training }}</option>
                </template>
              </select>
              
            </div>
            </div>
          </div>
        </div>
        </template>
        <template v-else-if="gladiatorData  && currentTab=='Day'">
          <div class="relative flex flex-col  bg-slate-200 ">
            <div
              v-for="(event, key) in gladiatorData.schedule[0][1]"
              :key="key"
              class="bg-blue-500 w-48 flex justify-around p-1 border border-sky-200">
              <h3>{{ key }}:00 </h3>
              <!-- <div  @mouseover="showToolTip( createTool(event) )" @mouseleave="hideToolTip"> -->
              <select :name="key" class="bg-green-800 schedule"  >
                
                <option value="fir" >{{ event }}</option>
                <template
                  v-for="(training, index) in trainingData"
                  :key="index"
                  >
                  
                  <option value="index" >
                      {{ training }}
                  </option>
                  
                </template>

              </select>
            </div>
          </div>
        </template>
      </div>
      <div class="bg-slate-700 p-2">
        <div class="flex">
          <div v-if="this.gladiatorData && this.gladiatorData.learnSkill[0]" id="learnSkiTut">
            <div class="flex ">
            <h1>Learn this :</h1>
            <select name="skill1" id="skill1">
              <option>{{ this.gladiatorData.learnSkill[0] }}</option>
              <template
                v-for="(learning, index) in learningData"
                :key="index * 2">
                <option :value="learning" class="bg-red-100 schedule">
                  {{ learning }}
                </option>
              </template>
            </select>
          </div>
            <div class="flex ">
            <h1>instead of doing this task:</h1>
            <select name="task1" id="task1">
              <option>{{ this.gladiatorData.taskSkill[0] }}</option>
              <template
                v-for="(training, index) in trainingData"
                :key="index">
                <option :value="training">{{ training }}</option>
              </template>
            </select>		
          </div>
            <div class="flex ">
            <h1>Current Progress:</h1> 						
            <p> {{ this.gladiatorData.progressSkill[ this.gladiatorData.learnSkill[0] ] }} </p>
            </div>
          </div>
          <template v-else>
            <h1>Learn this :</h1>
            <select name="skill1" id="skill1">
              <option>Skill</option>
              <template
                v-for="(learning, index) in learningData"
                :key="index * 2">
                <option :value="learning" class="bg-red-100 schedule">
                  {{ learning }}
                </option>
              </template>
            </select>
            <h1>instead of doing this task:</h1>
            <select name="task1" id="task1">
              <option>Task</option>
              <template
                v-for="(training, index) in trainingData"
                :key="index">
                <option :value="training">{{ training }}</option>
              </template>
            </select>
          </template>
        </div>
      </div>
      <div class="flex flex-wrap">
      <div class="flex px-4"
          v-for="(training, index) in trainingData"
          :key="index">
        <div class="border p-1 border-yellow-800 flex justify-around text-black">
          <h1>{{training}} </h1>
          <h2> ={{createTool(training)}}</h2>
        </div>
      </div>
     </div>
    </template>

    <template v-slot:footer>
      <button
      class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      @click="doSave">
      Save
    </button>

    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue"
import BaseTabs from "./BaseTabs.vue"
import cacheJson from "./../../composables/cacheJson"

import auth from "./../../mixins/auth";
export default {
	name: "ScheduleManager",
	props: ["gladId"],
	data() {
    this.tabs = ["Day","Week"]
    this.daysOfWeek = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    this.trainJson
		return {
			gladiatorData: null,
      currentTab:null,
			userData: auth.getUser(),
			trainingData: null,
			learningData: null,
			daySelected: 0,
			
		};
	},
	components: {
    BaseModal,
    BaseTabs
  },
	inject:['apiCall','showTutorial'],
	methods: {
    createTool(event){
      let rtnStrng = ""
      for(let key in this.trainJson[event]){
        if(this.trainJson[event][key].min){
          rtnStrng += `${this.trainJson[event][key].growth?"+":"-"}${key.slice(0,4)}(${this.trainJson[event][key].min}-${this.trainJson[event][key].max}) `;
        }else if (this.trainJson[event][key].diceSide){
          rtnStrng += `${this.trainJson[event][key].growth?"+":"-"}${key.slice(0,4)}(${this.trainJson[event][key].diceNumber}d${this.trainJson[event][key].diceSide}) `;
        }
      }
      
      return rtnStrng;
    },
		async doSave() {
			// let sch = document.getElementsByTagName("select");
      const sch = document.getElementsByClassName("schedule");
      
			let saveObj = {};
			for (let i in sch) {
				if (sch[i] && sch[i].name && sch[i].selectedOptions) {
					saveObj[parseInt(i) + 1] = sch[i].selectedOptions[0].innerText;
				}
			}
			let timeCount = 0;
			let currentDay = {};
			let dayCount = 1;
			let rtnObj = {};
			for (let index in saveObj) {
        if(index > 48){
          continue;
        }
				timeCount++;
				if (timeCount > 8) {
					timeCount = 1;
					//  console.log( currentDay );
					rtnObj[dayCount] = currentDay;
					dayCount++;
					currentDay = {};
				}
				currentDay[timeCount] = saveObj[index];
				//console.log(saveObj[index],dayCount);
			}

      

			rtnObj[dayCount] = currentDay;
			// console.log(rtnObj);
			//here we should do a post to save it.
			await fetch(
				this.apiCall.value +				`/gladiator/saveWeek`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "id": this.gladId, "week": rtnObj, "scheduleType": this.currentTab }),
				}
			);

			let task = document.getElementById("task1");
			let skill = document.getElementById("skill1");
			console.log(`${skill.value} should replace ${task.value} when done`);

			await fetch(
				this.apiCall.value +				`/gladiator/saveLearning`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						"id": this.gladId,
						"skill": skill.value,
						"task": task.value,
					}),
				}
			);

			this.$emit("closeModal");
		},
	},
	async mounted() {
    this.trainJson = await cacheJson(`/assets/json/training`, this.apiCall.value )
    console.log('SCH',this.trainJson);
    
		const rpnse = await fetch(
			this.apiCall.value +			`/gladiator/${this.gladId}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		this.gladiatorData = await rpnse.json();
    console.log(this.gladiatorData.scheduleType);
    this.currentTab = this.gladiatorData.scheduleType;

		if(this.gladiatorData.progressSkill){
			this.gladiatorData.progressSkill = JSON.parse( this.gladiatorData.progressSkill )
		}

		const training = await fetch(
			this.apiCall.value +			`/owner/training/${this.userData.ownerId}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		this.trainingData = await training.json();

		const learning = await fetch(
			this.apiCall.value +			`/owner/learning/${this.userData.ownerId}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		const learningData = await learning.json();
//		console.log(learningData, "Learning",this.gladiatorData.skills);
		for(let skill of this.gladiatorData.skills){
//			console.log(learningData.includes(skill),skill)
			if( learningData.includes(skill) ){
//				console.log("FOUND, so it needs to be removed from learning data,",learningData.indexOf(skill ))
				learningData.splice( learningData.indexOf(skill )   );
//				console.log(learningData);
				break;
			}
		}
		this.learningData = learningData;
    this.showTutorial({elementId:"weekDiv",message:"A day is broken into 8 time frames, each time frame will train skills depending on what you have setup", orientation:"bottom"});
    this.showTutorial({elementId:"learnSkiTut",message:"Pick the 'Learn' in the schedule, the select the skill you would like to learn in the dropdown. Instead of doing that task, the gladiator will go and learn this skill.", orientation:"bottom"});
    

	},
};

</script>

<style scoped>

</style>