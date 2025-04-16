/**
 * Generates TodoListForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 * @returns {*} - React Component
 */
const TodoListFormFactory = (spec) => {
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
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
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
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/


    /**********************************
     * Methods
     *********************************/

    let _buildTodoListSchema;
    let _generateTodoOptions;

    /**
     * Builds form input instructions for the TodoList
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _buildTodoListSchema = (inst) => {
        return {
            selectTodoList: {
                name: 'selectTodoList',
                type: 'select',
                label: getText('Actions'),
                iconClass: 'fa-list',
                options: _generateTodoOptions(inst)
            }
        };
    };

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _generateTodoOptions = (inst) => {
        const {
            speakerInfo
        } = inst.props;
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const todoList = selectedSpeaker.get('todolists');

        let options = [];

        if (todoList && todoList.size) {
            todoList.map((todo) => {
                options.push({
                    text: todo.get('listname'),
                    value: todo.get('id').toString()
                });
            });
        }

        return options;
    };

    /**********************************
     * Mixins
     *********************************/

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
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
            'event',
            'nav',
            'jobBoard',
            'speakerInfo',
            'auth'
        ]
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/
    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'TodoListForm',

        /**
         * Specifies what properties we are expecting in this.props
         */
        propTypes: {
            speakerInfo: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired
        },

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Generates the full schema to build the form inputs
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, _buildTodoListSchema(this));
        },

        /**
         * Generates virtual DOM/HTML
         *
         *
         * @returns {*}
         */
        render() {
            return <form
                ref='TodoList-form'
                onSubmit={this.Form_onSubmit}>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { TodoListFormFactory }
