<template>
  <div
    id="toolTip"
    class="cursor-disabled fixed text-black bg-slate-500 z-50 p-2 rounded"
  >
    <component
      :is="components[ToolTip]"
      :propList="dataList"
      :gladData="gladData"
    />
  </div>
</template>

<script setup>
import { useMouse } from "@vueuse/core";
import cacheJson from "./../../composables/cacheJson";
import ToolTipItem from "./Tooltips/ToolTipItem.vue";

const ToolTip = ref("ToolTipItem");
const components = {
  ToolTipItem,
};

const props = defineProps({
  context: {},
  gladData: {},
  type: {
    default: "item",
  },
});

const { context, type, gladData } = toRefs(props);
const apiCall = inject("apiCall");
const dataList = ref({});

onMounted(() => {
  const mouse = reactive(useMouse());

  const infoEle = document.getElementById("toolTip");
  doThis();
  async function doThis() {
    let trainJson; // = ref()
    switch (type.value) {
      case "skill":
        const rpnse = fetch(apiCall.value + `/owner/ability/${context.value}`, {
          headers: { "Content-Type": "application/json" },
        }).then((nxt) => {
          nxt.json().then((rpnse) => {
            // dataList.value[ele] = rpnse;
            dataList.value[context.value] = rpnse;
          });
        });

        break;
      case "item":
        let ditto = await cacheJson(`/assets/json/items`, apiCall.value);
        trainJson = await ditto[context.value];
        // with trainJson's value we will look at abilities and then
        const abilities = trainJson.abilities.map((ele) => {
          const rpnse = fetch(apiCall.value + `/owner/ability/${ele}`, {
            headers: { "Content-Type": "application/json" },
          }).then((nxt) => {
            nxt.json().then((rpnse) => {
              dataList.value[ele] = rpnse;
            });
          });
        });
        break;
    }
  }

  setTimeout(() => {
    infoEle.style.left = `${mouse.x + 15}px`;
    infoEle.style.top = `${mouse.y}px`;
  }, 75);
});
</script>

<style scoped></style>
