/**
 * Generates a TodoCard component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const TodoCardFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Enums
    const VIEWS = require('../../enums/VIEWS').default;

    // Material UI
    const Checkbox = require('material-ui/Checkbox').default;

    const {ListCardFactory} = require('./ListCard');

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Actions

    const {
        EventActionsFactory,
        TranslateActionsFactory,
        TodoActionsFactory
    } = require('../../actions');

    // Utils
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
        deleteTodo,
        getUndo,
        saveTodo,
        selectTodo,
        setUndo
    } = TodoActionsFactory({});
    const {
        selectEvent,
        stopProp,
        toggleEventDirty
    } = EventActionsFactory({});

    const {
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _completeHandler;
    let _deleteHandler;
    let _editHandler;
    let _generateCheckbox;
    let _generateSecondaryText;
    let _generateStyle;
    let _goToActions;

    /**
     *
     * @param {object} inst - Reference to React
     * @private
     */
    _completeHandler = (inst) => {
        const {
            event,
            auth,
            todo,
            view
        } = inst.props;
        const {
            dispatch
        } = inst.props;

        const sessionData = auth.get('sessionData');

        let selectedTodo = todo;

        let status = selectedTodo.get('status') || "0";
        let newStatus = (status.toString() === "1" ? "0" : "1");

        let updateObj = {
            status: newStatus
        };

        dispatch(toggleEventDirty(true));
        if (newStatus === '1') {
            dispatch(setUndo(selectedTodo));

            updateObj = _.assign(updateObj, {
                statusdate: new Date(),
                assignedto: sessionData.get('username').toUpperCase()
            });
        }
        else {
            selectedTodo = getUndo(selectedTodo, view) || selectedTodo;
        }
        dispatch(saveTodo(_.assign({}, selectedTodo.toJS(), updateObj)));
    };

    /**
     *
     * @param inst
     * @private
     */
    _deleteHandler = (inst) => {
        const {
            dispatch,
            todo
        } = inst.props;

        dispatch(toggleEventDirty(true));

        dispatch(deleteTodo({
            id: todo.get('id')
        }));
    };

    /**
     *
     * @param inst
     * @private
     */
    _editHandler = (inst) => {
        const {
            dispatch,
            todo
        } = inst.props;

        dispatch(selectTodo({
            id: todo.get('id')
        }));
    };

    /**
     *
     * @param inst
     * @returns {null|XML|JSX}
     * @private
     */
    _generateCheckbox = (inst) => {
        const {canComplete, todo} = inst.props;
        let status = todo.get('status') || '0';

        if (!canComplete)
            return null;

        return <Checkbox
            checked={status.toString() === '1'}
            onCheck={() => {
                _completeHandler(inst);
            }}/>;
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateSecondaryText = (inst) => {
        const {todo} = inst.props;

        let date = todo.get('date') || todo.get('statusdate');
        let formattedDate;

        if (date) {
            formattedDate = DateTools.convertFromBalboaToDateString(date);
        }

        if (todo.get('assignedto') && todo.get('assignedto').length) {
            return getText('%1$s - %2$s', {
                params: [formattedDate, todo.get('assignedto')]
            });
        }

        return formattedDate;
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateStyle = (inst) => {
        const {todo} = inst.props;

        let status = todo.get('status') || '0';
        const date = todo.get('date') || todo.get('statusdate');

        if (_.isString(status)) {
            status = DateTools.parseNum(status);
        }

        if (status > 0) {
            return {backgroundColor: mainTheme.todoCompleteColor};
        }

        let today = new Date();
        let todoDate = new Date(date);

        if (today.getTime() > todoDate.getTime()) {
            return {backgroundColor: mainTheme.todoOverdueColor};
        }

        return {};
    };

    /**
     *
     * @param inst
     * @private
     */
    _goToActions = (inst) => {
        const {dispatch, todo} = inst.props;

        dispatch(selectEvent({
            event: {
                eid: todo.get('eid')
            },
            view: VIEWS.eventViews.TODO_LIST_VIEW
        }));
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            todo: PropTypes.object.isRequired,
            canComplete: PropTypes.bool.isRequired,
            auth: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        propsPriority: [
            'canComplete',
            'todo',
            'view',
            'event',
            'auth'
        ]
    });

    const CardMixin = CardMixinFactory({});

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'TodoCard',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, CardMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {canComplete, todo} = this.props;

            const menuItems = this.getMenuItems(['edit', 'delete'], {
                onEdit: () => {
                    _editHandler(this);
                },
                onDelete: () => {
                    _deleteHandler(this);
                }
            }, this);

            return <ListCard
                primaryText={todo.get('description') || todo.get('dsc')}
                menuItems={(canComplete ? menuItems : null)}
                secondaryText={_generateSecondaryText(this)}
                leftCheckbox={_generateCheckbox(this)}
                style={_generateStyle(this)}
                onClick={(e) => {
                    stopProp(e);

                    if (canComplete) {
                        _completeHandler(this);
                    } else {
                        _goToActions(this);
                    }
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TodoCardFactory }