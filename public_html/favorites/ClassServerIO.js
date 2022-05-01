/*******************************************************************************************
 * ClassServerIO.js
 *
 *	Provides a class for performing and handling network (client/server) I/O, transactions, etc.
 *	
 *	Requires:
 *		MessageNet Connections (smcgi) listening.
 *	Not Required, But Ideal:
 *		Instantiation from within the Connections Mobile ("Favorites") framework.
 *
 *	Created February 2015 by Chris Rider (chris.rider81@gmail.com).
 *******************************************************************************************/

// Main class constructor...
var ServerIO = function (strInstanceName) {
	this.isInitialized = false;

	var strInstanceNameParameter = strInstanceName || "(anonymous instance)";
	var strInstanceNameForLogging = "ServerIO: " + strInstanceNameParameter + ": ";

	// Define a private method for handling logging
	var log = function (strLogLevel, strLogPayload, boolOutputToConsole) {
		if ( (typeof window.FavScreen === "object") && (typeof window.FavScreen.log === "function") ) {		/* if the global FavScreen object exists, use its logging capability (output this class' logging to it) */
			return window.FavScreen.log(strLogLevel, strLogPayload, boolOutputToConsole);
		}
		else {																								/* else fall back to the native JavaScript console logging capability */
			if (strLogLevel == "log") {
				return console.log(strLogPayload);
			}
			else if (strLogLevel == "info") {
				return console.info(strLogPayload);
			}
			else if (strLogLevel == "warn") {
				return console.warn(strLogPayload);
			}
			else if (strLogLevel == "error") {
				return console.error(strLogPayload);
			}
			else {
				return false;
			}
		}
		};//end log()

	// Define a public method for doing a "POST" XHR transaction
	this.doPostXHR = function (objCfg) {
		if (typeof objCfg !== "object") return log("error", strInstanceNameForLogging + "doPostXHR(): Configuration object not provided. Aborting.", true);
		log("log", strInstanceNameForLogging + "doPostXHR(): Invoked with objCfg = '" + JSON.stringify(objCfg) + "'.", false);
		
		};

	// Cleanup (actually, just clearing the references to anything that's no longer needed, so they'll be eligible for immediate garbage collection)...
	strInstanceNameParameter = undefined;

	// Flag any instance of this class as finished initializing (just executed at the end here)
	this.isInitialized = true;
	log("log", strInstanceNameForLogging + "Initialized.", false);
};