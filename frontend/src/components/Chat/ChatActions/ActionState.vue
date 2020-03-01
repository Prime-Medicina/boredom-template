<template lang="pug">
  v-form(ref="form").action-state
    v-autocomplete(
      v-model="message"
      :items="states"
      item-text="name"
      item-value="fu"
      :hint="config.hint"
      persistent-hint
      :append-outer-icon="outerIcon"
      v-on:keyup.enter="send"
      @click:append-outer="send"
      ref="input"
      autofocus
      clearable
      :loading="loading",
      :rules="rules"
    )
      template(v-slot:selection="data")
        v-chip(
          :input-value="data.selected"
          @click="data.select"
        )
          v-avatar(left size="20")
            v-img(:src="data.item.flagLink")
          |                   {{ data.item.name }}

      template(v-slot:item="data")
        v-list-item-avatar(size="20")
          img(:src="data.item.flagLink")
        v-list-item-content
          v-list-item-title(v-html="data.item.name")
</template>

<script>
import { common } from 'juriscloud';

export default {
  name: 'ActionState',

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

    getStateByFu(fu) {
      return this.states.find((state) => state.fu === fu);
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
        const state = value ? this.getStateByFu(value) : {};
        this.$emit('input', {
          ...this.value,
          content: state.fu,
          mask: state.name,
        });
      },
    },

    states: () => common.lists.states.brazil,

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
