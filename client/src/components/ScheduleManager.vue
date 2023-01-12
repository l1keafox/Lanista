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
						<h3 class="text-3xl font-semibold">Schedule </h3>
					</div>
					<!--body-->
					<div v-if="gladiatorData" class="flex overflow-x-scroll">
						<!-- <div class="flex flex-col p-2 w-28">
							<h1>DAY </h1>
							<div v-for="(day, index) in daysOfWeek" :key="index">
								<div v-if="index === daySelected" :key="daySelected">
									<button class="text-center bg-blue-200 fill" >{{ day }}!</button>
								</div>
								<div v-else >
									<button class="text-center" @click="switchDay(index)">
										!{{ day }}
									</button>
								</div>
							</div>
						</div> -->
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
								</select>
							</div>
						</div>
          </div>
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
			for (let i in sch) {
				if (sch[i] && sch[i].selectedOptions) {
					saveObj[parseInt(i) + 1] = sch[i].selectedOptions[0].innerText;
				}
			}
 
			console.log(saveObj, "Saving week Events",this.daySelected);
			// here we should do a post to save it.
			// fetch(`http://${window.location.hostname}:3001/gladiator/saveDay`, {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ "id": this.gladId, "day": saveObj }),
			// });
			//this.$emit("closeModal");
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
    console.log(this.gladiatorData.schedule);

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
	},
};
</script>

<style scoped></style>
