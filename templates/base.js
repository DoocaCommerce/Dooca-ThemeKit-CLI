const Utils = require('../lib/utils');

const section = (name) => {
    let template = '<div class="' + name + '">\n\t<div class="' + name + '__container"></div>\n</div>\n\n{% schema %}\n\t{\n\t\t"name": "' + name + '",\n\t\t"category": "",\n\t\t"content_for_index": "1",\n\t\t"settings": [],\n\t\t"blocks": []\n\t}\n{% endschema %} ';

    return template
}

const twig = (name) => {
    let template = '<div class="' + name + '">\n\t<div class="' + name + '__container"></div>\n</div>';

    return template
}

const scss = (name) => {
    let className = Utils.capitalize(name.replace('-', ' '));
    let template = '/**\n* ' + className + '\n**/\n\n.' + name + ' {\n\t&__container{}\n}';

    return template
}

module.exports = {
    section, twig, scss
}