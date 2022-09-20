let loggedInUser = (function () {
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    let cachedUserData = undefined;

    function isValidUserId() {
        if (cachedUserData === false) return false;
        if (cachedUserData !== undefined) return true;
        loadUser()
        return false;
    }

    let debounceRefreshUser = debounce(refreshUser, 500, true)
    function loadUser() {
        debounceRefreshUser()
    }
    function refreshUser(alwaysRun) {
        $.ajax
        ({
            type: "GET",
            url: "/api/v1/user",
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            },
            success: function (data) {
                cachedUserData = data.user
            }
        })
            .fail(function () {
                cachedUserData = undefined
            }).always(alwaysRun)
    }

    function isCookieAuthnd() {
        if (cachedUserData !== undefined) return true;
        if (Cookies.get("token") !== undefined){
            loadUser()
            return true
        }
        return false
    }

    function cookieUserId(){
        return Cookies.get("uuid")
    }

    function cachedDisplayName() {
        let retValue ="&lt;&lt;Unknown&gt;&gt;"
        if(!!cachedUserData?.displayName) retValue = cachedUserData.displayName
        if(!!Cookies.get("displayName")) retValue = Cookies.get("displayName")
        if (!isValidUserId()) return retValue
    }

    function cachedUserId() {
        if (!isValidUserId()) return ""
        return cachedUserData.uuid
    }

    return {
        _debug:cachedUserData,
        userId: cachedUserId,
        displayName: cachedDisplayName,
        authenticates: isValidUserId,
        localAuthn : isCookieAuthnd,
        localUserId: cookieUserId,
        refresh : refreshUser,
    }
})();