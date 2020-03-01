<template lang="pug">
  v-form(ref="form").action-cep
    v-text-field(
      type="text"
      placeholder="CEP"
      :append-outer-icon="outerIcon"
      minlength="9"
      maxlength="9"
      v-model="message"
      v-mask="mask"
      v-on:keyup.enter="send"
      @click:append-outer="send"
      ref="input"
      autofocus
      clearable
      counter
      :loading="loading"
      :rules="computedRules"
    )
</template>

<script>
import { mask } from 'vue-the-mask';

export default {
  name: 'ActionCep',

  directives: {
    mask,
  },

  props: {
    value: {
      type: Object,
      required: false,
    },
    config: {
      type: Object,
      required: true,
    },
    onSend: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Array,
      required: true,
    },
  },

  created() {
    this.$nextTick(() => {
      this.$refs.input.focus();
      if (this.hasContent) this.validate();
    });
  },

  data: () => ({
    valid: false,
    mask: '#####-###',
  }),

  methods: {
    send() {
      if (!this.valid) return;
      this.onSend(this.message);
    },

    validate() {
      if (!this.$refs.form) return;
      this.valid = this.hasContent && this.$refs.form.validate();
    },
  },

  computed: {
    outerIcon() {
      if (this.valid) {
        return 'mdi-send';
      }
      return undefined;
    },

    computedRules() {
      return [
        ...this.rules,
        (value) => (!!value && String(value).length === 9) || 'CEP inválido',
      ];
    },

    message: {
      get() {
        return this.value.content;
      },
      set(value) {
        this.$emit('input', {
          ...this.value,
          content: value,
        });
      },
    },

    hasContent() {
      const { message } = this;
      if (message === null || message === undefined) return false;
      return !!message;
    },
  },

  watch: {
    message() {
      this.validate();
    },
  },
};
</script>
