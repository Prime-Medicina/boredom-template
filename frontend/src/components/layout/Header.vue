<template lang="pug">
  #app-header
    v-navigation-drawer(v-model="drawer" app clipped v-if="isDev")
      v-list-item-group(v-model="currentRoute" dense)

        v-list-item(@click="navigate('/')" value="main")
          v-list-item-action
            v-icon mdi-view-dashboard
          v-list-item-content
            v-list-item-title Dashboard

        v-list-item(@click="navigate('/color-palette')" value="color-palette")
          v-list-item-action
            v-icon mdi-palette
          v-list-item-content
            v-list-item-title Color Palette

    v-app-bar(app clipped-left)
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
      v-toolbar-title Juriscloud
</template>

<script>
import { NODE_ENV } from '@/config';

export default {
  name: 'AppHeader',

  data: () => ({
    drawer: null,
    currentRoute: null,
  }),

  methods: {
    navigate(location) {
      this.$router.push(location);
    },
  },

  computed: {
    isDev() {
      return NODE_ENV === 'development';
    },
  },

  watch: {
    '$route.name': function watchRoute(newVal) {
      this.currentRoute = newVal;
    },
  },
};
</script>
