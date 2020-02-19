<template lang="pug">
  v-card.fill-height.d-flex.flex-column(flat)
    v-card-text.fill-height.d-flex.flex-column
      ChatHistory.pa-2.ma-1.flex-grow-1
    v-card-actions.actions
      ChatActions
</template>

<script>
import { mapGetters } from 'vuex';
import ChatActions from './ChatActions.vue';
import ChatHistory from './ChatHistory.vue';

export default {
  name: 'Chat',

  components: {
    ChatActions,
    ChatHistory,
  },

  created() {
    this.$store.dispatch('chat/initialize');
  },

  computed: {
    ...mapGetters({
      messages: 'sortedMessages',
    }),
  },
};
</script>

<style scoped>
.actions {
  padding: 0 5vh 1vh 5vh;
}
</style>
