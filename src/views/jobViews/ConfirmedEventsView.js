/**
 * Generates a ConfirmedEventsView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes RadioServiceMixin
 * @mixes AutoShouldUpdateMixin
 */
const ConfirmedEventsViewFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const _ = require('lodash');
    const {
        RadioServiceMixin,
        radio
    } = require('react-pubsub-via-radio.js');
    const {
        connect
    } = require('react-redux');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../../util/DevTools').default;
    const DateTools = require('../../util/DateTools').default({});

    // Enums
    const {
        RADIOS,
    } = require('../../enums');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            speakerInfo: PropTypes.object.isRequired
        },
        propsPriority: [
            'speakerInfo'
        ]
    });

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debugging message
         */
        displayName: 'ConfirmedEventsView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, RadioServiceMixin, ViewMixin],
        /**
         * Sets up the Service radio channels we are interacting with
         *
         * @returns {object}
         */
        RadioService_setup() {
            const {
                dispatch
            } = this.props;

            let radios = {};

            // radios[RADIOS.services.LOAD_JOBS] = {
            //     key() {
            //         const {
            //             speakerInfo
            //         } = this.props;
            //
            //         return speakerInfo.get('selectedSpeaker').get('sid').toString();
            //     },
            //     on: {
            //         waiting() {
            //             dispatch(showLoading());
            //         },
            //         succeeded(data) {
            //             dispatch(hideLoading());
            //
            //             dispatch(updateDashboardStore(_.assign({
            //                 lastUpdated: new Date()
            //             }, data)));
            //         },
            //         failed(error) {
            //             dispatch(hideLoading());
            //
            //             // TODO: i18n error messages
            //             dispatch(setMessage({
            //                 type: 'error',
            //                 text: error
            //             }));
            //         }
            //     }
            // };

            return radios;
        },
        /**
         * Triggers when the component receives a new set of properties.  Refreshes the screen if a new selectedSpeaker
         * is passed in.
         *
         * @param nextProps
         */
        componentWillReceiveProps(nextProps) {
            const {
                speakerInfo
            } = nextProps;

            const selectedSpeaker = speakerInfo.get('selectedSpeaker');

            const currentSpeakerInfo = this.props.speakerInfo;
            const currentSelectedSpeaker = currentSpeakerInfo.get('selectedSpeaker');

            let speakerMismatch = (currentSelectedSpeaker &&
                selectedSpeaker &&
                selectedSpeaker.get('sid') &&
                currentSelectedSpeaker.get('sid') &&
                currentSelectedSpeaker.get('sid').toString() !== selectedSpeaker.get('sid').toString());

            if (speakerMismatch) {
                // loadDashboard({
                //     sid: selectedSpeaker.get('sid')
                // });
            }
        },
        /**
         * Triggers after the component and all child components render.  Calls to load the dashboard data
         */
        componentDidMount() {
            const {
                speakerInfo
            } = this.props;

            // if (speakerInfo &&
            //     speakerInfo.get('selectedSpeaker') &&
            //     speakerInfo.get('selectedSpeaker').get('sid') && !dashboard.get('lastUpdated')) {
            //     // loadDashboard({
            //     //     sid: speakerInfo.get('selectedSpeaker').get('sid')
            //     // });
            // }
        },
        /**
         * Generates the virtual DOM/HTML
         * @returns {*}
         */
        render() {
            return <div>
                <h1>Confirmed Events</h1>
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { ConfirmedEventsViewFactory }