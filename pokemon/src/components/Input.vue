<template>
  <div class="form-input" :style="{ width }">
    <input
      class="input-text"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :value="props.value"
      @input="updateValue"
      :class="{ 'input-error': error && error.length > 0 }"
    />
    <label :for="name" class="input-label">
      <span class="star">*</span>
      {{ props.label }}
    </label>
    <div class="form-error">
      <div class="form-error__message" v-for="(message, index) in error" :key="index">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  error: {
    type: Array as () => string[],
    required: false
  },
  value: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "text"
  },
  placeholder: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: "352px"
  }
})

const emit = defineEmits(["update:value"])
const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  //console.log("Emitting value:", target.value);
  emit("update:value", target.value);
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.form {
  &-input {
    margin-bottom: 38px;
    position: relative;
    &:last-of-type {
      margin-bottom: 24px;
    }
  }
  &-error {
    margin-top: 4px;
    border-radius: 2px;
    font-size: 12px;
    color: $error;

  }
}
.input {
  &-text {
    padding: 0 10px;
    height: 32px;
    border: 1px solid $neutral;
    border-radius: 2px;
    font-size: 14px;
    line-height: 22px;
    color: $text;
    width: 100%;
    position: relative;
    margin-top: 8px;
    z-index: 1;
    outline: none;
    &:focus {
      & + .input-label {
        z-index: 1;
        opacity: 1;
        top: -20px;
      }
    }
    &:not(:placeholder-shown) {
      & + .input-label {
        z-index: 1;
        opacity: 1;
        top: -20px;
      }
    }
    &::placeholder {
      color: $placeholder;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
  &-label {
    display: block;
    position: absolute;
    top: 20px;
    opacity: 0;
    z-index: -1;
    font-size: 14px;
    color: $text;
  }
  &-error {
    border: 1px solid $error;
    box-shadow: 2px 0.5px 3px $error;
    transition: all 0.13s ease-in-out;
  }
}

.star {
  color: $error;
}

</style>