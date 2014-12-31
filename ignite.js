/**
 * Ignition Client.
 * License: Q Public License 1.0 (QPL-1.0)
 * Copyright (c) Alexander Stubbs. All Rights Reserved.
 * BETA v0.91
 */

/* Dev. run enviorment
-------------------------------------------------- */

if (process.platform == 'darwin') {
    process.env.NODE_ENV    = 'osx';

}

else {
    process.env.NODE_ENV    = 'pi';
}

global.config               = require('konfig')();

var path                    = require('path');
global.appDir               = path.dirname(require.main.filename);

/* Module dependencies
-------------------------------------------------- */
var common                  = require('./local/common')
,   express                 = require('express')
,   busboy                  = require('busboy')
,   methodOverride          = require('method-override')
,   app                     = express()
,   http                    = require('http').createServer(app)
,   fs                      = require('fs-extra')
,   api                     = require('./local/api/api')
,   Insight                 = require('insight')
,   pkg                     = require('./package.json');

global.__io                 = require('socket.io').listen(http);
global.__api                = __io.of('/api');
global.__sessionFile        = appDir+"/config/profiles/Session.json";

api(__api);

//
// var child = require('child_process').fork('ignition_modules/tty/terminal.js');



/* Initial Setup
-------------------------------------------------- */
var firstrun = true;

if (firstrun) {
    // Launch Renderer to Welcome / iNet check

    // ask for reporting permission the first time
    // if (insight.optOut === undefined) {
    //     return insight.askPermission();
    // }

}

else {
    // Launch Renderer To Dashboard
}

/* Server Configurtation
-------------------------------------------------- */

app.set('views', './local/render/');

app.engine('mustache', common.mu2express.engine);
app.set('view engine', 'mustache');

app.use(methodOverride());

app.use(app.router);
app.use(common.express.compress());
app.use(common.express.static(__dirname + '/client'));
app.use(common.express.errorHandler());

/* Anonymous Analytics OPT-IN
-------------------------------------------------- */
var insight = new Insight({
    // Google Analytics tracking code
    trackingCode: 'UA-54752042-1',
    packageName: pkg.name,
    packageVersion: pkg.version
});

insight.optOut = false;

insight.track('ignition', 'beta');

/* Client Routes
-------------------------------------------------- */
// Sign Up (initial)
app.get('/welcome', common.render.ignite);
app.get('/agreement', common.render.ignite);
app.get('/EULA', common.render.EULA);
app.get('/WifiConfig', common.render.WifiConfig);

// Profiles
app.get('/profiles', common.render.ignite);

// Dashboard
app.get('/home', common.render.ignite);
app.get('/home/:username', common.render.ignite);

app.get('/database/:datbase', common.databases.getGamesAjax);
app.get('/games/:platform/:name', common.db.gameImage);


/* Server Initialization
-------------------------------------------------- */

http.listen(1210, "127.0.0.1");

console.log("[i] Ignition Client Launched.");

common.databases.initDatabases();

// fs.openSync('/mnt/ramdisk/working.ram', 'w');
