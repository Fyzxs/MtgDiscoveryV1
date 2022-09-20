let paths = (function () {
    let prefix = ""//"v2/"
    let suffix = ""//".html"
    let _paths = {}
    let w = (s) => `${prefix}${s}${suffix}`//Wrapper
    _paths.home = w("")//should be ""
    _paths.default = w("default")//should be ""
    _paths.sets = w("sets")
    _paths.setCards = w("setCards")
    _paths.parentBlock = w("parentBlock")
    _paths.howto = w("howto")
    _paths.login = w("login")
    _paths.register = w("register")
    _paths.profile = w("profile")
    _paths.logout = "#"
    _paths.terms = w("terms")
    _paths.privacy = w("privacy")
    _paths.about = w("about")
    _paths.cards = w("cardVersions")
    _paths.artists = w("artistCards")
    _paths.setCardsBinder = w("setCardsBinder")
    _paths.cardSearch = w("cardSearch")

    return _paths
})()
let remotePaths = (function () {
    let imgPath = `https://mtgdiscards.blob.core.windows.net/img/`;

    let _paths = {}
    _paths.cardKingdom = {}
    _paths.geekFortress = {}
    _paths.abuGames = {}
    _paths.setIcon = (imageCode) => `${imgPath}setIcons/${imageCode === "con" ? "_" : ""}${imageCode}.svg`
    _paths.cardFront = (uuid) => `${imgPath}cards/${uuid}.jpg`
    _paths.cardBack = (uuid) => `${imgPath}cards/${uuid}_back.jpg`
    _paths.cardKingdom.search = (term) => `https://www.cardkingdom.com/catalog/search?filter[name]=${term.replace(/\s/g, '+')}`
    _paths.cardKingdom.item = (id) => `https://www.cardkingdom.com/catalog/item/${id}`
    _paths.geekFortress.search = (term) => `https://geekfortressgames.crystalcommerce.com/advanced_search?search%5Bfuzzy_search%5D=%22${term}%22`//`https://geekfortressgames.crystalcommerce.com/products/search?q=${term}`
    _paths.abuGames.cardSearch = (term) => `https://abugames.com/magic-the-gathering/singles?search=${term}&language=%5B%22English%22%5D`//https://abugames.com/magic-the-gathering/singles?search=Retaliator%20Griffin&language=%5B%22English%22%5D
    _paths.abuGames.tokenSearch = (term) => `https://abugames.com/magic-the-gathering/tokens?search=${term}`//https://abugames.com/magic-the-gathering/singles?search=Retaliator%20Griffin&language=%5B%22English%22%5D

    return _paths
})()
