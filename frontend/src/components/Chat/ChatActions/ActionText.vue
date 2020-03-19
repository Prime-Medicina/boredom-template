<template lang="pug">
  v-form(ref="form" lazy-validation).action-text
    v-text-field(
      type="text"
      :placeholder="config.hint"
      :minlength="config.minLength"
      :maxlength="config.maxLength"
      :rules="rules"
      counter
      autofocus
      clearable
      ref="input"
      :append-outer-icon="outerIcon"
      v-model="message"
      v-on:keyup.enter="send"
      @click:append-outer="send"
      :loading="loading"
    )
</template>

<script>
export default {
  name: 'ActionText',

  props: {
    value: {
      type: Object,
      required: true,
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

  data: () => ({
    valid: false,
  }),

  created() {
    this.$nextTick(() => {
      this.$refs.input.focus();
      if (this.hasContent) this.validate();
    });
  },

  methods: {
    send(e) {
      if (e) e.preventDefault();
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
