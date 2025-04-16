/***
 *
 * @param spec
 * @returns {*}
 * @constructor
 */
const SubViewMixinFactory = (spec) => {

    //-------------------------------------------------------------------------
    //
    // Imports
    //
    //-------------------------------------------------------------------------

    // Utils
    const _ = require('lodash');

    // Enums
    const BTN = require('../enums/BTN').default;

    // Actions
    const {
        EventActionsFactory,
        ViewActionsFactory
    } = require('../actions');

    //-------------------------------------------------------------------------
    //
    // Private Members
    //
    //-------------------------------------------------------------------------

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});

    //-------------------------------------------------------------------------
    //
    // Public Interface
    //
    //-------------------------------------------------------------------------

    return {
        /**
         * Invoked when a component is receiving new props. This method is not
         * called for the initial render.
         *
         * @param {object} nextProps
         */
        componentWillReceiveProps(nextProps) {
            const nextView = nextProps.view;
            const currentView = this.props.view;

            if (currentView.get('dirty') !== nextView.get('dirty')) {
                this.updateHeaderActions(nextProps);
            }
        },

        /**
         *
         * @param props
         * @returns {Array}
         */
        determineSaveAction(props) {
            const {
                view
            } = props;

            let actions = [];

            if (view.get('dirty')) {
                actions.push({
                    type: BTN.SAVE,
                    onClick: (event) => {
                        stopProp(event);

                        if (_.isFunction(this.Form_onSubmit)) {
                            this.Form_onSubmit();
                        }
                    }
                });
            }

            return actions;
        }
    };
}

export default SubViewMixinFactory;