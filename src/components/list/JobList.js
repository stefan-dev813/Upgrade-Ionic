import {JobButtonFactory} from "../JobButton";
import {default as FlatButton} from "material-ui/FlatButton";
import React from "react";
import {RaisedButton} from "material-ui";
import {LinkFactory} from "../Link";

/**
 * Generates a JobList component
 *
 * @param spec
 * @returns {*}
 * @constructor
 * @mixes AutoShouldUpdateMixin
 */
const JobListFactory = (spec) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    const React = require('react');
    const createClass = require('create-react-class');
		const PropTypes = require('prop-types');
    const moment = require('moment');
    const _ = require('lodash');

    // Redux
    const {connect} = require('react-redux');

    // Material UI
    const List = require('material-ui/List').List;
    const Divider = require('material-ui/Divider').default;

    // Actions
    const {
        // JobBoardActionsFactory,
        TranslateActionsFactory
    } = require('../../actions');

    // Components
    // const {JobCardFactory} = require('../cards');
    const {SectionHeaderFactory} = require('../SectionHeader');

    // Mixins
    const {AutoShouldUpdateMixinFactory} = require('../../mixins');

    // Utilities
    const {
        log
    } = require('../../util/DevTools').default;
    const {
        getBalboaUrl
    } = require('../../util/Platform').default;
    const DateTools = require('../../util/DateTools').default({});

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    // const {
    //     getMyInfo,
    //     isJobLead,
    //     sortJobs
    // } = JobBoardActionsFactory({});
    const {getText} = TranslateActionsFactory({});

    //---------------------------------
    // Components
    //---------------------------------

    // const JobCard = JobCardFactory({});
    const Link = LinkFactory({});
    const SectionHeader = SectionHeaderFactory({});

    //---------------------------------
    // Mixins
    //---------------------------------

    const AutoShouldUpdateMixin = AutoShouldUpdateMixinFactory({
        propTypes: {
            auth: PropTypes.object.isRequired,
            speakerInfo: PropTypes.object.isRequired
        }
    });

    //=========================================================================
    //
    // Public Interface / React Component
    //
    //=========================================================================

    let component = createClass({
        /**
         * Used in debug messaging
         */
        displayName: 'JobList',

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
            const {auth, speakerInfo} = this.props;
            const balboaUrl = getBalboaUrl();
            // const jobList = jobBoard.jobs;
            // let filteredList = undefined;
            // let sortedList = undefined;
            //
            // if(jobList) {
            //     filteredList = jobList.filter((job) => {
            //         return isJobLead({jobBoard, speakerInfo, job});
            //     });
            // }
            //
            // if(filteredList) {
            //     sortedList = sortJobs(filteredList);
            // }
            return <List>
                <SectionHeader label={getText('Job Board')}/>
                <div style={{
                    backgroundColor: 'whitesmoke',
                    minHeight: '80px',
                    color: '#777',
                    display: 'flex',
                    padding: '10px'
                }}>
                    <div>
                        <h4>The Job Board has Moved</h4>
                        <Divider/>
                        <p style={{marginTop:'1.5rem'}}>
                            We have moved the job board to your dashboard.
                        </p>
                        <p style={{marginTop:'1.5rem'}}>
                            You should login through the website to view jobs.
                        </p>
                        <Link
                          href={`${balboaUrl}/oauth2/authviaestoken?estoken=${auth.get('sessionData').get('token')}&redir=/dashboard/${speakerInfo.get('selectedSpeaker').get('sid')}/lead-board/job-board`}
                        >
                            Go to Job Board
                        </Link>
                    </div>
                </div>
                    {/*{sortedList ? sortedList.map((job, i) => {*/}
                    {/*    return <div key={`job-${i}`}>*/}
                    {/*        <JobCard job={job}/>*/}

                    {/*        <Divider/>*/}
                    {/*    </div>;*/}
                    {/*}) : null}*/}
            </List>
        ;
        }
        });

        return connect(AutoShouldUpdateMixin.mapStateToProps)(component);
        }

        export {
            JobListFactory
        }