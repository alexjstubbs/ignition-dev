/**
 * Ignition Client.
 * License: Q Public License 1.0 (QPL-1.0)
 * Copyright (c) Alexander Stubbs. All Rights Reserved.
 * BETA v0.91
 */

/* Dev. run enviorment
-------------------------------------------------- */

var _begin = Math.floor(Date.now() / 1000);

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
,   busboy                  = require('busboy')
,   methodOverride          = require('method-override')
,   app                     = common.express()
,   http                    = require('http').createServer(app);

global.__io                 = require('socket.io').listen(http);
global.__api                = __io.of('/api');
global.__sessionFile        = appDir+"/config/profiles/Session.json";

/* Initial Setup
-------------------------------------------------- */
var firstrun = false
,   _location;

if (firstrun) {
    _location = 'http://127.0.0.1:1210/welcome';
}

else {
    _location = 'http://127.0.0.1:1210/home';
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


/* Client Routes
-------------------------------------------------- */
// Sign Up (initial)
app.get('/welcome', common.render.ignite);
app.get('/agreement', common.render.ignite);
app.get('/WifiConfig', common.render.WifiConfig);

// Profiles
app.get('/profiles', common.render.ignite);

// Dashboard
app.get('/home', common.render.ignite);
app.get('/home/:username', common.render.ignite);

app.get('/database/:database', common.databases.getGamesAjax);
app.get('/games/:platform/:name', common.db.gameImage);



/* Server Initialization
-------------------------------------------------- */

console.log(Math.floor(Date.now() / 1000) - _begin);

http.listen(1210, "127.0.0.1", function(err, result) {

    console.log("[info]: Ignition Client Launched.");

    var api = require('./local/api/api');

    common.databases.initDatabases();

    api(__api);

    if (process.platform != 'darwin') {

        var exec = require('child_process').exec;

        var child = exec('setsid nice -12 qtbrowser --webkit=1 --missing-image=no --inspector=9945 --validate-ca=off --full-viewport-update --transparent --url='+_location+' | killall qmlscene');

        child.stdout.on('data', function(data) {
            console.log('(stdout) | ' + data);
        });
        child.stderr.on('data', function(data) {
            console.log('(stderr) | ' + data);
        });

    }

});

// Terminal Fork
// var child = require('child_process').fork('ignition_modules/tty/terminal.js');

// fs.openSync('/mnt/ramdisk/working.ram', 'w');
