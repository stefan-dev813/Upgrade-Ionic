/**
 * Generates a ServicesView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const ServicesViewFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {ServicesFormFactory} = require('../../forms/ServicesForm');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory
    } = require('../../actions');

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
     * Methods
     *********************************/

    let _submitHandler;

    /**
     * Handles ServicesForm submission
     *
     * @param {object} form - Form values
     * @param {object} inst
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

    /*********************************
     * Factories
     *********************************/

    const EventInfoCard = EventInfoCardFactory({});
    const FormLoading = FormLoadingFactory({});
    const ServicesForm = ServicesFormFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        }
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
        displayName: 'ServicesView',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return (
                <FormLoading>
                    <EventInfoCard/>

                    <ServicesForm
                        ref='servicesForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }
                    />
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ServicesViewFactory }
