
let collectorInfoHtml = (function(){
    let html = function() {
        let cards = $(".cardBoxes").children()
        if (urlInfo.ctor.absent()) return

        let rarityAll = new Map()
        let rarityHave = new Map()
        let rarityCost = new Map()
        let replacementCost = 0
        let replaceAllCost = 0
        $.each(cards, function (index, card) {
            let $card = $(card)
            let rarity = $card.data('rarity')
            let findPrice = $card.find('.cardPrice');
            let price = 0 < findPrice.length ? parseFloat(findPrice.html().replace("$", "")) : 0
            let owned = parseInt($card.find('.cardCountSpan ').html())
            rarityAll.set(rarity, (rarityAll.has(rarity) ? rarityAll.get(rarity) : 0) + 1)
            if (0 < owned) rarityHave.set(rarity, (rarityHave.has(rarity) ? rarityHave.get(rarity) : 0) + 1)
            if (0 < owned) replacementCost += price
            if (0 < owned) replaceAllCost += (price * owned)
            if (0 === owned) rarityCost.set(rarity, (rarityCost.has(rarity) ? rarityCost.get(rarity) : 0) + price)

        })
        let totalPrice = 0.00
        let htmlBuilder = ""
        for (let key of ["token", "common", "uncommon", "rare", "mythic", "special"])/*forces order */ {
            if (!rarityAll.has(key)) continue

            let rarityPrice = (rarityCost.has(key) ? rarityCost.get(key) : 0);
            let rarityPct = rarityHave.has(key) ? parseInt(rarityHave.get(key)) * 100 / parseInt(rarityAll.get(key)) : 0
            let rarityNumer = rarityHave.has(key) ? rarityHave.get(key) : 0
            let rarityDenom = rarityAll.get(key)
            let raritySplit = `<span class="fourCount fourCountRight">${rarityNumer.toString()}</span>/<span class="fourCount">${rarityDenom.toString()}</span>`
            let data = `<div>`
                + `<div class="collectorInfoRarity colorRowBorder">${key}</div>`
                + `<div class="collectorInfoPercent colorRowBorder">`
                + `<div class="collectorInfoPercentPercent">${rarityPct.toFixed(0)}%</div>`
                + `<div class="collectorInfoPercentRatio">${raritySplit}</div>`
                + `</div>`
                + `<div class="collectorInfoCost colorRowBorder">$${rarityPrice.toFixed(2)}</div>`
                + `</div>`;
            totalPrice += rarityPrice
            htmlBuilder += data
        }
        return `<div class="collectorInfo">
                    <div>
                        ${htmlBuilder}
                        <div>
                            <div class="collectorInfoRarity" style="border-style: none">&nbsp;</div><div style="border-style: none" class="collectorInfoPercent">To Complete</div><div class="collectorInfoCost">$${totalPrice.toFixed(2)}</div>
                        </div>
                        <div>
                            <div class="collectorInfoRarity" style="border-style: none">&nbsp;</div><div style="border-style: none" class="collectorInfoPercent">Replace Set</div><div class="collectorInfoCost">$${replacementCost.toFixed(2)}</div>
                        </div>
                        <div>
                            <div class="collectorInfoRarity" style="border-style: none">&nbsp;</div><div style="border-style: none" class="collectorInfoPercent">Replace All</div><div class="collectorInfoCost">$${replaceAllCost.toFixed(2)}</div>
                        </div>
                    </div>
               </div>`
    }
    return loader({html:html})
})()