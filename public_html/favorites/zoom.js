/*******************************************************************************************
 * zoom.js
 *
 *	Provides user-interaction-based (non load time) functions for doing zoom related stuff.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created December 2014 by Chris Rider (chris.rider81@gmail.com).
 *******************************************************************************************/

function zoomControls(showOrHide) {
	var cfg_radix = 10;																			//specify the radix (number base system) to use for parseInt calls
	if(FavScreen.get('attrInteractionMode') === MODE_EDITABLE) {											//don't allow zoom operations while in edit mode (so drag-drop can work properly)
		FavScreen.log('warn', "zoom.js: zoomControls() cannot run while in edit mode, due to lack of support for drag-and-drop sorting while zoomed in. Aborting function.", true);
		window.alert("Zoom operations are not permitted while in edit mode.");
		return false;
	}
	if(typeof showOrHide === "undefined") {
		FavScreen.log('error', "zoom.js: zoomControls() requires the showOrHide argument. Aborting function.", true);
		return false;
	}
	if(!FavScreen.get('attrBrowserSupports_css_zoom')){
		FavScreen.log('warn', "zoom.js: zoomControls(): This browser does not support CSS zoom. UserAgent is: "+YUI.Env.UA.userAgent, true).desc;
	}
	var node_headerWrapper = document.getElementById("headerwrapper");								 //get a reference to the headerwrapper node
	if(node_headerWrapper === null) {
		FavScreen.log('error', "zoom.js: zoomControls(): The node 'headerwrapper' does not exist in the document. Aborting function.", true);
		return false;
	}
	var node_headerWrapper_zoomcontrols = document.getElementById("zoomcontrols");					 //get a reference to the area of the headerwrapper that contains our zoom controls
	if(node_headerWrapper_zoomcontrols === null) {
		FavScreen.log('error', "zoom.js: zoomControls(): The node 'zoomcontrols' does not exist in the document. Aborting function.", true);
		return false;
	}
	var node_bodyWrapper = document.getElementById("bodywrapper");									 //get a reference to the bodywrapper node
	if(node_bodyWrapper === null) {
		FavScreen.log('error', "zoom.js: zoomControls(): The node 'bodywrapper' does not exist in the document. Aborting function.", true);
		return false;
	}
	try {
		if(node_bodywrapper_originalOffsetTop == undefined) {										   //if the bodywrapper's original (pre-zoom) top position hasn't yet been set, then set it
			node_bodywrapper_originalOffsetTop = parseInt(document.getElementById("bodywrapper").offsetTop, cfg_radix);
		}
		switch(showOrHide) {
			case ZOOMCONTROLS_HIDE:
				FavScreen.log('log', "zoom.js: zoomControls(): Hiding zoom controls.", false);
				if(typeof FavScreen.timeoutHandle_autoHideZoomControls !== "undefined") {	 //if the zoom control automatic timeout is running, cancel it since the controls have been manually hidden
					clearTimeout(FavScreen.timeoutHandle_autoHideZoomControls);		  //cancel the auto-hide zoom controls timer
				}//end if timeoutHandle exists
				node_headerWrapper_zoomcontrols.style.display = "none";					//set display to none
				node_headerWrapper.style.paddingBottom = null;							   //shrink headerwrapper back to normal
				node_bodyWrapper.style.top = node_bodywrapper_originalOffsetTop+"px";	  //reposition the bodywrapper node back to its original (no zoom controls showing) position
				return true;
				break;
			case ZOOMCONTROLS_SHOW:
				var cfg_showTimeout = 5000;												  //specify how long the zoom controls should be visible before being automatically hidden
				var cfg_zoomControls_height = 50;											//sprcify how high (in pixels) the zoom controls area should be
				FavScreen.log('log', "zoom.js: zoomControls(): Showing zoom controls and enabling zoom functionality.", false);
				node_headerWrapper_zoomcontrols.style.marginTop = "10px";				  //give some vertical breathing room around the zoom controls
				node_headerWrapper_zoomcontrols.style.display = "block";				   //set display to show (it's a DIV, so set to block)
				node_headerWrapper.style.paddingBottom = cfg_zoomControls_height+"px";	 //expand headerwrapper to encompass the zoom control area (makes it look like it's part of it)
				node_bodyWrapper.style.top = (node_bodywrapper_originalOffsetTop+cfg_zoomControls_height)+"px";//shift bodywrapper down to accomodate the taller headerwrapper
				FavScreen.timeoutHandle_autoHideZoomControls = setTimeout(function() {		//automatically hide the zoom controls after the configured amount of time
					zoomControls(ZOOMCONTROLS_HIDE);
					}, cfg_showTimeout);
				return true;
				break;
			default:
				FavScreen.log('error', "zoom.js: zoomControls(): Invalid value specified for showOrHide argument. Aborting function.", true);
				return false;
				break;
		}//end switch
	}//end try
	catch(err) {
		FavScreen.log('error', "zoom.js: zoomControls(): A problem occurred while trying to set zoom styling. Aborting function. Following, is the error...", true);
		FavScreen.log('log', err.message+" -- "+err.description, false);
		return false;
	}//end catch
	return false;
}//end function zoomControls()