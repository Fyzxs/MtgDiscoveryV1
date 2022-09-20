let _setFilterer = (function () {
    let FILTERS = viewControlTypes.FILTERS

    function isSetFiltered(setItem, filters, meta) {
        let set = x(setItem);
        return setCollectedCompleted(set, filters) || setTextFilter(set, filters, meta)
    }

    let setTextFilter = function (set, filters, meta) {
        if (!filters.includes(FILTERS.TEXT.YEP)) return false
        let enteredText = meta[FILTERS.TEXT.YEP];
        if (!enteredText) return false

        let compareText = enteredText.toLowerCase()
        let nameDoesNotContain = !set.name.toLowerCase().includes(compareText);
        let codeDoesNotContain = !set.setcode.toLowerCase().includes(compareText);
        return nameDoesNotContain && codeDoesNotContain
    }

    let setCollectedCompleted = function (set, filters) {

        function filterCompleted(set, filters) {
            return filters.includes(FILTERS.COLLECTED.COMPLETED) && set.pctCollected === "100"
        }

        function filterPartial(set, filters) {
            return filters.includes(FILTERS.COLLECTED.PARTIAL) && set.pctCollected !== "0" && set.pctCollected !== "100"
        }

        function filterNothings(set, filters) {
            return filters.includes(FILTERS.COLLECTED.NOT_STARTED) && set.pctCollected === "0"
        }

        return filterCompleted(set, filters) ||
            filterPartial(set, filters) ||
            filterNothings(set, filters)
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


    function filter(filters, meta) {
        let container = $(".innerSetContainer")
        let sets = container.children()
        let filtered = 0
        let shown = 0
        $.each(sets, function (index, setItem) {
            let $set = $(setItem)
            if (isSetFiltered(setItem, filters, meta)) {
                filtered++
                $set.addClass("itemHidden")
                $set.removeClass("itemShown")
            } else {
                shown++
                $set.addClass("itemShown")
                $set.removeClass("itemHidden")
            }
        })
        return {total: sets.length, filtered: filtered, shown: shown}
    }

    return {filter}
})();

let _cardFilterer = (function () {
    let FILTERS = viewControlTypes.FILTERS

    function isCardFiltered(filters, card, meta, index) {
        let vals = x(card)
        return cardRaritiesFiltered(filters, vals) ||
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

    let cardTextFilter = function (filters, card, meta) {
        if (!filters.includes(FILTERS.TEXT.YEP)) return false
        let enteredText = meta[FILTERS.TEXT.YEP];
        if (!enteredText) return false

        let compareText = enteredText.toLowerCase()
        return !card.name.toLowerCase().includes(compareText);
    }

    let cardBinderFilter = function (filters, card, meta, index) {
        if (!filters.includes(FILTERS.BINDER.YEP)) return false
        let page = parseInt(meta[FILTERS.BINDER.YEP])
        let cardPage = Math.ceil((index + 1) / 9)
        return page !== cardPage
    }

    let cardCollectedCountFiltered = function (filters, card) {
        function filterZero(filters, card) {
            return filters.includes(FILTERS.COUNT.ZERO) && card.count === "0"
        }

        function filterOne(filters, card) {
            return filters.includes(FILTERS.COUNT.ONE) && card.count === "1"
        }

        function filterTwo(filters, card) {
            return filters.includes(FILTERS.COUNT.TWO) && card.count === "2"
        }

        function filterThree(filters, card) {
            return filters.includes(FILTERS.COUNT.THREE) && card.count === "3"
        }

        function filterFour(filters, card) {
            return filters.includes(FILTERS.COUNT.FOUR) && card.count === "4"
        }

        function filterMore(filters, card) {
            return filters.includes(FILTERS.COUNT.MORE) && 5 <= parseInt(card.count)
        }

        return filterZero(filters, card) ||
            filterOne(filters, card) ||
            filterTwo(filters, card) ||
            filterThree(filters, card) ||
            filterFour(filters, card) ||
            filterMore(filters, card)

    }

    let cardRaritiesFiltered = function (filters, card) {

        function raritySpecialFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.SPECIAL) && card.rarity === "special"
        }

        function rarityMythicFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.MYTHIC) && card.rarity === "mythic"
        }

        function rarityRareFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.RARE) && card.rarity === "rare"
        }

        function rarityUnCommonFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.UNCOMMON) && card.rarity === "uncommon"
        }

        function rarityCommonFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.COMMON) && card.rarity === "common"
        }

        function rarityTokenFiltered(filters, card) {
            return filters.includes(FILTERS.RARITY.TOKEN) && card.rarity === "token"
        }

        return raritySpecialFiltered(filters, card) ||
            rarityMythicFiltered(filters, card) ||
            rarityRareFiltered(filters, card) ||
            rarityUnCommonFiltered(filters, card) ||
            rarityCommonFiltered(filters, card) ||
            rarityTokenFiltered(filters, card);
    }


    function filter(filters, meta) {
        let container = $(".cardBoxes")
        let items = container.children()
        let filtered = 0
        let shown = 0
        $.each(items, function (index, item) {
            let $item = $(item)
            if (isCardFiltered(filters, item, meta, index)) {
                filtered++
                $item.addClass("itemHidden")
                $item.removeClass("itemShown")
            } else {
                shown++
                $item.addClass("itemShown")
                $item.removeClass("itemHidden")
            }
        })
        return {total: items.length, filtered: filtered, shown: shown}
    }

    return {filter}
})()

