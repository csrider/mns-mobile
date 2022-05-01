/*********************************************************
** smcgi_yui.c
** (redacted) & Chris Rider
** 10.21.2013
** 
** Updated:
**	Oct 2013	Chris Rider		(added right-click context menu capability for camera icons in the user directory)
** 
*********************************************************/

#include <stdio.h>
#include <string.h>

/***** REDACTED *****/

#include "smcgi_yui.h"
#include "smcgi_favorites.h"

/***********************************************************************
* void add_yuiFiles(void)
*
*       This function prints the code necessary for the client to load 
*       the YUI libraries and code-base.
*
*       It should typically be called from some main location... as 
*       close to the document's root-node as possible, and it only 
*       needs called once on the page.
*
***********************************************************************/
void add_yuiFiles(void)
{
/* Bring in the YUI seed file (starts the YUI framework and makes it generally available) */
printf("\n<script src=\"%s/~silentm/javascripts/yui/build/yui/yui-min.js\"></script>\n", cgi_base);

/* Configure global YUI settings */
printf("<script type=\"text/javascript\">");
printf("var YUI_config = {");						//define our configuration object (that can then be included in any sandboxed invocation later)
printf("	base: '../javascripts/yui/build/',");				//base of YUI modules, relative to the document (in this case, ~/public_html/bin/smlist.cgi)
printf("	combine: 0,");
printf("	groups: {");
printf("		gallery: {");
printf("			base:'../javascripts/yui/build/gallery-sm-menu/',");
printf("			patterns:  { 'gallery-': {} }");
printf("			}");//end gallery
printf("		},");//end groups
printf("	debug: false");							//whether to log Y.log calls to the browser console
printf("	};");
printf("</script>");

//add_yuiWindowControl();
printf("\n<script src=\"%s/~silentm/javascripts/yui.messagenet/popup-menu-manager/popup-menu-manager.js\"></script>\n", cgi_base);	  //load popup menu (context menu) manager
//printf("\n<script src=\"%s/~silentm/javascripts/yui.messagenet/gallery-sm-menu/gallery-sm-menu-debug.js\"></script>\n", cgi_base);    //load drop-down menu stuff (had some path issues where CSS file dependency wasn't loading from our custom .messagenet directory)
printf("\n<script src=\"%s/~silentm/javascripts/yui/build/gallery-sm-menu/gallery-sm-menu-min.js\"></script>\n", cgi_base);			  //load drop-down menu stuff (this way since the above had issues)
}


/***********************************************************************
* void add_yui_general(void)
*
*       This function prints the code necessary for the client to use 
*       basic and generalized YUI capabilities.
*
***********************************************************************/
void add_yui_general(void)
{
printf("<script type=\"text/javascript\">");

printf("function yui_frameworkExists() {");				// Return whether the YUI object is available to use
printf("	if((typeof YUI === 'function') || (typeof YUI === 'object')) {");
printf("		return true;");
printf("	}");
printf("	else {");
printf("		console.warn(\"yui_frameworkExists(): YUI framework does not exist, so returning false to call stack: \"+Error().stack);");
printf("		return false;");
printf("	}");
printf("}");

printf("function yui_getPlatformInfo_iosVersion() {");			// Figure out the version of iOS the client is running on (returns false if not applicable or not determinable, otherwise returns string for version)
printf("	if(yui_frameworkExists() === false) {return false;}");
printf("	try {");
printf("		var iosVer = YUI.Env.UA.ipad | YUI.Env.UA.ipod | YUI.Env.UA.iphone;");
printf("		iosVer = iosVer.toString();");
printf("		if(iosVer > '0') {return iosVer;}");
printf("	}");
printf("	catch(err) {");
printf("		console.error(\"yui_getPlatformInfo_iosVersion(): Caught error while trying to understand iOS version from the YUI environment: \"+err);");
printf("	}");
printf("	return false;");
printf("}");

printf("</script>");
}


