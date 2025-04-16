/**
 * Generates a EventMixin component.  For shared functionality between Event view
 * components.
 *
 * @param {object} spec - Container for named parameters
 * @returns {object}
 * @constructor
 * @mixin
 * @mixes ViewMixin
 */
const EventMixinFactory = (spec = {}) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const {
        radio
    } = require('react-pubsub-via-radio.js');
    const {
        is,
        fromJS
    } = require('immutable');

    const IconMap = require('../theme/IconMap');
    const mainTheme = require('../theme/mainTheme').default;
    const Avatar = require('material-ui/Avatar').default;

    // Enums
    const BTN = require('../enums/BTN').default;
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Mixins
    const ViewMixinFactory = require('./ViewMixin').default;

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Platforms
    const {isSolutionTree} = require('../util/Platform').default;

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        JobBoardActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
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
        showCopyEventConfirmation,
        showDeleteConfirmation,
        showUndoConfirmation
    } = DialogActionsFactory({});
    const {
        copyEvent,
        deleteEvent,
        discardEventChanges,
        isMarketPlaceEvent,
        mergeModifiedEvent,
        stopProp,
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        getMyInfo
    } = JobBoardActionsFactory();
    const {
        addSubView,
        getCurrentSubView
    } = NavActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        setHeaderActions,
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    const {
        prepareFormDataOverride
    } = spec;

    /**********************************
     * Methods
     *********************************/

    let _actionCopyEvent;
    let _actionDeleteEvent;
    let _actionEmailCoworkers;
    let _buildFormDirtyActions;
    let _buildHeaderActions;
    let _confirmHandler;
    let _discardHandler;
    let _prepareFormData = prepareFormDataOverride;
    let _submitHandler;
    let _updateHeaderActions;

    /**
     *
     * @param inst
     * @private
     */
    _actionCopyEvent = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showCopyEventConfirmation({
            onContinue: (copyLists) => {
                const {
                    event,
                    speakerInfo
                } = inst.props;

                const selectedEvent = event.get('selectedEvent');
                const selectedSpeaker = speakerInfo.get('selectedSpeaker');

                copyEvent({
                    eid: selectedEvent.get('eid'),
                    targetSid: selectedSpeaker.get('sid'),
                    copyLists: copyLists
                });
            }
        }));
    };

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteEvent = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    event
                } = inst.props;
                const selectedEvent = event.get('selectedEvent');

                deleteEvent({
                    eid: selectedEvent.get('eid')
                });
            },
            text: getText('Are you sure you want to delete this Event?')
        }));
    };

    /**
     *
     * @param inst
     * @private
     */
    _actionEmailCoworkers = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(mergeModifiedEvent(_prepareFormData(inst)));

        dispatch(addSubView(VIEWS.subViews.EMAIL_COWORKERS_VIEW));
    };

    /**
     * Returns form actions when dirty.  This happens here so it can have reference to the FormMixin
     * @returns {*[]}
     */
    _buildFormDirtyActions = (spec) => {
        const {
            inst,
            isDirty
        } = spec;

        if(!isDirty){
            return [];
        }

        return [{
            type: BTN.SAVE,
            onClick: (event) => {
                stopProp(event);

                _submitHandler(inst);
            }
        }, {
            type: BTN.DISCARD,
            onClick: (event) => {
                stopProp(event);

                _discardHandler(inst);
            }
        }];
    };

    /**
     * Determines what should be in the header.
     *
     * @param {object} spec - Container for named parameters
     * @param {object} spec.props
     * @param {boolean} spec.isDirty
     * @param {object} spec.inst - Reference to React Component
     * @returns {*[]}
     * @private
     */
    _buildHeaderActions = (spec) => {
        const {
            props,
            inst
        } = spec;

        const {
            event,
            jobBoard,
            nav,
            speakerInfo,
            dispatch
        } = props;

        const modifiedEvent = event.get('modifiedEvent');
        const isPersonal = modifiedEvent.get('isPersonal');
        let myInfo = {};
        let messagesAction;

        if(isMarketPlaceEvent(modifiedEvent)) {
            myInfo = getMyInfo({
                jobBoard,
                speakerInfo,
                eid: modifiedEvent.get('eid')
            });

            if (myInfo.n_unread) {
                messagesAction = {
                    type: 'custom',
                    node: (
                        <div style={{
                            display: 'flex'
                        }}>
                            {IconMap.getButton('message',
                                {
                                    onClick: (event) => {
                                        stopProp(event);

                                        dispatch(addSubView(VIEWS.jobSubViews.JOB_MESSAGES_VIEW));
                                    },
                                    style: {
                                        paddingRight: 0
                                    }
                                },
                                {
                                    color: mainTheme.headerIconColor
                                })}

                            <div style={{
                                marginTop: 20,
                                marginLeft: -15,
                                marginRight: 15
                            }}>
                                <Avatar size={20}
                                        backgroundColor={mainTheme.errorBackgroundColor}>{myInfo.n_unread}</Avatar>
                            </div>

                        </div>
                    )
                };
            } else {
                messagesAction = {
                    onClick: (event) => {
                        stopProp(event);

                        dispatch(addSubView(VIEWS.jobSubViews.JOB_MESSAGES_VIEW));
                    },
                    label: getText('Messages'),
                    iconClass: 'message'
                };
            }
        }

        let actions = _buildFormDirtyActions(spec);

        if (!isSolutionTree()) {

            if(isMarketPlaceEvent(modifiedEvent)) {
                actions = actions.concat([messagesAction]);
            }

            actions = actions.concat([
                {
                    onClick: (event) => {
                        stopProp(event);

                        _actionEmailCoworkers(inst);
                    },
                    label: getText('Email Co-Workers'),
                    iconClass: 'email'
                },
                {
                    onClick: (event) => {
                        stopProp(event);

                        _actionCopyEvent(inst);
                    },
                    label: getText('Copy Event'),
                    iconClass: 'content-copy'
                // }, {
                //     onClick: (event) => {
                //         stopProp(event);
                //
                //         _actionDeleteEvent(inst);
                //     },
                //     iconClass: 'delete',
                //     label: getText('Delete Event')
                }
            ]);
        }

        return actions;
    };

    /**
     * Confirms Undo
     *
     * @param {object} inst
     * @private
     */
    _confirmHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        inst.Form_reset();
        dispatch(discardEventChanges());
        dispatch(toggleEventDirty(false));
        dispatch(toggleViewDirty(false));
    };

    /**
     * Resets the form when changes are discarded
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _discardHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showUndoConfirmation({
            onContinue: () => {
                _confirmHandler(inst);
            }
        }));
    };

    if (!_prepareFormData) {
        _prepareFormData = (inst) => {
            if (_.isFunction(inst.prepareFormData)) {
                return inst.prepareFormData();
            }

            return _.clone(inst.state.data);
        };
    }

    /**
     * Submits the form when changes are saved.
     *
     * @param {object} inst
     * @private
     */
    _submitHandler = (inst) => {
        inst.Form_onSubmit();
    };

    /**
     * Updates the header actions for the most common shared actions
     *
     * @param {object} spec - Container for named parameters
     * @param {object} spec.props
     * @param {boolean} spec.isDirty
     * @param {object} spec.inst - Reference to React Component
     * @private
     */
    _updateHeaderActions = (spec) => {
        const {props} = spec;

        const {
            dispatch
        } = props;

        dispatch(setHeaderActions(_buildHeaderActions(spec)));
    };

    /**********************************
     * Mixins
     *********************************/

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return _.assign({}, ViewMixin, {
        updateHeaderActions() {
            const {
                event
            } = this.props;

            // This is called inside ViewMixin, so 'this' references the react component
            _updateHeaderActions({
                props: this.props,
                isDirty: event.get('dirty'),
                inst: this
            });
        },
        Radio_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.ui.OPEN_EVENT_NAV] = () => {
                dispatch(mergeModifiedEvent(_prepareFormData(this)));
            };

            return radios;
        },
        /**
         * Invoked when a component is receiving new props. This method is not
         * called for the initial render.
         *
         * @param {object} nextProps
         */
        componentWillReceiveProps(nextProps) {
            // if our view dirty state has changed, update our headers
            const currentEvent = this.props.event;
            const nextEvent = nextProps.event;

            const currentNav = this.props.nav;
            const nextNav = nextProps.nav;

            const currentView = this.props.view;
            const nextView = nextProps.view;

            const selectedEvent = nextEvent.get('selectedEvent');
            const modifiedEvent = nextEvent.get('modifiedEvent');

            const currentModifiedEvent = currentEvent.get('modifiedEvent');

            const {
                dispatch
            } = nextProps;

            // we only want to trigger multiUpdate if an update will occur

            let isEventDirty = !is(selectedEvent, modifiedEvent) || nextEvent.get('dirty');

            if (isEventDirty !== currentEvent.get('dirty')) {
                dispatch(toggleEventDirty(isEventDirty));

                _updateHeaderActions({
                    props: nextProps,
                    isDirty: isEventDirty,
                    inst: this
                });
            }

            if(!is(currentEvent.modifiedEvent, nextEvent.modifiedEvent)) {
                _updateHeaderActions({
                    props: nextProps,
                    isDirty: isEventDirty,
                    inst: this
                });
            }

            // check to see if we need to merge event data
            // If navigation has changed or the drawer has opened, then merge data
            if ((nextNav.get('showDrawer') && !is(nextNav.get('showDrawer'), currentNav.get('showDrawer')))
                || !is(nextNav.get('eventView'), currentNav.get('eventView'))
                || !is(getCurrentSubView(nextNav), getCurrentSubView(currentNav))
                && !nextNav.get('mainView')) {

                dispatch(mergeModifiedEvent(_prepareFormData(this)));
            }

            if (!is(nextView.get('doSubmitForm'), currentView.get('doSubmitForm')) && nextView.get('doSubmitForm') === true) {
                _submitHandler(this);
            }

        },
        componentWillUnmount() {
            const {dispatch, nav} = this.props;

            if(nav.get('eventView')) {
                dispatch(mergeModifiedEvent(_prepareFormData(this)));
            }
        },
        getFormData() {
            return _.clone(this.state.data);
        },
        onDiscard(e) {
            stopProp(e);

            _discardHandler(this);
        }
    }, (spec ? spec.overrides : null));
}

export default EventMixinFactory;