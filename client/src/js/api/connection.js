/* Sockets.io api
-------------------------------------------------- */
var io      = require('socket.io-client')
,   api     = io.connect(window.location.hostname+"/api", { 'timeout': 999999999999999999, 'reconnection limit' : 1000, 'max reconnection attempts' : 'Infinity'})
,   events  = require('../system.events').events
, 	dialog  = require('../dialogs');

/* Module Definitions
-------------------------------------------------- */

var connect = function() {

    api.on('connect', function(){

   	// Offset List roms? or list roms on switch tab
    //  setTimeout(function() {
    //     api.emit('request', { request: 'listRoms', param: "Nintendo" });
    // }, 2000);

  });


  /* Server to Client Notification
  -------------------------------------------------- */
  api.on('messaging', function(data) {

		  dialog.general(null, data.type, data.body, data.dataFunction, data.dataParameters, data.button);

	});


  /* Server to Client Communication
  -------------------------------------------------- */
  api.on('clientEvent', function(data) {

      events[data.command](data.params);

  });

  /*  Process Storage for Play Sessions
  -------------------------------------------------- */
  api.on('processStorage', function(data) {

      sessionStorage.setItem("processStorage", JSON.stringify(data));

  });

};

/* Exports
-------------------------------------------------- */
exports.connect = connect;
exports.api     = api;
