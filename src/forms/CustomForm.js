/**
 * Generates a CustomForm component
 *
 * @param {object} spec - Container for named parameters
 * @constructor
 * @mixes EventMixin
 * @mixes FormMixin
 * @mixes FormHelperMixin
 * @mixes AutoShouldUpdateMixin
 * @returns {*} - React Component
 */
const CustomFormFactory = (spec) => {
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
        prepareCustomFormData,
        toggleEventDirty
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Factories
     *********************************/

    const Panel = PanelFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildLongSchema;
    let _buildShortSchema;

    /**
     * Generates form input instructions for building the Custom Notes (Long) section
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _buildLongSchema = (inst) => {
        const {
            displayData,
            speakerInfo
        } = inst.props;
        const displayLists = displayData.get('displayLists');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const fieldList = selectedSpeaker.get('customfieldlabels');

        const longList = fieldList.filter((field) => {
            try {
                return parseInt(field.get('id'), 10) >= 100;
            }
            catch (e) {
                return false;
            }
        });

        let schema = {};
        let foundField;

        for (let i = 100; i < 108; i += 1) {
            foundField = longList.find((field) => {
                return field.get('id') === i.toString();
            });

            schema[i.toString()] = {
                name: i.toString(),
                type: 'textarea',
                label: (foundField ? foundField.get('lbl') : ''),
                icon: false
            };
        }

        return schema;
    };

    /**
     * Generates form input instructions for building the Custom Fields (Short) section
     *
     * @param {object} inst
     * @returns {object}
     * @private
     */
    _buildShortSchema = (inst) => {
        const {
            displayData,
            speakerInfo
        } = inst.props;
        const displayLists = displayData.get('displayLists');
        const selectedSpeaker = speakerInfo.get('selectedSpeaker');
        const fieldList = selectedSpeaker.get('customfieldlabels');

        const shortList = fieldList.filter((field) => {
            try {
                return parseInt(field.get('id'), 10) < 100;
            }
            catch (e) {
                return false;
            }
        });

        let schema = {};
        let foundField;

        for (let i = 0; i < 10; i += 1) {
            foundField = shortList.find((field) => {
                return field.get('id') === i.toString();
            });

            schema[i.toString()] = {
                name: i.toString(),
                type: 'text',
                label: (foundField ? foundField.get('lbl') : ''),
                icon: false
            };
        }

        return schema;
    };

    /**********************************
     * Mixins
     *********************************/

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
            'jobBoard',
            'nav',
            'speakerInfo',
            'displayData'
        ]
    });

    const EventMixin = EventMixinFactory({});

    const FormHelperMixin = FormHelperMixinFactory({});

    const FinalFormMixin = _.assign({}, FormMixin, FormHelperMixin);

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'CustomForm',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, EventMixin, FinalFormMixin],

        /**
         * Combines the form input instructions
         *
         * @returns {object}
         */
        buildSchema() {
            return _.assign({}, _buildLongSchema(this), _buildShortSchema(this));
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
                event,
                speakerInfo
            } = props;
            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const modifiedEvent = event.get('modifiedEvent');

            const customFields = modifiedEvent.get('Customfields');

            const contentMap = customFields.get('contents').get(selectedSpeaker.get('sid').toString());

            let initialValues = {};

            if (contentMap) {
                contentMap.map((content, field) => {
                    initialValues[field] = content;
                });
            }

            return initialValues;
        },

        /**
         *
         *
         * @returns {object}
         */
        onFormChanged(name, value) {
            const {
                dispatch
            } = this.props;

            // TODO: this would definitely get the model updated, but might be too expensive
            // mergeModifiedEvent(this.state.data);
            dispatch(toggleEventDirty(this.Form_areChangesMade()));
        },

        /**
         *
         * @returns {{Customfields: {contents: {}}}}
         */
        prepareFormData() {
            const {
                speakerInfo
            } = this.props;

            const selectedSpeaker = speakerInfo.get('selectedSpeaker');

            let form = _.clone(this.state.data);

            return prepareCustomFormData({
                form,
                speakerInfo
            });
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            return (
                <form
                    ref='custom-form'
                    onSubmit={this.Form_onSubmit}>
                    <Panel headingText={getText('Short Fields')}
                           headingIconClass='fa-pencil-square'>
                        {this.generateFields({fields: _buildShortSchema(this)})}
                    </Panel>
                    <Panel headingText={getText('Long Fields')}
                           headingIconClass='fa-pencil-square'>
                        {this.generateFields({fields: _buildLongSchema(this)})}
                    </Panel>
                </form>
            );
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { CustomFormFactory }
