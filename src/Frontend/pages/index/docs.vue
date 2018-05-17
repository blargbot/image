<template>
  <div>
    <h1>Documentation</h1>
    <p>All requests require an
      <code>Authorization</code> header set to the provided token. Request bodies can be either JSON or form-encoded.</p>
    <h2>API Endpoint Base</h2>
    <p>All requests are prefixed with the following base:</p>
    <div class='quote'>
      <pre><code>/api/v1/</code></pre>
    </div>

    <h2>Endpoints</h2>
    <ul class='contents'>
      <li v-for='(endpoint, identifier) in endpoints' v-bind:key='endpoint.endpoint'>
        <a :href='"/app/docs#" + endpoint.endpoint' class='mdl-button mdl-js-button contents-button mdl-button--colored'>{{identifier}}</a>
      </li>
    </ul>

    <endpoint v-for="(endpoint, identifier) in endpoints" v-bind:key="endpoint.endpoint" v-bind:endpoint="endpoint" v-bind:identifier="identifier"></endpoint>
  </div>
</template>

<script>
import endpoint from "../../components/endpoint.vue";

export default {
  data: () => ({
    endpoints: []
  }),
  components: { endpoint: endpoint },
  mounted() {
    this.$axios
      .get("/data")
      .then(res => {
        this.endpoints = res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<style>
.contents-button {
  text-align: left;
  min-width: 200px;
}
</style>
