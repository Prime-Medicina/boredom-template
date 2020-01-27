<template lang="pug">
  v-text-field(
    v-if="actionType === chatActionTypes.TEXT"
    placeholder="Message"
    append-outer-icon="mdi-send"
    v-model="message.text"
    v-on:keyup.enter="send"
    @click:append-outer="send"
  )
</template>

<script>
import chatActionTypes from '../../modules/enum/chatActionTypes';

export default {
  name: 'ChatActions',

  props: {
    actionType: {
      type: String,
      required: true,
      enum: [...chatActionTypes.asArray],
    },
  },

  data: () => ({
    message: {
      from: 'me',
      text: '',
    },
  }),

  methods: {
    send() {
      this.$emit('send', { ...this.message, timestamp: Date.now() });
      this.message = { from: 'me', text: '' };
    },
  },

  computed: {
    isValidMessage() {
      return (this.message.text || '').length > 0;
    },

    chatActionTypes() {
      return chatActionTypes;
    },
  },
};
</script>
