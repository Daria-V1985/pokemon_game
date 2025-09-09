<template>
  <Form @submit.prevent="onSubmit">
    <Input 
      name="authLogin" 
      label="Логин" 
      placeholder="Введите логин"
      :value="values.authLogin"
      @update:value="log => setFieldValue('authLogin', log)"
      :error="showErrors && errors.authLogin ? [errors.authLogin] : []"
    />
    <Input 
      name="pass1" 
      label="Пароль" 
      placeholder="Введите пароль"
      type="password"
      :value="values.pass1"
      @update:value="pass => setFieldValue('pass1', pass)"
      :error="showErrors && errors.pass1 ? [errors.pass1] : []" 
    />
    <Button
      color="primary"
      type="submit"
      :disabled="authStore.loading"
    > 
      {{ authStore.loading ? 'Вход...' : 'Войти' }}
    </Button>
  </Form>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";

import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore'
import { useForm } from "vee-validate";
import * as yup from "yup";  

const showErrors = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const signInSchema = yup.object({  
  authLogin: yup.string().required("Логин обязателен!"),
  pass1: yup.string().required("Пароль обязателен!"),
});

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: signInSchema,
  initialValues: {
    authLogin: "",
    pass1: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.loginUser({ 
      login: values.authLogin, 
      password: values.pass1 
    });
    alert(`SignIn success!\nAuthLogin: ${authStore.user?.authLogin ?? 'нет данных'}`);
    router.push('/main');
  } catch {
    showErrors.value = true;
  }
}, () => {
  showErrors.value = true;
});

</script>
