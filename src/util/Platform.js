/* global PushNotification, device, navigator */
const _ = require('lodash');
const isMobileLib = require('ismobilejs');
const {
    log
} = require('../util/DevTools').default;
const VERSIONS = require('../enums/VERSIONS').default;

//=====================================
// Private Methods
//=====================================

let getBalboaUrl = null;
let getBuildName = null;
let getVersionNumber = null;
let hasPush = null;
let isAndroid = null;
let isEspeakers = null;
let isIos = null;
let isIpadPro = null;
let isMobile = null;
let isPhone = null;
let isPhoneGap = null;
let isProduction = null;
let isSolutionTree = null;
let isTablet = null;

getBalboaUrl = () => {
    if (isSolutionTree()) {
        return process.env.REACT_APP_BALBOA_URL_ST;
    } else {
        return process.env.REACT_APP_BALBOA_URL_MAIN;
    }
}

getBuildName = () => {
    return _.toLower(process.env.REACT_APP_BUILD || 'main');
};

getVersionNumber = () => {
    return VERSIONS[getBuildName()] || VERSIONS.main;
};

hasPush = () => {
    return (typeof PushNotification !== 'undefined');
};

isEspeakers = () => {
    return (getBuildName() === 'main');
};

isIpadPro = (browser) => {
    let result = isMobileLib.tablet;
    let isIphone = /iPhone/i.test(navigator.userAgent);

    // iPad Pro reports itself as an iPhone...
    if (result === false && isIphone && (browser.width >= 768 || browser.height >= 1004)) {
        result = true;
    }

    return result;
};

isMobile = (browser) => {
    return isPhone(browser) || isTablet(browser);
};

isPhone = (browser) => {
    let result = isMobileLib.phone;

    // now compare browser resolutions
    if (browser.greaterThan.small) {
        result = false;
    }

    if (result === true && isIpadPro(browser)) {
        result = false;
    }

    return result;
};

isPhoneGap = () => {
    return (typeof PushNotification !== 'undefined' || typeof device !== 'undefined');
};

isProduction = () => {
    return (process.env.NODE_ENV === 'production');
};

isSolutionTree = () => {
    return (getBuildName() === 'st');
};

isTablet = (browser) => {
    let result = isMobileLib.tablet;

    // now compare browser resolutions
    if (browser.lessThan.small) {
        result = false;
    }

    if (result === false) {
        result = isIpadPro(browser);
    }

    return result;
};

isIos = () => {
    return isPhoneGap() && 'iOS' === device.platform;
};

isAndroid = () => {
    return isPhoneGap() && 'Android' === device.platform;
};

export default {
    isPhoneGap,
    isProduction,
    hasPush,
    isSolutionTree,
    isEspeakers,
    getBalboaUrl,
    getBuildName,
    getVersionNumber,
    isMobile,
    isPhone,
    isIpadPro,
    isTablet,
    isIos,
    isAndroid
};
