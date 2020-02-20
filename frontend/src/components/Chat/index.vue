<template lang="pug">
  v-card.fill-height.d-flex.flex-column(flat)
    v-card-text.fill-height.d-flex.flex-column
      ChatHistory.pa-2.ma-1.flex-grow-1
    v-card-actions.actions
      ChatActions
</template>

<script>
import ChatActions from './ChatActions/index.vue';
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
};
</script>

<style scoped>
.actions {
  padding: 0 5vh 1vh 5vh;
}
</style>
