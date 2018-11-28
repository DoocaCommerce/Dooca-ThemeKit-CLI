const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const normalizeName = (name) => {
    let str = name.replace(' ', '-').replace('_', '-');
    return str;
}

const normalizePath = (path) => {
    let str = path.replace(/\\/g,'/');
    return str;
}

module.exports = {
    capitalize, normalizeName, normalizePath
}