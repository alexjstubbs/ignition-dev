/* Requested system events via client
-------------------------------------------------- */

var systemNotify    = require('./notification.init.js')
,   KeyEvent        = require('./navigation.keyEvent')
,   api             = require('socket.io-client')('/api')
,   React           = require('react/addons')
,   Modal           = require('../interface/Modal.jsx')
,   Messages        = require('../interface/Messages.jsx')
,   _               = require('lodash')
,   navigationInit  = require("./navigation.init.js")
,   dialog          = require("./dialogs");

// browser = require("./browser.js");

var events = {

	/* Trigger Next Screen 
	-------------------------------------------------- */
	nextScreen: function(parameters) {
		KeyEvent(221);
	},	

	/* Trigger Previous Screen 
	-------------------------------------------------- */
	previousScreen: function(parameters) {
		KeyEvent(219);
	},

    /* Focus form inputs on Action button/keypress
    -------------------------------------------------- */
    inputFocus: function(parameters) {
        var input = document.getElementsByClassName("selectedNav")[0];
        dialog.keyboard(input);
    },


    /* Close current Dialog
    -------------------------------------------------- */
    closeDialog: function(el) {
	
	    dialog.close();

	},

	/* General Dialog
	-------------------------------------------------- */
	openDialog: function(_type) {

		dialog.general(null, _type);
	
	},

    /* Press Key on OnScreen Keyboard
    -------------------------------------------------- */
    depressKey: function(parameters) {

        var upper, 
            keys 			= document.getElementsByClassName("_key"),
            activeInput 	= document.getElementById("keyboard-input-area"),
            recentInput 	= document.getElementsByClassName("activeInput")[0],
            _value 			= activeInput.value,
            type 			= document.querySelectorAll("[data-inputtype]")[0].getAttribute("data-inputtype"),
            cursor 			= document.querySelectorAll(".cursor");

        
        // Key is Uppercase
        if (document.getElementsByClassName("uppercase")[0]) {
            upper = true;
        }

        // Shift is active: unactivate
        if (document.getElementsByClassName("temp-uppercase")[0]) {

            _(keys).forEach(function(key, i) {
                key.classList.toggle("uppercase");
                key.classList.toggle("temp-uppercase");
            });
        }

   
        // Switch for keypress 
        switch (parameters) {

    	// Symbols
    	case "<i class='ion-code-working'></i>":

			var event = new CustomEvent('updateKeyboard', { 
			    'detail': {
			        type: "symbol",
			    }
			});

			window.dispatchEvent(event);

			return;

        // Cursor Left
        case "<i class='ion-arrow-left-b opacity-20'></i>":

	        
        	// = 8 or 9 ???
	        // console.log(cursor[0].offsetLeft);
	        // console.log(cursor[0].style.left);
	        
	        // activeInput.innerHTML = activeInput.innerHTML.slice(0,-1);

	        // console.log(cursor[0].offsetLeft);
	        // cursor[0].style.left = cursor[0].offsetLeft;


			// if (cursor[0].offsetLeft != 28) {

			// 		cursor[0].style.left = 7 + "px";
			// }

	        return;

        // Cursor Right
        case "<i class='ion-arrow-right-b opacity-20'></i>":

	        console.log(cursor[0].offsetLeft);
	        
	        if (cursor[0].offsetRight != 0) {
		        cursor[0].style.left = cursor[0].offsetLeft - 7 + "px";
	        }

	        return;
        
        // Accept
        case "<i class='ion-checkmark'></i>":
            dialog.close();
        return;

        // Space
        case "__":
            activeInput.innerHTML += " ";

            cursor[0].scrollIntoView(true);
            recentInput.scrollTop = cursor[0].offsetTop;

            return;

        // @
        case "<i class='ion-at'></i>": 
            activeInput.innerHTML += "@";

            cursor[0].scrollIntoView(true);
            recentInput.scrollTop = cursor[0].offsetTop;
            return; 

        // Return
        case "<i class='ion-arrow-return-left'></i>":

        	if (type != 'text') { 
				activeInput.innerHTML +="<br />";
				recentInput.value = activeInput.innerHTML.replace(/<br>/g, '\r\n');

	            cursor[0].scrollIntoView(true);
	            recentInput.scrollTop = cursor[0].offsetTop;
	        }

            return;

        // Delete
        case "<i class='ion-arrow-left-a'></i>":
            activeInput.innerHTML = activeInput.innerHTML.slice(0,-1);
            recentInput.value = activeInput.innerHTML;

            return;

        // Caps 
        case "<i class='ion-arrow-up-a'></i>":
            
            _(keys).forEach(function(key, i) { 
                key.classList.toggle("uppercase");
            });

            return;

        // Shift (Temp Caps)
        case "<i class='ion-ios7-arrow-thin-up'></i>": {
            
            _(keys).forEach(function(key, i) { 
                key.classList.toggle("uppercase");
                key.classList.toggle("temp-uppercase");
            });

            return;
        }

        // Letter / Alpha
        default:
            
            if (upper) { 
                parameters = parameters.toUpperCase(); 
                upper = false;
            }
            
            activeInput.innerHTML +=parameters;
            recentInput.value = activeInput.innerHTML.replace(/<br>/g, '\r\n');

            cursor[0].scrollIntoView(true);
            recentInput.scrollTop = cursor[0].offsetTop;
        }

    },

    /* Submit form on Action button/keypress
    -------------------------------------------------- */
    submitForm: function(parameters) {

        var form = document.forms[parameters].elements;
       
        var obj = new Object;

        _.each(form, function(input) { 
            if (input.name && input.value) {
               obj[input.name] = input.value;
            }
        });

        obj.formTitle = parameters;

        if (obj.server == "true") {
            console.log("server...");
            api.emit('request', { request: 'submitForm', param: obj });
        }

        else {
            console.log("write...");
            api.emit('request', { request: 'writeJSONSync', param: obj });
        }

    },

    /* Switch Emulator on Action button/keypress
    -------------------------------------------------- */
    switchEmulator: function(parameters) {

        var longname,
            list = document.querySelectorAll(".platform");

        _(list).forEach(function(item) { 
            item.classList.remove("selected");
            if (item.getAttribute("data-parameters") == parameters) {
                item.classList.add("selected");
                longname = item.textContent;
            }; 
        });

        api.emit('request', { request: 'gamesList', param: longname });
    },

    /* Drop navigation on sub-panels on Action button/keypress
    -------------------------------------------------- */
    highlightPanel: function(parameters) {
		KeyEvent(40);
    },

    /* View Messages event
    -------------------------------------------------- */
    viewMessages: function(parameters) {
        dialog.show();
        // React.renderComponent(Modal({children: Messages(null)}), document.getElementById("appendices"));
    },

    /* Launch selected game
    -------------------------------------------------- */
    launchGame: function(parameters) {
        // Do via sockets
    },

}


