/**********************************************************************************************************************************************
 * favscreen.js
 *
 *	Provides core Favorites / Connections-Mobile functionality.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *		Required files:
 *			dynamics.min.js
 *
 *	Created March 2015 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		2015.03.23 	v1		Prototype created (and then included in the main program - i.e. brought the source in, but not yet used)
 *	
 **********************************************************************************************************************************************/
var versionInfoForJavascriptFile_favscreen = {
	version : "1.10",
	build : "2015.05.15"
	};


/**********************************************************************************************************************************************
 * Class ClassMajorSection (Object cfg)
 *
 *	Defines an instance of a major-section messagelist.
 *
 *	Creating an instance of this class with a proper configuration-object will automatically initialize it,
 *	generate a major-section node, and then put it into the specified container in the HTML document.
 *
 *	REQUIRES:
 *		- Main favs framework
 *			JS-dynamics
 *			JS-integ
 *		- YUI 3.14.1
 *
 *	ARGUMENTS:
 *		- Object cfg 	(required)	An object containing configuration data for the instance. (members below)
 *			String 	cfg.str_containerNodeID					(required)	The DOM ID value of the container entity (e.g. the container DIV) in which to put the major-section.
 *			String 	cfg.str_sectionDomID					(required)	The DOM ID value to assign to the section node (the list).
 *			Object 	cfg.objRef_subheaderEditPanelInstance	(req/opt)	Provide a reference to an instance of the subheader edit panel (it's needed so we know how to handle a subheader item click).
 *			String 	cfg.str_sectionDomClassName				(optional)	Any additional custom class names to give the instance (it will get at least the required default ones, e.g. "messagelist")... multiple classnames should be separated with a space character.
 *			String 	cfg.str_sectionTitleText				(optional)	The title/header-text to display at the top of the section. If not provided, then no header will be generated.
 *			Boolean cfg.bool_enableRefreshIcon				(optional)	Enable the refresh icon for the section (defaults to 'true'). If true, MUST specify handler below.
 *			Object 	cfg.objFxn_refreshHandler				(req/opt)	Specify/define the routine that should handle refreshing (required, if bool_enableRefreshIcon is true).
 *			Boolean	cfg.bool_enableExpandCollapseIcon		(optional)	Enable the expand/collapse toggle icon for the section (defaults to 'true').
 *			String 	cfg.str_initialExpandCollapse			(optional) 	Specify a default-starting expanded/collapsed state (defaults to expanded - EXPANDED_STATE)
 *			String 	cfg.str_baseColor						(optional)	The base-color of the section, in hexadecimal format. Defaults to configured value.
 *				(NOTE: For the following two items, at least one is required!)
 *			Object 	cfg.objArr_messageData					(req/opt)	An array of message-data objects (note: technically, a JavaScript array is a type of object).
 *			Object 	cfg.objYuiRS_messageData				(req/opt)	A YUI-RecordSet of message data.
 *
 *	VISUAL NODE REPRESENTATION & LAYOUT DIAGRAM:
 *		/-[ul_messagelist]-------------------------------------------------------------------\
 *		|  /-[li_sectionheader]-----------------------------------------------------------\  |
 *		|  | +-[div_str_sectionTitleText]-+                      +-[div_actionwrapper]--+ |  |
 *		|  | | [textnode]                 |                      | [img_refresh]        | |  |
 *		|  | +----------------------------+                      | [img_expandcollapse] | |  |
 *		|  |                                                     +----------------------+ |  |
 *		|  | [div_clearfloats]                                                            |  |
 *		|  +------------------------------------------------------------------------------+  |
 *		|  +-[li_messagecell]-------------------------------------------------------------+  |
 *		|  | +-[div_iconwrapper]-+  +-[div_textwrapper]--------+  +-[div_actionwrapper]-+ |  |
 *		|  | | [img_icon]        |  | [div_namewrapper]        |  | [img_draghandle]    | |  |
 *		|  | +-------------------+  | [div_descriptionwrapper] |  | [img_toggle]        | |  |
 *		|  |                        +--------------------------+  +---------------------+ |  |
 *		|  | [div_clearfloats]                                                            |  |
 *		|  +------------------------------------------------------------------------------+  |
 *		|  /-[li_subsectionheader]--------------------------------------------------------\  |	<-- Optional, may or may not exist 		(example might be a personal library subheader - P:00001,00000,00000)
 *		|  | +-[div_str_sectionTitleText]-+                      +-[div_actionwrapper]--+ |  |
 *		|  | | [textnode]                 |                      | [img_draghandle]     | |  |
 *		|  | +----------------------------+                      | [img_refresh]        | |  |
 *		|  |                                                     | [img_expandcollapse] | |  |
 *		|  | [div_clearfloats]                                   +----------------------+ |  |
 *		|  +------------------------------------------------------------------------------+  |
 *		|  +-[li_messagecell]-------------------------------------------------------------+  |  <-- Optional, may or may not exist 		(example might be a personal library's message - P:00001,00001,00000)
 *		|  | +-[div_iconwrapper]-+  +-[div_textwrapper]--------+  +-[div_actionwrapper]-+ |  |
 *		|  | | [img_icon]        |  | [div_namewrapper]        |  | [img_draghandle]    | |  |
 *		|  | +-------------------+  | [div_descriptionwrapper] |  | [img_toggle]        | |  |
 *		|  |                        +--------------------------+  +---------------------+ |  |
 *		|  | [div_clearfloats]                                                            |  |
 *		|  +------------------------------------------------------------------------------+  |
 *		\------------------------------------------------------------------------------------/
 *
 *	HISTORY:
 *		- 2015.03.23	v1 		Prototype created.
 *		- 2015.04.13	v1.0.1 	Further prototyping through to basic functionality.
 *		- 2015.04.16	v1.1 	Rollout into beta version of the app.
 *		- 2015.04.17	v2 		Update to support custom, nested minor sections.
 *		- 2015.05.13	v3 		Added integrity checking to help better manage bad network conditions.
 **********************************************************************************************************************************************/
