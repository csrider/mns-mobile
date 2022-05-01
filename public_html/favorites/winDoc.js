/*******************************************************************************************
 * winDoc.js
 *
 *	Provides window, popup, iframe, and multi-document support.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created January 2015 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		2015.03.12 	v1.1	Applied new versioning scheme / New routine for restoring saved node
 *	
 *******************************************************************************************/
 var versionInfoForJavascriptFile_winDoc = {
	version : "1.8",
	build : "2015.06.01"
	};


var globStrIframeID;
var overrideIframeWindowMethod_close_orig;												   //declare a global to save our original native method that may get overridden below...
var overrideIframeWindowMethod_open_orig;													//declare a global to save our original native method that may get overridden below...

//TODO: do integrity checking for CURRENT_USER_PIN

/*
function cloneNodeWithEvents( orgNode ){
	//Credit goes to Siva R Vaka (http://blog.sivavaka.com/2010/11/javascript-clonenode-doesnt-copy-event.html)
	var orgNodeEvenets = orgNode.getElementsByTagName('*');
	var cloneNode = orgNode.cloneNode( true );
	var cloneNodeEvents = cloneNode.getElementsByTagName('*');
	var allEvents = new Array('onabort','onbeforecopy','onbeforecut','onbeforepaste','onblur','onchange','onclick',
		'oncontextmenu','oncopy','ondblclick','ondrag','ondragend','ondragenter', 'ondragleave' ,
		'ondragover','ondragstart', 'ondrop','onerror','onfocus','oninput','oninvalid','onkeydown',
		'onkeypress', 'onkeyup','onload','onmousedown','onmousemove','onmouseout',
		'onmouseover','onmouseup', 'onmousewheel', 'onpaste','onreset', 'onresize','onscroll','onsearch', 'onselect','onselectstart','onsubmit','onunload');
	// The node root
	for( var j=0; j<allEvents.length ; j++ ){
		eval('if( orgNode.'+allEvents[j]+' ) cloneNode.'+allEvents[j]+' = orgNode.'+allEvents[j]);
	}
	// Node descendants
	for( var i=0 ; i<orgNodeEvenets.length ; i++ ){
		for( var j=0; j<allEvents.length ; j++ ){
			eval('if( orgNodeEvenets[i].'+allEvents[j]+' ) cloneNodeEvents[i].'+allEvents[j]+' = orgNodeEvenets[i].'+allEvents[j]);
		}
	}
	return cloneNode;
}//end function cloneNodeWithEvents()
*/
	
function overrideIframeWindowMethod_close(strIframeID) {									  // Override the window.close method for the iframe's window (must be done after an overridden popup .open() or that overridden popup won't know how to close)
	if(typeof strIframeID === "undefined") {													  //validate required argument
		FavScreen.log('error', "overrideIframeWindowMethod_close(): required strIframeID wasn't specified. Aborting.", true);
		return false;
	}
	globStrIframeID = strIframeID;
	var node_iframe = document.getElementById(strIframeID);									  //get reference to the specified iframe DOM node
	if(node_iframe === null) {																	   //validate existence of the specified iframe DOM node
		FavScreen.log('error',"overrideIframeWindowMethod_close(): strIframeID ('"+strIframeID+"') not found in the document. Aborting.",true);
		return false;
	}
	var win_iframe = node_iframe.contentWindow;												  //get reference to the iframe's window object
	if(typeof win_iframe !== "object") {														   //validate the object we were supposed to have just gotten
		FavScreen.log('error',"overrideIframeWindowMethod_close(): no valid window object exists for '"+strIframeID+"'). Aborting.",true);
		return false;
	}
	overrideIframeWindowMethod_close_orig = win_iframe.close;									//save the original native window.close method in global scope, in case we want to restore it outside of this function later (unlikely)
	win_iframe.close = function() {															   //define the override method...
		parent.FavScreen.log('log',"An iframe ('"+parent.globStrIframeID+"') document has invoked an overridden (overrideIframeWIndowMethod_close) window.close method.",false);
		parent.Popup.hide();
		};//end override method definition for window.open()
	FavScreen.log('log',"overrideIframeWindowMethod_close(): Finished specifying the override of window.close() for the iframe window, '"+strIframeID+"'.",true);
	return true;
}//end function overrideIframeWindowMethod_close()

