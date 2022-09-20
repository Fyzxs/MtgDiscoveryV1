let menuHtml = (function () {
    let menuFunc = content => htmler(`<div class="menuContainer menuPosition"><div class="menuContent">${content.html()}</div></div>`)
    let sectionFunc = (content, moreCss = css.empty) => htmler(`<div class="userMenuContainer ${moreCss.joined()}">${content.html()}</div>`)
    let itemFunc = (labelKey, target, moreCss = css.empty, labelArgs = undefined) => htmler(`<div class="menuItem ${moreCss.joined()}"><a href="${(target !== "#" ? "/" : "") + target}">[${i18n.get(labelKey, labelArgs)}]</a></div>`)

    let itemNotLoggedInCss = additionalCss(css.menuNoAuth)
    let itemLogin = itemFunc(i18n.keys.menu.item.login, paths.login, itemNotLoggedInCss)
    let itemRegister = itemFunc(i18n.keys.menu.item.register, paths.register, itemNotLoggedInCss)

    let itemYourCollectionFunc = (name) => itemFunc(i18n.keys.menu.item.userSet, `${paths.sets}${urlInfo.ctor.incParamStart(user.active.userId())}`, additionalCss(css.menuAuth, "yourCollection", (name !== undefined ? "" : "itemHidden")), name)
    let itemProfile = itemFunc(i18n.keys.menu.item.profile, paths.profile, additionalCss(css.menuAuth))
    let itemLogout = itemFunc(i18n.keys.menu.item.logout, paths.logout, additionalCss(css.menuAuth, "logoutClass"))

    let itemHome = itemFunc(i18n.keys.menu.item.home, paths.home)
    let itemSets = itemFunc(i18n.keys.menu.item.sets, paths.sets)
    let itemSearch = itemFunc(i18n.keys.menu.item.cardSearch, `${paths.cardSearch}${urlInfo.ctor.asParamStart()}`)
    let itemHowTo = itemFunc(i18n.keys.menu.item.howto, paths.howto)

    let sectionAlwaysCss = additionalCss(css.alwaysMenu);
    let sectionPrimary = sectionFunc(generateAll(itemHome, itemSets), sectionAlwaysCss)
    let sectionOptionalCss = additionalCss(css.optionalMenu);
    let sectionNotLoggedIn = user.active.isLoggedIn() ? emptyHtml : sectionFunc(generateAll(itemSearch, itemLogin, itemRegister, itemHowTo), sectionOptionalCss)
    let sectionIsLoggedInFunc = (name) => user.active.isNotLoggedIn() ? emptyHtml : sectionFunc(generateAll(itemYourCollectionFunc(name), itemSearch, itemProfile, itemLogout, itemHowTo), sectionOptionalCss)

    let siteMenu = (name) => menuFunc(generateAll(sectionPrimary, sectionNotLoggedIn, sectionIsLoggedInFunc(name)))

    let logout = function () {
        $(".logoutClass > a").click(function () {
            Cookies.remove("token")
            Cookies.remove("displayName")
            Cookies.remove("userid")
            setTimeout(() => window.location.replace("/" + paths.home), 250)
        })
    }

    async function internalLoad(classToReplace) {
        let name = await user.active.isLoggedIn() ? user.active.displayName() : undefined
        return loader(siteMenu(name)).load(classToReplace, {onSuccess: logout})
    }

    return {load: internalLoad}
})()