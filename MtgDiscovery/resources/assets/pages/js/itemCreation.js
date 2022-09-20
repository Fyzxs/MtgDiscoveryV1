let createSetItem = (function (srcSetData, primarySetCode, linkConfig) {
    let setData = srcSetData;

    let linkToAllSets = linkConfig.linkToAllSets
    let linkToSingleSet = linkConfig.linkToSingleSet
    let linkToParentSet = linkConfig.linkToParentSet

    function createSetName(set) {
        let setName = `${set.name} (${set.code})`;
        return `<div class="setName" title="${setName}">${setName}</div>`
    }

    function createSetCount(set) {
        let base = set.calculatedSetSize
        let total = set.calculatedSetSize
        let setCount = base
        let ofSet = "";
        let split = ""
        let collection = ""
        if (browserUser.userExists()) {
            ofSet = `${set.ofSet}`
            split = " / "
            collection = `<div><em><span id="collection_${set.code}">${set.collected}</span> cards collected</em></div>`
        }
        return `<div><span id="ofSet_${set.code}">${ofSet}</span>${split}${setCount}</div>${collection}`
    }

    function createSetRelease(set) {
        let date = set.date;
        return `<div class="subtleDisplay">Released: ${date.toLocaleString('default', {year: 'numeric', month: 'short'})}</div>`
    }

    function createParentSet(set) {
        let noLink = "<div >&nbsp;</div>"
        if (!linkToParentSet) return noLink
        if (!set.parentCode) return noLink
        return `<div><a class="noVisit ellipsis" href="/parentSet${setCodeQueryString(set.parentCode, "?")}${browserUser.userIdUrlQuery("&")}"><span class="parentLink">View in Parent Set (${set.parentCode})</span></a></div>`
    }

    function setCodeQueryString(code, join) {
        return `${join}setCode=${code.toLowerCase()}`
    }

    function createSetLogo(set) {
        let setCode = (set.keyruneCode.toLowerCase() === "con" ? "_" : "") + set.keyruneCode.toLowerCase()
        return `<img class="svg setSymbol" alt="${set.name}" loading="lazy" src="https://mtgdiscards.blob.core.windows.net/img/setIcons/${setCode}.svg">`
        //return `<img class="svg setSymbol" alt="${set.name}" loading="lazy" src="img/seticons/${set.actualCode.toLowerCase()}.svg">`
    }

    function createProgressBar(set) {
        if (!browserUser.userExists()) return ""

        let pct = set.pctCollected

        return `<div class="progress" style="background-color: black; margin-top: 20px;">`
            + `<div id="${set.code}_set_prog_success" class="progress-bar progress-bar-success" style="width: ${pct}%;">`
            + `<span><div id="${set.code}_prog_label" class="pct" style="display: inline-block" >${pct}</div><div style="display: inline-block">% collected!</div></span>`
            + `</div>`
            + `<div id="${set.code}_set_prog_danger" class="progress-bar progress-bar-danger" style="width: ${100 - pct}%;">`
            + `</div>`
            + `</div><br>`
    }

    function createLinkToSet(includeInLink, set) {
        if (!linkToSingleSet) return includeInLink
        return `<a class="noVisit" href="/set${setCodeQueryString(set.code, "?")}${browserUser.userIdUrlQuery("&")}">`
            + includeInLink
            + `</a>`
    }

    function createLinkToAllSets() {
        if (!linkToAllSets) return ""
        if (primarySetCode.toLowerCase() !== setData.lowerCaseCode) return ""
        let linkText = browserUser.userExists() ? `to ${browserUser.displayName()}'s collection` : "back to sets"
        return `<div class="parentLink ellipsis"><a title="${linkText}" href="/allSets${browserUser.userIdUrlQuery("?")}"><h3>${linkText}</h3></a></div>`
    }

    function setBoxCore(set) {
        return createSetName(set)
            + createSetRelease(set)
            + createSetLogo(set)
    }

    function setTypeBanner(set) {
        return ""
        // return `<div class="setType ${set.actualType}">`
        // + `<span>${set.actualType}</span>`
        // + `</div>`
    }

    function setBox() {
        let set = setData
        return `<div id="${set.lowerCaseCode}_container" class="setBox"`
            + ` data-setcode="${set.lowerCaseCode}"`
            + ` data-calculatedsetsize="${set.calculatedSetSize}"`
            + ` data-date='${set.date.getTime()}'`
            + ` data-pctcollected='${set.pctCollected}'`
            + ` data-name='${set.name}'`
            + ` data-countcollected='${set.collected}'`
            + ">"
            + createLinkToSet(setBoxCore(set), set)
            + createSetCount(set)
            + createParentSet(set)
            + createProgressBar(set)
            + createLinkToAllSets(set)
            + setTypeBanner(set)
            + `</div>`
    }


    var cachedBox = undefined

    function cachingBox() {
        if (cachedBox === undefined) cachedBox = setBox()
        return cachedBox
    }

    return {
        element: cachingBox,
        name: setData.name,
        date: setData.date,
        calculatedSetSize: setData.calculatedSetSize,
        pctCollected: setData.pctCollected
    }
});

