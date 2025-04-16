/**
 * Generates a MiscView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const MiscViewFactory = (spec) => {
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

    // Factories
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {MiscFormFactory} = require('../../forms/MiscForm');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
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
        prepareMiscFormData,
        saveEvent
    } = EventActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     * Handles the ActionListForm submission
     *
     * @param {object} form - Form values
     * @param {object} inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');

        const data = prepareMiscFormData(event, form);

        const mergedEvent = modifiedEvent.merge(data);

        saveEvent(mergedEvent);
    };

    /**********************************
     * Factories
     *********************************/

    const EventInfoCard = EventInfoCardFactory({});
    const FormLoading = FormLoadingFactory({});
    const MiscForm = MiscFormFactory({});

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
        displayName: 'MiscView',

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
            return (
                <FormLoading>
                    <EventInfoCard/>
                    <MiscForm
                        ref='miscForm'
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

export { MiscViewFactory }