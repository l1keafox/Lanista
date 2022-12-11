<template>
    <div class="flex h-full ">
        <!-- -->
        <div class="bg-blue-900 w-48"> <SideNav/></div>
        <div class="bg-slate-900 grow "> MAIN BOARD</div>
    </div>
</template>

<script>
import SideNav from '@/components/SideNav.vue';
    export default {
        name:"MainView",
        components:{
            SideNav
        },
        data(){
            return {
                isLoggedIn: false,
            }
        },

    }
</script>

<style scoped>

</style>