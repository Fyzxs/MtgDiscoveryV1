function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function onSpacePascalCase(input) {
    let split = input.split(' ')
    for (let i = 0; i < split.length; i++) {
        split[i] = split[i].slice(0, 1).toUpperCase() + split[i].slice(1, split[i].length);
    }
    return split.join(' ')
}

function browserUserId() {
    return getParameterByName("ctor")
}

function browserCode() {
    return getParameterByName("setCode")
}

function browserArtist() {
    return onSpacePascalCase(getParameterByName("artist"))
}

function browserCardName() {
    return onSpacePascalCase(getParameterByName("cardName"))
}

let globals = (function () {
    function cardBoxId(cardData) {
        return `#cardbox_${cardData.isFoil ? "foil" : "nonFoil"}_${cardData.uuid}`
    }

    return {
        cards: {
            selector: "",
            showSet: false,
            showArtist:true,
            linkName:true,
            card: {
                selector: cardBoxId
            }
        },
        sets: {
            selector: "",
            set: {
                selector: ""
            }
        },
        manipulations: {
            container: {
                selector: ""
            },
            sort: {
                selector: "",
                defaults:{
                }
            },
            filter: {
                selector: ""
            },
            display: {
                selector: ""
            },
            dangerZone: {
                selector: ""
            }
        }
    }
})()

let applyFooter = (function () {
    $("body").append(`<div class="fixedBottom footer footerContainer">
<div class="footerLinkContainer">© 2021 MTG Discovery * <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a> * <a href="/about">About</a><div>
<div class="footerLinkContainer" style="display:inline">MTG Discovery is unofficial Fan Content permitted under the <a href="https://company.wizards.com/fancontentpolicy">Fan Content Policy</a>. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.</div><br/>
<div class="footerLinkContainer" style="display:inline">Anything else is the property of the respective owner. This site is not approved/endorsed by them.</div>
</div>`)
})

let applyHeader = (function () {
    $("body").prepend(`<div class="headerContainer fixedTop">
    <div class="headerContent">
        <div style="display: inline; position: relative; left:0; " class="mainMenuContainer">
            <div class="menuItem menuAuth tooltip">
                <img style="height:25px;width:25px;" alt="info" src="/img/info.png">
                <div class="tooltiptext">
                    <p><strong><em>Add Cards</em></strong>: Card in focus; hit # to add, hit ENTER</p>
                    <p><strong><em>Remove Card</em></strong>: Card in focus; hit - then # to remove, hit ENTER</p>
                    <p><strong><em>Navigate Cards</em></strong>: TAB, SHIFT+TAB and arrows will move to another card</p>
                    <p><strong><em>SHIFT, SHIFT</em></strong>: Clear and focus to text search box</p>
                </div>
            </div>
            <div class="menuItem"><a href="/">Home</a></div>
            <div class="menuItem"><a href="/allSets">Sets</a></div>
            <div id="yourSets" class="menuItem" style="display: none"><a href="/allSets">Your Collection</a></div>
        </div>
        <div style="display: inline; position: relative; right:0; " class="userMenuContainer">
            <div class="menuItem menuNoAuth" style="display: none"><a href="/signin">Login</a></div>
            <div class="menuItem menuNoAuth" style="display: none"><a href="/register">Register</a></div>
            <div class="menuItem menuAuth" style="display: none"><a href="/profile">Profile</a></div>
            <div class="menuItem menuAuth" style="display: none"><a id="logout" href="#">Log Out</a></div>
        </div>
    </div>
</div>`)
})

let always = (function () {
    applyHeader()
    applyFooter()

    function yourSets() {
        let $yourSets = $("#yourSets");

        if (loggedInUser.authenticates()) {
            $yourSets.show()
            $yourSets.find('a').prop("href", `/allSets?ctor=${loggedInUser.localUserId()}`)
        }
    }

    function updateHeader() {
        if (loggedInUser.authenticates()) {
            $(".menuNoAuth").hide()
            $(".menuAuth").show()
            yourSets()
        } else {
            $("#yourSets").hide()
            $(".menuNoAuth").show()
            $(".menuAuth").hide()
        }
    }

    loggedInUser.refresh(updateHeader)

    $("#logout").click(function () {
        Cookies.remove("token")
        Cookies.remove("displayName")
        Cookies.remove("userid")

        window.location.replace("/");
    })
})