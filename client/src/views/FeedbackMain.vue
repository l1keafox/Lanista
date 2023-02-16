<template>
  <div class="flex flex-col w-full overflow-x-hidden justify-center items-center">
      <h1 class="text-center font-baby text-[5rem]">Feedback</h1>
      <h2> Thank you for any feedback on bugs, this will be reported directly to my inbox</h2>
      <h2> Please be detailed in what you would like or found</h2>
      <form ref="form" id="form" @submit.prevent="submit" class="flex flex-col w-full md:w-[40rem]  text-xl">
        <!-- <InputField label="name" id="from_name" name="from_name" v-model="name" :error="errors.name"> </InputField>
        <InputField label="email" id="reply_to" name="reply_to" :error="errors.email" :modelValue="email" @change="handleChange"> </InputField>
        <TextField label="message" id="message" name="message" v-model="message" :error="errors.message" class="h-[10rem]" />
        <MyButton type="submit" text="Submit" hover="bg-red-700" color="bg-red-500"/> -->
      </form>      
  </div>
</template>

<script setup>

// import emailjs from "@emailjs/browser";
// import { useField, useForm } from 'vee-validate'
// import { object, string } from 'yup'
// import MyButton from "@/components/MyButton.vue"
// import TextField from "@/components/TextField.vue"
// import InputField from "@/components/InputField.vue"

// const validationSchema = object({
//     email: string().email("Field should contain a valid e-mail").max(255).required("E-mail is required"),
//     name: string(),
//     message: string()
// })
// const {handleSubmit, errors, setFieldValue} = useForm({
//     validationSchema,
//     initialValues:{
//       email:null,
//       name:null,
//       message:null
//     }
// })
// const { value: email } = useField('email')
// const { value: name } = useField('name')
// const { value: message } = useField('message')
// const handleChange = (event) =>{
//   setFieldValue('email',event.target.value)
// }
// const submit = handleSubmit(() => {
//     emailjs.sendForm(
//       "service_3l5kfbj",
//       "template_7630s4a",
//       document.getElementById('form'),
//       "b3A_HBPJ0CCCA_D0d"
//     )
//     alert("Thank you for sending me a message, I will get back too you asap");
//     email.value = ''
//     name.value = ''
//     message.value = ''
// })

</script>

<style scoped>

</style>