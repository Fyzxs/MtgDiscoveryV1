let additionalCss = function (...classes) {
    let joined = (separator) => classes.join(separator === undefined ? " " : separator)

    return {joined: joined}
}

let css = (function () {
    return {
        empty: additionalCss(),
        menuAuth: "menuAuth",
        menuNoAuth: "menuNoAuth",
        displayNone: "displayNone",
        alwaysMenu: "alwaysMenu",
        optionalMenu: "optionalMenu",
        displayInline: "displayInline",
        footerPosition: "footerPosition",
        footerContainer: "footerContainer",
        chevron : {
            down: "chevron down",
            right: "chevron right"
        },
        sort: "sort",
        filter: "filter"
    }
})()