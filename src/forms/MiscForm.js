/**
 * Generates a MiscForm component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 */
const MiscFormFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');
    const {
        connect
    } = require('react-redux');

    // Factories
    const {
        PanelFactory
    } = require('../components');

    const {StoryListFactory} = require('../components/list/StoryList');
    const {ViewHeaderFactory} = require('../components/ViewHeader');

    // Mixins
    const FormMixin = require('react-loose-forms');
    const {
        AutoShouldUpdateMixinFactory,
        EventMixinFactory,
        FormHelperMixinFactory
    } = require('../mixins');
    const v = require('react-loose-forms.validation');

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;
    const {
        getIn
    } = require("ES/utils/esUtils");
    const {
        isEspeakers,
        isSolutionTree
    } = require('../util/Platform').default;

    // Actions
    const {
        EventActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Actions
     *********************************/

    const {
        prepareMiscFormData,
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Components
     *********************************/

    const Panel = PanelFactory({});
    const StoryList = StoryListFactory({});
    const ViewHeader = ViewHeaderFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildCSPSchema;
    let _buildMiscSchema;
    let _generatePresentingProductOptions;
    let _generateSourceOptions;
    let _generateSpeechTitleOptions;

    /**
     * Builds form input instructions for the CSP section
     *
     * @returns {object}
     * @private
     */
    _buildCSPSchema = () => {
        return {
            nonCSP: {
                name: 'nonCSP',
                type: 'toggle',
                label: getText('For CSP')
            },
            cspDivision: {
                name: 'cspDivision',
                type: 'text',
                iconClass: 'fa-area-chart',
                label: getText('CSP Division')
            }
        };
    };

    /**
     * Builds form input instructions for the Misc section
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _buildMiscSchema = (inst) => {
        let schema = {
            speechTitle: {
                name: 'speechTitle',
                type: 'select',
                label: getText('Presentation'),
                iconClass: 'fa-group',
                options: _generateSpeechTitleOptions(inst)
            },
            dress: {
                name: 'dress',
                type: 'text',
                label: getText('Dress'),
                iconClass: 'fa-black-tie'
            },
            audienceSize: {
                name: 'audienceSize',
                type: 'text',
                iconClass: 'fa-group',
                label: getText('Audience Size')
            },
            source: {
                name: 'source',
                type: 'select',
                iconClass: 'fa-sort-down',
                label: getText('Lead Source'),
                options: _generateSourceOptions(inst)
            },
            publicInvited: {
                name: 'publicInvited',
                type: 'toggle',
                label: getText('Public Invited')
            },
            offerPending: {
                name: 'offerPending',
                type: 'toggle',
                label: getText('Offer Pending')
            }
        };

        if (isSolutionTree()) {
            schema.speechTitle.label = getText('Presn. Category');

            schema = _.omit(schema, ['source', 'publicInvited', 'offerPending']);
        }

        if (!isEspeakers()) {
            _.map(schema, (field, key) => {
                if (key !== 'dress') {
                    field['disabled'] = true;
                }

                return field;
            });
        }

        return schema;
    };

    /**
     *
     * @param inst
     * @private
     */
    _generatePresentingProductOptions = (inst) => {
        const {
            displayData,
            event
        } = inst.props;
        const modifiedEvent = event.get('modifiedEvent');
        const list = displayData.get('displayLists').get('universal').get('presentingproduct');

        let options = [];

        if (list && list.size) {
            list.map(({
                id,
                companyId,
                description
            }) => {
                if (modifiedEvent.get('companyID') === companyId) {
                    options.push({
                        text: description,
                        value: id
                    });
                }
            });
        }

        return options;
    };

    /**
     *
     * @param {object} inst
     * @returns {Array}
     * @private
     */
    _generateSourceOptions = (inst) => {
        const {
            speakerInfo
        } = inst.props;
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const sourceList = selectedSpeaker.get('event_sources');

        let options = [];

        if (sourceList && sourceList.size) {
            sourceList.map((obj) => {
                options.push({
                    text: obj.get('source'),
                    value: obj.get('source')
                });
            });
        }

        return options;
    };

    /**
     *
     * @param {object} inst
     * @returns {Array}
     * @private
     */
    _generateSpeechTitleOptions = (inst) => {
        const {
            displayData,
            speakerInfo
        } = inst.props;
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        let presentationList = selectedSpeaker.get('presentations');

        let options = [];

        if (isSolutionTree()) {
            presentationList = displayData.get('displayLists').get('universal').get('presentationcategory');
        }

        if (presentationList && presentationList.size) {
            presentationList.map((presentation) => {
                options.push({
                    text: presentation,
                    value: presentation
                });
            });
        }

        return options;
    };

    /**********************************
     * Mixins
     *********************************/

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            displayData: PropTypes.object.isRequired,
            event: PropTypes.object.isRequired,
            jobBoard: PropTypes.object.isRequired,
            nav: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired,
            speakerInfo: PropTypes.object.isRequired,
            view: PropTypes.object.isRequired
        },
        compareState: true,
        propsPriority: [
            'onSubmit',
            'view',
            'event',
            'nav',
            'jobBoard',
            'speakerInfo',
            'displayData'
        ]
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
        displayName: 'MiscForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines all the form input instructions
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, _buildMiscSchema(this), _buildCSPSchema(this));
        },

        /**
         * Returns pre-filled values for the form based on the props
         *
         * @param props
         * @returns {object}
         * @overrides FormMixin
         */
        getInitialValues(props) {
            const {
                event
            } = this.props;
            const modifiedEvent = event.get('modifiedEvent');

            let initialValues = {};

            // strings
            _.map([
                'cspDivision',
                'speechTitle',
                'dress',
                'audienceSize',
                'source',
                'presentingproductid'
            ], (key) => {
                initialValues[key] = (_.isNumber(modifiedEvent.get(key)) ? modifiedEvent.get(key).toString() : modifiedEvent.get(key));
            });

            // booleans
            _.map([
                'nonCSP',
                'publicInvited',
                'offerPending'
            ], (key) => {
                if (key === 'nonCSP') {
                    initialValues[key] = !modifiedEvent.get(key);
                }
                else {
                    initialValues[key] = modifiedEvent.get(key);
                }
            });

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         */
        onFormChanged: function (name, value) {
            const {
                dispatch
            } = this.props;

            dispatch(toggleEventDirty(true));
        },

        /**
         *
         * @returns {object}
         */
        prepareFormData() {
            const {
                event
            } = this.props;

            let form = _.clone(this.state.data);

            return prepareMiscFormData(event, form);
        },

        render() {
            /**
             * Generates the virtual DOM/HTML
             *
             * @returns {*}
             */
            return <form
                ref='Misc-form'
                onSubmit={this.Form_onSubmit}>
                <div>
                    <ViewHeader>{getText('Misc')}</ViewHeader>

                    {this.generateFields({fields: _buildMiscSchema(this)})}

                    {(isEspeakers() ? <Panel
                        headingText={getText('CSP')}
                        headingIconClass='fa-area-chart'>
                        {this.generateFields({fields: _buildCSPSchema(this)})}
                    </Panel> : null)}

                    {(!isSolutionTree() ?
                        <StoryList/>
                        : null)}

                </div>
            </form>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { MiscFormFactory }