let FILTERS = {
    TYPES: {
        FOIL: {ALL: -1, FOIL: 1, NOT: 2},
        RARITY: {ALL: -1, MYTHIC: 101, RARE: 102, UNCOMMON: 103, COMMON: 104, TOKEN: 105},
        PROMO: {ALL: -1, PROMO: 201, REGULAR: 202, EXTENDED: 203},
        SET: {PARTIAL_PREVIEW: 301},
        COUNT : {ALL : -1, ZERO: 400, ONE:401, TWO:402, THREE:403, FOUR:404, MORE:405},
        COLLECTED: {ALL:-1, COMPLETED : 501, PARTIAL:502, NOT_STARTED: 503},
        TEXT: {YEP:10001},
        BINDER: {YEP:20001}
    }
}

let baseFilter = (function (filterFunc) {
    let filters = []
    let meta = {}

    function updateMeta(key, value){
        meta[key] = value
    }

    function addFilter(filter) {
        filters.push(filter)
    }

    function removeFilter(filter) {
        filters = filters.filter(function (ele) {
            return ele !== filter;
        });
    }

    function isFiltered(item, index) {
        return filterFunc(filters, item, meta, index)
    }

    function hide(){
        console.log(new Error().stack);
        $(globals.manipulations.filter.selector).hide()
    }

    function show(){
        $(globals.manipulations.filter.selector).show()
    }

    return {
        add: addFilter,
        remove: removeFilter,
        isFiltered: isFiltered,
        updateMeta:updateMeta,
        hide:hide,
        show:show
    }
});

let setFilterClosure = (function () {
    function partialPreviewFiltered(filters, set) {
        return filters.includes(FILTERS.TYPES.SET.PARTIAL_PREVIEW) && set.date > Date.now()
    }

    function isSetFiltered(filters, setItem, meta) {
        let set = x(setItem);
        return partialPreviewFiltered(filters, set) || setCollectedCompleted(filters, set) || setTextFilter(filters, set, meta)
    }

    function x(e) {
        let $e = $(e)
        let a = {}
        a.name = $e.data("name")
        a.setcode = $e.data("setcode")
        a.calculatedSetSize = $e.data("calculatedsetsize").toString()
        a.date = $e.data("date")
        a.pctCollected = $e.find(".pct").html()

        return a
    }

    return baseFilter(isSetFiltered)
})();

let setTextFilter = function(filters, set, meta){
    if(!filters.includes(FILTERS.TYPES.TEXT.YEP)) return false
    let enteredText = meta[FILTERS.TYPES.TEXT.YEP];
    if(!enteredText) return false

    let compareText = enteredText.toLowerCase()
    let nameDoesNotContain = !set.name.toLowerCase().includes(compareText);
    let codeDoesNotContain = !set.setcode.toLowerCase().includes(compareText);
    return nameDoesNotContain && codeDoesNotContain
}

let setCollectedCompleted = function(filters, set){

    function filterCompleted(filters, set) {
        return filters.includes(FILTERS.TYPES.COLLECTED.COMPLETED) && set.pctCollected === "100"
    }
    function filterPartial(filters, set) {
        return filters.includes(FILTERS.TYPES.COLLECTED.PARTIAL) && set.pctCollected !== "0" && set.pctCollected !== "100"
    }
    function filterNothings(filters, set) {
        return filters.includes(FILTERS.TYPES.COLLECTED.NOT_STARTED) && set.pctCollected === "0"
    }

    return filterCompleted(filters, set) ||
        filterPartial(filters, set) ||
        filterNothings(filters, set)
}


let cardFilterClosure = (function () {

    function isCardFiltered(filters, card, meta, index) {
        let vals = x(card)
        return cardRaritiesFiltered(filters, vals) ||
            cardPromosFiltered(filters, vals) ||
            cardFoilsFiltered(filters, vals) ||
            cardCollectedCountFiltered(filters, vals) ||
            cardTextFilter(filters, vals, meta) ||
            cardBinderFilter(filters, vals, meta, index)
    }

    function x(e) {
        let $e = $(e)
        let a = {}
        a.rarity = $e.data("rarity")
        a.number = $e.data("number").toString()
        a.isFoil = $e.data("isfoil")
        a.setCode = $e.data("setcode")
        a.name = $e.data("name")
        a.isPromo = $e.data("ispromo")
        a.isExtended = $e.data("isextended")
        a.count = $e.find(".cardCountSpan").html()

        return a
    }

    return baseFilter(isCardFiltered)
});


let cardTextFilter = function(filters, card, meta){
    if(!filters.includes(FILTERS.TYPES.TEXT.YEP)) return false
    let enteredText = meta[FILTERS.TYPES.TEXT.YEP];
    if(!enteredText) return false

    let compareText = enteredText.toLowerCase()
    return !card.name.toLowerCase().includes(compareText);
}

let cardBinderFilter = function(filters, card, meta, index){
    if(!filters.includes(FILTERS.TYPES.BINDER.YEP)) return false
    let page = parseInt(meta[FILTERS.TYPES.BINDER.YEP])
    let cardPage = Math.ceil((index+1) / 9)
    return page !== cardPage
}

let cardCollectedCountFiltered = function(filters, card){
    function filterZero(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.ZERO) && card.count === "0"
    }
    function filterOne(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.ONE) && card.count === "1"
    }
    function filterTwo(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.TWO) && card.count === "2"
    }
    function filterThree(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.THREE) && card.count === "3"
    }
    function filterFour(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.FOUR) && card.count === "4"
    }
    function filterMore(filters, card) {
        return filters.includes(FILTERS.TYPES.COUNT.MORE) && 5 <= parseInt(card.count)
    }

    return filterZero(filters, card) ||
        filterOne(filters, card) ||
        filterTwo(filters, card) ||
        filterThree(filters, card) ||
        filterFour(filters, card) ||
        filterMore(filters, card)

}

let cardPromosFiltered = function(filters, card){

    function promosPromoFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.PROMO.PROMO) && card.isPromo
    }

    function promosRegularFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.PROMO.REGULAR) && !card.isPromo && !card.isExtended
    }

    function promosExtendedFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.PROMO.EXTENDED) && card.isExtended
    }

    return promosPromoFiltered(filters, card) ||
        promosRegularFiltered(filters, card) ||
        promosExtendedFiltered(filters, card)
}

let cardRaritiesFiltered = function(filters, card){

    /* BEG RARITIES */
    function rarityMythicFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.RARITY.MYTHIC) && card.rarity === "mythic"
    }

    function rarityRareFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.RARITY.RARE) && card.rarity === "rare"
    }

    function rarityUnCommonFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.RARITY.UNCOMMON) && card.rarity === "uncommon"
    }

    function rarityCommonFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.RARITY.COMMON) && card.rarity === "common"
    }

    function rarityTokenFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.RARITY.TOKEN) && card.rarity === "token"
    }

    return rarityMythicFiltered(filters, card) ||
        rarityRareFiltered(filters, card) ||
        rarityUnCommonFiltered(filters, card) ||
        rarityCommonFiltered(filters, card) ||
        rarityTokenFiltered(filters, card);
}
let cardFoilsFiltered = function(filters, card){

    function isNonFoilCardFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.FOIL.NOT) && !card.isFoil
    }

    function isFoilCardFiltered(filters, card) {
        return filters.includes(FILTERS.TYPES.FOIL.FOIL) && card.isFoil
    }

    return isNonFoilCardFiltered(filters, card) ||
        isFoilCardFiltered(filters, card)
}