let setCollectedFilter = (function () {
    let FILTERS = viewControlTypes.FILTERS
    let base = viewControlsBase
    let allControlClass = "allCollectedToggle"
    let otherControlsClass = "otherCollectedToggle"
    let checkInputControl = (groupName, controlId, sortType, moreCss, isActive) => htmler(`<input class="${groupName} ${moreCss}" type="checkbox" id="${controlId}" name="${groupName}" data-sorttype="${sortType}" ${isActive ? `checked="checked"` : ""}>`)
    let collectedFilterToggleItemFunc = (labelText, control) => base.toggleItemFunc(labelText, additionalCss(css.filter), control)
    let collectedCheckInputControl = (controlId, sortType, moreCss = otherControlsClass) => checkInputControl("collectedItemsFilter", controlId, sortType, moreCss, false)
    let allToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.collected.all), collectedCheckInputControl("allCollectedFilterId", FILTERS.COLLECTED.ALL, allControlClass))
    let completedToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.collected.completed), collectedCheckInputControl("completedCollectedFilterId", FILTERS.COLLECTED.COMPLETED))
    let hasCardsToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.collected.collecting), collectedCheckInputControl("someCollectedFilterId", FILTERS.COLLECTED.PARTIAL))
    let noCardsToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.collected.notStarted), collectedCheckInputControl("noCollectedFilterId", FILTERS.COLLECTED.NOT_STARTED))
    let collectedFilterGroup = base.viewTypeControlSetFunc(generateAll(allToggle, completedToggle, hasCardsToggle, noCardsToggle))


    function addFilterCollected(filterControls) {
        if (urlInfo.ctor.absent()) return

        filterControls.push(collectedFilterGroup)
    }

    function collectedItemFilterData(filters, meta) {
        filters = filters.concat($(".collectedItemsFilter:checked").map((index, element) => $(element).data("sorttype")).toArray());
        return {filters, meta}
    }

    function registerCollectedFilterEvents(filterCallback) {
        let $all = $(`.${allControlClass}`)
        let $other = $(`.${otherControlsClass}`)

        $all.change(function () {
            $other.prop("checked", false)
            filterCallback()
        })
        $other.change(function () {
            if (this.checked) {
                $all.prop("checked", true)
            } else {
                let noneChecked = $other.map((i, c) => c.checked).toArray().every(t => !t);
                if (noneChecked) $all.prop("checked", false)
            }
            filterCallback()
        })
    }

    return {
        add: addFilterCollected,
        filterData: collectedItemFilterData,
        registerEvents: registerCollectedFilterEvents
    }
})()


