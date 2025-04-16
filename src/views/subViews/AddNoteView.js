/**
 * Creates an AddNoteView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const AddNoteViewFactory = (spec) => {

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
        AddNoteFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        NoteActionsFactory,
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
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        saveNote
    } = NoteActionsFactory({});
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
            auth,
            dispatch,
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');
        const authedUserSession = auth.get('authedUserSession');
        const username = authedUserSession.get('MY_USERNAME');
        const selectedNote = event.get('selectedNote');
        const notesList = modifiedEvent.get('Note');

        let existingNote = undefined;

        if (selectedNote) {
            notesList.map((note) => {
                if (note.get('id') === selectedNote.get('id')) {
                    existingNote = note;
                }
            });
        }

        dispatch(saveNote(_.assign({
            id: 0,
            eid: modifiedEvent.get('eid'),
            content: form.content,
            datetime: new Date(),
            enteredby: username
        }, (existingNote ? {
            id: existingNote.get('id'),
            datetime: existingNote.get('datetime'),
            enteredby: existingNote.get('enteredby')
        } : null))));
        dispatch(toggleEventDirty(true));
        dispatch(toggleViewDirty(false));
        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const AddNoteForm = AddNoteFormFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired
        },
        propsPriority: [
            'event',
            'auth'
        ]
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
        displayName: 'AddNoteView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return <AddNoteForm
            ref = "addNotForm"
            onSubmit = {
                (form) => {
                    _submitHandler(form, this);
                }
            }/>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { AddNoteViewFactory }