<template>
  <BaseModal>
    <template v-slot:header>
      <h1> RoundRobin </h1>
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
      </div>

    </template>

    <template v-slot:footer>
      
    </template>
  </BaseModal>
  <!-- <div v-if="isModalShown">
    <CombatReview
      :combatReport="combatReport"
      @closeModal="closeModal"
      :glads="glads" />
  </div> -->

</template>

<script>
import BaseModal from "./BaseModal.vue"
    export default {
        name:"roundRobinThenBestOfthree",
        props:['tournamentData'],
        inject:['apiCall'],
        components:{
          BaseModal
        },
        async mounted(){
            let grab = this.tournamentData.duelReport[0];
            const rpnse = await fetch(
              this.apiCall.value +                `/gladiator/getDuel/${grab}`,
                {headers: { "Content-Type": "application/json" }}
              );
            let rn = await rpnse.json();
            console.log(rn);
        },
        methods:{
            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                    this.$emit('closeModal')
                }
            },

        },
    }
</script>


<style scoped>

</style>