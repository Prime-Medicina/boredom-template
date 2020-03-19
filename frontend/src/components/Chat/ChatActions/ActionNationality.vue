<template lang="pug">
  v-form(ref="form").action-nationality
    v-autocomplete(
      v-model="message"
      :items="nations"
      item-text="name"
      item-value="numericCode"
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

const getNationByCode = (code) => common.lists.nations.find((n) => n.numericCode === code);

export default {
  name: 'ActionNationality',

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
        const nation = value ? getNationByCode(value) : {};
        this.$emit('input', {
          ...this.value,
          content: nation.numericCode,
          mask: nation.name,
        });
      },
    },

    nations: () => common.lists.nations,

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
