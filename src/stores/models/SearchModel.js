/******************************************************************************
 *
 * Imports
 *
 *****************************************************************************/
const {List, Record} = require('immutable');


/**************************************************************************
 *
 * Public Interface
 *
 *************************************************************************/
export default Record({
    description: undefined,
    results: List(),
    noResults: false,
    searchTerm: '',
    deepSearch: false,
    includeCanceled: false,
    onlyDatelessEvents: false,
    marketplaceOnly: false,
    futureOnly: false,
    autoSearch: false
});