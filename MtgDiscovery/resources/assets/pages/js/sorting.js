


let SORT = {TYPES:{ALPHA: 1, RELEASE_DATE: 2, SET_SIZE: 3, PCT_COLLECTED: 4, CARD_NUMBER: 5, SET: 6, PRICE:7, COUNT_COLLECTED:8}}
let ORDER = {DESC: -1, ASC: 1}

let baseSorterClosure = (function (sortFunc) {
    var lastSort = undefined
    var lastOrder = undefined

    function sort(sortType) {
        lastSort = sortType
    }

    function order(orderType) {
        lastOrder = orderType
    }

    function actualSort(items) {
        let sort = lastSort === undefined ? globals.manipulations.sort.defaults.type : lastSort
        let order = lastOrder === undefined ? globals.manipulations.sort.defaults.order : lastOrder
        items.sort(sortFunc(sort, order))
    }

    function hide(){
        console.log(new Error().stack);
        $(globals.manipulations.sort.selector).hide()
    }

    function show(){
        $(globals.manipulations.sort.selector).show()
    }

    return {
        updateSort: sort,
        updateOrder: order,
        sort: actualSort,
        hide:hide,
        show:show
    }
});

let setSorterClosure = (function () {

    function sortFunction(sortType, orderType) {
        return (a, b) => baseSortFunctions(sortType)(x(a), x(b)) * orderType
    }

    function baseSortFunctions(sortType) {
        if (sortType === SORT.TYPES.ALPHA) return alphaSort
        if (sortType === SORT.TYPES.RELEASE_DATE) return releaseDateSort
        if (sortType === SORT.TYPES.SET_SIZE) return setSizeSort
        if (sortType === SORT.TYPES.PCT_COLLECTED) return pctCollectedSort
        if (sortType === SORT.TYPES.COUNT_COLLECTED) return countCollectedSort
        return () => console.log(`unknown sort [sortType=${sortType}] provided`)
    }

    function alphaSort(a, b) {
        return a.name.localeCompare(b.name)
    }

    function setSizeSort(a, b) {
        let initial = parseInt(a.calculatedSetSize) - parseInt(b.calculatedSetSize)
        return initial === 0 ? alphaSort(a, b) : initial
    }

    function releaseDateSort(a, b) {
        let initial = a.date - b.date
        return initial === 0 ? alphaSort(a, b) : initial
    }

    function pctCollectedSort(a, b) {
        let initial = parseInt(a.pctCollected) - parseInt(b.pctCollected)
        return initial === 0 ? alphaSort(a, b) : initial
    }

    function countCollectedSort(a, b) {
        let initial = parseInt(a.countCollected) - parseInt(b.countCollected)
        return initial === 0 ? pctCollectedSort(a, b) : initial
    }

    function x(e) {
        let $e = $(e)
        let a = {}
        a.name = $e.data("name")
        a.setcode = $e.data("setcode")
        a.calculatedSetSize = $e.data("calculatedsetsize").toString()
        a.date = $e.data("date")
        a.pctCollected = $e.data("pctcollected")
        a.countCollected = $e.data("countcollected")

        return a
    }

    return baseSorterClosure(sortFunction)
})();

let cardSorterClosure = (function () {

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var cachedUrlSetCode = undefined

    function urlSetCode() {
        if (cachedUrlSetCode === undefined) {
            cachedUrlSetCode = getParameterByName("setCode")?.toLowerCase()
        }
        return cachedUrlSetCode
    }

    function sortFunction(sortType, orderType) {
        return (a, b) => baseSortFunctions(sortType)(x(a), x(b)) * orderType
    }

    function baseSortFunctions(type) {
        if (type === SORT.TYPES.CARD_NUMBER) return sortNumberWithVariant
        if (type === SORT.TYPES.ALPHA) return alphaSort
        if (type === SORT.TYPES.SET) return setSort
        if (type === SORT.TYPES.PRICE) return priceSort
        return () => console.log(`unknown sort [type=${type}] provided`)
    }

    function foilSort(a, b) {
        return a.isFoil - b.isFoil;
    }

    function alphaSort(a, b) {
        let alphaCompare = a.name.localeCompare(b.name)
        return alphaCompare === 0 ? foilSort(a, b) : alphaCompare
    }

    function setSort(a, b) {
        let initial = a.setCode.localeCompare(b.setCode)
        return (initial === 0) ? sortNumberWithVariant(a, b) : initial
    }

    function priceSort(a, b){
        let initial = a.price < b.price
        return (initial === 0) ? alphaSort(a, b) : initial
    }

    function sortNumberWithVariant(a, b) {
        let strA = a.number
        let strB = b.number
        let numA = strA.replace(/\D/g, '')
        let numB = strB.replace(/\D/g, '')
        let alphaNumPartA = strA.replace(numA.toString(), "")
        let alphaNumPartB = strB.replace(numB.toString(), "")
        let isAlphaAPrefix = strA.startsWith(alphaNumPartA) && alphaNumPartA !== ""
        let isAlphaBPrefix = strB.startsWith(alphaNumPartB) && alphaNumPartB !== ""
        let numCompare = numA - numB;

        //Token vs non Token
        if (a.rarity === "token" && (b.rarity !== "token" || alphaNumPartA === "CH")) return 1
        if (b.rarity === "token" && (a.rarity !== "token" || alphaNumPartB === "CH")) return -1

        //ParentSet vs Other Sets
        let setCode = urlSetCode()
        let hasSetCodeA = a.setCode.includes(setCode)
        let hasSetCodeB = b.setCode.includes(setCode)
        let isSetCodeA = a.setCode === setCode
        let isSetCodeB = b.setCode === setCode

        //Put sets w/parent in them first
        if (hasSetCodeA && !hasSetCodeB) return -1
        if (hasSetCodeB && !hasSetCodeA) return 1

        //Put cards with AlphaPrefix last (Blame 9th Edition for this)
        if(isAlphaBPrefix && !isAlphaAPrefix) return -1
        if(isAlphaAPrefix && !isAlphaBPrefix) return 1

        //Put parents set cards first
        if (numCompare === 0) {//only if the same number
            if (isSetCodeA && !isSetCodeB) return -1
            if (isSetCodeB && !isSetCodeA) return 1
            return alphaNumPartA.localeCompare(alphaNumPartB)
        }

        //Sort Alpha
        return numCompare === 0 ? alphaSort(a, b) : numCompare
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
        a.price = parseFloat($e.data("price"))

        return a
    }

    return baseSorterClosure(sortFunction)
})();
