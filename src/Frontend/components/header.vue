<template>
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <router-link class="mdl-layout-title mdl-navigation__link" to="/">blargbot API</router-link>
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
      <!-- Navigation -->
      <nav class="mdl-navigation">
        <router-link to='/docs' class="mdl-navigation__link">Documentation</router-link>
      </nav>
    </div>
  </header>
</template>

<style>

</style>


<script>
export default {
  data: () => ({}),
  created() {}
};
</script>

<style scoped>
.brand-logo {
  position: unset;
  transform: none;
}

.breadcrumb {
  display: inline-block;
  vertical-align: top;
}
</style>