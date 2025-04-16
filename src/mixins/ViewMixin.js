/**
 * Generates a ViewMixin component.  For shared functionality between view
 * components.
 *
 * @param {object} spec - Container for named parameters
 * @property {boolean} spec.noHeader - If the view doesn't have a header (and therefore no actions)
 * @returns {object}
 * @constructor
 * @mixin
 */
const ViewMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const {
        radio
    } = require('react-pubsub-via-radio.js');

    // Enums
    const RADIOS = require('../enums/RADIOS').default;

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
        ViewActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const {
        noHeader
    } = spec;

    /**********************************
     * Actions
     *********************************/

    const {
        setHeaderActions,
        setHeaderText
    } = ViewActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    const {
        updateHeaderActionsOverride,
        headerText
    } = spec;

    /**********************************
     * Methods
     *********************************/

    let _updateHeaderActions;
    let _updateHeaderText;

    /**
     * Updates the header actions for the most common shared actions
     *
     * @param {object} inst - Reference to React component
     * @private
     */
    _updateHeaderActions = updateHeaderActionsOverride || function _updateHeaderActions(inst, props) {
            let currentProps = props || inst.props;

            const {
                dispatch
            } = currentProps;

            dispatch(setHeaderActions([]));
        };

    /**
     *
     * @param inst
     * @private
     */
    _updateHeaderText = (headerText, inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(setHeaderText(headerText));
    };

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    return _.assign({}, {
        componentDidMount() {
            if (noHeader !== true) {
                this.updateHeaderActions();
            }

            if (_.isFunction(this.updateHeaderText)) {
                this.updateHeaderText();
            }
        },
        /**
         * Updates the actions in the header.  Run from componentDidMount and
         * componentDidUpdate.  Overridable.
         *
         */
        updateHeaderActions(props) {
            _updateHeaderActions(this, props);
        },
        getHeaderText() {
            return headerText;
        },
        updateHeaderText() {
            _updateHeaderText(this.getHeaderText(), this);
        }
    }, (spec ? spec.overrides : null));
}

export default ViewMixinFactory;