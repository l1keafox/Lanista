<template>
  <div class="flex flex-col w-full overflow-x-hidden relative">
    <div class="flex items-center justify-around">
      <Character
        animation="walk"
        direction="Down"
        class="h-[15rem] w-[15rem]"
        gladName="1"
      />
      <h1 id="header" class="text-center font-dot text-[7rem] z-5">Lanista</h1>
      <Character
        animation="walk"
        direction="Down"
        class="h-[15rem] w-[15rem]"
        gladName="2"
      />
    </div>
    <h2 class="text-center font-dot text-[2rem]">
      - a trainer of gladiators -
    </h2>
    <br />
    <hr />
    <br />
    <div class="font-dot text-2xl flex flex-col text-center">
      Welcome to Lanista
      <p class="m-10">
        A pvp dueling game, you will set your gladiator's schedule to train that
        will run 24 hours every day. They will be dueling and training even if
        you are not logged in.
      </p>

      <p>
        With a unique duel system,where you set them up with skills/stats and
        equipment for success.
      </p>
      <br />
      <h1>Click on How To Play to the side nav for more details.</h1>
      <br />
      <h1 class="text-red-500 text-xl">
        Current tick time is {{ maxTick / 1000 }} secs.
      </h1>
    </div>
    <br />
    <br />
    <hr />
    <br />
    <div class="flex flex-col text-center m-10">
      <h1 class="text-red-500 text-3xl">
        WARNING - Game is still in alpha! while all features are in, they need
        to be refined and UI/UX needs to be improved. Items, training, buildings
        and balancing still needs to be done.
      </h1>

      <h1 class="text-green-500 text-2xl">Special accounts to look around:</h1>
      <h2 class="text-yellow-500 text-xl">
        username / <span class="text-blue-500">password</span>
      </h2>
      <h2 class="text-yellow-500 text-xl">
        seed / <span class="text-blue-500">seeded</span>
      </h2>
      <h2 class="text-yellow-500 text-xl">
        cat / <span class="text-blue-500">catcat</span>
      </h2>
      <h2 class="text-yellow-500 text-xl">
        test / <span class="text-blue-500">testtest</span>
      </h2>
      <h2 class="text-yellow-500 text-xl">
        hamster / <span class="text-blue-500">hamham</span>
      </h2>
    </div>
    <!-- <h1> Play for free! This game is not pay to win, but you need to think of how your weapons, skills and stats all interact</h1> -->
    <br />
    <br />
  </div>
</template>

<script setup>
const apiCall = inject("apiCall");

const maxTick = ref(0);
onMounted(async () => {
  if (apiCall) {
    const rpnse = await fetch(apiCall.value + `/users/gameData`, {
      headers: { "Content-Type": "application/json" },
    });
    const gameData = await rpnse.json();
    maxTick.value = gameData.tick;
  }

  let bg = document.getElementById("backGround");
  console.log();

  console.log();
});
</script>
