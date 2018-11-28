const Fs = require('fs-extra');
const Concat = require('concat');
const Glob = require("glob");
const Babel = require("@babel/core");
const Path = require('path');
const Notification = require('./notification');

module.exports = class Script {

    constructor(path) {
        this.theme_path = path;
        this.theme_path_js = `${path}/assets/js`;
    }

    async render(path) {

        try {
            await Glob(`${this.theme_path_js}/**/*.js`, (er, files) => {
                Notification.info('Script compile', 'theme.js');

                this.concatFile(files, `${this.theme_path}/assets/theme.js`, true);
            })

        } catch (error) {
            Notification.error(error);
        }

    }

    async concatFile(files, output, compile = false) {
        await Concat(files).then(result => {
            this.transpile(result, output, compile);
        })
    }

    async transpile(file, output, compile) {
        await Babel.transform(file, {
            compact: true,
            presets: [require('@babel/preset-env')]
        }, (error, result) => {
            if (!error) {
                this.writeFile(result.code, output, compile);
            } else {
                Notification.error(error);
            }
        });
    }

    async writeFile(js, file, compile) {
        let filePath = compile ? `${file}.twig` : file;

        js = js.replace(/"{{/g, '{{').replace(/}}"/g, '}}');
        js = js.replace(/"{%/g, '{%').replace(/%}"/g, '%}');

        try {
            await Fs.outputFileSync(filePath, js);
        } catch (error) {
            Notification.error(error);
        }

    }

    async build() {
        await this.render();
    }
}