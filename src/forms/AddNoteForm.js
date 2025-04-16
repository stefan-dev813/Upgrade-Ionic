/**
 * Creates an AddNoteForm component
 *
 * @param {object} spec
 * @returns {*}
 * @constructor
 * @mixes FormMixin
 * @mixes FormHelperMixin
 */
const AddNoteFormFactory = (spec) => {
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

    let _updateHeaderActions;

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

        dispatch(setHeaderActions(inst.determineSaveAction(currentProps)));
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
            view: PropTypes.object.isRequired,
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'nav',
            'event'
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
        displayName: 'AddNoteForm',
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
            return {
                'content': {
                    name: 'content',
                    type: 'textarea',
                    showIcon: false,
                    placeholder: getText('Enter a note about this event'),
                    validate: v.required
                }
            };
        },

        getInitialValues() {
            const {
                event
            } = this.props;
            const selectedNote = event.get('selectedNote');
            const modifiedEvent = event.get('modifiedEvent');
            const notesList = modifiedEvent.get('Note');

            let values = {};

            if (selectedNote) {
                notesList.map((note) => {
                    if (note.get('id') === selectedNote.get('id')) {
                        values['content'] = note.get('content');
                    }
                });
            }

            return values;
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
                    ref='add-note-form'
                    onSubmit={this.Form_onSubmit}>
                    {this.generateFields({fields: this.buildSchema()})}
                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { AddNoteFormFactory }
