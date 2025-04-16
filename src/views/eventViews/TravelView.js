/**
 * Generates a TravelView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const TravelViewFactory = (spec) => {
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

    // Forms
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {
        TravelFormFactory
    } = require('../../forms');

    const {
        TravelListFactory
    } = require('../../components/list');

    // Actions
    const {
        EventActionsFactory
    } = require('../../actions');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        saveEvent
    } = EventActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const EventInfoCard = EventInfoCardFactory({});
    const TravelForm = TravelFormFactory({});
    const TravelList = TravelListFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     * Handles the TravelForm submission
     *
     * @param {object} form - Form values
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            dispatch,
            event
        } = inst.props;
        const modifiedEvent = event.get('modifiedEvent');

        // merge in saved data
        // TODO maybe this should be in the store
        const mergedEvent = modifiedEvent.merge(form);

        saveEvent(mergedEvent);
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messages
         */
        displayName: 'TravelView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                expandAllTravel: false,
                toggledTravelId: 0
            };
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                expandAllTravel
            } = this.state;

            return <div>

                <EventInfoCard/>

                <TravelList/>

                <TravelForm
                    formId="travelForm"
                    onSubmit={(form) => {
                        _submitHandler(form, this);
                    }}/>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TravelViewFactory }