let createCardItem = (function (srcCardData) {
    let cardData = JSON.parse(JSON.stringify(srcCardData));
    let isExcludedSet = browserCode()?.toLowerCase() === "excluded"

    function scryfallImageSrc() {
        return `https://api.scryfall.com/cards/${cardData.identifiers.scryfallId}?format=image`
    }

    function localImageFront() {
        return `https://mtgdiscards.blob.core.windows.net/img/cards/${cardData.uuid}.jpg`
        //return `/img/downloads/${cardData.setCode}/${cardData.uuid}.jpg`
    }

    function localImageBack() {
        return `https://mtgdiscards.blob.core.windows.net/img/cards/${cardData.uuid}_back.jpg`
        //return `/img/downloads/${cardData.setCode}/${cardData.uuid}_back.jpg`
    }

    function cssFoilTag() {
        return cardData.isFoil && !isExcludedSet ? "foil" : "nonFoil"
    }

    function displayName() {
        return `${cardData.name}` + (cardData.isFoil ? " [FOIL]" : "")
    }

    function cardBoxId() {
        return `cardbox_${cssFoilTag(cardData)}_${cardData.uuid}`;
    }

    function createCardBoxName() {
        let label = displayName();
        let nameLinkpen = globals.cards.linkName ? `<a tabindex="-1" class="noVisit" title="Link to ${cardData.name} versions"  href="/cards${setQueryString("?", "cardName", cardData.name, "?")}${browserUser.userIdUrlQuery("&")}">` : ""
        let nameLinkClose = globals.cards.linkName ? `</a>` : ""
        return `<div class='ellipsis cardNameDiv' title='${label}'>`
            + nameLinkpen
            + `<strong>${label}</strong>`
            + nameLinkClose
            + `</div>`
    }

    function owned() {
        return cardData.isFoil ? cardData.countFoil : cardData.countNonFoil
    }

    function createCardBoxCount() {
        if (!browserUser.userExists()) return ""//If we don't have a user, don't show the count
        return `<div class="cardCountDiv">x<span class='cardCountSpan cardCountRarity_${cardData.rarity}' title='${cardData.name} Count'>${owned()}</span></div>`
    }

    function createBuyLinks(){
        return `<div style="padding-top: 5px;">`
            + createGeekFortressLink()
            + createCardKingdomLink()
            + `</div>`
    }

    function createCardKingdomLink() {
        let storeId = cardData.isFoil ? cardData.identifiers.cardKingdomFoilId : cardData.identifiers.cardKingdomId
        let priceLatest = cardData.isFoil ? cardData.prices.latestFoil : cardData.prices.latestRegular
        let priceAvg = cardData.isFoil ? cardData.prices.averageFoil : cardData.prices.averageRegular
        let priceColor = "white"
        if (parseFloat(priceLatest) < (parseFloat(priceAvg) * .9)) priceColor = "lightgreen"
        if ((parseFloat(priceAvg) * 1.1) < parseFloat(priceLatest)) priceColor = "red"
        let isKnownLink = !!storeId
        let url = isKnownLink ? createCardKingdomLinkUrl(storeId) : createCardKingdomSearchUrl()
        let img = `ck_stamp${isKnownLink ? "" : "_search"}.png`
        let alt = `Link to Card Kingdom for ${displayName()}`
        // return `<div style="padding-top: 5px;" title="${alt}" alt="${alt}">`
        //     + `<a tabindex="-1" target="_blank"  href="${url}">`
            return `<a tabindex="-1" target="_blank" title="${alt}" alt="${alt}" href="${url}">`
            + `<img style="width: 25px;height: 25px;" alt="Card Kingdom Logo" src="img/${img}"></a>`
            + (isKnownLink ? `<span class="cardPrice" style="padding-left: 5px; color: ${priceColor}">\$${priceLatest.toFixed(2)}</span>` : '')
            //+ `</div>`
        //return `<div style="padding-top: 5px;"><a tabindex="-1" target="_blank" href="https://www.cardkingdom.com/catalog/item/${storeId}"><img style="width: 25px;height: 25px;" alt="link to cardkingdom" src="https://static.cardkingdom.com/media/images/web/ck_stamp.png"></a></div>`
    }


    function createCardKingdomSearchUrl() {
        let searchText = cardData.name
        if (cardData.rarity === "token") searchText += " Token"
        return `https://www.cardkingdom.com/catalog/search?filter[name]=%22${searchText}%22`
    }
    function createGeekFortressLink() {
        let alt = `Link to Geek Fortress for ${displayName()}`
        let url = createGeekFortressSearchUrl()
        let img = "geekfortress.jpg"
        // return `<div style="padding-top: 5px;" title="${alt}" alt="${alt}">`
        //     + `<a tabindex="-1" target="_blank" href="${url}">`
        return `<a tabindex="-1" target="_blank" title="${alt}" alt="${alt}" href="${url}">`
            + `<img style="width: 25px;height: 25px;" alt="Geek Fortress Logo" src="img/${img}"></a>`
            //+ `</div>`
    }

    function createGeekFortressSearchUrl() {
        let searchText = cardData.name
        if (cardData.rarity === "token") searchText += " Token"
        return `https://geekfortressgames.crystalcommerce.com/advanced_search?search%5Bfuzzy_search%5D=${searchText}&search%5Bin_stock%5D=1`
    }

    function createCardKingdomLinkUrl(storeId) {
        return `https://www.cardkingdom.com/catalog/item/${storeId}`
    }


    function createFlipImage() {
        if (cardData.layout !== 'modal_dfc' && cardData.layout !== 'transform') return ""
        if (cardData.side !== "a") return ""
        return `<div class="cardFlipper">`
            + `<img id="${cardBoxId()}_flip_img" class="cardFlipperImg" src="/img/flip.png" alt="Flip Card"/>`
            + `<img loading="lazy" src="${scryfallImageSrc(cardData)}&face=back" alt="hidden_backface_loader" style="display: none" >`
            + `</div>`
    }

    function createCardBoxImageLowerLeftBanner() {
        return `<div style="position:absolute; bottom:0; left:0; background-color: lightblue">`
            + `<li class="ss ss-1x ss-fw ss-${cardData.keyRuneCode.toLowerCase()} ss-${cardData.rarity.toLowerCase()}" style="padding-left: 25px; padding-bottom: 3px;"></li>`
            + `<span class="ss-${cardData.rarity.toLowerCase()}" style="padding-right:5px">${cardData.setCode} #${cardData.number}</span>`
            + `</div>`;
    }

    function createCardBoxImageSrc(label) {
        return `<img  id="${cardBoxId()}_card_img" class='cardImage croppedCard' loading="lazy" src='${localImageFront()}'  title='${label}' alt="${label}" data-backsrc="${localImageBack()}" data-frontsrc='${localImageFront()}' data-currentface="front" >`;
        //return + `<img  id="${cardBoxId()}_card_img" class='cardImage croppedCard' loading="lazy" src='${scryfallImageSrc()}' title='${label}' alt="${label}" data-backsrc="${scryfallImageSrc()}&face=back" data-frontsrc='${scryfallImageSrc()}' data-currentface="front" >`
    }

    function createCardBoxImage() {
        let tag = cssFoilTag()
        let label = displayName();
        return `<div class='cardImageDiv ${tag}'>`
            + createCardBoxImageSrc(label)
            + createFlipImage()
            + createCardBoxImageLowerLeftBanner()
            + `</div>`
    }

    function setQueryString(join, key, value) {
        return `${join}${key}=${value.toLowerCase()}`
    }

    function createCardBoxSetInfo() {
        if (!globals.cards.showSet && browserCode() !== "excluded") return ""
        let date = new Date(cardData.releaseDate)
        return `<div class="cardBoxFitTwo">`
            + `<a tabindex="-1" class="noVisit subtleDisplay" title="Link to ${cardData.setCode} set"  href="/set${setQueryString("?", "setCode", cardData.setCode)}${browserUser.userIdUrlQuery("&")}">`
            + `<img class="svg setSymbol" style="width: 30px;height: 30px;" alt="${cardData.setName}" loading="lazy" src="https://mtgdiscards.blob.core.windows.net/img/setIcons/${cardData.keyRuneCode.toLowerCase()}.svg">`
            + `<div style="display:inline; padding-left: 5px">${date.toLocaleString('default', {year: 'numeric', month: 'short'})}</div>`
            + `</a>`
            + `</div>`
    }

    function createCardBoxArtistInfo() {
        if (!globals.cards.showArtist) return ""
        let artists = cardData.artist.split(' &amp; ')
        let links = ""
        for (let i = 0; i < artists.length; i++) {
            if (i > 0) links += `<span class="subtleDisplay"> &amp; </span>`
            links += `<a tabindex="-1" class="noVisit subtleDisplay" title="Link to ${artists[i]} cards"  href="/artist${setQueryString("?", "artist", artists[i], "?")}${browserUser.userIdUrlQuery("&")}">`
                + `<span>${artists[i]}</span>`
                + `</a>`
        }
        (links)
        return `<div class="cardBoxFitTwo">`
            + links
            + `</div>`
    }

    function createCardSetArtist() {
        let links = createCardBoxSetInfo() + createCardBoxArtistInfo(0);
        let height = globals.cards.showArtist && globals.cards.showSet ? "3" : "2"
        return `<div style="height: ${height}em;">`
            + links
            + `</div>`
    }

    function cardBox() {
        if (cardData.side !== "a" && cardData.side !== "") return ""
        let id = `cardBox cardRarity_${cardData.rarity} cardImageMedium`
        return "<div " +
            ` tabindex='0'` +
            ` title="${cardData.name}"` +
            ` class='cardBox cardRarity_${cardData.rarity} cardImageMedium'` +
            ` id='${cardBoxId()}'` +
            ` data-uuid='${cardData.uuid}'` +
            ` data-rarity='${cardData.rarity}'` +
            ` data-number='${cardData.number}'` +
            ` data-isFoil='${cardData.isFoil}'` +
            ` data-isForcedFoil='${cardData.isForcedFoilSet}'` +
            ` data-setCode='${cardData.lowerSetCode}'` +
            ` data-name='${cardData.name}'` +
            ` data-ispromo='${cardData.isPromo}'` +
            ` data-isextended='${cardData.isExtended}'` +
            ` data-setType='${cardData.setType}'` +
            ` data-id='${id}'` +
            ` data-hasFoil='${cardData.hasFoil}'` +
            ` data-hasNonFoil='${cardData.hasNonFoil}'` +
            ` data-price='${cardData.isFoil ? cardData.prices.latestFoil : cardData.prices.latestRegular}'` +
            ">"
            + createCardBoxImage()
            + createCardSetArtist()
            + createCardBoxName()
            + createCardBoxCount()
            + createBuyLinks()
            + "</div>"
    }

    var cachedCardBox = undefined

    function cachingCardBox() {
        if (cachedCardBox === undefined) cachedCardBox = cardBox()
        return cachedCardBox
    }

    let lowerCaseSetCode = cardData.lowerSetCode
    let lowerCaseRarity = cardData.rarity.toLowerCase()
    return {
        element: cachingCardBox,
        registerEvents: cardUpdater(cardData, cardBoxId()).registerEvents,
        setCode: lowerCaseSetCode,
        isPromo: cardData.isPromo,
        rarity: lowerCaseRarity,
        isFoil: cardData.isFoil,
        name: cardData.name,
        number: cardData.number
    }
});

