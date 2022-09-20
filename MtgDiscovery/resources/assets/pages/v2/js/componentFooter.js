let footerHtml = (function () {

    let sectionFunc = (content, moreCss = css.empty) => htmler(`<div class="footerContainer ${moreCss.joined()}">${content.html()}</div>`)
    let lineFunc = (content, moreCss = css.empty) => htmler(`<div ${moreCss.joined()}">${content.html()}</div>`)
    let linkFunc = (labelKey, target, moreCss = css.empty) => htmler(`<a ${moreCss.joined()}" href="/${target}">[${i18n.get(labelKey)}]</a>`)
    let contentFanContent = htmler(`MTG Discovery is unofficial Fan Content permitted under the <a class="footerItem" href="https://company.wizards.com/fancontentpolicy">Fan Content Policy</a>. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.`)
    let contentEveryoneElse = htmler(`MtgJson, Geek Fortress, Card Kingdom (and others) are property of their respective owner. This site is not affiliated with them.`)
    let contentSiteLinksFormat = `©2021 MTG Discovery * {0} & {1} * {2}`

    let linkTerms = linkFunc(i18n.keys.footer.link.terms, paths.terms)
    let linkPrivacy = linkFunc(i18n.keys.footer.link.privacy, paths.privacy)
    let linkAbout = linkFunc(i18n.keys.footer.link.about, paths.about)
    let contentSiteDetails = htmler(contentSiteLinksFormat.format(linkTerms.html(), linkPrivacy.html(), linkAbout.html()))

    let siteFooterLinks = lineFunc(contentSiteDetails)
    let siteFooterFanContent = lineFunc(contentFanContent, additionalCss(css.displayInline))
    let siteFooterEveryoneElse = lineFunc(contentEveryoneElse, additionalCss(css.displayInline))
    let siteFooterSectionPrimary = sectionFunc(generateAll(siteFooterLinks, siteFooterFanContent, siteFooterEveryoneElse), additionalCss(css.footerPosition))


    return loader(siteFooterSectionPrimary)
})()


