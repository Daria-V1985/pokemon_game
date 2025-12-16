<template>
  <Form @submit.prevent="onSubmit">
    <Input 
      name="regLogin" 
      label="Логин" 
      placeholder="Введите логин"
      :value="values.regLogin"
      @update:value="log => setFieldValue('regLogin', log)"
      :error="showErrors && errors.regLogin ? [errors.regLogin] : []"
    />
    <Input 
      name="regPass" 
      label="Пароль" 
      placeholder="Введите пароль"
      type="password"
      :value="values.regPass"
      @update:value="pass => setFieldValue('regPass', pass)"
      :error="showErrors && errors.regPass ? [errors.regPass] : []"
    />
    <Input 
      name="agPass" 
      label="Повторение пароля" 
      placeholder="Введите пароль еще раз"
      type="password"
      :value="values.agPass"
      @update:value="pass => setFieldValue('agPass', pass)"
      :error="showErrors && errors.agPass ? [errors.agPass] : []"
    />
    <Button
      color="primary"
      type="submit"
      :disabled="regStore.loading"
    >
      {{ regStore.loading ? 'Регистрация...' : 'Зарегистрироваться' }}
    </Button>
  </Form>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";

import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useRegStore } from '@/stores/RegStore'
import { useForm } from "vee-validate";
import * as yup from "yup";  

const showErrors = ref(false);
const router = useRouter();
const regStore = useRegStore();

interface AuthUser {
  id: string | number;
  name: string;
}

interface UnifiedState {
  money: number;
  pokemons: any[];
}

const signUpSchema = yup.object({
  regLogin: yup.string().required("Логин обязателен!"),
  regPass: yup.string().required("Пароль обязателен!").min(8, "Пароль должен быть не менее 8 символов"),
  agPass: yup.string()
    .oneOf([yup.ref("regPass")], "Пароли не совпадают!") 
    .required("Требуется подтверждение пароля!"),
});

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: signUpSchema,
  initialValues: {
    regLogin: "",
    regPass: "",
    agPass: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const registeredUser = await regStore.registerUser({ 
      login: values.regLogin, 
      password: values.regPass,
      agPass: values.agPass 
    });
    const userId = registeredUser?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9); 
    const username = values.regLogin;
    const authUser: AuthUser = {
      id: userId,
      name: username,
    };
    const LS_KEY = `qwery_${username}`;
    const initialState: UnifiedState = {
      money: 0,  
      pokemons: [],  
    };
    localStorage.setItem(LS_KEY, JSON.stringify(initialState));
    console.log(`Регистрация успешна! Сохранено в LS под ключом: ${LS_KEY}`, initialState);
    localStorage.setItem('authUser', JSON.stringify(authUser));
    alert('Регистрация успешна! Перейдите на вкладку "Вход"');
    router.push('/');
  } catch {
    showErrors.value = true;
  }
}, () => {
  showErrors.value = true;
});
</script>