const navigateGrid = (gridSelector, activeClass, direction) => {
    const grid = document.querySelector(gridSelector);
    const active = grid.querySelector(`${activeClass}`);
    const gridChildren = Array.from(grid.children);
    const activeIndex = gridChildren.indexOf(active);

    const gridNum = gridChildren.length;
    let offSetItem = undefined
    for (let i = 0; i < gridNum; i++) {
        let temp = gridChildren[i]
        let item = $(temp)
        if (!item.hasClass("itemShown")) continue

        offSetItem = temp
        break
    }
    if (offSetItem === undefined) return

    const baseOffset = offSetItem.offsetTop;
    const breakIndexInitial = gridChildren.findIndex(item => item.offsetTop > baseOffset);
    let hiddenChildren = 0
    for (let x = 0; x < breakIndexInitial; x++) {
        if ($(gridChildren[x]).hasClass("itemHidden")) {
            hiddenChildren++
        }
    }
    let breakIndex = breakIndexInitial - hiddenChildren

    const numPerRow = (breakIndex === -1 ? gridNum : breakIndex);

    const updateActiveItem = (curIndex, moveCount, activeClass) => {
        let moved = 0
        let hiddenCount = 0
        let stepDirection = moveCount < 0 ? -1 : 1
        let champion = undefined
        let movedCheck = moveCount < 0 ? -moveCount : moveCount
        let startIndex = curIndex + stepDirection
        while (moved < movedCheck && hiddenCount <= gridChildren.length) {
            let nextStep = (moved + hiddenCount) * stepDirection
            let curIndex = startIndex + nextStep
            if (gridNum <= curIndex) break
            let challenger = $(gridChildren[curIndex])
            if (!challenger.hasClass("itemShown")) {
                hiddenCount++
                continue;
            }
            moved++
            champion = challenger
        }
        if (champion !== undefined) champion.focus()
    }

    const isTopRow = activeIndex <= numPerRow - 1;
    const isBottomRow = activeIndex >= gridNum - numPerRow;
    const isLeftColumn = activeIndex % numPerRow === 0;
    const isRightColumn = activeIndex % numPerRow === numPerRow - 1 || activeIndex === gridNum - 1;
    switch (direction) {
        case "up":
            if (!isTopRow)
                updateActiveItem(activeIndex, -numPerRow, activeClass);
            break;
        case "down":
            if (!isBottomRow)
                updateActiveItem(activeIndex, numPerRow, activeClass);
            break;
        case "left":
            if (0 < activeIndex)
                updateActiveItem(activeIndex, -1, activeClass);
            break;
        case "right":
            if (activeIndex + 1 < gridNum)
                updateActiveItem(activeIndex, 1, activeClass);
            break;
    }
}

