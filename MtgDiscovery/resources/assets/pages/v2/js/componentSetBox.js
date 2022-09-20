let _setBoxInnerHtml = (function (srcSet, startVis=true) {

    srcSet.date = new Date(srcSet.releaseDate)
    srcSet.pctCollected = parseInt(srcSet.ofSet / srcSet.calculatedSetSize * 100)
    srcSet.lowerCaseCode = srcSet.code.toLowerCase()
    srcSet.lowerCaseKeyruneCode = srcSet.keyruneCode.toLowerCase()
    srcSet.displayDate = srcSet.date.toLocaleString('default', {year: 'numeric', month: 'short'})
    srcSet.displayText = `${srcSet.name} (${srcSet.code})`
    srcSet.imageCode = srcSet.lowerCaseKeyruneCode
    srcSet.isParentSet = !!srcSet.parentCode
    srcSet.hasParentSet = !srcSet.isParentSet

    const createDataAttributesFunc = () => `data-imagecode="${srcSet.imageCode}" data-setcode="${srcSet.lowerCaseCode}"` + ` data-calculatedsetsize="${srcSet.calculatedSetSize}"` + ` data-date='${srcSet.date.getTime()}'` + ` data-pctcollected='${srcSet.pctCollected}'` + ` data-name='${srcSet.name}'` + ` data-countcollected='${srcSet.collected}'`
    const parentLink = htmler(srcSet.hasParentSet ? `<div class="invisible">spacer</div>` : `<div><a class="noVisit ellipsis" href="/${paths.parentBlock}${urlInfo.set.incParamStart(srcSet.parentCode)}${urlInfo.ctor.asParam()}"><span class="parentLink">${i18n.get(i18n.keys.set.box.viewInParentSet, srcSet.parentCode)}</span></a></div>`)
    const name = htmler(`<div class="setName" title="${srcSet.displayText}">${srcSet.displayText}</div>`)
    const release = htmler(`<div class="subtleDisplay">${i18n.get(i18n.keys.set.box.releaseDate, srcSet.displayDate)}</div>`)
    const logo = htmler(`<img class="svg setSymbol" alt="${srcSet.name}" loading="lazy" src="${remotePaths.setIcon(srcSet.imageCode)}">`)
    const linkContents = generateAll(name, release, logo)
    const linkToSet = htmler(`<a class="noVisit" href="/${paths.setCards}${urlInfo.set.incParamStart(srcSet.lowerCaseCode)}${urlInfo.ctor.asParam()}">${linkContents.html()}</a>`)

    function setCompletionCss() {
        if (srcSet.pctCollected === 100) return "setCompleted"
        if (srcSet.pctCollected >= 70) return "setToBinderify"
        return ""
    }
    function setVisibility(){
        return startVis ? "" : "itemHidden"
    }

    const setBoxFunc = (contents) => htmler(`<div id="i_set_${srcSet.lowerCaseCode}" class="setBox itemShown ${setCompletionCss()} ${setVisibility()}" ${createDataAttributesFunc()}>${contents.html()}</div>`)

    const setCount = () => {
        let hasCollector = urlInfo.ctor.available()
        let ofSet = hasCollector ? srcSet.ofSet : ""
        let split = hasCollector ? i18n.get(i18n.keys.set.box.cardsCollectedDivider) : ""
        let collection = hasCollector ? `<div><em>${i18n.get(i18n.keys.set.box.cardsCollected, srcSet.lowerCaseCode, srcSet.collected)}</em></div>` : ""
        let setInfo = hasCollector ? i18n.get(i18n.keys.set.box.percentSetCollected, srcSet.lowerCaseCode, ofSet, split, srcSet.calculatedSetSize) : i18n.get(i18n.keys.set.box.cardsInSet, srcSet.lowerCaseCode, srcSet.calculatedSetSize)
        return htmler(`<div>${setInfo}</div>${collection}`)
    }
    const progressBar = urlInfo.ctor.absent()
        ? emptyHtml
        : htmler(`<div class="progress" style="background-color: black; margin-top: 20px;">`
            + `<div id="${srcSet.lowerCaseCode}_set_prog_success" class="progress-bar progress-bar-success" style="width: ${(srcSet.pctCollected)}%;">`
            + `<span><div id="${srcSet.lowerCaseCode}_prog_label" class="pct" style="display: inline-block" >${(srcSet.pctCollected)}</div><div style="display: inline-block">% collected!</div></span>`
            + `</div>`
            + `<div id="${srcSet.lowerCaseCode}_set_prog_danger" class="progress-bar progress-bar-danger" style="width: ${100 - srcSet.pctCollected}%;">`
            + `</div>`
            + `</div><br>`);


    async function linkToAllSetsFunc() {
        if (urlInfo.set.absent()) return emptyHtml

        let linkText = urlInfo.ctor.available() ? i18n.get(i18n.keys.set.box.backToCollectorSets, (await user.collectorUser.name()).value) : i18n.get(i18n.keys.set.box.backToSets)
        return htmler(`<div class="parentLink ellipsis"><a title="${linkText}" href="/${paths.sets}${urlInfo.ctor.asParamStart()}"><h3>${linkText}</h3></a></div>`)
    }

    function all() {
        //parentLink
        return setBoxFunc(generateAll(linkToSet, setCount(), progressBar))
    }

    async function cards() {
        //parentLink
        return setBoxFunc(generateAll(linkToSet, setCount(), progressBar, await linkToAllSetsFunc()))
    }

    return {all, cards}
})

