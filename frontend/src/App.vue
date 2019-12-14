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
