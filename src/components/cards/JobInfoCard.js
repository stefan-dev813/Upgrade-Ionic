/**
 *
 * @param spec
 * @constructor
 * @mixes AddressMixin
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const JobInfoCardFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const {fromJS} = require('immutable');

    // Redux
    const {connect} = require('react-redux');

    // Util
    const _ = require('lodash');
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});

    // Enums
    const DELIVERY_METHOD_ICONS = require('../../enums/DELIVERY_METHOD_ICONS').default;
    const OFFER_STATUS = require('../../enums/OFFER_STATUS').default;

    // Mixins
    const {
        AddressMixinFactory,
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Actions
    const {
        JobBoardActionsFactory
    } = require('../../actions');

    // Theme
    const mainTheme = require('../../theme/mainTheme').default;
    const IconMap = require('../../theme/IconMap');

    // Components
    const Avatar = require('material-ui/Avatar').default;
    const {IconLabelFactory} = require('../IconLabel');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {getMyInfo, getOfferEventStatus} = JobBoardActionsFactory();

    //---------------------------------
    // Methods
    //---------------------------------

    let _buildHeadingMap;
    let _determineStatusColor;
    let _generateAvatar;

    /**
     *
     * @param {object} spec
     * @property {Record} spec.record
     * @property {object} spec.inst
     * @property {object} spec.map
     * @returns {{}}
     * @private
     */
    _buildHeadingMap = (spec) => {
        let map = {};
        let inst = spec.inst;
        let record = spec.record;
        const {
            job,
            speaker,
            myInfo
        } = record;

        let formattedDate = esUtils.format_date(convertFromBalboaTrunkTimestamp(job.get('starttime')), esUtils.format_date.masks.mediumDate);

        map['strdate'] = {
            subHeading: formattedDate,
            iconClass: 'date-range'
        };

        map['address'] = {
            subHeading: job.get('location'),
            iconClass: 'location-on'
        };

        return map;
    };

    /**
     *
     * @param {string} status
     * @returns {string}
     * @private
     */
    _determineStatusColor = (status) => {
        return mainTheme.getStatusColor(status) || mainTheme[`${status}Color`];
    };

    /**
     *
     * @param {Object|Record} job
     * @returns {XML}
     * @private
     */
    _generateAvatar = (job) => {
        const deliveryMethod = job.get('deliverymethod') || 'none';
        const status = job.get('status');

        let dmIcon = DELIVERY_METHOD_ICONS[deliveryMethod];
        let avIcon;
        let bgColor;

        if (dmIcon) {
            avIcon = IconMap.getElement(dmIcon.icon);
        }

        bgColor = _determineStatusColor(status);

        return <Avatar
            backgroundColor={bgColor}
            icon={avIcon}/>;
    };

    //---------------------------------
    // Components
    //---------------------------------

    const IconLabel = IconLabelFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AddressMixin = AddressMixinFactory({});

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    const CardMixin = CardMixinFactory({
        fields: {},
        additionalMapFunc: _buildHeadingMap
    });

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messages
         */
        displayName: 'JobInfoCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AddressMixin, AutoShouldUpdateMixin, CardMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const jobSummary = selectedJob.jobSummary;
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const status = jobSummary.get('status');
            const offerStatus = getOfferEventStatus(selectedJob.jobDetail.get('event'), selectedSpeaker.get('sid'));

            let subHeadingCollection;

            let headingMap = this.buildHeadingMap({
                record: {
                    job: jobSummary,
                    speaker: selectedSpeaker,
                    myInfo: getMyInfo({jobBoard, speakerInfo, job: jobSummary})
                },
                inst: this
            });

            let mapKeys = [
                'strdate',
                'address'
            ];

            subHeadingCollection = this.extractHeadings(headingMap, mapKeys);

            return (
                <div style={{
                    backgroundColor: 'whitesmoke',
                    minHeight: '80px',
                    color: '#777',
                    display: 'flex',
                    padding: '10px',
                    borderBottom: `2px solid ${_determineStatusColor(status)}`
                }}>

                    <div style={{
                        order: 1
                    }}>
                        {_generateAvatar(jobSummary)}
                    </div>

                    <div style={{
                        order: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 1,
                        flexGrow: 1
                    }}>

                        <div style={{
                            order: 1,
                            paddingTop: '5px',
                            paddingLeft: '5px',
                            fontWeight: 'bold'
                        }}>
                            {jobSummary.get('event_name')}
                        </div>

                        <div style={{
                            order: 2,
                            display: 'flex',
                            paddingTop: '10px',
                            paddingLeft: '5px'
                        }}>

                            <div style={{
                                order: 1,
                                flexGrow: 1,
                                fontSize: '12px',
                                color: '#777',
                                fontWeight: 'bold'
                            }}>
                                {_.map(subHeadingCollection, (s, i) => {
                                    return <div key={i} style={{
                                        marginTop: '2px',
                                        marginBottom: '2px'
                                    }}>
                                        <IconLabel fontSize="12px" color="#777" iconClass={s.iconClass}
                                                   label={s.subHeading}/>
                                    </div>;
                                })}
                            </div>

                            <div style={{
                                order: 2,
                                textAlign: 'right',
                                color: _determineStatusColor(status),
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {((offerStatus && offerStatus.status) || status).toUpperCase()}
                            </div>

                        </div>

                        <div style={{
                            order: 3
                        }}></div>

                    </div>

                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { JobInfoCardFactory }