let _setSorter = (function () {

    let _setSortSelector = (function () {
        let SORT = viewControlTypes.SORT

        function sortFunction(sortType, orderType) {
            return (a, b) => baseSortFunctions(sortType)(x(a), x(b)) * orderType
        }

        function baseSortFunctions(sortType) {
            if (sortType === SORT.ALPHA) return alphaSort
            if (sortType === SORT.RELEASE_DATE) return releaseDateSort
            if (sortType === SORT.SET_SIZE) return setSizeSort
            if (sortType === SORT.PCT_COLLECTED) return pctCollectedSort
            if (sortType === SORT.COUNT_COLLECTED) return countCollectedSort
            return () => console.log(`unknown set sort [sortType=${sortType}] provided`)
        }

        function alphaSort(a, b) {
            return a.name.localeCompare(b.name)
        }

        function setSizeSort(a, b) {
            let initial = parseInt(a.calculatedSetSize) - parseInt(b.calculatedSetSize)
            return initial === 0 ? alphaSort(a, b) : initial
        }

        function releaseDateSort(a, b) {
            let release = a.date - b.date
            let image = a.imageCode.localeCompare(b.imageCode)
            if(release !== 0) return release
            if(image !== 0) return image
            return alphaSort(a, b) * -1 //Inverting forces default to be first in the list
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
            //turn these into a "setData.name"
            a.name = $e.data("name")
            a.setcode = $e.data("setcode")
            a.calculatedSetSize = $e.data("calculatedsetsize").toString()
            a.date = $e.data("date")
            a.pctCollected = $e.data("pctcollected")
            a.countCollected = $e.data("countcollected")
            a.imageCode = $e.data("imagecode")

            return a
        }

        return sortFunction

    })();

    function sort(sortType, orderType) {
        let container = $(".innerSetContainer")
        let sets = container.children()
        sets.sort(_setSortSelector(sortType, orderType))
        sets.detach().appendTo(container);
    }

    return {sort}
})()

let _cardSorter = (function () {

    let _sortSelector = (function () {
        let SORT = viewControlTypes.SORT
        let cachedUrlSetCode = undefined

        function urlSetCode() {
            if (cachedUrlSetCode === undefined) {
                cachedUrlSetCode = urlInfo.set.value().toLowerCase()
            }
            return cachedUrlSetCode
        }

        function sortFunction(sortType, orderType) {
            return (a, b) => baseSortFunctions(sortType)(x(a), x(b)) * orderType
        }

        function baseSortFunctions(type) {
            if (type === SORT.CARD_NUMBER) return sortNumberWithVariant
            if (type === SORT.ALPHA) return alphaSort
            if (type === SORT.SET) return setSort
            if (type === SORT.PRICE) return priceSort
            return () => console.log(`unknown card sort [type=${type}] provided`)
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

        function priceSort(a, b) {
            let initial = a.price - b.price
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
            if (isAlphaBPrefix && !isAlphaAPrefix) return -1
            if (isAlphaAPrefix && !isAlphaBPrefix) return 1

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

        return sortFunction
    })();

    function sort(sortType, orderType) {
        let container = $(".cardBoxes")
        let cards = container.children()
        cards.sort(_sortSelector(sortType, orderType))
        cards.detach().appendTo(container);
    }

    return {sort}
})();

let baseSortTypeHtml = function (label, controlId, sortType, isActive) {
    let groupName = "sortTypeGroup"
    let cssClass = "sortTypeItem"
    let sortToggleItemFunc = (label, inputControl) => viewControlsBase.toggleItemFunc(label, additionalCss(css.sort, cssClass), inputControl)
    let html = htmler(`<input class="${groupName}" type="radio" id="${controlId}" name="${groupName}" data-sorttype="${sortType}" ${isActive ? `checked="checked"` : ""}>`)
    return sortToggleItemFunc(label, html)
}
let alphaSort = (isActive, sortControls) => sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.alpha), "alphaSort", viewControlTypes.SORT.ALPHA, isActive))
let releaseSort = (isActive, sortControls) => sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.release), "releaseSort", viewControlTypes.SORT.RELEASE_DATE, isActive))
let setSizeSort = (isActive, sortControls) => sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.setSize), "setSizeSort", viewControlTypes.SORT.SET_SIZE, isActive))
let setPercentSort = (isActive, sortControls) => urlInfo.ctor.absent() ? undefined : sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.setPercent), "setPercentSort", viewControlTypes.SORT.PCT_COLLECTED, isActive))
let setCollectedSort = (isActive, sortControls) => urlInfo.ctor.absent() ? undefined : sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.cardsCollected), "cardsCollectedSort", viewControlTypes.SORT.COUNT_COLLECTED, isActive))
let cardPriceSort = (isActive, sortControls) => sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.cardPrice), "cardPriceSort", viewControlTypes.SORT.PRICE, isActive))
let cardNumberSort = (isActive, sortControls) => sortControls.push(baseSortTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.cardNumber), "cardNumberSort", viewControlTypes.SORT.CARD_NUMBER, isActive))