/***********************************************************************
* void add_yui_rightClickContextMenu_message(void)
*
* 	This function prints the code necessary for the client to load
* 	the YUI-based event listener delegation stuff. It should only 
* 	be called just once per document/page. Along with that, it 
* 	also includes any supporting code to go along with it.
*
* 	Basically, once you call this, YUI will go out into the document
* 	and try to attach event listeners to the specified node(s), <-- DEV-NOTE: add specification ability later... hard coded for now
* 	as specified by the selector argument.
*
* 	In theory, the YUI framework should try to poll the document 
* 	for a short time after it's begun to load, and try delegating
* 	until it succeeds -- for this reason, we shouldn't have to 
* 	worry about waiting for onLoad or anything -- hopefully.
*
***********************************************************************/
void add_yui_rightClickContextMenu_message(void)
{
printf("<script type=\"text/javascript\">");

printf("function addMsgToFavorites(arrMsgTemplateData) {");
printf("	YUI().use('io-base', 'querystring-stringify-simple', function (Y) {");
printf("		var msgTemplateRecno = arrMsgTemplateData[0];");
printf("		var msgTemplateName = arrMsgTemplateData[1];");
printf("		var msgTemplateDirectory = arrMsgTemplateData[2];");
printf("		var msgTemplateDescription = arrMsgTemplateData[3];");
printf("		var handleStart = function(ioId, o) {");
printf("			Y.log(\"Initiating request to add message (template recno \"+msgTemplateRecno+\") to %s... YUI-IO transaction ID# will be: \"+ioId+\".\", \"info\", \"YUI: IO: Add message to %s\");", FAVS_NAME_FULL, FAVS_NAME_FULL);
printf("		};");
printf("		var handleSuccess = function(ioId, o) {");						//response HTTP status resolves to 2xx
printf("			Y.log(\"Transaction #\"+ioId+\" completed successfully as far as this client can tell - check server CGI log (\"+Date()+\").\", \"info\", \"YUI: IO: Add message to %s\");", FAVS_NAME_FULL);
printf("			Y.log(\"Transaction #\"+ioId+\"'s responseText returned by server = '\"+o.responseText+\"'\", \"log\", \"YUI: IO: Add message to %s\");", FAVS_NAME_FULL);
printf("		};");
printf("		var handleFailure = function(ioId, o) {");						//response HTTP status resolves to 4xx, 5xx, undefined, or a non-standard HTTP status
printf("			Y.log(\"Transaction #\"+ioId+\" failed (view 'info' console log for more).\", \"error\", \"YUI: IO: Add message to %s\");", FAVS_NAME_FULL);
printf("			Y.log(\"Transaction #\"+ioId+\"'s responseText returned by server = '\"+o.responseText+\"'\", \"log\", \"YUI: IO: Add message to %s\");", FAVS_NAME_FULL);
printf("		};");
printf("		var cfg = {");										//setup a standard YUI configuration object for our transaction
printf("			on: {");
printf("				start: handleStart,");							//subscribe the above event handler to the start event
printf("				success: handleSuccess,");						//subscribe the above event handler to the success event
printf("				failure: handleFailure");						//subscribe the above event handler to the failure event
printf("				},");
printf("			method: \"POST\",");								//method will default to GET unless we specify POST here
printf("			data: {");									//define whatever fields/data that CGI gets to parse...
printf("				'addMsgToFavs':'true',");						//smcgi command flag
printf("                                '%s':'%s',", cgi_identification_field, cgi_EncodeLoginPin(CurrentUserPin));
printf("				'userPin':'%s',", CurrentUserPin);					//current user to add the message as a favorite to
printf("				'msgName':''+msgTemplateName+'',");					//message template (name) to add to this user's favorites list
printf("				'msgDir':''+msgTemplateDirectory+'',");					//message template (directory) to add to this user's favorites list
printf("				'msgParentRecnoToFavorite':''+msgTemplateRecno+'',");			//message template (recno) to add to this user's favorites list
printf("				'msgDesc':\"\"+msgTemplateDescription+\"\"");				//message template's description
printf("				},");
printf("			headers: {");									//specify any HTTP headers here...
printf("				'Content-Type': 'application/x-www-form-urlencoded'");
printf("				},");
printf("			sync: true,");									//define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
printf("			timeout: 5000");								//defined in ms, if this limit is reached but the transaction's 'Complete' event hasn't fired, the txn will abort and fire fail event
printf("			};");
printf("		var sUrl = \"%s\";", cgi_server);							//specify the URL of the resource to which we're posting data (in this case, the standard CGI program)
printf("		var objRequest = Y.io(sUrl, cfg);");							//initiate the YUI-IO operation, sending our config object (which contains the data) to the CGI program (specified by sUrl above)... response will be directly accessible via the object returned to 'objRequest'
printf("	});");
printf("}\n");

printf("function renderContextMenuForMsg(e, arrMsgData) {");						// Render and pop the context menu on the screen wherever the event (e) happened...
printf("	if(typeof e === 'undefined') {console.warn(\"renderContext needs an event passed to it, to make the popup-menu work correctly.\");}");
printf("	if(typeof arrMsgData === 'undefined') {console.warn(\"renderContext needs an array of message data passed to it, to make the popup-menu work correctly.\");}");
printf("	YUI().use('popup-menu-manager', function (Y) {");
printf("		var contextmenu = new Y.TaffySoft.PopupMenuManager({");					//instantiate a popup menu object
printf("			'liBackgroundSelected' : '#cfc',");
printf("			'customClass' : 'contextMenu'");						// IMPORTANT!!!  - this must be here, or the menu won't go away whenever another menu is opened on the page
printf("		});");
printf("		contextmenu.set('items', [");
printf("			{ label: 'Add to My %s', func: addMsgToFavorites, data: arrMsgData }", FAVS_NAME_FULL);
printf("		]);\n");
printf("		contextmenu.render();");
printf("		contextmenu.runMenu(e);");								//popup-menu-manager can tell where to position the context menu, based on coordinates natively contained within the "e" event we pass to it here
printf("	});");
printf("}\n");

printf("var attachContextMenuListenersAlreadyCalled = false;");
printf("function attachContextMenuListeners(strTargetSelector) {");					// Go out into the document and attach all context menu event listeners...
printf("	if(attachContextMenuListenersAlreadyCalled){");							//if our global flag indicates that we've already called this function, then abort (it only needs called once per page/load)
printf("		return false;");
printf("	}");
printf("	YUI().use('event-delegate', function (Y) {");
printf("		var fxnDoMenuStuff = function(e){");							//define what happens when a contextmenu event fires...
printf("			e.preventDefault();");								//prevent the default event action from happening (in this case, keeps the context menu from showing)
printf("			var thisMsgTemplateData = this.getData();");					//get this message template's data attributes/values (passed via DOM using the special data-* attributes)
printf("			var thisMsgTemplateRecno = thisMsgTemplateData.mtrecno;");			//get this message template's record number (passed via DOM using the value of the data-* attribute, "data-mtrecno"
printf("			var thisMsgTemplateName = thisMsgTemplateData.mtname;");			//get this message template's name (passed via DOM using the value of the data-* attribute, "data-mtname"
printf("			var thisMsgTemplateDir = thisMsgTemplateData.mtdir;");				//get this message template's directory (passed via DOM using the value of the data-* attribute, "data-mtdir"
printf("			var thisMsgTemplateDesc = thisMsgTemplateData.mtdesc;");			//get this message template's description (passed via DOM using the value of the data-* attribute, "data-mtdesc"
printf("			console.log(\"Popping context menu for message, \\\"\"+thisMsgTemplateName+\"\\\" (template recno \"+thisMsgTemplateRecno+\")...\");");
printf("			var arrMsgTemplateData = [thisMsgTemplateRecno, thisMsgTemplateName, thisMsgTemplateDir, thisMsgTemplateDesc];");
printf("			renderContextMenuForMsg(e, arrMsgTemplateData);");
printf("		};");
printf("		Y.delegate(\"contextmenu\", fxnDoMenuStuff, \"body\", strTargetSelector);");		//within YUI, there's actually an event called 'contextmenu'... hook our function onto that event for any of the specified nodes (note: delegate will poll for a few seconds after page load, so shouldn't matter when, during page loading, this happens)
printf("	});");
printf("	attachContextMenuListenersAlreadyCalled = true;");						//set the global flag to indicate that this function was just executed
printf("}\n");

printf("</script>");
}


