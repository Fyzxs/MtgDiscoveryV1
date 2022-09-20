let api = (function () {
    let apiV1Prefix = "/api/v1/"
    let apiV2Host = env.isDev() ? "http://localhost:7071" 
    let apiV2Prefix = `${apiV2Host}/api/v2/`

    let apiPaths = {}
    apiPaths.user = {}
    apiPaths.anon = {}
    apiPaths.ctor = {}

    apiPaths.user.name = () => `${apiV1Prefix}user/${urlInfo.ctor.value()}`

    apiPaths.anon.allSets               = ()            => `${apiV2Prefix}sets`
    apiPaths.anon.totalCardCount        = ()            => `${apiV2Prefix}collection/summary`
    apiPaths.anon.singleSet             = (setCode)     => `${apiV2Prefix}set/${setCode}`
    apiPaths.anon.cardsForSet           = (setCode)     => `${apiV2Prefix}set/${setCode}/cards`
    apiPaths.anon.cardVersions          = (cardName)    => `${apiV2Prefix}card/${cardName}/cards`
    apiPaths.anon.artistCards           = (artistName)  => `${apiV2Prefix}artist/${artistName}/cards`
    apiPaths.anon.cardNameStartsWith    = (enteredText) => `${apiV1Prefix}search/card/name/${enteredText}`

    apiPaths.ctor.id = () => `/${urlInfo.ctor.value()}`
    apiPaths.ctor.allSets               = ()            => `${apiV2Prefix}sets`                             + apiPaths.ctor.id()
    apiPaths.ctor.totalCardCount        = ()            => `${apiV1Prefix}collection/summary`               + apiPaths.ctor.id()
    apiPaths.ctor.singleSet             = (setCode)     => `${apiV1Prefix}set/${setCode}`                   + apiPaths.ctor.id()
    apiPaths.ctor.cardsForSet           = (setCode)     => `${apiV2Prefix}set/${setCode}/cards`             + apiPaths.ctor.id()
    apiPaths.ctor.cardVersions          = (cardName)    => `${apiV1Prefix}card/${cardName}/cards`           + apiPaths.ctor.id()
    apiPaths.ctor.artistCards           = (artistName)  => `${apiV2Prefix}artist/${artistName}/cards`       + apiPaths.ctor.id()
    apiPaths.ctor.cardNameStartsWith    = (enteredText) => `${apiV1Prefix}search/card/name/${enteredText}`  + apiPaths.ctor.id()

    let _errorLogging = async function (url, runMe) {
        try {
            return await runMe()
        } catch (error) {
            console.log(`Error calling [url=${url}] with ${error}`)
            console.log({error})
            return {err: error}
        }
    }
    let dataApi = (function () {
        async function totalCardCount() {
            let url = apiPaths.anon.totalCardCount()

            const work = async () => {
                let result = await $.get(url)
                return {value: result.data.totalCardCount}
            }

            return await _errorLogging(url, work)

        }

        async function allSets() {
            let url = apiPaths.anon.allSets()

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function singleSet(setCode) {
            let url = apiPaths.anon.singleSet(setCode)

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardsForSet(setCode) {
            let url = apiPaths.anon.cardsForSet(setCode)

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardVersions(cardName) {
            let url = apiPaths.anon.cardVersions(cardName)

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function artistCards(artistName) {
            let url = apiPaths.anon.artistCards(artistName)

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardNameStartsWith(enteredText) {
            let url = `${apiV1Prefix}search/card/name/${enteredText}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        return {
            systemCardCount: totalCardCount,
            allSets: allSets,
            singleSet:singleSet,
            cardsForSet:cardsForSet,
            cardVersions:cardVersions,
            artistCards:artistCards,
            cardSearch:cardNameStartsWith,
            apiPaths
        }
    })()
    let userApi = (function(){
        async function name() {
            let url = `${apiV1Prefix}user/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result.displayName}
            }

            return await _errorLogging(url, work)
        }

        return {name}
    })()

    let collectorApi = (function () {
        async function totalCardCount() {
            let url = `${apiV1Prefix}collection/summary/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result.data.totalCardCount}
            }

            return await _errorLogging(url, work)
        }

        async function allSets() {
            let url = apiPaths.ctor.allSets()

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function singleSet(setCode) {
            let url = `${apiV1Prefix}set/${setCode}/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardsForSet(setCode) {
            let url = apiPaths.ctor.cardsForSet(setCode)

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardVersions(cardName) {
            let url = `${apiV1Prefix}card/${cardName}/cards/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function cardNameStartsWith(enteredText) {
            let url = `${apiV1Prefix}search/card/name/${enteredText}/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function artistCards(artistName) {
            let url = apiPaths.ctor.artistCards(artistName)//`${apiV1Prefix}artist/${artistName}/cards/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result}
            }

            return await _errorLogging(url, work)
        }

        async function collectorSetSummary(){
            let url = `${apiV1Prefix}collection/summary/${urlInfo.ctor.value()}`

            const work = async () => {
                let result = await $.get(url)
                return {value: result.data}
            }

            return await _errorLogging(url, work)
        }

        return {
            systemCardCount: totalCardCount,
            collectorSetSummary:collectorSetSummary,
            allSets: allSets,
            singleSet:singleSet,
            cardsForSet:cardsForSet,
            cardVersions:cardVersions,
            artistCards:artistCards,
            cardSearch:cardNameStartsWith
        }
    })()

    function selectDataApi() {
        if (urlInfo.ctor.available()) return collectorApi
        return dataApi
    }

    return {
        data: selectDataApi(),
        user: userApi
    }
})()