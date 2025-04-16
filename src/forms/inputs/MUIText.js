/**
 * Generates a MUIText component
 *
 * @param {object} spec - Container for named parameters
 * @returns {*} - React Component
 * @constructor
 */
const MUITextFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // Node Modules
    const _ = require('lodash');
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // components
    const TextField = require('material-ui/TextField').default;

    const {MUIIconInputFactory} = require('./MUIIconInput').default;

    const {
        AutoShouldUpdateMixinFactory
    } = require('../../mixins');

    /**************************************************************************
     *
     * Private Members
     *
     *************************************************************************/

    /**********************************
     * Factories
     *********************************/

    const MUIIconInput = MUIIconInputFactory({});

    /**********************************
     * Methods
     *********************************/

    let _onChange;

    /**
     * Handles Text onChange event.  Dispatches the Form's onChange.
     *
     * @param {event} e
     * @private
     */
    _onChange = (val, inst) => {
        const {onChange} = inst.props;

        onChange(val);
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            field: PropTypes.object.isRequired,
            value: PropTypes.string
        },
        compareState: true
    });

    /**************************************************************************
     *
     * React / Public Interface
     *
     *************************************************************************/

    return createClass({

        /**
         * Used in debug messaging
         */
        displayName: 'MUIText',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        /**
         * Invoked once before the component is mounted. The return value
         * will be used as the initial value of this.state.
         *
         * @returns {object}
         */
        getInitialState() {
            return {
                hasFocus: undefined
            };
        },

        /**
         * Invoked when a component is receiving new props. This method
         * is not called for the initial render.
         *
         * @param {object} nextProps
         */
        componentWillReceiveProps(nextProps) {
            const currentField = this.props.field;
            const nextField = nextProps.field;
            let {hasFocus} = this.state;

            hasFocus = undefined;

            if (currentField.autoFocus !== nextField.autoFocus
                || (!currentField.focusStamp && nextField.focusStamp)
                || (currentField.focusStamp && !currentField.focusStamp.isSame(nextField.focusStamp))) {
                hasFocus = nextField.autoFocus;
            }

            this.setState({
                hasFocus
            });
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {field, value} = this.props;
            const {hasFocus} = this.state;

            let p = _.assign({}, {
                type: field.type || 'text',
                onChange: (e, val) => {
                    _onChange(val, this);
                }
            });

            if (field.error) {
                p['errorText'] = field.error;
            }

            p['floatingLabelText'] = field.label;

            let ref = (input) => {
                if(!input)
                    return;

                if (hasFocus === true) {
                    input.focus();
                } else if (hasFocus === false) {
                    input.blur();
                }
            };

            const helperTextStyle = {
                fontSize: 'smaller',
                color: 'grey'
            };

            return (
                <MUIIconInput field={field}>
                    <div>
                        <TextField {...p}
                                   ref={ref}
                                   id={field.name}
                                   name={field.name}
                                   value={value || ''}
                                   fullWidth={field.fullWidth || true}
                                   multiLine={field.type === 'textarea'}
                                   {..._.pick(field, ['disabled', 'placeholder', 'hintText'])}
                                   {...field.overrides}/>
                        {!_.isEmpty(field.helperText) ? <div style={helperTextStyle}>{field.helperText}</div> : null}
                    </div>
                </MUIIconInput>
            );
        }
    });
}

const component = MUITextFactory({});

export default {
    component,
    MUITextFactory
}