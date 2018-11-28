const Fs = require('fs-extra');
const Sass = require('node-sass');
const Autoprefixer = require('autoprefixer');
const Postcss = require('postcss');
const Glob = require("glob");
const Path = require('path');
const Notification = require('./notification');

const configAutoprefixer = {
    flexbox: "no-2009",
    remove: false,
    browsers: [
        "> 0%",
        "last 5 versions",
        "Firefox ESR",
        "not dead"
    ]
}

module.exports = class Style {

    constructor(path) {
        this.theme_path = path;
        this.theme_path_scss = Path.resolve(`${path}/assets/scss`);
        this.theme_scss = Path.resolve(`${this.theme_path_scss}/theme.scss`);
    }

    async render(path) {
        let file = Path.resolve(path || this.theme_scss);
        let file_name = Path.basename(file);
        try {
            Notification.info('Style compile', file_name);
            let outfile = Path.resolve(file.replace(/[^\.]scss\\?\/?/g, '/').replace('.scss', '.css'));

            await Sass.render({
                file: file,
                outputStyle: 'compressed',
                outFile: '',
                sourceMap: 'none'
            }, (error, result) => {
                if (!error) {
                    let css = result.css.toString();
                    this.processorCss(css, outfile);
                } else {
                    Notification.error(error);
                }
            });

        } catch (error) {
            Notification.error(error);
        }

    }

    async processorCss(css, outfile) {

        await Postcss([Autoprefixer(configAutoprefixer)])
            .process(css, { from: '', to: '', map: false })
            .then(result => this.writeCss(result.css, outfile))
            .catch(error => Notification.error('post ', error));

    }

    async writeCss(css, outfile) {

        try {
            css = css.replace(/"{{/g, '{{').replace(/}}"/g, '}}');
            css = css.replace(/"{%/g, '{%').replace(/%}"/g, '%}');

            await Fs.outputFileSync(`${outfile}.twig`, css);
        } catch (error) {
            Notification.error('wr ', error);
        }

    }

    async build() {
        await Glob(this.theme_path_scss + '**/*.scss', (error, files) => {

            let files_render = files.filter(file => {
                return file.indexOf('/partials') > 0;
            });

            files_render.push(this.theme_scss);

            files_render.forEach(file => {
                this.render(file);
            });
        });
    }
}