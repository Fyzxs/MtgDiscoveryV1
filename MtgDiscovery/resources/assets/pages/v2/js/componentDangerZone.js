

let dangerZoneHtml = (function () {
    let excludeDangerZone = true
    let builder = {}

    function incAddAll() {
        excludeDangerZone = false
        return builder
    }

    builder.incAddAll = incAddAll

    function dangerZoneControls() {
        return `<div id="dangerZone" class="manipulatorControlSet" style="display:none">`
            + `<div class="controlItem">`
            + `<div>`
            + `<button id="addOneEach" type="button">Add one of each visible</button>`
            + `</div>`
            + `</div>`
            + `</div>`
            + dangerZoneModal()
    }

    function dangerZoneModal() {
        return `<div id="dangerZoneModalId" class="modal">`
            + `<div class="modal-content">`
            + `<span class="modalMessage">There's going to be a pause while this processes... It's kludged in... this will close when complete</span>`
            + `</div>`
            + `</div>`
    }

    let dangerZoneEventRegistration = (function () {

        function massUpdateData(){
            let payload = []
            let updateData = []
            let $items = $(".cardBoxes > .itemShown")
            $.each($items, function(index, item){
                let $item = $(item)
                payload.push(cardUpdateEvents.payloadData($item, 1))
                updateData.push(cardUpdateEvents.cardData($item, 1))
            })

            return {payload, updateData}
        }

        function registerControls(){
            let buttonSelector = "#addOneEach"
            let modalSelector = "#dangerZoneModalId"
            $(buttonSelector).click(function () {
                function beforePrompt() {
                    $(buttonSelector).prop("disabled", true)
                    $(modalSelector).show()
                }
                function afterCall() {
                    $(modalSelector).hide()
                    $(buttonSelector).prop("disabled", false)
                }
                function prompt() {
                    return confirm("This will add one of each shown card\nContinue?");
                }
                beforePrompt();
                if (prompt()) {
                    let populatedData = massUpdateData()
                    cardUpdateEvents.massUpdate(populatedData.payload, populatedData.updateData, afterCall)
                } else {
                    afterCall()
                }
            })
        }

        return {
            registerEvents:registerControls
        }
    })()

    let dangerZoneLabel = viewControlsBase.viewControlLabelFunc("Danger Zone", "right")//i18n.get(i18n.keys.viewControls.section.sortControls));
    let dangerZoneControlsParentFunc = content => viewControlsBase.viewTypeParentFunc(viewControlsBase.viewTypeInnerFunc(generateAll(dangerZoneLabel, viewControlsBase.viewTypeControlSetParentFunc(content))), additionalCss("dangerZoneControls"))

    function html() {
        if(excludeDangerZone || urlInfo.ctor.absent() || user.active.isNotLoggedIn()) return ""
        return dangerZoneControlsParentFunc(htmler(dangerZoneControls())).html()
    }

    return {
        html: html,
        builder: () => builder,
        registerEvents: dangerZoneEventRegistration.registerEvents,
        _trigger: () => {}
    }

})()