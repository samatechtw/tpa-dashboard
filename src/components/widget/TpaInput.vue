<template>
<div class="tpa-input-wrap">
  <input
    :class="{
      'tpa-input': true,
      'error-input': errorMessage,
      [inputClass]: inputClass,
      'has-suffix': suffix,
    }"
    :autocomplete="autocomplete"
    :value="modelValue"
    :type="inputType"
    :disabled="isDisabled"
    :placeholder="placeholder"
    :name="`input${_uid}`"
    :maxlength="maxLength"
    @input="$emit('update:modelValue', $event.target.value)"
    @focusout="$emit('focusout', $event.target.value)"
    @keyup.enter="$emit('handle-enter')"
  >
  <span v-if="suffix" class="suffix">{{ suffix }}</span>
  <ErrorMessage
    :errorMessage="errorMessage"
    :errorSubMessage="errorSubMessage"
  />
</div>
</template>

<script>
import ErrorMessage from '/src/components/widget/ErrorMessage.vue';
import UidMixin from '/src/utils/UidMixin';

export default {
  name: 'tpa-input',
  components: {
    ErrorMessage,
  },
  mixins: [UidMixin],
  emits: ['update:modelValue', 'focusout', 'handle-enter'],
  props: {
    modelValue: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    errorMessage: {
      type: String,
      default: null,
    },
    errorSubMessage: {
      type: String,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: String,
      default: null,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
    suffix: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showPasswordFlag: false,
    };
  },
  computed: {
    inputType() {
      return this.showPasswordFlag ? 'text' : (this.type || 'text');
    },
  },
  methods: {
    togglePassword() {
      this.showPasswordFlag = !this.showPasswordFlag;
    },
  },
};
</script>

<style lang="postcss">

.tpa-input-wrap {
  margin-bottom: 15px;
  margin-top: 16px;
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  > input {
    box-sizing: border-box;
    padding-top: 3px;
  }

  .input-icon {
    position: absolute;
    top: 17px;
    width: auto;
    height: 14px;

    &.input-icon-dollar {
      left: 18px;
    }

    &.input-icon-eye {
      right: 18px;
      z-index: 9;
      cursor: pointer;
    }
  }

  .tpa-input {
    font-family: 'Montserrat', 'Avenir', 'sans-serif';
    font-size: 17px;
    font-weight: 400;
    color: black;
    background: none;
    width: 100%;
    height: 48px;
    outline: none;
    outline-style: none;
    box-shadow: none;
    border: 1px solid #e6e6e6;
    padding-left: 16px;
    padding-right: 16px;

    &.has-suffix {
      padding-right: 64px;
    }

    &:disabled {
      background-color: #fff !important;
    }

    &:focus::-webkit-input-placeholder {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    /* stylelint-disable */
    &:-internal-autofill-selected,
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      /* Disable background color of input autocomplete */
      box-shadow: 0 0 0 100px #fff inset !important;
      font-size: initial !important;
    }
    /* stylelint-enable */

    &[type=number] {
      -moz-appearance: textfield;
    }
    &[type=number]::-webkit-inner-spin-button,
    &[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .suffix {
    font-family: 'Montserrat', 'Avenir', 'sans-serif';
    font-size: 14px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.4);
    font-size: 16px;
    position: absolute;
    top: 14px;
    right: 12px;
  }

  .bo {
    border: 1px solid red;
  }
}

</style>
