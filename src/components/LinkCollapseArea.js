/**
 * Creates a LinkCollapseArea Component for showing and hiding content via a Link
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const LinkCollapseAreaFactory = (spec) => {

    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const _ = require("lodash");
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Components
    const {CSSTransistorFactory} = require('./CSSTransistor');
    const {LinkFactory} = require('./Link');

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
        stopProp
    } = EventActionsFactory({});
    const {
        getText
    } = TranslateActionsFactory({});

    /**********************************
     * Variables
     *********************************/

    let _advancedOptionsShowing = false;

    /**********************************
     * Methods
     *********************************/

    let _advancedClickHandler;

    /**
     * Handles the Advanced Options click/touch event.  Toggles visibility of
     * Advanced options.
     *
     * @private
     */
    _advancedClickHandler = (event, inst) => {
        if (_advancedOptionsShowing) {
            inst.refs.cssTransistor.performLeave();
        }
        else {
            inst.refs.cssTransistor.performEnter();
        }

        _advancedOptionsShowing = !_advancedOptionsShowing;
    };

    /**********************************
     * Components
     *********************************/

    const CSSTransistor = CSSTransistorFactory({});
    const Link = LinkFactory({});

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    return createClass({
        /**
         * Used for debug messaging
         */
        displayName: 'LinkCollapseArea',

        /**
         * Collapses the area, if it is showing.
         */
        hide() {
            if (_advancedOptionsShowing) {
                this.refs.cssTransistor.performLeave();
            }
        },

        /**
         * Expands the area, if it is collapsed.
         */
        show() {
            if (!_advancedOptionsShowing) {
                this.refs.cssTransistor.performEnter();
            }
        },

        /**
         * Generates virtual HTML/DOM
         *
         * @returns {XML|JSX}
         */
        render() {
            const {
                children,
                linkTitle
            } = this.props;

            return (<div className='advanced-link mbsc-padding'>
                <Link
                    onClick={(e) => {
                        stopProp(e);

                        _advancedClickHandler(e, this);
                    }}>
                {(linkTitle ? linkTitle : getText('Advanced Options'))}</Link>

                <CSSTransistor
                        ref='cssTransistor'
                        transitionName='advanced-options'
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                    <div className='advanced-options' style={{
                        overflowY: 'hidden',
                        overflowX: 'hidden'
                    }}>
                        {children}
                    </div>
                </CSSTransistor>
            </div>);
        }
    });
}

export { LinkCollapseAreaFactory }
