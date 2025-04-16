/**
 * Generates a LoginView React Component
 *
 * @param spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const LoginViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const _ = require('lodash');
    const {
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        is
    } = require('immutable');
    const {
        connect
    } = require('react-redux');
    const Platform = require('../util/Platform').default;

    // Components
    const {
        LinkFactory
    } = require('../components');
    const {
        MessageSnacksFactory
    } = require('../components/messages');

    // Material UI
    const Snackbar = require('material-ui/Snackbar').default;

    // Factories
    const {ForgotPasswordFormFactory} = require('../forms/ForgotPasswordForm');
    const {LoginFormFactory} = require('../forms/LoginForm');
    const {ResponsiveLogFactory} = require('../components/ResponsiveLog');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Services
    const {
        login
    } = require('../services/LoginService').default();

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const {
        getBuildName,
        getVersionNumber,
        isEspeakers,
        isIos
    } = require('../util/Platform').default;

    // Actions
    const {
        AuthActionsFactory,
        EventActionsFactory,
        LoadingActionsFactory,
        MessageActionsFactory,
        NavActionsFactory,
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
        forgotPassword
    } = AuthActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    const {
        addSubView,
        clearSubView,
        getCurrentSubView
    } = NavActionsFactory({});
    const {
        showLoading,
        hideLoading
    } = LoadingActionsFactory({});
    const {
        setMessage,
        clearMessages
    } = MessageActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     **********************************/

    let _forgotHandler;
    let _loginHandler;
    let _debugHandler;

    /**
     * Handles the ForgotPasswordForm submission
     *
     * @param {object} form - Form values
     * @private
     */
    _forgotHandler = (form) => {
        if (form && form.email) {
            forgotPassword({
                username: form.email
            });
        }
    };

    /**
     * Handles the LoginForm submission
     *
     * @param {object} form - LoginForm values
     * @param {object} inst
     * @private
     */
    _loginHandler = (form, inst) => {
        const {
            dispatch,
            push
        } = inst.props;

        dispatch(clearMessages());

        dispatch(showLoading());

        login(_.assign({}, form, push.toJS(), {
            success: (response) => {
                dispatch(hideLoading());

                dispatch(clearMessages());

                radio(RADIOS.stores.LOGIN_SUCCESS).broadcast(response.data);
            },
            failure: (response) => {
                dispatch(hideLoading());

                let error = null;

                if (response && response.message) {
                    error = response.message;
                }
                else if (typeof response === 'string') {
                    error = response;
                }

                dispatch(setMessage({
                    type: 'error',
                    text: error
                }));
            }
        }));
    };

    /**
     * Quick debug function used to make sure everything is setup
     * @private
     */
    _debugHandler = (e, inst) => {
        const {
            dispatch
        } = inst.props;

        let text = "Build name: " + getBuildName() + " | ";
        text += "Build version: " + process.env.NODE_ENV + " | ";
        text += "Balboa url: " + Platform.getBalboaUrl();

        dispatch(setMessage({
            text: text,
            type: 'success'
        }));
    }

    /**********************************
     * Components
     *********************************/

    const ForgotPasswordForm = ForgotPasswordFormFactory({});
    const LoginForm = LoginFormFactory({});
    const Link = LinkFactory({});
    const MessageSnacks = MessageSnacksFactory({});
    const ResponsiveLog = ResponsiveLogFactory();

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            nav: PropTypes.object.isRequired,
            push: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used for debug messages
         */
        displayName: 'LoginView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin],
        /**
         * Sets up the RadioService and what Service channels we'll be interacting with
         *
         * @returns {object}
         * @constructor
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            radios[RADIOS.services.FORGOT_PASSWORD] = {
                key() {
                    return RADIOS.services.FORGOT_PASSWORD;
                },
                on: {
                    waiting() {
                        dispatch(showLoading());
                    },
                    succeeded(data) {
                        dispatch(hideLoading());

                        dispatch(setMessage({
                            text: getText('Email Sent'),
                            type: 'success'
                        }));
                    },
                    failed(error) {
                        dispatch(hideLoading());

                        dispatch(setMessage({
                            text: error,
                            type: 'error'
                        }));
                    }
                }
            };

            return radios;
        },
        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            const {
                dispatch,
                nav,
                view
            } = this.props;

            const keyboardActive = view.get('keyboardActive');

            let forgotPasswordSelected = (is(getCurrentSubView(nav), VIEWS.subViews.FORGOT_PASSWORD_VIEW));

            return <div className='login-view'>
                <div className='login-splash'/>
                <div className='login-content'>
                    <div className={`espeaker-logo ${getBuildName()}`}/>

                    {(forgotPasswordSelected ? <ForgotPasswordForm
                        onSubmit={(e) => {
                            _forgotHandler(e, this);
                        }}
                        onCancel={() => {
                            dispatch(clearMessages());

                            dispatch(clearSubView());
                        }}/>
                        : <LoginForm onSubmit={(e) => {
                                _loginHandler(e, this);
                            }}/>
                    )}

                    {(!forgotPasswordSelected ? <div className='password-text'>
                        <Link onClick={(e) => {
                            stopProp(e);

                            dispatch(clearMessages());

                            dispatch(addSubView(VIEWS.subViews.FORGOT_PASSWORD_VIEW));
                            }}>{getText('Forgot Password?')}</Link>
                        </div>
                    : null)}

                    {(!forgotPasswordSelected && isEspeakers() && !isIos() ? <div className='password-text'>
                        <Link href='http://espeakers.com/join?mobile'>
                            {getText('Need an Account?')}
                        </Link>
                    </div> : null)}

                    {/*{(!forgotPasswordSelected && isEspeakers() && isIos() ? <div className='password-text'>*/}
                        {/*<div>*/}
                            {/*{getText('Need an Account?')}*/}
                        {/*</div>*/}
                        {/*{getText('Contact')}:*/}
                        {/*<Link href='tel: (888) 377-3214'>*/}
                            {/*{getText('(888) 377-3214')}*/}
                        {/*</Link>*/}
                    {/*</div> : null)}*/}

                    <MessageSnacks/>

                    {!keyboardActive ?
                    <div className='splash-footer'>
                        <div className='copyright'>
                            {`© ${new Date().getFullYear()} eSpeakers.com`}
                        </div>
                        <div className='version' onClick={(e) => {_debugHandler(e, this)}}>
                            {getVersionNumber()}
                        </div>
                    </div> : null}
                </div>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LoginViewFactory }