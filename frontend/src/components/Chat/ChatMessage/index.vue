<template lang="pug">
  v-row.chat-message

    v-col(v-if="!isMessageFromMe" cols="9")
      Left(:message="message")

    v-spacer

    v-col.d-flex.justify-end(v-if="isMessageFromMe" cols="9")
      Right(:message="message")
</template>

<script>
import Left from './Left.vue';
import Right from './Right.vue';

export default {
  name: 'ChatMessage',

  props: {
    message: {
      type: Object,
      required: true,
    },
  },

  components: {
    Left,
    Right,
  },

  computed: {
    isMessageFromMe() {
      return this.message.from === 'me';
    },
  },
};
</script>
