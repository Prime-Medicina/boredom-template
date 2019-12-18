<template lang="pug">
  v-app

    Header

    Content

    Footer

</template>

<script>
import { Header, Content, Footer } from './components/layout';

export default {
  name: 'App',

  components: {
    Header,
    Content,
    Footer,
  },

  data: () => ({
    drawer: null,
  }),
};
</script>

<style>
::-webkit-scrollbar {
  width:6px;
}
::-webkit-scrollbar-track {
  background:#c0c0c0;
  border-radius:0px
}
::-webkit-scrollbar-thumb {
  background:#dddddd;
  border-radius:0px;
}
</style>
