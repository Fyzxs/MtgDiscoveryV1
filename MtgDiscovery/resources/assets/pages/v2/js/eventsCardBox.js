let cardUpdateEvents = (function() {

    let updateCardsToServer = (function () {

        function canNotSendRequest() {
            if (user.active.isNotLoggedIn()) {
                toasts.failure("You are not logged in - Can't update").showToast()
                return true
            }
            if (urlInfo.ctor.available() && user.active.userId() !== urlInfo.ctor.value()) {
                toasts.failure("Cannot update another users collection... yet").showToast()
                return true
            }
            return false
        }

        function processMassUpdate(payload, cardData, alwaysFunction) {
            if (canNotSendRequest()) {
                alwaysFunction()
                return
            }

            return $.ajax({
                type: "PUT",
                url: "/api/v1/user/collection/massupdate",
                dataType: 'json',
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                },
                data: JSON.stringify(payload),
                success: function () {
                    $.each(cardData, function (index, data) {
                        toasts.success(`[${data.name}] successfully updated for ${data.count}!`).showToast()
                        cardUpdateRefreshUi.doUpdate(data, data.count)
                    })
                }
            })
                .fail(function () {
                    $.each(cardData, function (index, data) {
                        toasts.failure(`[${data.name}] failed updated for ${data.count}!`).showToast()
                        cardUpdateRefreshUi.doFailure(data, data.count)
                    })

                })
                .always(alwaysFunction)
        }

        return {
            massUpdate: processMassUpdate
        }
    })()

    let cardUpdateRefreshUi = (function () {
        function cardBoxId(src) {
            return `#cardbox_${src.isFoil ? "foil" : "nonFoil"}_${src.cardUuid}`
        }

        function updateCardCount(cardData, updatedCount) {
            let container = $(cardBoxId(cardData))

            updateElements(cardData, updatedCount)

            let delay = 300
            container.fadeOut(delay / 2).fadeIn(delay).fadeOut(delay / 2).fadeIn(delay);
        }
        function updateFailure(cardData) {
            let container = $(cardBoxId(cardData))

            let delay = 300
            container.addClass("updateFailed")
            container.fadeOut(delay / 3).fadeIn(delay).fadeOut(delay / 3).fadeIn(delay).fadeOut(delay / 3).fadeIn(delay).fadeOut(delay / 3).fadeIn(delay,() => container.removeClass("updateFailed"));
        }

        function zeroProtection(count) {
            return count < 0 ? 0 : count
        }

        function updateCard(ctrl, count) {
            ctrl.html(count)
        }

        function updateElements(cardData, updatedCount) {
            function updateSets(isAdded, isRemoved) {
                let setCodes = []
                setCodes.push(cardData.setCode)
                if (cardData.isForcedExtendedSet) setCodes.push(cardData.setCode + "-E")
                if (cardData.isForcedFoilSet || (cardData.isFoilOnly)) setCodes.push(cardData.setCode + "-F")
                if (setCodes.length === 3) setCodes.push(cardData.setCode + "-E-F")

                $.each(setCodes, function (index, setCode) {
                    if (isAdded || isRemoved) {
                        //Update the Set Collected Counter
                        let $ofSet = $(`#ofSet_${setCode}`);
                        let collectionCount = zeroProtection(parseInt($ofSet.html()) + (isAdded ? 1 : -1))
                        $ofSet.html(collectionCount)

                        //Update the Progress Bar
                        let $container = $(`#set_${setCode.toLowerCase()}`);
                        if ($container.length === 0) return

                        let setSize = $container.data("calculatedsetsize")
                        let pct = Math.round(collectionCount / setSize * 100)
                        let collectedBar = $container.find(`#${setCode}_set_prog_success`)
                        let pendingBar = $container.find(`#${setCode}_set_prog_danger`)
                        let label = $container.find(`#${setCode}_prog_label`)
                        collectedBar.css("width", `${pct}%`)
                        pendingBar.css("width", `${100 - pct}%`)

                        label.html(`${pct}`)
                    }

                    //Update the total collected
                    let $collected = $(`#collection_${setCode}`)
                    if ($collected.length === 0) return
                    let collectedCount = zeroProtection(parseInt($collected.html()) + parseInt(updatedCount))
                    $collected.html(collectedCount)
                })
            }


            let countControl = $(`${cardBoxId(cardData)} > .cardCountDiv > .cardCountSpan`)
            let currentCount = parseInt(countControl.html())
            let modificationAmount = parseInt(updatedCount)
            let isNewToCollection = currentCount === 0
            let combinedCount = zeroProtection(currentCount + modificationAmount)
            let isRemovedFromCollection = combinedCount <= 0

            let $cardImg = $(`${cardBoxId(cardData)}_card_img`)
            if(0 < combinedCount){
                $cardImg.addClass("ownedCard")
                $cardImg.removeClass("unownedCard")
            }
            else {
                $cardImg.removeClass("ownedCard")
                $cardImg.addClass("unownedCard")
            }
            updateCard(countControl, combinedCount)

            updateSets(isNewToCollection, isRemovedFromCollection)
        }

        return {
            doUpdate: updateCardCount,
            doFailure: updateFailure
        }
    })()

    let toasts = (function () {
        function countUpdateSuccessToast(msg) {
            return Toastify({
                text: msg,
                duration: 10 * 1000,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
            });
        }

        function countUpdateFailedToast(msg) {
            return Toastify({
                text: msg,
                duration: 10 * 1000,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
            });
        }

        return {
            success: countUpdateSuccessToast,
            failure: countUpdateFailedToast
        }
    })()


    function isCardAdjustmentInput(e) {
        let key = e.keyCode;
        return 48 <= key && key <= 57 // Keyboard 0-9
            || 96 <= key && key <= 105 //num pad 0-9
    }

    function isCardAdjustmentModifier(e) {
        let key = e.key;
        return key === "-" || key === "+";
    }

    function createPayloadData($card, count) {
        return {
            userUuid: urlInfo.ctor.value()
            , cardUuid: $card.data("uuid")
            , isForcedExtendedSet: $card.data("isextended")
            , isForcedFoilSet: $card.data("isforcedfoil")
            , isFoilOnly: $card.data("hasfoil") && !$card.data("hasnonfoil")
            , setCode: $card.data("setcode")
            , setType: $card.data("settype")
            , count: count
        }
    }

    function createCardData($card, count) {
        let data = createPayloadData($card, count)
        data.name = $card.data("name")
        data.isFoil = $card.data("isfoil")
        return data
    }

    function countUpdates() {
        let container = $(`.cardBox `)
        let persistedInputTracker = ""
        container.keyup(function (e) {
            let $this = $(this)
            if (isCardAdjustmentModifier(e)) {
                persistedInputTracker = e.key
                return
            }
            if (isCardAdjustmentInput(e)) {
                persistedInputTracker += e.key
                return
            }
            if (e.keyCode === 46/*delete*/ || e.keyCode === 110/*keypad decimal*/) persistedInputTracker = ""
            if (e.keyCode === 13/* enter key */) {
                if (persistedInputTracker === "") {
                    toasts.failure("No quantity entered")
                    return
                }
                let payload = createPayloadData($this, persistedInputTracker)
                let cardData = createCardData($this, persistedInputTracker);
                updateCardsToServer.massUpdate([payload], [cardData], function () {
                })
                persistedInputTracker = "";
            }
        });

        container.focus(function () {
            persistedInputTracker = ""
        });
    }


    return {
        registerEvents:countUpdates,
        payloadData:createPayloadData,
        cardData:createCardData,
        massUpdate:updateCardsToServer.massUpdate
    }
})()


