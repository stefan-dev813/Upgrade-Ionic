/**
 * Generates a PipelineList component
 *
 * @param {object} spec
 * @constructor
 * @returns {function|*} - Redux 'connected'
 */
const PipelineListFactory = (spec) => {

    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // React
    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    const {PipelineCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {getText} = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _generatePipelineData;

    /**
     *
     * @param inst
     * @returns {Record|Map}
     * @private
     */
    _generatePipelineData = (inst) => {
        const {
            dashboard,
            speakerInfo
        } = inst.props;
        const pipeline = dashboard.get('pipeline');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');

        let pipelineData = null;

        if (selectedSpeaker && pipeline) {
            if (pipeline.get(`sid${selectedSpeaker.get('sid')}`)) {
                pipelineData = pipeline.get(`sid${selectedSpeaker.get('sid')}`);
            }
            else if (pipeline.get('sid0')) {
                pipelineData = pipeline.get('sid0');
            }
        }

        return pipelineData;
    };

    /**********************************
     * Components
     *********************************/

    let PipelineCard = PipelineCardFactory({});
    const SectionHeader = SectionHeaderFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            dashboard: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'PipelineList',

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
            const pipelineData = _generatePipelineData(this);

            return <List>
                <SectionHeader>{getText('Events Pipeline')}</SectionHeader>

                {(pipelineData && pipelineData.get('s1') && pipelineData.get('s1').size) ?
                    <div>
                        <PipelineCard
                            label={getText('Confirmed')}
                            searchTerm='pipeline:confirmed'
                            pipelineData={pipelineData.get('s1')}/>

                        <Divider/>
                    </div>
                    : null}

                {(pipelineData && pipelineData.get('s0') && pipelineData.get('s0').size) ?
                    <div>
                        <PipelineCard
                            label={getText('Held')}
                            searchTerm='pipeline:held'
                            pipelineData={pipelineData.get('s0')}/>

                        <Divider/>
                    </div>
                    : null}

                {(pipelineData && pipelineData.get('s10') && pipelineData.get('s10').size) ?
                    <div>
                        <PipelineCard
                            label={getText('Leads')}
                            searchTerm='pipeline:lead'
                            pipelineData={pipelineData.get('s10')}/>
                        <Divider/>
                    </div>
                    : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { PipelineListFactory }