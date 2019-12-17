<template lang="pug">
  v-container#main(fluid fill-height)
    v-row.fill-height
      v-col.fill-height
        v-card.fill-height
          v-card-text.fill-height
            Chat
</template>

<script>
import Chat from '../components/Chat/index.vue';

export default {
  name: 'Main',

  components: {
    Chat,
  },

  data: () => ({}),

  methods: {},
};
</script>
