
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
        try {
            let user = await app.$axios.$get('/user/@me', {
                headers: {
                    cookie: req.headers.cookie
                }
            });
            commit('setUser', normalizeUser(user))
        } catch (err) {

        }
        // }
    }
}