let cardCountFilter = (function () {
    let FILTERS = viewControlTypes.FILTERS
    let base = viewControlsBase
    let allControlClass = "allCountToggle"
    let otherControlsClass = "otherCountToggle"
    let checkInputControl = (groupName, controlId, sortType, moreCss, isActive) => htmler(`<input class="${groupName} ${moreCss}" type="checkbox" id="${controlId}" name="${groupName}" data-sorttype="${sortType}" ${isActive ? `checked="checked"` : ""}>`)
    let collectedFilterToggleItemFunc = (labelText, control) => base.toggleItemFunc(labelText, additionalCss(css.filter), control)
    let collectedCheckInputControl = (controlId, sortType, moreCss = otherControlsClass) => checkInputControl("countItemsFilter", controlId, sortType, moreCss, false)
    let allToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.all), collectedCheckInputControl("allCountFilterId", FILTERS.COUNT.ALL, allControlClass))
    let zero = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.zero), collectedCheckInputControl("zeroCountFilterId", FILTERS.COUNT.ZERO))
    let one = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.one), collectedCheckInputControl("oneCountFilterId", FILTERS.COUNT.ONE))
    let two = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.two), collectedCheckInputControl("twoCountFilterId", FILTERS.COUNT.TWO))
    let three = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.three), collectedCheckInputControl("threeCountFilterId", FILTERS.COUNT.THREE))
    let four = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.four), collectedCheckInputControl("fourCountFilterId", FILTERS.COUNT.FOUR))
    let fivePlus = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardCount.fivePlus), collectedCheckInputControl("moreCountFilterId", FILTERS.COUNT.MORE))
    let filterGroup = base.viewTypeControlSetFunc(generateAll(allToggle, zero, one, two, three, four, fivePlus))


    function addFilterCount(filterControls) {
        if (urlInfo.ctor.absent()) return

        filterControls.push(filterGroup)
    }

    function countItemFilterData(filters, meta) {
        filters = filters.concat($(".countItemsFilter:checked").map((index, element) => $(element).data("sorttype")).toArray());
        return {filters, meta}
    }

    function registerCollectedFilterEvents(filterCallback) {
        let $all = $(`.${allControlClass}`)
        let $other = $(`.${otherControlsClass}`)

        $all.change(function () {
            $other.prop("checked", false)
            filterCallback()
        })
        $other.change(function () {
            if (this.checked) {
                $all.prop("checked", true)
            } else {
                let noneChecked = $other.map((i, c) => c.checked).toArray().every(t => !t);
                if (noneChecked) $all.prop("checked", false)
            }
            filterCallback()
        })
    }

    return {
        add: addFilterCount,
        filterData: countItemFilterData,
        registerEvents: registerCollectedFilterEvents
    }
})()

let cardRarityFilter = (function () {
    let FILTERS = viewControlTypes.FILTERS
    let base = viewControlsBase
    let allControlClass = "allRarityToggle"
    let otherControlsClass = "otherRarityToggle"
    let checkInputControl = (groupName, controlId, sortType, moreCss, isActive) => htmler(`<input class="${groupName} ${moreCss}" type="checkbox" id="${controlId}" name="${groupName}" data-sorttype="${sortType}" ${isActive ? `checked="checked"` : ""}>`)
    let collectedFilterToggleItemFunc = (labelText, control) => base.toggleItemFunc(labelText, additionalCss(css.filter), control)
    let collectedCheckInputControl = (controlId, sortType, moreCss = otherControlsClass) => checkInputControl("rarityItemsFilter", controlId, sortType, moreCss, false)
    let allToggle = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.all), collectedCheckInputControl("allRarityilterId", FILTERS.RARITY.ALL, allControlClass))
    let special = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.special), collectedCheckInputControl("specialRarityFilterId", FILTERS.RARITY.SPECIAL))
    let mythic = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.mythic), collectedCheckInputControl("mythicRarityFilterId", FILTERS.RARITY.MYTHIC))
    let rare = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.rare), collectedCheckInputControl("rareRarityFilterId", FILTERS.RARITY.RARE))
    let uncommon = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.uncommon), collectedCheckInputControl("uncommonRarityFilterId", FILTERS.RARITY.UNCOMMON))
    let common = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.common), collectedCheckInputControl("commonRarityFilterId", FILTERS.RARITY.COMMON))
    let token = collectedFilterToggleItemFunc(i18n.get(i18n.keys.viewControls.controls.filter.cardRarity.token), collectedCheckInputControl("tokenRarityFilterId", FILTERS.RARITY.TOKEN))
    let collectedFilterGroup = base.viewTypeControlSetFunc(generateAll(allToggle, special, mythic, rare, uncommon, common, token))


    function addFilterCount(filterControls) {
        filterControls.push(collectedFilterGroup)
    }

    function countItemFilterData(filters, meta) {
        filters = filters.concat($(".rarityItemsFilter:checked").map((index, element) => $(element).data("sorttype")).toArray());
        return {filters, meta}
    }


    function registerCollectedFilterEvents(filterCallback) {
        let $all = $(`.${allControlClass}`)
        let $other = $(`.${otherControlsClass}`)

        $all.change(function () {
            $other.prop("checked", false)
            filterCallback()
        })
        $other.change(function () {
            if (this.checked) {
                $all.prop("checked", true)
            } else {
                let noneChecked = $other.map((i, c) => c.checked).toArray().every(t => !t);
                if (noneChecked) $all.prop("checked", false)
            }
            filterCallback()
        })
    }

    return {
        add: addFilterCount,
        filterData: countItemFilterData,
        registerEvents: registerCollectedFilterEvents
    }
})()



