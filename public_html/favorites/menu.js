/*******************************************************************************************
 * menu.js
 *
 *	Provides the core logic for generating the main menu, as well as supporting its actions.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created December 2014 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		2015.03.13 	v1.1	Implemented versioning, Fixed menuAction_launchMode bug when node_bodywrapper exists
 *	
 *******************************************************************************************/
var versionInfoForJavascriptFile_menu = {	//NOTE: <-- change name!
	version : "1.2",
	build : "2015.03.13"
	};


/*
function updateMenu(){
// DEV-NOTE: need to go through entire menu and update visbility settings for each item, as needed (e.g. don't show "Edit" if we're already in edit, etc.)
	FavScreen.log('warn', "DEV-NOTE: need to develop updateMenu()", true);
	var menuRootNode = FavScreen.menu.rootNode;
	FavScreen.menu.traverseNode(menuRootNode, function(menuItem) {
		FavScreen.log('log', menuitem, true);
		YUI().use('node', function(Y){
			});//end YUI.use
		});//end traverseNode method
}//end function updateMenu()
*/

/* Various support stuff for menu */
function menuAction_launchMode() {
	if(document.getElementById("iframe_toResolveMsg")) {
	/*if(typeof FavScreen.node_bodywrapper === 'object') {*/									//if legacy iframe is loaded (indicated by a saved node existing - which is what an iframe-load does), first need to restore things
		restoreSavedNode_fromLegacyIframe();
	}
	FavScreen.set("attrInteractionMode", MODE_LAUNCHABLE);									//change the page's mode
	FavScreen.applyCookieZoom();
}//end function menuAction_launchMode()

function menuAction_makeChanges() {
	zoomControls_doZoom("100%");															//temporarily set zoom level to normal, so dragging works right (temporary, so don't set attribute/cookie)
	FavScreen.set("attrInteractionMode", MODE_EDITABLE);									//change the page's mode
}//end function menuAction_makeChanges()

function menuAction_deletedFavs() {
	FavScreen.set("attrInteractionMode", MODE_DELETED);										//change the page's mode
}//end function menuAction_deletedFavs()

function menuAction_purgeUserDeletedFavs(userPin) {
	if (typeof userPin === "undefined") {													//if userPin was not provided...
		if(Boolean(CURRENT_USER_PIN)) {															//if the global setting exists, use it
			userPin = CURRENT_USER_PIN;
		}
		else {																					//else, abort (server must have this value)
			FavScreen.log('error', "menu.js: menuAction_purgeUserDeletedFavs(): User-pin was not provided and could not be determined. Aborting.", true);
			return false;
		}
	}
	if (typeof FAVS_NAME_PLURAL === "undefined") {
		var FAVS_NAME_PLURAL = "records";
	}
	if(!window.confirm("WARNING!\nThis action will permanently delete all "+FAVS_NAME_PLURAL+" marked as deleted, for "+userPin+"!\n\nContinue anyway?")) {
		return false;
	}
	Spinner.show();
	var ignoreChangeInIP = SERVER_VALUE_TRUE;												//initialize a default value, just in case there's no function to specify it next
	if (typeof determineShouldIgnoreChangeInIP === "function") {
		ignoreChangeInIP = determineShouldIgnoreChangeInIP();
	}
	YUI().use("io", "io-base", function(Y) {
		var handleStart = function(ioId, o) {													//what should happen when the io txn starts
			FavScreen.log('log', "menu.js: menuAction_purgeUserDeletedFavs(): Starting txn to purge user's deleted records from the database... YUI-IO txn ID# will be: "+ioId+".", true);
			};
		var handleSuccess = function(ioId, o) {													//response HTTP status resolves to 2xx
			FavScreen.log('log', "menu.js: menuAction_purgeUserDeletedFavs(): Txn #"+ioId+" succeeded. Calling refreshRecordset()...", true);
			Spinner.hide();
			refreshRecordset(userPin, true);
			};
		var handleFailure = function(ioId, o) {													//response HTTP status resolves to 4xx, 5xx, undefined, or a non-standard HTTP status
			Spinner.hide();
			FavScreen.log('error', "menu.js: menuAction_purgeUserDeletedFavs(): Txn #"+ioId+" failed or timed-out (view 'log' console log for details).", true);
			FavScreen.log('log', "menu.js: menuAction_purgeUserDeletedFavs(): Txn #"+ioId+"'s responseText returned by server = '"+o.responseText+"'", false);
			window.alert("There was a problem updating the database (menuAction_purgeUserDeletedFavs). YUI-IO reports failure communicating with SMCGI process.");
			};
		var cfg = {																				//setup a standard YUI configuration object for our transaction
			on:{																					//for transaction events...
				start:handleStart,																		//subscribe the above custom start handler to IO's global start event
				success:handleSuccess,																	//subscribe the above custom success handler to IO's global success event
				failure:handleFailure																	//subscribe the above custom failure handler to IO's global failure event
				},
			method:"POST",																			//method will default to GET unless we specify POST here
			data:{																					//define whatever fields/data that CGI gets to parse...
				'purgeDeletedFavRecords':'true',														//smcgi command flag for this action
				'disableCheckForIP_favorites':ignoreChangeInIP,											//instruct server whether or not to check for IP changes
				'userPin':userPin 																		//user-pin to perform this action against
				},
			headers:{																				//define the HTTP request headers
				'Content-Type':'application/x-www-form-urlencoded'
				},
			//sync:true,																			//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete (DEV-NOTE: this value affects Spinner behavior)
			sync:false,																				//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
			timeout:10000																			//defined in ms, if this limit is reached but the transaction's 'Complete' event hasn't fired, the txn will abort and fire fail event
			};//end cfg
		cfg.data[CGI_IDENT_FIELD] = CURRENT_USER_PIN_ENCODED;									//add the authentication token to the cfg.data object (must do it this way after cfg is initialized, to get the value of CGI_IDENT_FIELD)
		var sUrl = CGI_SERVER;																	//specify the URL of the resource to which we're posting data (in this case, the standard CGI program)
		Y.io(sUrl, cfg);																		//actually do the IO transaction (make the request to the server)
	});//end YUI.use
	return undefined;																		//make lint happy
}//end function menuAction_purgeUserDeletedFavs()

