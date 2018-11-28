const Colors = require('colors');

const title = () => {
    return `${Colors.cyan('[ Dooca CLI ]')}`;
}

const info = (msg, ext = '') => {
    console.log(`${title()} ${Colors.white(msg)} ${Colors.yellow(ext)}`);
}

const event = (msg) => {
    console.log(`${title()} ${Colors.magenta(msg)}`);
}

const success = (msg) => {
    console.log(`${title()} ${Colors.green(msg)}`);
}

const error = (msg) => {
    console.log(`${title()} ${Colors.red(msg)}`);
}

module.exports = {
    info,
    event,
    success,
    error
}
