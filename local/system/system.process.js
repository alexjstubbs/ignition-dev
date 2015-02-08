/*  Proccess' Functions
-------------------------------------------------- */
var exec = require('child_process').exec;

/*  Kill All
-------------------------------------------------- */
var killall = function(nsp, p

    exec('killall '+params, function(stderr, stdout) {

        if (nsp) {
            nsp.emit({stdout: stderr, stderr: stderr});
        }

        if (callback) {
            callback(stderr, stdout);
        }

    });
};

/*  Send Signal
-------------------------------------------------- */
var signal = function(nsp, params, callback) {

    exec('killall -s '+params.signal+' '+params.processname+'', function(stderr, stdout) {

        if (nsp) {
            nsp.emit({stdout: stderr, stderr: stderr});
        }

        if (callback) {
            callback(stderr, stdout);
        }

    });
};

/*  Kill
-------------------------------------------------- */
var kill = function(nsp, params, callback) {

    exec('kill '+params, function(stderr, stdout) {

        if (nsp) {
            nsp.emit({stdout: stderr, stderr: stderr});
        }

        if (callback) {
            callback(stderr, stdout);
        }

    });
};

/*  Exports
-------------------------------------------------- */
exports.killall = killall;
exports.signal  = signal;
exports.kill    = kill;
