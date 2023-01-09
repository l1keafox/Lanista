<template>
	<div class="flex flex-col h-full">
		<h1 class="bg-slate-900">Combat</h1>
        <h2> Pick gladiator</h2>
        <div v-if="ownerData" class="flex">
            <select name="gladiator" class="bg-cyan-100 w-28 text-purple-800" id="gladiator"> 
                <option value="empty">Select</option>
                <template v-for="(gladiator,index) in ownerData.gladiators" :key="index">
                <option  :value="gladiator.name"> {{gladiator.name}}</option>
                </template>
              </select>
              vs
              <select name="gladiator2" class="bg-cyan-100 w-28 text-purple-800" id="gladiator2"> 
                <option value="empty">Select</option>
                <template v-for="(gladiator,index) in ownerData.gladiators" :key="index">
                <option  :value="gladiator.name"> {{gladiator.name}}</option>
                </template>
              </select>
            </div>
		<hr />

		<div class="flex flex-col">
			<div>Sparring</div>
			<button class="bg-yellow-200 text-emerald-800" @click="doSpar">
				Spar Self
			</button>
			<hr />
			<div>Fighting History</div>
		</div>
	</div>
</template>

<script>
export default {
    name:"CombatMain",
    components:{
    },
    data(){
        return {
            ownerData:null
        }
    },
    computed:{

    },
    inject: ['card','cardTitle','userData'],
    methods:{
       async doSpar(){
            let sch = document.getElementById('gladiator');
            let sch2 = document.getElementById('gladiator2');
            let gladData = this.ownerData.gladiators.find(glad => glad.name == sch.value );
            let glad2 = this.ownerData.gladiators.find(glad =>    glad.name == sch2.value);
            const rpnse = await fetch(
                `http://${window.location.hostname}:3001/gladiator/doSpar`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "gladatorId2": glad2._id, "gladatorId":gladData._id }),
                }
            );
            let rpns = await rpnse.json();
            console.log(rpns);
        },
    },

    async mounted(){
        try{

        const rpnse = await fetch(
          `http://${window.location.hostname}:3001/owner`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id }),
            }
        );
        console.log(rpnse);
        let ownerData = await rpnse.json();
        console.log(ownerData);
        this.ownerData = ownerData;
        }catch(err){    
            console.log(err);
        }
    },


}
</script>

<style scoped></style>
