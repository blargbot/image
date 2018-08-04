const cookieparser = require('cookieparser');

export const state = () => ({
    user: null,
});

export const mutations = {
    setUser(state, user) {
        state.user = user
    }
};

function normalizeUser(obj = {}) {
    let user = {
        id: obj.id,
        username: obj.username,
        discriminator: obj.discriminator,
        avatarURL: `https://cdn.discordapp.com/avatars/${obj.id}/${obj.avatar}.png`,
        hasAccount: obj.hasAccount
    }

    return user;
}

export const actions = {
    async nuxtServerInit({ commit }, { app, req }) {
        // if (req.session.user) {
        //     commit('setUser', normalizeUser(req.session.user));
        // } else {
        if (req.headers.cookie)
            try {
                let parsed = cookieparser.parse(req.headers.cookie);
                if (parsed.stoken) {
                    let user = await app.$axios.$get('/user/@me');
                    console.log(user);
                    commit('setUser', normalizeUser(user))
                }
            } catch (err) {
                console.error(err.response ? err.response.data : 'no data', err);
            }
        // }
    }
}