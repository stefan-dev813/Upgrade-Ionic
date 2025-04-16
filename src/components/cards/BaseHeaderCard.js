/**
 * Creates an BaseHeaderCard component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const BaseHeaderCardFactory = (spec) => {
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

    const IconMap = require('../../theme/IconMap');

    // Mixins
    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    // Utils
    const {
        log
    } = require('../../util/DevTools').default;

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Methods
     *********************************/

    let _generateLeftAvatar;

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _generateLeftAvatar = (inst) => {
        const {leftAvatar, leftAvatarIcon} = inst.props;

        let avatarElement;

        if (leftAvatar) {
            avatarElement = leftAvatar;
        }

        if (leftAvatarIcon) {
            if (_.isString(leftAvatarIcon)) {
                avatarElement = <Avatar icon={IconMap.getElement(leftAvatarIcon)}/>;
            } else {
                avatarElement = <Avatar icon={leftAvatarIcon}/>;
            }
        }

        if (avatarElement) {
            return <div style={{
                float: 'left',
                padding: '10px'
            }}>{avatarElement}</div>;
        }

        return null;
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            heading: PropTypes.string.isRequired,
            subHeading: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.array
            ]),
            headingStyle: PropTypes.object,
            subHeadingStyle: PropTypes.object,
            leftAvatar: PropTypes.element,
            leftAvatarIcon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element
            ]),
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
        displayName: 'BaseHeaderCard',
        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],
        /**
         * The render() method is required. Generates the virtual DOM/HTML.
         * @returns {*}
         */
        render() {
            const {
                heading,
                headingStyle,
                subHeading,
                subHeadingStyle
            } = this.props;

            let baseHeadingStyle = {
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '52px',
                fontSize: '28px'
            };
            let baseSubHeadingStyle = {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            };
            let baseHeaderCardStyle = {
                width: '100%'
            };

            if (!_.isEmpty(subHeading)) {
                baseHeadingStyle = _.assign({}, baseHeadingStyle, {
                    fontSize: '18px',
                    lineHeight: '32px'
                });

                baseSubHeadingStyle = _.assign({}, baseSubHeadingStyle, {
                    color: 'white',
                    fontSize: '12px',
                    lineHeight: '18px'
                });
            }

            let leftAvatar = _generateLeftAvatar(this);

            if (leftAvatar) {
                baseHeaderCardStyle = _.assign({}, baseHeaderCardStyle, {
                    display: 'flex',
                    padding: '10px'
                });
            }

            return <div className='header-card' style={baseHeaderCardStyle}>
                {leftAvatar}
                <div style={{order: 2}}>
                    <div className='heading' style={_.assign({}, baseHeadingStyle, headingStyle)}>
                        {heading}
                    </div>
                    {_.isArray(subHeading) ?
                        _.map(subHeading, (s, i) => {
                            return <div key={`subheading-${i}`} className={'sub-heading'}
                                        style={_.assign({}, baseSubHeadingStyle, subHeadingStyle)}>
                                {s}
                            </div>;
                        })
                        :
                        <div className={'sub-heading'} style={_.assign({}, baseSubHeadingStyle, subHeadingStyle)}>
                            {subHeading}
                        </div>}
                </div>
            </div>;
        }
    });
}

export { BaseHeaderCardFactory }