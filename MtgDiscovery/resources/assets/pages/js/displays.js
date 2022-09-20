let baseDisplay = (function (loadKey, container, loader, filter, sorter, methods) {

    function onLoadSuccess(rawSetData) {
        assignBoxes(rawSetData)
        showCollection()
    }

    let items = []

    function excludeIt(item) {
        return item.side === "b"
    }

    function assignBoxes(sets) {
        $.each(sets, function (index, item) {
            if(excludeIt(item)) return;
            methods.preCreateProcessing(item);
            items.push(methods.createItem(item))
        });
    }

    function initialize() {
        if (container.children().length !== 0) return
        container.empty()
        $.each(items, function (index, item) {
            container.append(item.element());
            methods.registerEvents(item);
        });
    }

    function filterIt($elements) {
        let filterCount = 0;
        $.each($elements, function (index, item) {
            let $item = $(item)
            if (filter.isFiltered(item, index)) {
                filterCount++
                $item.addClass("itemHidden")
                $item.removeClass("itemShown")
            } else {
                $item.addClass("itemShown")
                $item.removeClass("itemHidden")
            }
        })
        return filterCount
    }

    function sortIt($elements) {
        sorter.sort($elements)
    }

    function showCollection() {
        initialize();
        if (container.children().length === 1){
            methods.hide()
            return
        }
        methods.show()
        let $elements = container.children();
        sortIt($elements);
        let filteredOut = filterIt($elements);
        $elements.detach().appendTo(container);
        methods.displayFilterCount($elements.length, filteredOut);
    }

    function itemCount(callback){
        function doIt(rawData){
            onLoadSuccess(rawData)
            callback(container.children().length)
        }
        showCallback(doIt)
    }


    function showCallback(callback) {
        if (loader.needsLoad()) loader.load(loadKey, callback)
        else showCollection()
    }

    function show() {
        showCallback(onLoadSuccess);
    }
    function reload(){
        loader.reload()
        show()
    }

    return {
        show: show,
        itemCount:itemCount,
        reload: reload
    }
});

/* CARD STUFF */
let cardBaseDisplay = (function (primarySetCode, loader, filter, methods) {

    let sorter = cardSorterClosure

    function createItem(card) {
        return createCardItem(card);
    }

    function registerEvents(card) {
        card.registerEvents()
    }

    function preCreateProcessing(item) {
        item.releaseDate = new Date(item.setReleaseDate)
        item.isExtended = item.isExtendedCardSet
        item.isFoil = item.isForcedFoilSet || (item.hasFoil && !item.hasNonFoil)
        item.displayName = `${item.name}` + (item.isFoil ? " [FOIL]" : "")
        item.lowerSetCode = item.setCode.toLowerCase()
    }

    function displayFilterCount(totalElements, filteredOut) {
        if(globals.manipulations.filter.hideCount) return
        $('.filteredCounts').html(`Showing [${totalElements - filteredOut} of ${totalElements}]`)
    }
    function show(){
        sorter.show()
        filter.show()
    }
    function hide(){
        console.log(new Error().stack);
        sorter.hide()
        filter.hide()
    }

    function newDisplay() {
        return baseDisplay(
            primarySetCode,
            $('.cardBoxes'),
            loader,
            filter,
            sorter,
            {createItem, registerEvents, preCreateProcessing, displayFilterCount, show, hide }
        )
    }

    return {
        newDisplay: newDisplay
    }
})

let artistCardsDisplay = (function () {
    function newDisplay(artistName, filter) {
        return cardBaseDisplay(artistName, artistCardsLoader(), filter).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let cardNameCardsDisplay = (function () {
    function newDisplay(cardName, filter) {
        return cardBaseDisplay(cardName, cardNameCardsLoader(), filter).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let singleSetCardDisplay = (function () {
    function newDisplay(setCode, filter) {
        return cardBaseDisplay(setCode, cardSingleSetLoader(), filter).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let binderSetCardDisplay = (function () {

    function newDisplay(setCode, filter) {
        return cardBaseDisplay(setCode, cardSingleSetLoader(), filter).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let parentSetCardDisplay = (function () {
    function newDisplay(setCode, filter) {
        return cardBaseDisplay(setCode, cardParentSetLoader(), filter).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();

/* SET STUFF */
let setBaseDisplay = (function (primarySetCode, loader, linkConfig) {

    function createItem(set) {
        return createSetItem(set, primarySetCode, linkConfig);
    }

    function registerEvents(set) {
    }
    function show(){}
    function hide(){}

    function preCreateProcessing(set) {
        set.date = new Date(set.releaseDate)
        set.pctCollected = parseInt(set.ofSet / set.calculatedSetSize * 100)
        set.lowerCaseCode = set.code.toLowerCase()
    }

    function displayFilterCount(totalElements, filteredOut) {
        if(globals.manipulations.filter.hideCount) return
        let $x = $('.filteredCounts')
        if(totalElements === 1 && filteredOut === 1){
            $x.html("")
        }
        else {
            $x.html(`Showing [${totalElements - filteredOut} of ${totalElements}]`)
        }
    }

    function newDisplay() {
        return baseDisplay(
            primarySetCode,
            $('.setBoxes'),
            loader,
            setFilterClosure,
            setSorterClosure,
            {createItem, registerEvents, preCreateProcessing, displayFilterCount, show, hide}
        )
    }


    return {
        newDisplay: newDisplay
    }
})
let singleSetDisplay = (function () {
    function newDisplay(setCode, ) {
        return setBaseDisplay(setCode, setSingleSetLoader(), {linkToAllSets: true, linkToSingleSet: false, linkToParentSet: true}).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let parentSetDisplay = (function () {
    function newDisplay(setCode) {
        return setBaseDisplay(setCode, setParentSetLoader(), {linkToAllSets: true, linkToSingleSet: true, linkToParentSet: false}).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();
let allSetsDisplay = (function () {
    function newDisplay() {
        return setBaseDisplay(undefined, setAllSetsLoader(), {linkToAllSets: false, linkToSingleSet: true, linkToParentSet: true}).newDisplay()
    }

    return {
        newDisplay: newDisplay
    }
})();

/* COLLECTION STUFF */
let collectionSummaryDisplay = (function () {

    function createItem(collectionSummary){
        return createCollectionItem(collectionSummary)
    }
    function registerEvents(){}
    function preCreateProcessing (){}
    function isFiltered(){}
    function sort(){}
    function hide(){}
    function show(){}
    function displayFilterCount(){}
    function newDisplay() {
        return baseDisplay(
            undefined,
            $('.collectionSummary'),
            collectionSummaryLoader(),
            {isFiltered, hide:hide, show:show},
            {sort:sort, hide:hide, show:show},
            {createItem, registerEvents, preCreateProcessing, displayFilterCount, show, hide}
        )
    }

    return {
        newDisplay: newDisplay
    }
})();