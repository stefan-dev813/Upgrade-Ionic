/**
 * Creates an EmailCoworkersForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const EmailCoworkersFormFactory = (spec) => {
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

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory,
        SubViewMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    // Utils
    const DateToolsFactory = require('../util/DateTools').default;
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../util/DevTools').default;


    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        stopProp
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    const {
        convertFromBalboaTrunkTimestamp
    } = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generateCoworkerCheckboxes;
    let _updateHeaderActions;

    /**
     * Generates all the checkboxes for the co-workers
     *
     * @param {object} schema - Reference to the form's schema
     * @param {object} inst - Reference to the React instance
     * @private
     */
    _generateCoworkerCheckboxes = (schema, inst) => {
        const {
            speakerInfo
        } = inst.props;

        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        const coworkers = selectedSpeaker.get('coworkers');

        coworkers.map((worker) => {
            schema[worker.get('id')] = {
                name: worker.get('id'),
                type: 'checkbox',
                label: worker.get('name')
            };
        });
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _updateHeaderActions = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(setHeaderActions([{
            onClick: (event) => {
                stopProp(event);

                if (_.isFunction(inst.Form_onSubmit)) {
                    inst.Form_onSubmit();
                }
            },
            label: 'Send',
            iconClass: 'send'
        }]));
    };

    /**********************************
     * Components
     *********************************/

    /**********************************
     * Mixins
     *********************************/

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'nav',
            'event',
            'speakerInfo'
        ]
    });

    const SubViewMixin = SubViewMixinFactory({});

    const ViewMixin = ViewMixinFactory({
        overrides: {
            updateHeaderActions(props) {
                // This is called inside ViewMixin, so 'this' references the react component
                _updateHeaderActions(this, props);
            }
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
        displayName: 'EmailCoworkersForm',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, FinalFormMixin, ViewMixin, SubViewMixin],
        /**
         * Generates the full schema to build the form inputs
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            let schema = {};

            _generateCoworkerCheckboxes(schema, this);

            schema['subject'] = {
                name: 'subject',
                label: getText('Subject'),
                type: 'textarea',
                validate: v.required,
                icon: false
            };

            schema['note'] = {
                name: 'note',
                type: 'textarea',
                label: getText('Note'),
                icon: false
            };

            return schema;
        },

        getInitialValues() {

            const {
                event
            } = this.props;

            const modifiedEvent = event.get('modifiedEvent');

            let subject = getText('Event for %1$s', {
                params: [modifiedEvent.get('organization')]
            });

            const stageTimes = modifiedEvent.get('Stagetime');
            let startDateTime = null;

            if (stageTimes) {
                stageTimes.map((stageTime) => {
                    let startTime = stageTime.get('starttime');

                    if (startTime > 0) {
                        startDateTime = convertFromBalboaTrunkTimestamp(startTime);
                    }
                });
            }

            if (_.isDate(startDateTime)) {
                subject += getText(' on %1$s', {
                    params: [esUtils.format_date(startDateTime, esUtils.format_date.masks.mediumDate)]
                });
            }

            return {
                subject: subject
            };
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            dispatch(toggleViewDirty(this.Form_areChangesMade()));
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return (
                <form
                    id="email-coworkers-form"
                    ref='email-coworkers-form'
                    onSubmit={this.Form_onSubmit}>
                    {this.generateFields({fields: this.buildSchema()})}
                </form>

            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { EmailCoworkersFormFactory }
