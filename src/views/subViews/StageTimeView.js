/**
 * Creates an StageTimeView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const StageTimeViewFactory = (spec) => {

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
    const {FormLoadingFactory} = require('../../components/FormLoading');
    const {
        StageTimeFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        VenueActionsFactory,
        DialogActionsFactory,
        NavActionsFactory,
        StageTimeActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
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
        extractSelectedVenue,
        saveVenue
    } = VenueActionsFactory({});
    const {
        extractSelectedStageTime,
        saveStageTime
    } = StageTimeActionsFactory({});
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

        const selectedStageTime = extractSelectedStageTime(event);
        const selectedVenue = extractSelectedVenue(event, form.venueId);

        dispatch(saveStageTime(_.assign({
                id: '0'
            },
            (selectedStageTime ? selectedStageTime.toJS() : {}), {
                starttime: DateTools.mergeDate(form.startDate, form.startTime),
                stoptime: DateTools.mergeDate(form.stopDate, form.stopTime),
                avchecktime: DateTools.mergeDate(form.avcheckdate, form.avchecktime)
            }, _.pick(form, ['venueid', 'description', 'room']))));

        dispatch(saveVenue(_.assign({
                id: '0'
            },
            (selectedVenue ? selectedVenue.toJS() : {
                id: form.venueid || '0'
            }), {},
            _.pick(form, ['building',
                'city',
                'st',
                'country',
                'address',
                'phone',
                'fax',
                'zip',
                'timezone'
            ]))));

        dispatch(toggleEventDirty(true));

        dispatch(toggleViewDirty(false));

        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const FormLoading = FormLoadingFactory({});
    const StageTimeForm = StageTimeFormFactory({});

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
        displayName: 'StageTimeView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            return (
                <FormLoading>
                    <StageTimeForm
                        ref='editStageTimeForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }/>
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { StageTimeViewFactory }