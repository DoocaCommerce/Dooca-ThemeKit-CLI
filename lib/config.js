const Fs = require('fs-extra');
const { prompt } = require('inquirer');
const Promise = require("bluebird");
const Path = require('path');
const ServerDev = require('./server.js');
const Notification = require('./Notification.js');

const configAnswers = [{
    type: 'input',
    name: 'shop_id',
    message: 'Shop id from your e-commerce'
},
{
    type: 'input',
    name: 'theme_id',
    message: 'Default theme for development'
},
{
    type: 'input',
    name: 'token',
    message: 'Token access'
}];

const writeConfig = (file) => Fs.outputFile(`${global.base_dir}/dooca-config.json`, file);

const getConfig = () => {
    const path_config = `${global.base_dir}/dooca-config.json`;
    global.config = null;

    return new Promise((resolve, reject) => {
        Fs.readJson(path_config)
            .then(content => {
                if (content) {
                    global.config = content;
                    return resolve(true);
                } else {
                    return reject(false);
                }
            }).catch(error => reject(false));
    })
}

const createConfig = () => {
    Notification.info('Init config:');

    prompt(configAnswers).then(answers => {

        let content = JSON.stringify({
            "shop_id": answers.shop_id,
            "theme_id": answers.theme_id,
            "token": answers.token
        });

        writeConfig(content).then(() => {
            getConfig().then(() => {
                Notification.success('Config created');
                ServerDev();
            });
        }).catch(error => {
            Notification.error(error);
        });

    });

};

module.exports = {
    createConfig,
    getConfig
};