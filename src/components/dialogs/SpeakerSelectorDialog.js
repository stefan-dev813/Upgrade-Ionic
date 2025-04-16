/**
 * Creates an SpeakerSelectorDialog components
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SpeakerSelectorDialogFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect,
        Provider,
        ReactReduxContext
    } = require('react-redux');

    // MUI
    const Dialog = require('material-ui/Dialog').default;
    const {SpeakerListFactory} = require('../list/SpeakerList');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;

    // Actions
    const {
        DialogActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        closeDialog
    } = DialogActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const SpeakerList = SpeakerListFactory();

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dialog: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
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
        displayName: 'SpeakerSelectorDialog',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates HTML/DOM
         * We have to recover and send the Context on to the <SpeakerList /> component because of a
         * bug with the <Dialog /> component and React.
         * https://stackoverflow.com/questions/56757015/could-not-find-store-error-in-connected-component-nested-in-dialog
         * @return {function|XML|JSX}
         */
        render() {
            const {
                dialog,
                speakerInfo
            } = this.props;

            const show = dialog.get('showSpeakerSelector').get('show');
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const speakerList = speakerInfo.get('speakerList');

            return (
              <ReactReduxContext.Consumer>
                {((ctx) => (
                  <Dialog
                    modal={true}
                    open={(show || !selectedSpeaker)}
                    title={getText('Select Speaker')}
                    bodyStyle={{
                        overflowY: 'scroll'
                    }}>
                      <Provider store={ctx.store}>
                        <SpeakerList />
                      </Provider>
                    </Dialog>
                  ))}
                </ReactReduxContext.Consumer>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SpeakerSelectorDialogFactory }