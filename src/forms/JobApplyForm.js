/**
 * Generates JobApplyForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 * @returns {*} - React Component
 */
const JobApplyFormFactory = (spec) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const moment = require('moment');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Enums
    const BTN = require('../enums/BTN').default;

    const {DisplayFieldFactory} = require('../components/DisplayField');
    const {MessageContainerFactory} = require('../components/messages/MessageContainer');
    const RaisedButton = require('material-ui/RaisedButton').default;

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
        SpeakerInfoActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory();

    const {
        getFeeRange
    } = SpeakerInfoActionsFactory({});

    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    const DisplayField = DisplayFieldFactory({});
    const MessageContainer = MessageContainerFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    //---------------------------------
    // Methods
    //---------------------------------

    let _toggleAutoFocus;
    let _updateHeaderActions;

    /**
     *
     * @param isFocused
     * @private
     */
    _toggleAutoFocus = (isFocused, inst) => {
        inst.setState({
            autoFocus: isFocused,
            focusStamp: moment()
        });
    };

    _updateHeaderActions = (spec) => {
        const {
            props,
            isDirty,
            inst
        } = spec;

        const {
            dispatch
        } = props;

        let actions = [];

        if (isDirty) {
            actions = [{
                type: BTN.SAVE,
                onClick: inst.onSubmit
            }, {
                type: BTN.DISCARD,
                onClick: inst.onDiscard
            }];
        }

        dispatch(setHeaderActions(actions));
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const EventMixin = EventMixinFactory({
        overrides: {
            updateHeaderActions() {
                const {
                    view
                } = this.props;

                _updateHeaderActions({
                    props: this.props,
                    isDirty: view.get('dirty'),
                    inst: this
                });
            },
            componentWillReceiveProps(nextProps) {
                const nextView = nextProps.view;
                const currentView = this.props.view;


                // update header if dirty changes
                if (nextView.get('dirty') !== currentView.get('dirty')) {
                    _updateHeaderActions({
                        props: nextProps,
                        isDirty: nextView.get('dirty'),
                        inst: this
                    });
                }
            }
        }
    });

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'jobBoard',
            'nav',
            'speakerInfo',
            'displayData'
        ]
    });

    //=========================================================================
    //
    // React / Public Interfaces
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'JobApplyForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        getInitialState() {
            return {
                autoFocus: undefined,
                focusStamp: undefined
            };
        },

        componentDidMount() {
            if(!this.state.autoFocus) {
                _toggleAutoFocus(true, this);
            }
        },

        /**
         * Combines the form input instructions
         *
         * @return {object}
         * @overrides FormMixin
         */
        buildSchema() {
            const {
                speakerInfo
            } = this.props;

            const feeRange = getFeeRange(speakerInfo.selectedSpeaker) || [];

            const overrides = {
                floatingLabelFixed: false,
                    floatingLabelStyle: {
                    top: 18
                }
            };

            let focusObj = _.clone(this.state);

            return {
                est_fee: _.assign({
                    name: 'est_fee',
                    label: getText("What is your normal fee for this type of service?"),
                    type: "number",
                    validate: v.optional,
                    showIcon: false,
                    hintText: feeRange[0],
                    helperText: getText("Your published fee range is %1$s to %2$s. You can add travel expenses later when you make a firm offer.", {params: feeRange}),
                    overrides
                }, focusObj),
                will_do: {
                    name: 'will_do',
                    label: getText("What will you do for the buyer at this price?"),
                    type: "textarea",
                    validate: v.required,
                    showIcon: false,
                    helperText: getText("example: I will travel to your meeting to deliver a keynote of up to 1 hour. I will also provide a 30 minute webinar before the event, and another webinar after the event to make the message more effective. Flat travel fee not included. etc..."),
                    overrides
                },
                need_info: {
                    name: 'need_info',
                    label: getText("What else do you need to know about this job to make a firm offer?"),
                    type: "textarea",
                    showIcon: false,
                    helperText: getText("example: What is the main goal of your meeting? Who will be in the audience? Would you like me to provide webinar support before or after? etc..."),
                    overrides
                },
                agreement: {
                    name: 'agreement',
                    label: getText("I agree to the eSpeakers Marketplace Finders Fee"),
                    type: "toggle",
                    noIcon: true,
                    overrides
                }
            };
        },

        /**
         * Returns pre-filled values for the form based on the props
         *
         * @param props
         * @returns {object}
         * @overrides FormMixin
         */
        getInitialValues(props) {
            const {} = props;


            let initialValues = {
            };

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         * @overrides FormMixin
         */
        onFormChanged: function (name, value) {
            const {
                dispatch
            } = this.props;

            const viewDirty = this.Form_areChangesMade();

            dispatch(toggleViewDirty(viewDirty));
        },

        prepareFormData() {
            let formData = _.clone(this.state.data);
        },

        /**
         * Submits the form when changes are saved.
         *
         * @returns {object}
         */
        onSubmit(event) {
            this.Form_onSubmit(event);
        },

        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            return (
                <form
                    ref='job-apply-form'
                    onSubmit={this.Form_onSubmit}>

                    <MessageContainer text={getText("Give the client a ballpark figure for their needs and ask intelligent questions about their goals.")} />
                    <MessageContainer text={getText("After this opening response to the client, converse with them in the message area until you are ready to use the MAKE OFFER button in your desktop version of EventCX.")} />
                    <MessageContainer>
                        <DisplayField label={getText("Start a conversation!")}>
                            <div>
                                <p>{getText("Give the client a ballpark figure for their needs and ask intelligent questions about their goals.")}</p>

                                <p>{getText("After this opening response to the client, converse with them in the message area until you are ready to use the MAKE OFFER button in your desktop version of EventCX.")}</p>
                            </div>
                        </DisplayField>
                    </MessageContainer>

                    {_.map(this.buildSchema(), (schema, key, i) => {
                        let fields = {};
                        fields[key] = schema;

                        return (
                            <div key={`field-${key}`} style={{
                                marginTop: '1em',
                                marginBottom: '1em'
                            }}>
                                {this.generateFields({fields})}
                            </div>
                        );
                    })}

                    <div style={{
                        padding: 10
                    }}>
                        <RaisedButton primary onClick={this.onSubmit} fullWidth label={getText('Submit')}></RaisedButton>
                    </div>

                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobApplyFormFactory }