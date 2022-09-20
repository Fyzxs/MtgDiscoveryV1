let locales = (function () {
    let en_us = "en-us"
    return {
        en_us: en_us,
        default: en_us
    }
})()

let _enusLocale = function (keys) {

    function plurality(key, ...args) {
        switch (key) {
            case "set.box.cardsInSet":
                if (args[1] === 1) return key + "singular"
                else return key + "plural"
            default:
                return key
        }
    }

    let locale = new Map()

    locale.set(keys.page.title.home, "MTG Discovery")
    locale.set(keys.page.title.sets, "List of Sets")
    locale.set(keys.page.title.setCards, "All Cards of {0}")
    locale.set(keys.page.title.parentBlock, "All Cards of {0} Block")
    locale.set(keys.page.title.howto, "How-To Guide")
    locale.set(keys.page.title.login, "Sign In")
    locale.set(keys.page.title.register, "Register")
    locale.set(keys.page.title.profile, "Your Profile")
    locale.set(keys.page.title.terms, "Terms and Conditions")
    locale.set(keys.page.title.privacy, "Privacy Policy")
    locale.set(keys.page.title.about, "About")
    locale.set(keys.page.title.cards, "{0} Versions")
    locale.set(keys.page.title.artists, "{0} Cards")
    locale.set(keys.page.title.setCardsBinder, "Set Cards {0} as Binder Pages")
    locale.set(keys.page.title.cardSearch, "Card Search")

    locale.set(keys.menu.item.home, 'Home')
    locale.set(keys.menu.item.default, 'Home')
    locale.set(keys.menu.item.sets, 'Sets')
    locale.set(keys.menu.item.howto, 'Info')
    locale.set(keys.menu.item.login, 'Login')
    locale.set(keys.menu.item.register, 'Register')
    locale.set(keys.menu.item.profile, 'Profile')
    locale.set(keys.menu.item.logout, 'Logout')
    locale.set(keys.menu.item.userSet, 'Your Collection')
    locale.set(keys.menu.item.cardSearch, 'Search')

    locale.set(keys.footer.link.terms, 'Terms')
    locale.set(keys.footer.link.privacy, 'Privacy')
    locale.set(keys.footer.link.about, 'About')

    locale.set(keys.auth.login.fillInAllFields, "Please fill in all fields")
    locale.set(keys.auth.login.displayNameLabel, "Display Name")
    locale.set(keys.auth.login.displayNamePlaceholder, "enter display name")
    locale.set(keys.auth.login.passwordLabel, "Password")
    locale.set(keys.auth.login.passwordPlaceholder, "enter password")
    locale.set(keys.auth.login.signIn, "Sign In")
    locale.set(keys.auth.login.unknownFailure, "Unknown Failure: ")
    locale.set(keys.auth.login.loaderAlt, "Magic Icon Loader")


    locale.set(keys.sets.summary.systemCards, '{0} cards in system')
    locale.set(keys.sets.summary.cardsInCollection, '{0} cards in collection')
    locale.set(keys.sets.summary.cardsInCollectionNoBasic, '{0} excluding basic lands')
    locale.set(keys.sets.summary.uniqueCardsCollected, 'Collected ({0}) {1}% of {2} cards')
    locale.set(keys.sets.summary.completedSets, '({0}) completed sets is {1}% of ({2}) sets')

    locale.set(keys.set.box.releaseDate, "Released: {0}")
    locale.set(keys.set.box.viewInParentSet, "View in Parent Set ({0})")
    locale.set(keys.set.box.cardsCollected, "<span id='collection_{0}'>{1}</span> cards collected")
    locale.set(keys.set.box.cardsInSet + "plural", "<span id='cardsInSet_{0}'>{1}</span> cards in set")
    locale.set(keys.set.box.cardsInSet + "singular", "<span id='cardsInSet_{0}'>{1}</span> card in set")
    locale.set(keys.set.box.percentSetCollected, "<span id='ofSet_{0}'>{1}</span>{2}{3}")
    locale.set(keys.set.box.backToCollectorSets, "to {0}'s collection")
    locale.set(keys.set.box.backToSets, "back to sets")
    locale.set(keys.set.box.cardsCollectedDivider, "/")

    locale.set(keys.card.box.cardPageLinkTitle, "Link to all {0} versions")
    locale.set(keys.card.box.nameWithFoilSuffix, "{0} [FOIL]")
    locale.set(keys.card.box.countTitle, "{0} count")
    locale.set(keys.card.box.cardKingdomAltText, "Link to Card Kingdom for {0}")
    locale.set(keys.card.box.geekFortressAltText, "Link to Geek Fortress for {0}")
    locale.set(keys.card.box.cardKingdomLogoAltText, "Card Kingdom Logo")
    locale.set(keys.card.box.geekFortressLogoAltText, "Geek Fortress Logo")
    locale.set(keys.card.box.abuGamesAltText, "Link to ABU Games for {0}")
    locale.set(keys.card.box.abuGamesLogoAltText, "ABU Games Logo")
    locale.set(keys.card.box.flipImageAltText, "Flip {0}")
    locale.set(keys.card.box.artistLinksAltText, "Link to {0} cards")
    locale.set(keys.card.box.setLinkAltText, "Link to {0} set")

    locale.set(keys.viewControls.section.allControls, "All Controls")
    locale.set(keys.viewControls.section.sortControls, "Sort Controls")
    locale.set(keys.viewControls.section.filterControls, "Filter Controls")
    locale.set(keys.viewControls.controls.binderLink.text, "View as 9 card pages")
    locale.set(keys.viewControls.controls.unbinderLink.text, "View all cards")
    locale.set(keys.viewControls.controls.sort.alpha, "Alpha")
    locale.set(keys.viewControls.controls.sort.release, "Release")
    locale.set(keys.viewControls.controls.sort.setSize, "Size")
    locale.set(keys.viewControls.controls.sort.setPercent, "Set %")
    locale.set(keys.viewControls.controls.sort.cardsCollected, "Cards")
    locale.set(keys.viewControls.controls.sort.cardPrice, "Price")
    locale.set(keys.viewControls.controls.sort.cardNumber, "Card #")
    locale.set(keys.viewControls.controls.sort.asc, "Asc")
    locale.set(keys.viewControls.controls.sort.desc, "Desc")

    locale.set(keys.viewControls.controls.filter.collected.all, "All")
    locale.set(keys.viewControls.controls.filter.collected.completed, "Completed")
    locale.set(keys.viewControls.controls.filter.collected.collecting, "Collecting")
    locale.set(keys.viewControls.controls.filter.collected.notStarted, "Not Started")
    locale.set(keys.viewControls.controls.filter.setText.label, "Name (Set Code) : ")
    locale.set(keys.viewControls.controls.filter.setText.placeholder, "contains text")
    locale.set(keys.viewControls.controls.filter.cardText.label, "Card Name : ")
    locale.set(keys.viewControls.controls.filter.cardText.placeholder, "contains text")
    locale.set(keys.viewControls.controls.filter.showing, "Showing [{0} of {1}]")

    locale.set(keys.viewControls.controls.filter.cardCount.all, "All")
    locale.set(keys.viewControls.controls.filter.cardCount.zero, "x0")
    locale.set(keys.viewControls.controls.filter.cardCount.one, "x1")
    locale.set(keys.viewControls.controls.filter.cardCount.two, "x2")
    locale.set(keys.viewControls.controls.filter.cardCount.three, "x3")
    locale.set(keys.viewControls.controls.filter.cardCount.four, "x4")
    locale.set(keys.viewControls.controls.filter.cardCount.fivePlus, "x5+")

    locale.set(keys.viewControls.controls.filter.cardRarity.all, "All")
    locale.set(keys.viewControls.controls.filter.cardRarity.special, "Special")
    locale.set(keys.viewControls.controls.filter.cardRarity.mythic, "Mythic")
    locale.set(keys.viewControls.controls.filter.cardRarity.rare, "Rare")
    locale.set(keys.viewControls.controls.filter.cardRarity.uncommon, "Uncommon")
    locale.set(keys.viewControls.controls.filter.cardRarity.common, "Common")
    locale.set(keys.viewControls.controls.filter.cardRarity.token, "Token")

    locale.set(keys.functions.plurality, plurality)
    locale.set(keys.id, locales.en_us)

    return locale;
}

