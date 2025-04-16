/**
 * Generates a PayoutDetailView component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const PayoutDetailViewFactory = (spec = {}) => {

    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    const OFFER_STATUS = require('../../enums/OFFER_STATUS');

    // Factories
    const {DisplayFieldFactory} = require('../../components/DisplayField');
    const {SectionHeaderFactory} = require('../../components/SectionHeader');

    const {
        Table,
        TableBody,
        TableRow,
        TableRowColumn,
        TableFooter
    }  = require('material-ui/Table');

    const mainTheme = require('../../theme/mainTheme').default;

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        ViewMixinFactory
    } = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const esUtils = require('ES/utils/esUtils');

    // Actions
    const {
        EventActionsFactory,
        JobBoardActionsFactory,
        NavActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

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
        getLedgerData,
        getOfferEventStatus,
        getPayments
    } = JobBoardActionsFactory();
    const {
        getCurrency,
        getText
    } = TranslateActionsFactory({});
    const DisplayField = DisplayFieldFactory({});
    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Factories
    //---------------------------------

    //---------------------------------
    // Methods
    //---------------------------------

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            displayData: PropTypes.object.isRequired
        }
    });

    const ViewMixin = ViewMixinFactory({});

    //=========================================================================
    //
    // React / Public Interface
    //
    //=========================================================================

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'PayoutDetailView',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, ViewMixin],
        /**
         * Generates virtual DOM/HTML
         *
         * @return {*}
         */
        render() {
            const {
                dispatch,
                displayData,
                event,
                jobBoard,
                speakerInfo
            } = this.props;

            const selectedJob = jobBoard.selectedJob;
            const jobDetail = selectedJob.jobDetail;
            const selectedSpeaker = speakerInfo.selectedSpeaker;

            let eventObj;

            if(event.modifiedEvent) {
                eventObj = event.modifiedEvent;
            } else if(jobDetail) {
                eventObj = jobDetail.get('event');
            }

            const offerStatus = getOfferEventStatus(eventObj, selectedSpeaker.get('sid'));

            const mpAgreement = _.get(eventObj.toJS(), ['MPAgreement', selectedSpeaker.get('sid')]);

            const {
                fees,
                grand_total,
                fee_speaking,
                fee_materials,
                fee_travel
            } = getLedgerData({
                event: eventObj.toJS(),
                Displaylists: displayData.get('displayLists').toJS(),
                mp_agreement: mpAgreement
            });

            let feeRows = [
                {fee: fee_speaking, display: getText('speaking fee')},
                {fee: fee_travel, display: getText('travel')},
                {fee: fee_materials, display: getText('materials / other')}
            ];

            let footerRowStyle = {
                borderTop: '1px solid #999',
                color: '#999',
                verticalAlign: 'middle'
            };

            let dollarStyle = {
                width: 10
            };

            let currencyStyle = {
                width: 50,
                textAlign: 'right'
            };

            let mutedStyle = {
                color: mainTheme.mutedFontColor,
                textAlign: 'center',
                padding: 5
            };

            let tableStyle = {
                backgroundColor: 'inherit',
                borderSpacing: 1,
                display: 'table'
            };

            let rowStyle = {
                height: '24px'
            };

            let columnStyle = {
                height: 24
            };

            dollarStyle = _.assign({}, columnStyle, dollarStyle);
            currencyStyle = _.assign({}, columnStyle, currencyStyle);
            footerRowStyle = _.assign({}, rowStyle, footerRowStyle);

            return (
                <div>
                    <SectionHeader>{getText("contracted fees")}</SectionHeader>
                    <Table style={tableStyle}>
                        <TableBody displayRowCheckbox={false}>
                            {_.map(feeRows, (f, i) => {
                                return (
                                    <TableRow key={`fee-row-${i}`} selectable={false} style={rowStyle}>
                                        <TableRowColumn style={dollarStyle}>$</TableRowColumn>
                                        <TableRowColumn style={currencyStyle}>{esUtils.format_number(f.fee, 2)}</TableRowColumn>
                                        <TableRowColumn style={columnStyle}>{f.display}</TableRowColumn>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {_.map(_.groupBy(fees, "due"), (fees, group) => {
                        let total = _.reduce(fees, (sum, f) => {
                            return sum + f.fee;
                        }, 0);

                        return (
                            <div key={group}>
                                <SectionHeader>{group}</SectionHeader>

                                <Table style={tableStyle}>
                                    <TableBody displayRowCheckbox={false}>
                                        {_.map(fees, (f, i) => {
                                            return (
                                                <TableRow key={`${group}-row-${i}`} selectable={false} style={rowStyle}>
                                                    <TableRowColumn style={dollarStyle}>$</TableRowColumn>
                                                    <TableRowColumn style={currencyStyle}>{esUtils.format_number(f.fee, 2)}</TableRowColumn>
                                                    <TableRowColumn style={columnStyle}>{f.description}</TableRowColumn>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter adjustForCheckbox={false}>
                                        <TableRow selectable={false} style={footerRowStyle}>
                                            <TableRowColumn style={dollarStyle}>$</TableRowColumn>
                                            <TableRowColumn style={currencyStyle}>{esUtils.format_number(total, 2)}</TableRowColumn>
                                            <TableRowColumn style={columnStyle}>{getText("to you *")}</TableRowColumn>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        );
                    })}

                    <Table style={tableStyle}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow selected={false} style={_.assign({}, rowStyle, {
                                borderTop: '1px solid black'
                            })}>
                                <TableRowColumn style={dollarStyle}>$</TableRowColumn>
                                <TableRowColumn style={currencyStyle}>{esUtils.format_number(grand_total, 2)}</TableRowColumn>
                                <TableRowColumn style={columnStyle}>{getText("TOTAL to you *")}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <DisplayField>
                        <div style={{color: '#999', marginTop: "1em"}}>
                            {getText("* less card processing costs up to 3%.")}
                        </div>
                    </DisplayField>
                </div>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { PayoutDetailViewFactory }