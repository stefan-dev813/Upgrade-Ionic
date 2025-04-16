/**
 * Generates a ContactsForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 * @returns {*} - React Component
 */
const ContactsFormFactory = (spec) => {
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
    const esUtils = require('ES/utils/esUtils');

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
        prepareContactsFormData,
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

    let _buildClientCallSchema;
    let _generateTimezoneOptions;

    /**
     * Generates form input instructions for building the Client Call section
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _buildClientCallSchema = (inst) => {
        return {
            ccDate: {
                name: 'ccDate',
                type: 'date',
                iconClass: 'date-range',
                label: getText('Date'),
                minDate: inst.getSystemMinDate(),
                maxDate: inst.getSystemMaxDate(),
                validate: v.blankOr(v.date)
            },
            ccTime: {
                name: 'ccTime',
                type: 'time',
                iconClass: 'fa-clock-o',
                label: getText('Time'),
                validate: v.blankOr(v.time)
            },
            ccTimezone: {
                name: 'ccTimezone',
                label: getText('Timezone'),
                type: 'select',
                placeholder: getText('-- local time --'),
                options: _generateTimezoneOptions(inst),
                iconClass: 'language'

            },
            ccInitiator: {
                name: 'ccInitiator',
                type: 'select',
                iconClass: 'fa-phone-square',
                label: getText('Call Initiated By'),
                options: [{
                    text: getText('In Person'),
                    value: '1'
                }, {
                    text: getText('They Call Us'),
                    value: '2'
                }, {
                    text: getText('We Call Them'),
                    value: '3'
                }]

            },
            ccNotes: {
                name: 'ccNotes',
                type: 'textarea',
                iconClass: 'fa-pencil',
                label: getText('Notes')
            }
        };
    };

    /**
     * TODO: This exists on VenueMixin as well.  Not very DRY
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateTimezoneOptions = (inst) => {
        const {
            displayData
        } = inst.props;
        const displayLists = displayData.get('displayLists');

        const universal = displayLists.get('universal');
        const timezones = universal.get('timezones');

        let options = [];

        timezones.map((timezone) => {
            options.push({
                text: timezone,
                value: timezone
            });
        });

        return options;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'event',
            'jobBoard',
            'speakerInfo',
            'nav',
            'displayData'
        ]
    });

    const EventMixin = EventMixinFactory({
        prepareFormDataOverride: (inst) => {
            let form = _.clone(inst.state.data);

            return prepareContactsFormData({
                form,
                inst
            });
        }
    });

    const FormHelperMixin = FormHelperMixinFactory({});
    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'ContactsForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines the form input instructions
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, _buildClientCallSchema(this));
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
                ccNotes: modifiedEvent.get('ccNotes'),
                ccInitiator: modifiedEvent.get('ccInitiator') || '0',
                ccTimezone: modifiedEvent.get('ccTimezone')
            };

            const ccDateTime = modifiedEvent.get('ccDateTime');

            if (this.isBalboaDate(ccDateTime)) {
                initialValues = _.assign(initialValues, {
                    ccDate: this.convertFromBalboaToDate(ccDateTime),
                    ccTime: this.convertFromBalboaToTime(ccDateTime)
                });
            }

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
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
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return (
                <form
                    ref='contacts-form'
                    onSubmit={this.Form_onSubmit}>
                    <Panel headingText={getText('Client Call')}
                           headingIconClass='fa-phone'>
                        {this.generateFields({fields: this.buildSchema()})}
                    </Panel>
                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ContactsFormFactory }
