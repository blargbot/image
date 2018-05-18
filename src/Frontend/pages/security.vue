<template>
    <div>
        <div v-if="$store.state.user && $store.state.user.id === '103347843934212096'">
            <div class='mdl-textfield mdl-js-textfield'>
                <input class="mdl-textfield__input" type="text" id="token" v-model='id'>
                <label class="mdl-textfield__label" for="token">ID</label> 
            </div>
            <div class='token-wrapper'>
                <button class='mdl-button mdl-js-button mdl-js-ripple-effect' v-on:click="addUser">
                    Add
                </button>
                <button class='mdl-button mdl-js-button mdl-js-ripple-effect' v-on:click="removeUser">
                    Remove
                </button>
            </div>
        </div>
        <div v-else>heck off</div>
    </div>
</template>

<script>
export default {
    data: () => ({
        id: null
    }),
    methods: {
        async addUser() {
            try {
                let res = await this.$axios.$put('/user/' + this.id);
                if (res.ok === true) this.toast('Success!');
            } catch (err) {
                this.toast('Failure: ' + err.message + '\n' + (err.response.data ? err.response.data.message : 'That\'s all there is...'));
            }
        },
        async removeUser() {
            try {
                let res = await this.$axios.$delete('/user/' + this.id);
                if (res.ok === true) this.toast('Success!');
                else this.toast(res.message);
            } catch (err) {
                this.toast('Failure: ' + err.message + '\n' + (err.response.data ? err.response.data.message : 'That\'s all there is...'));
            }
        },
        toast(text) {
            let snackbarContainer = document.querySelector('#snackbar');
            snackbarContainer.MaterialSnackbar.showSnackbar({message:text});
        }
    }
}
</script>


<style scoped>

</style>