function overrideIframeWindowMethod_open(strIframeID) {									   // Override the window.open method for the iframe's window, to prevent uncontrolled popups (this is necessary for the mobile app, since it doesn't support popups)
	if(typeof strIframeID==="undefined") {													  //validate required argument
		FavScreen.log('error',"overrideIframeWindowMethod_open(): required strIframeID wasn't specified. Aborting.",true);
		return false;
	}
	globStrIframeID = strIframeID;
	var node_iframe = document.getElementById(strIframeID);									  //get reference to the specified iframe DOM node
	if(node_iframe===null) {																	   //validate existence of the specified iframe DOM node
		FavScreen.log('error',"overrideIframeWindowMethod_open(): strIframeID ('"+strIframeID+"') not found in the document. Aborting.",true);
		return false;
	}
	var win_iframe = node_iframe.contentWindow;												  //get reference to the iframe's window object
	if(typeof win_iframe!=="object") {														   //validate the object we were supposed to have just gotten
		FavScreen.log('error',"overrideIframeWindowMethod_open(): no valid window object exists for '"+strIframeID+"'). Aborting.",true);
		return false;
	}
	overrideIframeWindowMethod_open_orig = win_iframe.open;									  //save the original native window.open method in global scope, in case we want to restore it outside of this function later
//	  if(strIframeID=="iframe_toViewMsg") {													   //if the iframe is to view an inbox message, the override will need slightly different behaviors
//			  
//	  }else{
		win_iframe.open = function(strUrl,strName,strParams) {										//define the override method... (needs to create an object and return it, rather than opening a popup window and returning a handle to the popup)
			parent.FavScreen.log('log',"An iframe ('"+parent.globStrIframeID+"') document has invoked an overridden (overrideIframeWIndowMethod_open) window.open method.",false);
			var objWin = new Object;															 //create an object (to substitute for the window object ~ all we care about is the document herein, anyway?)
			objWin.strUrl = strUrl;															  //save the argument in case we need it somewhere
			objWin.strName = strName;															//save the argument in case we need it somewhere
			objWin.strParams = strParams;														//save the argument in case we need it somewhere
			objWin.document = document.implementation.createHTMLDocument("popupDoc");		  //create a blank HTML document object, so any HTML fragments that would otherwise be written to the popup, can be written to it instead
			objWin.document.close = function() {												  //override the new document's close method (hopefully this happens when the old code base is done writing its document to what it thinks is the popup window)
				parent.FavScreen.set('objPopupDocument', this);							  //save the document object back in the parent (favorites window), so we can do stuff with it (this has an after-change event listener that pops a YUI Panel)
				};//end override document.close()
//			  objWin.document.forms[0].submit = function() {alert('submit');};
			parent.FavScreen.set('objPopupOpener', this.window);								 //save the opener window object back in the parent (favorites window), so we can do stuff with it (a "popup" window's iframe in YUI Panel will need an opener reference to keep old code working)
			parent.FavScreen.set('objPopupWindow', objWin);									  //save the object (and document) back in the parent (favorites window), so we can do stuff with it (this has an after-change event listener that pops a YUI Panel)
			return objWin;																	   //return the object and all its members to whatever was trying to create a popup window
			};//end override method definition for window.open()
//	  }
	FavScreen.log('log',"overrideIframeWindowMethod_open(): Finished specifying the override of window.open() for the iframe window, '"+strIframeID+"'.",true);
	return true;
}//end function overrideIframeWindowMethod_open()

