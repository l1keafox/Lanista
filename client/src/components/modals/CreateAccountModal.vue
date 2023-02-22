

<template>
  <BaseModal noClose="true">
    <template v-slot:header>
      <h1>Create Account</h1>
    </template>

    <template v-slot:content>
      <div role="alert" class="container mx-auto max-w-lg">
          <div class="flex flex-col border bg-slate-400 w-[28rem] h-[20rem] px-6 py-14 shadow-md rounded-[4px] items-center justify-center">
            <div class="flex flex-col text-sm rounded-md">
              <form ref="form" id="form" @submit.prevent="submit" class="flex flex-col w-full text-xl">
                <InputField label="username" id="username" name="username" placeholder="username" v-model="username" :error="errors.name"> </InputField>
                <InputField label="email" id="email" name="email" :error="errors.email" :modelValue="email" @change="handleChange"> </InputField>
                <InputField label="password" id="password" name="password" :error="errors.password" :modelValue="password" @change="handleChange2"> </InputField>
              </form>      
            </div>
          </div>
      </div>
    </template>

    <template v-slot:footer >
      <div class="flex flex-col w-[100%]">
        <button @click="submit" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Create Account</button>
        <button @click="$emit('createAcct',{})" class="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300" type="submit">Close</button>
      </div>
  </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'
import InputField from "./../InputField.vue"
const validationSchema = object({
    email: string().email("Field should contain a valid e-mail").max(255).required("E-mail is required"),
    username: string(),
    password: string().min(5)
})

const {handleSubmit, errors, setFieldValue} = useForm({
    validationSchema,
    initialValues:{
      email:null,
      username:null,
      password:null
    }
})
const { value: email } = useField('email')
const { value: username } = useField('username')
const { value: password } = useField('password')
const handleChange = (event) =>{
  setFieldValue('email',event.target.value)
}
const handleChange2 = (event) =>{
  setFieldValue('password',event.target.value)
}

const emit= defineEmits(['createAcct'])
const submit = handleSubmit(() => {
    emit('createAcct',{username,password,email})
    
    email.value = ''
    username.value = ''
    password.value = ''
})
</script>

<style scoped>

</style>