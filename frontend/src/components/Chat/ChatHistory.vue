<template lang="pug">
  .chat-history(ref="history")

    v-row(v-for="(message, index) in messages" :key="index")
      v-spacer(v-if="message.from === 'me'")
      ChatMessage(:message="message" :ref="`message-${index}`")

    v-row(v-if="isTyping")
      v-col(cols="9")
        PulseLoader(:size="8" color="#b2dfdb")
</template>

<script>
import { mapGetters } from 'vuex';
import { PulseLoader } from '@saeris/vue-spinners';
import ChatMessage from './ChatMessage.vue';

export default {
  name: 'ChatHistory',

  components: {
    ChatMessage,
    PulseLoader,
  },

  created() {
    this.$nextTick(() => {
      if (this.messages.length) this.scrollDown();
    });
  },

  data: () => ({
    scrollDownTimeout: null,
  }),

  methods: {
    scrollDown() {
      if (this.scrollDownTimeout) clearTimeout(this.scrollDownTimeout);
      this.scrollDownTimeout = setTimeout(() => {
        this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
        clearTimeout(this.scrollDownTimeout);
      }, 400);
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
