/**
 * Generates a DetailsView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const DetailsViewFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {AddButtonFactory} = require('../../components/AddButton');
    const {DetailsFormFactory} = require('../../forms/DetailsForm');
    const {EventInfoCardFactory} = require('../../components/cards/EventInfoCard');
    const {FormLoadingFactory} = require('../../components/FormLoading');

    const {
        NotesListFactory,
        StageTimeListFactory
    } = require('../../components/list');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const {
        isEspeakers,
        isSolutionTree
    } = require('../../util/Platform').default;

    // Actions
    const {
        EventActionsFactory,
        NoteActionsFactory,
        StageTimeActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        isMarketPlaceEvent,
        prepareDetailsFormData,
        saveEvent,
        stopProp
    } = EventActionsFactory({});
    const {
        selectNote
    } = NoteActionsFactory({});
    const {
        selectStageTime
    } = StageTimeActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    const AddButton = AddButtonFactory({});
    const DetailsForm = DetailsFormFactory({});
    const EventInfoCard = EventInfoCardFactory({});
    const FormLoading = FormLoadingFactory({});
    const NotesList = NotesListFactory({});
    const StageTimeList = StageTimeListFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _submitHandler;
    let _toggleNoteDetails;
    let _toggleStageTimeDetails;

    /**
     * Handles the DetailsForm submission
     *
     * @param {object} form - Form values
     * @param {object} inst
     */
    _submitHandler = (form, inst) => {
        const {
            event
        } = inst.props;

        const modifiedEvent = event.get('modifiedEvent');

        // merge in saved data
        const mergedEvent = modifiedEvent.merge(prepareDetailsFormData(form));

        saveEvent(mergedEvent);
    };

    /**
     *
     * @param {object} item
     * @param {object} inst
     * @private
     */
    _toggleNoteDetails = (item, inst) => {
        inst.setState({
            toggledNoteId: item.dataset.noteId
        });
    };

    /**
     *
     * @param item
     * @param inst
     * @private
     */
    _toggleStageTimeDetails = (item, inst) => {
        inst.setState({
            toggledStageTimeId: item.dataset.stagetimeId
        });
    };

    let _addNoteHandler;
    let _addStageTimeHandler;

    /**
     *
     * @param inst
     * @private
     */
    _addNoteHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectNote({
            id: '0'
        }));
    };

    /**
     * @param inst
     * @private
     */
    _addStageTimeHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(selectStageTime({
            id: '0'
        }));
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
        },
        compareState: true
    });

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'DetailView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                showSystemNotes: false,
                toggledNoteId: undefined,
                toggledStageTimeId: undefined,
                expandAllNotes: false,
                expandAllStageTimes: false
            };
        },
        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            const {
                expandAllNotes,
                expandAllStageTimes
            } = this.state;

            const {
                event
            } = this.props;

            const modifiedEvent = event.get('modifiedEvent');

            let isPersonal = false;

            if (modifiedEvent) {
                isPersonal = modifiedEvent.get('isPersonal');
            }

            let actions = [];

            if ((!isSolutionTree() || (isSolutionTree() && isPersonal))
                && !isMarketPlaceEvent(modifiedEvent)) {
                actions.push({
                    label: getText('Add Stage Time'),
                    iconClass: 'event-note',
                    onClick: (e) => {
                        stopProp(e);

                        _addStageTimeHandler(this);
                    }
                });
            }

            if (isEspeakers()) {
                actions.push({
                    label: getText('Add Note'),
                    iconClass: 'speaker-notes',
                    onClick: (e) => {
                        stopProp(e);

                        _addNoteHandler(this);
                    }
                });
            }

            return (
                <FormLoading>

                    <EventInfoCard/>

                    <DetailsForm
                        onSubmit={(form) => {
                            _submitHandler(form, this);
                        }}/>

                    <StageTimeList/>

                    {isEspeakers() ? <NotesList/> : null}

                    <AddButton actions={actions}/>
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { DetailsViewFactory }