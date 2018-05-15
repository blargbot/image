<template>
  <div class='endpoint-wrapper'>
    <h3 :id='endpoint.endpoint'>{{endpoint.title}}</h3>
    <div class='endpoint'>
      <span class='method'>{{endpoint.method}}</span>
      <code>{{endpoint.endpoint}}</code>
    </div>
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
          <td class='mdl-data-table__cell--non-numeric'>
            <code>{{param.name}}</code>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <code>{{param.type}}{{param.optional ? '?' : ''}}</code>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <code>{{param.default}}</code>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>{{param.description}}</td>
        </tr>
      </tbody>
    </table>
    <div class='mdl-card mdl-shadow--2dp example-card'>
      <div class='mdl-card__title' v-on:click='toggleDropdown'>
        <div class='mdl-card__title-text'>
          Example: Click Here
        </div>
      </div>
      <div class='dropdown'>
        <img :src='"/img/example/" + identifier + "." + endpoint.type'>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleDropdown(event) {
      this.toggled = !this.toggled;
      let t = event.target;
      if (t.className.endsWith("-text")) t = t.parentElement;
      t = t.parentElement;
      let d = t.querySelector(".dropdown");
      let i = t.querySelector("img");
      if (this.toggled) d.style.maxHeight = i.height + "px";
      else d.style.maxHeight = "0";
    }
  },
  data: () => ({
    toggle: false
  }),
  props: {
    identifier: {
      type: String,
      default: "example"
    },
    endpoint: {
      type: Object,
      default: function() {
        return {
          title: "Example Endpoint",
          endpoint: "/image/example",
          method: "POST",
          description: "This is an example endpoint.",
          type: "png",
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
.example-card .dropdown {
  max-height: 0px;
  transition-duration: 0.5s;
}
.example-card.toggled .dropdown {
  max-height: 800px;
}
.example-card {
  margin: 20px auto;
  width: 512px;
  min-height: 0;
}
.example-card .mdl-card__title-text {
  user-select: none;
}
.example-card .mdl-card__title {
  cursor: pointer;
}
.example-card .mdl-card__title:hover {
  background: rgba(0, 0, 0, 0.1);
}
.endpoint {
  font-size: 1.3em;
  margin-bottom: 10px;
}
h3 {
  display: block;
  position: relative;
}
span.method {
  border-radius: 5px;
  padding: 3px;
  user-select: none;
  border: 1px solid #000;
  background: none;
  margin-right: 10px;
  font-size: 0.9em;
  vertical-align: middle;
}

table.body-params {
  max-width: 100%;
  width: 100%;
}

table.body-params td {
  white-space: normal;
}

table.body-params code {
  background: none;
}

.endpoint-wrapper {
  margin: 30px 0;
}

img {
  width: 100%;
}
</style>
