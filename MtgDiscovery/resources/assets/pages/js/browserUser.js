let browserUser = (function () {
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
    let key = "ctor"
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var cachedBrowserUserId = undefined

    function browserUserId() {
        if (cachedBrowserUserId === undefined) {
            cachedBrowserUserId = getParameterByName(key)
        }
        return cachedBrowserUserId;
    }

    let loadCachedUserData = debounce(loadUser, 250, true)
    var cachedUserData = undefined
    function noCachedData() {
        if(cachedUserData !== undefined) return false;
        loadCachedUserData()
        return true;
    }

    function loadUser()
    {
        let userId = browserUserId();
        if(!userId || userId.length < 32) {
            cachedUserData = false//and no refresh for you!
            return
        }
        $.get(`/api/v1/user/${userId}`, function (data) {
            cachedUserData = data
        })
        .fail(function () {
            cachedUserData = undefined
        });
    }

    function isValidUserId() {
        if (noCachedData()) return !!browserUserId();
        let userId = cachedUserData.uuid
        return userId && 0 <= userId.length
    }

    function cachedDisplayName() {
        if (!isValidUserId()) return "Unknown User";
        if(noCachedData()) return "User Unknown";
        return cachedUserData.displayName;
    }

    function cachedUserId() {
        if (!isValidUserId()) return "";
        if(noCachedData()) return browserUserId();
        return cachedUserData.uuid;
    }

    function userIdUrlPath() {
        return browserUser.userExists() ? `/${browserUser.userId()}` : ""
    }
    function userIdUrlQuery(prefix) {
        return browserUser.userExists() ? `${prefix}${key}=${browserUser.userId()}` : ""
    }


    loadUser()
    return {
        userExists: isValidUserId,
        userId: cachedUserId,
        displayName: cachedDisplayName,
        userIdUrlPath:userIdUrlPath,
        userIdUrlQuery:userIdUrlQuery
    }
})();