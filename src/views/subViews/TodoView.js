/**
 * Creates an TodoView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const TodoViewFactory = (spec) => {

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

    // Forms
    const {
        TodoFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        TodoActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;
    const DateToolsFactory = require('../../util/DateTools').default;

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
        extractSelectedTodo,
        saveTodo
    } = TodoActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        toggleViewDirty
    } = ViewActionsFactory({});

    const DateTools = DateToolsFactory({});

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
            dispatch,
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');

        const selectedTodo = extractSelectedTodo(event);

        let statusdate = null;

        if (_.isDate(form.statusdate)) {
            statusdate = form.statusdate;
        } else if (_.isString(form.statusdate)) {
            statusdate = DateTools.toDate(form.statusdate);
        }

        dispatch(saveTodo(_.assign({
                id: '0'
            },
            (selectedTodo ? selectedTodo.toJS() : {}), {
                statusdate: statusdate
            },
            {
                status: (form.status === true ? 1 : 0)
            },
            _.pick(form, [
                'description',
                'assignedto'
            ]))));

        dispatch(toggleEventDirty(true));

        dispatch(toggleViewDirty(false));

        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const TodoForm = TodoFormFactory({});

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
        displayName: 'TodoView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return <TodoForm
            ref = "editTodoForm"
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

export { TodoViewFactory }