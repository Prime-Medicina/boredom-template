<template lang="pug">
  form.chat-actions

    v-text-field(
      placeholder="Message"
      append-outer-icon="mdi-send"
      v-model="message.content"
      v-on:keyup.enter="send"
      @click:append-outer="send"
    )

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatActions',

  data: () => ({
    message: {
      from: 'me',
      content: '',
    },
  }),

  methods: {
    send() {
      const { cursor, message } = this;
      this.$store.dispatch('chat/sendMessage', { cursor, message });
      this.message = { from: 'me', content: '' };
    },
  },

  computed: {
    isValidMessage() { // TODO requirements should be considered here
      return (this.message.content || '').length > 0;
    },
    ...mapGetters('chat', {
      cursor: 'cursor',
      requirements: 'requirements',
    }),
  },
};
</script>

<style scoped>
.chat-actions {
  width: 100%;
}
</style>
