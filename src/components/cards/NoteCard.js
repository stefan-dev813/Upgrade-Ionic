/**
 * Creates and NoteCard Component
 *
 * @param {object} spec - Container of named parameters
 * @constructor
 *
 * @return {function} - React Component
 * @mixes AutoShouldUpdateMixin
 * @mixes CardMixin
 */
const NoteCardFactory = (spec) => {

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

    // Redux
    const {connect} = require('react-redux');

    // Components
    const {ListCardFactory} = require('./ListCard');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory,
        CardMixinFactory
    } = require('../../mixins');

    // Utils
    const esUtils = require('ES/utils/esUtils');
    const {
        convertFromBalboaTrunkTimestamp
    } = require('../../util/DateTools').default({});

    // Actions
    const {
        EventActionsFactory,
        NoteActionsFactory,
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
        stopProp
    } = EventActionsFactory({});
    const {
        selectNote
    } = NoteActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Methods
     *********************************/

    let _editHandler;

    /**
     *
     * @param inst
     * @private
     */
    _editHandler = (inst) => {
        const {dispatch, note} = inst.props;

        dispatch(selectNote({
            id: note.get('id')
        }));
    };

    /**********************************
     * Components
     *********************************/

    const ListCard = ListCardFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            note: PropTypes.object.isRequired,
            isSystem: PropTypes.bool.isRequired,
            showDetails: PropTypes.bool
        },
        compareState: true
    });

    const CardMixin = CardMixinFactory({});

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'NoteCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin, CardMixin],
        /**
         * Generates HTML/DOM
         *
         * @return {XML|JSX}
         */
        render() {
            const {
                note,
                isSystem
            } = this.props;

            const showDetails = (this.props.showDetails || this.state.showDetails);

            let stageDate = convertFromBalboaTrunkTimestamp(note.get('datetime'));
            let formattedDate = esUtils.format_date(stageDate, esUtils.format_date.masks.mediumDate);
            let dataId = note.get('id');
            let content = note.get('content');
            let enteredBy = note.get('enteredby');


            const menuItems = this.getMenuItems(['expand', 'edit'], {
                onEdit: () => {
                    _editHandler(this);
                }
            }, this);

            const baseStyle = {
                display: 'block',
                maxWidth: '100%',
                height: '35px',
                margin: '0 auto',
                lineHeight: '1.2em',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                'textOverflow': 'ellipsis'
            };

            const detailsStyle = {
                overflow: 'visible',
                whiteSpace: 'pre-wrap',
                textOverflow: 'inherit',
                height: 'auto'
            };

            let appliedStyle = _.assign({}, baseStyle);

            if (showDetails) {
                appliedStyle = _.assign({
                    paddingTop: '10px'
                }, detailsStyle);
            }

            return <ListCard
                menuItems={menuItems}
                secondaryText={<p style={appliedStyle}>{content}</p>}
                onClick={(e) => {
                    stopProp(e);

                    _editHandler(this);
                }}
            />;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { NoteCardFactory }