let cardUpdater = (function (cardData, cardBoxId) {

    /* BEG REGION CARD UPDATE */

    function isCardAdjustmentInput(e) {
        var key = e.keyCode;
        return 48 <= key && key <= 57 // Keyboard
            || 96 <= key && key <= 105 //num pad
    }

    function isCardAdjustmentModifier(e) {
        var key = e.key;
        return key === "-" || key === "+";
    }

    var eventsRegistered = false

    function cardBoxEvents() {
        if (eventsRegistered) return;
        eventsRegistered = true;

        function createPayloadData(cardData, count) {
            return {
                userUuid: browserUser.userId()
                , cardUuid: cardData.uuid
                , isForcedExtendedSet: cardData.isExtendedCardSet
                , isForcedFoilSet: cardData.isForcedFoilSet
                , isFoilOnly: cardData.hasFoil && !cardData.hasNonFoil
                , setCode: cardData.setCode
                , setType: cardData.setType
                , count: count
            };
        }

        function countUpdates() {
            let container = $(`#${cardBoxId}`)
            var persistedInputTracker = ""
            container.keyup(function (e) {
                /* nav by arrows */
                let direction = undefined
                switch (e.keyCode) {
                    case 37:
                        direction = "left"
                        break
                    case 38:
                        direction = "up"
                        break
                    case 39:
                        direction = "right"
                        break
                    case 40:
                        direction = "down"
                        break

                }
                if (direction !== undefined) {
                    navigateGrid(".cardBoxes", ".cardBox:focus", direction)
                    return
                }

                /**/

                if (isCardAdjustmentInput(e)) persistedInputTracker += e.key
                if (isCardAdjustmentModifier(e)) persistedInputTracker = e.key
                if (e.keyCode === 46 || e.keyCode === 110) persistedInputTracker = ""
                if (e.keyCode === 13) {
                    if (persistedInputTracker === "") {
                        toasts.failure("No quantity entered")
                        return
                    }
                    let payload = createPayloadData(cardData, persistedInputTracker)
                    updateCardsToServer.massUpdate([payload], [cardData], function () {
                    })
                    persistedInputTracker = "";
                }
            });

            container.focus(function () {
                persistedInputTracker = ""
            });
        }

        function imageFlip() {
            if (cardData.side !== "a") return

            let container = $(`#${cardBoxId}_flip_img`)
            container.click(function () {
                let img = $(`#${cardBoxId}_card_img`)
                if (img.data("currentface") === "front") {
                    img.attr("src", img.data("backsrc"))
                    img.data("currentface", "back")
                } else if (img.data("currentface") === "back") {
                    img.data("currentface", "front")
                    img.attr("src", img.data("frontsrc"))
                }
            })
        }

        function scrollIntoView() {
            let container = $(`#${cardBoxId}`)
            container.focus(function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: container.offset().top - (window.innerHeight / 2) + (container.height() / 2)
                }, 100);
            })
        }

        countUpdates();
        imageFlip();
        scrollIntoView();
    }

    return {
        registerEvents: cardBoxEvents
    }
    /* END REGION CARD UPDATE */
})

