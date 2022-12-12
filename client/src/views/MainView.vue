<template>
    <div class="flex h-full ">
        <!-- -->
        <div class="bg-blue-900 w-48"> 
            <SideNav @logged="update"/>
        </div>
        <div class="bg-slate-900 grow "> MAIN BOARD {{isLoggedIn}}</div>
    </div>
</template>

<script>
import SideNav from '@/components/SideNav.vue';
import auth from "./../mixins/auth";
    export default {
        name:"MainView",
        components:{
            SideNav
        },
        data(){
            return {
                isLoggedIn: auth.loggedIn()
            }
        },
        
        methods:{
            update(){
                this.isLoggedIn = auth.loggedIn();
            }
        },  
        updated(){
            console.log('udpated?');
        }

    }
</script>

<style scoped>

</style>