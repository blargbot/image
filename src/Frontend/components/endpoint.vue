<template>
  <div class='endpoint-wrapper'>
      <h3><code class='method'>{{endpoint.method}}</code>{{endpoint.title}}</h3>
      <div class='endpoint'>Endpoint: <code>{{endpoint.endpoint}}</code></div>
      <p>{{endpoint.description}}</p>
      <table class='body-params mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp'>
        <thead>
            <tr>
                <th class='mdl-data-table__cell--non-numeric'>Name</th>
                <th class='mdl-data-table__cell--non-numeric'>Type</th>
                <th class='mdl-data-table__cell--non-numeric'>Default</th>
                <th class='mdl-data-table__cell--non-numeric'>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="param in endpoint.body" v-bind:key="param.name">
                <td class='mdl-data-table__cell--non-numeric'><code>{{param.name}}</code></td>
                <td class='mdl-data-table__cell--non-numeric'><code>{{param.type}}</code></td>
                <td class='mdl-data-table__cell--non-numeric'><code>{{param.default}}</code></td>
                <td class='mdl-data-table__cell--non-numeric'>{{param.description}}</td>
            </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: Object,
      default: function() {
        return {
          title: "Example Endpoint",
          endpoint: "/image/example",
          method: "POST",
          description: "This is an example endpoint.",
          body: [
            {
              name: "text",
              type: "String",
              description: "The text to use."
            },
            {
              name: "font",
              type: "String?",
              default: "Comic Sans MS",
              description: "The font to use."
            }
          ]
        };
      }
    }
  }
};
</script>

<style scoped>
.endpoint {
  font-size: 1.3em;
  margin-bottom: 10px;
}
code.method {
  border-radius: 5px;
  padding: 3px;
  border: 1px solid #000;
  background: none;
  margin-right: 10px;
}

table.body-params code {
  background: none;
}

.endpoint-wrapper {
  margin: 30px 0;
}
</style>