let manipulationsDisplay = (function (creationData) {
    let sortContainerSelector = globals.manipulations.sort.selector
    let filterContainerSelector = globals.manipulations.filter.selector
    let dangerContainerSelector = globals.manipulations.dangerZone.selector
    let displayContainerSelector = globals.manipulations.display.selector
    let sortSettings = creationData.sorting
    let filterSettings = creationData.filtering
    let dangerZoneSettings = creationData.dangerZone
    let displaySettings = creationData.displays

    function createLabel(text) {
        let direction = text === dangerZoneSettings.label ? "right" : "down"
        return `<div class="manipulatorsLabel"><span class="chevron ${direction}">${text}</span></div>`
    }

    function inputControlId(type, group, item) {
        return `${type}${group.name}${item.value}`
    }

    function showToggleControlSet(type, group) {
        let result = `<div class="manipulatorControlSet" style="border: 1px grey solid;">`
        $.each(group.values, function (index, item) {
            result += `<div class="controlItem">`
                + `<div>${item.label}</div>`
                + `<div>`
                + `<label class="toggle ${type}">`
                + `<input type="${type === "sort" ? "radio" : "checkbox"}" id="${inputControlId(type, group, item)}" name="${group.name}" ${item.checked ? `checked="checked"` : ``}/>`
                + `<span class="slider ${type}"></span>`
                + `</label>`
                + `</div>`
                + `</div>`
        })
        result += `</div>` //manipulatorControlSet
        return result
    }

    function showBinderControlSet(type, group) {
        return `<div class="manipulatorControlSet" style="border: 1px grey solid;">`
            + `<div class="controlItem">`
            + `<div>`
            + `<button id="binderPrev" class="binderDirPage">PREV</button>`
            + `<div id="binderPageButtons" style="display: flow"></div>`
            + `<button id="binderNext" class="binderDirPage">NEXT</button>`
            + `</div>`
            + `</div>`
            + `</div>`
    }

    function showTextControlSet(type, group) {
        let controlId = inputControlId(type, group, group);
        return `<div class="manipulatorControlSet" style="border: 1px grey solid;">`
            + `<div class="controlItem">`
            + `<div>`
            + `<label for="${controlId}">${group.label} </label>`
            + `<input placeholder="contains text" id="${controlId}" type="text">`
            + `<div id="${controlId}_clear" class="close">&times;</div>`
            + `</div>`
            + `</div>`
            + `</div>`
    }

    function sortOrderGroup() {
        return {
            name: "sortOrder",
            values: [
                {label: "Asc", value: ORDER.ASC, checked: sortSettings.startAsc},
                {label: "Desc", value: ORDER.DESC, checked: !sortSettings.startAsc}
            ]
        };
    }

    function showAscControls(config) {
        if (!config.showSortOrder) return ""

        return showToggleControlSet("sort", sortOrderGroup())
    }

    function dangerZoneControls(config) {
        if (!config.show) return ""
        return `<div id="dangerZone" class="manipulatorControlSet" style="display:none">`
            + `<div class="controlItem">`
            + `<div>`
            + `<button id="addOneEach" type="button">Add one of Each</button>`
            + `</div>`
            + `</div>`
            + `</div>`
            + dangerZoneModal(config)
    }

    function dangerZoneModal(config) {
        return `<div id="dangerZoneModalId" class="modal">`
            + `<div class="modal-content">`
            + `<span class="modalMessage">There's going to be a pause while this processes... It's kludged in... this will close when complete</span>`
            + `</div>`
            + `</div>`
    }

    function displayControls(config) {
        if (!config.show) return ""

        return `<div class="manipulatorControlSet">`
            + `<div class="controlItem">`
            + `<div>`
            + `<button id="toggleImageSize" type="button">Toggle Image Size</button>`
            + `</div>`
            + `</div>`
            + `</div>`
    }

    function processSettings(config, controlSetFunc, hideLabel) {
        return `<div class="manipulators">`
            + `<div class="manipulatorsInner">`
            + (!!hideLabel ? "" : createLabel(config.label))
            + `<div class="manipulatorsControls">`
            + controlSetFunc(config)
            + `</div>` //maipulatorsControls
            + `</div>` //maipulatorsInner
            + `</div>` //manipulators
    }

    function createSortRegistration() {
        let sorters = []
        let group = sortSettings.group
        $.each(group.values, function (index, item) {
            sorters.push({domId: inputControlId("sort", group, item), value: item.value})
        })

        return sorters
    }

    function createOrderRegistration() {
        let sorters = []
        let group = sortOrderGroup()
        $.each(group.values, function (index, item) {
            sorters.push({domId: inputControlId("sort", group, item), value: item.value})
        })
        return sorters
    }

    function createDangerZoneRegistration() {
        return {
            buttonSelector: "#addOneEach",
            modalSelector: "#dangerZoneModalId"
        }
    }

    function createDisplayRegistration() {
        return {
            buttonSelector: "#toggleImageSize"
        }
    }

    function createFilterRegistration() {
        let filters = []
        $.each(filterSettings.groups, function (index, group) {
            let subFilter = []
            if (group.type === "text") {
                subFilter.push({type: group.type, domId: inputControlId("text", group, group), filterValue: group.value})
            } else if (group.type === "binder") {
                subFilter.push({type: group.type, filterValue: group.value})
            } else if (group.type === "filter") {
                $.each(group.values, function (index, item) {
                    subFilter.push({type: group.type, isAll: item.isAll, domId: inputControlId("filter", group, item), filterValue: item.value})
                })
            }
            filters.push(subFilter)
        })
        return filters
    }

    function showSort() {
        $(sortContainerSelector).append(processSettings(sortSettings, function (c) {
            return showToggleControlSet("sort", c.group) + showAscControls(c)
        }))
    }

    function showFilter() {
        $(filterContainerSelector).append(processSettings(filterSettings, c => {
            if (!c) return ""
            let result = ""
            $.each(c.groups, function (index, group) {
                if (group.type === "text") result += showTextControlSet("text", group)
                if (group.type === "filter") result += showToggleControlSet("filter", group)
                if (group.type === "binder") result += showBinderControlSet("binder", group)
            })
            result += `<div class="filteredCounts"></div>`
            return result
        }, filterSettings.groups.length === 0))
    }

    function showDangerZone() {
        if (!dangerZoneSettings.show) return
        $(dangerContainerSelector).append(processSettings(dangerZoneSettings, c => {
            if (!c) return ""
            return dangerZoneControls(c)
        }))
    }

    function showDisplayControls() {
        if (!displaySettings.show) return
        $(displayContainerSelector).append(processSettings(displaySettings, c => {
            if (!c) return ""
            return displayControls(c)
        }))
    }

    function showControlLabel() {
        $(globals.manipulations.selector).prepend(`<div class="manipulatorLabel"><span class="chevron down">Controls</span></div>`)
        $(".manipulatorLabel").click(function () {
            $(this).parent().find('.manipulators').slideToggle("slow");
            $(this).find('span').toggleClass(["down", "right"])
        });
    }

    function show() {
        showControlLabel()
        showDangerZone()
        showDisplayControls()
        showSort()
        showFilter()
    }

    return {
        show: show,
        sortRegistration: createSortRegistration,
        orderRegistration: createOrderRegistration,
        filterRegistration: createFilterRegistration,
        dangerZoneRegistration: createDangerZoneRegistration,
        displayRegistration: createDisplayRegistration
    }
});


