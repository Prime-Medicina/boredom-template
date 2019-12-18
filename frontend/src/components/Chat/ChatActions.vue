<template lang="pug">
  v-card.chat-actions
    v-card-text.d-flex
      v-text-field(
        placeholder="Message"
        v-model="message.text"
        v-on:keyup.enter="send"
      )
      v-btn(@click="send" :disabled="!isValidMessage") Send
</template>

<script>
export default {
  name: 'ChatActions',

  data: () => ({
    message: {
      from: 'me',
      text: '',
    },
  }),

  methods: {
    send() {
      this.$emit('send', this.message);
      this.message = { from: 'me', text: '', timestamp: Date.now() };
    },
  },

  computed: {
    isValidMessage() {
      return (this.message.text || '').length > 0;
    },
  },
};
</script>
