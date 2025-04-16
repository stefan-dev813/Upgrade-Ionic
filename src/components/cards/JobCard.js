/**
 * Generates a JobCard component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobCardFactory = (spec) => {
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
        getBudget,
        getTopics,
        selectJob
    } = JobBoardActionsFactory();

    const {
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    //---------------------------------
    // Methods
    //---------------------------------

    let _formatBudgetText;
    let _generateAvatar;
    let _generateLocationText;
    let _goToJob;


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

        if(allowNewApplicants === false) {
            return <Avatar
                backgroundColor="#D0D0D0"
                color={mainTheme.errorBackgroundColor}
                style={{
                    fontSize: '12px'
                }}>
                {getText('FULL')}
            </Avatar>;
        }

        return <Avatar
            backgroundColor={mainTheme.getStatusColor(status)}
            icon={avIcon}/>;
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateLocationText = (inst) => {
        const {job} = inst.props;

        let date = DateTools.convertFromBalboaTrunkTimestamp(job.get('starttime'));

        let formattedDate;

        if (date) {
            formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);
        }

        if (job.get('location') && job.get('location').length) {
            return getText('%1$s - %2$s', {
                params: [formattedDate, job.get('location')]
            });
        }

        return formattedDate;
    };

    /**
     *
     * @param inst
     * @private
     */
    _goToJob = (inst) => {
        const {job, dispatch} = inst.props;

        dispatch(selectJob(job));
    };

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            job: PropTypes.object.isRequired
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
        displayName: 'JobCard',

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
            const {job} = this.props;

            let allowNewApplications = job.get('allow_new_applicants');

            const chipStyles = {
                fontSize: "9px",
                lineHeight: "14px",
                paddingLeft: "6px",
                paddingRight: "6px"
            };

            let style = {};

            if(allowNewApplications === false) {
                style = _.assign({}, style, {
                    opacity: '0.75'
                });
            }

            return <ListItem
                style={style}
                leftAvatar={_generateAvatar(this)}
                primaryText={job.get('event_name')}
                secondaryText={<div>
                    <div>
                        {_generateLocationText(this)}
                    </div>
                    <div style={{display: 'flex',
                        flexWrap: 'wrap'}}>
                        <span>
                            {getBudget(job)}
                        </span>
                        {_.map(getTopics(job), (topic, i) => {
                            return <Chip key={i} style={{
                                margin: '4px'
                            }} labelStyle={chipStyles}>{topic}</Chip>;
                        })}
                    </div>
                </div>}
                secondaryTextLines={2}
                onClick={(e) => {
                    stopProp(e);

                    if(allowNewApplications === true) {
                        // open job detail
                        _goToJob(this);
                    }
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobCardFactory }