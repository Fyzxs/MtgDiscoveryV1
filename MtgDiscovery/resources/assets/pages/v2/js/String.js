String.prototype.format = function (...args) {
    let content = this.toString();
    for (let i = 0; i < args.length; i++) {
        let replacement = '\{' + i + '\}';
        let arg = args[i];
        content = content.replace(replacement, arg);
    }
    return content;
};