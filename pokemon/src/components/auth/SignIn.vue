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
      name="password" 
      label="Пароль" 
      placeholder="Введите пароль"
      type="password"
      :value="values.password"
      @update:value="pass => setFieldValue('password', pass)"
      :error="showErrors && errors.password ? [errors.password] : []" 
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
  password: yup.string().required("Пароль обязателен!"),
});

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: signInSchema,
  initialValues: {
    authLogin: "",
    password: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.loginUser({ 
      login: values.authLogin, 
      password: values.password 
    });

    if (authStore.isAuth && authStore.user) {            
      alert(`Авторизация успешна! Добро пожаловать, ${authStore.user.login}!`);
      router.push('/main');
    } else {
      throw new Error('Ошибка инициализации пользовательских данных');
    }
  } catch (err) {
    console.error('Ошибка в компоненте SignIn:', err);
    showErrors.value = true;
    console.error('Ошибка авторизации:', err);
    alert(err instanceof Error ? err.message : 'Ошибка авторизации');
  }
}, () => {
  showErrors.value = true;
});

</script>
