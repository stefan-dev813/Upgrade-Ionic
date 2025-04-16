/**
 * Creates an AddButton component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @returns {*} - React Component
 * @mixes AutoShouldUpdateMixin
 */
const AddButtonFactory = (spec) => {
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

    // Components
    const {CSSTransistorFactory} = require('./CSSTransistor');

    const IconMap = require('../theme/IconMap');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        OverlayActionsFactory,
        EventActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const propTypes = {
        actions: PropTypes.array.isRequired,
        view: PropTypes.object.isRequired
    };

    let _singleAction;

    /**********************************
     * Actions
     **********************************/

    const {
        updateOverlayStore,
        clearOverlay
    } = OverlayActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    let _actionsVisible = false;

    /**********************************
     * Methods
     *********************************/

    let _hideActions;
    let _toggleActions;

    _toggleActions = (inst) => {
        const {
            dispatch
        } = inst.props;

        if (!_actionsVisible) {
            inst.refs.addButtonTransistor.performEnter();
            dispatch(updateOverlayStore({
                show: true,
                mode: 'translucent',
                onClick: (e) => {
                    stopProp(e);

                    _hideActions(inst);
                }
            }));

            _actionsVisible = true;
        }
        else {
            _hideActions(inst);
        }
    };

    _hideActions = (inst) => {
        const {
            dispatch
        } = inst.props;

        inst.refs.addButtonTransistor.performLeave();
        dispatch(clearOverlay());
        _actionsVisible = false;
    };

    /**********************************
     * Factories
     *********************************/

    const CSSTransistor = CSSTransistorFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass(_.assign({}, {

            /*** Used for debug messages
             */
            displayName: 'AddButton',
            /**
             * Allows you to use mixins to share behavior among multiple components.
             */
            mixins: [AutoShouldUpdateMixin],
            /**
             * Specifies what we expect in this.props
             */
            propTypes,
            /**
             * Generates the virtual DOM/HTML
             */
            render() {
                const {
                    actions,
                    view
                } = this.props;

                const keyboardActive = view.get('keyboardActive');

                if (keyboardActive) {
                    return null;
                }

                _singleAction = null;

                if(!actions || !actions.length) {
                    return null;
                }

                if (actions && actions.length === 1) {
                    _singleAction = actions[0].onClick;
                }

                return (<CSSTransistor
                    ref='addButtonTransistor'
                    transitionName='add-btn-actions'
                    transitionEnterTimeout={250}
                    transitionLeaveTimeout={250}>
                    <div className='add-btn-actions'>
                        <div className='actions-overflow'>
                            {_.map(actions, (action, i) => {
                                return (
                                    <div
                                        key={`overflow-${i}`}
                                        className="icon-label"
                                        onClick={(event) => {
                                            stopProp(event);

                                            action.onClick(event);

                                            _hideActions(this);
                                        }}>
                                        <i>{IconMap.getElement(action.iconClass)}</i>

                                        <span>{action.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className='btn-fixed btn-add'
                            onClick={(event) => {
                                stopProp(event);

                                if (_.isFunction(_singleAction)) {
                                    _singleAction();
                                } else {
                                    _toggleActions(this);
                                }
                            }}>
                            <span>{IconMap.getElement('add', {style: {color: 'white'}})}</span>
                        </button>
                    </div>
                </CSSTransistor>);
            }
        },
        // Overrides any of the above methods
        (spec ? spec.overrides : null)));

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { AddButtonFactory }
