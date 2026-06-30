// experiment.config.js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    runtime: {
        globalObject: 'sgdPlayground',
        includeEmergencyBrake: true,
    },
    live: {
        variation: 0,
        overlay: 'visible',
        profile: 'ephemeral',
    },
};
