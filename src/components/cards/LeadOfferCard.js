/**
 * Generates a LeadOfferCard component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LeadOfferCardFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // NPM
    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const Avatar = require('material-ui/Avatar').default;
    const ListItem = require('material-ui/List').ListItem;
    const Chip = require('material-ui/Chip').default;

    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;
    const VIEWS = require('../../enums/VIEWS').default;

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    // Utils
    const DateToolsFactory = require('../../util/DateTools').default;
    const esUtils = require('ES/utils/esUtils');
    const {
        log
    } = require('../../util/DevTools').default;

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {
        stopProp
    } = EventActionsFactory({});

    const {
        getOfferStatusDisplay,
        getOfferStatusIndexByJob,
        selectJob
    } = JobBoardActionsFactory();

    const {
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _generateAvatar;
    let _generateStatusChip;
    let _goToEvent;


    /**
     *
     * @param inst
     * @returns {XML}
     * @private
     */
    _generateAvatar = (inst) => {
        const {job} = inst.props;

        const status = job.get('status');
        const deliveryMethod = job.get('deliverymethod');
        const allowNewApplicants = job.get('allow_new_applicants');

        const dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;
        let bgColor;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        return <Avatar
            backgroundColor={mainTheme.getStatusColor(status)}
            icon={avIcon}/>;
    };

    _generateStatusChip = (myInfo) => {
        let avatar;
        let backgroundColor = mainTheme.offerChipColor;
        let statusText = getOfferStatusDisplay(myInfo);
        let statusIndex = getOfferStatusIndexByJob(myInfo);

        const chipStyles = {
            fontSize: "10px",
            lineHeight: "18px",
            paddingLeft: "6px",
            paddingRight: "6px"
        };

        if(statusIndex === 1) {
            avatar = <Avatar size={10} style={{
                width: 15,
                height: 15,
                fontSize: 10
            }} backgroundColor={mainTheme.errorBackgroundColor}>{myInfo.n_unread}</Avatar>;

            if(myInfo.n_unread > 1) {
                statusText += 's';
            }

            backgroundColor = mainTheme.errorBackgroundColorLighter;
        }

        return <Chip
            labelStyle={chipStyles}
            labelColor={mainTheme.offerChipFontColor}
            backgroundColor={backgroundColor}>
            {avatar}
            {getOfferStatusDisplay(myInfo)}
        </Chip>;
    };

    /**
     *
     * @param inst
     * @private
     */
    _goToEvent = (inst) => {
        const {dispatch, job} = inst.props;

        dispatch(selectJob(job, VIEWS.jobSubViews.LEAD_OFFER_DETAIL_VIEW));
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            job: PropTypes.object.isRequired,
            myInfo: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface / React Component
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'LeadOfferCard',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {job, myInfo} = this.props;

            let style = {};
            let self = this;

            return <ListItem
                style={style}
                leftAvatar={_generateAvatar(this)}
                primaryText={job.get('event_name')}
                secondaryText={(getOfferStatusIndexByJob(myInfo) > 0) ?
                    <div style={{display: 'flex',
                        flexWrap: 'wrap'}}>
                        {_generateStatusChip(myInfo)}
                    </div> : null}
                secondaryTextLines={1}
                onClick={(e) => {
                    stopProp(e);

                    _goToEvent(this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LeadOfferCardFactory }