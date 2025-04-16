/**
 * Provides methods to help build out React Forms
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixin
 */
const FormHelperMixinFactory = (spec) => {
    /******************************************************************************
     *
     * Imports
     *
     *****************************************************************************/

    // Node Modules
    const React = require('react');
    const _ = require('lodash');
    const is = require('is');
    const moment = require('moment');

    // Factories
    const MUIFieldsFactory = require('../forms/layouts/MUIFields').default;

    // Mixins
    const DateToolsFactory = require('../util/DateTools').default;
    const v = _.assign(require('react-loose-forms.validation'), require('../mixins/ValidationMixin').default);

    const InputTypes = require("react-loose-forms/InputTypes");

    // Utilities
    const {
        log
    } = require('../util/DevTools').default;

    // Actions
    const {
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
        getText
    } = TranslateActionsFactory({});

    const DateTools = DateToolsFactory({});

    /**********************************
     * Variables
     *********************************/

    let _prevDateDiff = 0;

    /**********************************
     * Methods
     *********************************/

    let _startDateRequired;
    let _startTimeRequired;
    let _stopDateRequired;
    let _stopTimeRequired;
    let _stopDateEnabled;
    let _stopTimeEnabled;
    let _stopTimeValidator;

    /**
     * Determines if StartDate should be a required field
     *
     * @param {object} data - State.data
     * @returns {boolean}
     * @private
     */
    _startDateRequired = (data) => {
        const {
            startTime,
            stopDate,
            stopTime
        } = data;

        if (_.isDate(startTime)) {
            return true;
        }

        if (_.isDate(stopDate)) {
            return true;
        }

        if (_.isDate(stopTime)) {
            return true;
        }

        return false;
    };

    /**
     * Determines if StartTime should be a required field
     *
     * @param data
     * @returns {boolean}
     * @private
     */
    _startTimeRequired = (data) => {
        const {
            stopTime
        } = data;

        if (_.isDate(stopTime)) {
            return true;
        }

        return false;
    };

    /**
     *
     * @param data
     * @returns {boolean}
     * @private
     */
    _stopDateEnabled = (data) => {
        const {
            startDate
        } = data;

        if (_.isDate(startDate)) {
            return true;
        }

        return false;
    };

    /**
     * Determines if StopDate should be a required field.
     *
     * @param data
     * @returns {*}
     * @private
     */
    _stopDateRequired = (data) => {
        return _startTimeRequired(data);
    };

    /**
     *
     * @param data
     * @returns {boolean}
     * @private
     */
    _stopTimeEnabled = (data) => {
        const {
            startTime
        } = data;

        if (_.isDate(startTime)) {
            return true;
        }

        return false;
    };

    /**
     *
     * @param value
     * @param data
     * @returns {boolean|String}
     * @private
     */
    _stopTimeValidator = (value, data) => {
        const {
            startDate,
            startTime,
            stopDate
        } = data;

        let stopMoment;
        let startMoment;
        let startDateTime;
        let stopDateTime;
        let validationResults = v.date(value);

        if (validationResults !== true) {
            return validationResults;
        }

        startDateTime = DateTools.mergeDate(startDate, startTime);
        stopDateTime = DateTools.mergeDate(stopDate, value);

        startMoment = moment(startDateTime);
        stopMoment = moment(stopDateTime);

        if (stopMoment.isSameOrBefore(startMoment)) {
            return getText('End Time must be after Start Time');
        }

        return true;
    };


    /**********************************
     * Factories
     *********************************/

    const MUIFields = MUIFieldsFactory({});

    /**************************************************************************
     *
     * Public Members
     *
     *************************************************************************/

    return _.assign(DateTools, {
        /**
         * Returns some commonly used Form props
         *
         * @return {object}
         */
        getDefaultFormProps() {
            return {
                errors: this.state.errors,
                buildInput: this.Form_buildInput
            };
        },
        /**
         * Builds the Form layout based on a provided form schema.
         *
         * @param {object} spec - Collection of named parameters
         * @property {object} spec
         * @property {object} spec.fields - JSON schema for the Form to be built against
         */
        generateFields(spec) {
            return <MUIFields {..._.assign({}, this.getDefaultFormProps(), spec)} />;
        },
        /**
         * Create a common schema for Start and End Dates and Times
         * @returns {object}
         */
        buildStartStopDateTimeSchema(data) {
            return {
                startDate: {
                    name: 'startDate',
                    type: 'date',
                    iconClass: 'date-range',
                    label: getText('Start Date'),
                    minDate: this.getSystemMinDate(),
                    maxDate: this.getMaxStartDate(data),
                    validate: v.validateIf(_startDateRequired(data), v.date)
                },
                startTime: {
                    name: 'startTime',
                    type: 'time',
                    iconClass: '',
                    label: getText('Start Time'),
                    validate: v.validateIf(_startTimeRequired(data), v.date)
                },
                stopDate: {
                    name: 'stopDate',
                    type: 'date',
                    iconClass: 'date-range',
                    label: getText('End Date'),
                    disabled: !_stopDateEnabled(data),
                    minDate: this.getMinStopDate(data),
                    maxDate: this.getSystemMaxDate(),
                    validate: v.validateIf(_stopDateRequired(data), v.date)
                },
                stopTime: {
                    name: 'stopTime',
                    type: 'time',
                    iconClass: '',
                    label: getText('End Time'),
                    disabled: !_stopTimeEnabled(data),
                    validate: v.emptyOr((value) => {
                        return _stopTimeValidator(value, data);
                    })
                }
            };
        },
        /**
         *
         * @param inst
         * @returns {Array}
         * @private
         */
        generateGroupCodeOptions(codesField) {
            const {
                speakerInfo
            } = this.props;

            if (!speakerInfo) {
                return [];
            }

            const selectedSpeaker = speakerInfo.get('selectedSpeaker');
            const codeList = selectedSpeaker.get(codesField);

            let options = [];

            if (codeList) {
                codeList.map((code) => {
                    if (typeof code === 'string') {
                        options.push({
                            text: code,
                            value: code
                        });
                    }
                    else {
                        options.push({
                            text: code.get('groupcode'),
                            value: code.get('groupcode')
                        });
                    }
                });
            }

            return options;
        },
        /**
         * @param {string} id
         * @return {string}
         */
        determineMode(id) {
            let mode = getText('Add');

            if (id !== "0") {
                mode = getText('Edit');
            }

            return mode;
        },
        /**
         *
         * @param {string} name
         * @param {*} value
         * @returns {object}
         */
        onFormChangedStartStopDateTime(name, value) {
            const data = _.assign({}, this.state.data);

            let stopDateTime = null;
            let startDateTime = null;
            let newStopDate = null;
            let dateDiff = 0;
            let newData = null;

            if (name === 'stopDate' || name === 'stopTime' && _.isDate(value)) {
                if (name === 'stopDate') {
                    stopDateTime = this.toMoment(value, data.stopTime);
                }
                else if (name === 'stopTime') {
                    stopDateTime = this.toMoment(data.stopDate, value);
                }

                if (stopDateTime) {
                    startDateTime = this.toMoment(data.startDate, data.startTime);

                    if (startDateTime) {
                        _prevDateDiff = startDateTime.diff(stopDateTime, 'seconds');
                    }
                }
                else {
                    _prevDateDiff = 0;
                }
            }

            if (name === 'startDate' || name === 'startTime' && _.isDate(value)) {
                if (name === 'startDate') {
                    startDateTime = this.toMoment(value, data.startTime);
                }
                else if (name === 'startTime') {
                    startDateTime = this.toMoment(data.startDate, value);
                }

                if (startDateTime) {
                    if (!_.isDate(data.stopDate) || !_.isDate(data.stopTime)) {
                        newStopDate = startDateTime.add(1, 'hours');

                        startDateTime = this.toMoment(data.startDate, data.startTime);

                        if (startDateTime) {
                            _prevDateDiff = startDateTime.diff(newStopDate, 'seconds');
                        }
                    }
                    else if (_.isDate(data.stopDate) && _prevDateDiff !== 0) {
                        stopDateTime = this.toMoment(data.stopDate, data.stopTime);

                        dateDiff = startDateTime.diff(stopDateTime, 'seconds');

                        if (dateDiff < _prevDateDiff) {
                            newStopDate = stopDateTime.subtract(Math.abs(_prevDateDiff - dateDiff), 'seconds');
                        }
                        else if (dateDiff > _prevDateDiff) {
                            newStopDate = stopDateTime.add(Math.abs(dateDiff - _prevDateDiff), 'seconds');
                        }
                    }
                }
            }

            if (newStopDate) {
                newData = data;
                newData.stopDate = moment(newStopDate.format(DateTools.masks.DATE_STRING), DateTools.masks.DATE_STRING).toDate();

                if (((!_.isDate(data.stopTime)) && (_.isDate(data.startTime))) ||
                    (_.isDate(data.stopTime) &&
                        newStopDate.hours() !== 0)) {
                    newData.stopTime = newStopDate.toDate();
                }
            }

            return newData;
        },
        Form_buildInput(field) {
            let input = InputTypes.getInputByType(field.type);

            return <input.component
            field = {
                field
            }
            value = {
                this.state.data[field.name]
            }
            onChange = {
                (value) => {
                    this.Form_onChange(field.name, value);
                }
            }
            />;
        },
        // /**
        //  *
        //  * @param {object|Event} e
        //  * @constructor
        //  */
        // Form_onSubmit(e){
        //     let data = {};
        //
        //     _.map(e.currentTarget.elements, (el) => {
        //         if (!is.empty(el.name))
        //             data[el.name] = el.value;
        //     });
        //
        //     // need to set the data first so Form_validate has access to it.
        //     this.setState({
        //         data: data
        //     }, () => {
        //         this.setState({
        //             submit_attempts: this.state.submit_attempts + 1,
        //             errors: this.Form_validate()
        //         }, () => {
        //             if (is.empty(this.state.errors)) {
        //                 this.____onSubmit(this.state.data);
        //             } else {
        //                 this.____onSubmitFail(this.state.errors);
        //             }
        //         });
        //     });
        // },
        // Form_onChange(field_name, new_value) {
        //     toggleViewDirty(true);
        //
        //     this.____onFormChanged(field_name, new_value);
        // }
    });
}

export default FormHelperMixinFactory;