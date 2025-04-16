const Immutable = require('immutable');

export default Immutable.Record({
    "is_royalty": new Immutable.Record({
        is_set: false,
        intval: 1
    })(),
    "mp_lineitem": new Immutable.Record({
        is_set: false,
        intval: 2
    })(),
    "bill_later": new Immutable.Record({
        is_set: false,
        intval: 4
    })(),
    "free": new Immutable.Record({
        is_set: false,
        intval: 8
    })()
});

