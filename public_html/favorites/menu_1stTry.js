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
 *******************************************************************************************/

var menuJS_cfg_poll_interval = 200;		/* configure how many milliseconds between checks */

function menuJS_execute() {

	function waitAndRetry() {
		setTimeout(function() {
			menuJS_execute();
			}, menuJS_cfg_poll_interval);
		return false;
	}

	/* if document hasn't yet completed loading... */
	if (document.readyState != "complete") {
		console.info("menu.js: Document not ready yet. Will wait "+menuJS_cfg_poll_interval+"ms, and check again...");
		waitAndRetry();
	}

	/* else document looks ready to use, so continue with the main part of this file */
	else {

		/* But first, check for other pre-requisites... */
		if (Boolean(FavScreen) === false) {						/* Check for existence of our FavScreen class */
			console.warn("menu.js: FavScreen must be initialized before this file can execute. Will wait "+menuJS_cfg_poll_interval+"ms, and check again...");
			waitAndRetry();
		}
		if (Boolean(YUI) === false) {							/* Check for existence of YUI */
			FavScreen.log('warn', "menu.js: YUI must be initialized before this file can execute. Will wait "+menuJS_cfg_poll_interval+"ms, and check again...", true);
			waitAndRetry();
		}
		if (Boolean(window.CURRENT_USER_PIN) === false) {		/* Check for existence of a global variable that is required in this file. */
			FavScreen.log('error', "menu.js: Global variable, CURRENT_USER_PIN, is required before this file can execute.", true);
		}
		if (Boolean(document.getElementById("menulist")) === false) {
			FavScreen.log('error', "menu.js: DOM node '#menulist' is required before this file can execute.", true);
		}
		if (Boolean(document.getElementById("menuwrapper")) === false) {
			FavScreen.log('error', "menu.js: DOM node '#menuwrapper' is required before this file can execute.", true);
		}
		if (Boolean(document.getElementById("menuiconwrapper")) === false) {
			FavScreen.log('error', "menu.js: DOM node '#menuiconwrapper' is required before this file can execute.", true);
		}

		/* Construct the menu object */
		var menu_timeoutHideHandle = undefined;													/* initialize a global for holding a handle to a setTimeoutnu shows, so it can be cancelled, if needed */
		var evtHandle_menuicon_click;															/* declare a global for holding the event listner for the menuicon (so we can reliably attach/detach as needed, whenever, without worrying about event-facades being sandboxed) */

		YUI().use('gallery-sm-menu', 'event', function(Y) {										/* using a YUI-gallery-sm-menu module, and events... */

			var cfg_menuTimeout;

			if (typeof window.document.body.childElementCount === "number") {					/* if client is capable of counting number of menu items, then use that to dynamically calculate how long menu should remain visible... */
				var node_menulist = Y.one("#menulist").getDOMNode();								/* get a reference to the DOM node-structure that outlines the menu items (should be rendered before this JS file is brought into the document) */
				var numberOfMenuItems = node_menulist.childElementCount;							/* count number of child nodes in the menulist node (this should be the number of main menu items) */
				cfg_menuTimeout = numberOfMenuItems * 1800;											/* show menu for this many milliseconds per menu item */
			}
			else {																				/* else client cannot easily count menu items, so fall back to static value... */
				cfg_menuTimeout = 10000;															/* configure how long menu stays visible before it automatically hides, in milliseconds */
			}

			FavScreen.menu = new Y.Menu({														/* instantiate a new menu object into our globally-initialized class (this will allow us to easily use the menu from outside of this particular YUI code block) */
				container:'#menuwrapper',
				sourceNode:'#menulist',
				hideOnOutsideClick:true
				});//end YUI-Menu instantiation

			var menuiconAttachClickListener = function() {										/* define a method for attaching an on-click event listener to the menuicon... */
				evtHandle_menuicon_click = Y.one('#menuiconwrapper').on('click', function(e) {		/* define what happens when the menu icon is actually clicked/tapped */
					FavScreen.menu.toggleVisible({anchorPoint:this});								/* toggle the menu's visibility (passing this along as the menu's anchor point ~ where it drops down from) */
					setTimeout( function() {														/* refresh as a timed event, so it won't delay showing the menu after they click/tap the menu icon */
						refreshRecordset(CURRENT_USER_PIN,true,false,true,false);
						refreshRecordset_inboxMsgs(CURRENT_USER_PIN,false,false);
						}, 50);
					});//end YUI click event attachment
				};//end menuiconAttachClickListener
	
			var menuiconDetachClickListener = function(){										/* define a method for detaching the menuicon's on-click event listener... */
				if (typeof evtHandle_menuicon_click==="object") {									/* if event handle is valid... */
					evtHandle_menuicon_click.detach();													/* detach it */
				}
				else {																				/* else log a warning... */
					FavScreen.log('warn', "menuiconDetachClickListener(): evtHandle_menuicon_click is not a valid event handle. Nothing to detach.", true);
				}
				};//end menuiconDetachClickListener

			FavScreen.menu.after('visibleChange', function(e) {									/* define what happens whenever the menu's visibility changes... */
				var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];		/* get a reference to the modal mask (which, of course, is provided whenever a YUI-Panel reders) */
				var headerwrapperHeight = document.getElementById("headerwrapper").offsetHeight;	/* get the calculated height of the headerwrapper area (including padding, etc.) */

				if (!(headerwrapperHeight>0)) {														/* if for some reason we didn't get a valid value, */
					headerwrapperHeight = 60;															/* then fallback to hard-coded assumed height of 60px (this likely will never happen, though) */
				}

				if (this.get('visible')) {															/* if menu is showing... */
					node_modalMask.style.display = "block";												/* show the modal mask */
					node_modalMask.style.top = headerwrapperHeight+"px";								/* position the modal mask so that the header area isn't masked */
					menu_timeoutHideHandle = setTimeout(function() {									/* start a timer to automatically hide the menu after a certain time (specified above) */
						FavScreen.menu.hide();
						}, cfg_menuTimeout);
					FavScreen.log('log', "Menu visible... Temporarily disabling menuicon click listener.", false);
					menuiconDetachClickListener();														/* temporarily disable the menuicon on-click event listener, since hideOnOutsideClick will handle hiding the menu instead */
				}
				else {																				/* else menu is not showing... */
					clearTimeout(menu_timeoutHideHandle);												/* cancel the automatic hide timeout */
					var delay = 600;																	/* define the delay (in milliseconds) - note: any shorter than 600ms seems to cause issues with IE */
					FavScreen.log('log', "Menu now not visible... Setting a delay ("+delay+"ms) for re-enabling menuicon click listener and hiding modal mask...", false);
					setTimeout(function() {																/* re-enable the menuicon click event listener after a short delay */
						FavScreen.log('log', "Menu now not visible... Hiding mask layer and re-enabling menuicon click listener.", false);
						if (safeToHideModalMask) {															/* check for whether or not we should not hide the modal mask (e.g. VersionInfo or some panel may need it) */
							FavScreen.log('log', "  Hiding mask layer (safeToHideModalMask = "+safeToHideModalMask+").", false);
							var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];		/* get a reference to the modal mask (which, of course, is provided whenever a YUI-Panel reders) */
							node_modalMask.style.display = "none";												/* hide the modal mask */
							node_modalMask.style.top = "0px";													/* reset the modal mask's original position for masking the entire document */
						}
						FavScreen.log('log', "  Re-enabling menuicon click listener.", false);
						menuiconAttachClickListener();														/* re-attach the menuicon click event listener */
						}, delay);//end setTimeout
				}//end else
				});//end after-visibleChange

			menuiconAttachClickListener();                                                               //go ahead and attach the initial menuicon on-click event listener
			});//end YUI.use

		/*
		function updateMenu(){
		// DEV-NOTE: need to go through entire menu and update visbility settings for each item, as needed (e.g. don't show "Edit" if we're already in edit, etc.)
			FavScreen.log('warn', \"DEV-NOTE: need to develop updateMenu()\", true);
			var menuRootNode = FavScreen.menu.rootNode;
			FavScreen.menu.traverseNode(menuRootNode, function(menuItem) {
				FavScreen.log('log', menuitem, true);
				YUI().use('node', function(Y){
					});//end YUI.use
				});//end traverseNode method
		}//end function updateMenu()
		*/

		/* Various support stuff for menu */
		function menuAction_launchMode(){
		        FavScreen.set("attrInteractionMode",MODE_LAUNCHABLE);									//change the page's mode
		        FavScreen.applyCookieZoom();
		}//end function menuAction_launchMode()

		function menuAction_makeChanges(){
		        zoomControls_doZoom("100%");															//temporarily set zoom level to normal, so dragging works right (temporary, so don't set attribute/cookie)
		        FavScreen.set("attrInteractionMode",MODE_EDITABLE);										//change the page's mode
		}//end function menuAction_makeChanges()

		function menuAction_deletedFavs(){
		        FavScreen.set("attrInteractionMode",MODE_DELETED);										//change the page's mode
		}//end function menuAction_deletedFavs()


	/* NOTE: likely, no routine changes should be added below this line */
	}//end else
}//end menuJS_execute()
menuJS_execute();