let cardBinderFilter = (function () {
    let FILTERS = viewControlTypes.FILTERS

    function showBinderControlSet() {
        return htmler(`<div class="manipulatorControlSet" style="border: 1px grey solid;">`
            + `<div class="controlItem">`
            + `<div>`
            + `<button id="binderPrev" class="binderDirPage">PREV</button>`
            + `<div id="binderPageButtons" style="display: flow"></div>`
            + `<button id="binderNext" class="binderDirPage">NEXT</button>`
            + `</div>`
            + `</div>`
            + `</div>`)
    }


    let cachedCallback = () => {}
    function createButtons() {
        if(0 < $(`#binderPage01`).length) return

        let items = $(".cardBoxes").children()
        let pages = Math.ceil(items.length / 9)
        let pageContainer = $(`#binderPageButtons`)
        for (let page = 1; page <= pages; page++) {
            let display = page < 10 ? "0" + page : page
            let button = `<button class="binderPageButton" data-page="${page}" id="binderPage${display}">${display}</button>`
            pageContainer.append(button)
        }

        $(`#binderPage01`).addClass("curPage")
        $("#binderPrev").data("page", 1)
        $("#binderNext").data("page", 2)

        $(`.binderPageButton`).click(function () {
            $(`.binderPageButton`).removeClass("curPage")
            let $this = $(this);
            $this.addClass("curPage")
            let value = parseInt($this.data("page"))
            cachedCallback()
            let prev = value - 1
            let next = value + 1
            $("#binderPrev").data("page", prev < 10 ? "0" + prev : prev)
            $("#binderNext").data("page", next < 10 ? "0" + next : next)
        })
    }
    let filterActive = false;

    function addFilterBinder(filterControls) {
        filterActive = true
        filterControls.push(showBinderControlSet())
    }

    function binderFilterData(filters, meta) {
        if(!filterActive) return {filters, meta}
        createButtons()
        filters.push(FILTERS.BINDER.YEP)
        meta[FILTERS.BINDER.YEP] = parseInt($(".curPage").data("page"))
        return {filters, meta}
    }
    function registerFilterBinderEvents(filterCallback) {
        cachedCallback = filterCallback

        $(`.binderDirPage`).click(function () {
            let value = parseInt($(this).data("page"))
            $(`#binderPage${value < 10 ? "0" + value : value}`).trigger("click")
        })
        $(document).keyup(function (event) {
            if (event.key === ',') $("#binderPrev").trigger("click")
            if (event.key === ' ') $("#binderNext").trigger("click")
        })
    }

    return {
        add: addFilterBinder,
        filterData: binderFilterData,
        registerEvents: registerFilterBinderEvents
    }
})()

let _textFilter = function (labelText, placeholderText) {
    let FILTERS = viewControlTypes.FILTERS
    let base = viewControlsBase

    let searchBoxFunc = htmler(`<div class="controlItem"><div><label for="setTextFilter">${labelText}</label><input placeholder="${placeholderText}" class="textItemFilter" data-sorttype="${FILTERS.TEXT.YEP}" id="textFilter" type="text"><div id="textFilter_clear" class="close">×</div></div></div>`)
    let textFilterGroup = base.viewTypeControlSetFunc(searchBoxFunc)

    function addFilterText(filterControls) {
        filterControls.push(textFilterGroup)
    }

    function textItemFilterData(filters, meta) {
        let $textItemFilter = $(".textItemFilter");
        filters.push($textItemFilter.data("sorttype"))
        meta[FILTERS.TEXT.YEP] = $textItemFilter.val()
        return {filters, meta}
    }

    function registerTextFilterEvents(filterCallback) {
        let $textFilter = $(`#textFilter`);
        $textFilter.keyup(debounce(function () {
            filterCallback()
        }, 250))

        function clearTextField() {
            $textFilter.focus()
            if ($textFilter.val() === "") return

            $textFilter.val("")
            filterCallback()
        }

        $(`#textFilter_clear`).click(clearTextField)

        let keyCount = 0
        $(document).keyup(function (event) {
            if (event.key !== 'Shift') return
            keyCount++
            setTimeout(function () {
                if (keyCount === 2) clearTextField()
                keyCount = 0
            }, 250)
        })
    }

    return {
        add: addFilterText,
        filterData: textItemFilterData,
        registerEvents: registerTextFilterEvents
    }
}
let setTextFilter = _textFilter(i18n.get(i18n.keys.viewControls.controls.filter.setText.label), i18n.get(i18n.keys.viewControls.controls.filter.setText.placeholder))
let cardTextFilter = _textFilter(i18n.get(i18n.keys.viewControls.controls.filter.cardText.label), i18n.get(i18n.keys.viewControls.controls.filter.cardText.placeholder))

