<template lang="pug">
  v-container#chat(fluid fill-height)
    v-row.fill-height
      v-col.fill-height
        Chat
</template>

<script>
import Chat from '@/components/Chat/index.vue';

export default {
  name: 'ChatView',

  components: {
    Chat,
  },

  data: () => ({}),

  methods: {},
};
</script>
