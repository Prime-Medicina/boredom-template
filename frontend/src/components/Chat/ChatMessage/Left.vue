<template lang="pug">
  v-scale-transition
    v-chip.ma-2.elevation-3(color="blue" v-show="show")
      v-avatar(left)
        v-icon mdi-account-circle
      strong {{ message.from }}:
      | {{ message.content }}
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

  data: () => ({
    show: false,
  }),

  created() {
    setTimeout(() => {
      this.show = true;
    }, 100);
  },
};
</script>
