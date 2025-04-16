/**
 * Generates a CustomView component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @return {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const CustomViewFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const {connect} = require('react-redux');
    const {Map} = require('immutable');

    // Components
    const {CustomFormFactory} = require('../../forms/CustomForm');
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {ViewHeaderFactory} = require('../../components/ViewHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utilities
    const {log} = require('../../util/DevTools').default;

    // Actions
    const {EventActionsFactory, TranslateActionsFactory} = require('../../actions');

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

    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     * Handles the submission for the forms
     * @param {object} form
     * @param {object} inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {event, speakerInfo} = inst.props;
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const modifiedEvent = event.get('modifiedEvent');

        let newContents = {};
        newContents[selectedSpeaker.get('sid').toString()] = form;

        const Customfields = modifiedEvent.get('Customfields');
        let contents = Customfields.get('contents');

        // When there aren't existing entries it sends back an array which gets converted to a List, but we want to
        // always use a Map.
        if (contents.size === 0) {
            contents = Map();
        }

        const mergedEvent = modifiedEvent.set('Customfields',
            Customfields.set('contents',
                contents.merge(newContents)
            )
        );

        saveEvent(mergedEvent);
    };

    /**********************************
     * Components
     *********************************/

    const CustomForm = CustomFormFactory({});
    const EventInfoCard = EventInfoCardFactory({});
    const FormLoading = FormLoadingFactory({});
    const ViewHeader = ViewHeaderFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
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
        displayName: 'CustomView',

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

                    <ViewHeader>{getText('Custom Fields')}</ViewHeader>

                    <CustomForm
                        ref="customForm"
                        onSubmit={(form) => {
                            _submitHandler(form, this);
                        }}/>
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CustomViewFactory }