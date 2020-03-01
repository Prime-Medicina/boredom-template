<template lang="pug">
  v-container#chat(fluid fill-height)
    v-row.fill-height(justify-md="center")
      v-col.fill-height(md="8")
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
