let beta;
try {
    beta = _config.beta === true;
} catch (err) {
    beta = false;
}

module.exports = {
    dev: beta,
    srcDir: 'src/Frontend',
    build: {
        vendor: ['axios'],
        extractCSS: true
    },
    modules: [
        ["@nuxtjs/axios", {
            baseURL: beta ? 'http://localhost:8079/api/v1' : 'https://api.blargbot.xyz/api/v1'
        }]
    ],
    head: {
        meta: [{
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }],
        script: [
            { src: 'https://code.getmdl.io/1.3.0/material.min.js', body: true }
        ],
        link: [
            { rel: 'shortcut icon', type: 'image/png', href: '/img/favicon.png' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
            { rel: 'stylesheet', href: 'https://code.getmdl.io/1.3.0/material.teal-pink.min.css' },
            { rel: 'stylesheet', href: '/css/style.css' }
        ]
    },
    router: {
        base: '/app/',
        // extendRoutes(routes, resolve) {
        //     routes.push({
        //         path: '/',
        //         component: resolve(__dirname, 'renders/wrapper.vue'),
        //         children: [
        //             {
        //                 name: 'main', path: '/',
        //                 component: resolve(__dirname, 'renders/index.vue')
        //             },
        //             {
        //                 name: 'terms', path: '/terms',
        //                 component: resolve(__dirname, 'renders/terms.vue')
        //             },
        //             {
        //                 name: 'docs', path: '/docs',
        //                 component: resolve(__dirname, 'renders/docs.vue')
        //             },
        //         ]
        //     });
        // }
    }
};