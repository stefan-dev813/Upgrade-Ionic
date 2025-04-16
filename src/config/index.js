const _ = require('lodash');
let env = process.env.NODE_ENV || 'development';
let build = process.env.REACT_APP_BUILD || 'main';

let config = require('./env/development').default;
const local = require('./env/local').default;

if (env === 'production') {
    config = require('./env/production').default;
}

let buildOverride;

try {
    // Browserify doesn't support dynamic requires, but webpack does
    if (env === 'development') {
        if (build === 'main') {
            buildOverride = require('./env/development-main').default;
        } else if (build === 'st') {
            buildOverride = require('./env/development-st').default;
        }
    } else if (env === 'production') {
        if (build === 'main') {
            buildOverride = require('./env/production-main').default;
        } else if (build === 'st') {
            buildOverride = require('./env/production-st').default;
        }
    }
} catch (e) {
}

export default _.assign(config, buildOverride, (env === 'production' ? null : local));