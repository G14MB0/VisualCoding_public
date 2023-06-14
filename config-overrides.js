const pathBrowserify = require.resolve("path-browserify");
const fsExtra = require.resolve("fs-extra");

module.exports = function override(config, env) {
    config.resolve = {
        ...config.resolve,
        fallback: {
            ...config.resolve.fallback,
            path: pathBrowserify,
            fs: fsExtra,
        },
    };

    return config;
};
