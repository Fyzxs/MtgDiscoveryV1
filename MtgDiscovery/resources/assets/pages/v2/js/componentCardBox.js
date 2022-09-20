let cardBoxInnerHtml = function (srcCard, configuration) {

    srcCard.releaseDate = new Date(srcCard.setReleaseDate)
    srcCard.isExtended = srcCard.isExtendedCardSet
    srcCard.isFoil = srcCard.isForcedFoilSet || (srcCard.hasFoil && !srcCard.hasNonFoil)
    srcCard.displayName = `${srcCard.name}` + (srcCard.isFoil ? " [FOIL]" : "")
    srcCard.lowerSetCode = srcCard.setCode.toLowerCase()
    srcCard.lowerRarity = srcCard.rarity.toLowerCase()
    srcCard.lowerKeyRuneCode = srcCard.keyRuneCode.toLowerCase()

    let isExcludedSet = urlInfo.set.value() === "excluded"

    function cardFront() {
        return remotePaths.cardFront(srcCard.uuid)
    }

    function cardBack() {
        return remotePaths.cardBack(srcCard.uuid)
    }


    function displayName() {
        return srcCard.isFoil ? i18n.get(i18n.keys.card.box.nameWithFoilSuffix, srcCard.name) : srcCard.name
    }

    function cssFoilTag() {
        return srcCard.isFoil && !isExcludedSet ? "foil" : "nonFoil"
    }

    function cardBoxId() {
        return `cardbox_${cssFoilTag(srcCard)}_${srcCard.uuid}`;
    }

    function createCardBoxName() {
        let linkToCardPage = urlInfo.card.absent()
        let label = displayName();
        let nameLinkpen = linkToCardPage ? `<a tabindex="-1" class="noVisit" title="${i18n.get(i18n.keys.card.box.cardPageLinkTitle, srcCard.name)}" href="/${paths.cards}${urlInfo.card.incParamStart(srcCard.name)}${urlInfo.ctor.asParam()}">` : ""
        let nameLinkClose = linkToCardPage ? `</a>` : ""
        return `<div class='ellipsis cardNameDiv' title='${label}'>`
            + nameLinkpen
            + `<strong>${label}</strong>`
            + nameLinkClose
            + `</div>`
    }

    function owned() {
        return srcCard.isFoil ? srcCard.countFoil : srcCard.countNonFoil
    }

    function createCardBoxCount() {
        if (urlInfo.ctor.absent()) return ""
        return `<div class="cardCountDiv">x<span class='cardCountSpan cardCountRarity_${srcCard.rarity}' title='${i18n.get(i18n.keys.card.box.countTitle, srcCard.name)}'>${owned()}</span></div>`
    }

    function createBuyLinks() {
        return `<div style="padding-top: 5px;">`
            + createAbuGamesLink()
            + createGeekFortressLink()
            + createCardKingdomLink()
            + `</div>`
    }

    function createCardKingdomLink() {
        let storeId = srcCard.isFoil ? srcCard.identifiers.cardKingdomFoilId : srcCard.identifiers.cardKingdomId
        let priceLatest = srcCard.isFoil ? srcCard.prices.latestFoil : srcCard.prices.latestRegular
        let priceAvg = srcCard.isFoil ? srcCard.prices.averageFoil : srcCard.prices.averageRegular
        let priceColor = "white"
        if (parseFloat(priceLatest) < (parseFloat(priceAvg) * .9)) priceColor = "lightgreen"
        if ((parseFloat(priceAvg) * 1.1) < parseFloat(priceLatest)) priceColor = "red"
        let isKnownLink = !!storeId
        let url = createCardKingdomSearchUrl()
        let img = `ck_stamp${isKnownLink ? "" : "_search"}.png`
        let alt = `${i18n.get(i18n.keys.card.box.cardKingdomAltText, displayName())}`
        return `<a class="cardkingdomlink" tabindex="-1" target="_blank" title="${alt}" alt="${alt}" href="${url}">`
            + `<img style="width: 25px;height: 25px; margin: 1px;" alt="${i18n.get(i18n.keys.card.box.cardKingdomLogoAltText)}" src="img/${img}"></a>`
            + (isKnownLink ? `<span class="cardPrice" style="padding-left: 5px; color: ${priceColor}">\$${priceLatest.toFixed(2)}</span>` : '')
    }


    function createCardKingdomSearchUrl() {
        let searchText = srcCard.name
        if (srcCard.rarity === "token") searchText += " Token"
        return remotePaths.cardKingdom.search(searchText)
    }

    function createGeekFortressLink() {
        let alt = `${i18n.get(i18n.keys.card.box.geekFortressAltText, displayName())}`
        let url = createGeekFortressSearchUrl()
        let img = "geekfortress.jpg"
        return `<a class="geekfortresslink"  tabindex="-1" target="_blank" title="${alt}" alt="${alt}" href="${url}">`
            + `<img style="width: 25px;height: 25px; margin: 1px;" alt="${i18n.get(i18n.keys.card.box.geekFortressLogoAltText)}" src="img/${img}"></a>`
    }

    function createGeekFortressSearchUrl() {
        function setAdjustment() {
            let sets = $(".setBox.itemShown")
            if (sets.length !== 1) return ""
            return " " + $(sets[0]).data("name")
        }

        function tokenAdjustment() {
            if (srcCard.rarity !== "token") return ""
            if (name.toLowerCase().includes("emblem")) return " Emblem"
            if (setAdjustment().toLowerCase().includes("token")) return ""
            return " Token"
        }

        let searchText = srcCard.name + tokenAdjustment() + setAdjustment()
        return remotePaths.geekFortress.search(searchText)
    }

    function createAbuGamesLink() {
        let alt = `${i18n.get(i18n.keys.card.box.abuGamesAltText, displayName())}`
        let url = createAbuGamesSearchUrl()
        let img = "abugames.png"
        return `<a class="abulink" tabindex="-1" target="_blank" title="${alt}" alt="${alt}" href="${url}">`
            + `<img style="width: 25px;height: 25px; margin: 1px" alt="${i18n.get(i18n.keys.card.box.abuGamesLogoAltText)}" src="img/${img}"></a>`
    }

    function createAbuGamesSearchUrl() {
        function setAdjustment() {
            let sets = $(".setBox.itemShown")
            if (sets.length !== 1) return ""
            let set = $(sets[0])
            if (set.data("imagecode") !== set.data("setcode")) return ""
            return `&magic_edition=%5B%22${set.data("name")}%22%5D`
        }

        let searchText = srcCard.name
        if (srcCard.rarity === "token") return remotePaths.abuGames.tokenSearch(searchText)
        return remotePaths.abuGames.cardSearch(searchText) + setAdjustment()
    }

    function createCardKingdomLinkUrl(storeId) {
        return remotePaths.cardKingdom.item(storeId)
    }


    function createFlipImage() {
        if (srcCard.layout !== 'modal_dfc' && srcCard.layout !== 'transform') return ""
        if (srcCard.side !== "a") return ""
        return `<div class="cardFlipper">`
            + `<img id="${cardBoxId()}_flip_img" class="cardFlipperImg" src="/img/flip.png" alt="${i18n.get(i18n.keys.card.box.flipImageAltText, displayName())}"/>`
            + `</div>`
    }

    function createCardBoxImageLowerLeftBanner() {
        return `<div style="position:absolute; bottom:0; left:0; background-color: lightblue" title="${srcCard.setName} #${srcCard.number}">`
            + `<li class="ss ss-1x ss-fw ss-${srcCard.lowerKeyRuneCode} ss-${srcCard.lowerRarity}" style="padding-left: 25px; padding-bottom: 3px;"></li>`
            + `<span class="ss-${srcCard.lowerRarity}" style="padding-right:5px">${srcCard.setCode} #${srcCard.number}</span>`
            + `</div>`;
    }

    function createCardBoxImageSrc(label) {
        let ownedModifier = ""
        if (urlInfo.ctor.available()) {
            ownedModifier = 0 === owned() ? "unownedCard" : "ownedCard"
        }
        return `<img id="${cardBoxId()}_card_img" class='cardImage croppedCard ${ownedModifier}' loading="lazy" src='${cardFront()}'  title='${label}' alt="${label}" data-backsrc="${cardBack()}" data-frontsrc='${cardFront()}' data-currentface="front" >`;
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

    function createCardBoxSetInfo() {
        if (urlInfo.set.available()) return ""

        let date = new Date(srcCard.releaseDate)
        return `<div class="cardBoxFitTwo">`
            + `<a tabindex="-1" class="noVisit subtleDisplay" title="${i18n.get(i18n.keys.card.box.artistLinksAltText, srcCard.setName)}"  href="/${paths.setCards}${urlInfo.set.incParamStart(srcCard.setCode)}${urlInfo.ctor.asParam()}">`
            + `<img class="svg setSymbol" style="width: 30px;height: 30px;" alt="${i18n.get(i18n.keys.card.box.artistLinksAltText, srcCard.setName)}" loading="lazy" src="${remotePaths.setIcon(srcCard.lowerKeyRuneCode)}">`
            + `<div style="display:inline; padding-left: 5px">${date.toLocaleString('default', {year: 'numeric', month: 'short'})}</div>`
            + `</a>`
            + `</div>`
    }

    function createCardBoxArtistInfo() {
        if (urlInfo.artist.available()) return ""

        let artists = srcCard.artist.split(' &amp; ')
        let links = ""
        for (let i = 0; i < artists.length; i++) {
            if (i > 0) links += `<span class="subtleDisplay"> &amp; </span>`
            links += `<a tabindex="-1" class="noVisit subtleDisplay" title="${i18n.get(i18n.keys.card.box.artistLinksAltText, artists[i])}"  href="/${paths.artists}${urlInfo.artist.incParamStart(artists[i])}${urlInfo.ctor.asParam()}">`
                + `<span>${artists[i]}</span>`
                + `</a>`
        }
        return `<div class="cardBoxFitTwo">`
            + links
            + `</div>`
    }

    function createCardSetArtist() {
        let links = createCardBoxSetInfo() + createCardBoxArtistInfo(0);
        let height = urlInfo.artist.absent() && urlInfo.set.absent() ? "3" : "2"
        return `<div style="height: ${height}em;">`
            + links
            + `</div>`
    }

    function cardBox() {
        if (srcCard.side !== "a" && srcCard.side !== "") return emptyHtml
        let html = "<div " +
            ` tabindex='0'` +
            ` title="${srcCard.name}"` +
            ` class="cardBox cardRarity_${srcCard.rarity} cardImageMedium"` +
            ` id='${cardBoxId()}'` +
            ` data-uuid='${srcCard.uuid}'` +
            ` data-rarity='${srcCard.rarity}'` +
            ` data-number='${srcCard.number}'` +
            ` data-isFoil='${srcCard.isFoil}'` +
            ` data-isForcedFoil='${srcCard.isForcedFoilSet}'` +
            ` data-setCode='${srcCard.lowerSetCode}'` +
            ` data-name='${srcCard.name}'` +
            ` data-ispromo='${srcCard.isPromo}'` +
            ` data-isextended='${srcCard.isExtended}'` +
            ` data-setType='${srcCard.setType}'` +
            ` data-hasFoil='${srcCard.hasFoil}'` +
            ` data-hasNonFoil='${srcCard.hasNonFoil}'` +
            ` data-price='${srcCard.isFoil ? srcCard.prices.latestFoil : srcCard.prices.latestRegular}'` +
            ">"
            + createCardBoxImage()
            + createCardSetArtist()
            + createCardBoxName()
            + createCardBoxCount()
            + createBuyLinks()
            + "</div>"
        return htmler(html)
    }


    return {all: cardBox}
}

let cardsForSetHtml = (function () {
    async function html() {
        let {value, err} = await api.data.cardsForSet(urlInfo.set.value())
        if (err !== undefined) return emptyHtml
        return `<div class="cardBoxes">${generateAll(...(value.map((s) => cardBoxInnerHtml(s).all()))).html()}</div>`
    }

    return {
        load: loader({html: html}).load
    }
})()

let cardVersionsHtml = (function () {
    async function html() {
        let {value, err} = await api.data.cardVersions(urlInfo.card.value())
        if (err !== undefined) return emptyHtml
        return `<div class="cardBoxes">${generateAll(...(value.map((s) => cardBoxInnerHtml(s).all()))).html()}</div>`
    }

    return {
        load: loader({html: html}).load
    }
})()

let artistCardsHtml = (function () {
    async function html() {
        let {value, err} = await api.data.artistCards(urlInfo.artist.value())
        if (err !== undefined) return emptyHtml
        return `<div class="cardBoxes">${generateAll(...(value.map((s) => cardBoxInnerHtml(s).all()))).html()}</div>`
    }

    return {
        load: loader({html: html}).load
    }
})()
