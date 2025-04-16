/**
 * This is largely copied over from My Events.  Handles a lot of authentication
 * logic.
 *
 * @param {object} spec
 */
const AuthedUserSessionFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');

    // Utilities
    const esUtils = require('ES/utils/esUtils');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    const {
        sessionData
    } = spec;

    const packages = {
        STARTER: 7,
        PLUS: 6,
        PROFESSIONAL: 5,
        PRO: 5
    };

    sessionData.balboa = {};

    _.map(sessionData, (value, key) => {
        if (key !== 'permissions' && key !== 'balboa') {
            sessionData.balboa[key] = value;
        }
    });

    let getSIDsAtAccessLevels = null;
    let getSIDsNotAtAccessLevels = null;
    let getSIDsAtPackageLevel = null;
    let getEventSIDsNotAtAccessLevel = null;


    getSIDsAtAccessLevels = (levels) => {
        if (!_.isArray(levels)) {
            levels = [levels];
        }
        return _.map(_.filter(_.toPairs(sessionData.permissions), (pair) => {
            return _.includes(levels, pair[1].access);
        }), (pair) => {
            return _.parseInt(pair[0]);
        });
    };

    getSIDsNotAtAccessLevels = (levels) => {
        if (!_.isArray(levels)) {
            levels = [levels];
        }
        return _.map(_.reject(_.toPairs(sessionData.permissions), (pair) => {
            return _.includes(levels, pair[1].access);
        }), (pair) => {
            return _.parseInt(pair[0]);
        });
    };

    getSIDsAtPackageLevel = (level) => {
        if (!_.isString(level) || !packages[level.toUpperCase()]) {
            return null;
        }
        let level_num = packages[level.toUpperCase()];
        return _.map(_.filter(_.toPairs(_.mapValues(sessionData.permissions, 'version')), (pair) => {
            return pair[1] === level_num;
        }), (pair) => {
            return _.parseInt(pair[0]);
        });
    };

    getEventSIDsNotAtAccessLevel = (event, levels) => {
        let sids_at_level = getSIDsAtAccessLevels(levels);
        return _.reject(event.sids, (sid) => {
            return _.includes(sids_at_level, sid);
        });
    };

    let MY_USERNAME = sessionData.balboa && sessionData.balboa.username;
    MY_USERNAME = _.isString(MY_USERNAME) ? MY_USERNAME.trim().toUpperCase() : 'ME';

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return {
        balboa: sessionData.balboa || {},
        permissions: sessionData.permissions || {},
        balboa2_ical_token: sessionData.balboa2_ical_token || '',
        getSIDsAtAccessLevels: getSIDsAtAccessLevels,
        getSIDsNotAtAccessLevels: getSIDsNotAtAccessLevels,
        getSIDsAtPackageLevel: getSIDsAtPackageLevel,
        is_logged_in: MY_USERNAME !== 'ME',
        MY_USERNAME: MY_USERNAME,

        //utility functions
        // TODO: Security restrictions need to be implemented
        getSIDsCanViewDashboard() {
            return getSIDsAtAccessLevels(['ADMN', 'SPKR', 'FULL', 'READ']);
        },
        getEventSIDsNotAtAccessLevel: getEventSIDsNotAtAccessLevel,
        eventOnlyHasAccessLevels(event, levels) {
            return getEventSIDsNotAtAccessLevel(event, levels).length === 0;
        }
    };
}

export default AuthedUserSessionFactory;