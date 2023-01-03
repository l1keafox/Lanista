<template>
  <div>
    <div
      class="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
      id="modal"
    >
      <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
        <div
          class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400"
        >
          <div
            class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center"
          >
            <div class="mb-8 flex justify-center flex flex-col">
              <div v-if="gladiatorData">
                <h1>{{ gladiatorData.name }}</h1>
                <div v-for="(event,key) in gladiatorData.schedule[0]" :key="event">
                    {{key}}:00 Event  <select :name="key" class="bg-green-100 schedule">
                        <option value="fir">{{ event }}</option>
                        <option value="str">str</option>
                        <option value="agi">agi</option>
                        <option value="dex">dex</option>
                        <option value="int">int</option>
                        <option value="wis">wis</option>
                        <option value="cha">cha</option>
                    </select>
                </div>
              </div>
              <button class="bg-yellow-200" @click="doSave" >Save</button>
              <button class="bg-slate-200" @click="$emit('closeSchedule')">
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleManager",
  props: ["gladId"],
  data() {
    return {
      gladiatorData: null,
    };
  },
  methods:{
   async doSave(){
        let sch = document.getElementsByTagName("select");
        let saveObj = {};
        for(let i in sch){
            if(sch[i] && sch[i].selectedOptions){
                saveObj[parseInt(i)+1] = sch[i].selectedOptions[0].innerText;
            }
        }
        console.log(saveObj, "Saving Day Events");
        // here we should do a post to save it.
        fetch(
        `http://${window.location.hostname}:3001/gladiator/saveDay`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.gladId, "day":saveObj }),
          }
        );
        this.$emit('closeSchedule');
    }
  },
  async mounted() {
    console.log(this.gladId);
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/gladiator`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.gladId }),
      }
    );
    const ownerData = await rpnse.json();
    this.gladiatorData = ownerData;
  },
};
</script>

<style scoped></style>
