<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold">Week Schedule</h3>
      <BaseTabs :tabs="tabs" v-model="currentTab"/>
    </template>

    <template v-slot:content>
      <div v-if="gladiatorData && currentTab=='Week'" class="flex overflow-x-auto">
        <div v-for="(day, key2) in gladiatorData.schedule[0]" :key="key2">
          <h1>Day {{ key2 }}</h1>
          <div class="relative flex-auto bg-slate-200">
            <div
              v-for="(event, key) in day"
              :key="key"
              class="bg-blue-500 w-48">
              {{ key }}:00 Event
              <select :name="key" class="bg-green-800 schedule">
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
      <div v-if="gladiatorData  && currentTab=='Day' "  >
          <div class="relative flex-auto bg-slate-200">
            <div
              v-for="(event, key) in gladiatorData.schedule[0][1]"
              :key="key"
              class="bg-blue-500 w-48">
              {{ key }}:00 Event
              <select :name="key" class="bg-green-800 schedule">
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
      <div class="bg-slate-700 p-2">
        <h1>Skills Learning</h1>
        <div class="flex">
          <template v-if="this.gladiatorData && this.gladiatorData.learnSkill[0]">
            
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

            <h1>instead of doing this task:</h1>
            <select name="task1" id="task1">
              <option>{{ this.gladiatorData.taskSkill[0] }}</option>
              <template
                v-for="(training, index) in trainingData"
                :key="index">
                <option :value="training">{{ training }}</option>
              </template>
            </select>		
            <h1>Current Progres:</h1> 						
            <p> {{ this.gladiatorData.progressSkill[ this.gladiatorData.learnSkill[0] ] }} </p>
          </template>
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
        <p>
          Pick the "Learn" in the schedule, the select the skill you would
          like to learn in the dropdown. Instead of doing that task, the
          gladiator will go and learn this skill.
        </p>
      </div>
      <div class="bg-green-700 p-2">
        <h1>Seventh Day Tournaments</h1>
        <p>
          Tournaments take up a sunday. If its the last week of the year, it is an National tournament with the biggest prize,
          If it is the last week every 3 months it is the 2nd biggest Tournament. Last Week of a month is regional, and every week that doesn't have any of the above is local. 
          
        </p>
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

import auth from "./../../mixins/auth";
export default {
	name: "ScheduleManager",
	props: ["gladId"],
	data() {
    this.tabs = ["Day","Week"]
    this.daysOfWeek = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"]
		return {
			gladiatorData: null,
      currentTab: this.tabs[0],
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
	inject:['apiCall'],
	methods: {
		async doSave() {
			let sch = document.getElementsByTagName("select");
			let saveObj = {};
			for (let i in sch) {
				if (sch[i] && sch[i].name && sch[i].selectedOptions) {
					console.log( !sch[i].name  );
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
		
	},
};

</script>

<style scoped>

</style>