function replaceDocumentContentsToResolveMsg(strHTML) {									   // Replace the bodywrapper contents (the favorites list/grid) with SMCGI content necessary to resolve and send an unresolved message (this way, we avoid having to deal with popups --a problem on iOS)
	if(strHTML === "undefined") {																 //validate HTML parameter (it's absolutely necessary to have a document with which to populate an iframe)
		FavScreen.log('error', "replaceDocumentContentsToResolveMsg() requires a complete document represented by a string of HTML. Aborting.", true);
		return false;
	}
	//Start setting up an iframe object
	var node_iframe = document.createElement("iframe");									//create an iframe node for displaying the strHTML content in our page
	node_iframe.id = "iframe_toResolveMsg";												//give the iframe an id, so we can use it later if need be
	node_iframe.src = "about:blank";													//we don't want the iframe to try loading something
	node_iframe.border = 0;																//don't show any border around the iframe (some browsers... looking at you, IE)
	node_iframe.style.border = 0;														//don't show any border around the iframe (better browsers)
	node_iframe.width = "100%";															//have the iframe take up the entire width of its container
	node_iframe.height = (window.innerHeight - 55) +"px";								//make the iframe as tall as possible (so if it needs to, its horizontal scrollbar will be at the bottom of the window) --55 is about the headerwrapper height, plus a bit of padding to be safe

	//Save aside the main original bodywrapper for safekeeping
	var node_bodywrapper = document.getElementById("bodywrapper");						//get a reference to the host document's area we'll swap out
	FavScreen.node_bodywrapper = node_bodywrapper.cloneNode(true);						//save a copy of that node and its complete subtree ('true' arg), so we can restore it later (WARNING: events listeners will NOT clone!)
	//FavScreen.node_bodywrapper = cloneNodeWithEvents(node_bodywrapper);			//save a copy of that node and its complete subtree ('true' arg), so we can restore it later

	//Since the iframe (and its window/document objects) won't really "exist" until it's live in the DOM, we MUST go ahead and begin rendering it (including writing the document contents)
	node_bodywrapper.innerHTML = null;													//first, clear the screen of the original bodywrapper contents (remember, we just saved a copy of them above)
	node_bodywrapper.appendChild(node_iframe);											//put the not-yet-visile iframe into the DOM, so it can then exist to the point of gaining access to its window/document objects
	var objDocument = node_iframe.contentWindow.document || node_iframe.contentDocument;
	try {																				//need to try, because if server gives us crappy invalid legacy HTML, we'll need to gracefully catch that and handle it nicely
		objDocument.open();																	//open the iframe's document
		objDocument.write(strHTML);															//write the HTML-string into the iframe's document
		objDocument.close();																//close the iframe's document
	}
	catch(err) {																		//if an error happened, we need to abort and restore the original-saved node
		FavScreen.log('error', "replaceDocumentContentsToResolveMsg(): Server returned invalid document code ("+err+"). Aborting and restoring original content.", true);
		node_bodywrapper.innerHTML = null;													//clear the bodywrapper of the iframe garbage
		node_bodywrapper.appendChild(FavScreen.node_bodywrapper);							//restore the original-saved node
		FavScreen.node_bodywrapper = null;
		node_iframe = null;
		return false;
	}
	objDocument.body.style.zoom = FavScreen.get('attrZoom');							//make sure the document's body is zoomed properly

	return node_iframe;																		  //return a handle to the iframe (which contains the document, if it's needed)
}//end function replaceDocumentContentsToResolveMsg()

/*
function restoreSavedNode(objSavedNode, objNodeToReplace) {								   // Restore a saved node to its original glory
		if(typeof objSavedNode==="undefined") {													 //validation
				FavScreen.log('error', "restoreSavedNode() requires a saved node object to restore.", true);
				return false;
		}
		if(typeof objNodeToReplace==="undefined") {												 //validation
				FavScreen.log('error', "restoreSavedNode() requires a target node object to replace.", true);
				return false;
		}
		objNodeToReplace.parentNode.replaceChild(objSavedNode, objNodeToReplace);					//do the replacement
}//end function restoreSavedNode()
*/

