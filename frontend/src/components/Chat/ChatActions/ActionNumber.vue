<template lang="pug">
  v-text-field.action-number(
    type="number"
    :placeholder="hint"
    append-outer-icon="mdi-send"
    v-model="model"
    v-on:keyup.enter="send"
    @click:append-outer="send"
  )
</template>

<script>
export default {
  name: 'ActionNumber',

  props: {
    value: {
      type: String,
      required: false,
    },
    hint: {
      type: String,
      required: false,
    },
    onSend: {
      type: Function,
      required: true,
    },
  },

  methods: {
    send() {
      this.onSend(this.model);
    },
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
