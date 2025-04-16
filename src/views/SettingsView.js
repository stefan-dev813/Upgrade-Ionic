/**
 * Creates a SettingsView React Component
 *
 * @param spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const SettingsViewFactory = (spec) => {

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
        connect
    } = require('react-redux');

    // Enums
    const VIEWS = require('../enums/VIEWS').default;

    // Factories
    const MUIButtonGroupFactory = require('../forms/MUIButtonGroup').default;
    const {SpeakerListFactory} = require('../components/list/SpeakerList');
    const {ResponsiveLog} = require('../components/ResponsiveLog');
    const {SectionHeaderFactory} = require('../components/SectionHeader');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../mixins');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    const Platform = require('../util/Platform').default;

// Actions
    const {
        AuthActionsFactory,
        DisplayDataActionsFactory,
        EventActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Variables
     *********************************/

    const versionNumber = process.env.PACKAGE_JSON_VERSION;

    /**********************************
     * Actions
     *********************************/

    const {
        logout
    } = AuthActionsFactory({});
    const {
        refreshDisplayData
    } = DisplayDataActionsFactory({});
    const {
        stopProp
    } = EventActionsFactory({});
    const {
        changeMainView
    } = NavActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /*********************************
     * Factories
     *********************************/

    const ButtonGroup = MUIButtonGroupFactory({});
    const SpeakerList = SpeakerListFactory({});
    const SectionHeader = SectionHeaderFactory({});

    /*********************************
     * Methods
     *********************************/

    let _logoutTouchHandler;
    let _refreshDataTouchHandler;

    /**
     *
     * @param inst
     * @private
     */
    _logoutTouchHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        dispatch(logout());
    };

    /**
     *
     * @param inst
     * @private
     */
    _refreshDataTouchHandler = (inst) => {
        const {
            dispatch
        } = inst.props;

        // We don't want this to happen silently
        dispatch(refreshDisplayData(false));
        dispatch(changeMainView(VIEWS.mainViews.CALENDAR_VIEW));
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'SettingsView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],
        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {
                speakerInfo
            } = this.props;

            const speakerList = speakerInfo.get('speakerList');

            return <div className="settings">
                <ButtonGroup buttons={[
                    {
                        props: {
                            label: getText('Refresh Data'),
                            onClick: (e) => {
                                stopProp(e);

                                _refreshDataTouchHandler(this);
                            }
                        }
                    },
                    {
                        props: {
                            label: getText('Logout'),
                            onClick: (e) => {
                                stopProp(e);

                                _logoutTouchHandler(this);
                            }
                        }
                    }
                ]}/>

                {(speakerList && speakerList.size > 1) ? (
                        <div>
                            <SectionHeader>{getText('Select Speaker')}</SectionHeader>

                            <SpeakerList/>

                        </div>
                    ) : null}

                {(versionNumber && versionNumber.toString().length ?
                    <div className='version-number'>
                        {`Version: ${versionNumber.toString()}`}
                    </div>
                    : null)}
            </div>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { SettingsViewFactory }