/* Exports
-------------------------------------------------- */
exports.events = events;



// module.exports = function(event, p) {

//         // Message 

//         if (event == 'input_focus') {
//             var input = document.getElementsByClassName("selectedNav")[0];
//             input.focus();
//         }

//         if (event == 'viewFriends') {
//             var title = "Uh Oh!"
//             var message = "4";
//             var height = 60;
//             var width = 70;
//             var left = 15;
//             systemNotify('/systemNotification/' + title + '/' + message, height, width, left);
//         }

//         if (event == 'demoMsg') {

//             var title = "Uh Oh!"
//             var message = "2";
//             var height = 62;
//             systemNotify('/systemNotification/' + title + '/' + message, height);

//             if (p) {

//                 var allBacks = document.querySelectorAll(".systemNotificationContentBackdrop");
//                 var allConts = document.querySelectorAll(".systemNotificationContent");

//                 document.body.removeChild(allConts[0]);
//                 document.body.removeChild(allBacks[0]);
//                 // document.body.removeChild(content);

//             }
//         }

//         if (event == 'community') {
//             var title = "Uh Oh!";
//             var message = "5";
//             var height = 85;
//             var width = 45;
//             var left = 25;
//             var top = 5;
//             systemNotify('/systemNotification/' + title + '/' + message, height, width, left, top);
//         }


//         if (event == 'demoGame') {
//             var title = "Uh Oh!"
//             var message = "3";
//             var height = 65;
//             var width = 65;
//             var left = 17;
//             systemNotify('/systemNotification/' + title + '/' + message, height, width, left);
//         }

//         // Close Lightboxes
//         if (event == 'closeLightbox') {

//             var backdrop = document.getElementById('backdrop');
//             var content = document.getElementById('lightbox');

//             content.className = "systemNotificationContent animated bounceOutDown";
//             backdrop.className = "systemNotificationContentBackdrop animated fadeOut";


//             setTimeout(function(e) {
//                 document.body.removeChild(content);
//                 document.body.removeChild(backdrop);
//             }, 2000);

//             var currentSelection = document.querySelectorAll(".navable");

//             currentSelection[0].classList.add("selectedNav");
//             // navigationBrowse(currentSelection[0]);

//             if (p) {
//                 var allBacks = document.querySelectorAll(".systemNotificationContentBackdrop");
//                 var allConts = document.querySelectorAll(".systemNotificationContent");

//                 document.body.removeChild(allConts[0]);
//                 document.body.removeChild(allBacks[0]);
//                 // document.body.removeChild(content);

//             }

//         }
//         // Large Profile Page
//         if (event == 'largeProfile') {

