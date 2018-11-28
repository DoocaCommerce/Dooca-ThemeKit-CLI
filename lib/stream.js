const Fs = require('fs-extra');
const Promise = require("bluebird");
const Axios = require('axios');
const AdmZip = require('adm-zip');
const Notification = require('./notification');
const Utils = require('./utils');

module.exports = class Stream {

    constructor(path) {
        this.files = {};
        this.timer = null;
    };

    add(path) {
        return new Promise((resolve, reject) => {
            if (this.timer) {
                clearTimeout(this.timer);
            }

            Fs.readFile(path, (error, contents) => {
                
                if (error) throw err;

                let file_path = path.replace(global.theme_folder, '');
                let regex = new RegExp(/\.(jpg|jpeg|png|pdf|gif)$/i);
                let content = regex.test(file_path) ? contents.toString('base64') : contents.toString();

                let file = {
                    file: Utils.normalizePath(file_path),
                    data: content
                }

                this.files[file.file] = file;

                this.timer = setTimeout(() => {
                    this.send().then((response) => {
                        Notification.success('File uploaded');
                        return resolve(response);
                    }).catch(error => {
                        return reject(error);
                    });
                }, 200);
            })
        })
    };

    async send() {
        let data = Object.values(this.files);

        if (data.length > 0) {
            Notification.event('Uploanding...');
            return await Axios({
                method: 'post',
                url: `${global.server}/stream.php`,
                headers: {
                    'shop-id': global.config.shop_id,
                    'theme-id': global.config.theme_id,
                    'token': global.config.token
                },
                data: JSON.stringify(data)
            });
        }
    };

    async compactTheme() {
        Notification.event('Compressing...');

        let zip = new AdmZip();
        let file = `${global.base_dir}/${global.config.theme_id}.zip`;

        zip.addLocalFolder(global.theme_folder);
        await zip.writeZip(file);
    };

    async uploadTheme() {
        Notification.event('Uploading...');

        let theme = `${global.base_dir}/${global.config.theme_id}.zip`;
        await theme;
    };

    async downloadTheme() {
        Notification.event('Downloading...');

        const url = '';
        const path = `${global.base_dir}`;

        const response = await Axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        response.data.pipe(Fs.createWriteStream(path))

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                Notification.success('Theme downloaded');
                resolve()
            })

            response.data.on('error', error => {
                reject(error)
            })
        });
    };
}