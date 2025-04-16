/**
 *
 * @param spec
 * @returns {*}
 * @constructor
 */
const FormLoadingFactory = (spec) => {

    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // React
    const React = require('react');
    const createClass = require('create-react-class');
    const {connect} = require('react-redux');

    // Theme
    const IconMap = require('../theme/IconMap');

    const Platform = require('../util/Platform').default;

    /**************************************************************************
     *
     * Public Interface
     *
     *************************************************************************/

    const component = createClass({

        /**
         * Sets up the components initial state
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                showStatic: true
            };
        },

        /**
         * Invoked once immediately after the initial rendering occurs.
         */
        componentDidMount() {
            const {showStatic} = this.state;

            if (showStatic) {
                setTimeout(() => {
                    this.setState({
                        showStatic: false
                    });
                }, 25);
            }
        },

        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {XML|JSX|Element}
         */
        render() {
            const {showStatic} = this.state;
            const {browser, children} = this.props;

            let width = '100%';

            if (Platform.isTablet(browser)) {
                width = 'calc(100% - 256px)';
            }

            if (showStatic) {
                return IconMap.getElement('more-horiz', {
                    style: {
                        height: '64px',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        margin: 'auto',
                        position: 'absolute',
                        top: '50%',
                        width,
                        textAlign: 'center',
                        marginTop: '-50px'
                    }
                });
            }

            return <div>{children}</div>;
        }
    });

    return connect((state) => {
        return {
            browser: state.browser
        };
    })(component);
}

export { FormLoadingFactory }