/* Restore the saved node that gets set aside whenever an iframe containing legacy code is rendered */
function restoreSavedNode_fromLegacyIframe() {
	Spinner.show();

	var delay = 500;

	FavScreen.log("log", "restoreSavedNode_fromLegacyIframe(): Called and will execute in "+delay+"ms.", true);

	setTimeout(function(){
		if(FavScreen.node_bodywrapper === null) {
			return FavScreen.log("info", "restoreSavedNode_fromLegacyIframe(): No saved bodywrapper node to restore (it may have already been restored). Aborting.", true);
		}

		FavScreen.log("log", "restoreSavedNode_fromLegacyIframe(): Now executing restoration...", true);

		var node_bodywrapper = document.getElementById("bodywrapper");							//get a reference to the main bodywrapper node
		
		//node_bodywrapper.parentNode.replaceChild(FavScreen.node_bodywrapper, node_bodywrapper);	//replace the document's bodywrapper contents with what was saved in the FavScreen object. //DEV-NOTE: make this capable of handling errors  //NOTE: this may not happen fast enough in rare cases?
		node_bodywrapper.parentNode.replaceChild(FavScreen.node_bodywrapper, node_bodywrapper);	//replace the document's bodywrapper contents with what was saved in the FavScreen object. //DEV-NOTE: make this capable of handling errors  //NOTE: this may not happen fast enough in rare cases?
		FavScreen.set('attrLastFocused_window', Date.now());									//make sure this has a value that won't wrongly prevent launch or similar actions
		//window.focus();																			//make sure the window gets focus, so attrLastFocused_window has a value that won't wrongly prevent launching --DEPRECATED in favor of below line (this was overkill?)
		
		FavScreen.node_bodywrapper = null;														//clear the saved node, since we've restored it and are now done with it (THIS IS IMPORTANT!!! This is tested by other routines later)
		iframeHandle = undefined;																//re-initialize the global handle for iframes
		FavScreen.log("log", "restoreSavedNode_fromLegacyIframe(): Saved bodywrapper node has been restored and nullified.", true);

		//refreshRecordset(CURRENT_USER_PIN, true, false, false);									//refresh to make sure we're showing current data on-screen (like toggle)
		//refreshRecordset_inboxMsgs(CURRENT_USER_PIN,true,false);								//make sure we have the latest inbox data
		
		if(FavScreen.get('attrInteractionMode') == MODE_REPLYING) {								//if we're in reply mode, we may need to do some special things (they may be coming back via reply/cancel in legacy)
			switch(FavScreen.get('attrCurrentResponseRule')) {
				case ENCODED_RESPONSE_RULE_2:  													//they're not allowed to reply with any non-defined msg, so need to exit reply mode and jump to last position
					window.FavScreen.set('attrInteractionMode', MODE_LAUNCHABLE);				//NOTE: this event will fire attachActionListeners... and a slew of other routines
					//window.scrollTo_animated(document.body, FavScreen.get('attrPreviousScrollPositionPixelY'), 150);
					break;																		//allow continuation of the rest of the function
				case ENCODED_RESPONSE_RULE_3: 													//they're allowed to reply with any mobile-msg, so need to keep reply mode and jump to std-replies (for convenience)
					window.updateScreenStyle({newVal:MODE_REPLYING});
					window.jumpScrollTo("libraryAnchor_"+FAVS_LIB_USER_STDREPLIES_PIN.trim());
					attachActionListenersToMessageCells_allSubsectionsInSection("subsectionlist-libraries");
					//break;
					return;																		//don't continue with the rest of the function (so jumpScrollTo won't be overridden by the scrollTo_animated call below)
				default:
					break;
			}
		}
		//else {
			//attachActionListenersToMessageCells("#messagelist-sorted");								//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
			//attachActionListenersToMessageCells("#messagelist-unsorted-1");							//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
		//	attachActionListenersToMessageCells_allSubsectionsInSection("subsectionlist-libraries");
		//}

		window.scrollTo_animated(document.body, FavScreen.get('attrCurrentScrollPositionPixelY'), 150);

		refreshRecordset(CURRENT_USER_PIN, true, false, false);									//refresh to make sure we're showing current data on-screen (like toggle)
		refreshRecordset_inboxMsgs(CURRENT_USER_PIN,true,false);								//make sure we have the latest inbox data
		loadLibsAndMsgs();																		//get up-to-date libraries and their msgs (THIS IS A PATCH until we can more properly do event-delegation)
		//MajorSection_personalLibs.renderListInItsSection();

		setTimeout(function() {
		//	refreshRecordset(CURRENT_USER_PIN, true, false, false);									//refresh to make sure we're showing current data on-screen (like toggle)
		//	refreshRecordset_inboxMsgs(CURRENT_USER_PIN,true,false);								//make sure we have the latest inbox data
		//	loadLibsAndMsgs();																		//get up-to-date libraries and their msgs (THIS IS A PATCH until we can more properly do event-delegation)
			MajorSection_personalLibs.renderListInItsSection();
			}, 1000);

		FavScreen.log("log", "restoreSavedNode_fromLegacyIframe(): Completed.", true);

	}, delay);

	//Spinner.hide();
}

