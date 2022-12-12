<template>
    <div>
        <div v-if="!isLoggedIn" class="m-2" @click="showLogin"  :key="isLoggedIn"> Login</div>
        <div v-else  class="m-2">Logout</div>
        <div class="m-2"> Profile </div> 
    </div>
    <div v-if="showLoginModal">
        <LoginVue id="vue"/>
    </div>
</template>

<script>
    import LoginVue from './LoginVue.vue';
    export default {
        name:"SideNav",
        data(){
            return{
                showLoginModal:false
            }
        },
        components:{
            LoginVue
        },
        mounted(){
            console.log(this.isLoggedIn);
        }, 
        methods:{
            showLogin(){
                console.log('here?',this.showLoginModal);
                this.showLoginModal = !this.showLoginModal;
            },
        },
        inject:['isLoggedIn'],
    }
</script>

<style scoped>
#vue{
    opacity: 1;
}
</style>