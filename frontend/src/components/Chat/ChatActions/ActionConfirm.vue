<template lang="pug">
  v-form(ref="form").action-confirm
    v-row
      v-flex.d-flex.flex-column.flex-shrink-0.flex-grow-1
        v-radio-group(
          v-model="message"
          row
          :loading="loading"
          :rules="rules"
          v-on:keyup.enter="send"
        )
          v-radio(
            v-for="(choice, index) in config.choices"
            :key="index"
            :label="choice.label"
            :value="choice.value"
          )
      v-flex.d-flex.flex-column.flex-shrink-1.flex-grow-0(align-self-center)
        v-btn(icon v-on:click="send" v-if="outerIcon")
          v-icon(left) {{ outerIcon }}
</template>

<script>
export default {
  name: 'ActionConfirm',

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
  }),

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
        const choice = this.config.choices.find((c) => c.value === value);
        this.$emit('input', {
          ...this.value,
          content: choice.value,
          mask: choice.label,
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