let i18n = (function () {

    let _i18nKeys = (function () {
        let id = "id"
        let functions = {}
        functions.plurality = "functions.plurality"

        let page = {}
        page.title = {}
        page.title.prefix = "page.title."
        page.title.home = page.title.prefix + "/" + paths.home
        page.title.default = page.title.prefix + "/" + paths.default
        page.title.sets = page.title.prefix + "/" + paths.sets
        page.title.setCards = page.title.prefix + "/" + paths.setCards
        page.title.parentBlock = page.title.prefix + "/" + paths.parentBlock
        page.title.howto = page.title.prefix + "/" + paths.howto
        page.title.login = page.title.prefix + "/" + paths.login
        page.title.register = page.title.prefix + "/" + paths.register
        page.title.profile = page.title.prefix + "/" + paths.profile
        page.title.logout = page.title.prefix + "/" + paths.logout
        page.title.terms = page.title.prefix + "/" + paths.terms
        page.title.privacy = page.title.prefix + "/" + paths.privacy
        page.title.about = page.title.prefix + "/" + paths.about
        page.title.cards = page.title.prefix + "/" + paths.cards
        page.title.artists = page.title.prefix + "/" + paths.artists
        page.title.setCardsBinder = page.title.prefix + "/" + paths.setCardsBinder
        page.title.cardSearch = page.title.prefix + "/" + paths.cardSearch

        let menu = {}
        menu.item = {}
        menu.item.home = "menu.item.home"
        menu.item.sets = "menu.item.sets"
        menu.item.howto = "menu.item.howto"
        menu.item.login = "menu.item.login"
        menu.item.register = "menu.item.register"
        menu.item.profile = "menu.item.profile"
        menu.item.logout = "menu.item.logout"
        menu.item.userSet = "menu.item.userSet"
        menu.item.cardSearch = "menu.item.cardSearch"

        let footer = {}
        footer.link = {}
        footer.link.terms = "footer.link.terms"
        footer.link.privacy = "footer.link.privacy"
        footer.link.about = "footer.link.about"

        let auth = {}
        auth.login = {}
        auth.login.fillInAllFields = "auth.login.fillInAllFields"
        auth.login.unknownFailure = "auth.login.unknownFailure"
        auth.login.displayNameLabel = "auth.login.displayNameLabel"
        auth.login.displayNamePlaceholder = "auth.login.displayNamePlaceholder"
        auth.login.passwordLabel = "auth.login.passwordLabel"
        auth.login.passwordPlaceholder = "auth.login.passwordPlaceholder"
        auth.login.signIn = "auth.login.signIn"
        auth.login.loaderAlt = "auth.login.loaderAlt"


        let sets = {}
        sets.summary = {}
        sets.summary.systemCards = "sets.summary.systemCards"
        sets.summary.cardsInCollection = "sets.summary.cardsInCollection"
        sets.summary.cardsInCollectionNoBasic = "sets.summary.cardsInCollectionNoBasic"
        sets.summary.uniqueCardsCollected = "sets.summary.uniqueCardsCollected"
        sets.summary.completedSets = "sets.summary.completedSets"

        let set = {}
        set.box = {}
        set.box.releaseDate = "set.box.releaseDate"
        set.box.viewInParentSet = "set.box.viewInParentSet"
        set.box.cardsCollected = "set.box.cardsCollected"
        set.box.cardsInSet = "set.box.cardsInSet"
        set.box.percentSetCollected = "set.box.percentSetCollected"
        set.box.backToCollectorSets = "set.box.backToCollectorSets"
        set.box.backToSets = "set.box.backToSets"
        set.box.cardsCollectedDivider = "set.box.cardsCollectedDivider"

        let card = {}
        card.box = {}
        card.box.nameWithFoilSuffix = "card.box.nameWithFoilSuffix"
        card.box.cardPageLinkTitle = "card.box.cardPageLinkTitle"
        card.box.countTitle = "card.box.countTitle"
        card.box.cardKingdomAltText = "card.box.cardKingdomAltText"
        card.box.cardKingdomLogoAltText = "card.box.cardKingdomLogoAltText"
        card.box.geekFortressAltText = "card.box.geekFortressAltText"
        card.box.geekFortressLogoAltText = "card.box.geekFortressLogoAltText"
        card.box.abuGamesAltText = "card.box.abuGamesAltText"
        card.box.abuGamesLogoAltText = "card.box.abuGamesLogoAltText"
        card.box.flipImageAltText = "card.box.flipImageAltText"
        card.box.artistLinksAltText = "card.box.artistLinksAltText"
        card.box.setLinkAltText = "card.box.setLinkAltText"

        let viewControls = {}
        viewControls.section = {}
        viewControls.controls = {}
        viewControls.controls.sort = {}
        viewControls.controls.filter = {}
        viewControls.controls.filter.collected = {}
        viewControls.controls.filter.cardCount = {}
        viewControls.controls.filter.setText = {}
        viewControls.controls.filter.cardText = {}
        viewControls.controls.filter.cardRarity = {}
        viewControls.controls.binderLink = {}
        viewControls.controls.unbinderLink = {}
        viewControls.section.allControls = "viewControls.section.allControls"
        viewControls.section.sortControls = "viewControls.section.sortControls"
        viewControls.section.filterControls = "viewControls.section.filterControls"
        viewControls.controls.binderLink.text = "viewControls.section.binderLink.text"
        viewControls.controls.unbinderLink.text = "viewControls.section.unbinderLink.text"
        viewControls.controls.sort.alpha = "viewControls.control.sort.alpha"
        viewControls.controls.sort.release = "viewControls.control.sort.release"
        viewControls.controls.sort.setSize = "viewControls.control.sort.setSize"
        viewControls.controls.sort.setPercent = "viewControls.control.sort.setPercent"
        viewControls.controls.sort.setCardsCollected = "viewControls.control.sort.setCardsCollected"
        viewControls.controls.sort.cardPrice = "viewControls.control.sort.cardPrice"
        viewControls.controls.sort.cardNumber = "viewControls.control.sort.cardNumber"
        viewControls.controls.sort.asc = "viewControls.control.sort.asc"
        viewControls.controls.sort.desc = "viewControls.control.sort.desc"
        viewControls.controls.filter.collected.all = "viewControls.controls.filter.collected.all"
        viewControls.controls.filter.collected.completed = "viewControls.controls.filter.collected.completed"
        viewControls.controls.filter.collected.collecting = "viewControls.controls.filter.collected.collecting"
        viewControls.controls.filter.collected.notStarted = "viewControls.controls.filter.collected.notStarted"
        viewControls.controls.filter.cardCount.all = "viewControls.controls.filter.cardCount.all"
        viewControls.controls.filter.cardCount.zero = "viewControls.controls.filter.cardCount.zero"
        viewControls.controls.filter.cardCount.one = "viewControls.controls.filter.cardCount.one"
        viewControls.controls.filter.cardCount.two = "viewControls.controls.filter.cardCount.two"
        viewControls.controls.filter.cardCount.three = "viewControls.controls.filter.cardCount.three"
        viewControls.controls.filter.cardCount.four = "viewControls.controls.filter.cardCount.four"
        viewControls.controls.filter.cardCount.fivePlus = "viewControls.controls.filter.cardCount.fivePlus"
        viewControls.controls.filter.cardRarity.all = "viewControls.controls.filter.cardRarity.all"
        viewControls.controls.filter.cardRarity.special = "viewControls.controls.filter.cardRarity.special"
        viewControls.controls.filter.cardRarity.mythic = "viewControls.controls.filter.cardRarity.mythic"
        viewControls.controls.filter.cardRarity.rare = "viewControls.controls.filter.cardRarity.rare"
        viewControls.controls.filter.cardRarity.uncommon = "viewControls.controls.filter.cardRarity.uncommon"
        viewControls.controls.filter.cardRarity.common = "viewControls.controls.filter.cardRarity.common"
        viewControls.controls.filter.cardRarity.token = "viewControls.controls.filter.cardRarity.token"
        viewControls.controls.filter.setText.label = "viewControls.controls.filter.setText.label"
        viewControls.controls.filter.setText.placeholder = "viewControls.controls.filter.setText.placeholder"
        viewControls.controls.filter.cardText.label = "viewControls.controls.filter.cardText.label"
        viewControls.controls.filter.cardText.placeholder = "viewControls.controls.filter.cardText.placeholder"
        viewControls.controls.filter.showing = "viewControls.controls.filter.showing"


        return {
            id,
            functions,
            page,
            menu,
            footer,
            auth,
            sets,
            set,
            card,
            viewControls
        }
    })()

    let localeCollection = (function () {
        let map = new Map()
        map.set(locales.en_us, _enusLocale(_i18nKeys))
        let useDefault = urlInfo.locale.absent()

        const localeOverride = () => useDefault ? locales.default : urlInfo.locale.value();

        function getLocale() {
            let locale = localeOverride();
            if (map.has(locale)) return map.get(locale);

            console.log(`Requested [locale=${locale}] not found. Using [default=${locales.default}]`)
            useDefault = true
            return map.get(locales.default)
        }

        function adjustKeyForPlurality(key, locale, ...args) {
            let pluralityKey = _i18nKeys.functions.plurality
            if (!locale.has(pluralityKey)) return key
            let pluralityFunction = locale.get(pluralityKey)
            if (typeof pluralityFunction !== 'function') return key

            return pluralityFunction(key, ...args)
        }

        const formatted = (locale, key, ...args) => locale.get(key).format(...args);

        function getValue(key, ...args) {
            let locale = getLocale()
            let localId = locale.get(_i18nKeys.id)
            key = adjustKeyForPlurality(key, locale, ...args);
            if (locale.has(key)) return formatted(locale, key, ...args)
            if (localId === locales.default) {
                console.log(`Requested [key=${key}] not found in [locale=${localId}]`)
                return "_missing_key_"
            }

            console.log(`Requested [key=${key}] not found in [locale=${localId}]. Using [default=${locales.default}]`)
            return formatted(map.get(locales.default), key, ...args)
        }

        return {get: getValue}
    })()

    function getValueFor(key, ...args) {
        return localeCollection.get(key, ...args)
    }

    return {
        get: getValueFor,
        keys: _i18nKeys
    }
})()