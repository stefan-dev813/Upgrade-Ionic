const _ = require('lodash');

function ArrayDispatchMiddleware() {
    return (next) => {
        return (action) => {
            if (!_.isArray(action)) {
                return next(action);
            }

            _.map(action, (a) => {
                next(a);
            });
        };
    };
}

export default ArrayDispatchMiddleware;