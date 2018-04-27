<template>
  <div id='app'>
    <pageheader></pageheader>
    <main>
      <div class='container'>
        <nuxt/>
      </div>
    </main>
    <pagefooter></pagefooter>
  </div>
</template>

<script>
import footer from "../components/footer.vue";
import header from "../components/header.vue";

export default {
  data: () => ({}),
  components: { pagefooter: footer, pageheader: header }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
main {
  flex: 1 0 auto;
}
footer,
header {
  flex-shrink: 0;
}
</style>