/**
 * Generates a LibraryList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LibraryListFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

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
    const {LibraryFileCardFactory} = require('../cards');
    const {ViewHeaderFactory} = require('../ViewHeader');

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
     * Components
     *********************************/

    const LibraryFileCard = LibraryFileCardFactory({});
    const ViewHeader = ViewHeaderFactory({});

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            event: PropTypes.object.isRequired
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
        displayName: 'LibraryList',

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
            const {event} = this.props;
            const modifiedEvent = event.get('modifiedEvent');
            const fileList = modifiedEvent.get('storedfiles');

            return <List>
                <ViewHeader>{getText('Library')}</ViewHeader>

                {fileList ? fileList.map((item, i) => {
                    return <div key={`library-${i}`}>
                        <LibraryFileCard
                            file={item}/>

                        <Divider/>
                    </div>;
                }) : null}
            </List>;
        }
    });

    return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
}

export { LibraryListFactory }