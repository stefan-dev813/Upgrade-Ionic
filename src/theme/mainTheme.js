const blueOne = '#4289C9';
const blueTwo = '#348BBD';
const whiteOne = '#FFFFFF';
const greenOne = '#57BD8B';
const yellowOne = '#F2C411';
const redOne = '#eb5e5b';
const blackOne = '#000000';
const blackTwo = '#6e6e6e';

export default {
    appBackgroundColor: '#ededed',
    primaryColor: blueOne,
    accentColor: '',
    fontColor: blackTwo,
    mutedFontColor: '#999',
    calendarFontColor: blackTwo,
    backgroundColor: blueOne,
    foregroundColor: whiteOne,
    darkBackgroundColor: '#2269a9',
    // Event Statuses
    callColor: '#BAA743',
    coachingColor: '#333',
    confirmedColor: greenOne,
    confirmedFontColor: whiteOne,
    dailyColor: 'violet',
    leadColor: blueTwo,
    leadFontColor: whiteOne,
    heldColor: yellowOne,
    heldFontColor: whiteOne,
    heldPersonalFontColor: blackTwo,
    closedColor: 'grey',
    closedFontColor: whiteOne,
    postponedColor: 'blueviolet',
    postponedFontColor: whiteOne,
    travelColor: '#B8E2F6',
    // Message Colors
    overdueColor: redOne,
    errorBackgroundColor: '#d5463f',
    errorBackgroundColorLighter: 'rgba(240, 66, 58, 0.5)',
    errorFontColor: 'white',
    warningBackgroundColor: '#efbd09',
    warningFontColor: 'white',
    infoBackgroundColor: '#8e8ba0',
    infoFontColor: 'white',
    successBackgroundColor: '#3AA36A',
    successFontColor: 'white',
    headerIconColor: 'white',
    // Action Colors
    todoCompleteColor: '#DFF0D8',
    todoOverdueColor: '#F2DEDE',
    footerIconColor: 'rgba(0, 0, 0, 0.54)',
    footerSelectedIconColr: 'rgb(66, 137, 201)',
    offerChipColor: '#5bc0de',
    offerChipFontColor: whiteOne,

    getStatusColor(status) {
        switch (status) {
            case 'lead':
            case 'leads':
                return this.leadColor;
            case 'held':
            case 'warning':
                return this.heldColor;
            case 'overdue':
            case 'error':
                return this.overdueColor;
            default:
                return this[`${status}Color`];
        }
    }
};