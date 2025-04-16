import {connect} from "react-redux";

/**
 * Generates a SpeakerList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SpeakerListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    // const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {SpeakerCardFactory} = require('../cards');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const SpeakerCard = SpeakerCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
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
         * Used in debug messaging
         */
        displayName: 'SpeakerList',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {speakerInfo} = this.props;
            const speakerList = speakerInfo.get('speakerList');

            return <List>
                {speakerList ? speakerList.map((speaker) => {
                    return <div key={`speaker-${speaker.get('sid')}`}>
                        <SpeakerCard
                            speaker={speaker}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component)
}

export { SpeakerListFactory }