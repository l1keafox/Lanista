<template>
    <div>
        <div
          class="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
          id="modal"
        >
          <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div
              class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400"
            >
              <div
                class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center"
              >
                <div class="mb-8 flex justify-center flex flex-col">
                    Clash
            
                  <button class="bg-slate-200" @click="$emit('closeModal')">
                    close
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
</template>

<script>
    export default {
        name:"ClashSetting"
    }
</script>

<style scoped>

</style>