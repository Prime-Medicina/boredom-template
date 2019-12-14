<template lang="pug">
  v-container#collor-pallete(fluid)
    v-row(align="center" justify="center")
      v-card.ma-3.pa-6(
        v-for="(theme, themeIndex) in themes" :key="themeIndex"
        outlined
        tile
        :light="theme === 'light'"
        :dark="theme === 'dark'"
      )
        v-card-title {{ capitalize(theme) }} Theme
        v-card-text
          v-row(align="center" justify="center")
            v-chip.ma-3.pa-6(
              v-for="(color, colorIndex) in colors"
              :color="color"
              :key="themeIndex + colorIndex"
              large
            ) {{ color }}
</template>

<script>
export default {
  name: 'ColorPalette',

  data: () => ({
    themes: ['light', 'dark'],
    colors: [
      'primary',
      'accent',
      'secondary',
      'success',
      'info',
      'warning',
      'error',
    ],
  }),

  methods: {
    capitalize(string) {
      const firstLetter = string[0].toUpperCase();
      const tail = string.substring(1, string.length);
      return `${firstLetter}${tail}`;
    },
  },
};
</script>
