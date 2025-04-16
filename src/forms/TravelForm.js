/**
 * Generates a TravelForm component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes EventMixin
 */
const TravelFormFactory = (spec) => {
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
    const {
        PanelFactory
    } = require('../components');

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const Panel = PanelFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildNotesSchema;

    /**
     * Builds form input instructions for the Notes section
     *
     * @returns {object}
     * @private
     */
    _buildNotesSchema = () => {
        return {
            nearestAirport: {
                name: 'nearestAirport',
                type: 'text',
                iconClass: 'fa-plane',
                label: getText('Nearest Airport')
            },
            travelAgent: {
                name: 'travelAgent',
                type: 'text',
                iconClass: 'fa-female',
                label: getText('Travel Agent')
            },
            travelNotes: {
                name: 'travelNotes',
                type: 'textarea',
                iconClass: 'fa-pencil',
                label: getText('Travel Notes')
            }
        };
    };

    /**********************************
     * Mixins
     *********************************/

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            view: PropTypes.object.isRequired
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
         * Used in debug messaging
         */
        displayName: 'TravelForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines and returns all schemas to build the form inputs
         *
         * @return {object}
         */
        buildSchema() {
            return _.assign({}, _buildNotesSchema());
        },

        /**
         * Returns pre-filled values for the form based on the props
         *
         * @param props
         * @returns {object}
         * @overrides FormMixin
         */
        getInitialValues(props) {
            const {
                event
            } = props;

            const modifiedEvent = event.get('modifiedEvent');

            let initialValues = {
                nearestAirport: modifiedEvent.get('nearestAirport'),
                travelAgent: modifiedEvent.get('travelAgent'),
                travelNotes: modifiedEvent.get('travelNotes')
            };

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         * @overrides FormMixin
         */
        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            // TODO: this would definitely get the model updated, but might be too expensive
            // mergeModifiedEvent(this.state.data);
            dispatch(toggleEventDirty(this.Form_areChangesMade()));
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return <form
                ref='travel-form'
                onSubmit={this.Form_onSubmit}>
                <Panel
                    headingText={getText('Notes')}
                    headingIconClass='fa-pencil-square'>

                    {this.generateFields({fields: _buildNotesSchema()})}
                </Panel>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TravelFormFactory }