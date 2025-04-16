/**
 * Creates a MainTabletLayout component
 *
 * @param {object} spec
 * @constructor
 * @returns {*}
 * @mixes AutoShouldUpdateMixin
 */
const MainTabletLayoutFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     ******************************************************************************/

        // NPM
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Components
    const {
        HeaderFactory,
        FooterNavFactory
    } = require('../components');

    // Theme
    const mainTheme = require('../theme/mainTheme').default;

    // Views
    const {
        SearchViewFactory
    } = require('../views');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    /**********************************
     * Components
     *********************************/

    const Header = HeaderFactory({});
    const FooterNav = FooterNavFactory({});

    const SearchView = SearchViewFactory({
        noHeader: true
    });

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            children: PropTypes.object.isRequired
        }
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messages
         */
        displayName: 'MainMobileLayout',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * Builds the virtual DOM/HTml
         *
         * @returns {*}
         */
        render() {
            const {
                hide_search = false,
                children
            } = this.props;

            return (
                <div style={{
                    height: '100%'
                }}>

                    {/* Header */}

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0
                    }}>
                        <Header includeDrawer={false}/>
                    </div>

                    {/* Content */}

                    <div style={{
                        position: 'absolute',
                        top: '56px',
                        left: 0,
                        right: 0,
                        bottom: '56px'
                    }}>

                        {/* Left Content */}
                        {!hide_search &&
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                            width: '256px',
                            borderRight: `1px solid ${mainTheme.backgroundColor}`,
                            height: '100%'
                        }}>

                            <SearchView isTablet={true}/>

                        </div>
                        }

                        {/* Right Content */}

                        <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: (hide_search ? '0px' : '258px'),
                            right: 0,
                            height: '100%',
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                            marginBottom: '60px'
                        }}>
                            {children}
                        </div>

                    </div>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}>
                        <FooterNav includeSearch={false}/>
                    </div>

                </div>
            );
        }
    });
}

export default MainTabletLayoutFactory;
