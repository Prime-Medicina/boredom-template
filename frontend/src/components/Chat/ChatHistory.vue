<template lang="pug">
  v-card.chat-history
    v-card-text.history(ref="history")
        v-row(v-for="(message, index) in messages" :key="index")
          ChatMessage(:message="message" :ref="`message-${index}`")
</template>

<script>
import ChatMessage from './ChatMessage/index.vue';

export default {
  name: 'ChatHistory',

  props: {
    messages: {
      type: Array,
      required: true,
    },
  },

  components: {
    ChatMessage,
  },

  methods: {
    isMessageFromMe(message) {
      return message.from === 'me';
    },

    focusMessage(index) {
      this.$nextTick(() => {
        const messageElement = this.$refs[`message-${index}`];
        if (messageElement) {
          this.$refs.history.scrollTop = messageElement[0].$el.offsetTop;
        } else {
          setTimeout(() => this.focusMessage(index), 100);
        }
      });
    },
  },

  watch: {
    messages() {
      this.focusMessage(this.messages.length - 1);
    },
  },
};
</script>

<style scoped>
.history {
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (max-width: 959px) {
  .history {
    height: calc(100vh - 346px);
  }
}

@media screen and (min-width: 960px) {
  .history {
    height: calc(100vh - 354px);
  }
}
</style>
