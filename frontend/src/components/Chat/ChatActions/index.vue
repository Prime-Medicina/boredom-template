<template lang="pug">
  .chat-actions

    ActionText(
      v-if="config.type === 'text'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionNumber(
      v-if="config.type === 'number'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionCep(
      v-if="config.type === 'cep'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionNationality(
      v-if="config.type === 'nationality'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionChoice(
      v-if="config.type === 'choice'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionCpf(
      v-if="config.type === 'cpf'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionState(
      v-if="config.type === 'state'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )

    ActionPhone(
      v-if="config.type === 'phone'"
      v-model="message"
      :config="config"
      :onSend="send"
      :loading="loading"
      :rules="rules"
    )
</template>

<script>
import { mapGetters } from 'vuex';
import ActionText from './ActionText.vue';
import ActionNumber from './ActionNumber.vue';
import ActionCep from './ActionCep.vue';
import ActionNationality from './ActionNationality.vue';
import ActionChoice from './ActionChoice.vue';
import ActionCpf from './ActionCpf.vue';
import ActionState from './ActionState.vue';
import ActionPhone from './ActionPhone.vue';

export default {
  name: 'ChatActions',

  components: {
    ActionCpf,
    ActionText,
    ActionNumber,
    ActionCep,
    ActionNationality,
    ActionChoice,
    ActionState,
    ActionPhone,
  },

  data: () => ({
    message: {
      from: 'me',
      mask: undefined,
      content: undefined,
    },
    loading: false,
  }),

  methods: {
    async send() {
      if (this.loading) return;
      const {
        cursor, section, subsection, message,
      } = this;
      try {
        this.loading = true;
        await this.$store.dispatch('chat/sendMessage', {
          cursor, section, subsection, message,
        });
        this.message = { from: 'me', mask: undefined, content: undefined };
      } finally {
        this.loading = false;
      }
    },
  },

  computed: {
    rules() {
      return [
        (value) => {
          if (!this.config.required) return true;
          return !!value || 'Resposta obrigatória';
        },
        (value) => {
          if (!this.config.minLength) return true;
          return (!!value && (String(value).length >= this.config.minLength)) || `O tamanho mínimo deste campo é ${this.config.minLength}`;
        },
        (value) => {
          if (!this.config.maxLength) return true;
          return (!!value && (String(value).length <= this.config.maxLength)) || `O tamanho máximo deste campo é ${this.config.maxLength}`;
        },
      ];
    },

    ...mapGetters('chat', {
      cursor: 'cursor',
      section: 'section',
      subsection: 'subsection',
      config: 'config',
    }),
  },

  watch: {
    config(config) {
      // FIXME create a generic component to ask user if the suggestion is ok
      if (config) this.message.content = config.suggestion;
    },
  },
};
</script>

<style scoped>
.chat-actions {
  width: 100%;
  min-height: 70px;
}
</style>
