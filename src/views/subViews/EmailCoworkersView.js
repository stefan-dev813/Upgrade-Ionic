/**
 * Creates an EmailCoworkersView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const EmailCoworkersViewFactory = (spec) => {
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

    // Enums
    const RADIOS = require('../../enums/RADIOS').default;

    // Forms
    const {
        EmailCoworkersFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');
    const {
        RadioServiceMixin
    } = require('react-pubsub-via-radio.js');

    // Actions
    const {
        EventActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        emailCoworkers
    } = EventActionsFactory({});
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage
    } = MessageActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        toggleViewDirty
    } = ViewActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _submitHandler;

    /**
     *
     * @param form
     * @param inst
     * @private
     */
    _submitHandler = (form, inst) => {
        const {
            event
        } = inst.props;

        const selectedEvent = event.get('selectedEvent');
        let coworkers = [];

        _.map(form, (value, key) => {
            if (key !== 'subject' && key !== 'note') {
                coworkers.push(key);
            }
        });

        emailCoworkers({
            eid: selectedEvent.get('eid'),
            subject: form.subject,
            note: form.note,
            coworkers: coworkers
        });
    };

    /**********************************
     * Components
     *********************************/

    const EmailCoworkersForm = EmailCoworkersFormFactory({});

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
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'EmailCoworkersView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin],
        /**
         * Sets up the Service Radio channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;
            let radios = {};

            radios[RADIOS.services.EMAIL_COWORKERS] = {
                key() {
                    const {
                        event
                    } = this.props;
                    const selectedEvent = event.get('selectedEvent');

                    return `${RADIOS.services.EMAIL_COWORKERS}-${selectedEvent.get('eid')}`;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded() {
                        dispatch(hideLoading());

                        dispatch(toggleViewDirty(false));

                        dispatch(popSubView());

                        dispatch(setMessage({
                            type: 'success',
                            text: getText('Email(s) Sent')
                        }));
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(setMessage({
                            type: 'error',
                            text: error
                        }));
                    }
                }
            };

            return radios;
        },
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return <EmailCoworkersForm
            ref = 'emailCoworkersForm'
            onSubmit = {
                (form) => {
                    _submitHandler(form, this);
                }
            }
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { EmailCoworkersViewFactory }