function menuAction_purgeUserFavRecords(userPin) {
	if (typeof userPin === "undefined") {													//if userPin was not provided...
		if(Boolean(CURRENT_USER_PIN)) {															//if the global setting exists, use it
			userPin = CURRENT_USER_PIN;
		}
		else {																					//else, abort (server must have this value)
			FavScreen.log('error', "menu.js: vmenuAction_purgeUserFavRecords(): User-pin was not provided and could not be determined. Aborting.", true);
			return false;
		}
	}
	if (typeof FAVS_NAME_PLURAL === "undefined") {
		var FAVS_NAME_PLURAL = "records";
	}
	if(!window.confirm("WARNING!\nThis action will permanently delete all "+FAVS_NAME_PLURAL+" for "+userPin+"!\n\nContinue anyway?")) {
		return false;
	}
	Spinner.show();
	var ignoreChangeInIP = SERVER_VALUE_TRUE;												//initialize a default value, just in case there's no function to specify it next
	if (typeof determineShouldIgnoreChangeInIP === "function") {
		ignoreChangeInIP = determineShouldIgnoreChangeInIP();
	}
	YUI().use("io", "io-base", function(Y) {
		var handleStart = function(ioId, o) {													//what should happen when the io txn starts
			FavScreen.log('log', "menu.js: menuAction_purgeUserFavRecords(): Starting txn to purge user's records from the database... YUI-IO txn ID# will be: "+ioId+".", true);
			};
		var handleSuccess = function(ioId, o) {													//response HTTP status resolves to 2xx
			FavScreen.log('log', "menu.js: menuAction_purgeUserFavRecords(): Txn #"+ioId+" succeeded. Calling refreshRecordset()...", true);
			Spinner.hide();
			refreshRecordset(userPin, true);
			};
		var handleFailure = function(ioId, o) {													//response HTTP status resolves to 4xx, 5xx, undefined, or a non-standard HTTP status
			Spinner.hide();
			FavScreen.log('error', "menu.js: menuAction_purgeUserFavRecords(): Txn #"+ioId+" failed or timed-out (view 'log' console log for details).", true);
			FavScreen.log('log', "menu.js: menuAction_purgeUserFavRecords(): Txn #"+ioId+"'s responseText returned by server = '"+o.responseText+"'", false);
			window.alert("There was a problem updating the database (menuAction_purgeUserFavRecords). YUI-IO reports failure communicating with SMCGI process.");
			};
		var cfg = {																				//setup a standard YUI configuration object for our transaction
			on:{																					//for transaction events...
				start:handleStart,																		//subscribe the above custom start handler to IO's global start event
				success:handleSuccess,																	//subscribe the above custom success handler to IO's global success event
				failure:handleFailure																	//subscribe the above custom failure handler to IO's global failure event
				},
			method:"POST",																			//method will default to GET unless we specify POST here
			data:{																					//define whatever fields/data that CGI gets to parse...
				'purgeUserFavRecords':'true',															//smcgi command flag for this action
				'disableCheckForIP_favorites':ignoreChangeInIP,											//instruct server whether or not to check for IP changes
				'userPin':userPin 																		//user-pin to perform this action against
				},
			headers:{																				//define the HTTP request headers
				'Content-Type':'application/x-www-form-urlencoded'
				},
			//sync:true,																			//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete (DEV-NOTE: this value affects Spinner behavior)
			sync:false,																				//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
			timeout:10000																			//defined in ms, if this limit is reached but the transaction's 'Complete' event hasn't fired, the txn will abort and fire fail event
			};//end cfg
		cfg.data[CGI_IDENT_FIELD] = CURRENT_USER_PIN_ENCODED;									//add the authentication token to the cfg.data object (must do it this way after cfg is initialized, to get the value of CGI_IDENT_FIELD)
		var sUrl = CGI_SERVER;																	//specify the URL of the resource to which we're posting data (in this case, the standard CGI program)
		Y.io(sUrl, cfg);																		//actually do the IO transaction (make the request to the server)
	});//end YUI.use
	return undefined;																		//make lint happy
}//end function menuAction_purgeUserFavRecords()