//             document.getElementsByClassName("Dashboard")[0].classList.add("hidden");
//             document.getElementsByClassName("Dashboard")[0].children[0].classList.remove("parent");
//             document.getElementsByClassName("Browser")[0].classList.add("hidden");
//             document.getElementsByClassName("Browser")[0].children[0].classList.remove("parent");
//             document.getElementsByClassName("browser_header")[0].classList.add("hidden");

//             document.getElementsByClassName("Profile")[0].classList.remove("hidden");
//             document.getElementsByClassName("Profile")[0].children[0].classList.add("parent");
//             document.getElementById("Profile").classList.remove("hidden");

//             document.getElementById("main").setAttribute("data-screen", "Profile");

//             navigationInit.navigationInit();


//             // var workingPack = document.querySelector('#alpha_list').getAttribute('data-parameters');

//             // var httpRequest = new XMLHttpRequest();
//             // httpRequest.open("GET", "../includes/screens.json", false);
//             // httpRequest.send()

//             // document.getElementById('content_load').style.display = 'none'

//             // var url = "http://localhost:1210/game/profile/large/" + p;

//             // var httpRequest = new XMLHttpRequest();
//             // httpRequest.onreadystatechange = function(data) {

//             //     {
//             //         if (httpRequest.readyState == 4 && httpRequest.status == 200) {

//             //             var fragment = document.createDocumentFragment();

//             //             var s = fragment.appendChild(document.createElement('div'));
//             //             s.setAttribute("data-package", workingPack);
//             //             s.innerHTML = httpRequest.responseText;
//             //             fragment.appendChild(s);

//             //             var recentObj = document.getElementById("working_params").innerHTML;

//             //             var objParsed = JSON.stringify(recentObj);
//             //             objParsed = JSON.parse(objParsed);

//             //             document.body.innerHTML = "";
//             //             document.getElementsByTagName('body').item(0).appendChild(fragment);

//             //             document.getElementById('profile-gametitle').innerHTML = removeBrackets(p).replace(/\.[^/.]+$/, "");
//             //             document.getElementById('play-game').setAttribute("data-parameters", workingPack);


//             //         }
//             //     }

//             // }

//             // httpRequest.open('GET', url);
//             // httpRequest.send();


//             // document.getElementById('content_load').style.display = ''



//         }

//         if (event == 'switchEmulator') {

//             var longname,
//                 list = document.querySelectorAll(".platform");

//             _(list).forEach(function(item) { 
//                 item.classList.remove("selected");
//                 if (item.getAttribute("data-parameters") == p) {
//                     item.classList.add("selected");
//                     longname = item.textContent;
//                 }; 
//             });

//             api.emit('request', { request: 'gamesList', param: longname });

//         }

//         if (event == 'highlightPanel') {
//             Mousetrap.trigger('down');
//         }


//         if (event == 'viewMessages') {
//             dialog.show();
//             // React.renderComponent(Modal({children: Messages(null)}), document.getElementById("appendices"));
//         }

//         if (event == 'launchGame') {
//             p = JSON.parse(p);

//             console.dir(p);
//             var path = p.pack[p.system].emulators[p.emulator].path;

//             var payload = p.base + " " + p.paramaters + " " + path + " \"/home/pi/roms/" + p.pack[p.system].short + "/" + p.rom + "\"";

//             // REST API

//             var handleResponse = function(status, response) {
//                 console.log(response)
//             }

//             var handleStateChange = function() {
//                 switch (xmlhttpl.readyState) {
//                     case 0: // UNINITIALIZED
//                     case 1: // LOADING
//                     case 2: // LOADED
//                     case 3: // INTERACTIVE
//                         break;
//                     case 4: // COMPLETED
//                         handleResponse(xmlhttpl.status, xmlhttpl.responseText);
//                         break;
//                     default:
//                         console.log("error")
//                 }
//             }

//             urllaunch = "http://localhost:1210/game/launch/";
//             var xmlhttpl = new XMLHttpRequest();
//             xmlhttpl.onreadystatechange = handleStateChange;
//             xmlhttpl.open("POST", urllaunch, true);
//             xmlhttpl.send(payload);



//             // // $(".launch").click(function(e) {
//             // //         e.preventDefault();
//             //         var e = "retroarch -L /home/pi/RetroPie/emulatorcores/fceu-next/fceumm-code/fceumm_libretro.so /home/pi/RetroPie/roms/nes/Contra.nes";
//             //         $.ajax({
//             //                     async: false,
//             //                     type: "POST",
//             //                     url: 'http://localhost:1210/game/launch',
//             //                     data: {launch: e},
//             //                     timeout: 5000,
//             //                     success: function (msg, status, jqXHR) { 
//             //                           // Do something on launch of game? Notify Server? Emit message?
//             //                                                             }
//             //                     });

//             //     // });

//             // need:
//             // Emulator Core
//             // Paramaters for RetroArch
//             // 

//             // Pass JSON node of selected emu and add game path?

//         }


// };