/* NOTE: the following function gets called from the smcgi.c file; and is very important, so don't delete or comment it! */
/* DEPRECATED....
function restoreSavedNode_fromMsgResolveLaunch() {											// Restore, specifically, the normal favorites screen that we desire after an unresolved message was launched/closed
	var node_bodywrapper = document.getElementById("bodywrapper");
	node_bodywrapper.parentNode.replaceChild(FavScreen.node_bodywrapper, node_bodywrapper);	  //replace the document's bodywrapper contents with what was saved in the FavScreen object. //DEV-NOTE: make this capable of handling errors  //NOTE: this may not happen fast enough in rare cases?
	FavScreen.node_bodywrapper = null;														   //clear the saved node, since we've restored it and are now done with it (this may be tested by other routines later)
	iframeHandle = undefined;																	//re-initialize the global handle for iframes
	attachActionListenersToMessageCells("#messagelist-sorted");								//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	attachActionListenersToMessageCells("#messagelist-unsorted-1");							//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	attachActionListenersToMessageCells_allSubsectionsInSection("subsectionlist-libraries");
	refreshRecordset(CURRENT_USER_PIN, true, false, false);								//refresh to make sure we're showing current data on-screen (like toggle)
	refreshRecordset_inboxMsgs(CURRENT_USER_PIN,false,false);							  //make sure we have the latest inbox data
//	  window.scrollTo(0,-60);																	  //make sure we're scrolled to the top
	window.scrollTo(0,FavScreen.get('attrCurrentScrollPositionPixelY'));						 //make sure we're scrolled to the previous position
//	  forceCssRepaint(); //note: no longer need this since we added refresh above?
	FavScreen.set('attrLastFocused_window', Date.now());
	window.focus();																			  //make sure the window gets focus, so attrLastFocused_window has a value that won't wrongly prevent launching --DEPRECATED in favor of below line (this was overkill?)
}//end function restoreSavedNode_fromMsgResolveLaunch()
*/

/* NOTE: the following function gets called from the smcgi.c file; and is very important, so don't delete or comment it! */
/* DEPRECATED....
function restoreSavedNode_fromMsgReplyLaunch() {											// Restore, specifically, the normal favorites screen that we desire after an unresolved message was launched/closed
	var node_bodywrapper = document.getElementById("bodywrapper");
	node_bodywrapper.parentNode.replaceChild(FavScreen.node_bodywrapper, node_bodywrapper);	  //replace the document's bodywrapper contents with what was saved in the FavScreen object. //DEV-NOTE: make this capable of handling errors  //NOTE: this may not happen fast enough in rare cases?
	FavScreen.node_bodywrapper = null;														   //clear the saved node, since we've restored it and are now done with it (this may be tested by other routines later)
	iframeHandle = undefined;																	//re-initialize the global handle for iframes
	attachActionListenersToMessageCells("#messagelist-sorted");								//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	attachActionListenersToMessageCells("#messagelist-unsorted-1");							//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	attachActionListenersToMessageCells_allSubsectionsInSection("subsectionlist-libraries");
	refreshRecordset(CURRENT_USER_PIN, true, false, false);								//refresh to make sure we're showing current data on-screen (like toggle)
	refreshRecordset_inboxMsgs(CURRENT_USER_PIN,false,false);							  //make sure we have the latest inbox data
	if(FavScreen.get('attrCurrentResponseRule') == ENCODED_RESPONSE_RULE_2) {			//if rule 2 is in effect, they shouldn't be allowed to reply with any non-predefined msg, so need to exit reply mode and jump to last position
		window.FavScreen.set('attrInteractionMode', MODE_LAUNCHABLE);
		window.scrollTo_animated(document.body, FavScreen.get('attrPreviousScrollPositionPixelY'), 150);
	}
	if(FavScreen.get('attrCurrentResponseRule') == ENCODED_RESPONSE_RULE_3) {			//if rule 3 is in effect, they are allowed to reply with any other mobile-msg, so need to keep reply mode and jump to std-replies
		//window.updateScreenStyle({e:{newVal:MODE_REPLYING}});
		window.jumpScrollTo("libraryAnchor_"+FAVS_LIB_USER_STDREPLIES_PIN.trim());
	}
//	  window.scrollTo(0,-60);																	  //make sure we're scrolled to the top
	window.scrollTo(0,FavScreen.get('attrCurrentScrollPositionPixelY'));						 //make sure we're scrolled to the previous position
//	  forceCssRepaint(); //note: no longer need this since we added refresh above?
	FavScreen.set('attrLastFocused_window', Date.now());
	window.focus();																			  //make sure the window gets focus, so attrLastFocused_window has a value that won't wrongly prevent launching --DEPRECATED in favor of below line (this was overkill?)
}//end function restoreSavedNode_fromMsgReplyLaunch()
*/

