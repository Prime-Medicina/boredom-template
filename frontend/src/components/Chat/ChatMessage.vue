<template lang="pug">
  v-row.chat-message(:class="rowClass")
    v-col(cols="9" :class="colStyle")

      v-expand-transition
        .message-box.elevation-3(:class="messageStyle" v-show="show")
          .message-content
            v-avatar(:class="avatarClass" size="30")
              v-icon(v-if="message.failed") mdi-alert-circle
              v-img(:src="loggedUser.profile.imageUrl" v-else-if="isMessageFromMe")
              v-img(src="@/assets/logo.png" v-else)
            | {{ (message.mask || message.content) }}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatMessage',

  props: {
    message: {
      type: Object,
      required: true,
    },
  },

  created() {
    setTimeout(() => {
      this.show = true;
    }, 100);
  },

  data: () => ({
    show: false,
  }),

  computed: {
    ...mapGetters('auth', {
      loggedUser: 'loggedUser',
    }),

    isMessageFromMe() {
      return this.message.from === 'me';
    },

    messageStyle() {
      if (this.message.type === 'error') {
        return 'left-message red lighten-4';
      }
      return this.isMessageFromMe
        ? 'right-message light-blue lighten-4'
        : 'left-message teal lighten-4';
    },

    rowClass() {
      return this.isMessageFromMe
        ? 'right-row'
        : 'left-row';
    },

    colStyle() {
      return this.isMessageFromMe
        ? 'd-flex justify-end'
        : '';
    },

    avatarClass() {
      return this.isMessageFromMe
        ? 'right-avatar'
        : 'left-avatar';
    },
  },
};
</script>

<style scoped>
.message-box {
  float: left;
  min-height: 30px;
  margin-left: 5px;
  border-radius: 8px;
}

.message-content {
  float: left;
  margin: 5px;
  padding: 5px 10px 5px 10px;
}

.right-row {
  display: contents;
}

.right-avatar {
  float: right;
  margin: 0 0 0 10px;
}

.left-avatar {
  margin: 0 10px 0 0;
}
</style>
