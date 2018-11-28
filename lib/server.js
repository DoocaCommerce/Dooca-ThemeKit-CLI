const base_dir = global.base_dir;
const Style = require('./style');
const Script = require('./script');
const Stream = require('./stream');
const Notification = require('./notification');
const Utils = require('./utils');
const BrowserSync = require('browser-sync');
const Path = require('path');
const Chokidar = require('chokidar');
const chokidarConfig = {
    persistent: true,
    ignored: '*.min.*',
    ignoreInitial: true
};

module.exports = (shop, theme) => {
    Notification.event('Init server...');

    global.config.shop_id = shop || global.config.shop_id;
    global.config.theme_id = theme || global.config.theme_id || 'default';
    global.theme_folder = Path.resolve(`${base_dir}/${global.config.theme_id}/`);
    global.server = `https://${global.config.shop_id}.dooca.store`
    let style = new Style(theme_folder);
    let script = new Script(theme_folder);
    let stream = new Stream(theme_folder);
    let sync = BrowserSync.create();
    let pathWatch = Path.resolve(global.theme_folder + '/**/*.*');

    if (global.config.env == 'localhost') {
        global.server = `http://${global.config.shop_id}.dooca.local`
    }

    style.build();
    script.build();

    sync.init({
        notify: false,
        logLevel: 'silent',
        open: false,
        https: global.config.env == 'localhost' ? false : true,
        proxy: {
            target: global.server
        }
    });
    
    Chokidar.watch(Utils.normalizePath(pathWatch), chokidarConfig).on('all', (event, path) => {
        
        let ext = Path.extname(path).replace('.', '');

        if (event == 'change') {
            if (ext == 'scss') {
                let partial = path.indexOf('partials') > 0;
                let checkout = path.indexOf('checkout') > 0;
                let temp_path = partial ^ checkout ? path : null;
                
                style.render(temp_path).then(() => upload(path));
            }

            if (ext == 'js') {
                script.render(path).then(() => upload(path));
            }

            if (['twig', 'json', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'svg', 'gif'].includes(ext)) {
                upload(path);
            }
        }

        if (event == 'add') {
            if (['twig', 'js', 'json', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'svg', 'gif'].includes(ext)) {
                upload(path);
            }
        }
    });

    function upload(path) {
        
        stream.add(path).then(() => {
            sync.reload();
            Notification.event('Reloading Browsers...')
        }).catch((error) => {
            Notification.error(error);
        });

    };

};