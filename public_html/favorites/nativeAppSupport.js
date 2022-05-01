/*******************************************************************************************
 * nativeAppSupport.js
 *
 *	Provides methods to support and interact with the native-app layer.
 *	
 *	Requires:
 *		Various supporting logic in the native layer (as noted in each routine below)
 *
 *	Created January 2015 by Chris Rider (chris.rider81@gmail.com).
 *******************************************************************************************/

/* Handle initializing an iOS uiwebview / JavaScript bridge connection...
 * 	The callback is passing along what we want to happen with a connection instance
 *	Usage example (send cmd to native app): 	connectWebViewJavascriptBridge( function(bridge){bridge.send('reloadDocument');} );
 *	Usage example (get cmd from native app): 	connectWebViewJavascriptBridge( function(bridge){bridge.init( function(data, responseCallback){THIS ROUTINE GETS ALL DATA SENT BY NATIVE APP} );} );
 *	Requires: 
 *		- "WebViewJavascriptBridge" (by Marcus Westin) in the native-app program
 *		- Connections Mobile native app version 1.9.5 or higher */
function connectWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {										//if the bridge exists (exposed in global scope by the native app layer)...
		callback(WebViewJavascriptBridge);											//then execute whatever routine we specified in the callback
	}
	else {																		//else need to instantiate the bridge, and then (once it's ready), execute whatever was specified in the callback argument
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			callback(WebViewJavascriptBridge);
			}, false);//end addEventListener
	}
}

/* Show the native app's "loading" spinner (for iOS app)
 *	Requires Connections Mobile native app version 1.9.5 or higher */
function showNativeSpinner_iOS() {
	var task = function(bridge) {					//define a routine for bringing the spinner up...
		bridge.send("showNativeSpinner");				//send the string that the native app's side of the bridge expects, in order to bring up the spinner
		};
	connectWebViewJavascriptBridge(task);			//connect to the bridge, with the task to be done (as defined above)
}

/* Hide the native app's "loading" spinner (for iOS app)
 *	Requires Connections Mobile native app version 1.9.5 or higher */
function hideNativeSpinner_iOS() {
	var task = function(bridge) {					//define a routine for taking the spinner down...
		bridge.send("hideNativeSpinner");				//send the string that the native app's side of the bridge expects, in order to take down the spinner
		};
	connectWebViewJavascriptBridge(task);			//connect to the bridge, with the task to be done (as defined above)
}

/* Trigger the native app's geolocation update (for iOS app)
 *	Requires:
 *		- Connections Mobile native app version 1.8 or higher
 *		- A ClassFavScreen instance in the document's global scope (to provide the native app attributes with which to update once it has geolocation data to give us)
 *		- A listening instance of the bridge (see get-cmd usage example in connectWebViewJavascriptBridge, above) */
function triggerGeolocationUpdate_iOS() {
	var task = function(bridge) {					//define a routine for triggering the native app to update the attributes with the latest geolocation data...
		bridge.send("getLocation");						//send the string that the native app's side of the bridge expects, in order to bring up the spinner
		};
	connectWebViewJavascriptBridge(task);			//connect to the bridge, with the task to be done (as defined above)
}