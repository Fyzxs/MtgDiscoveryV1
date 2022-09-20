let _queryParam = function(key){
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const available = () => !!value()
    const absent = () => !available()
    const value = () => getParameterByName(key)
    const _incParam = (join, val) => {
        return `${join}${key}=${val}`;
    }
    const _asParam = (join) => {
        if(absent()) return ""
        return _incParam(join, value())
    }
    const incParam = (val) => _incParam("&", val)
    const incParamStart = (val) => _incParam("?", val)
    const asParam = () => _asParam("&")
    const asParamStart = () => _asParam("?")

    return {
        available,
        absent,
        value,
        asParamStart,
        asParam,
        incParamStart,
        incParam,
    }
}

let urlInfo = (function () {
    let localeKey = "loc"
    let ctorKey = "ctor"
    let setKey = "set"
    let cardKey = "cardName"
    let artistKey = "artist"

    return {
        locale: _queryParam(localeKey),
        ctor: _queryParam(ctorKey),
        set: _queryParam(setKey),
        card: _queryParam(cardKey),
        artist: _queryParam(artistKey),
        path: {lastSegment: window.location.pathname}

    }
})()

