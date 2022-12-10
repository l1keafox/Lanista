<template>
    <div class = "grid justify-center h-full w-full items-center">
        <LoginVue/>
    </div>
</template>

<script>
import LoginVue from '@/components/LoginVue.vue';
    export default {
        name:"LandingPage",
        components:{
            LoginVue
        }
    }
</script>

<style scoped>

</style>