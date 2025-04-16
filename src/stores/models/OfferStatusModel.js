const {Record, List} = require('immutable');

export default Record({
    key: undefined,
    display: undefined,
    status: undefined,
    areaTitle: undefined,
    nowItems: List(),
    nextItems: List(),
    nowType: undefined,
    showMessages: () => {
        return this.nowType !== 'success';
    }
});