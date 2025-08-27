<template>
  <main class="page">
    <section class="form">
      <div class="form__logo">
        <Logo />
      </div>
      <Form class="form__container" @submit.prevent="onSubmit">
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
        > 
          Войти
        </Button>
      </Form>
    </section>
  </main>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Logo from "@/components/Logo.vue";

import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";  

const showErrors = ref(false);

const signInSchema = yup.object({  
  authLogin: yup.string().required("Логин обязателен!"),
  pass1: yup.string().required("Пароль обязателен!"),
});

const { handleSubmit, values, errors, resetForm, setFieldValue } = useForm({
  validationSchema: signInSchema,
  initialValues: {
    authLogin: "",
    pass1: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  alert(`SignIn success!\nAuthLogin: ${values.authLogin}`);
  // Здесь можно добавить логику для авторизации
}, () => {
  showErrors.value = true;
});
</script>

<style lang="scss" scoped></style>