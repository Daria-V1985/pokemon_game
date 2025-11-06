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

import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore'
import { usePokemonStore } from '@/stores/usePokemonStore';
import { useForm } from "vee-validate";
import * as yup from "yup";  

const showErrors = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const pokemonStore = usePokemonStore();

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

onMounted(() => {
  console.log('SignIn компонент смонтирован');
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.loginUser({ 
      login: values.authLogin, 
      password: values.password 
    });
    alert(`Авторизация успешна!\nПользователь: ${authStore.user?.authLogin ?? 'нет данных'}`);
    const authLogin = authStore.user?.authLogin;
    if (authLogin) {
      pokemonStore.loadFromStorage(authLogin);
      if (pokemonStore.userPokemons.length === 0) {
        try {
          await pokemonStore.loadFromAPI(authLogin);
        } catch (err) {
          alert('Не удалось загрузить покемонов из API. Они будут доступны позже. Проверьте подключение к интернету.');
          console.error('Ошибка загрузки покемонов в SignIn:', err);
        }
      }
    }
    router.push('/main');
  } catch {
    showErrors.value = true;
  }
}, () => {
  showErrors.value = true;
});

</script>
