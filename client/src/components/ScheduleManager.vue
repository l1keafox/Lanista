<template>
	<div>
		<!--Background-->
		<div class="opacity-25 fixed inset-0 bg-black z-40"></div>

		<div
			class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
			data-id="bg"
			v-on:click="bgClose($event)">
			<div class="relative w-auto my-6 mx-auto max-w-6xl ">
				<!--content-->
				<div
					class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
					<!--header-->
					<div
						class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
						<h3 class="text-3xl font-semibold"> Week Schedule </h3>
					</div>
					<!--body-->
					<div v-if="gladiatorData" class="flex overflow-x-scroll">

            <div v-for="(day, key2) in gladiatorData.schedule[0]"
            :key="key2" >
            <h1> Day {{key2}}</h1>
						<div class="relative p-1 flex-auto bg-slate-200">
							<div
								v-for="(event, key) in day"
								:key="key"
								class="bg-blue-200 w-48">
								{{ key }}:00 Event
								<select :name="key" class="bg-green-100 schedule">
									<option value="fir">{{ event }}</option>
									<template
										v-for="(training, index) in trainingData"
										:key="index">
										<option value="index">{{ training }}</option>
									</template>
									<template
										v-for="(learning, index) in learningData"
										:key="index*2">
										<option value="index"  class="bg-red-100 schedule">{{ learning }}</option>
									</template>
								</select>
							</div>
						</div>
          </div>
					</div>
          <div class="bg-slate-700">
            <h1> Skills Upgrade</h1>
			<div class="flex">
            <!-- <select>
              <option>Skill </option>
            </select> -->
			<h1> When done turns into: </h1>
            <!-- <select>
              <option>Task </option>
            </select> -->

			</div>
			<p> Pick the "Learn" in the schedule, the select the skill you would like to learn in the dropdown. Select the task you would like it to turn into afterwards.</p>
          </div>
          <div class="bg-green-700">
            <h1> Seventh Day Tournaments</h1>
            <div>
            <input type="checkbox" id="weekly" name="weekly" value="weekly">
            <label for="weekly"> Local (weekly)</label><br>
            <input type="checkbox" id="monthly" name="monthly" value="monthly">
            <label for="monthly"> Regional (monthly)</label><br>
            <input type="checkbox" id="quarter" name="quarter" value="quarter">
            <label for="quarter"> Grand (quarter)</label><br>
            <input type="checkbox" id="year" name="year" value="year">
            <label for="year"> National (yearly)</label><br><br>
          </div>
            <p> Tournaments take up a sunday. Local take every sunday that doesn't have another tournament, Regional will take the last week's sunday that doesn't have another tournament, Grand tournaments are every three months that doesn't have another tournament, and National is once a year the very last week.</p>
          </div>
					<!--footer-->
					<div
						class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="$emit('closeModal')">
							Close
						</button>
						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							@click="doSave">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
	name: "ScheduleManager",
	props: ["gladId"],
	data() {
		return {
			gladiatorData: null,
			userData: auth.getUser(),
			trainingData: null,
			learningData:null,
			daySelected: 0,
			daysOfWeek: ["One", "Two", "Three", "Four", "Five", "Six", "Seven"],
		};
	},
	computed: {},
	methods: {
		bgClose(event) {
			if (event.target.getAttribute("data-id") === "bg") {
				this.$emit("closeModal");
			}
		},
		async switchDay(index) {

      // save before we switch.
      console.log('Do save');
      console.log('after save');
			this.daySelected = index;

      console.log(this.daySelected+1,"current day selected?");
      console.log(this.gladiatorData.schedule[0][this.daySelected+1] );
      // Should we save the previous day when we are switching
      // that seems to be the best case for now.
		},
		async doSave() {
			let sch = document.getElementsByTagName("select");
			let saveObj = {};
//      console.log(sch);
			for (let i in sch) {
				if (sch[i] && sch[i].selectedOptions) {
					saveObj[parseInt(i) + 1] = sch[i].selectedOptions[0].innerText;
				}
			}
 
			//console.log(Object.keys( saveObj ).length, "Saving week Events");
      let timeCount = 0;
      let currentDay = {};
      let dayCount = 1;
      let rtnObj = {};
      for(let index in saveObj){
        timeCount++;

        if(timeCount > 8) {
          timeCount = 1;
        //  console.log( currentDay );
          rtnObj[dayCount] = currentDay;
          dayCount++;
          currentDay = {};
        }
        currentDay[timeCount] = saveObj[index];
        //console.log(saveObj[index],dayCount);
      }
      //console.log( currentDay );
      rtnObj[dayCount] = currentDay;
      console.log(rtnObj);
			//here we should do a post to save it.
			fetch(`http://${window.location.hostname}:3001/gladiator/saveWeek`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "id": this.gladId, "week": rtnObj }),
			});
			this.$emit("closeModal");
		},
	},
	async mounted() {
		const rpnse = await fetch(
			`http://${window.location.hostname}:3001/gladiator`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "id": this.gladId }),
			}
		);
		this.gladiatorData = await rpnse.json();
    

		const training = await fetch(
			`http://${window.location.hostname}:3001/owner/training`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "id": this.userData._id }),
			}
		);
		const trainingData = await training.json();
		this.trainingData = trainingData;

		// const learning = await fetch(
		// 	`http://${window.location.hostname}:3001/owner/learning`,
		// 	{
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({ "id": this.userData._id }),
		// 	}
		// );
		// const learningData = await learning.json();
		// this.learningData = learningData;
		// 	console.log(learningData);
	},
};
</script>

<style scoped></style>
