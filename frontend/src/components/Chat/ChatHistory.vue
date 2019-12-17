<template lang="pug">
  v-card.chat-history
    v-card-text
      v-row(v-for="message in messages" :key="JSON.stringify(message)")
        span(v-if="isMessageFromMe(message)")
          v-chip.ma-2(color="blue")
            v-avatar(left)
              v-icon mdi-account-circle
            strong {{ message.from }}:
            | {{ message.text }}
        span(v-else)
          v-chip.ma-2(color="red")
            strong {{ message.from }}:
            | {{ message.text }}
            v-avatar(right)
              v-icon mdi-account-circle
</template>

<script>
export default {
  name: 'ChatHistory',

  props: {
    messages: {
      type: Array,
      required: true,
    },
  },

  methods: {
    isMessageFromMe(message) {
      return message.from === 'me';
    },
  },
};
</script>
