/**
 * Generates a JobEventView component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const JobEventViewFactory = (spec) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Components
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {JobOfferSectionFactory} = require('../../components/JobOfferSection');

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../../mixins');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        }
    });

    const EventMixin = EventMixinFactory({
        prepareFormDataOverride: (inst) => {
            // no-op
        }
    });

    const FormHelperMixin = FormHelperMixinFactory({});
    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);
    const JobOfferSection = JobOfferSectionFactory({});
    const EventInfoCard = EventInfoCardFactory({});

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'JobEventView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return (
                <div>
                    <EventInfoCard />

                    <JobOfferSection />
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobEventViewFactory }