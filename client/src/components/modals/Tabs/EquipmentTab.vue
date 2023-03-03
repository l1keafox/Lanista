<template>
	<div>
		<div
			id="eqTut"
			class="relative p-6 flex-auto"
			v-if="gladiatorData">
			<div class="flex justify-between">
				<div class="flex w-1/2 justify-between">
					<h2>SLOT</h2>
					<h2>ITEM NAME</h2>
				</div>
			</div>
			<hr />

			<template v-for="(slot, index) in slots" :key="slot">
				<div class="flex justify-between">
					<div class="flex w-1/2 justify-between">
						<h2>{{ slot }}</h2>

						<ItemMouseOver  > 
							<template v-if=" gladiatorData.value">
								<h2 v-if=" gladiatorData.value[slot]">{{ gladiatorData.value[slot] }}</h2>
							</template>
							<template v-else>
								<h2 >{{ gladiatorData[slot] }}</h2>
							</template>
						</ItemMouseOver>
						
					</div>
					<!-- <button v-if=" gladiatorData[slot]" class="bg-red-200" @click="tiggerInfo( slot )"> item info </button> -->
					<template v-if="inventoryData">
					<select :name="slot" class="bg-cyan-100 w-28" :id="slot">
						<template v-if=" inventoryData[slot]">
							<option value="empty">Select</option>
						</template>
						<template v-else>
							<option value="empty">No Items</option>
						</template>
						<template
							v-if=" inventoryData && inventoryData[slot]"
							v-for="(item, index) in inventoryData[slot]"
							:key="index">
							<option :value="item.type">{{ item.type }}</option>
						</template>
					</select>
				</template>
				</div>
			</template>
		</div>
		<p>Equipped items are lost and cannot be unequipped</p>

		<BaseFooter>
			<button
				class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
				type="button"
				@click="doEquip">
				Equip Items
			</button>
			<button
				class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
				type="button"
				v-on:click="$emit('closeModal')">
				Close
			</button>
		</BaseFooter>
	</div>
	
	<div v-if="showItemModal">
		<ItemCardDetail :item="data" @closeModal="showItemModal = false"/>
	</div>
</template>

<script setup>
import ItemMouseOver from "../ItemMouseOver.vue";
import BaseFooter from "../BaseFooter.vue";
import auth from "../../../composables/auth";
import { inject, defineProps, onMounted, ref, toRefs , unref } from "vue";
import ItemCardDetail from './../ItemCardDetail.vue';
import cacheJson from "./../../../composables/cacheJson.js"

const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

const emit = defineEmits(["closeModal"]);

const props = defineProps({
	gladId: {
		type: String,
	},
	memoryData: {},
});
const { gladId,memoryData }  = toRefs(props)
const userData = auth.getUser();
const slots = ["head", "mainHand", "offHand", "body", "boots"];

const gladiatorData = ref(null);
const inventoryData = ref(null);
const showItemModal = ref(false);
const data = ref();
async function tiggerInfo(item){
	let gladData = unref(gladiatorData);
	showItemModal.value = true;
	const itemJson = await cacheJson(`/assets/json/items`, apiCall.value )
	itemJson[gladData[item]].type = gladData[item];
	data.value = itemJson[gladData[item]];
}


onMounted(async () => {
	showTutorial({
		elementId: "eqTut",
		message:
			"This is where you can equip other items. They will appear once you have purchased them.",
		orientation: "bottom",
	});
	console.log('Equip tab doing:',gladId,"opr",memoryData)
	if (!memoryData.value) {
		const rpnse = await fetch(apiCall.value + `/gladiator/${gladId.value}`, {
			headers: { "Content-Type": "application/json" },
		});
		gladiatorData.value = await rpnse.json();

		const inventory = await fetch(
			apiCall.value + `/owner/itemsSort/${userData.ownerId}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		inventoryData.value = await inventory.json();
	} else if(memoryData) {
		gladiatorData.value = memoryData;
		console.log("Memory equip tab",gladiatorData.value);
	}

});
async function doEquip() {
	const equipObj = slots
		.map((slot) => {
			let sch = document.getElementById(slot);
			if (sch && sch.value !== "empty") {
				return { slot, newEquip: sch.value };
			}
		})
		.filter((ele) => {
			return ele !== undefined;
		});

	if (equipObj.length) {
		await fetch(apiCall.value + `/owner/removeItems`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "id": userData._id, "remove": equipObj }),
		});

		await fetch(apiCall.value + `/gladiator/updateEquipment`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "id": gladId, "save": equipObj }),
		});
	}
	emit("closeModal");
}
</script>

<style scoped></style>
