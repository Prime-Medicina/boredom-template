<template lang="pug">
  .chat-history(ref="history")

    v-row(v-for="(message, index) in messages" :key="index")
      ChatMessage(:message="message" :ref="`message-${index}`")

    v-row(v-if="isTyping")
      v-col(cols="9") ...

</template>

<script>
import { mapGetters } from 'vuex';
import ChatMessage from './ChatMessage/index.vue';

export default {
  name: 'ChatHistory',

  components: {
    ChatMessage,
  },

  methods: {
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

  computed: {
    ...mapGetters('chat', {
      messages: 'sortedMessages',
      isTyping: 'isTyping',
    }),
  },

  watch: {
    messages() {
      const lastMessageIndex = this.messages.length - 1;
      this.focusMessage(lastMessageIndex);
    },
  },
};
</script>

<style scoped>
.chat-history {
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (max-width: 959px) {
  .chat-history {
    height: calc(100vh - 346px);
  }
}

@media screen and (min-width: 960px) {
  .chat-history {
    height: calc(100vh - 354px);
  }
}
</style>
