<template lang="pug">
  .chat-history(ref="history")

    v-row(v-for="(message, index) in messages" :key="index")
      v-spacer(v-if="message.from === 'me'")
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

  created() {
    if (this.messages.length) this.scrollDown();
  },

  methods: {
    scrollDown() {
      setTimeout(() => {
        this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
      }, 500);
    },
  },

  computed: {
    ...mapGetters('chat', {
      isTyping: 'isTyping',
      messages: 'sortedMessages',
    }),
  },

  watch: {
    messages() {
      this.scrollDown();
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
