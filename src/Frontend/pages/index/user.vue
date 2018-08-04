<template>
  <div>
    <div v-if="$store.state.user">
        <div class='user-profile'>
            <img class='avatar' :src="$store.state.user.avatarURL">
            <span class='username'>{{$store.state.user.username}}#{{$store.state.user.discriminator}}</span>
        </div>

        <div v-if="$store.state.user.hasAccount">
            <div class='mdl-tabs mdl-js-tabs mdl-js-ripple-effect' id='tab-bar'>
                <div class='mdl-tabs__tab-bar'>
                    <a href="/app/user/#" class='mdl-tabs__tab' id='router-token' v-on:click="navigate" data-page='token'>Token</a>
                    <a href="/app/user/#" class='mdl-tabs__tab' id='router-stats' v-on:click="navigate" data-page='stats'>Statistics</a>
                </div>
            </div>
            <div class='view'>
                <router-view>
                </router-view>
            </div>
        </div>
        <div v-else class='view'>You do not have an account. Please contact <span class='mention'>@stupid cat#8160</span> to get one.</div>
    </div>
    <div v-else>
        <p>You are not authenticated.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({ 
        user: null
    }),
    methods: {
        navigate(event) {
            event.preventDefault();
            let t = event.target;
            while (t.tagName !== 'A')
                t = t.parentNode;
            let page = t.getAttribute('data-page');
            this.$router.push('/user/' + page);
        }
    },
    mounted() {
        // this.$axios.$get('/user/@me').then(data => {
        //     this.user = data;
        // })
        let route = this.$router.currentRoute.fullPath.split('/');
        if (route.length === 3) {
            let bar = document.getElementById('tab-bar');
            if (bar) {
                let _t = bar.querySelector('.is-active');
                if (_t) _t.classList.remove('is-active');
                let button = document.getElementById('router-' + route[2]);
                if (button) button.classList.add('is-active');
                bar.classList.add('is-upgraded');                
            }
        }
    },
    updated() {
        let route = this.$router.currentRoute.fullPath.split('/');
        if (route.length === 3) {
            let bar = document.getElementById('tab-bar');
            if (bar) {
                let _t = bar.querySelector('.is-active');
                if (_t) _t.classList.remove('is-active');
                let button = document.getElementById('router-' + route[2]);
                if (button) button.classList.add('is-active');
                bar.classList.add('is-upgraded');
            }
        }
        //componentHandler.upgradeAllRegistered();
    }
};
</script>

<style>
.contents-button {
  text-align: left;
  min-width: 200px;
}

.user-profile {
    display: flex;
    align-items: center;
}

.user-profile .username {
    font-size: 3em;
    flex: 1 0 auto;
    margin-left: 20px;
}

.user-profile img.avatar {
    border-radius: 500px;
    flex: 0 0 auto;
    align-self: center;
}

.view {
    margin-top: 25px;
}
</style>
