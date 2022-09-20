let _viewControlsHtml = function (sorterHtml, filterHtml, dangerZoneHtml = emptyViewControlHtml) {

    const _viewControlParentFunc = content => htmler(`<div id="controlBox" class="manipulatorsContainer itemHidden"><div class="manipulatorInner"><div class="manipulatorLabel"><span class="chevron down">${i18n.get(i18n.keys.viewControls.section.allControls)}</span></div>${content.html()}</div></div>`)

    function registerLabelCollapseEvents() {
        const chevronToggle = $obj => $obj.find('span').toggleClass(["down", "right"])
        const slideToggle = $obj => $obj.slideToggle("slow")
        $(".manipulatorsLabel").click(function () {
            let $obj = $(this);
            slideToggle($obj.parent().find('.manipulatorControlSet'))
            chevronToggle($obj)
        });
        $(".manipulatorLabel").click(function () {
            slideToggle($(".manipulatorsContainer").find('.manipulators'))
            chevronToggle($(this))
        });
    }

    async function generate(replace) {
        await loader(_viewControlParentFunc(generateAll(dangerZoneHtml, sorterHtml, filterHtml))).load(replace)
        registerLabelCollapseEvents()
        sorterHtml.registerEvents(filterHtml._trigger)
        filterHtml.registerEvents()
        dangerZoneHtml.registerEvents()
    }

    function initialLoad() {
        $(".manipulatorsContainer").removeClass("itemHidden")
        sorterHtml._trigger()
        filterHtml._trigger()
        dangerZoneHtml._trigger()
    }

    return {
        load: (replace) => generate(replace),
        initSort: sorterHtml.builder,
        initFilter: filterHtml.builder,
        initDangerZone: dangerZoneHtml.builder,
        apply: initialLoad
    }
}

let emptyViewControlHtml = {
    html: () => "",
    builder: {},
    registerEvents: () => {},
    _trigger: () => {}
}


let setControlsHtml = _viewControlsHtml(setSorterHtml, setFilterHtml)
let cardControlsHtml = _viewControlsHtml(cardSorterHtml, cardFilterHtml, dangerZoneHtml)