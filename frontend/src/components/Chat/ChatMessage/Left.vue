<template lang="pug">
  v-chip.ma-2.elevation-3(color="blue")
    v-avatar(left)
      v-icon mdi-account-circle
    strong {{ message.from }}:
    | {{ message.text }}
</template>

<script>
export default {
  name: 'ChatMessageLeft',

  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>
