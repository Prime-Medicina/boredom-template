<template lang="pug">
  v-card.fill-height.d-flex.flex-column(flat)
    v-card-text.fill-height.d-flex.flex-column
      ChatHistory.pa-2.ma-1.flex-grow-1(
        :messages="history"
      )
    v-card-actions.actions
      ChatActions(
        v-if="actionType"
        v-on:send="handleMessage"
        :action-type="actionType"
        :action-options="actionOptions"
      )
</template>

<script>
import ChatActions from './ChatActions.vue';
import ChatHistory from './ChatHistory.vue';
import { TEXT } from '../../modules/enum/chatActionTypes';

export default {
  name: 'Chat',

  components: {
    ChatActions,
    ChatHistory,
  },

  data: () => ({
    messages: [],
  }),

  created() {
    this.init();
  },

  methods: {
    async init() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = {
          from: 'BOT',
          text: 'Hello, I am a robot! What is your name?',
          timestamp: Date.now(),
          requirements: {
            actionType: TEXT,
            options: {
              minLength: 8,
              maxLength: 50,
            },
          },
        }; // Future enquire call -> Start enquire process here

        this.messages.push(response);
      } catch (err) {
        console.error(err);
      }
    },

    async handleMessage(message) {
      await (() => 'noop')(); // Future enquire call
      this.messages.push(message);
      await this.waitForResponse();
    },

    async waitForResponse() {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.messages.push({ from: 'bot', text: `LMFAO-${Date.now()}`, timestamp: Date.now() });
    },
  },

  computed: {
    history() {
      return [...this.messages].sort((a, b) => a.timestamp - b.timestamp);
    },

    lastBotMessage() {
      return this.messages.reduce((result, current) => {
        if (current.from !== 'BOT') return result;
        return current;
      }, { requirements: {} });
    },

    actionType() {
      return this.lastBotMessage.requirements.actionType;
    },

    actionOptions() {
      return this.lastBotMessage.requirements.actionOptions;
    },
  },
};
</script>

<style scoped>
.actions {
  padding: 0 5vh 1vh 5vh;
}
</style>
