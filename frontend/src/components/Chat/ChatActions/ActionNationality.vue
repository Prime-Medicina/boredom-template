<template lang="pug">
  v-autocomplete.action-nationality(
    v-model="model"
    :items="nations"
    item-text="name"
    item-value="numericCode"
    :hint="hint"
    persistent-hint
    append-outer-icon="mdi-send"
    v-on:keyup.enter="send"
    @click:append-outer="send"
  )
    template(v-slot:selection="data")
      v-chip(
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="clear()"
      )
        v-avatar(left size="20")
          v-img(:src="data.item.flagLink")
        |                   {{ data.item.name }}
    template(v-slot:item="data")
      v-list-item-avatar(size="20")
        img(:src="data.item.flagLink")
      v-list-item-content
        v-list-item-title(v-html="data.item.name")
</template>

<script>
import { common } from 'juriscloud';

export default {
  name: 'ActionNationality',

  props: {
    value: {
      type: String,
      required: false,
    },
    hint: {
      type: String,
      required: false,
    },
    onSend: {
      type: Function,
      required: true,
    },
  },

  methods: {
    send() {
      this.onSend(this.model);
    },

    clear() {
      this.model = undefined;
    },
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    nations: () => common.lists.nations,
  },
};
</script>
