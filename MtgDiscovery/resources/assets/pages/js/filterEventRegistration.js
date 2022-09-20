

let filterEventRegistration = (function (filter, cardDisplay) {

    function updateToggleFilter(isAdd, type) {
        if (isAdd) filter.add(type)
        else filter.remove(type)

        cardDisplay.show()
    }

    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    function loadTexts(filterItems) {
        $.each(filterItems, function (index, item) {
            if (item.type !== "text") return

            function doFilter(val){
                filter.updateMeta(item.filterValue, val)
                updateToggleFilter(val !== "", item.filterValue)
            }

            $(`#${item.domId}`).keyup(delay(function() {
                let val = $(this).val();
                doFilter(val)
            }, 250))

            function clearTextField() {
                    let $1 = $(`#${item.domId}`);
                    $1.focus()
                    if ($1.val() === "") return;
                    $1.val("")
                    doFilter("")
            }

            $(`#${item.domId}_clear`).click(clearTextField)

            //Current expectation is that there is only 1 text FILTER on a page
            let keyCount = 0
            $(document).keyup(function(event) {
                if(event.key !== 'Shift') return
                keyCount++
                setTimeout(function(){
                    if(keyCount === 2) {clearTextField()}
                    keyCount = 0
                }, 250)
            })
        })
    }

    function loadToggles(filterItems) {
        var allItem = {};
        var otherItems = [];
        $.each(filterItems, function (index, item) {
            if (item.type === "text") return
            if (!item.isAll) {
                otherItems.push(item)
                return
            }
            allItem = item
        })
        $(`#${allItem.domId}`).change(function () {
            if (!this.checked) {
                $.each(otherItems, function (index, item) {
                    $(`#${item.domId}`).prop('checked', false).trigger("change")
                })
            }
            $(`#${allItem.domId}`).prop('checked', false)
        });
        $.each(otherItems, function (index, item) {
            $(`#${item.domId}`).change(function () {
                updateToggleFilter(this.checked, item.filterValue)
                if (this.checked) {
                    $(`#${allItem.domId}`).prop('checked', true)
                } else {
                    var allState = false;
                    $.each(otherItems, function (index, value) {
                        let $other = $(`#${value.domId}`)
                        allState = allState || $other.prop("checked")
                    })
                    $(`#${allItem.domId}`).prop('checked', allState)
                }
            })
        })
    }

    function loadBinder(filterItems){
        function callback(itemCount){
            $.each(filterItems, function (index, item) {
                if (item.type !== "binder") return
                filter.add(item.filterValue)
                filter.updateMeta(item.filterValue, 1)
                let pages = Math.ceil(itemCount / 9)
                let pageContainer = $(`#binderPageButtons`)
                for (let page = 1; page <= pages; page++) {
                    let display = page < 10 ? "0" + page : page
                    let button = `<button class="binderPageButton" data-page="${page}" id="binderPage${display}">${display}</button>`
                    pageContainer.append(button)
                }
            })
            $(`.binderPageButton`).click(function (){
                $(`.binderPageButton`).removeClass("curPage")
                let $this = $(this);
                $this.addClass("curPage")
                let value = parseInt($this.data("page"))
                filter.updateMeta(FILTERS.TYPES.BINDER.YEP, value)
                let prev = value - 1
                let next = value + 1
                $("#binderPrev").data("page", prev < 10 ? "0" + prev : prev )
                $("#binderNext").data("page", next < 10 ? "0" + next : next )
                cardDisplay.show()
            })
            $(`.binderDirPage`).click(function (){
                let value = parseInt($(this).data("page"))
                $(`#binderPage${value < 10 ? "0" + value : value}`).trigger("click")
            })

            $(`#binderPage01`).addClass("curPage")

            $("#binderPrev").data("page", 1)
            $("#binderNext").data("page", 2)

            $(document).keyup(function(event) {
                if(event.key === ',')$("#binderPrev").trigger("click")
                if(event.key === ' ')$("#binderNext").trigger("click")
            })
            cardDisplay.show()
        }
        cardDisplay.itemCount(callback)
    }

    function loadFilters(filterItems) {
        loadToggles(filterItems)
        loadTexts(filterItems)
        loadBinder(filterItems)
    }
    return {
        filters:loadFilters
    }
});


let dangerZoneEventRegistration = (function () {
    function registerControls(configuration){
        let buttonSelector = configuration.buttonSelector
        let modalSelector = configuration.modalSelector
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
                let populatedData = massModifications.populatedData()
                updateCardsToServer.massUpdate(populatedData.payload, populatedData.updateData, afterCall)
            } else {
                afterCall()
            }
        })
    }

    return {
        register:registerControls
    }
})()

let displayEventRegistration = (function () {
    function registerControls(configuration){
        let buttonSelector = configuration.buttonSelector

        $(buttonSelector).click(function () {
            $('.cardImageDiv, .cardBox').toggleClass('cardImageMedium')
        })
    }

    return {
        register:registerControls
    }
})()