function menuAction_purgeAllActiveCopyRecnos(userPin) {
	if (typeof userPin === "undefined") {													//if userPin was not provided...
		if(Boolean(CURRENT_USER_PIN)) {															//if the global setting exists, use it
			userPin = CURRENT_USER_PIN;
		}
		else {																					//else, abort (server must have this value)
			FavScreen.log('error', "menu.js: menuAction_purgeAllActiveCopyRecnos(): User-pin was not provided and could not be determined. Aborting.", true);
			return false;
		}
	}
	if (typeof FAVS_NAME_PLURAL === "undefined") {
		var FAVS_NAME_PLURAL = "records";
	}
	if(!window.confirm("WARNING!\nThis action will permanently delete all active copy recnos in all "+FAVS_NAME_PLURAL+" for "+userPin+"!\n\nContinue anyway?")) {
		return false;
	}
	Spinner.show();
	var ignoreChangeInIP = SERVER_VALUE_TRUE;												//initialize a default value, just in case there's no function to specify it next
	if (typeof determineShouldIgnoreChangeInIP === "function") {
		ignoreChangeInIP = determineShouldIgnoreChangeInIP();
	}
	YUI().use("io", "io-base", function(Y) {
		var handleStart = function(ioId, o) {													//what should happen when the io txn starts
			FavScreen.log('log', "menu.js: menuAction_purgeAllActiveCopyRecnos(): Starting txn to purge all active copy recnos in user's records from the database... YUI-IO txn ID# will be: "+ioId+".", true);
			};
		var handleSuccess = function(ioId, o) {													//response HTTP status resolves to 2xx
			FavScreen.log('log', "menu.js: menuAction_purgeAllActiveCopyRecnos(): Txn #"+ioId+" succeeded. Calling refreshRecordset()...", true);
			Spinner.hide();
			refreshRecordset(userPin, true);
			};
		var handleFailure = function(ioId, o) {													//response HTTP status resolves to 4xx, 5xx, undefined, or a non-standard HTTP status
			Spinner.hide();
			FavScreen.log('error', "menu.js: menuAction_purgeAllActiveCopyRecnos(): Txn #"+ioId+" failed or timed-out (view 'log' console log for details).", true);
			FavScreen.log('log', "menu.js: menuAction_purgeAllActiveCopyRecnos(): Txn #"+ioId+"'s responseText returned by server = '"+o.responseText+"'", false);
			window.alert("There was a problem updating the database (menuAction_purgeAllActiveCopyRecnos). YUI-IO reports failure communicating with SMCGI process.");
			};
		var cfg = {																				//setup a standard YUI configuration object for our transaction
			on:{																					//for transaction events...
				start:handleStart,																		//subscribe the above custom start handler to IO's global start event
				success:handleSuccess,																	//subscribe the above custom success handler to IO's global success event
				failure:handleFailure																	//subscribe the above custom failure handler to IO's global failure event
				},
			method:"POST",																			//method will default to GET unless we specify POST here
			data:{																					//define whatever fields/data that CGI gets to parse...
				'favoritesPurgeAllActiveCopyRecnos':'true',												//smcgi command flag for this action
				'disableCheckForIP_favorites':ignoreChangeInIP,											//instruct server whether or not to check for IP changes
				'userPin':userPin 																		//user-pin to perform this action against
				},
			headers:{																				//define the HTTP request headers
				'Content-Type':'application/x-www-form-urlencoded'
				},
			//sync:true,																			//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete (DEV-NOTE: this value affects Spinner behavior)
			sync:false,																				//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
			timeout:10000																			//defined in ms, if this limit is reached but the transaction's 'Complete' event hasn't fired, the txn will abort and fire fail event
			};//end cfg
		cfg.data[CGI_IDENT_FIELD] = CURRENT_USER_PIN_ENCODED;									//add the authentication token to the cfg.data object (must do it this way after cfg is initialized, to get the value of CGI_IDENT_FIELD)
		var sUrl = CGI_SERVER;																	//specify the URL of the resource to which we're posting data (in this case, the standard CGI program)
		Y.io(sUrl, cfg);																		//actually do the IO transaction (make the request to the server)
	});//end YUI.use
	return undefined;																		//make lint happy
}//end function menuAction_purgeAllActiveCopyRecnos()

