<template>
  <main class="page">
    <section class="form">
      <div class="form__logo">
        <Logo />
      </div>
      <Form class="form__container" @submit.prevent="onSubmit">
        <Input 
          name="regLogin" 
          label="Логин" 
          placeholder="Введите логин"
          :value="values.regLogin"
          @update:value="log => setFieldValue('regLogin', log)"
          :error="showErrors && errors.regLogin ? [errors.regLogin] : []"
        />
        <Input 
          name="pass2" 
          label="Пароль" 
          placeholder="Введите пароль"
          type="password"
          :value="values.pass2"
          @update:value="pass => setFieldValue('pass2', pass)"
          :error="showErrors && errors.pass2 ? [errors.pass2] : []"
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
        >
          Зарегистрироваться
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
import { useRouter } from 'vue-router';
import { useForm } from "vee-validate";
import * as yup from "yup";  

const router = useRouter();
const showErrors = ref(false);
const loading = ref(false);

const signUpSchema = yup.object({
  regLogin: yup.string().required("Логин обязателен!"),
  pass2: yup.string().required("Пароль обязателен!").min(8, "Пароль должен быть не менее 8 символов"),
  agPass: yup.string()
    .oneOf([yup.ref("pass2")], "Пароли не совпадают!") 
    .required("Требуется подтверждение пароля!"),
});

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: signUpSchema,
  initialValues: {
    regLogin: "",
    pass2: "",
    agPass: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  alert(`SignUp success!\nLogin: ${values.regLogin}`);
  // Здесь можно добавить логику для отправки данных на сервер
}, () => {
  showErrors.value = true;
});
</script>

<style lang="scss" scoped></style>