function ClassMajorSection (cfg) {
	this.version = "3.1";
	this.build = "2015.05.15";

	this.bool_isConstructorLoaded = false; //pre-initialize this at earliest opportunity to be safe

	// VALIDATIONS...
 	//environment...
	if(typeof window.FavScreen !== "object") {
		return console.error("ClassMajorSection: Instantiation requires a valid ClassFavScreen instance to exist in the global scope, as FavScreen. Aborting.");
	}
	if( (typeof FAVS_ICON_REFRESH !== "string" || FAVS_ICON_REFRESH.length < 5) 
		|| (typeof EXPANDED_STATE !== "string" || EXPANDED_STATE.length === 0)
		|| (typeof COLLAPSED_STATE !== "string" || COLLAPSED_STATE.length === 0)
		){
		return FavScreen.log("error", "ClassMajorSection: Instantiation requires certain valid variables/constants to exist in the global scope. Aborting.", true);
	}
	if(typeof window.versionInfoForJavascriptFile_dynamics !== "object") {
		return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid 'dynamics' JavaScript framework to exist in the global scope. Aborting.", true);
	}
	/*
	if(typeof window.versionInfoForJavascriptFile_integ !== "object") {
 		return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid 'integ' JavaScript framework to exist in the global scope. Aborting.", false);
 	}
 	else {
 		if(typeof window.Checksum !== "function") {
 			return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid 'Checksum' class to exist in the global scope. Aborting.", false);
 			//DEV-NOTE: later, make this more intelligent.. try retrying/reloading or something?
 		}
 	}
 	*/
 	if(typeof window.versionInfoForJavascriptFile_secur !== "object") {
 		return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid 'secur' JavaScript framework to exist in the global scope. Aborting.", false);
 	}
 	else {
 		if(typeof window.vig_crypt !== "function") {
 			return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid 'vig_crypt' function to exist in the global scope. Aborting.", false);
 			//DEV-NOTE: later, make this more intelligent.. try retrying/reloading or something?
 		}
 	}
	//required arguments...
	if(typeof cfg !== "object") {
		return FavScreen.log("error", "ClassMajorSection: Instantiation requires a valid configuration object to be provided. Aborting", true);
	}
	if(typeof cfg.str_containerNodeID !== "string"
		|| typeof cfg.str_sectionDomID !== "string"
		){
		return FavScreen.log("error", "ClassMajorSection: Invalid configuration object provided (required members missing or invalid). Aborting.", true);
	}
	//optional arguments... (since they're optional, the validation needed is just to ensure they're properly data-typed)
	if(typeof cfg.str_sectionDomClassName !== "string") {cfg.str_sectionDomClassName = String();} //if no str_sectionDomClass member exists in the object (or was provided as an invalid data-type), then re-type it properly as a string.
	if(typeof cfg.str_sectionTitleText !== "string") {cfg.str_sectionTitleText = String();} //if no str_sectionTitleText member exists in the object (or was provided as an invalid data-type), then re-type it properly as a string.
	if(typeof cfg.bool_enableRefreshIcon !== "boolean") {cfg.bool_enableRefreshIcon = Boolean(true);} //need to go ahead and specify our default of true here, since booleans are uniquely defaulted to false
	if(typeof cfg.objFxn_refreshHandler !== "function") {cfg.objFxn_refreshHandler = function(){FavScreen.log("error","ClassMajorSection #"+cfg.str_sectionDomID+": cfg.objFxn_refreshHandler not specified.",true);};}
	if(typeof cfg.bool_enableExpandCollapseIcon !== "boolean") {cfg.bool_enableExpandCollapseIcon = Boolean(true);} //need to go ahead and specify our default of true here, since booleans are uniquely defaulted to false
	if(typeof cfg.str_initialExpandCollapse !== "string") {cfg.str_initialExpandCollapse = String();}
	if(typeof cfg.str_baseColor !== "string") {cfg.str_baseColor = String();}
	//optional/required arguments...
	if(typeof cfg.objArr_messageData !== "object" && typeof cfg.objYuiRS_messageData !== "object") {cfg.objArr_messageData = [];}
	if(typeof cfg.objRef_subheaderEditPanelInstance !== "object") {
		FavScreen.log("info", "ClassMajorSection: No subheader edit panel instance provided. Won't be able to edit any potential subheaders.", true);
		cfg.objRef_subheaderEditPanelInstance = {};
	}

	// PRIVATE PROPERTIES...
	//setup configuration defaults... (whatever various items should be whenever something didn't quite turn out right)
	var cfg_defaults = {
		str_sectionDomClassName : "",				//no specific class required for now
		str_baseColor : "#CCCCCC",					//light gray
		bool_enableRefreshIcon : true,				//note: if str_sectionTitleText is not specified/valid, then this will not be applicable, and will be overridden below
		bool_enableExpandCollapseIcon : true,		//note: if str_sectionTitleText is not specified/valid, then this will not be applicable, and will be overridden below
		str_initialExpandCollapse : EXPANDED_STATE
	};//end cfg_defaults
	//normalize any provided configuration-items & substitute with defaults if needed...
	if(cfg.str_sectionDomClassName.length === 0) {cfg.str_sectionDomClassName = cfg_defaults.str_sectionDomClassName;} //normalize the provided className or set to default if nothing valid was provided
	if(cfg.str_sectionTitleText.length === 0) { //if no str_sectionTitleText string was specified, then we won't be showing a section header cell, so setup all relevant defaults appropriate for such a case
		FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": Nothing meaningful provided by cfg.str_sectionTitleText, so heading item will not be generated. Setting relevant defaults.", true);
		cfg.bool_enableRefreshIcon = false;
		cfg.bool_enableExpandCollapseIcon = false;
	}//else, our defaults for enable-icons have already been set in the validation step above, so nothing more to do about those!
	if((cfg.str_initialExpandCollapse !== COLLAPSED_STATE) && (cfg.str_initialExpandCollapse !== EXPANDED_STATE)) {cfg.str_initialExpandCollapse = cfg_defaults.str_initialExpandCollapse;} //normalize the provided initial state to default if it's invalid
	if(cfg.str_baseColor.length !== 7) { //there are exactly seven characters in a valid hex color code
		FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": Invalid cfg.str_baseColor value ('"+cfg.str_baseColor+"'). Expected standard hex-color string value. Defaulting to '"+cfg_defaults.str_baseColor+"'.", true);
		cfg.str_baseColor = cfg_defaults.str_baseColor; //normalize the provided base-color by setting it to the configured default if nothing valid was provided (a 7 character hex color)
	}
	//regular private properties
	cfg.str_headerColor = colorShade(cfg.str_baseColor, -0.10); //generate a color that's 10% darker than the base color
	cfg.str_subHeaderColor = colorShade(cfg.str_baseColor, -0.05); //generate a color that's 5% darker than the base color
	//var obj_node_container = {}; //initialize a node object to serve as a reference for this section's container (e.g. contentwrapper)

	// PRIVATE METHODS...
	function expandSection() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": expandSection(): Starting...", true);
		window.expandContainer(cfg.str_containerNodeID); //Note: this is in the "dynamics" JS file
		return;
	}//end function expandSection()
	function collapseSection() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": collapseSection(): Starting...", true);
		window.collapseContainer(cfg.str_containerNodeID); //Note: this is in the "dynamics" JS file
		return;
	}//end function collapseSection()

	function expandSubSection() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": expandSubSection(): Starting...", true);
		//window.expandContainer(cfg.str_containerNodeID); //Note: this is in the "dynamics" JS file
		return;
	}//end function expandSubSection()
	function collapseSubSection() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": collapseSubSection(): Starting...", true);
		//window.collapseContainer(cfg.str_containerNodeID); //Note: this is in the "dynamics" JS file
		return;
	}//end function collapseSubSection()

	function handleRefreshIconClick(evt) { //define how to handle a click on the refresh icon...
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": handleRefreshIconClick(): Starting...", true);
		try {
			evt.preventDefault(); //ensure no other event handlers fire
			evt.stopPropagation(); //ensure no other event handlers fire
			evt.stopImmediatePropagation(); //ensure no other event handlers fire
			if(cfg.objFxn_refreshHandler()) { //if refresh returned success
				expandSection(); //expand the section
			}
			else {
				return FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": handleRefreshIconClick(): Refresh handler did not return an explicit 'true' result.", true);
			}
		}
		catch(err) {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": handleRefreshIconClick(): Caught error ("+err.message+").", true);
		}
	}//end function handleRefreshIconClick

	function handleExpCollIconClick(evt) { //define how to handle a click on the expand/collapse icon - basically pass on the event to the toggleExpandCollapse routine... (Note: this method requires methods located in the "dynamics" JS file)
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": handleExpCollIconClick(): Starting...", true);
		try {
			var objNodeRef_iconClicked = evt.currentTarget;
			var objNodeRef_listItem = objNodeRef_iconClicked.parentNode;
			var str_listItemClass = objNodeRef_listItem.getAttribute("class");
			evt.preventDefault(); //ensure no other event handlers fire
			evt.stopPropagation(); //ensure no other event handlers fire
			evt.stopImmediatePropagation(); //ensure no other event handlers fire
			if(str_listItemClass.indexOf("subsectionheader") > -1) { //if they clicked an expand/collapse icon in a subheader list-item...
				return toggleExpandCollapse_subsection(evt); //call the method to affect just the subsection... it's what does the bulk of the work, and exists in the dynamics javascript file
			}
			else if(str_listItemClass.indexOf("sectionheader") > -1) { //else-if they clicked an expand/collapse icon in a major-section header list-item...
				return toggleExpandCollapse_contentWrapper(evt); //call the method to affect the entire contentwrapper node... it's what does the bulk of the work, and exists in the dynamics javascript file
			}
			else {
				return FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": handleExpCollIconClick(): List-item class not understood ('"+str_listItemClass+"').", true);
			}
		}
		catch(err) {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": handleExpCollIconClick(): Caught error ("+err.message+").", true);
		}
	}//end function handleExpCollIconClick()

	function handleSubheaderClick(evt) { //define how to handle a click on a subheader list-item (e.g. to edit a custom subheader or add new one, etc.)
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": handleSubheaderClick(): Starting...", true);
		try {
			if(FavScreen.get("attrInteractionMode") !== window.MODE_EDITABLE) { //only allow user to do stuff if in edit mode, otherwise, just simply abort without doing anything
				FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleSubheaderClick(): Current mode is '"+FavScreen.get("attrInteractionMode")+"', no action necessary.", true);
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				return false;
			}
			var listItemClicked = evt.currentTarget;
			var favRecno = listItemClicked.getAttribute("id");
			var objSubheaderData = parseSingleRecordDataObjectForFavRecno(favRecno);
			cfg.objRef_subheaderEditPanelInstance.updatePanelWithNewSubsectionData(objSubheaderData); //update the external edit-panel instance's body to reflect this subheader item
			cfg.objRef_subheaderEditPanelInstance.show(); //show the panel			
		}
		catch(err) {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": handleSubheaderClick(): Caught error ("+err.message+").", true);
		}
	}//end function handleSubheaderClick()

	function listItemClickIsValid(evt) { //checks whether the click on a list item is valid, should be allowed, etc.
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): Starting...", true);
		try {
			var ret = true; //initialize a default result
			var cfg_int_focusDelay = 150; //configure amount of time (in milliseconds) to wait before allowing launch after window has been brought into focus (average testing shows 70-110ms is needed ~ go over to be safe)
			var cfg_int_jumpNavDelay = 350; //configure amount of time (in milliseconds) to wait before allowing launch after user has pressed a jump-nav button
			var cfg_int_additionalFooterClickOffset = 10; //configure pixels to bleed the footer's clickable area out into the bodywrapper (to help prevent accidental launches while tapping footer elements)
			
			//get temporal information...
			var tsNow = Date.now(); //get current timestamp
			var tsLast_focus = FavScreen.get("attrLastFocused_window"); //get timestamp from class attribute (should be the last focus-change timestamp)
			var tsLast_jumpNav = FavScreen.get("attrJumpNavLastPressedTimestamp"); //get timestamp from class attribute (should be the last jump-nav button press timestamp)
			
			//get positional information...
			var whereUserClickedY = evt.clientY; //get the Y-position in the client-window where they clicked (don't use pageY, or it'll be the position within the full bodywrapper node)
			var nodeRefPagetitle = document.getElementById("pagetitle");
			var bottomOfPagetitle = nodeRefPagetitle.offsetTop + nodeRefPagetitle.offsetHeight; //get how far from the top of the window the bottom of the pagetitle is
			var topOfFooter = document.getElementById("footerwrapper").offsetTop; //get how far from the top of the window the footer is
			//var bottomOfHeader = document.getElementById('footerwrapper').offsetHeight; //get how far from the top of the window the bottom of the header is

			//get situational/contextual information...
			var currInteractionMode = FavScreen.get("attrInteractionMode");
			var currResponseRule = FavScreen.get("attrCurrentResponseRule");
			
			//test temporal situations for disallowing the click to continue...
			if(!isLoadedInMobileApp() && (tsNow - tsLast_focus <= cfg_int_focusDelay) ){
			        FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): Window was not in focus (tsNow-tsLast_focus="+(tsNow - tsLast_focus)+"ms, delay="+cfg_int_focusDelay+"ms). NOT taking action on message, since the click was likely done just to bring the window into focus.", true);
			        ret = false;
			}
			if(tsNow - tsLast_jumpNav <= cfg_int_jumpNavDelay) {
			        FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): User just pressed a jump-nav button (tsNow-tsLast_jumpNav="+(tsNow - tsLast_jumpNav)+"ms, delay="+cfg_int_jumpNavDelay+"ms). NOT taking action on message, since the click was likely done errantly while trying to press a jump-nav button.", true);
			        ret = false;
			}
			
			//test positional situations for disallowing the click to continue...
			if(whereUserClickedY <= bottomOfPagetitle) { //if the click happened in the pagetitle's clickable area, then abort the launch (they may have been trying to click pagetitle to jump to the top)
			        FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): User just clicked in the pagetitle's area (whereUserClickedY:"+whereUserClickedY+" <= bottomOfPagetitle:"+bottomOfPagetitle+". NOT taking action on message, since the launch was likely unintended while trying to jump to top of document.", true);
			        ret = false;
			}
			if(whereUserClickedY > (topOfFooter - cfg_int_additionalFooterClickOffset)) { //if the click happened in the footer's extra padding (no click-to-launch) area, then abort the launch
			        FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): User just clicked in the footer's extra-padding area (whereUserClickedY:"+whereUserClickedY+" >= topOfFooter:"+topOfFooter+" - cfg_int_additionalFooterClickOffset:"+cfg_int_additionalFooterClickOffset+"). NOT taking action on message, since the click was likely done errantly while trying to press a jump-nav button.", true);
			        ret = false;
			}
			
			//test modal & contextual situations for disallowing the click to continue...
			if((currInteractionMode === MODE_REPLYING) && (currResponseRule === ENCODED_RESPONSE_RULE_2)) { //rule 2 means they shouldn't be allowed to launch any non-predefined reply msg, so catch that here
			        FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): User just clicked a message in reply mode with response-rule-2 in effect ('"+currResponseRule+"'), so cannot allow them to continue. Ending reply-mode (it should have already been ended).", true);
			        window.handleAutoEndResponseMode_setOrReset(0); //NOTE: this is a fall-back.. restoring main node from iframe should do this, primarily
			        ret = false;
			}

			return ret;
		}
		catch(err) {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": listItemClickIsValid(): Caught error ("+err.message+").", true);
		}
	}//end function listItemClickIsValid()

	function handleListItemClick(evt) { //define how to handle a click on the list-item/messagecell...
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Starting, first checking to see if click is valid...", true);
		if(listItemClickIsValid(evt) === false) { //if the click is invalid somehow, disallow continuation
			FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Aborting invalid or disallowed click event.", true);
			return false;
		}
		//FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Aborting to let legacy method proceed (develop this more later).", true);
		//return false;
		try {
			var li = evt.currentTarget; //get a node-reference to the list-item that was clicked on
			var liID = li.getAttribute("id"); //get the ID attribute value of the list-item that was clicked on (we hope it's the fav-recno)
			var liClass = li.getAttribute("class"); //get the CLASS attribute value of the list-item that was clicked on
			var ul = li.parentNode; //get a node-reference to the list-item's parent (the unordered-list node)
			var ulID = ul.getAttribute("id"); //get the ID attribute value of the list that the list-item belongs to
			evt.preventDefault(); //override any default handler that may exist (usually doesn't, but just to be safe)
			evt.stopPropagation(); //stop event bubbling
			evt.stopImmediatePropagation(); //stop event bubbling
			if(isNaN(liID)) { //if the id is not a number, then we don't have a fav-recno
				FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Click target ID attribute value is NaN ('"+liID+"'), aborting.", true);
				return false;
			}
			var cm = FavScreen.get("attrInteractionMode"); //get the current mode of the app
			FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Current mode is '"+cm+"'.", true);
			switch(cm) {
				//do a simple, straight-forward launch...
				case window.MODE_LAUNCHABLE:
					if(ulID.indexOf("dropbox") > -1) { //if the item is in the dropbox list, don't launch
						FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Dropbox items must be moved before launching ('"+liID+"'). Aborting launch.", true);
						window.ModalNotification_DropboxLaunch.showFor(2000);
						return false;
					}
					FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Launching '"+liID+"'...", true);
					window.launchFavorite(liID);
					break;
				//do a regular launch, but need to send server a few special field/value pairs...
				case window.MODE_REPLYING:
					FavScreen.objMsgData_replyWith = { //initialize the reply-with data object, and a few basic members to start with...
						replyWithFavRecno: liID, //banner recno of the message-template to reply with
						replyWithFavIcon: window.getDataFromMessagecellDOM_favIconSrc(liID), //entire string of the icon (what would go in the IMG's SRC attribute)
						replyWithFavName: window.getDataFromMessagecellDOM_favName(liID), //name of the message on the fav's screen (not the msg-template key/name)
						replyWithMsgTemplateDir: window.rsRec_getMsgTemplateDir(FavScreen.rsOrig, liID) //directory of the message template that they're using to reply with
						};
					//NOTE: the following shared-lib case will not go into effect, until the shared-lib section is migrated over to using this new class model!
					if(liClass.indexOf("libmsg") > -1) { //if replying with a shared-library message...
						FavScreen.objMsgData_replyWith.replyWithMsgTemplateName = window.getDataFromMessagecellDOM_msgTemplateName(liID); //name of the message template that they're using to reply with
						FavScreen.objMsgData_replyWith.replyWithMsgTemplateRecno = window.getDataFromMessagecellDOM_msgTemplateRecno(liID); //record number of the message template that they're using to reply with
						if(window.getDataFromMessagecellDOM_libPin(liID).trim() == window.FAVS_LIB_USER_STDREPLIES_PIN) { //if they clicked on a standard-reply message (show the reply dialog)...
							FavScreen.log("log","ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Reply-with message is in the standard-reply library. Showing reply-dialog...",false);
							return FavScreen.MessageReplyDialog.show(); //initiate user dialog to actually reply (Note: routine is defined in dialogs.js file)
						}
						else { //else not a standard reply item (future-dev: expand other libs to new way we're using for standard reply, above)
							FavScreen.log("log","ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Reply-with message is not in the standard-reply library. Treating it like a normal reply, and launching...",false);
							window.launchFavorite(liID);
						}
					}
					else { //else responding with a regular message
						FavScreen.objMsgData_replyWith.replyWithMsgTemplateName = window.rsRec_getMsgTemplateName(FavScreen.rsOrig, liID); //name of the message template that they're using to reply with
						FavScreen.objMsgData_replyWith.replyWithMsgTemplateRecno = window.rsRec_getMsgTemplateRecno(FavScreen.rsOrig, liID); //record number of the message template that they're using to reply with
						FavScreen.log("log","ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Reply-with message does not belong to a library (it may be a normal message). Launching...",false);
						window.launchFavorite(liID);
					}
					break;
				//call the edit panel, but only if certain conditions are met...
				case window.MODE_EDITABLE:
					if(liClass === null //if invalid class, then it's likely an invalid item for editing
					|| liClass.indexOf("messagecell") === -1 ) {
						FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Invalid item for editing ('"+liID+"'). Aborting edit.", true);
						return false;
					}
					else if(liClass.indexOf("libmsg") > -1) { //else-if item is in shared library that the current user doesn't own, then it's invalid for editing
						var li_nest = ul.parentNode; //attempt to get the LI that the LI/UL they clicked on is nested inside
						if((typeof li_nest !== 'undefined') && (li_nest.getAttribute('data-userpin') !== null)) { //if the container LI node exists and bears a 'data-userpin' attribute, then use that to see if the owner matches the current user
							if(li_nest.getAttribute("data-userpin") != window.CURRENT_USER_PIN) { //if library-message's user-pin (owner) does NOT match the current user, don't allow the current user to edit it
								FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Current user not allowed to edit shared-library item ('"+liID+"') owned by '"+li_nest.getAttribute("data-userpin").trimRight()+"'. Aborting edit.", true);
								return false;
							}
						}
					}
					FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Editing '"+liID+"'...", true);
					window.editFav_popPanel(liID, evt, li);
					break;
				case window.MODE_DELETED: //not yet developed!
				default:
					break;
			}//end switch
			return true; //if we got to here, then we never returned an explicit false, meaning we implicitly succeeded at doing something meaningful
		}
		catch(err) {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": handleListItemClick(): Caught error ("+err.message+").", true);
		}
	}//end function handleRefreshIconClick

	function generateMoveHandleIcon() { //do the work to actually generate/create a move-handle-icon
		var oNode_img_move = document.createElement("img"); //create the object for an IMG node
			oNode_img_move.setAttribute("class", "headericon"); //give it a CLASS attribute with value
			oNode_img_move.style.visibility = "hidden"; //DEV-NOTE: temporary until we can get an icon there?
			//oNode_img_refresh.src = FAVS_ICON_REFRESH; //specify the SRC attribute value for the location of the icon-image resource on the server
			//NOTE: the following is not compatible with IE older than 9...
			//oNode_img_refresh.addEventListener("click", handleRefreshIconClick, true); //add a click listener, and capture the event strictly at this node (prevent bubbling up the tree, which should help prevent unintended handlers from executing, if there are any)
			//oNode_img_refresh.onclick = handleRefreshIconClick; //add a click listener
		return oNode_img_move;
	}//end function generateMoveHandleIcon()

	function generateExpandCollapseIcon() { //do the work to actually generate/create an expand/collapse icon node, and then return it...
		var str_initialExpandCollapseIconSrc = String();
		if(cfg.str_initialExpandCollapse === COLLAPSED_STATE) { //specify a default expand/collapse icon, depending on what default initial state has been specified/determined
			str_initialExpandCollapseIconSrc = FAVS_ICON_MAXIMIZE;
		} else {
			str_initialExpandCollapseIconSrc = FAVS_ICON_MINIMIZE;
		}
		var oNode_img_expcoll = document.createElement("img"); //create the object for an IMG node
			oNode_img_expcoll.setAttribute("class", "headericon minmax"); //give it a CLASS attribute with value
			oNode_img_expcoll.src = str_initialExpandCollapseIconSrc; //specify the SRC attribute value for the location of the icon-image resource on the server
			//NOTE: the following is not compatible with IE older than 9...
			//oNode_img_expcoll.addEventListener("click", handleExpCollIconClick, true); //add a click listener, and capture the event strictly at this node (prevent bubbling up the tree, which should help prevent unintended handlers from executing, if there are any)
			oNode_img_expcoll.onclick = handleExpCollIconClick; //add a click listener
		return oNode_img_expcoll;
	}//end function generateExpandCollapseIcon()

	function generateRefreshIcon() { //do the work to actually generate/create a refresh icon node, and then return it...
		var oNode_img_refresh = document.createElement("img"); //create the object for an IMG node
			oNode_img_refresh.setAttribute("class", "headericon"); //give it a CLASS attribute with value
			oNode_img_refresh.src = FAVS_ICON_REFRESH; //specify the SRC attribute value for the location of the icon-image resource on the server
			//NOTE: the following is not compatible with IE older than 9...
			//oNode_img_refresh.addEventListener("click", handleRefreshIconClick, true); //add a click listener, and capture the event strictly at this node (prevent bubbling up the tree, which should help prevent unintended handlers from executing, if there are any)
			oNode_img_refresh.onclick = handleRefreshIconClick; //add a click listener
		return oNode_img_refresh;
	}//end function generateRefreshIcon()

	function generateFloatClearingElement() { //do the work to actually generate/create a CSS-Float clearing node, and then return it...
		var oNode_div_clearfloats = document.createElement("div"); //create the object for our float-clearing element
			oNode_div_clearfloats.setAttribute("class", "clearfloats"); //assign the CSS class that will apply float-clearing
		return oNode_div_clearfloats;
	}//end function generateFloatClearingElement()

	function generateListItem_header() {	//do the work to actually generate/create the DOM structure of the major-section header LI (list-item) node, and then return it...
		var ret = false; //initialize a default return value
		var needFloatClear = Boolean(false); //initialize a flag
		var cfg_li_domID = "";
		var cfg_li_classname = "sectionheader sublistheader roundedtopcorners8";
		var cfg_li_style = "background-color:"+cfg.str_headerColor+";";
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_header(): Starting...", true);
		try {
			//create and configure the main LI node...
			var oNode_li = document.createElement("li"); //create the object for a LI node (which is the main guy that should get returned, when completed)
				oNode_li.setAttribute("id", cfg_li_domID); //give it an ID attribute with whatever we configured above
				oNode_li.setAttribute("class", cfg_li_classname); //give it a CLASS attribute with whatever we need to style it as a section-title (defined above)
				oNode_li.setAttribute("style", cfg_li_style);
			//create the text-node that will be the actual heading-text of the section...
			var oNode_text_sectionTitleText = document.createTextNode(cfg.str_sectionTitleText); //create a proper "text" node for our section heading title text (note: sure, this *could* be done with an innerHTML on the span below, but this is more proper)
			var oNode_span_sectionTitleText = document.createElement("span"); //create a SPAN wrapper node for the text, so it can be packaged up neatly
				oNode_span_sectionTitleText.appendChild(oNode_text_sectionTitleText); //add the just-created text node to its wrapper node
			//go ahead and begin to assemble the nodes into the final version...
			//Note: The right-floated elements (if any) should be added to the section-header LI node in reversed order (e.g. add refresh first, then add expand/collapse, etc.)
			oNode_li.appendChild(oNode_span_sectionTitleText); //the title text is an inline element, so we should be alright to just go ahead and add it before any right-floated elements below
			//if we need a refresh icon, create, configure, and add one to the main LI node...
			if(cfg.bool_enableRefreshIcon) {
				oNode_li.appendChild(generateRefreshIcon()); //add the refresh icon to the main LI node
				needFloatClear = true; //set our flag, since the refresh-icon is styled as a right-floated element
			}
			//if we need an expand/collapse icon, create, configure, and add one to the main LI node...
			if(cfg.bool_enableExpandCollapseIcon) {
				oNode_li.appendChild(generateExpandCollapseIcon()); //add the expand/collapse icon to the section heading LI
				needFloatClear = true;
			}
			//finally, if we added right-floated stuff above... create, configure, and add a div just for clearing the floats, so left and right floated elements can co-exist peacfully with whatever may be below them
			if(needFloatClear) {
				oNode_li.appendChild(generateFloatClearingElement()); //add the clear to the end of the LI node
			}
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_header(): Completed. Returning LI node.", true);
			return oNode_li;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_header(): Caught error ("+err.message+"). Header list-item cell not generated.", true);
			return ret;
		}
	}//end function generateListItem_header()

	function generateListItem_subHeader(obj_data) { //do the work to actually generate/create the DOM structure of a minor-section/subheader LI node, and then return it...
		var ret = false; //initialize a default return value
		var needFloatClear = Boolean(false); //initialize a flag
		var cfg_li_classname = "subsectionheader sublistheader roundedtopcorners8 sortable "; //DEV-NOTE: these were just re-used from library hacked manner... redo more properly?
		var cfg_li_style = "background-color:"+cfg.str_subHeaderColor+";";
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_subHeader(): Starting...", true);
		try {
			//validate argument
			if(typeof obj_data !== "object") {
				FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_subHeader(): Valid obj_data argument is required (obj_data type is "+typeof obj_data+"). Aborting and returning "+ret+".", true);
				return ret;
			}
			//override default major section color
			if(obj_data.color.indexOf("#") === 0) { //if an explicit color is desired for the subheader, then override the default and use it instead for this one
				//cfg_li_style = "background-color:"+colorShade(obj_data.color, -0.10)+";"; //initialize a slightly darker version of the color, to start with
				var color_darkened = colorShade(obj_data.color, -0.10); //calculate a slightly darker version of the base-color
				var arr_RGB = color_HexToRGB(color_darkened); //convert the darkened hex color string into an array of RGB values
				var arr_HSV = color_RGBtoHSV(arr_RGB);//convert that array of RGB values into HSV values
				var sat = arr_HSV[1]; //get the saturation value
				//sat = parseInt((sat*1.1), 10); //increase the saturation a bit
				sat = sat * 1.3; //increase the saturation a bit
				sat = sat>255?255:sat; //make sure we're max-out at 255 and not over
				arr_HSV[1] = sat; //plug the updated saturation value back into the array
				arr_RGB = color_HSVtoRGB(arr_HSV); //convert the HSV with updated saturation back into RGB
				cfg_li_style = "background-color:"+color_RGBtoHex(arr_RGB)+";"; //update the background color style with our final, darker and more saturated color
			}
			//create and configure the main LI node...
			var oNode_li = document.createElement("li"); //create the object for a LI node (which is the main guy that should get returned, when completed)
				oNode_li.setAttribute("id", obj_data.recno_fav); //give it an ID attribute with whatever recno_fav was passed-in
				oNode_li.setAttribute("class", cfg_li_classname); //give it a CLASS attribute with whatever we need to style it as a section-title (defined above)
				oNode_li.setAttribute("style", cfg_li_style);
				oNode_li.onclick = handleSubheaderClick; //add a click listener
			//create the anchor node that will enable the minor-section jumping to work...
			var oNode_a_forJumpNav = document.createElement("a");
				oNode_a_forJumpNav.setAttribute("id", "personallibAnchor_"+obj_data.recno_fav);
				oNode_a_forJumpNav.setAttribute("name", "personallibAnchor_"+obj_data.recno_fav);
				oNode_a_forJumpNav.setAttribute("class", "subsectionAnchor jumpEligible"); //apply the classes that the minor-jump-nav feature will utilize in order to do its thing
			//create the text-node that will be the actual heading-text of the section...
			var oNode_text_sectionTitleText = document.createTextNode(obj_data.label1); //create a proper "text" node for our section heading title text (note: sure, this *could* be done with an innerHTML on the span below, but this is more proper)
			var oNode_span_sectionTitleText = document.createElement("span"); //create a SPAN wrapper node for the text, so it can be packaged up neatly
				oNode_span_sectionTitleText.appendChild(oNode_text_sectionTitleText); //add the just-created text node to its wrapper node
			//go ahead and begin to assemble the nodes into the final version...
			//Note: The right-floated elements (if any) should be added to the section-header LI node in reversed order (e.g. add refresh first, then add expand/collapse, etc.)
			oNode_li.appendChild(oNode_a_forJumpNav); //the title text is an inline element, so we should be alright to just go ahead and add it before any right-floated elements below
			oNode_li.appendChild(oNode_span_sectionTitleText); //the title text is an inline element, so we should be alright to just go ahead and add it before any right-floated elements below
			//DEV-NOTE: add refresh icon here, but it will need its own handler/context ideally?
			//create a move-handle icon....
			oNode_li.appendChild(generateMoveHandleIcon()); //add the move-handle icon to the section heading LI
			//if we need an expand/collapse icon, create, configure, and add one to the main LI node...
			if(cfg.bool_enableExpandCollapseIcon) {
				oNode_li.appendChild(generateExpandCollapseIcon()); //add the expand/collapse icon to the section heading LI
				needFloatClear = true;
			}
			//finally, if we added right-floated stuff above... create, configure, and add a div just for clearing the floats, so left and right floated elements can co-exist peacfully with whatever may be below them
			if(needFloatClear) {
				oNode_li.appendChild(generateFloatClearingElement()); //add the clear to the end of the LI node
			}
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_subHeader(): Completed. Returning LI node.", true);
			return oNode_li;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_subHeader(): Caught error ("+err.message+"). Sub-header list-item cell not generated.", true);
			return ret;
		}
	}//end function generateListItem_subHeader()

	function generateListItem_messageCell(obj_data) { //generate a messagecell based on the data provided in the argument (should just be our standard name:value pairs - same as what's in the recordsets, object-literals, etc.)
		var ret = false; //initialize a default return value
		var needFloatClear = Boolean(false); //initialize a flag
		var cfg_li_classname = "messagecell sortable "; //note: good practice to have the trailing space, in case other classes are added later
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_messageCell(): Starting...", true);
		try {
			//validate argument
			if(typeof obj_data !== "object") {
				FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_messageCell(): Valid obj_data argument is required (obj_data type is "+typeof obj_data+"). Aborting and returning "+ret+".", true);
				return ret;
			}
			//create and configure the main LI node...
			var oNode_li = document.createElement("li"); //create the object for a LI node (which is the main guy that should get returned, when completed)
				oNode_li.setAttribute("id", obj_data.recno_fav); //give it an ID attribute value for the fav-recno
				oNode_li.setAttribute("class", cfg_li_classname); //give it a CLASS attribute with whatever we need to style it as a messagecell (defined above)
				oNode_li.style.backgroundColor = obj_data.color; //dynamically give the LI the color of its subheader (should have been passed to us from the caller routine)
				oNode_li.style.marginLeft = "-2px";
				oNode_li.style.marginRight = "-2px";
				oNode_li.setAttribute("data-msgtemplatename", obj_data.msgname);
				oNode_li.setAttribute("data-msgtemplaterecno", obj_data.recno_msgtemplate);
				oNode_li.onclick = handleListItemClick; //add a click listener & define its handler
			//create and configure the icon and its wrapper...
			var oNode_img_icon = document.createElement("img");
			if(obj_data.icon.length > 0) {
				oNode_img_icon.src = FAVS_ICON_PATH + "/" + obj_data.icon;
			}
			else {
				oNode_img_icon.src = FAVS_ICON_PATH + "/" + FAVS_DEFAULT_UNSORTED_ICON_FILE;
			}
			var oNode_div_iconwrapper = document.createElement("div");
				oNode_div_iconwrapper.setAttribute("class", "iconwrapper");
				oNode_div_iconwrapper.appendChild(oNode_img_icon);
			//create and configure the text areas and their wrapper...
			var oNode_text_line1;
			if(obj_data.label1.length > 0) {
				oNode_text_line1 = document.createTextNode(obj_data.label1);
			}
			else {
				oNode_text_line1 = document.createTextNode(obj_data.msgname);
			}
			var oNode_div_namewrapper = document.createElement("div");
				oNode_div_namewrapper.setAttribute("class", "namewrapper");
				oNode_div_namewrapper.appendChild(oNode_text_line1);
			var oNode_text_line2;
			var oNode_div_descwrapper = document.createElement("div");
				oNode_div_descwrapper.setAttribute("class", "descriptionwrapper");
			if(obj_data.label2.length > 0) { //if something is specified for description, let's add it
				oNode_text_line2 = document.createTextNode(obj_data.label2);
				oNode_div_descwrapper.appendChild(oNode_text_line2);
			}
			else { //if there was no description text, then shift the name text down and enlarge it slightly, so it doesn't look like something's missing
				oNode_div_namewrapper.style.marginTop = "7px";
				oNode_div_namewrapper.style.fontSize = "15px";
			}
			var oNode_div_textwrapper = document.createElement("div");
				oNode_div_textwrapper.setAttribute("class", "textwrapper");
				oNode_div_textwrapper.appendChild(oNode_div_namewrapper);
				oNode_div_textwrapper.appendChild(oNode_div_descwrapper);
			//create and configure the action icons and their wrapper...
			var oNode_img_draghandle = document.createElement("img");
				oNode_img_draghandle.setAttribute("id", "draghandleicon_"+obj_data.recno_fav);
				oNode_img_draghandle.setAttribute("class", "affectedbyinteractionmode ");
				oNode_img_draghandle.src = FAVS_ICON_PATH + "/" + FAVS_ICON_DRAGHANDLE;
				oNode_img_draghandle.display = "none";
			var oNode_img_toggle = document.createElement("img");
				oNode_img_toggle.setAttribute("id", "toggleicon_"+obj_data.recno_fav);
				oNode_img_toggle.setAttribute("class", "affectedbytoggle ");
				oNode_img_toggle.src = FAVS_ICON_TOGGLE_CLOSE;
				oNode_img_toggle.display = "none";
			var oNode_div_actionwrapper = document.createElement("div");
				oNode_div_actionwrapper.setAttribute("class", "actionwrapper");
				oNode_div_actionwrapper.appendChild(oNode_img_draghandle);
				oNode_div_actionwrapper.appendChild(oNode_img_toggle);
				oNode_div_actionwrapper.style.display = "none"; //initially, no display since it's launch-mode
			//almost done, assemble the wrappers into the list-item...
			oNode_li.appendChild(oNode_div_actionwrapper); //goes first, since it's right-floated
			oNode_li.appendChild(oNode_div_iconwrapper);
			oNode_li.appendChild(oNode_div_textwrapper);
			//finally, since we added right-floated stuff above... create, configure, and add a div just for clearing the floats, so left and right floated elements can co-exist peacfully with whatever may be below them
			var oNode_div_clearfloats = document.createElement("div"); //create the object for our float-clearing element
				oNode_div_clearfloats.setAttribute("class", "clearfloats"); //assign the CSS class that will apply float-clearing
			oNode_li.appendChild(oNode_div_clearfloats); //add the clear to the end of the LI node
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_messageCell(): Completed. Returning LI node.", true);
			return oNode_li;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_messageCell(): Caught error ("+err.message+"). A messagecell list-item was not generated.", true);
			return ret;
		}
	}//end function generateListItem_messageCell()

	function generateListItem_noMessagesCell(obj_data) {
		var ret = false; //initialize a default return value
		var cfg_li_domID = "";
		var cfg_li_classname = "nomessages sortable"; //needs sortable in order to allow drop of actual messagecell items - as long as there's no drag handle, it won't be draggable!
		var cfg_li_style = "";
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_noMessagesCell(): Starting...", true);
		try {
			if(typeof obj_data === "undefined") {
				obj_data = {
					color: ""
				};
			}
			//create and configure the main LI node...
			var oNode_li = document.createElement("li"); //create the object for a LI node (which is the main guy that should get returned, when completed)
				oNode_li.setAttribute("id", cfg_li_domID); //give it an ID attribute with whatever we configured above
				oNode_li.setAttribute("class", cfg_li_classname); //give it a CLASS attribute with whatever we need to style it as a section-title (defined above)
				oNode_li.setAttribute("style", cfg_li_style);
				oNode_li.style.backgroundColor = obj_data.color; //dynamically give the LI the color of its subheader (should have been passed to us from the caller routine)
				oNode_li.style.marginLeft = "-2px"; //make the left edge butt right up to the left side of the contentwrapper
				oNode_li.style.marginRight = "-2px"; //make the right edge butt right up to the right side of the contentwrapper
			//create the text-node that will be the actual no-messages text...
			var oNode_text_noMessages = document.createTextNode(FAVS_DEFAULT_NOFAVSTODISPLAYHTML); //create a proper "text" node for our no-messages text (note: sure, this *could* be done with an innerHTML on the span below, but this is more proper)
			var oNode_span_noMessages = document.createElement("span"); //create a SPAN wrapper node for the text, so it can be packaged up neatly
				oNode_span_noMessages.appendChild(oNode_text_noMessages); //add the just-created text node to its wrapper node
			//finally, put the LI node together...
			oNode_li.appendChild(oNode_span_noMessages);
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_noMessagesCell(): Completed. Returning LI node.", true);
			return oNode_li;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListItem_noMessagesCell(): Caught error ("+err.message+"). A no-messages list-item was not generated.", true);
			return ret;
		}
	}//end function generateListItem_noMessagesCell()
	
	function generateListNode() { //do the work to actually generate/create the DOM structure of the UL (list) node, and then return it... (note: this alone will not populate the list with items)
		var ret = false; //initialize a default return value
		var cfg_ul_classname = "messagelist";
		var needFloatClear = Boolean(false); //initialize a flag
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListNode(): Starting...", true);
		try {
			var cfg_ul_domID = cfg.str_sectionDomID; //ID attribute with whatever value was configured in the class' configuration object
			cfg_ul_classname = cfg_ul_classname + " " + cfg.str_sectionDomClassName; //CLASS attribute with whatever was configured in the class' configuration object
			//WARN: if you do background-color style below, there won't be nice rounded top corners!
			//var cfg_ul_style = "background-color:"+cfg.str_baseColor+";"; //STYLE attribute with any custom styles (note: these will naturally override any other styles, since they'll be inline-CSS)
			//create and configure the main UL list node object...
			var oNode_ul = document.createElement("ul"); //create the object for a UL node
				oNode_ul.setAttribute("id", cfg_ul_domID); //give it an ID attribute with whatever value was configured
				oNode_ul.setAttribute("class", cfg_ul_classname); //give it a CLASS attribute with whatever value was configured
				//oNode_ul.setAttribute("style", cfg_ul_style);
			//generate the list's heading, and add it to the main list node (which is just a specialize LI child of the list)...
			var oNode_li_sectionHeading = generateListItem_header(); //call the routine to generate the heading list-item
			oNode_ul.appendChild(oNode_li_sectionHeading); //add the heading list-item to the list
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListNode(): Completed. Returning UL node (note: to populate it with list-items, run populateListNode).", true);
			return oNode_ul;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": generateListNode(): Caught error ("+err.message+").", true);
			return ret;
		}
	}//end function generateListNode()

	function determineAndPrepareDataSource() { //figure out which data source to use, and pull its data out into a usable format (array of object-literals)
		var ret = []; //initialize a default return value
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): Starting...", true);
		try {
			var nameOfObject, sizeOfRecordset;
			if((typeof cfg.objArr_messageData === "object") && (typeof cfg.objYuiRS_messageData === "object")) { //if both are provided, we'll need to determine which is the best to use
				//determine which is best (how to define best? largest?)
				//NOTE: just for now, going to assume YUI-RS is best (since it can be updated/refreshed, etc.)
				nameOfObject = String(cfg.objYuiRS_messageData.name); //try to get the name of this object (should return "recordset" for a valid YUI Recordset instance)
				if(nameOfObject === "recordset") { //validate whether this is actually a YUI recordset object
					sizeOfRecordset = cfg.objYuiRS_messageData.size();
					if(sizeOfRecordset > 0) { //if there are any records in the recordset, extract them into the local data source...
						cfg.objYuiRS_messageData.each( function(){ //export the recordset to an array of objects (using the .each method)
							ret.push(this.get("data")); //add the data object for each record as a new element in the local array that we'll use to populate the list
							});//end .each
					}
					else { //else nothing in the recordset
						FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): No records in recordset. (sizeOfRecordset = "+sizeOfRecordset+").", true);
					}
				}
				else {
					FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): Recordset provided is not actually a YUI Recordset (nameOfObject = "+nameOfObject+"). No other data sources available, aborting.", true);
					return ret;
				}
			}
			else if((typeof cfg.objArr_messageData === "object") && (typeof cfg.objYuiRS_messageData !== "object")) { //if just an array of objects is provided, use it obviously
				var lengthOfObjectArray = cfg.objArr_messageData.length;
				if(lengthOfObjectArray >= 0) { //validate whether some length was actually reported (and thus, this really should be array)...
					ret = cfg.objArr_messageData; //just do a copy, since this should be an apples-to-apples kind of deal
				}
				else { //else no length was available (so likely not an array)
					FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): No array length available (lengthOfObjectArray = "+lengthOfObjectArray+"). No other data sources available, aborting.", true);
					return ret;
				}
			}
			else if((typeof cfg.objArr_messageData !== "object") && (typeof cfg.objYuiRS_messageData === "object")) { //if just a YUI recordset is provided, use it obviously
				nameOfObject = String(cfg.objYuiRS_messageData.name); //try to get the name of this object (should return "recordset" for a valid YUI Recordset instance)
				if(nameOfObject === "recordset") { //validate whether this is actually a YUI recordset object
					sizeOfRecordset = cfg.objYuiRS_messageData.size();
					if(sizeOfRecordset > 0) { //if there are any records in the recordset, extract them into the local data source...
						cfg.objYuiRS_messageData.each( function(){ //export the recordset to an array of objects (using the .each method)
							ret.push(this.get("data")); //add the data object for each record as a new element in the local array that we'll use to populate the list
							});//end .each
					}
					else { //else nothing in the recordset
						FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): No records in recordset. (sizeOfRecordset = "+sizeOfRecordset+").", true);
					}
				}
				else {
					FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): Recordset provided is not actually a YUI Recordset (nameOfObject = "+nameOfObject+"). No other data sources available, aborting.", true);
					return ret;
				}
			}
			else { //else no data was made available
				FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): No data sources available, aborting.", true);
				return ret;
			}
			if(cfg.objArr_messageData.length === 0) { //if it seems only a recordset was provided, go ahead an populate the object-literal for easy access later, too
				cfg.objArr_messageData = ret;
			}
			return ret;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": determineAndPrepareDataSource(): Caught error ("+err.message+").", true);
			return ret;
		}
	}//end function determineAndPrepareDataSource()

	function parseSingleRecordDataObjectForFavRecno(str_favRecno) { //returns a single record/data object-literal corresponding with the recno supplied
		var ret = false;
		for(var i=0; i<cfg.objArr_messageData.length; i++) {
			if(cfg.objArr_messageData[i].recno_fav == str_favRecno) {
				return cfg.objArr_messageData[i];
			}//end if match found
		}//end for
		if(!ret) { //if no result was found, fall back to look in the recordset, just in case the two possible data sources aren't synced up
			for(var i=0; i<cfg.objYuiRS_messageData.size(); i++) {
				if(cfg.objYuiRS_messageData.item(i).get("data").recno_fav == str_favRecno) {
					return cfg.objYuiRS_messageData.item(i).get("data"); //return the data in the expected object-literal format
				}
			}
		}
		return ret;
	}//end function parseSingleRecordDataObjectForFavRecno()

	function parsePositionTypeFlag(str_position) { //given a standard "position" string (e.g. "S:00001:00000:00000"), parse the position type flag code and return it (e.g. "S")
		var ret = String();
		function getTypeChar(str) {
			return String(str).split(FAVS_POSITION_DELINEATE_TYPE)[0];
		}
		try {
			ret = window.FAVS_UNSORTED_FLAG; //initialize a default return value of 'unsorted' type
			if(typeof str_position !== "string") {
				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionTypeFlag('"+String(str_position)+"'): Argument is not a string, attempting to convert and return...", true);
				ret = getTypeChar(str_position);
			}
			else {
				ret = getTypeChar(str_position);
				FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionTypeFlag('"+String(str_position)+"'): Completed. Returning '"+ret+"'.", true);
			}
			return ret;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionTypeFlag('"+String(str_position)+"'): Caught error ("+err.message+").", true);
			return ret;
		}
	}//end function parsePositionTypeFlag()

	function parsePositionValueForDimension(str_position, int_dimension) { //given a standard "position" string (e.g. "S:00001:00000:00000"), parse the specified position value and return its string (e.g. "00001" for 1, "00000" for 2 or 3)
		var ret = -1;
		try {
			ret = window.FAVS_UNSORTED_FLAG; //initialize a default return value of 'unsorted' type
			if(typeof str_position !== "string") {
				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionValueForDimension('"+String(str_position)+"', "+int_dimension+"): Argument is not a string, attempting to convert and continue...", true);
				str_position = String(str_position);
			}
			if(typeof int_dimension !== "number") {
				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionValueForDimension('"+String(str_position)+"', "+int_dimension+"): Argument is not a number-type, attempting to convert and continue...", true);
				int_dimension = parseInt(int_dimension, 10); //assuming it should be from 10-base number system
			}
			ret = str_position.split(FAVS_POSITION_DELINEATE_TYPE)[1].split(FAVS_POSITION_DELINEATE_COORD)[int_dimension-1];
			FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionValueForDimension('"+String(str_position)+"', "+int_dimension+"): Completed. Returning '"+ret+"'.", true);
			return ret;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": parsePositionValueForDimension('"+String(str_position)+"'): Caught error ("+err.message+").", true);
			return ret;
		}
	}//end function parsePositionValueForDimension()

	function populateListNode() { //do the work of actually filling the section-list with messagecells, based on data from what was provided (returns number of items populated)
		var ret = 0; //initialize a default return value
		var objArr_data = determineAndPrepareDataSource(); //initialize a local data source that this routine will use to populate the list
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Starting...", true);
		try {
			//first, check to see if a list node exists in the DOM...
			var objNodeRef_theList = document.getElementById(cfg.str_sectionDomID); //try to get a reference to the list node
			if(typeof objNodeRef_theList === "undefined") {
				FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): No list-node available (objNodeRef_theList = "+objNodeRef_theList+"). Run generateListNode(), first. Aborting.", true);
				return ret;
			}
			//go through the data and generate the DOM structure...
			var objNode_listItem; //just to manage memory more cleanly (used in construct below)
			var str_positionTypeFlag; //just to manage memory more cleanly (used in construct below)
			var str_color; //just to manage memory more cleanly (used in construct below)
			var int_sortOrder_dimA = int_sortOrder_dimB = -1;
			if(objArr_data.length > 0) { //if we actually have data (at least one message item)...
				FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): "+objArr_data.length+" msg/subsection item(s) exist in the data source.", true);
				var obj_listItem; //just to manage memory more cleanly (used in loop below)
				for(var i=0; i<objArr_data.length; i++) { //for each list item in the array of message records... (note: these may also be sub-headers, which are pseudo-messages)
					obj_listItem = objArr_data[i]; //get this iteration's message data in an easy-to-use place
					int_sortOrder_dimA = parseInt(parsePositionValueForDimension(obj_listItem.position, 1), 10);
					int_sortOrder_dimB = parseInt(parsePositionValueForDimension(obj_listItem.position, 2), 10);
					str_positionTypeFlag = parsePositionTypeFlag(obj_listItem.position); //get this iteration's position-type-flag code
					switch(str_positionTypeFlag) { //do different things for different types (the switch construct is faster inside loops, generally)
						case window.FAVS_LIBRARY_PERSONAL_FLAG:
							FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Item is a 'personal library' type, and may either be a normal message or a subsection header.", true);
							//for subsection-typed records, if the 1st-dimension is a real number, and the 2nd-dimension is zero, that's our clue that we're dealing with a subheader type of message
							if(int_sortOrder_dimA > 0 && int_sortOrder_dimB === 0) { //then this should be a sub-header type of record
								if(i > 0) { //proceed to check previous item, as long as we're safely past the major header item (which would have been the first zero-indexed iteration)
									var obj_listItem_prev = objArr_data[i-1]; //get this iteration's message data in an easy-to-use place
									var int_sortOrder_dimA_prev = parseInt(parsePositionValueForDimension(obj_listItem_prev.position, 1), 10);
									var int_sortOrder_dimB_prev = parseInt(parsePositionValueForDimension(obj_listItem_prev.position, 2), 10);
									if(int_sortOrder_dimA_prev > 0 && int_sortOrder_dimB_prev === 0) { //if previous was a subheader, then that suheader is empty and we need to show a no-msgs item before adding this subheader
										FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): No msg-items existed in the previous subsection, displaying 'no messages' there.", true);
										obj_listItem_prev.color = str_color; //so we can pass along the subheader's color to the messagecell generator to use to populate the list-item's background-color
										objNode_listItem = generateListItem_noMessagesCell(obj_listItem_prev);
										objNodeRef_theList.appendChild(objNode_listItem);
										ret++;
									}
								}
								FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Personal-library record is a sub-section header record.", true);
								objNode_listItem = generateListItem_subHeader(obj_listItem); //get a list-item node generated for the sub-section header
								str_color = obj_listItem.color; //set aside this subheader's color (may or may not be defined, but that's ok) for any subsequent iterations' regular msgs to inherit
							}
							else if(int_sortOrder_dimA > 0 && int_sortOrder_dimB > 0) { //then this should be a regular old message type of record
								FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Personal-library record is a sub-section's message record.", true);
								obj_listItem.color = str_color; //so we can pass along the subheader's color to the messagecell generator to use to populate the list-item's background-color
								objNode_listItem = generateListItem_messageCell(obj_listItem); //get a list-item node generated for the message
							}
							else if(int_sortOrder_dimA === 0 && int_sortOrder_dimB > 0) { //then this should be the very first message record added to the section (no subheader exists)
								FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Personal-library record is an orphaned message record (no subheader exists).", true);
								//obj_listItem.color = str_color; //so we can pass along the subheader's color to the messagecell generator to use to populate the list-item's background-color
								objNode_listItem = generateListItem_messageCell(obj_listItem); //get a list-item node generated for the message
							}
							else if(int_sortOrder_dimA === 0 && int_sortOrder_dimB === 0) { //then this could be a relic from early development (try to generate anyway, so append won't fail)
								FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Personal-library record has strange position value (both dimensions are 0). This could be an early-development artifact? Generating messagecell.", true);
								objNode_listItem = generateListItem_messageCell(obj_listItem); //get a list-item node generated for the message
							}
							else { //unexpected! (try to generate a list item with whatever may be available anyway, so the append operation below won't outright fail)
								FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Personal-library record contains unexpected position value, generating messagecell.", true);
								objNode_listItem = generateListItem_messageCell(obj_listItem); //get a list-item node generated for the message
							}
							break; //break out of switch (not loop)
						case window.FAVS_SORTED_FLAG:
						case window.FAVS_UNSORTED_FLAG:
						default:
							FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Item is a type that doesn't use sub-section capability.", true);
							FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Requesting LI node for msg-item "+i+"...", true);
							objNode_listItem = generateListItem_messageCell(obj_listItem); //get a list-item node generated for the message
							break; //break out of switch (not loop)
					}//end switch
					objNodeRef_theList.appendChild(objNode_listItem); //add that node to the list
					ret++; //increment the return value (so whoever calls this method can get a count of how many items were populated in the list node)
				}
			}
			else { //else there were no data/msg-items in the data-source...
				FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): No msg-items exist in the data source, displaying 'no messages'.", true);
				objNode_listItem = generateListItem_noMessagesCell(); //generate a 'no messages' cell/item
				objNodeRef_theList.appendChild(objNode_listItem); //add it to the list
			}
			//finish and return...
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Completed. Returning number of list-items added ("+ret+").", true);
			return ret;
		}
		catch(err) {
			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": populateListNode(): Caught error ("+err.message+"). No list-items added.", true);
			return ret;
		}
	}//end function populateListNode()

	function padLeadingZeros(intValueToPad, intMaxTotalDigits) { //prepend a numerical digit with leading zeros (up to, but not more than, the maximum number specified)
		var s = intValueToPad + "";
		while(s.length < intMaxTotalDigits) {
			s = "0" + s;
		}
		return s;
	}//end function padLeadingZeros()
	
	function getNumberOfSubsectionHeaders() { //look through the list and return the number of subsection-headers found
		var ret = 0;
		var objNodeRef_theList = document.getElementById(cfg.str_sectionDomID); //get a reference to the list, itself
 		var arr_listItemNodes = objNodeRef_theList.childNodes; //get a node-list (array of nodes) of ALL LI nodes in the list (including title items, etc.)
 		for(var i=0; i<arr_listItemNodes.length; i++) {
 			if(arr_listItemNodes[i].getAttribute("class").indexOf("subsectionheader") > -1) {
 				ret++;
 			}
 		}//end for
		return ret;
	}//end function getNumberOfSubsectionHeaders()

	// PUBLIC PROPERTIES...
 	this.bool_isInstanceInitialized = false; //initialize flag to publicly indicate whether a particular instance is initialized
 	this.bool_isRendered = false; //initialize flag to publicly indicate whether the list is rendered in the DOM
 	this.bool_isVisible = false; //initialize flag to publicly indicate whether the list is visible (visibility-style)
	this.cfg = cfg; //publicly expose the provided config object, which was private until now 	(do we really need to?)

	// PUBLIC METHODS...
	this.generateListItem_noMessagesCell = generateListItem_noMessagesCell; //publicly expose the routine to generate a no-messages item
  	//define how to show/make-visible the section on-screen... (returns the style's value if no errors / returns false if error)
  	this.makeListSectionVisible = function() {
  		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionVisible(): Starting...", true);
  		var ret = false;
 		function doStuffToSupportBetaPrototype() { //temporarily add support for various original beta/prototype stuff...
 			FavScreen.set("attrIsCurrentlyVisible_sorted", true);
 			//call updateMessagecells()?
 		}
 		try {
 			var objNodeRef_sectionContainer = document.getElementById(cfg.str_containerNodeID);
 			objNodeRef_sectionContainer.style.visibility = "visible"; //initial render may have been initially set to hidden, so ensure it's now visible
 			ret = objNodeRef_sectionContainer.style.visibility;
 			if(ret === "visible") {
 				this.bool_isVisible = true;
 				doStuffToSupportBetaPrototype();
 			}
 			else {
 				this.bool_isVisible = false;
 			}
 			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionVisible(): Set bool_isVisible to "+this.bool_isVisible+".", true);
 			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionVisible(): Completed. Returning '"+ret+"'.", true);
 		}
 		catch(err) {
 			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionVisible(): Caught error ("+err.message+"). Returning "+this.bool_isVisible+".", true);
 		}
 		return ret;
  	};

  	//define how to hide/make-invisible the section on-screen... (returns the style's value if no errors / returns false if error)
  	this.makeListSectionHidden = function() {
  		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionHidden(): Starting...", true);
  		var ret = false;
 		try {
 			var objNodeRef_sectionContainer = document.getElementById(cfg.str_containerNodeID);
 			objNodeRef_sectionContainer.style.visibility = "hidden"; //ensure it's now hidden
 			ret = objNodeRef_sectionContainer.style.visibility;
 			if(ret === "hidden") {
 				this.bool_isVisible = false;
 			}
 			else {
 				this.bool_isVisible = true;
 			}
 			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionHidden(): Set bool_isVisible to "+this.bool_isVisible+".", true);
 			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionHidden(): Completed. Returning '"+ret+"'.", true);
 		}
 		catch(err) {
 			FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": makeListSectionHidden(): Caught error ("+err.message+"). Returning "+this.bool_isVisible+".", true);
 		}
 		return ret;
  	};

 	//define how to actually render the section on-screen... (note: this will be the whole shebang) (note: this is destructive to any existing contents of the section)
 	this.renderListInItsSection = function() {
 		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": renderListInItsSection(): Starting...", true);
 		function doStuffToSupportBetaPrototype(t) { //temporarily add support for various original beta/prototype stuff...
 			try {
				//FavScreen.set("attrNumSortedFavsDisplaying", t.numOfItemsPopulated);
				window.updateMessagecells(); //is this needed???
				t.attachActionListenersToMessageCells();
 			}
 			catch(err) {
 				FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": renderListInItsSection(): doStuffToSupportBetaPrototype(): Caught error ("+err.message+").", true);
 			}
 		}//end function doStuffToSupportBetaPrototype()
 		try {
 			var objNodeRef_sectionContainer = document.getElementById(cfg.str_containerNodeID);
 				objNodeRef_sectionContainer.style.backgroundColor = cfg.str_baseColor;
 			var objNode_completedSection = generateListNode();
 			for(var i=0; i<objNodeRef_sectionContainer.childNodes.length; i++) { //remove any potentially-existing children, first
 				FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": renderListInItsSection(): Removing an existing child (#"+objNodeRef_sectionContainer.childNodes[i].id+") found in the container, before appending new list.", true);
 				objNodeRef_sectionContainer.removeChild(objNodeRef_sectionContainer.childNodes[i]);
 			}
 			objNodeRef_sectionContainer.appendChild(objNode_completedSection);
 			this.bool_isRendered = true; //set the public flag
 			this.makeListSectionVisible(); //make sure it's styled as visible
 			this.numOfItemsPopulated = populateListNode(); //run the routine to actually populate the list node with data (note: doing here, so user can watch items incrementally load, if necessary - e.g. slow network)

 			doStuffToSupportBetaPrototype(this);

 			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": renderListInItsSection(): Completed. Returning entire major-section node.", true);
 			return objNodeRef_sectionContainer;
 		}
 		catch(err) {
 			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": renderListInItsSection(): Caught error ("+err.message+").", true);
 		}
 	};

 	//define a method to generate and return a YUI-Recordset, based on the contents of the list (basically an an export of the list into a YUI-Recordset format)
 	//note: the bool_extractAllFields defaults to false... set to true to extract all available fields for each item
 	//note: sure, you might be able to just use the cfg-object's YUI data, directly; but it might not reflect what's actually visible on-screen (e.g. after a drag & drop)
 	//NOTE! For now, this only supports exporting personal libraries section!!! (positionTypeFlag is hard coded)
 	this.exportListAsYuiRecordset = function(bool_extractAllFields) {
 		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): Starting...", true);
 		var ret = {}; //initialize a default return value

 		function initializeBlankRecordItem(bool_useAllFields) {
 			var blankRecord = {}; //initialize a temporary data object
 			//first, extract minimal field data, at least...
 			blankRecord.recno_fav = "0";
 			blankRecord.position = "";
 			//then, if directed to, try to extract additional data...
 			if(Boolean(bool_extractAllFields)) {
 				blankRecord.active_copies = "";
 				blankRecord.color = "";
 				blankRecord.confirmSend = 0;
 				blankRecord.dtsec = "";
 				blankRecord.icon = "";
 				blankRecord.icon2 = "";
 				blankRecord.label1 = "";
 				blankRecord.label2 = "";
 				blankRecord.msgdesc = "";
 				blankRecord.msgdir = "";
 				blankRecord.msgdir_recno = "";
 				blankRecord.msgname = "";
 				blankRecord.recno_msgtemplate = "";
 				blankRecord.toggle_duration = "";
 				blankRecord.toggle_end_dtsec = "";
			}//end extract all fields
			//handle any specific final items...
			//if(getNumberOfSubsectionHeaders() < 1) { //if this is the first/only subheader, make it some specific default text
 			//	if(this.cfg.str_sectionDomID.indexOf("messagelist-personallibraries") > -1) { //if we're exporting for personal-libs major section
 			//		blankRecord.label1 = window.FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_FIRST;
 			//	}
 			//	//FUTURE: add any other else-if for other major sections here
 			//	else {
 			//		blankRecord.label1 = window.FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_BLANKNEW
 			//	}
 			//}
 			//else { //else, just use the generic "tap to rename" kind of stuff
 			//	blankRecord.label1 = window.FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_BLANKNEW
 			//}
			return blankRecord;
 		}//end function initializeRecordItem()

 		function recordsetIsInvalid(obj_yuiRS) { //validate the data-integrity of a completed recordset (make sure no identical position values, etc.)... returns boolean result
 			if(typeof obj_yuiRS !== "object") {
 				FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): recordsetIsInvalid(): Argument is not an object, let alone a recordset!", true);
 				return true;
 			}
 			if(obj_yuiRS.name != "recordset") {
 				FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): recordsetIsInvalid(): Argument is not a YUI-Recordset.", true);
 				return true;
 			}
 			var ret = false; //initialize default return value
 			var rsSize, prevRecord, currRecord;
 			try {
 				rsSize = obj_yuiRS.size();
 			}
 			catch(err) {
 				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): recordsetIsInvalid(): Recordset object had problem with size() method ("+err.message+").", true);
 				rsSize = 0; //will force an avoidance of the loop below, and then result in the default return value being returned
 			}
 			for(var i=0; i<rsSize; i++) { //looping through each record in the recordset... (size method results in 1-based value)
 				currRecord = obj_yuiRS.item(i).get('data');
 				if(i === 0) { //if we're at the first record, initialize a blank record for the prev-record item, so we don't pull an array-out-of-bounds
 					prevRecord = initializeBlankRecordItem();
 				} else {
 					prevRecord = obj_yuiRS.item(i-1).get('data');
 				}
 				if(currRecord.position == prevRecord.position) { //should never happen, so return false
 					FavScreen.log("info", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): recordsetIsInvalid(): Current record's ("+i+") position ("+currRecord.position+") matches previous record's position ("+prevRecord.position+").", true);
 					ret = true;
 				}
 			}
 			return ret;
 		}//end function recordsetIsInvalid()

 		try {
 			if(this.cfg.str_sectionDomID != "messagelist-personallibraries") { //for now, just supporting my-libs section... later, remove this and make it work for any (below logic may need modifying, if you do)
 				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): This version only supports exporting the personal-libraries section.", true);
 				return ret;
 			}
 			bool_extractAllFields = Boolean(bool_extractAllFields); //normalize argument (defaults to false, this way)
 			FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): Extract all fields = "+bool_extractAllFields+".", true);
 			var objNodeRef_theList = document.getElementById(this.cfg.str_sectionDomID); //get a reference to the list, itself
 			var arr_listItemNodes = objNodeRef_theList.childNodes; //get a node-list (array of nodes) of ALL LI nodes in the list (including title items, etc.)
 			//create a new YUI Recordset object...
 			YUI().use("recordset-base", function(Y) {
 				ret = new Y.Recordset();
 				ret.after("init", function() {
 					FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): YUI-Recordset initialized.", true);
 					ret.after("add", function() {
 						FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): YUI-Recordset added a new record, size is now "+this.size()+".", true);
 					});//end after-add handler
 				});//end after-init handler
 			});//end YUI().use
 			//check whether list is ready to export... (abort/return if not)
 			if(this.bool_isRendered !== true) { //check whether list is actually rendered, first (can't export a recordset from no data)
 				FavScreen.log("warn", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): No list is rendered, returning empty recordset.", true);
 				return ret;
 			}//end if
 			var i_subsection = 0; //initialize subsection counter
			var i_message = 0; //initialize message counter
			var currItem, currItemID, currItemClass, currItemPosA, currItemPosB, currItemPosC, currItemPos, currItemDataObject; //declare vars to be used in iterations below
			var prevItem, prevItemID, prevItemClass, prevItemPosA, prevItemPosB, prevItemPosC, prevItemPos, prevItemDataObject; //declare vars to be used in iterations below
			var nextItem, nextItemID, nextItemClass, nextItemPosA, nextItemPosB, nextItemPosC, nextItemPos, nextItemDataObject; //declare vars to be used in iterations below
			var autoItemDataObject; //declare vars to be used in iterations below
			var positionTypeFlag = window.FAVS_LIBRARY_PERSONAL_FLAG;
			var posDelinType = window.FAVS_POSITION_DELINEATE_TYPE;
			var posDelinDim = window.FAVS_POSITION_DELINEATE_COORD;
			currItemPosA = currItemPosB = currItemPosC = 0; //initialize values
			prevItemPosA = prevItemPosB = prevItemPosC = 0; //initialize values
			nextItemPosA = nextItemPosB = nextItemPosC = 0; //initialize values
			for(var i = 0; i < arr_listItemNodes.length; i++) {
				currItem = arr_listItemNodes[i]; //get current list-item node
				currItemID = currItem.getAttribute("id"); //get current node's id attribute value (NOTE: if it's a valid record, it should be equivalent to the recno)
				currItemClass = currItem.getAttribute("class"); //get current node's class attribute value

				if( currItemClass.indexOf("subsectionheader") < 0
				 && currItemClass.indexOf("messagecell") < 0 ){ //if current item is not subheader or message, it doesn't belong in recordset
					FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): Iteration #"+i+" is not a list-item that should be exported, skipping.", true);
					continue; //skip this one, since it's not valid for belonging in the recordset
				}//end skip whatever we don't explicitly want

				//Note: If we got here, then the current item must be one that we actually want to be in the exported recordset (since any others would have skipped to the next iteration, above)
				FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): Iteration #"+i+" list-item will now be processed for export...", true);

				// Initialize data-object for current item (note: there won't be any recordset data for certain types of items e.g. headers, etc.)...
				try {
					currItemDataObject = rs_getRawDataObjectFor_favRecno(FavScreen.rsOrig, currItemID); //get a data object-literal for the current item, from the specified recordset
					if(typeof currItemDataObject !== "object") {
						currItemDataObject = initializeBlankRecordItem();
					}
				}
				catch(err) {
					currItemDataObject = initializeBlankRecordItem();
				}

				// Initialize data about any potential previous item...
				if(i === 0) { //if current index indicates that a previous index would result in array out of bounds, initialize prev-data with static data to prevent errors
					prevItem = null;
					prevItemID = "";
					prevItemClass = "";
					prevItemDataObject = initializeBlankRecordItem();
					prevItemDataObject.position = String(positionTypeFlag + posDelinType + padLeadingZeros(prevItemPosA,5) + posDelinDim + padLeadingZeros(prevItemPosB,5) + posDelinDim + padLeadingZeros(prevItemPosC,5));
				}
				else { //else previous index would be valid, so use it to get previous item's data
					prevItem = arr_listItemNodes[i-1]; //get previous list-item node
					prevItemID = prevItem.getAttribute("id"); //get previous node's id attribute value
					prevItemClass = prevItem.getAttribute("class"); //get previous node's class attribute value
					try {
						prevItemDataObject = rs_getRawDataObjectFor_favRecno(FavScreen.rsOrig, prevItemID); //get a data object-literal for the previous item, from the specified recordset
						if(typeof currItemDataObject !== "object") {
							currItemDataObject = initializeBlankRecordItem();
						}
					}
					catch(err) {
						prevItemDataObject = initializeBlankRecordItem();
					}
				}

				// Initialize data about any potential next item...
				if(i === arr_listItemNodes.length - 1) { //if current index indicates that a next index would result in array out of bounds, initialize next-data with static data to prevent errors
					nextItem = null;
					nextItemID = "";
					nextItemClass = "";
					nextItemDataObject = initializeBlankRecordItem();
					nextItemDataObject.position = String(positionTypeFlag + posDelinType + padLeadingZeros(nextItemPosA,5) + posDelinDim + padLeadingZeros(nextItemPosB,5) + posDelinDim + padLeadingZeros(nextItemPosC,5));
				}
				else { //else next index would be valid, so use it to get next item's data
					nextItem = arr_listItemNodes[i+1]; //get next list-item node
					nextItemID = nextItem.getAttribute("id"); //get next node's id attribute value
					nextItemClass = nextItem.getAttribute("class"); //get next node's class attribute value
					try {
						nextItemDataObject = rs_getRawDataObjectFor_favRecno(FavScreen.rsOrig, nextItemID); //get a data object-literal for the next item, from the specified recordset
						if(typeof currItemDataObject !== "object") {
							currItemDataObject = initializeBlankRecordItem();
						}
					}
					catch(err) {
						nextItemDataObject = initializeBlankRecordItem();
					}
				}

				//Note: If we got here, then we should now have populated data-objects for current and previous records
				FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  i#"+i+" prev is '"+typeof prevItemDataObject+"' | curr is '"+typeof currItemDataObject+"' | next is '"+typeof currItemDataObject+"'.", true);

				// Proceed to test and perhaps add the current item to the recordset...
				if(currItemClass.indexOf("subsectionheader") > -1) { //if current item is a subsection header (then we should add it, as long as no unexpected errors)
					if( prevItemClass.indexOf("subsectionheader") > -1 //if previous item is any of these types (then we should add the current subsection in any case)
					 || prevItemClass.indexOf("messagecell") > -1
					 || prevItemClass.indexOf("sectionheader") > -1
					 || prevItemClass.indexOf("nomessages") > -1 ){ 
						i_subsection++; //increment subsection counter (in preparation for adding current iteration's subheader - this works even if its the first one, since it's zero-based)
						i_message = 0; //reinitialize message counter to 0 (since we're definitely starting a new subsection, and subsections' 2nd dimension should be zero)
						currItemPosA = i_subsection; //use the above-incremented value
						currItemPosB = i_message; //use the above-reinitialized value
						currItemPosC = 0; //currently unused
						currItemPos = String(positionTypeFlag + posDelinType + padLeadingZeros(currItemPosA,5) + posDelinDim + padLeadingZeros(currItemPosB,5) + posDelinDim + padLeadingZeros(currItemPosC,5));
						currItemDataObject.position = currItemPos;
						FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Adding existing subsection-header to export ("+currItemPos+")...", true);
						if(currItemID === null) {
							FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Existing subsection-header has no recno, will flag server to add a new record for this...", true);
							currItemDataObject.recno_fav = String(window.FAVS_RECNO_FLAG_CREATE_SUBHEADER_BLANKNEW); //set the flag for SMCGI to add a new record when we ultimately (assumingly) send this completed dataset to it via reorderSortedFavs command
						}
						ret.add(currItemDataObject);
					}
					else { //unexpected error
						//previous item type is unknown
						FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Unexpected error, unknown list-item class/type for previous iteration.", true);
						//DEV-NOTE: possibly use subsection-increment of previous, and reinitialized message-count? ~ or don't do anything?
					}
				}
				else if(currItemClass.indexOf("messagecell") > -1) { //else-if current item is a message (then we should add it as long as no unexpected errors)
					// Generate automatic subheader, if necessary...
					if(getNumberOfSubsectionHeaders() === 0) {
					//if(((prevItemClass.indexOf("sectionheader") > -1) && (prevItemClass.indexOf("subsectionheader") === -1))
					// || prevItemClass.indexOf("nomessages") > -1 ){ //if previous item is the major header (then we'll need to also auto-generate a subheader before the current message item)
						i_subsection = 1; //reinitialize subsection counter (in preparation for adding auto subsection before adding the message next)
						i_message = 0; //reinitialize message counter to 0 (since we're definitely starting a new subsection, and subsections' 2nd dimension should be zero)
						currItemPosA = i_subsection; //use the above-reinitialized value
						currItemPosB = i_message; //use the above-reinitialized value
						currItemPosC = 0; //currently unused
						currItemPos = String(positionTypeFlag + posDelinType + padLeadingZeros(currItemPosA,5) + posDelinDim + padLeadingZeros(currItemPosB,5) + posDelinDim + padLeadingZeros(currItemPosC,5));
						autoItemDataObject = initializeBlankRecordItem(true);
						autoItemDataObject.recno_fav = String(window.FAVS_RECNO_FLAG_CREATE_SUBHEADER_PERSONALMSGS); //set the flag for SMCGI to add a new record when we ultimately (assumingly) send this completed dataset to it via reorderSortedFavs command
						autoItemDataObject.position = currItemPos;
						FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Adding new/auto-generated subsection-header to export ("+currItemPos+")...", true);
						ret.add(autoItemDataObject);
					}
					// Add record for this message...
					i_message++; //increment message counter (in preparation for adding current iteration's message - this works even if its the first one, since it's zero-based)
					currItemPosA = i_subsection; //this should still be in context of our current subsection (even if it was auto-generated above)
					currItemPosB = i_message; //use the above-incremented value
					currItemPosC = 0; //currently unused
					currItemPos = String(positionTypeFlag + posDelinType + padLeadingZeros(currItemPosA,5) + posDelinDim + padLeadingZeros(currItemPosB,5) + posDelinDim + padLeadingZeros(currItemPosC,5));
					currItemDataObject.position = currItemPos;
					FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Adding existing message to export ("+currItemPos+")...", true);
					ret.add(currItemDataObject);
				}
				else { //unexpected error
					//current item does not have an understood class attribute value
					FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset():  Unexpected error, unknown list-item class/type for current iteration.", true);
				}
			}//end for
 		}//end try
 		catch(err) {
 			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": exportListAsYuiRecordset(): Caught error ("+err.message+").", true);
 		}//end catch
 		if(recordsetIsInvalid(ret)) {
 			return {};
 			//DEV-NOTE: in the future, you may want to add correction routines here?
 		}
 		return ret;
 	};//end exportListAsYuiRecordset()

