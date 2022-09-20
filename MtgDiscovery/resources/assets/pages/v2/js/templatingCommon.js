
const generateAll = (...htmls) => ({html: () => {
        try {
            return htmls.reduce((agg, cur) => agg + " " + cur.html(), "");
        }catch(cause){
            let msg = `error running generateAll.`;
            console.log({htmls, msg, cause})
            console.log(cause)
            throw cause
        }
    }})

const loader = (content) => {
    return ({
        load: (async (classToReplace, methods = {onSuccess: undefined, onFailure: undefined, runAlways: undefined}) => {
            try {
                $(`.${classToReplace}`).replaceWith(await content.html())
                _runIfFunc(methods.onSuccess)
            }catch(cause){
                let msg = `error running loader for [classToReplace=${classToReplace}] with [content=${content}].`;
                console.log({msg, cause})
                console.log(content)
                console.log(cause)
                _runIfFunc(methods.onFailure)
            }

            _runIfFunc(methods.runAlways)
        })
    })
}

function _runIfFunc(target, args = undefined){
    if(typeof target !== "function") return

    if(args === undefined) target()
    else target(args)
}

const htmler = content => ({html: () => content})
const emptyHtml = htmler("")
