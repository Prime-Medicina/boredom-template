<template lang="pug">
  .chat.fill-height.d-flex.flex-column.mb-6
    ChatHistory.pa-2.ma-1.flex-grow-1(
      :messages="messages"
    )
    ChatActions.pa-2.ma-1.flex-shrink-1(
      v-on:send="handleMessage"
    )
</template>

<script>
import ChatActions from './ChatActions.vue';
import ChatHistory from './ChatHistory.vue';

export default {
  name: 'Chat',

  components: {
    ChatActions,
    ChatHistory,
  },

  data: () => ({
    messages: [],
  }),

  methods: {
    async handleMessage(message) {
      await (() => 'noop')(); // Future enquire call
      this.messages.push(message);
      await this.waitForResponse();
    },

    async waitForResponse() {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.messages.push({ from: 'bot', text: `LMFAO-${Date.now()}` });
    },
  },
};
</script>
