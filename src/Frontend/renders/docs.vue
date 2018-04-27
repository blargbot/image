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

export default {
  data: () => ({
    endpoints: [
      {
        title: "Poem",
        endpoint: "/image/poem",
        method: "POST",
        description: "Writes a lovely DDLC poem.",
        body: [
          {
            name: "text",
            type: "String?",
            default: "Just Monika",
            description: "The poem's content."
          },
          {
            name: "name",
            type: "String?",
            default: "monika",
            description:
              "The name of the girl who is writing the poem. One of 'monika', 'sayori', 'yuri', and 'natsuki'."
          },
          {
            name: "yuri",
            type: "Number?",
            description: "The Yuri variation to use. Either blank, 1, or 2."
          }
        ]
      }
    ]
  }),
  components: { endpoint: endpoint }
};
</script>

<style>

</style>
