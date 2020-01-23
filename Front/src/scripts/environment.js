/* jshint node: true */
const config = {
    modulePrefix: 'share-drop',
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
        FEATURES: {
            // Here you can enable experimental features on an ember canary build
            // e.g. 'with-controller': true
        },
        EXTEND_PROTOTYPES: {
            // Prevent Ember Data from overriding Date.parse.
            Date: false,
        },
    },

    APP: {
        // Here you can pass flags/options to your application instance
        // when it is created
    },

    FIREBASE_URL: process.env.FIREBASE_URL,
};