/* Dialogs and Modals interface
-------------------------------------------------- */

var systemNotify    = require('./notification.init.js')
,   api             = require('socket.io-client')('/api')
,   React           = require('react/addons')
,   Modal           = require('../interface/Modal.jsx')
,   Messages        = require('../interface/Messages.jsx')
,   Popup           = require('../interface/Popup.jsx')
,   SignUp          = require('../interface/forms/SignUp.jsx')
,   _               = require('lodash')
,   navigationInit  = require("./navigation.init.js")
,   Keyboard        = require("../interface/OnScreenKeyboard.jsx");


/* General Message Dialog
-------------------------------------------------- */
var popup = function(obj, callback) {

    var div = document.createElement("div");
    div.classList.add("ignition-modal", "ignition-popup");
    document.body.appendChild(div);

    React.renderComponent(Modal({children: SignUp(null)}), div);
}

/* Show Modal
-------------------------------------------------- */
var show = function(title, content, callback) {

    var div = document.createElement("div");
    div.classList.add("ignition-modal");
    document.body.appendChild(div);

    React.renderComponent(Modal({children: SignUp(null)}), div);
}

/* Show Keyboard
-------------------------------------------------- */
var keyboard = function(input, callback) {

    var div = document.createElement("div");
    div.classList.add("ignition-modal", "ignition-keyboard");
    document.body.appendChild(div);

    React.renderComponent(Modal({children: Keyboard(null)}), div);
    
    var activeInputs = document.querySelectorAll(".activeInput")[0];
    activeInputs.classList.remove("activeInput");
    input.classList.add("activeInput");
}

/* Exports
-------------------------------------------------- */
exports.show = show;
exports.keyboard = keyboard;
exports.popup = popup;

