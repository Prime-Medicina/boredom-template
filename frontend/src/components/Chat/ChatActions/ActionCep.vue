<template lang="pug">
  v-text-field.answer-text(
    type="text"
    placeholder="Message"
    append-outer-icon="mdi-send"
    v-model="model"
    v-mask="mask"
    v-on:keyup.enter="send"
    @click:append-outer="send"
  )
</template>

<script>
export default {
  name: 'ActionCep',

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

  data: () => ({
    mask: '99999-999',
  }),

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
