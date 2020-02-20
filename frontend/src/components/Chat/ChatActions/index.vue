<template lang="pug">
  form.chat-actions

    ActionText(
      v-if="requirements.type === 'text'"
      v-model="message.content"
      :hint="requirements.hint"
      :onSend="send"
    )

    ActionNumber(
      v-if="requirements.type === 'number'"
      v-model="message.content"
      :hint="requirements.hint"
      :onSend="send"
    )

    ActionCep(
      v-if="requirements.type === 'cep'"
      v-model="message.content"
      :hint="requirements.hint"
      :onSend="send"
    )

    ActionNationality(
      v-if="requirements.type === 'nationality'"
      v-model="message.content"
      :hint="requirements.hint"
      :onSend="send"
    )

    ActionCivilStatus(
      v-if="requirements.type === 'civil_status'"
      v-model="message.content"
      :hint="requirements.hint"
      :onSend="send"
    )
</template>

<script>
import { mapGetters } from 'vuex';
import ActionText from './ActionText.vue';
import ActionNumber from './ActionNumber.vue';
import ActionCep from './ActionCep.vue';
import ActionNationality from './ActionNationality.vue';
import ActionCivilStatus from './ActionCivilStatus.vue';

export default {
  name: 'ChatActions',

  components: {
    ActionText,
    ActionNumber,
    ActionCep,
    ActionNationality,
    ActionCivilStatus,
  },

  data: () => ({
    message: {
      from: 'me',
      content: undefined,
    },
  }),

  methods: {
    send() {
      const { cursor, message } = this;
      this.$store.dispatch('chat/sendMessage', { cursor, message });
      this.message = { from: 'me', content: undefined };
    },
  },

  computed: {
    isValidMessage() { // TODO requirements should be considered here
      return (this.message.content || '').length > 0;
    },
    ...mapGetters('chat', {
      cursor: 'cursor',
      requirements: 'requirements',
    }),
  },

  watch: {
    requirements(req) {
      // FIXME create a generic component to ask user if the suggestion is ok
      if (req) this.message.content = req.suggestion;
    },
  },
};
</script>

<style scoped>
.chat-actions {
  width: 100%;
}
</style>