/***********************************************************************
* void add_yui_rightClickContextMenu_userDirCamera(int i, char *contextMenuItems, int contextMenuItems_numOfItems, int contextMenuItems_stringLength)
*
*       This function prints the code necessary for the client to 
*       instantiate a context menu, using the YUI framework.
*
*       By: Chris Rider, 2013 Oct
*
* 	Arguments:
* 		i				the user-directory table's "row" number
*       	contextMenuItems		an array of strings that provides menu options
*       	contextMenuItems_numOfItems	number of menu items defined in the array
*       	contextMenuItems_stringLength	number of characters defined for each array element (menu-item string)
*
***********************************************************************/
void add_yui_rightClickContextMenu_userDirCamera(int i, char *contextMenuItems, int contextMenuItems_numOfItems, int contextMenuItems_stringLength)
{
int j;

/* If necessary, bring in the TaffySoft module (which is what provides context-menu support within the YUI framework)
 * DEV-NOTE: if you use the usually-preferable "DOM" method (e.g. createElement & appendChild) to dynamically load this js file, it doesn't load at this snippit's run-time, making it unusable on-the-fly like this */
printf("<script type=\"text/javascript\">\n");
printf("	if(typeof isModuleLoaded_popupmenumanager === 'undefined')\n");		//this is a client state-scoped global that gets set from within popup-menu-manager.js whenever it gets loaded ~~ this logic prevents multiple loads of the same code file over and over again
printf("		{\n");
printf("		document.write(\"<script src='%s/~silentm/javascripts/yui.messagenet/popup-menu-manager/popup-menu-manager.js'><\\/script>\"\n);", cgi_base);
printf("		}\n");
printf("</script>\n");

/* WARNING: do not combine the above "script" block with the one below... the JS above may need to do a document.write into this space */

printf("<script type=\"text/javascript\">\n");

/* Build a YUI instance for context menus...
*  'node' is a YUI module that we use to reference DOM nodes
*  'event' is a YUI module that we use to listen to events (particularly the contextmenu -- or right-click -- event)
*  'popup-menu-manager' is a custom module (by TaffySoft, loaded above), that does the heavy lifting of the right-click (context) menu feature */
printf("YUI().use('node', 'event', 'popup-menu-manager', function (Y) {\n");

/* Instantiate a context menu object... */
printf("	var contextmenufor_camera = new Y.TaffySoft.PopupMenuManager({\n");
printf("		'liBackgroundSelected' : '#cfc',\n");
printf("		'customClass' : 'contextMenu'\n");		// IMPORTANT!!!  - this must be here, or the menu won't go away whenever another menu is opened on the page
printf("	});\n");

/* Configure our menu items | To make a separator line, use: {} | Available components are: label, func, data */
printf("	contextmenufor_camera.set('items', [\n");
for( j=0; j<contextMenuItems_numOfItems; j++ )
	{
	if( j < contextMenuItems_numOfItems - 1 )
		{
		printf("		{ label: '%s', func: doCameraIconContextMenuItemClick, data: '"FORMAT_DBRECORD_STR"' },\n", &contextMenuItems[j*contextMenuItems_stringLength], db_hard_getcur());
		}
	else
		{
		printf("		{ label: '%s', func: doCameraIconContextMenuItemClick, data: '"FORMAT_DBRECORD_STR"' }\n", &contextMenuItems[j*contextMenuItems_stringLength], db_hard_getcur());
		}
	}
printf("	]);\n");

/* Cause the browser to render the menu nodes */
printf("	contextmenufor_camera.render();\n");

/* Hook a 'contextmenu' event listener onto the icon */
printf("	Y.one('#camera-link-id-%d').on('contextmenu', function(e) {\n", i);		//within YUI, there's actually an event called 'contextmenu'
printf("		contextmenufor_camera.runMenu(e);\n");
printf("	});\n");

printf("});\n");
printf("</script>\n");
}


/***********************************************************************
** void add_yui_favorites_clickMsgToLaunch(void)
**
**      Generates the JavaScript to handle what happens when user clicks on a favorite message with the intention to launch it the message template it points to.
**      
***********************************************************************/
void add_yui_favorites_clickMsgToLaunch(void)
{
//printf("<script type=\"text/javascript\">\n");
/* NOT USED -- YET */
//printf("</script>\n");
}
/*******************************************************************
** void add_yuiWindowControl(void)
**
*******************************************************************/
void add_yuiWindowControl(void)
{
printf("<script type=\"text/javascript\">\n");
printf("var yui_globalWindowWidth;");
printf("var yui_globalWindowHeight;");
//printf("setTimeout( function () {");

printf("YUI().use('node', function(Y) {");
printf("  var node = Y.one('body');");

printf("  yui_globalWindowWidth = node.get('winWidth');");
printf("  yui_globalWindowHeight = node.get('winHeight');");
printf("});");

//printf("}, 100);");
printf("</script>\n");
}
