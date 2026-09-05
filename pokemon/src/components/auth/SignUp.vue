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
import { useRegStore } from '@/stores/RegStore';
import { useAuthStore } from '@/stores/AuthStore'
import { useForm } from "vee-validate";
import * as yup from "yup";  

const showErrors = ref(false);
const router = useRouter();
const regStore = useRegStore();
const authStore = useAuthStore();

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
    if (registeredUser) {
      authStore.user = registeredUser;
      authStore.isAuth = true;
      authStore.saveAuthData();

      alert('Регистрация успешна! Вы автоматически вошли в систему.');
      router.push('/main');
    }
  } catch {
    showErrors.value = true;
  }
}, () => {
  showErrors.value = true;
});
</script>

