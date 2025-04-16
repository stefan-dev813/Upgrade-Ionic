const MUIFilteredSelectFactory = (spec) => {
    /**************************************************************************
     *
     * Imports
     *
     *************************************************************************/

        // NPM
    const _ = require('lodash');

    // React
    const React = require('react');
    const createClass = require('create-react-class');
    const PropTypes = require('prop-types');

    // Material UI
    const TextField = require('material-ui/TextField').default;
    const Dialog = require('material-ui/Dialog').default;
    const FlatButton = require('material-ui/FlatButton').default;
    const {List, ListItem} = require('material-ui/List');
    const Divider = require('material-ui/Divider').default;

    const {MUIIconInputFactory} = require('./MUIIconInput').default;

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Actions
    const {
        EventActionsFactory
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

    /**********************************
     * Components
     *********************************/

    const MUIIconInput = MUIIconInputFactory({});

    /**********************************
     * Methods
     *********************************/

    let _buildFilteredOptions;
    let _closeHandler;
    let _filterChangeHandler;
    let _getValueFromOptions;
    let _selectHandler;
    let _showDialog;

    /**
     *
     * @param inst
     * @returns {Array}
     * @private
     */
    _buildFilteredOptions = (inst) => {
        const {dialogShown, filterTerm, storedOptions} = inst.state;
        let count = 0;
        let found = false;

        if (!dialogShown)
            return [];

        return _.filter(storedOptions, (opts) => {
            found = false;

            // Only return the first 20 results
            if (count >= 20)
                return found;

            found = ((!filterTerm || !filterTerm.length)
            || opts.text.toString().indexOf(filterTerm) !== -1
            || opts.value.toString().indexOf(filterTerm) !== -1);

            if (found) {
                count += 1;
            }

            return found;
        });
    };

    /**
     *
     * @param inst
     * @private
     */
    _closeHandler = (inst) => {
        inst.setState({
            dialogShown: false
        });
    };

    /**
     *
     * @param val
     * @param inst
     * @private
     */
    _filterChangeHandler = (val, inst) => {
        inst.setState({
            filterTerm: val
        });
    };

    /**
     *
     * @param inst
     * @returns {*}
     * @private
     */
    _getValueFromOptions = (inst) => {
        const {value} = inst.props;
        const {storedOptions} = inst.state;
        let retVal = '';

        _.map(storedOptions, (opt) => {

            if (opt.value.toString() === value.toString()) {
                retVal = opt.text;
            }

            return opt;
        });

        return retVal;
    };

    /**
     *
     * @param opt
     * @param inst
     * @private
     */
    _selectHandler = (opt, inst) => {
        const {onChange} = inst.props;

        onChange(opt.value);

        inst.setState({
            dialogShown: false
        });
    };

    /**
     *
     * @param inst
     * @private
     */
    _showDialog = (inst) => {
        inst.setState({
            dialogShown: true
        });
    };

    /**********************************
     * Mixins
     *********************************/

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            field: PropTypes.shape({
                options: PropTypes.array,
                label: PropTypes.string,
                optionMap: PropTypes.object.isRequired,
                optionBuilder: PropTypes.func
            }).isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            onChange: PropTypes.func.isRequired
        },
        compareState: true
    });

    /**************************************************************************
     *
     * Public Interface / React Component
     *
     *************************************************************************/

    return createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'MUIFilteredSelect',

        /**
         * Allows you to use mixins to share behavior among multiple components.
         */
        mixins: [AutoShouldUpdateMixin],

        getInitialState() {
            return {
                dialogShown: false,
                filterTerm: '',
                storedOptions: []
            };
        },

        componentDidUpdate() {
            const {field} = this.props;

            let {options, optionBuilder} = field;
            const {dialogShown, storedOptions} = this.state;

            if (!dialogShown)
                return;

            if (!storedOptions || !storedOptions.length) {
                this.setState({
                    storedOptions: options || optionBuilder() || []
                });
            }
        },

        /**
         * Generates the virtual DOM/HTML
         *
         * @returns {*}
         */
        render() {
            const {field, value} = this.props;
            const {dialogShown} = this.state;
            const {optionMap} = field;

            const filteredOptions = _buildFilteredOptions(this);

            return (
                <div>
                    <MUIIconInput field={field}>
                        <TextField
                            id={`${field.name}-filter-display`}
                            name={`${field.name}-filter-display`}
                            ref={`${field.name}-filter-display`}
                            value={optionMap.get(_.toString(value)) || ''}
                            floatingLabelText={field.label}
                            fullWidth={true}
                            onFocus={() => {
                                if (!dialogShown)
                                    _showDialog(this);
                            }}
                            {..._.pick(field, ['disabled'])}/>
                    </MUIIconInput>

                    <Dialog
                        title={[<TextField
                            key={`${field.name}-filter-input`}
                            id={`${field.name}-filter-input`}
                            ref={`${field.name}-filter-input`}
                            name={`${field.name}-filter-input`}
                            floatingLabelText={field.label}
                            fullWidth={true}
                            floatingLabelFixed={true}
                            multiLine={false}
                            style={{
                                paddingLeft: '15px',
                                width: '85%'
                            }}
                            autoFocus={dialogShown}
                            hintText={_getValueFromOptions(this)}
                            onChange={(e, val) => {
                                _filterChangeHandler(val, this);
                            }}/>]}
                        onRequestClose={() => {
                            _closeHandler(this);
                        }}
                        autoScrollBodyContent={true}
                        open={dialogShown}
                        contentStyle={{
                            width: '85%'
                        }}>

                        <List>
                            {_.map(filteredOptions, (opt, i) => {
                                return (
                                    <div key={`${field.name}-filtered-option-${i}`}>
                                        <ListItem
                                            primaryText={opt.text}
                                            onClick={(e) => {
                                                stopProp(e);

                                                _selectHandler(opt, this);
                                            }}/>
                                    </div>
                                );
                            })}

                            {!filteredOptions.length ? <ListItem
                                primaryText="No Matching Bureaus"
                                style={{
                                    color: 'rgb(0, 0, 0, 0.75)'
                                }}
                            /> : null}
                        </List>

                    </Dialog>
                </div>
            );
        }
    });
}

const component = MUIFilteredSelectFactory({});

export default {
    component,
    MUIFilteredSelectFactory
 }