/**
 * Creates the LoadingScreen React component
 *
 * @param spec - Collection of all named parameters
 * @constructor
 */
const LoadingScreenFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const createClass = require('create-react-class');

    const CircularProgress = require('material-ui/CircularProgress').default;

    const mainTheme = require('../theme/mainTheme').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'LoadingScreen',
        /**
         * Generates the DOM/HTML
         */
        render() {
            return <div className='loading-screen'>
                <div className='spinner-container'>
                    <CircularProgress
                        left={0}
                        top={0}
                        status='loading'
                        color={mainTheme.primaryColor}/>
                </div>
            </div>;
        }
    });
}

export {
    LoadingScreenFactory
};