/*
 	//define how to refresh the list from data in the present recordset...
	//this.refreshList_fromRecordset = function() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": refreshList_fromRecordset(): Starting...", true);
		return;
	//};//end method refreshList_fromRecordset

	//define how to refresh the list from data presently on the server...
	//this.refreshList_fromServer = function() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": refreshList_fromServer(): Starting...", true);
		return;
	//};//end method refreshList_fromServer
*/
	//define how to attach event listeners...
	this.attachActionListenersToMessageCells = function() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": attachActionListenersToMessageCells(): Starting...", true);
		//DEV-NOTE: for now, just calling existing routine...
		var str_listNodeID_yuiIzed = "ul#" + cfg.str_sectionDomID;
		window.attachActionListenersToMessageCells(str_listNodeID_yuiIzed);
	};//end method attachActionListenersToMessageCells

	//define what to do in order to initialize an instance 
	this.initialize = function() {
		FavScreen.log("verbose", "ClassMajorSection #"+cfg.str_sectionDomID+": initialize(): Starting...", true);
		if(this.bool_isConstructorLoaded) {
			this.bool_isInstanceInitialized = true; //explicitly set a public flag for this
			FavScreen.log("log", "ClassMajorSection #"+cfg.str_sectionDomID+": initialize(): Completed. Section contained in '"+cfg.str_containerNodeID+"', is ready to be rendered (call renderListInItsSection).", true);
			return this.bool_isInstanceInitialized;
		}
		else {
			return FavScreen.log("error", "ClassMajorSection #"+cfg.str_sectionDomID+": initialize(): Class prototype not yet loaded (bool_isLoaded = "+this.bool_isLoaded+").", true);
		}
	};

 	// FINALIZATIONS...
 	this.bool_isConstructorLoaded = true; //flag that this class-constructor is now loaded and ready to instantiate (since this line is at the very end)
}//end ClassMajorSection