let baseOrderTypeHtml = function (label, controlId, sortType, isActive) {
    let groupName = "sortOrderGroup"
    let cssClass = "sortOrderItem";
    let sortToggleItemFunc = (label, inputControl) => viewControlsBase.toggleItemFunc(label, additionalCss(css.sort, cssClass), inputControl)
    let html = htmler(`<input class="${groupName}" type="radio" id="${controlId}" name="${groupName}" data-sorttype="${sortType}" ${isActive ? `checked="checked"` : ""}>`)
    return sortToggleItemFunc(label, html)
}
let ascSort = (isActive) => baseOrderTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.desc), "ascSortOrder", viewControlTypes.ORDER.DESC, isActive)
let descSort = (isActive) => baseOrderTypeHtml(i18n.get(i18n.keys.viewControls.controls.sort.asc), "descSortOrder", viewControlTypes.ORDER.ASC, isActive)


let _sorterHtml = function (sortControls, orderControls, sorter) {

    function incOrder(include = true){
        orderControls.visible(include)
    }
    let sortBuilder = () => {
        let sortBuilder = sortControls.sortBuilder;
        sortBuilder.incOrder = incOrder
        return sortBuilder;
    }
    let includeOrder = true

    let sortControlsLabel = viewControlsBase.viewControlLabelFunc(i18n.get(i18n.keys.viewControls.section.sortControls));
    let sortControlsParentFunc = content => viewControlsBase.viewTypeParentFunc(viewControlsBase.viewTypeInnerFunc(generateAll(sortControlsLabel, viewControlsBase.viewTypeControlSetParentFunc(content))), additionalCss("sortControls"))

    function html() {
        let gen = includeOrder ? generateAll(sortControls, orderControls) : generateAll(sortControls)
        return sortControlsParentFunc(gen).html()
    }
    let cacheFilterCallback = () => {}

    function activateSortControls() {
        sorter.sort(sortControls.data(), orderControls.data())
        cacheFilterCallback()
    }

    function registerEvents(filtercallback) {
        cacheFilterCallback = filtercallback
        sortControls.registerEvents(activateSortControls)
        orderControls.registerEvents(activateSortControls)
    }

    return {
        html: html,
        builder: sortBuilder,
        registerEvents: registerEvents,
        _trigger: activateSortControls
    }
}

let setSortControls = (function () {
    let cssClass = "sortTypeGroup"
    let controls = []
    let builder = {}

    function incAlpha(isActive = false) {
        alphaSort(isActive, controls)
        return builder
    }

    builder.incAlpha = incAlpha

    function incRelease(isActive = false) {
        releaseSort(isActive, controls)
        return builder
    }

    builder.incRelease = incRelease

    function incSetSize(isActive = false) {
        setSizeSort(isActive, controls)
        return builder
    }

    builder.incSetSize = incSetSize

    function incSetPercent(isActive = false) {
        setPercentSort(isActive, controls)
        return builder
    }

    builder.incSetPercent = incSetPercent

    function incCardsCollected(isActive = false) {
        setCollectedSort(isActive, controls)
        return builder
    }

    builder.incCardsCollected = incCardsCollected

    function sortData() {
        return $(`.${cssClass}:checked`).data("sorttype")
    }

    function registerEvents(sortCallback) {
        $(`.${cssClass}`).change(debounce(function () {
            sortCallback();
        }, 250, true))
    }

    function getHtml() {
        return viewControlsBase.viewTypeControlSetFunc(generateAll(...controls)).html()
    }

    return {
        sortBuilder: builder,
        html: getHtml,
        registerEvents,
        data: sortData
    }
})()

let cardsSortControls = (function () {
    let cssClass = "sortTypeGroup"
    let controls = []
    let builder = {}

    function incAlpha(isActive = false) {
        alphaSort(isActive, controls)
        return builder
    }

    builder.incAlpha = incAlpha

    function incRelease(isActive = false) {
        releaseSort(isActive, controls)
        return builder
    }

    builder.incRelease = incRelease

    function incCardPrice(isActive = false) {
        cardPriceSort(isActive, controls)
        return builder
    }

    builder.incCardPrice = incCardPrice

    function incCardNumber(isActive = false) {
        cardNumberSort(isActive, controls)
        return builder
    }

    builder.incCardNumber = incCardNumber

    function sortData() {
        return $(`.${cssClass}:checked`).data("sorttype")
    }

    function registerEvents(sortCallback) {
        $(`.${cssClass}`).change(debounce(function () {
            let x = this
            sortCallback();
        }, 250, true))
    }

    function getHtml() {
        return viewControlsBase.viewTypeControlSetFunc(generateAll(...controls)).html()
    }

    return {
        sortBuilder: builder,
        html: getHtml,
        registerEvents,
        data: sortData
    }
})()

let orderControls = (function (descActive) {
    let cssClass = "sortOrderGroup";
    let showControls = true

    function visible(shouldShow){
        showControls = shouldShow
    }

    function orderData() {
        return $(`.${cssClass}:checked`).data("sorttype")
    }

    function registerEvents(sortCallback) {
        $(`.${cssClass}`).change(debounce(function () {
            sortCallback();
        }, 250, true))
    }

    function getHtml() {
        return viewControlsBase.viewTypeControlSetFunc(generateAll(ascSort(!descActive), descSort(descActive)), showControls ? "" : "itemHidden").html();
    }

    return {
        html: getHtml,
        registerEvents,
        data: orderData,
        visible:visible
    }
})

let setSorterHtml = _sorterHtml(setSortControls, orderControls(false), _setSorter)
let cardSorterHtml = _sorterHtml(cardsSortControls, orderControls(true), _cardSorter)
