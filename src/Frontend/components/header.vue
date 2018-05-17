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
        <router-link v-if="$store.state.user" to='/user' class="mdl-navigation__link">
          <strong>{{$store.state.user.username}}#{{$store.state.user.discriminator}}</strong>
          <img :src="$store.state.user.avatarURL" class='avatar'>
        </router-link>
        <a :href="$store.state.user ? '/logout' : '/login'" class="mdl-navigation__link">
          {{$store.state.user ? 'Logout' : 'Login'}}
        </a>
        
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
img.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50px;
  margin-left: 5px;
}
</style>