function menuAction_setUserAllFavsConfirm(userPin) {
	if (typeof userPin === "undefined") {													//if userPin was not provided...
		if(Boolean(CURRENT_USER_PIN)) {															//if the global setting exists, use it
			userPin = CURRENT_USER_PIN;
		}
		else {																					//else, abort (server must have this value)
			FavScreen.log('error', "menu.js: menuAction_setUserAllFavsConfirm(): User-pin was not provided and could not be determined. Aborting.", true);
			return false;
		}
	}
	if (typeof FAVS_NAME_PLURAL === "undefined") {
		var FAVS_NAME_PLURAL = "records";
	}
	if(!window.confirm("WARNING!\nThis action will permanently set all "+FAVS_NAME_PLURAL+" as confirm-to-launch, for "+userPin+"!\n\nContinue anyway?")) {
		return false;
	}
	Spinner.show();
	var ignoreChangeInIP = SERVER_VALUE_TRUE;												//initialize a default value, just in case there's no function to specify it next
	if (typeof determineShouldIgnoreChangeInIP === "function") {
		ignoreChangeInIP = determineShouldIgnoreChangeInIP();
	}
	YUI().use("io", "io-base", function(Y) {
		var handleStart = function(ioId, o) {													//what should happen when the io txn starts
			FavScreen.log('log', "menu.js: menuAction_setUserAllFavsConfirm(): Starting txn to set user's fav-records to 'confirm'... YUI-IO txn ID# will be: "+ioId+".", true);
			};
		var handleSuccess = function(ioId, o) {													//response HTTP status resolves to 2xx
			FavScreen.log('log', "menu.js: menuAction_setUserAllFavsConfirm(): Txn #"+ioId+" succeeded. Calling refreshRecordset()...", true);
			Spinner.hide();
			refreshRecordset(userPin, true);
			};
		var handleFailure = function(ioId, o) {													//response HTTP status resolves to 4xx, 5xx, undefined, or a non-standard HTTP status
			Spinner.hide();
			FavScreen.log('error', "menu.js: menuAction_setUserAllFavsConfirm(): Txn #"+ioId+" failed or timed-out (view 'log' console log for details).", true);
			FavScreen.log('log', "menu.js: menuAction_setUserAllFavsConfirm(): Txn #"+ioId+"'s responseText returned by server = '"+o.responseText+"'", false);
			window.alert("There was a problem updating the database (menuAction_setUserAllFavsConfirm). YUI-IO reports failure communicating with SMCGI process.");
			};
		var cfg = {																				//setup a standard YUI configuration object for our transaction
			on:{																					//for transaction events...
				start:handleStart,																		//subscribe the above custom start handler to IO's global start event
				success:handleSuccess,																	//subscribe the above custom success handler to IO's global success event
				failure:handleFailure																	//subscribe the above custom failure handler to IO's global failure event
				},
			method:"POST",																			//method will default to GET unless we specify POST here
			data:{																					//define whatever fields/data that CGI gets to parse...
				'setUserAllFavsConfirm':'true',															//smcgi command flag for this action
				'disableCheckForIP_favorites':ignoreChangeInIP,											//instruct server whether or not to check for IP changes
				'userPin':userPin 																		//user-pin to perform this action against
				},
			headers:{																				//define the HTTP request headers
				'Content-Type':'application/x-www-form-urlencoded'
				},
			//sync:true,																			//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete (DEV-NOTE: this value affects Spinner behavior)
			sync:false,																				//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
			timeout:10000																			//defined in ms, if this limit is reached but the transaction's 'Complete' event hasn't fired, the txn will abort and fire fail event
			};//end cfg
		cfg.data[CGI_IDENT_FIELD] = CURRENT_USER_PIN_ENCODED;									//add the authentication token to the cfg.data object (must do it this way after cfg is initialized, to get the value of CGI_IDENT_FIELD)
		var sUrl = CGI_SERVER;																	//specify the URL of the resource to which we're posting data (in this case, the standard CGI program)
		Y.io(sUrl, cfg);																		//actually do the IO transaction (make the request to the server)
	});//end YUI.use
	return undefined;																		//make lint happy
}//end function menuAction_setUserAllFavsConfirm()