let _setBoxOuterHtml = (function (srcSets) {
    let innerGen = generateAll(...(srcSets.map((s) => _setBoxInnerHtml(s, false).all())));
    let srcSet=srcSets[0]
    const createDataAttributesFunc = () => `data-imagecode="${srcSet.imageCode}" data-setcode="${srcSet.lowerCaseCode}"` + ` data-calculatedsetsize="${srcSet.calculatedSetSize}"` + ` data-date='${srcSet.date.getTime()}'` + ` data-pctcollected='${srcSet.pctCollected}'` + ` data-name='${srcSet.name}'` + ` data-countcollected='${srcSet.collected}'`
    return htmler(`<div id="set_${srcSet.lowerCaseCode}" class="setBox itemShown" ${createDataAttributesFunc(srcSets[0])} style="width: 590px;">`//Outer box needs own css
        + `<div class="setBox itemShown">`
        + generateAll(...(srcSets.map((s) => _setBoxOuterBoxLabel(s)))).html()
        + `</div>`
        + `<div>`
        + innerGen.html()
        + `</div>`
        + `</div>`)
})

let _setBoxOuterBoxLabel = (function (srcSet) {
    return htmler(`<div class="setName" title="${srcSet.displayText}">${srcSet.displayText}</div>`)
})

let allSetBoxesHtml = (function () {
    async function html() {
        let {value, err} = await api.data.allSets()
        if (err !== undefined) return emptyHtml
        value = value.sort((a, b) => {
            let result = a.combineCode.localeCompare(b.combineCode)
            if (result !== 0) return result;
            return a.code === a.combineCode ? -1 : 1
        });
        return `<div class="innerSetContainer">${generateAll(...(value.map((s) => _setBoxInnerHtml(s).all()))).html()}</div>`
    }

    return loader({html: html})
})()

let allSetBoxesHtml2 = (function () {
    async function html() {
        let {value, err} = await api.data.allSets()
        if (err !== undefined) return emptyHtml
        let result = value.reduce(function (map, obj) {
            if (!map.has(obj.combineCode)) map.set(obj.combineCode, []);
            let arr = map.get(obj.combineCode);
            if (obj.code === obj.combineCode) arr.unshift(obj)
            else arr.push(obj)
            return map;
        }, new Map());

        function boxes(theMap) {
            let gen = [];
            theMap.forEach((s) => gen.push( _setBoxOuterHtml(s)));
            return gen;
        }

        return `<div class="innerSetContainer">${generateAll(...boxes(result)).html()}</div>`
    }

    return loader({html: html})
})()


let singleSetBoxHtml = (function () {
    async function html() {
        let {value, err} = await api.data.singleSet(urlInfo.set.value())
        if (err !== undefined) return emptyHtml
        let boxes = await Promise.all(await value.map(async (s) => await _setBoxInnerHtml(s).cards()))
        return `<div class="innerSetContainer">${generateAll(...boxes).html()}</div>`
    }

    return loader({html: html})
})()

