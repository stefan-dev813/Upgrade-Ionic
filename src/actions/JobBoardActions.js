/**
 * Generates the Job Board actions
 *
 * @param spec
 * @returns {object}
 * @constructor
 */
const JobBoardActionsFactory = (spec = {}) => {
    //=========================================================================
    //
    // Imports
    //
    //=========================================================================

    // NPM
    const moment = require('moment');
    const _ = require('lodash');
    const {Map, List} = require('immutable');

    // Enums
    const OFFER_STATUS = require('../enums/OFFER_STATUS').default;
    const RADIOS = require('../enums/RADIOS').default;
    const VIEWS = require('../enums/VIEWS').default;

    // Radios
    const {radio} = require('react-pubsub-via-radio.js');

    const OfferStatusModel = require('../stores/models/OfferStatusModel').default;

    // Actions
    const {
        SpeakerInfoActionsFactory,
        TranslateActionsFactory
    } = require('../actions');

    // Utils
    const DateTools = require('../util/DateTools').default();
    const esUtils = require('ES/utils/esUtils');

    //=========================================================================
    //
    // Private Members
    //
    //=========================================================================

    //---------------------------------
    // Actions
    //---------------------------------

    const {getSpeakersFromDisplayLists} = SpeakerInfoActionsFactory({});
    const {getText} = TranslateActionsFactory();

    //---------------------------------
    // Variables
    //---------------------------------

    let OFFER_STATUS_LIST= List();
    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel());

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.UNREAD_MESSAGE,
        display: getText('unread message')
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.WAITING_CLIENT,
        display: getText('Waiting on Client'),
        status: getText('Offer Pending'),
        areaTitle: getText('You are waiting for the client to accept your offer or propose a different one.'),
        nowItems: List().push(getText('offer pending')).push(getText('waiting for client')),
        nextItems: List().push(getText('client accepts offer'))
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.WAITING_YOU,
        display: getText('Waiting on You'),
        status: getText('Offer Pending'),
        areaTitle: getText('The client is waiting for you to accept their offer or revise it.'),
        nowItems: List().push(getText('offer pending')).push(getText('waiting for you')),
        nextItems: List().push(getText('you accept offer')),
        nowType: OFFER_STATUS.WARNING
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.OFFER_ACCEPTED,
        display: getText('Hired!'),
        status: getText('Accepted'),
        areaTitle: getText('Waiting for the client to pay the deposit.'),
        nowItems: List().push(getText('offer accepted')),
        nextItems: List().push(getText('client pays deposit')),
        nowType: OFFER_STATUS.SUCCESS
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.DEPOSIT_PAID,
        display: getText('deposit paid'),
        status: getText('Accepted'),
        areaTitle: getText('On the day of the event, eSpeakers will collect the balance due.'),
        nowItems: List().push(getText('deposit paid')),
        nextItems: List().push(getText('event happens')),
        nowType: OFFER_STATUS.SUCCESS
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.PAID_IN_FULL,
        display: getText('paid in full'),
        status: getText('Accepted'),
        areaTitle: getText('The event is paid in full.'),
        nowItems: List().push(getText('balance paid')),
        nextItems: List().push(getText('event happens')),
        nowType: OFFER_STATUS.SUCCESS
    }));

    OFFER_STATUS_LIST = OFFER_STATUS_LIST.push(OfferStatusModel({
        key: OFFER_STATUS.EVENT_COMPLETED,
        display: getText('reviewed'),
        status: getText('All Done'),
        areaTitle: getText('The event is completed. Great job!'),
        nowItems: List().push(getText('review complete')),
        nowType: OFFER_STATUS.SUCCESS
    }));

    //---------------------------------
    // Methods
    //---------------------------------

    let getBudget = undefined;
    let getBuyerName = undefined;
    let getCompanyName = undefined;
    let getEventDate = undefined;
    let getCommission = undefined;
    let getLedgerData = undefined;
    let getMessageSpeakerName = undefined;
    let getMyInfo = undefined;
    let getNotes = undefined;
    let getOfferEventStatus = undefined;
    let getOfferStatus = undefined;
    let getOfferStatusDisplay = undefined;
    let getOfferStatusIndexByJob = undefined;
    let getOfferStatusIndexByStatus = undefined;
    let getPayments = undefined;
    let getShortListDescription = undefined;
    let getTopics = undefined;
    let getTotalUnread = undefined;
    let isJobLead = undefined;
    let isJobOffer = undefined;
    let loadJobAgreement = undefined;
    let loadJobBoard = undefined;
    let loadJobEvent = undefined;
    let loadJobMessages = undefined;
    let markMessagesRead = undefined;
    let selectJob = undefined;
    let sendJobMessage = undefined;
    let sendJobApplication = undefined;
    let sortJobs = undefined;
    let updateJobBoardStore = undefined;
    let updateJobAgreement = undefined;
    let updateJobDetail = undefined;
    let updateJobMessages = undefined;

    getBudget = (job) => {
        let jobObj = job;

        if(job.get('jobSummary')) {
            jobObj = job.get('jobSummary');
        }

        let price_range = [jobObj.get('budget_min'), jobObj.get('budget_max')];

        let prices = !_.isArray(price_range) ? [] : _.uniq(_.sortBy(_.filter(_.map(price_range, (price) => {
            return price === Infinity || price === -Infinity ? price : _.parseInt(price);
        }), (price) => {
            return price >= -1;
        })), true);

        if (prices.length === 1 && prices[0] === -1) {
            return '(to be determined)';
        }
        if (prices.length === 1 && prices[0] === 0) {
            return '(free)';
        }
        if (prices.length === 2 && prices[1] === Infinity) {
            return `More than ${esUtils.format_currency(prices[0], 0)}`;
        }
        return _.map(prices, (price) => {
            return esUtils.format_currency(price, 0);
        }).join(' - ');
    };

    getBuyerName = (jobEvent) => {
        let event = jobEvent.toJS();

        let buyer_names = _.map(event && event.Buyers, (Buyer) => {
            return Buyer.firstname;
        });
        if(_.isEmpty(buyer_names)){
            buyer_names = [getText('The client')];
        }
        return buyer_names.join(', ');
    };

    getCompanyName = (event) => {
        let eventObj = event.toJS();
        let company = null;

        let buyer_names = _.map(_.get(eventObj, "Buyers", {}), (Buyer) => {
            company = _.get(Buyer, "company");
            return [Buyer.firstname, Buyer.lastname].join(" ");
        });
        if (_.isEmpty(buyer_names)) {
            buyer_names = ['The client'];
        }

        let r = buyer_names.join(', ');

        if (!_.isEmpty(company)) {
            r += `, ${company}`;
        }
        return r;
    };

    /**
     *
     * @param pJob
     * @param displayData
     * @returns {obj}
     */
    getCommission = (spec = {}) => {
        let {
            jobDetail,
            displayData,
            event,
            Displaylists
        } = spec;
        let displayLists;

        if(!jobDetail && !event)
            return;

        if (jobDetail && displayData) {
            let job = jobDetail.toJS();
            event = job.event;
            displayLists = displayData.displayLists.toJS();
        } else if(event && Displaylists) {
            displayLists = Displaylists;
        }

        let retVal = {
            value: 0,
            display: '0%',
            message: ''
        };

        if(!event.is_mp_event || _.includes(event.flags_as_array, "bookmenow")){
            return retVal;
        }

        let whitelabel = _.get(displayLists, ["universal", "whitelabels", event.bureauID]);
        let whitelabel_name = whitelabel ? whitelabel.bname : getText("eSpeakers Marketplace");
        let espeakers_commission = whitelabel ? whitelabel.mp_espeakers_commission : 10;
        let thebureau_commission = whitelabel ? whitelabel.mp_bureau_commission : 0;

        retVal.value = Math.max(0, espeakers_commission + thebureau_commission);
        retVal.display = `${retVal.value * 100}%`;

        if (_.includes(event.flags_as_array, "bookmenow")) {
            retVal.message = getText("This lead came through your Book-Me-Now link, with no finder's fee.");
        } else if (retVal.value <= 0) {
            return retVal;
        } else {
            retVal.message = getText("The %1$s %2$s finder's fee will be deducted from the buyer's deposit payment.", {
                params: [
                    retVal.display,
                    whitelabel_name
                ]
            });
        }

        return retVal;
    };

    getEventDate = (jobEvent) => {
        let date = DateTools.convertFromBalboaTrunkTimestamp(jobEvent.get('starttime'));

        let formattedDate = undefined;

        if (date) {
            formattedDate = esUtils.format_date(date, esUtils.format_date.masks.mediumDate);
        }

        return formattedDate;
    };

    getLedgerData = (spec = {}) => {
        let {
            event,
            Displaylists,
            mp_agreement,
            fee_main,
            fee_travel,
            fee_materials
        } = spec;

        const close_date = "payout on event date";
        const acceptance_date = "payout on acceptance";

        let commission = getCommission({Displaylists, event});

        let commission_desc = commission.display;
        let bname = _.get(Displaylists, ["universal", "whitelabels", event.bureauID, "bname"]);
        if (bname) {
            commission_desc += ` ${bname}`;
        }
        commission_desc += " finder's fee";

        if (mp_agreement) {
            fee_main = 0;
            fee_travel = 0;
            fee_materials = 0;
            _.each(mp_agreement.fees, (f) => {
                if (f.flags_as_map.speaking_fee.is_set) {
                    fee_main += f.fee;
                } else if (f.flags_as_map.travel.is_set) {
                    fee_travel += f.fee;
                } else {
                    fee_materials += f.fee;
                }
            });
        }

        let fees = [
            {
                due: acceptance_date,
                fee: fee_main * .5,
                description: "client pays deposit"
            },
            {
                due: acceptance_date,
                fee: -fee_main * commission.value,
                description: commission_desc
            },
            {
                due: close_date,
                fee: fee_main * .5,
                description: "client pays balance"
            }
        ];
        if (fee_travel > 0) {
            fees.push({
                due: close_date,
                fee: fee_travel,
                description: "client pays travel"
            });
        }
        if (fee_materials > 0) {
            fees.push({
                due: close_date,
                fee: fee_materials,
                description: "client pays materials"
            });
        }

        let grand_total = _.reduce(fees, (sum, f) => {
            return sum + f.fee;
        }, 0);

        return {
            fees,
            grand_total,
            fee_speaking: fee_main, //amount the buyer pays for speaking only (not travel or material)
            fee_materials,
            fee_travel
        };
    };

    getMessageSpeakerName = (displayData, sid) => {
        const Displaylists = displayData.displayLists.toJS();
        let spkr = _.head(getSpeakersFromDisplayLists(Displaylists, sid));
        return (spkr && spkr.name_full) || (`speaker #${sid}`);
    };

    /**
     *
     * @param spec
     */
    getMyInfo = (spec = {}) => {
        const {
            jobBoard,
            speakerInfo,
            job,
            eid
        } = spec;

        let jobSummary = job;

        if(job && job.get('jobSummary')) {
            jobSummary = job.get('jobSummary');
        }

        let event_id;

        if(_.has(spec, 'eid')) {
            event_id = eid;
        } else if(_.has(jobSummary, 'event_id')) {
            event_id = jobSummary.event_id;
        } else {
            event_id = jobSummary.get('event_id');
        }

        return _.get(jobBoard.toJS(), ["per_sid", speakerInfo.selectedSpeaker.get('sid'), event_id], {});
    };

    getNotes = (pJob) => {
        let job = pJob.toJS();
        let event = job.event;
        let notes = _.get(event, "Note", "");

        let details_note = _.first(_.filter(notes, (note) => {
            return /== Event Details ==/.test(note.content);
        }));

        let detailsInNotes = details_note ? details_note.content : '';

        if (!_.isString(detailsInNotes) || detailsInNotes.trim().length === 0) {
            return [];
        }

        let result = [];

        _.each(detailsInNotes.split("\n"), (line) => {
            if (/== Event Details ==/.test(line)) {
                return;
            }
            let line_parts = line.split(': ');
            if (line_parts.length === 2) {
                result.push({label: line_parts[0], value: line_parts[1]});
            } else if (result.length > 0) {
                result[result.length - 1].value += `\n${line_parts.join(' ')}`;
            } else {
                result.push({value: line_parts.join(': ')});
            }
        });

        return result;
    };

    /**
     * Returns the Offer status of a Job record
     *
     * @param {Object} myInfo
     * @returns {Object}
     */
    getOfferStatus = (myInfo) => {
        let n_unread = _.get(myInfo, "n_unread", 0);
        let status = 0;

        if (n_unread > 0) status = 1; //"unread message";

        if (_.get(myInfo, "mp_agreement", null)) {
            let signed_b = _.get(myInfo, "mp_agreement.buyer_signed", false);
            let signed_s = _.get(myInfo, "mp_agreement.speaker_signed", false);
            let is_accepted = _.get(myInfo, "mp_agreement.is_accepted", false);

            if (is_accepted) {
                status = _.max([status, 4]); //"offer accepted";
                if (_.get(myInfo, "mp_agreement.is_deposit_paid", false)) status = _.max([status, 5]);
                if (_.get(myInfo, "mp_agreement.is_balance_paid", false)) status = _.max([status, 6]);
            } else if (signed_b && !signed_s) {
                status = _.max([status, 3]); //"waiting you"
            } else if (!signed_b && signed_s) {
                status = _.max([status, 2]); //"waiting client"
            }
        }

        return {index: status, status: OFFER_STATUS_LIST.get(status)};
    };

    getOfferStatusDisplay = (myInfo) => {
        const status = getOfferStatus(myInfo).status;

        if(status) {
            return status.get('display');
        }
    };

    getOfferStatusIndexByJob = (myInfo) => {
        return getOfferStatus(myInfo).index;
    };

    getOfferStatusIndexByStatus = (status) => {
        let statusIndex = 0;

        OFFER_STATUS_LIST.map((offerStatus, index) => {
            if(offerStatus.key === status)
                statusIndex = index;
        });

        return statusIndex;
    };

    /**
     *
     * @param event
     * @param sid
     * @returns {Record|Map|OfferStatusModel}
     */
    getOfferEventStatus = (event, sid) => {
        const eventObj = event.toJS();
        let status = 0;
        let statusIndex = 0;

        if(!_.isEmpty(eventObj.MPJobStatus)) {
            statusIndex = getOfferStatusIndexByStatus(eventObj.MPJobStatus);
            return OFFER_STATUS_LIST.get(statusIndex);
        }

        if (_.get(eventObj, ["MPAgreement", sid], false)) {
            // eslint-disable-next-line no-bitwise
            if ((_.get(eventObj, ["MPAgreement", sid, "flags"], 0) & 1) > 0) { //flag "1" means "speaker initiated offer";
                status = 2;
            } else {
                status = 3;
            }
            if (_.get(eventObj, ["MPAgreement", sid, "is_accepted"], false)) {
                status = 4;

                if (_.get(eventObj, ["MPPaymentStatus", sid, "deposit"], false)) status = _.max([5, status]);
                if (_.get(eventObj, ["MPPaymentStatus", sid, "balance"], false)) status = _.max([6, status]);
            }

            if (status >= 5) {
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (_.get(eventObj, "startdate", 0) >= tomorrow) status = 7; //completed
            }
        }

        return OFFER_STATUS_LIST.get(status);
    };

    getPayments = (jobDetail) => {
        let event = jobDetail.get('event').toJS();
        let payments = {};
        _.each(_.get(event, "MPPaymentsUnmapped", {}), (payment) => {
            payments[payment.id] = payment;
        });

        return payments;
    };

    getShortListDescription = (pJob, displayData) => {
        let job = pJob.toJS();
        let event = job.event;
        let displayLists = displayData.displayLists.toJS();

        let shortlist_sids = _.uniq(_.get(event, 'MPshortlist.speaker_ids', []));//uniq doubles as a cast to Array
        let my_auted_speakers_on_this_shortlist = _.filter(displayLists.perspeaker, (speaker) => {
            return _.includes(shortlist_sids, _.parseInt(speaker.sid));
        });

        let flag_mp_job_board = _.includes(event.flags_as_array, 'mp_job_board');
        let flag_bookmenow = _.includes(event.flags_as_array, 'bookmenow');//what to do with this
        let n_on_shortlist = _.get(event, 'MPshortlist.speaker_ids', []).length;
        let n_other_speakers = n_on_shortlist - my_auted_speakers_on_this_shortlist.length;

        let message = '';

        if (flag_bookmenow) {
            return getText('This job came through the Book Me Now link on your own website and is exclusively for you.');
        }

        if (my_auted_speakers_on_this_shortlist.length === 0) {//not on this shortlist
            if (flag_mp_job_board) {
                message += getText('This is an open call for speakers. ');
            }
            if (n_on_shortlist > 0) {
                message += n_on_shortlist + getText(' speakers currently under consideration for this job. ');
            }
        } else {//on this shortlist
            message += _.map(my_auted_speakers_on_this_shortlist, (speaker) => {
                return speaker.name_full;
            }).join(', ');
            message += getText(' is on the shortlist for this event');
            if (n_other_speakers > 0) {
                message += getText(' along with %1$s other %2$s', {
                    params: [
                        n_other_speakers,
                        (n_other_speakers > 1 ? 's' : '')
                    ]
                });
            }
            message += '. ';
            if (flag_mp_job_board) {
                message += getText('This is also an open call for speakers. ');
            }
        }
        return message;
    };

    getTopics = (pJob) => {
        let job = pJob;

        if(pJob.get('jobSummary')) {
            job = pJob.get('jobSummary');
        }

        const topics = job.get('topics');
        let topicList = [];

        if(_.isString(topics)) {
            topicList = topics.split('/');
        } else if (!_.isNull(topics)) {
            topicList = _.uniq(_.flattenDeep(_.map(topics.toJS(), (topic) => {
                return topic.split('/');
            })));
        }

        return topicList;
    };

    getTotalUnread = (jobBoard, sid) => {
        const perSid = jobBoard.per_sid.get(sid.toString());
        let totalUnread = 0;

        if(!perSid) {
            return totalUnread;
        }

        perSid.map((event) => {
            totalUnread += event.get('n_unread');
        });

        return totalUnread;
    };

    isJobLead = (params = {}) => {
        let my_info = getMyInfo(params);

        let is_on_shortlist = !!_.get(my_info, "is_on_shortlist", false);

        if (_.get(my_info, "is_banned_from_shortlist", false) || _.get(my_info, "is_removed_from_shortlist", false)) {
            return false;
        }

        return !is_on_shortlist;
    };

    isJobOffer = (params = {}) => {
        let my_info = getMyInfo(params);

        if(!my_info) {
            return false;
        }

        let is_on_shortlist = !!_.get(my_info, "is_on_shortlist", false);
        let is_accepted = !!_.get(my_info, "mp_agreement.is_accepted", false);

        if (_.get(my_info, "is_banned_from_shortlist", false) || _.get(my_info, "is_removed_from_shortlist", false)) {
            return false;
        }

        return is_on_shortlist && !is_accepted;
    };

    /**
     *
     * @param data
     */
    loadJobAgreement = (data) => {
        radio(RADIOS.services.LOAD_JOB_AGREEMENT).broadcast(data);
    };

    /**
     * Handles the loadJobBoard action
     *
     * @param data
     * @private
     */
    loadJobBoard = (data) => {
        radio(RADIOS.services.LOAD_JOB_BOARD).broadcast(data);
    };

    loadJobEvent = (data) => {
        radio(RADIOS.services.LOAD_JOB_EVENT).broadcast(data);
    };

    loadJobMessages = (data) => {
        radio(RADIOS.services.LOAD_JOB_MESSAGES).broadcast(data);
    };

    markMessagesRead = (data) => {
        radio(RADIOS.services.READ_JOB_MESSAGES).broadcast(data);
    };

    /**
     *
     * @param job
     * @param pView
     * @returns {array}
     */
    selectJob = (job, pView) => {
        let radios = [];

        radios.push({
            type: RADIOS.stores.JOB_BOARD_SELECT_JOB,
            payload: job
        });

        if(_.isArray(pView)) {
            radios.push({
                type: RADIOS.stores.NAV_SET_SUB_VIEW,
                payload: pView
            });
        } else {
            radios.push({
                type: RADIOS.stores.NAV_ADD_SUB_VIEW,
                payload: pView || VIEWS.jobSubViews.JOB_DETAIL_VIEW
            });
        }

        return radios;
    };

    sendJobApplication = (data) => {
        radio(RADIOS.services.SEND_JOB_APPLICATION).broadcast(data);
    };

    sendJobMessage = (data) => {
        radio(RADIOS.services.SEND_JOB_MESSAGE).broadcast(data);
    };

    sortJobs = (jobList) => {
        if(jobList) {
            return jobList.sort((j1, j2) => {
                const date1 = moment(DateTools.convertFromBalboaTrunkTimestamp(j1.get('starttime')));
                const date2 = moment(DateTools.convertFromBalboaTrunkTimestamp(j2.get('starttime')));

                if(j1 && !j2) {
                    return -1;
                }

                if(!j1 && j2) {
                    return 1;
                }

                if(j1.get('allow_new_applicants') && j2.get('allow_new_applicants') === false) {
                    return -1;
                }

                if(j1.get('allow_new_applicants') === false && j2.get('allow_new_applicants')) {
                    return 1;
                }

                let a = j1.toJS();
                let b = j2.toJS();

                let a_ag = (a.my_info && a.my_info.mp_agreement) || {};
                let b_ag = (b.my_info && b.my_info.mp_agreement) || {};
                let a_signed = (a_ag.buyer_signed ? 3 : 0) + (a_ag.speaker_signed ? 1 : 0);
                let b_signed = (b_ag.buyer_signed ? 3 : 0) + (b_ag.speaker_signed ? 1 : 0);
                if (a_signed !== b_signed) {
                    return b_signed - a_signed;
                }

                if(!date1 && date2) {
                    return -1;
                }

                if(date1 && !date2) {
                    return 1;
                }

                if(date1.isBefore(date2)) {
                    return -1;
                }

                if(date2.isBefore(date1)) {
                    return 1;
                }

                return 0;
            });
        }
    };

    /**
     * Handles the updateDashboardStore action
     *
     * @param data
     * @private
     */
    updateJobBoardStore = (data) => {
        return {
            type: RADIOS.stores.JOB_BOARD_STORE_UPDATE,
            payload: data
        };
    };

    updateJobAgreement = (data) => {
        return {
            type: RADIOS.stores.JOB_BOARD_UPDATE_AGREEMENT,
            payload: data
        };
    };

    updateJobDetail = (data) => {
        return {
            type: RADIOS.stores.JOB_BOARD_UPDATE_JOB_DETAIL,
            payload: data
        };
    };

    updateJobMessages = (data) => {
        return {
            type: RADIOS.stores.JOB_BOARD_UPDATE_JOB_MESSAGES,
            payload: data
        };
    };

    //=========================================================================
    //
    // Public Interface
    //
    //=========================================================================

    return {
        getBudget,
        getBuyerName,
        getCompanyName,
        getCommission,
        getEventDate,
        getLedgerData,
        getMessageSpeakerName,
        getMyInfo,
        getNotes,
        getOfferStatus,
        getOfferStatusDisplay,
        getOfferStatusIndexByJob,
        getOfferStatusIndexByStatus,
        getOfferEventStatus,
        getPayments,
        getShortListDescription,
        getTopics,
        getTotalUnread,
        isJobLead,
        isJobOffer,
        loadJobBoard,
        loadJobAgreement,
        loadJobEvent,
        loadJobMessages,
        markMessagesRead,
        selectJob,
        sendJobMessage,
        sendJobApplication,
        sortJobs,
        updateJobBoardStore,
        updateJobAgreement,
        updateJobDetail,
        updateJobMessages
    };
}

export default JobBoardActionsFactory;
