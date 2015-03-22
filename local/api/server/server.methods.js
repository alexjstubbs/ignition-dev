/* Ignition Server Messaging Methods
-------------------------------------------------- */
// var io = require('socket.io-client')('/api');
var server = require(__base + 'api/server/server.api');

var methods = {

    friend_online: function(object){
        console.log("A FRIEND ONLINE!");
        console.log(object);
        __api.emit('clientEvent', {command: "friendNotification", params: JSON.stringify(object) });
    },

    friend_offline: function(object){
        console.log("A FRIEND offline!");
        console.log(object);
    },

    message_sent: function(object){
        console.log(object);
        __api.emit('clientEvent', {command: "confirmShow", params: object.result.message });
    },

    new_message: function(object, nsp){
        console.log(object);
        server.getMessages(nsp);
    }

};

/* Exports
-------------------------------------------------- */
exports.networkMethod = methods;
