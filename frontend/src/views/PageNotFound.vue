<template lang="pug">
  v-container(fill-height)
    v-row(justify="center")
      v-flex.d-flex.flex-column.flex-shrink-1.flex-grow-0
        h1.display-2.primary--text Erro 404
        p A página que você tentou acessar não existe.
        v-btn(
          :to="{ path: '/' }"
          outline="outline"
          color="primary"
        ) Me tire daqui!
</template>

<script>
export default {
  name: 'PageNotFound',
};
</script>
