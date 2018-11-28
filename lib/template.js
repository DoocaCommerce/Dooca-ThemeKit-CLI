const Fs = require('fs-extra');
const Notification = require('./notification');
const Utils = require('./utils');
const baseTemplate = require('../templates/base');
const { createConfig, getConfig } = require('../lib/config.js');

const createTemplate = (template, type) => {
    let name = Utils.normalizeName(template);
    let templateTwig = type == 'sections' ? baseTemplate.section(name) : baseTemplate.twig(name);
    let templateScss = baseTemplate.scss(name);

    getConfig().then((exists) => {
        try {
            Fs.outputFileSync(`./${global.config.theme_id}/${type}/${name}.twig`, templateTwig);
            Fs.outputFileSync(`./${global.config.theme_id}/assets/scss/${type}/${name}.scss`, templateScss);
            Notification.success(`${Utils.capitalize(type)} created`);
        } catch (error) {
            Notification.error(error);
        }
    }).catch(() => {
        createConfig();
    });
};

module.exports = {
    section: (template) => {
        createTemplate(template, 'sections');
    },
    snippet: (template) => {
        createTemplate(template, 'snippets');
    },
    template: (template) => {
        createTemplate(template, 'templates');
    }
}