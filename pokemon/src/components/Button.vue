<template>
  <button
    :class="['btn', `btn_${ color }`, { 'btn_rounded': rounded }, { 'btn_outlined': outlined }, { 'btn_large': size === 'large' }]"
    :disabled="disabled"
    @click="clickOnButton">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script lang="ts" setup>

interface btnProps {
  label?: string;
  color?: string;
  disabled?: boolean,
  rounded?: boolean,
  outlined?: boolean,
  size?: "normal" | "large",
}

withDefaults(defineProps<btnProps>(), {
  label: "Button",
  color: "primary",
  disabled: false,
  rounded: false,
  outlined: false,
  size: "normal",
})

const emit = defineEmits<{
  click: [],
}>();

const clickOnButton = () => {
  emit("click");
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.btn {
  max-width: 352px;
  width: 100%;
  padding: 4px 15px;
  gap: 8px;
  color: #fff;
  border-radius: 2px;
  cursor: pointer;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  &_primary {
    @include btn-primary;
    transition: .2s ease;
    &:enabled:hover {
      @include btn-primary-hover;
      transition: .2s ease;
    }
  }
  &_second {
    background: var(--second);
    border: 1px solid var(--second);
    &:enabled:hover {
      background: var(--second-hover);
    }
  }
  &_success {
    background: var(--success);
    border: 1px solid var(--success);
    &:enabled:hover {
      background: var(--success-hover);
    }
  }
  &_info {
    background: var(--info);
    border: 1px solid var(--info);
    &:enabled:hover {
      background: var(--info-hover);
    }
  }
  &_warning {
    background: var(--warning);
    border: 1px solid var(--warning);
    &:enabled:hover {
      background: var(--warning-hover);
    }
  }
  &_danger {
    background: $error;
    border: 1px solid $error;
    &:enabled:hover {
      background: var(--danger-hover);
    }
  }
  &:disabled {
    opacity: .6;
    cursor: default;
  }
  &_rounded {
    border-radius: 15px;
  }
  &_outlined {
    background: transparent;
    color: #000;
    &:hover {
      color: #fff;
    }
  }
  &_icon {
    padding: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  &_large {
    height: 48px;
    padding: 0 30px;
  }
}
</style>
