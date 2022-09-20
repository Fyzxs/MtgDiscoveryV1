let viewControlTypes = {
    SORT : {ALPHA: 1, RELEASE_DATE: 2, SET_SIZE: 3, PCT_COLLECTED: 4, CARD_NUMBER: 5, SET: 6, PRICE:7, COUNT_COLLECTED:8},
    ORDER:{DESC: -1, ASC: 1},
    FILTERS : {
        FOIL: {ALL: -1, FOIL: 1, NOT: 2},
        RARITY: {ALL: -1, MYTHIC: 101, RARE: 102, UNCOMMON: 103, COMMON: 104, TOKEN: 105, SPECIAL:106},
        PROMO: {ALL: -1, PROMO: 201, REGULAR: 202, EXTENDED: 203},
        SET: {PARTIAL_PREVIEW: 301},
        COUNT : {ALL : -1, ZERO: 400, ONE:401, TWO:402, THREE:403, FOUR:404, MORE:405},
        COLLECTED: {ALL:-1, COMPLETED : 501, PARTIAL:502, NOT_STARTED: 503},
        TEXT: {YEP:10001},
        BINDER: {YEP:20001}
    }
}


let viewControlsBase = (function(){
    const _viewTypeParentFunc           = (content, moreCss) => htmler(`<div id="${moreCss.joined()}">${content.html()}</div>`)
    const _viewControlLabelFunc         = (label, direction = "down") => htmler(`<div class="manipulatorsLabel"><span class="chevron ${direction}">${label}</span></div>`)
    const _viewTypeControlSetFunc       = (content, showCss = "") => htmler(`<div class="manipulatorControlSet ${showCss}">${content.html()}</div>`)
    const _viewTypeControlSetParentFunc = content => htmler(`<div class="manipulatorsControls">${content.html()}</div>`)
    const _viewTypeInnerFunc            = (content) => htmler(`<div class="manipulators"><div class="manipulatorsInner">${content.html()}</div></div>`)
    const _toggleItemFunc               = (labelText, typeCss, control) => htmler(`<div class="controlItem"><div>${labelText}</div><div><label class="toggle ${typeCss.joined()}">${control.html()}<span class="slider ${typeCss.joined()}"></span></label></div></div>`)

    return{
        viewTypeParentFunc: _viewTypeParentFunc,
        viewControlLabelFunc: _viewControlLabelFunc,
        viewTypeControlSetFunc: _viewTypeControlSetFunc,
        viewTypeControlSetParentFunc: _viewTypeControlSetParentFunc,
        viewTypeInnerFunc: _viewTypeInnerFunc,
        toggleItemFunc: _toggleItemFunc,
    }
})()