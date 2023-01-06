<template>
  <div>
    <!--Background-->
    <div class="opacity-25 fixed inset-0 bg-black z-40"></div>

    <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 class="text-3xl font-semibold">
              Clash Setup
            </h3>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto flex">
            <div class="w-64 bg-yellow-100 h-48 m-2"> Prepare </div>
            <div class="w-64 bg-yellow-100 h-48 m-2"> Clash </div>
            <div class="w-64 bg-yellow-100 h-48 m-2"> React </div>
            <div class="w-64 bg-yellow-100 h-48 m-2"> Unassigned </div>
          </div>
          <!--footer-->
          <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name:"ClashSetting",
        props: ["gladId"],
        methods:{
          bgClose(event){
            if(event.target.getAttribute("data-id") === "bg"){
              this.$emit('closeModal')
            }
          },
        },
        async mounted() {
          const rpnse = await fetch(`http://${window.location.hostname}:3001/gladiator/clashInfo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.gladId }),
            }
          );

          const gladData = await rpnse.json();
          console.log( gladData );
    },

    }
</script>

<style scoped>

</style>