<template>
    <div>
        <h1>Documentation</h1>
        <p>All requests require an <code>Authorization</code> header set to the provided token. Request bodies can be either JSON or form-encoded.</p>
        <h2>API Endpoint Base</h2>
        <p>All requests are prefixed with the following base:</p>
        <div class='quote'><pre><code>/api/v1/</code></pre></div>

        <endpoint v-for="endpoint of endpoints" v-bind:key="endpoint.endpoint" v-bind:endpoint="endpoint"></endpoint>
    </div>
</template>

<script>
import endpoint from "../components/endpoint.vue";
import axios from "axios";

export default {
  data: () => ({
    endpoints: []
  }),
  components: { endpoint: endpoint },
  mounted() {
    axios
      .get("/api/v1/data/")
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

</style>
