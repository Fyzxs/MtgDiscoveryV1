let env = (function () {

    let url = new URL(window.location.href)

    let isDev = () => url.hostname.toLowerCase() === "localhost"
    let isProd = () => !isDev()

    return {
        isDev,
        isProd
    }
})()