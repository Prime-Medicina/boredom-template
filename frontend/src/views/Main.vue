<template lang="pug">
  v-container#main(fluid fill-height)
    v-row.fill-height
      v-col(cols="12")
        v-card.ma-3.fill-height
          v-card-text.fill-height
            v-container(fluid fill-height)
              v-row.fill-height
                v-col(cols="12")
                  ChatHistory
                  ChatActions
</template>

<script>
import ChatHistory from '../components/ChatHistory.vue';
import ChatActions from '../components/ChatActions.vue';

export default {
  name: 'Main',

  components: {
    ChatHistory,
    ChatActions,
  },

  data: () => ({}),

  methods: {},
};
</script>

<style>
  .chat-history {
    margin-bottom: 10px;
  }
</style>
