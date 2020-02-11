<template lang="pug">
  form.chat-actions

    v-text-field(
      v-if="requirements.type === 'text'"
      placeholder="Message"
      append-outer-icon="mdi-send"
      v-model="message.text"
      v-on:keyup.enter="send"
      @click:append-outer="send"
    )

</template>

<script>
export default {
  name: 'ChatActions',

  props: {
    requirements: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    message: {
      from: 'me',
      text: '',
    },
  }),

  methods: {
    send() {
      this.$emit('send', { ...this.message, timestamp: Date.now() });
      this.message = { from: 'me', content: '' };
    },
  },

  computed: {
    isValidMessage() { // TODO requirements should be considered here
      return (this.message.text || '').length > 0;
    },
  },
};
</script>