function replaceDocumentContentsToViewMessage(strHTML) {									  // Replace the bodywrapper contents (the favorites list/grid) with SMCGI content necessary to view a message (e.g. viewing an inbox msg/its thread)
	if(strHTML === "undefined") {																 //validate HTML parameter (it's absolutely necessary to have a document with which to populate an iframe)
		FavScreen.log('error', "replaceDocumentContentsToViewMessage() requires a complete document represented by a string of HTML. Aborting.", true);
		return false;
	}
	var node_iframe = document.createElement("iframe");										//create an iframe node for displaying the strHTML content in our page
	node_iframe.id = "iframe_toViewMsg";													   //give the iframe an id, so we can use it later if need be
	node_iframe.src = "about:blank";														   //we don't want the iframe to try loading something
	node_iframe.border = 0;																	  //don't show any border around the iframe (some browsers... looking at you, IE)
	node_iframe.style.border = 0;																//don't show any border around the iframe (better browsers)
	node_iframe.width = "100%";															   //have the iframe take up the entire width of its container
	node_iframe.height = (window.innerHeight - 55) +"px";									  //make the iframe as tall as possible (so if it needs to, its horizontal scrollbar will be at the bottom of the window) --55 is about the headerwrapper height, plus a bit of padding to be safe
	var node_bodywrapper = document.getElementById("bodywrapper");							 //get a reference to the host document's area we'll swap out
	FavScreen.node_bodywrapper = node_bodywrapper.cloneNode(true);							   //save a copy of that node and its complete subtree ('true' arg), so we can restore it later (WARNING: events listeners will NOT clone!)
	//FavScreen.node_bodywrapper = cloneNodeWithEvents(node_bodywrapper);							   //save a copy of that node and its complete subtree ('true' arg), so we can restore it later
	node_bodywrapper.innerHTML = null;														   //clear the screen of bodywrapper contents (remember, we just saved a copy of them above)
	node_bodywrapper.appendChild(node_iframe);												   //put the new iframe inside of bodywrapper
	var node_iframeDocument = node_iframe.contentWindow.document || node_iframe.contentDocument; //get a reference to the iframe's blank document that was created implicitly when the iframe was created (this assignment method should help support different browsers)
	node_iframeDocument.write(strHTML);														  //output whatever SMCGI gave us, to the iframe's document
	node_iframeDocument.body.style.zoom = FavScreen.get('attrZoom');							 //apply the user's preferred zoom to the iframe's document from smcgi
	return node_iframe;																		  //return a handle to the iframe (which contains the document, if it's needed)
}//end function replaceDocumentContentsToResolveMsg()

function restoreSavedNode_fromViewMsg() {												// Restore the normal favorites screen that we desire after finished viewing a message
	var node_bodywrapper = document.getElementById("bodywrapper");							//get a reference to the current bodywrapper node in the document (should contain the iframe)
	node_bodywrapper.parentNode.replaceChild(FavScreen.node_bodywrapper, node_bodywrapper);	//replace the document's bodywrapper contents with what was saved in the FavScreen object. //DEV-NOTE: make this capable of handling errors
	//cleanup/reinits...
	FavScreen.node_bodywrapper = null;														//clear the saved node, since we've restored it and are now done with it (this may be tested by other routines later)
	iframeHandle = undefined;																//re-initialize the global handle for iframes
	//re-attach event listeners (since they wouldn't have been carried over by the original cloneNode method call)...
	//attachActionListenersToMessageCells("#messagelist-sorted");								//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	//attachActionListenersToMessageCells("#messagelist-unsorted-1");							//DEV-NOTE: need to specify CSS selector here somehow --- or in place where this function is called?
	refreshRecordset(CURRENT_USER_PIN, false, false, false);								//refresh to make sure we're showing current data on-screen (like toggle)	NOTE: this will cause event listeners to attach, too
	refreshRecordset_inboxMsgs(CURRENT_USER_PIN,false,false);								//make sure we have the latest inbox data	NOTE: this will cause event listeners to attach, too
	loadLibsAndMsgs();																		//get up-to-date libraries and their msgs (PATCH until we can more properly do event-delegation)
	//window.scrollTo(0,-60);																//make sure we're scrolled to the top
	window.scrollTo(0,FavScreen.get('attrCurrentScrollPositionPixelY'));					//make sure we're scrolled to the previous position
	//forceCssRepaint();																	//note: no longer need this since we added refresh above?
	FavScreen.set('attrLastFocused_window', Date.now());
	window.focus();																			//make sure the window gets focus, so attrLastFocused_window has a value that won't wrongly prevent launching --DEPRECATED in favor of below line (this was overkill?)
}//end function restoreSavedNode_fromMsgResolveLaunch()