let updateCardsToServer = (function () {

    function canNotSendRequest() {
        let hasFailure = false
        if (!loggedInUser.authenticates()) {
            toasts.failure("You are not logged in - Can't update").showToast()
            hasFailure = true
        }
        if (browserUser.userId() !== loggedInUser.userId()) {
            toasts.failure("Cannot update another users collection... yet").showToast()
            hasFailure = true
        }
        return hasFailure;
    }

    function processMassUpdate(payload, updateData, alwaysFunction) {
        if (canNotSendRequest()) {
            alwaysFunction()
            return
        }

        return $.ajax({
            type: "PUT",
            url: "/api/v1/user/collection/massupdate",
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            },
            data: JSON.stringify(payload),
            success: function () {
                $.each(updateData, function (index, data) {
                    toasts.success(`[${data.name}] successfully updated!`).showToast()
                    cardUpdateRefreshUi.doUpdate(data, payload[index].count)
                })
            }
        })
            .fail(function () {
                toasts.failure(`Update  Failed`).showToast()
            })
            .always(alwaysFunction)
    }

    return {
        massUpdate: processMassUpdate
    }
})()

let cardUpdateRefreshUi = (function () {
    function updateCardCount(cardData, updatedCount) {
        let container = $(globals.cards.card.selector(cardData))

        updateElements(cardData, updatedCount)

        let delay = 300
        container.fadeOut(delay / 2).fadeIn(delay).fadeOut(delay / 2).fadeIn(delay);
    }

    function zeroProtection(count) {
        return count < 0 ? 0 : count
    }

    function updateCard(ctrl, count) {
        ctrl.html(count)
    }

    function updateElements(cardData, updatedCount) {
        function updateSets(isAdded, isRemoved) {
            let setCodes = []
            setCodes.push(cardData.setCode)
            if (cardData.isExtendedCardSet) setCodes.push(cardData.setCode + "-E")
            if (cardData.isForcedFoilSet || (cardData.hasFoil && !cardData.hasNonFoil)) setCodes.push(cardData.setCode + "-F")
            if (setCodes.length === 3) setCodes.push(cardData.setCode + "-E-F")

            $.each(setCodes, function (index, setCode) {
                if (isAdded || isRemoved) {
                    //Update the Set Collected Counter
                    let $ofSet = $(`#ofSet_${setCode}`);
                    let collectionCount = zeroProtection(parseInt($ofSet.html()) + (isAdded ? 1 : -1))
                    $ofSet.html(collectionCount)

                    //Update the Progress Bar
                    let $container = $(`#${setCode.toLowerCase()}_container`);
                    if ($container.length === 0) return

                    let setSize = $container.data("calculatedsetsize")
                    let pct = Math.round(collectionCount / setSize * 100)
                    let collectedBar = $container.find(`#${setCode}_set_prog_success`)
                    let pendingBar = $container.find(`#${setCode}_set_prog_danger`)
                    let label = $container.find(`#${setCode}_prog_label`)
                    collectedBar.css("width", `${pct}%`)
                    pendingBar.css("width", `${100 - pct}%`)

                    label.html(`${pct}`)
                }

                //Update the total collected
                let $collected = $(`#collection_${setCode}`)
                if ($collected.length === 0) return
                let collectedCount = zeroProtection(parseInt($collected.html()) + parseInt(updatedCount))
                $collected.html(collectedCount)
            })
        }


        let countControl = $(`${globals.cards.card.selector(cardData)} > .cardCountDiv > .cardCountSpan`)
        let currentCount = parseInt(countControl.html())
        let modificationAmount = parseInt(updatedCount)
        let isNewToCollection = currentCount === 0
        let combinedCount = zeroProtection(currentCount + modificationAmount)
        let isRemovedFromCollection = combinedCount <= 0


        updateCard(countControl, combinedCount)

        updateSets(isNewToCollection, isRemovedFromCollection)
    }

    return {
        doUpdate: updateCardCount
    }
})()


