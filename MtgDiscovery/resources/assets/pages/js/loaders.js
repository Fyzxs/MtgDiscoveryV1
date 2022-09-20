let loaderBase = (function (urlFunc) {
    var hasLoaded = false

    function load(setCode, success) {
        if (hasLoaded) return
        hasLoaded = true
        loadByUrl(urlFunc(setCode), success)
    }

    function loadByUrl(url, callback) {
        $.get(url, function (data) {
            callback(data)
        })
            .fail(function () {
                callback(undefined)
            });
    }

    return {
        load: load,
        needsLoad: () => !hasLoaded,
        reload:() => hasLoaded = false
    }
});

let setSingleSetLoader = (function () {
    function singleSetUrl(setCode) {
        return `/api/v1/set/${setCode}${browserUser.userIdUrlPath()}`
    }

    return loaderBase(singleSetUrl)
});
let setParentSetLoader = (function () {
    function parentSetUrl(setCode) {
        return `/api/v1/set/${setCode}/sets${browserUser.userIdUrlPath()}`
    }

    return loaderBase(parentSetUrl)
});
let setAllSetsLoader = (function () {
    function parentSetUrl() {
        return `/api/v1/sets${browserUser.userIdUrlPath()}`
    }

    return loaderBase(parentSetUrl)
});
/* BEG CARD DATA LOADER */
let artistCardsLoader = (function(){
    function singleSetUrl(artistName) {
        return `/api/v1/artist/${artistName}/cards${browserUser.userIdUrlPath()}`
    }
    return loaderBase(singleSetUrl)
});
let cardNameCardsLoader = (function(){
    function singleSetUrl(cardName) {
        return `/api/v1/card/${cardName}/cards${browserUser.userIdUrlPath()}`
    }
    return loaderBase(singleSetUrl)
});
let cardSingleSetLoader = (function(){
    function singleSetUrl(setCode) {
        return `/api/v1/set/${setCode}/cards${browserUser.userIdUrlPath()}`
    }
    return loaderBase(singleSetUrl)
});
let cardParentSetLoader = (function(){
    function parentSetUrl(setCode) {
        return `/api/v1/set/parent/${setCode}/cards${browserUser.userIdUrlPath()}`
    }
    return loaderBase(parentSetUrl)
});
let collectionSummaryLoader = (function(){
    function parentSetUrl(setCode) {
        return `/api/v1/collection/summary${browserUser.userIdUrlPath()}`
    }
    return loaderBase(parentSetUrl)
});