/**
 * Creates an ServiceView component
 *
 * @param {object} spec
 * @returns {*} - React Component
 * @constructor
 * @mixes ViewMixin
 * @mixes AutoShouldUpdateMixin
 */
const ServiceViewFactory = (spec) => {

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
        ServiceFormFactory
    } = require('../../forms');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Models
    const ServiceFlagsModel = require('../../stores/models/ServiceFlagsModel').default;

    // Actions
    const {
        EventActionsFactory,
        ServiceActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory,
        ViewActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const esUtils = require('ES/utils/esUtils');
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
        extractSelectedService,
        saveService
    } = ServiceActionsFactory({});
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

        const selectedService = extractSelectedService(event);

        let amount = form.amount;
        let flags = selectedService.get('flags');
        let flagsAsMap = selectedService.get('flags_as_map');

        if (!flagsAsMap || !flagsAsMap.size) {
            flagsAsMap = new ServiceFlagsModel();
        }

        let updatedFlagMap = flagsAsMap;

        updatedFlagMap.map((flag, key) => {
            if ('free' === key.toString()) {
                return flag.set('is_set', 'free' === form.amountType);
            }
            else if ('bill_later' === key.toString()) {
                return flag.set('is_set', 'bill_later' === form.amountType);
            }

            return flag;
        });

        // Now that we've update our flags, we need to iterate over them to create the
        // flag property
        flags = 0;

        // Using iterator because using map just to iterate was wiping out the properties for some reason
        let updateFlagMapIterator = updatedFlagMap.values();
        let currentFlag = updateFlagMapIterator.next();

        while (!currentFlag.done) {
            if (currentFlag.value && currentFlag.value.get('is_set')) {
                flags += currentFlag.value.get('intval');
            }

            currentFlag = updateFlagMapIterator.next();
        }

        let due;

        if (_.isDate(form.due)) {
            due = form.due;
        } else if (_.isString(form.due) && form.due.length) {
            due = DateTools.toDate(form.due);
        }

        dispatch(saveService(_.assign({
                id: '0'
            },
            (selectedService ? selectedService.toJS() : {}),
            _.pick(form, [
                'groupcode',
                'description'
            ]), {
                fee: amount,
                flags: flags,
                flags_as_map: updatedFlagMap.toJS(),
                due: due,
                due_ISO8601: (due && _.isDate(due) ? esUtils.returnISO8601(due) : null) // esUtils.convertJSEventToBalboa3Event doesn't include Services so we need to do it manually
            }
        )));

        dispatch(toggleEventDirty(true));

        dispatch(toggleViewDirty(false));

        dispatch(popSubView());
    };

    /**********************************
     * Components
     *********************************/

    const FormLoading = FormLoadingFactory({});
    const ServiceForm = ServiceFormFactory({});

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
        displayName: 'ServiceView',
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
                    <ServiceForm
                        ref='editServiceForm'
                        onSubmit={
                            (form) => {
                                _submitHandler(form, this);
                            }
                        }
                    />
                </FormLoading>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ServiceViewFactory }