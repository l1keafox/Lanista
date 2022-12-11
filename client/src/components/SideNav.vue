<template>
    <div>
        <div v-if="!isLoggedIn" class="m-2" @click="showLogin"> Login</div>
        <div v-else  class="m-2">Logout</div>
        <div class="m-2"> Profile </div>
    </div>
    <template v-if="showLoginModal" >
        <LoginVue id="vue"/>
    </template>
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