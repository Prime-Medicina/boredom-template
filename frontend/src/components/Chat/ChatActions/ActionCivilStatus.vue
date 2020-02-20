<template lang="pug">
  v-radio-group.action-civil-status(
    v-model="model"
    row
  )
    v-radio(label="Solteiro" value="single")
    v-radio(label="Casado" value="maried")
</template>

<script>
export default {
  name: 'ActionCivilStatus',

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
  },
};
</script>