let toasts = (function () {
    function countUpdateSuccessToast(msg) {
        return Toastify({
            text: msg,
            duration: 10 * 1000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
        });
    }

    function countUpdateFailedToast(msg) {
        return Toastify({
            text: msg,
            duration: 10 * 1000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
        });
    }

    return {
        success: countUpdateSuccessToast,
        failure: countUpdateFailedToast
    }
})()

let createCollectionItem = (function (collectionSummary) {

    let counts = collectionSummary

    function isUserInfo() {
        return browserUser.userExists()
    }

    function createUserCollection() {
        return `<div class="countInCollection summary-bar-container">`
            + `<span class="collectionCount">${counts.collectionCount} cards in collection</span>`
            + `<span class="collectionCountNoBasic">${counts.collectionCountNoBasic} excluding Basic Lands</span>`
            + `</div>`
    }

    function createUserPctOfCards() {
        let setCardsCount = counts.collectionSetCardCount
        let cardsPct = Math.round(setCardsCount / counts.totalCardCount * 100)
        return `<div class="pctOfCardsCollected summary-bar-container">`
            + `<div class="summary-bar-wrapper">`
            + `<div class="summary-bar summary-bar-success" style="width: ${cardsPct}%;">`
            + `<span>Collected (${setCardsCount}) ${cardsPct}% of (${counts.totalCardCount}) cards</span>`
            + `</div>`
            + `<div class="summary-bar summary-bar-danger" style="width: ${100 - cardsPct}%;"></div>`
            + `</div>`
            + `</div>`
    }

    function createUserPctOfSets() {
        let cardsPct = Math.round(counts.completedSets / counts.totalSets * 100)
        return `</div>`
            + `<div class="pctOfSetsCollected summary-bar-container">`
            + `<div class="summary-bar-wrapper">`
            + `<div class="summary-bar summary-bar-success" style="width: ${cardsPct}%;">`
            + `<span> (${counts.completedSets}) complete set${counts.completedSets > 1 ? "s" : ""} is ${cardsPct}% of (${counts.totalSets}) sets</span>`
            + `</div>`
            + `<div class="summary-bar summary-bar-danger" style="width: ${100 - cardsPct}%;"></div>`
            + `</div>`
            + `</div>`;
    }

    function createUserSummary() {
        if (!isUserInfo()) return ""
        return createUserCollection()
            + createUserPctOfCards()
            + createUserPctOfSets()
    }

    function totalCardsSummary() {
        return `<div class="countInCollection summary-bar-container">`
            + `<span class="collectionCount">${counts.totalCardCount} cards in system</span>`
            + `</div>`
    }

    function createNonUserSummary() {
        if (isUserInfo()) return ""

        return totalCardsSummary()
    }

    function summaryBox() {
        return createUserSummary() + createNonUserSummary()
    }

    var cachedBox = undefined

    function cachingBox() {
        if (cachedBox === undefined) cachedBox = summaryBox()
        return cachedBox
    }

    return {
        element: cachingBox,
    }
})