<template>
  <div  class="text-5xl" >
    {{ isLogged }}
    <p v-if="isLogged" class="text-2xl font-mana tracking-tighter ">
      {{ data }}
    </p>
    <button v-else @click="triggerLogin">Login</button>
    <p class="font-neo">
      test
    </p>
    <p class="font-mana tracking-tighter">
      Lanista
    </p>
    <p class="font-sbit">
      Lanista
    </p>
    <p >
      Lanista
    </p>
  </div>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'

const username = ref("test")
const password = ref("testtest")
const isLogged = ref(false);

const fetchOwner = async ()=>{
  try{
    const rpnse = await fetch("http://localhost:3006" + `/owner/${auth.getUser().ownerId}`, {
        headers: { "Content-Type": "application/json","Authorization":auth.getToken() },
      });
      const oData = await rpnse.json();
      console.log(oData);
      if(!oData.error){
        isLogged.value = true;
      }
      return oData
  } catch(err){
    isLogged.value = false;
    console.log(err);
  }
}


const fetcher = async () => {
  const response = await fetch("http://localhost:3006/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: unref(username.value),
      password: unref(password.value),
    }),
  });
  const rpns = await response.json();
  if (response.status === 200) {
    auth.login(rpns.token);
    refetch();
  } else {
    alert(rpns.error);
  }
  return rpns;
}

const { data, error, refetch } = useQuery({
  queryKey: ['owner'],
  queryFn: fetchOwner,
  enabled: false, // Prevent auto-run
});

const login  = useQuery({
  queryKey: ['login'],
  queryFn: fetcher,
  enabled: false, // Prevent auto-run
});
const triggerLogin = () => {
  login.refetch(); // Call the API manually
};

onMounted( ()=>{
  refetch();
})
</script>

<style scoped>

</style>