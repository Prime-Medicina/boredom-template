<template lang="pug">
  v-card.fill-height.d-flex.flex-column(flat)
    v-card-text.fill-height.d-flex.flex-column
      ChatHistory.pa-2.ma-1.flex-grow-1(
        ref="chatHistory"
        :messages="history"
      )
    v-card-actions.actions
      ChatActions(
        v-if="requirements"
        v-on:send="handleMessage"
        :requirements="requirements"
      )
</template>

<script>
import ChatActions from './ChatActions.vue';
import ChatHistory from './ChatHistory.vue';
// import chatActionTypes from '../../modules/enum/chatActionTypes';
import conversationCursors from '../../modules/enum/conversationCursors';
import { enquire } from '../../modules/api';

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default {
  name: 'Chat',

  components: {
    ChatActions,
    ChatHistory,
  },

  data() {
    return {
      messages: [],
      requirements: null,
      cursor: conversationCursors.initialize,
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.handleMessage({ cursor: this.cursor, timestamp: Date.now(), from: 'me' }); // Initialize enquirer
    },

    async handleMessage(message) {
      if (this.cursor !== conversationCursors.initialize) {
        this.messages.push(message);
      }

      const { cursor, answers, requirements } = await enquire({ message, cursor: this.cursor });

      for (const answer of answers) {
        await this.$refs.chatHistory.startTyping(randomIntFromInterval(250, 550));
        this.messages.push({ ...answer, timestamp: Date.now() });
      }

      this.cursor = cursor;
      this.requirements = requirements;
    },
  },

  computed: {
    history() {
      return [...this.messages].sort((a, b) => a.timestamp - b.timestamp);
    },
  },
};
</script>

<style scoped>
.actions {
  padding: 0 5vh 1vh 5vh;
}
</style>