let manipulationsConfiguration = (function (defaultSettings) {
    let source = {
        sorting: {
            label: "Sort Controls",
            startAsc: true,
            group: {
                name: "sortItems",
                values: []
            }
        },
        filtering: {
            label: "Filter Controls",
            name: "filterItems",
            groups: []
        },
        dangerZone: {
            label: "Danger Zone",

        },
        displays: {
            label: "Displays",
            show: false
        }
    }
    let sort = {}


    function sortLabel(label) {
        source.sorting.label = label
        return sort
    }

    function showSortOrder(startAscending) {
        source.sorting.showSortOrder = true
        source.sorting.startAsc = !!startAscending
        defaultSettings.order = source.sorting.startAsc ? ORDER.ASC : ORDER.DESC
        return sort
    }

    function incSortAlpha(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.ALPHA
        source.sorting.group.values.push({label: "Alpha", value: SORT.TYPES.ALPHA, checked: checked})
        return sort
    }

    function incSortRelease(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.RELEASE_DATE
        source.sorting.group.values.push({label: "Release", value: SORT.TYPES.RELEASE_DATE, checked: checked})
        return sort
    }

    function incSortSetSize(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.SET_SIZE
        source.sorting.group.values.push({label: "Size", value: SORT.TYPES.SET_SIZE, checked: checked})
        return sort
    }

    function incSortSetPercent(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.PCT_COLLECTED
        source.sorting.group.values.push({label: "Set %", value: SORT.TYPES.PCT_COLLECTED, checked: checked})
        return sort
    }

    function incSortCardsCollected(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.COUNT_COLLECTED
        source.sorting.group.values.push({label: "Cards", value: SORT.TYPES.COUNT_COLLECTED, checked: checked})
        return sort
    }

    function incSortCardNumber(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.CARD_NUMBER
        source.sorting.group.values.push({label: "Card #", value: SORT.TYPES.CARD_NUMBER, checked: checked})
        return sort
    }

    function incSortCardSet(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.SET
        source.sorting.group.values.push({label: "Set", value: SORT.TYPES.SET, checked: checked})
        return sort
    }

    function incSortCardPrice(checked) {
        if (checked) defaultSettings.type = SORT.TYPES.PRICE
        source.sorting.group.values.push({label: "Price", value: SORT.TYPES.PRICE, checked: checked})
        return sort
    }

    sort.showOrder = showSortOrder
    sort.label = sortLabel
    sort.incAlpha = incSortAlpha
    sort.incRelease = incSortRelease
    sort.incSetSize = incSortSetSize
    sort.incSetPercent = incSortSetPercent
    sort.incCardsCollected = incSortCardsCollected
    sort.incCardNumber = incSortCardNumber
    sort.incCardSet = incSortCardSet
    sort.incCardPrice = incSortCardPrice

    let filter = {}

    function filterLabel(label) {
        source.filtering.label = label
        return filter
    }

    function incFilterPreviewSets() {
        source.filtering.groups.push({
            name: "filterPreview",
            type: "filter",
            values: [
                {isAll: false, value: FILTERS.TYPES.SET.PARTIAL_PREVIEW, label: "Preview Sets"}
            ]
        })
        return filter
    }

    function incFilterFoils() {
        source.filtering.groups.push({
            name: "filterFoils",
            type: "filter",
            values: [
                {isAll: true, value: FILTERS.TYPES.FOIL.ALL, label: "All"},
                {isAll: false, value: FILTERS.TYPES.FOIL.FOIL, label: "Foil"},
                {isAll: false, value: FILTERS.TYPES.FOIL.NOT, label: "Non-Foil"}
            ]
        })
        return filter
    }

    function incFilterRarity() {
        source.filtering.groups.push({
            name: "filterRarity",
            type: "filter",
            values: [
                {isAll: true, value: FILTERS.TYPES.RARITY.ALL, label: "All"},
                {isAll: false, value: FILTERS.TYPES.RARITY.MYTHIC, label: "Mythic"},
                {isAll: false, value: FILTERS.TYPES.RARITY.RARE, label: "Rare"},
                {isAll: false, value: FILTERS.TYPES.RARITY.UNCOMMON, label: "Uncommon"},
                {isAll: false, value: FILTERS.TYPES.RARITY.COMMON, label: "Common"},
                {isAll: false, value: FILTERS.TYPES.RARITY.TOKEN, label: "Token"}
            ]
        })
        return filter
    }

    function incFilterTypes() {
        source.filtering.groups.push({
            name: "filterTypes",
            type: "filter",
            values: [
                {isAll: true, value: FILTERS.TYPES.PROMO.ALL, label: "All"},
                {isAll: false, value: FILTERS.TYPES.PROMO.PROMO, label: "Promo"},
                {isAll: false, value: FILTERS.TYPES.PROMO.REGULAR, label: "Regular"},
                {isAll: false, value: FILTERS.TYPES.PROMO.EXTENDED, label: "Extended"}
            ]
        })
        return filter
    }

    function incFilterCount() {
        source.filtering.groups.push({
            name: "filterCount",
            type: "filter",
            values: [
                {isAll: true, value: FILTERS.TYPES.COUNT.ALL, label: "All"},
                {isAll: false, value: FILTERS.TYPES.COUNT.ZERO, label: "x0"},
                {isAll: false, value: FILTERS.TYPES.COUNT.ONE, label: "x1"},
                {isAll: false, value: FILTERS.TYPES.COUNT.TWO, label: "x2"},
                {isAll: false, value: FILTERS.TYPES.COUNT.THREE, label: "x3"},
                {isAll: false, value: FILTERS.TYPES.COUNT.FOUR, label: "x4"},
                {isAll: false, value: FILTERS.TYPES.COUNT.MORE, label: "x5+"}
            ]
        })
        return filter
    }

    function incFilterCollected() {
        source.filtering.groups.push({
            name: "filterCollected",
            type: "filter",
            values: [
                {isAll: true, value: FILTERS.TYPES.COLLECTED.ALL, label: "All"},
                {isAll: false, value: FILTERS.TYPES.COLLECTED.COMPLETED, label: "Completed"},
                {isAll: false, value: FILTERS.TYPES.COLLECTED.PARTIAL, label: "Collecting"},
                {isAll: false, value: FILTERS.TYPES.COLLECTED.NOT_STARTED, label: "Not Started"}
            ]
        })
        return filter
    }

    function incFilterTextBox(displayLabel) {
        let label = !!displayLabel ? displayLabel : "Text :"
        source.filtering.groups.push({
            name: "filterText",
            type: "text",
            value: FILTERS.TYPES.TEXT.YEP,
            label: label
        })
        return filter
    }

    function asFilterBinder() {
        source.filtering.groups.push({
            name: "filterAsBinder",
            type: "binder",
            value: FILTERS.TYPES.BINDER.YEP,
            label: "Pages"
        })
        return filter
    }

    filter.label = filterLabel
    filter.incFoil = incFilterFoils
    filter.incRarity = incFilterRarity
    filter.incTypes = incFilterTypes
    filter.incPreviewSets = incFilterPreviewSets
    filter.incCount = incFilterCount
    filter.incCollected = incFilterCollected
    filter.incText = incFilterTextBox
    filter.asBinder = asFilterBinder

    let massModification = {}

    function incMassManipulation(displayLabel) {
        source.dangerZone = {
            show: true,
            label: displayLabel
        }
        return massModification
    }

    massModification.incMassActions = incMassManipulation

    let display = {}

    function incDisplayControls() {
        source.displays.show = true
        return display
    }

    display.incCardSize = incDisplayControls

    //A hack to get sorting in w/o having to call "showAsc"
    defaultSettings.order = source.sorting.startAsc ? ORDER.ASC : ORDER.DESC
    return {
        sort: sort,
        filter: filter,
        dangerZone: massModification,
        displays: display,
        create: function () {
            return source
        }
    }
})

function manipulatorHelper(config, sortingActionsFunc, filterActionsFunc, dangerZoneActionsFunc, displayActionFunc) {
    let newVar = config.create();
    let manny = manipulationsDisplay(newVar)

    manny.show()

    sortingActionsFunc(manny.sortRegistration(), manny.orderRegistration())

    $.each(manny.filterRegistration(), function (index, item) {
        filterActionsFunc(item)
    })

    dangerZoneActionsFunc(manny.dangerZoneRegistration())

    displayActionFunc(manny.displayRegistration())

    $(".manipulatorsLabel").click(function () {
        let $1 = $(this);
        $1.parent().find('.manipulatorControlSet').slideToggle("slow");
        $1.find('span').toggleClass(["right", "down"])
    });
}