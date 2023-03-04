<template>
    <div class="h-64 w-[12rem] min-w-[12rem] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg" v-if="data">
        <h1 :class="cardTitle">{{ data.type }}</h1>
        
        
        
        <hr />
        <div class = "h-full flex flex-col justify-between">
        <div>
            <h2 v-if="data.slot"> Slot:{{data.slot}}</h2>
            <h2 v-if="data.cost"> Cost:{{data.cost}} </h2>
            <h2 v-if="data.abilities"> {{data.abilities}} </h2>
            <h2 v-if="data.description"> {{data.description}} </h2>
        </div>
        <div class="flex flex-col">
            <button class="bg-yellow-100 m-2 text-purple-900" @click="openModal">
                Details
            </button>
              
            <button class="bg-yellow-200 m-2 text-purple-900" @click="$emit('buyThing')">
              Buy
            </button>
         </div>
        </div>
    </div>
</template>

<script setup>
        const {data} = defineProps(["data"])
        const smallCard = inject("smallCard")
        const cardTitle = inject("cardTitle")
</script>

<style scoped>

</style>
