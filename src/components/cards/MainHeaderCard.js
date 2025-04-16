/**
 * Creates an MainHeaderCard component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const MainHeaderCardFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Actions
    const {
        SpeakerInfoActionsFactory
    } = require('../../actions');

    // Components
    const {BaseHeaderCardFactory} = require('./BaseHeaderCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        determineMsm
    } = SpeakerInfoActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const BaseHeaderCard = BaseHeaderCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            nav: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'MainHeaderCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                nav,
                speakerInfo
            } = this.props;

            const mainView = nav.get('mainView');

            let heading = mainView.get('label');
            let subHeading;

            if (determineMsm(speakerInfo)) {
                heading = '';

                const selectedSpeaker = speakerInfo.get('selectedSpeaker');

                if (selectedSpeaker) {
                    heading = selectedSpeaker.get('name_full');
                }
                subHeading = mainView.get('label');
            }
            else {
                heading = mainView.get('label');
                subHeading = '';
            }

            return <BaseHeaderCard
                heading={heading}
                subHeading={subHeading}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MainHeaderCardFactory }