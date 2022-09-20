let user = (function () {
    let _user = (function (methods) {
        return {
            userId: methods.userId,
            isLoggedIn: methods.isLoggedIn,
            isNotLoggedIn: () => !methods.isLoggedIn(),
        }
    })

    let collectorUser = (function () {
        async function name() {
            return await api.user.name()
        }

        return {name}
    })()

    let cookieUser = (function () {
        function _parseJwt(jwt) {
            if (jwt === undefined) return undefined
            var base64Url = jwt.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        function safeParseJwt(jwt) {
            let result = _parseJwt(jwt)
            if (result !== undefined) return result

            return {
                //Expand this for utilized fields
                exp: -1
            }
        }

        const displayName = () => Cookies.get("displayName")
        const userId = () => Cookies.get("uuid");
        const token = () => Cookies.get("token");
        const hasToken = () => token() !== undefined;
        const isLoggedIn = () => hasToken && isNotExpired();

        function isNotExpired() {
            let expirationTime = safeParseJwt(token()).exp * 1000;
            let nowTime = Date.now();
            return nowTime < expirationTime
        }

        return {
            userId: userId,
            isLoggedIn: isLoggedIn,
            isNotLoggedIn: () => !isLoggedIn(),
            displayName:displayName
        }
    })()

    return {
        active: cookieUser,
        collectorUser: collectorUser
    }
})()