let cardBoxEvents = function () {
    let imageFlip = function () {
        let $cardFlipper = $(`.cardFlipper`)

        $cardFlipper.click(function () {
            let img = $($(this).parent().find(`.cardImage`))
            if (img.data("currentface") === "front") {
                img.attr("src", img.data("backsrc"))
                img.data("currentface", "back")
            } else if (img.data("currentface") === "back") {
                img.data("currentface", "front")
                img.attr("src", img.data("frontsrc"))
            }
        })
    }

    let navigator = function () {
        function navigateGrid(gridSelector, activeClass, direction) {
            const grid = document.querySelector(gridSelector);
            const active = grid.querySelector(`${activeClass}`);
            const gridChildren = Array.from(grid.children);
            const activeIndex = gridChildren.indexOf(active);

            const gridNum = gridChildren.length;
            let offSetItem = undefined
            for (let i = 0; i < gridNum; i++) {
                let temp = gridChildren[i]
                let item = $(temp)
                if (!item.hasClass("itemShown")) continue

                offSetItem = temp
                break
            }
            if (offSetItem === undefined) return

            const baseOffset = offSetItem.offsetTop;
            const breakIndexInitial = gridChildren.findIndex(item => item.offsetTop > baseOffset);
            let hiddenChildren = 0
            for (let x = 0; x < breakIndexInitial; x++) {
                if ($(gridChildren[x]).hasClass("itemHidden")) {
                    hiddenChildren++
                }
            }
            let breakIndex = breakIndexInitial - hiddenChildren

            const numPerRow = (breakIndex === -1 ? gridNum : breakIndex);

            const updateActiveItem = (curIndex, moveCount, activeClass) => {
                let moved = 0
                let hiddenCount = 0
                let stepDirection = moveCount < 0 ? -1 : 1
                let champion = undefined
                let movedCheck = moveCount < 0 ? -moveCount : moveCount
                let startIndex = curIndex + stepDirection
                while (moved < movedCheck && hiddenCount <= gridChildren.length) {
                    let nextStep = (moved + hiddenCount) * stepDirection
                    let curIndex = startIndex + nextStep
                    if (gridNum <= curIndex) break
                    let challenger = $(gridChildren[curIndex])
                    if (!challenger.hasClass("itemShown")) {
                        hiddenCount++
                        continue;
                    }
                    moved++
                    champion = challenger
                }
                if (champion !== undefined) champion.focus()
            }

            const isTopRow = activeIndex <= numPerRow - 1;
            const isBottomRow = activeIndex >= gridNum - numPerRow;
            const isLeftColumn = activeIndex % numPerRow === 0;
            const isRightColumn = activeIndex % numPerRow === numPerRow - 1 || activeIndex === gridNum - 1;
            switch (direction) {
                case "up":
                    if (!isTopRow)
                        updateActiveItem(activeIndex, -numPerRow, activeClass);
                    break;
                case "down":
                    if (!isBottomRow)
                        updateActiveItem(activeIndex, numPerRow, activeClass);
                    break;
                case "left":
                    if (0 < activeIndex)
                        updateActiveItem(activeIndex, -1, activeClass);
                    break;
                case "right":
                    if (activeIndex + 1 < gridNum)
                        updateActiveItem(activeIndex, 1, activeClass);
                    break;
            }
        }

        let $cardBoxes = $(".cardBox")
        $cardBoxes.keyup(function (e) {
            /* nav by arrows */
            let direction = undefined
            switch (e.keyCode) {
                case 37:
                case 74://j
                    direction = "left"
                    break
                case 38:
                case 73://i
                    direction = "up"
                    break
                case 39:
                case 76://l
                    direction = "right"
                    break
                case 40:
                case 75://k
                    direction = "down"
                    break

            }
            if (direction !== undefined) {
                navigateGrid(".cardBoxes", ".cardBox:focus", direction)
            }
        });
    }

    let scrollIntoView = function () {
        let $cardBoxes = $(".cardBox")
        $cardBoxes.focus(function () {
            let $this = $(this)
            $([document.documentElement, document.body]).animate({
                scrollTop: $this.offset().top - (window.innerHeight / 2) + ($this.height() / 2)
            }, 100);
        })
    }

    scrollIntoView()
    navigator()
    imageFlip()
    cardUpdateEvents.registerEvents()
}