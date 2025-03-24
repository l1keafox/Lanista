<template>
	<div class = "" >
		<!--Background-->
		<div class="opacity-25 fixed inset-0 bg-black z-30"></div>
		<div
			class="overflow-x-hidden overflow-y-auto fixed inset-0  outline-none focus:outline-none justify-center items-center flex z-30"
			data-id="bg"
			v-bind="$attrs"
			v-on:click="bgClose($event)">
			<div class="relative w-auto my-6 mx-auto max-w-6xl " >
				<!--content-->
				<div   v-bind="$attrs" class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
					<!--header-->
					<div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t text-3xl text-slate-600">
            <slot name='header' >

            </slot>
					</div>
					<!--body-->
					<div>
            <slot name='content' >

            </slot>
					</div>
					<!--footer-->
					<!-- <div v-if="!noFooter" class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"> -->
					<template v-if="!noFooter">
					<BaseFooter>
            <slot  name='footer' >	

            </slot>
						<template v-if="!noClose">
  	          <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')">
	              Close
            	</button>
						</template>
					</BaseFooter>
				</template>
					<!-- </div> -->
				</div>
			</div>
		</div>
		<!-- MODAL -->
		<slot name='modal' >

		</slot>

	</div>
</template>

<script>
export default {
	name: "baseModal",
	data(){
		return{
			showModal: true
		}
	},
	props: {
		noFooter:{
			type:Boolean,
			default:false
		},
  	noClose: {
    	type: Boolean,
    	default: false
  	}
	},
	mounted(){
	},
	methods: {

		bgClose(event) {
			if (event.target.getAttribute("data-id") === "bg") {
				this.$emit('closeModal')
			}
		},

	},
};
</script>

<style scoped></style>
