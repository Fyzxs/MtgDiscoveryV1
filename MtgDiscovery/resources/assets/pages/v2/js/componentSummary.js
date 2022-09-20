let systemSummaryHtml = (function(){
    let anonymousSummary = (function () {
        async function html() {
            let {value, err} = await api.data.systemCardCount()
            if (err !== undefined) return emptyHtml
            return `<div class="systemCardCount"><span class="systemCardLabel">${i18n.get(i18n.keys.sets.summary.systemCards, value)}</span></div>`
        }

        return {html: html}
    })()

    let collectorSummary = (function () {
        async function html() {
            let {value, err} = await api.data.collectorSetSummary()
            if (err !== undefined) return emptyHtml

            let cardsInCollection = value.collectionCount
            let collectionCountNoBasic = value.collectionCountNoBasic
            let systemCardCount = value.totalCardCount
            let systemSetCount = value.totalSets
            let completedSets = value.completedSets
            let uniqueCardsInCollection = value.collectionSetCardCount
            let collectedUniqueCardsPercent = Math.floor((uniqueCardsInCollection / systemCardCount) * 100)
            let collectedSetsPercent = Math.floor((completedSets / systemSetCount) * 100)

            return `
<div class="collectionSummary">
  <div class="countInCollection summary-bar-container">
    <span class="collectionCount">${i18n.get(i18n.keys.sets.summary.cardsInCollection, cardsInCollection)}</span>
    <span class="collectionCountNoBasic">${i18n.get(i18n.keys.sets.summary.cardsInCollectionNoBasic, collectionCountNoBasic)}</span>
  </div>
  <div class="pctOfCardsCollected summary-bar-container">
    <div class="summary-bar-wrapper">
      <div class="summary-bar summary-bar-success" style="width: ${collectedUniqueCardsPercent}%;">
        <span>${i18n.get(i18n.keys.sets.summary.uniqueCardsCollected, uniqueCardsInCollection, collectedUniqueCardsPercent, systemCardCount)}</span>
      </div>
      <div class="summary-bar summary-bar-danger" style="width: ${100 - collectedUniqueCardsPercent}%;"></div>
    </div>
  </div>
  <div class="pctOfSetsCollected summary-bar-container">
    <div class="summary-bar-wrapper">
      <div class="summary-bar summary-bar-success" style="width: ${collectedSetsPercent}%;">
        <span>${i18n.get(i18n.keys.sets.summary.completedSets, completedSets, collectedSetsPercent, systemSetCount)}</span>
      </div>
      <div class="summary-bar summary-bar-danger" style="width: ${100 - collectedSetsPercent}%;"></div>
    </div>
  </div>
</div>
`
        }

        return {html: html}
    })()

    const summarySelector = () => {
        if (urlInfo.ctor.absent()) return anonymousSummary
        return collectorSummary
    }

    return loader(summarySelector())
})()