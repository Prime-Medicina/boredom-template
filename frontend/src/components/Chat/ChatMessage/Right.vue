<template lang="pug">
  v-chip.ma-2.elevation-3(color="red")
    strong {{ message.from }}:
    | {{ message.content }}
    v-avatar(right)
      v-icon mdi-account-circle
</template>

<script>
export default {
  name: 'ChatMessageRight',

  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>
