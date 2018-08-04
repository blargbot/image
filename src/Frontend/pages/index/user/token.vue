<template>
    <div>
        <div class='mdl-textfield mdl-js-textfield field'>
            <input class="mdl-textfield__input" type="text" id="token" :value="token" readonly>
            <label class="mdl-textfield__label" for="token"></label>
        </div>
        <div class='token-wrapper'>
            <button class='mdl-button mdl-js-button mdl-js-ripple-effect' v-on:click="showToken">
                Show
            </button>
            <button class='mdl-button mdl-js-button mdl-js-ripple-effect' v-on:click="regenToken">
                Regen
            </button>
            <button class='mdl-button mdl-js-button mdl-js-ripple-effect' v-on:click="copyToken">
                Copy
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        token: ''
    }),
    methods: {
        async showToken() {
            let token = await this.$axios.$get('/user/@me/token');
            this.token = token.token;
        },
        async regenToken() {
            let token = await this.$axios.$get('/user/@me/token?invalidate=true');
            this.token = token.token;
        },
        copyToken() {
            let t = document.getElementById('token');
            t.select();
            document.execCommand('copy');
            this.toast('Copied Token!');
        },
        toast(text) {
            let snackbarContainer = document.querySelector('#snackbar');
            snackbarContainer.MaterialSnackbar.showSnackbar({message:text});
        }
    },
    mounted() {
        componentHandler.upgradeAllRegistered();
    }
}
</script>

<style scoped>
.token-wrapper {
    display: flex;
}
.field {
    width: 100%;
}
.token-wrapper > button {
    margin: 0 3px;
    flex: 1 0 auto;
}
</style>
