<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold">RoundRobin - winner :</h3>
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
        <div
          v-for="(glad, index) in this.gladiatorObj"
          :key="index"
          class="flex justify-between"
        >
          <h1>{{ index }}</h1>
          <div>
            <select
              name="mainHand"
              class="bg-cyan-100 w-28"
              :id="index"
              ref="myDiv"
            >
              <option value="">vs select</option>
              <template v-for="(vsGlad, index) in glad" :key="index">
                <option :value="vsGlad.duelId">{{ vsGlad.vs }}</option>
              </template>
            </select>
            <button :data-id="index" @click="ShowDuel($event)">Show</button>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:modal>
      <div v-if="isModalShown">
        <Suspense>
          <DuelReplay
            :duelId="duelId"
            @closeModal="isModalShown = !isModalShown"
          />
        </Suspense>
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: "roundRobinReview",
  props: ["tournamentData"],
  data() {
    return {
      isModalShown: false,
      duelId: null,
      gladiatorObj: {},
    };
  },
  async mounted() {
    //let grab = this.tournamentData.duelReport[0];
    // We going to use a drop down menu, so let's first organlize the data by users.
    this.gladiatorObj = {};
    console.log(this.tournamentData);
    if (this.tournamentData) {
      this.tournamentData.tournamentStructure.forEach((duel) => {
        if (!this.gladiatorObj[duel[1]]) {
          this.gladiatorObj[duel[1]] = [{ duelId: duel.saveId, vs: duel[2] }];
        } else {
          this.gladiatorObj[duel[1]].push({ duelId: duel.saveId, vs: duel[2] });
        }
        if (!this.gladiatorObj[duel[2]]) {
          this.gladiatorObj[duel[2]] = [{ duelId: duel.saveId, vs: duel[1] }];
        } else {
          this.gladiatorObj[duel[2]].push({ duelId: duel.saveId, vs: duel[1] });
        }
        //console.log( duel[1], duel[2], duel.saveId )
      });
    }
    // console.log("THIS:",this.gladiatorObj);
  },
  methods: {
    ShowDuel(event) {
      // console.log( event.target.getAttribute("data-id"));
      // console.log( this.gladiatorObj [ event.target.getAttribute("data-id") ] )
      let sch = document.getElementById(event.target.getAttribute("data-id"));
      // console.log(sch.value );
      this.gladiatorObj[event.target.getAttribute("data-id")];
      if (sch.value !== "empty") {
        this.duelId = sch.value;
        this.isModalShown = true;
      }
    },
  },
};
</script>

<style scoped></style>
