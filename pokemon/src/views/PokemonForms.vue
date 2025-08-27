<template>
  <main class="page">
    <section class="form">
      <div class="form__logo">
        <Logo />
      </div>
      <Form class="form__container" @submit.prevent="onSubmit">  
        <Tabs 
          :names="tabs"
          :selectedTab="selectedTab"
          @changeTab="changeTab"
        >
          <router-link to="/signup">Регистрация</router-link>
          <router-link to="/signin">Вход</router-link>
        </Tabs> 
      </Form>
    </section>
  </main>
</template>  

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useForm } from "vee-validate";
import * as yup from "yup";  

import Tabs from "@/components/Tabs.vue";
import Logo from "@/components/Logo.vue";

const tabs = [
  {name: "SignUp", label: "Регистрация"},
  {name: "SignIn", label: "Вход"},
];

const selectedTab = ref("SignIn");
const showErrors = ref(false);
const router = useRouter();

const signInSchema = yup.object({  
  authLogin: yup.string().required("Логин обязателен!"),
  pass1: yup.string().required("Пароль обязателен!"),
});

const signUpSchema = yup.object({
  regLogin: yup.string().required("Логин обязателен!"),
  pass2: yup.string().required("Пароль обязателен!").min(8, "Пароль должен быть не менее 8 символов"),
  agPass: yup.string()
    .oneOf([yup.ref("pass2")], "Пароли не совпадают!") 
    .required("Требуется подтверждение пароля!"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: computed(() => selectedTab.value === "SignUp" ? signUpSchema : signInSchema),
  initialValues: {
    regLogin: "",
    pass2: "",
    agPass: "",
    authLogin: "",
    pass1: "",
  },
});

const changeTab = (tabName: string) => {
  selectedTab.value = tabName;
  showErrors.value = false;
  resetForm();
}

const onSubmit = handleSubmit(async (values) => {
  if (selectedTab.value === "SignUp") {
    alert(`SignUp success!\nLogin: ${values.regLogin}`);
  } else {
    try {
      const data = await loginUser({ 
        login: values.authLogin, 
        password: values.pass1 
      });
      alert(`SignIn success!\nAuthLogin: ${data.authLogin}`);
      router.push('/main');
    } catch (err: unknown) {
      if (err instanceof Error) {
      console.error('Ошибка:', err.message);
      throw new Error(err.message);
    } else {
      console.error('Неизвестная ошибка:', err);
      throw new Error('Неизвестная ошибка');
    }
    }
  }
}, () => {
  showErrors.value = true;
});

async function loginUser (cred: object) {
  try {
    const response = await fetch('https://9d6066f5473655c8.mokky.dev/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cred),
    });

    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }

    const data = await response.json();
    return data;
  }
  catch (err) { 
    console.error('Ошибка:', err);
    throw err;
  }
}

</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  &__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
	}
	&__container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    padding: 24px;
    max-width: 400px;
    width: 100%;
	}
}

</style>