let setFilterHtml = (function () {
    let base = viewControlsBase

    let filterControlsLabel = base.viewControlLabelFunc(i18n.get(i18n.keys.viewControls.section.filterControls));
    let controlsParentFunc = content => base.viewTypeParentFunc(content, additionalCss("filterControls"))
    let controlsInnerFunc = (content) => base.viewTypeInnerFunc(generateAll(filterControlsLabel, base.viewTypeControlSetParentFunc(content)))
    let displayCountLabel = htmler(`<div class="filteredCounts"></div>`)

    let filterControls = []
    let filterBuilder = {}

    function incFilterCollected() {
        setCollectedFilter.add(filterControls)
        return filterBuilder
    }

    filterBuilder.incCollected = incFilterCollected

    function incFilterText() {
        setTextFilter.add(filterControls)
        return filterBuilder
    }

    filterBuilder.incText = incFilterText

    function html() {
        if (filterControls.length === 0) return emptyHtml
        filterControls.push(displayCountLabel)
        return controlsParentFunc(controlsInnerFunc(generateAll(...filterControls)))
    }

    function activateFilterControls() {
        let filters = []
        let meta = {};

        ({filters, meta} = setCollectedFilter.filterData(filters, meta));
        ({filters, meta} = setTextFilter.filterData(filters, meta));

        let filterResults = _setFilterer.filter(filters, meta)


        $(`.filteredCounts`).html(i18n.get(i18n.keys.viewControls.controls.filter.showing, filterResults.shown, filterResults.total))
    }


    function registerFilterEvents() {
        setCollectedFilter.registerEvents(activateFilterControls)
        setTextFilter.registerEvents(activateFilterControls)
    }

    return {
        html: () => html().html(),
        builder: () => filterBuilder,
        registerEvents: registerFilterEvents,
        _trigger: activateFilterControls
    }
})()

let cardFilterHtml = (function () {
    let base = viewControlsBase

    let filterControlsLabel = base.viewControlLabelFunc(i18n.get(i18n.keys.viewControls.section.filterControls));
    let controlsParentFunc = content => base.viewTypeParentFunc(content, additionalCss("filterControls"))
    let controlsInnerFunc = (content) => base.viewTypeInnerFunc(generateAll(filterControlsLabel, base.viewTypeControlSetParentFunc(content)))
    let displayCountLabel = htmler(`<div class="filteredCounts"></div>`)

    let filterControls = []
    let filterBuilder = {}
    let showingBinder = false

    function incCardCount() {
        cardCountFilter.add(filterControls)
        return filterBuilder
    }

    filterBuilder.incCardCount = incCardCount

    function incText() {
        cardTextFilter.add(filterControls)
        return filterBuilder
    }

    filterBuilder.incText = incText

    function incRarity() {
        cardRarityFilter.add(filterControls)
        return filterBuilder
    }

    filterBuilder.incRarity = incRarity

    function incBinder() {
        cardBinderFilter.add(filterControls)
        showingBinder = true
        return filterBuilder
    }

    filterBuilder.incBinder = incBinder

    function html() {
        if (filterControls.length === 0) return emptyHtml
        if(!showingBinder) filterControls.push(displayCountLabel)
        return controlsParentFunc(controlsInnerFunc(generateAll(...filterControls)))
    }
    function activateFilterControls() {
        let filters = []
        let meta = {};

        ({filters, meta} = cardCountFilter.filterData(filters, meta));
        ({filters, meta} = cardTextFilter.filterData(filters, meta));
        ({filters, meta} = cardRarityFilter.filterData(filters, meta));
        ({filters, meta} = cardBinderFilter.filterData(filters, meta));

        let filterResults = _cardFilterer.filter(filters, meta)


        $(`.filteredCounts`).html(i18n.get(i18n.keys.viewControls.controls.filter.showing, filterResults.shown, filterResults.total))
    }

    function registerFilterEvents() {
        cardCountFilter.registerEvents(activateFilterControls)
        cardTextFilter.registerEvents(activateFilterControls)
        cardRarityFilter.registerEvents(activateFilterControls)
        cardBinderFilter.registerEvents(activateFilterControls)
    }

    return {
        html: () => html().html(),
        builder: () => filterBuilder,
        registerEvents: registerFilterEvents,
        _trigger: activateFilterControls
    }
})()