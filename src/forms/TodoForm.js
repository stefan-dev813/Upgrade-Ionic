/**
 * Creates an TodoForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const TodoFormFactory = (spec) => {
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
    const BTN = require('../enums/BTN').default;

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        FormHelperMixinFactory,
        SubViewMixinFactory,
        ViewMixinFactory
    } = require('../mixins');
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    // Forms
    const {
        PanelFactory
    } = require('../components');

    // Actions
    const {
        DialogActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        TodoActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    // Utils
    const {
        log
    } = require('../util/DevTools').default;
    const DateToolsFactory = require('../util/DateTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        showDeleteConfirmation
    } = DialogActionsFactory({});
    const {
        stopProp,
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        popSubView
    } = NavActionsFactory({});
    const {
        extractSelectedTodo,
        deleteTodo
    } = TodoActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});
    const {
        toggleViewDirty,
        setHeaderActions,
    } = ViewActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _actionDeleteTodo;
    let _buildTodoSchema;
    let _generateAssignedToOptions;
    let _updateHeaderActions;

    /**
     * Handles the Delete button.  Sends delete request to service
     *
     * @param {object} inst
     * @private
     */
    _actionDeleteTodo = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(showDeleteConfirmation({
            onContinue: () => {
                const {
                    dispatch,
                    event
                } = inst.props;
                const selectedTodo = event.get('selectedTodo');

                dispatch(toggleEventDirty(true));
                dispatch(deleteTodo({
                    id: selectedTodo.get('id')
                }));
                dispatch(toggleViewDirty(false));
                dispatch(popSubView());
            },
            text: getText('Are you sure you want to delete this %1$s?', {
                params: [getText('Action')]
            })
        }));
    };

    /**
     *
     * @param inst
     * @returns {object}
     * @private
     */
    _buildTodoSchema = (inst) => {
        return {
            description: {
                name: 'description',
                label: getText('Description'),
                type: 'text',
                iconClass: 'fa-pencil-square',
                validate: v.required
            },
            statusdate: {
                name: 'statusdate',
                label: getText('Due On'),
                type: 'date',
                iconClass: 'fa-calendar',
                validate: v.date
            },
            assignedto: {
                name: 'assignedto',
                label: getText('Assigned To'),
                type: 'select',
                iconClass: 'fa-user',
                options: _generateAssignedToOptions(inst)
            },
            status: {
                name: 'status',
                label: getText('Complete'),
                type: 'checkbox'
            }
        };
    };

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateAssignedToOptions = (inst) => {
        const {
            speakerInfo
        } = inst.props;
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const coworkerList = selectedSpeaker.get('coworkers');

        let options = [];

        if (coworkerList && coworkerList.size) {
            coworkerList.map((coworker) => {
                options.push({
                    text: coworker.get('name'),
                    value: coworker.get('id')
                });
            });
        }

        return options;
    };

    /**
     *
     * @param {object} inst
     * @private
     */
    _updateHeaderActions = (inst, props) => {
        let currentProps = props || inst.props;

        const {
            dispatch
        } = currentProps;

        dispatch(setHeaderActions(inst.determineSaveAction(currentProps).concat([{
            type: BTN.DELETE,
            onClick: (event) => {
                stopProp(event);

                _actionDeleteTodo(inst);
            }
        }])));
    };

    /**********************************
     * Components
     *********************************/

    const Panel = PanelFactory({});

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
        displayName: 'TodoForm',
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
            return _buildTodoSchema(this);
        },

        /**
         * @returns {object}
         */
        getInitialValues() {
            const {
                event
            } = this.props;

            const selectedTodo = event.get('selectedTodo');
            const modifiedEvent = event.get('modifiedEvent');
            const todo = extractSelectedTodo(event, selectedTodo.get('id'));

            let initialValues = {};

            _.map([
                'description',
                'assignedto',
                'status'
            ], (key) => {
                if (key === 'status') {
                    initialValues[key] = (todo.get(key) && todo.get(key).toString() === "1" ? true : false);
                } else {
                    initialValues[key] = (todo.get(key) ? todo.get(key).toString() : null);
                }
            });

            const statusdate = todo.get('statusdate');

            if (statusdate) {
                initialValues['statusdate'] = DateTools.convertFromBalboaToDateString(statusdate);
            }

            return initialValues;
        },

        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            dispatch(toggleViewDirty(true));
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                event
            } = this.props;

            const selectedTodo = event.get('selectedTodo');

            let mode = this.determineMode(selectedTodo.get('id'));

            return <form
                ref='todo-form'
                onSubmit={this.Form_onSubmit}>

                <Panel
                    headingText={getText('%1$s Action', {params: [mode]})}
                    headingIconClass='fa-check-square-o'>

                    {this.generateFields({
                        fields: this.buildSchema()
                    })}
                </Panel>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TodoFormFactory }
