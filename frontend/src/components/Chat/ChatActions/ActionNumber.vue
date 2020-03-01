<template lang="pug">
  v-form(ref="form").action-number
    v-text-field(
      type="number"
      :placeholder="config.hint"
      :minlength="config.minLength"
      :maxlength="config.maxLength"
      :rules="rules"
      counter
      autofocus
      clearable
      :append-outer-icon="outerIcon"
      v-model="message"
      v-on:keyup.enter="send"
      @click:append-outer="send"
      ref="input"
      :loading="loading"
    )
</template>

<script>
export default {
  name: 'ActionNumber',

  props: {
    value: {
      type: Object,
      required: false,
    },
    config: {
      type: Object,
      required: false,
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
