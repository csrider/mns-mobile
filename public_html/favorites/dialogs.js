/*******************************************************************************************
 * dialogs.js
 *
 *	Provides various dialog windows and their supporting logic.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework (for YUI Panel capabilities, among others).
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created January 2015 by Chris Rider (chris.rider81@gmail.com).
 *	
 *	Notable Updates:
 *		2015.03.09	v1.2 	Implemented version info (starting with 1.2 since I know of at least that many updates to this file, from my memory)
 *******************************************************************************************/
var versionInfoForJavascriptFile_dialogs = {
	version : "1.12",
	build : "2015.05.07"
	};


function ClassMessageReplyDialog(instanceName) {
	//public class resources...
	this.initialized = false;
	this.isVisible = false;
	this.yuiPanel;
	
	//private class resources...
	var _yuiPanel;
	var _log = function(logLevel, strMsg, doConsole) {
		if((typeof window.FavScreen === "object") && (typeof window.FavScreen.log === "function")) {
			return window.FavScreen.log(logLevel, strMsg, doConsole);
		}
		else {
			if(logLevel == "log") {
				return console.log(strMsg);
			}
			else if(logLevel == "info") {
				return console.info(strMsg);
			}
			else if(logLevel == "warn") {
				return console.warn(strMsg);
			}
			else if(logLevel == "error") {
				return console.error(strMsg);
			}
			else {
				return false;
			}
		}
		};//end function _log()
/*
	var _sendToServer = function() {
		YUI().use("io", "io-base", function(Y) {
			var cfg = {
				method:"POST",								     //method will default to GET unless we specify POST here
				data:{									       //whatever fields/data that CGI gets to parse...
				    'COMMAND':'true',						    //smcgi command flag
					'':'',
					'disableCheckForIP_favorites':window.determineShouldIgnoreChangeInIP()
					},
				headers:{
					'Content-Type':'application/x-www-form-urlencoded'
					},
				sync:false,									  //define whether the transaction will be processed synchronously (which would halt all code execution until the transaction is complete
				timeout:20000
				};
			var sUrl = window.CGI_SERVER;
			objResponse = Y.io(sUrl, cfg);
		});//end YUI.use
		};
*/
	//setup the YUI-Panel...
	YUI().use("panel", function(Y) {
		_yuiPanel = new Y.Panel({
			headerContent	: null,
			bodyContent		: null,
			footerContent	: null,
			buttons			: null,
			zIndex			: 999,
			width			: "90%",
			centered		: true,
			modal			: true,
			visible 		: false,
			render			: true
			});//end new Panel
		});//end YUI-Panel setup

	//Define what should happen after the YUI-Panel is initialized...
	_yuiPanel.after('init', function(e) {
		//note: 'this' here references the yuiPanel object
		this.get('boundingBox')._node.style.outline = "none";							//set DOM style property for the Panel's main container (this is heavy on YUI overhead)
		this.get('contentBox')._node.className = "MessageReplyDialog roundedcorners";	//set DOM class property for the Panel's contents wrapper, so the stylesheet can work its magic
		FastClick.attach(document.getElementById('panelconfirmclosemsg'));					//attach the fastclick override to this panel and any of its children (like buttons)
		});//end after-init

	//Define what should happen after the YUI-Panel's visibility changes...
	_yuiPanel.after('visibleChange', function(e) {
		//note: 'this' here references the yuiPanel object
		var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];
		var headerwrapperHeight = document.getElementById("headerwrapper").offsetHeight;
		if(this.get('visible')) {
			_log("log", "ClassMessageReplyDialog: Now visible.", true);
			node_modalMask.style.display = "block";
			node_modalMask.style.top = headerwrapperHeight + "px";						//shift the modal mask down a bit, so the header (and its "done" button) is accessible
		}
		else {
			_log("log", "ClassMessageReplyDialog: Now hidden.", true);
			node_modalMask.style.display = "none";
			node_modalMask.style.top = "0px";											//restore the default modal mask
		}
		});//end after-visible-change

	//Expose the YUI Panel to this class' public space
	this.yuiPanel = _yuiPanel;

	//this.hide = function() {
	var _hide = function() {
		_log("log", "ClassMessageReplyDialog: Hide method invoked...", true);
		window.safeToHideModalMask = true;
		this.yuiPanel.hide();
		this.isVisible = false;
		};//end method
	this.hide = _hide;

	//this.show = function(o) {
	var _show = function(o) {
		_log("log", "ClassMessageReplyDialog: Show method invoked...", true);
		window.safeToHideModalMask = false;
		var node_bodyContents = generateContentForShowing(o);
		this.yuiPanel.set("bodyContent", node_bodyContents);
		this.yuiPanel.show();
		this.isVisible = true;
		};
	this.show = _show;

	var generateContentForShowing = function() {
		// Note: the FavScreen.objMsgData contains data about the message they're using to reply with (not what they're replying to)
		// Row 1...
		var node_img_close = document.createElement("img");
			node_img_close.src = window.FAVS_ICON_CLOSE_X;
		var node_btn_close = document.createElement("button");
			node_btn_close.id = "btnClose";
			node_btn_close.addEventListener('click', function(){
				window.FavScreen.MessageReplyDialog.hide();				//DEV-NOTE: just hard-coded this instance name to appease deadlines... really need to figure out why .hide can't be accessed here
				});
			node_btn_close.appendChild(node_img_close);
		//var node_div_replyToMsg_fromWrapper = document.createElement("div");
		//	node_div_replyToMsg_fromWrapper.className = "fromwrapper";
		//	node_div_replyToMsg_fromWrapper.innerHTML = window.FavScreen.objMsgData_replyTo.replyToFromText;
		var node_div_replyToMsg_msgWrapper = document.createElement("div");
			node_div_replyToMsg_msgWrapper.className = "msgwrapper";
			node_div_replyToMsg_msgWrapper.innerHTML = window.FavScreen.objMsgData_replyTo.replyToMsgText.substr(0,30);
		var node_div_replyToMsg_textWrapper = document.createElement("div");
		//	node_div_replyToMsg_textWrapper.appendChild(node_div_replyToMsg_fromWrapper);
			node_div_replyToMsg_textWrapper.appendChild(node_div_replyToMsg_msgWrapper);
		var node_div_row1 = document.createElement("div");		//row containing the replying-to msg info
			node_div_row1.appendChild(node_btn_close);
			node_div_row1.appendChild(node_div_replyToMsg_textWrapper);
		// Row 2...
		var node_img_icon = document.createElement("img");		//img node for displaying the fav-icon associated with this reply message
			node_img_icon.className = "favIcon";
		var node_span_reply = document.createElement("span");	//the name of the reply next to the icon
		if(typeof window.FavScreen.objMsgData_replyWith === "object") {	//objMsgData members: objMsgDataReplyTo, replyWithFavRecno, replyWithFavIcon, replyWithFavName
			if(typeof window.FavScreen.objMsgData_replyWith.replyWithFavIcon === "string") {
				node_img_icon.src = window.FavScreen.objMsgData_replyWith.replyWithFavIcon;
			}
			else {
				node_img_icon.src = "";
			}
			node_span_reply.innerHTML = window.FavScreen.objMsgData_replyWith.replyWithFavName;
		}
		else {
			_log("error", "ClassMessageReplyDialog: Missing global data object (window.FavScreen.objMsgData_replyWith) for reply-with message.", true);
			node_span_reply.innerHTML = "<div>Error: Missing data for reply-with message.<div>";
		}
		var node_btn_reply = document.createElement("button");	//big button meant to mimic a messagecell, that they actually click/tap to send off the reply
			node_btn_reply.id = "btnReply";
			node_btn_reply.className = "bigiosstyle";
			node_btn_reply.type = "button";						//this seems to be what provides the "button" look (big rounded ends) on iOS devices
			node_btn_reply.addEventListener('click', function() {
				Spinner.show();
				setTimeout(function(){	//just provide enough time to allow the device's CPU to actually show the spinner, before continuing the heavy work of sending a reply
					var response = window.sendReplyToMsg();
					if(response) {
						_log("log", "ClassMessageReplyDialog: Success reported in response from sendReplyToMsg().", true);
						Spinner.show();
						setTimeout(function(){window.refreshRecordset_inboxMsgs(CURRENT_USER_PIN, true, true);},1000);	//show spinner, too (true)
						window.FavScreen.MessageReplyDialog.hide();
						window.FavScreen.set('attrInteractionMode', window.MODE_LAUNCHABLE);
						window.scrollTo_animated(document.body, FavScreen.get('attrPreviousScrollPositionPixelY'), 150);
						window.ModalNotification_OK.showFor(2000);
					}
					else {
						_log("warn", "ClassMessageReplyDialog: Failure reported in response from sendReplyToMsg().", true);
					}
					}, 200);
				});//end add click listener
			node_btn_reply.appendChild(node_img_icon);
			node_btn_reply.appendChild(node_span_reply);
		var node_div_row2 = document.createElement("div");		//row containing icon and action item(s)
			node_div_row2.style.clear = "right";				//clear the close-button's right float, so this div will be on the next line
			node_div_row2.appendChild(node_btn_reply);

		// Row 3...
		var node_ta_reply = document.createElement("textarea");	//the node the user can input a custom reply to append to the reply
			node_ta_reply.placeholder = "Your note";
			node_ta_reply.rows = "8";
			node_ta_reply.name = "yournote";
			node_ta_reply.maxLength = "280";
		var node_div_row3 = document.createElement("div");		//row containing custom textarea/reply field
			node_div_row3.appendChild(node_ta_reply);

		var node_div_main = document.createElement("div");		//main node to return
		node_div_main.appendChild(node_div_row1);
		node_div_main.appendChild(node_div_row2);
		node_div_main.appendChild(node_div_row3);
		return node_div_main;
		};//end method for generating panel contents

	this.initialized = true;
}//end function ClassMessageReplyDialog

function assembleDataObjectForFavRecno(favRecno) {
	var ret = {};		//initialize an object to return
	try {
		/*
		if(rsRec_getFavPosition(FavScreen.rsOrig, favRecno) == 0) {		//if there isn't a matching record in the rsOrig recordset, check others...
			if(FavScreen.rsInbox.getValuesByKey('recno_inbox').indexOf(favRecno) > -1) {	//if a matching record exists in the inbox recordset
				var rsIndex = FavScreen.rsInbox.getValuesByKey('recno_inbox').indexOf(favRecno);
				ret.favRecno = favRecno;
				ret.favName = "";
				ret.favFromName = objRS.item(rsIndex).getValue('from_fullname');
				ret.favFromPin = objRS.item(rsIndex).getValue('from_pin');
				ret.favMessage = objRS.item(rsIndex).getValue('message');
				ret.favIcon = ;
				ret.favIconSrc = FAVS_ICON_PATH+"/"+rsRec_getFavIcon(FavScreen.rsOrig, favRecno);
			}
		}
		else {															//else rsOrig should be fine, so use it...
		*/
			ret.favRecno = favRecno;
			ret.favName = rsRec_getFavName(FavScreen.rsOrig, favRecno);
			ret.favIcon = rsRec_getFavIcon(FavScreen.rsOrig, favRecno);
			ret.favIconSrc = FAVS_ICON_PATH+"/"+rsRec_getFavIcon(FavScreen.rsOrig, favRecno);
			if(ret.favName.length == 0) {
				ret.favName = rsRec_getMsgTemplateName(FavScreen.rsOrig, favRecno);
			}
		//}
	}
	catch(err) {
		_log("error","assembleDataObjectForFavRecno(): Some problem getting data from recordset ("+err+"), returning incomplete data-object.",true);
	}
	this.objMsgData = ret;
	return ret;
}

function ClassPromptConfirmSend(instanceName){
	//public class resources...
	this.initialized = false;
	this.favRecno = undefined;
	this.objMsgData = undefined;
	this.yuiPanel;
	
	//private class resources...
	var yuiPanel;
	var handle_setTimeout = undefined;								   //initialize a private handle for the setTimeout timer, so it can be cleared when they manually hide the panel
	var _log = function(logLevel, strMsg, doConsole) {
		if((typeof window.FavScreen === "object") && (typeof window.FavScreen.log === "function")) {
			return window.FavScreen.log(logLevel, strMsg, doConsole);
		}
		else {
			if(logLevel == "log") {
				return console.log(strMsg);
			}
			else if(logLevel == "info") {
				return console.info(strMsg);
			}
			else if(logLevel == "warn") {
				return console.warn(strMsg);
			}
			else if(logLevel == "error") {
				return console.error(strMsg);
			}
			else {
				return false;
			}
		}
		};//end function _log()

	var generateContentForShowing = function(objMsgData) {
		// Row 1...
		var node_img_close = document.createElement("img");
			node_img_close.src = window.FAVS_ICON_CLOSE_X;
		var node_btn_close = document.createElement("button");
			node_btn_close.id = "btnClose";
			node_btn_close.addEventListener('click', function(){
				window.ConfirmLaunch.hide();				//DEV-NOTE: just hard-coded this instance name to appease deadlines... really need to figure out why .hide can't be accessed here
				});
			node_btn_close.appendChild(node_img_close);
		var node_div_headerWrapper = document.createElement("div");
			node_div_headerWrapper.className = "panelheaderwrapper";
		if(FavScreen.get('attrInteractionMode') == MODE_REPLYING) {
			node_div_headerWrapper.innerHTML = "Respond";
		}
		else {
			node_div_headerWrapper.innerHTML = "Send";
		}
		var node_div_row1 = document.createElement("div");		//row containing the title/header info
			node_div_row1.appendChild(node_btn_close);
			node_div_row1.appendChild(node_div_headerWrapper);
		// Row 2... (the message button)
		var node_img_icon = document.createElement("img");		//img node for displaying the fav-icon associated with this message
			node_img_icon.className = "favIcon";
			node_img_icon.src = objMsgData.favIconSrc;
		var node_span_msgTitle = document.createElement("span");	//the name of the reply next to the icon
			node_span_msgTitle.innerHTML = objMsgData.favName;
		var node_btn_msg = document.createElement("button");	//big button meant to mimic a messagecell, that they actually click/tap to send off the reply
			node_btn_msg.id = "btnMsg";
			node_btn_msg.className = "bigiosstyle";
			node_btn_msg.type = "button";
			node_btn_msg.addEventListener('click', function() {
				launchFavorite(objMsgData.favRecno, true);		//re-call the launch method, but this time with 'true' (meaning to skip the pre-check stuff since it's already been done ~how we got here)
				window.ConfirmLaunch.hide();
				});//end add click listener
			node_btn_msg.appendChild(node_img_icon);
			node_btn_msg.appendChild(node_span_msgTitle);
		var node_div_row2 = document.createElement("div");		//row containing icon and action item(s)
			node_div_row2.style.clear = "right";				//clear the close-button's right float, so this div will be on the next line
			node_div_row2.appendChild(node_btn_msg);
		// Assemble rows into a single node of content to return
		var node_div_main = document.createElement("div");		//main node to return
		node_div_main.appendChild(node_div_row1);
		node_div_main.appendChild(node_div_row2);
		return node_div_main;
		};//end method for generating panel contents

	YUI().use("panel", function(Y){
		_yuiPanel = new Y.Panel({
			id				: 'panelconfirmsend',
			headerContent	: null,
			bodyContent		: null,
			footerContent	: null,
			buttons			: null,
			zIndex			: 999,
			width			: "90%",
			centered		: true,
			modal			: true,
			visible			: false,
			render			: true
			});//end panel

		_yuiPanel.after('init', function(e){
			//eval(instanceName+".initialized = true;");	//this breaks stuff for some reason
			//note: 'this' here references the yuiPanel object
			this.get('boundingBox')._node.style.outline = "none";							//set DOM style property for the Panel's main container (this is heavy on YUI overhead)
			FastClick.attach(document.getElementById('panelconfirmsend'));					//attach the fastclick override to this panel and any of its children (like buttons)
			});//end after-init
		
		var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];	       //get a reference to the modal mask (which, of course, is provided whenever a YUI-Panel reders)
		var headerwrapperHeight = document.getElementById("headerwrapper").offsetHeight;	   //get the calculated height of the headerwrapper area (including padding, etc.)
		if(!(headerwrapperHeight>0)) {headerwrapperHeight=60;}					 //if for some reason we didn't get a valid value, then fallback to hard coded assumed height of 60px (this likely will never happen, though)
		_yuiPanel.after('visibleChange', function(e){
			if(this.get('visible')){							     //if the panel is now visible, then...
				node_modalMask.style.display = "block";					    //show the modal mask
				node_modalMask.style.top = headerwrapperHeight+"px";			       //position the modal mask so that the header area isn't masked
			}else{									       //else the panel is now hidden, so...
				node_modalMask.style.display = "none";					     //hide the modal mask
				node_modalMask.style.top = "0px";						  //reset the modal mask's original position for masking the entire document
			}//end if-else
			});//end after-visibleChange
		});//end YUI().use

	//Expose the YUI Panel to this class' public space
	this.yuiPanel = _yuiPanel;

	this.show = function(favRecno){
		if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
		if(typeof favRecno==="undefined"){
			console.log(instanceName+".show method invoked without favRecno provided. Aborting");
			return false;
		}else{
			console.log(instanceName+".show method invoked with favRecno="+favRecno+".");
			this.favRecno = favRecno;
			var o = assembleDataObjectForFavRecno(favRecno);
			var node_bodyContents = generateContentForShowing(o);
			this.yuiPanel.set("bodyContent", node_bodyContents);
			if(FavScreen.get('attrInteractionMode')==MODE_REPLYING) {
			//	this.yuiPanel.set("id", 'panelconfirmrespond'); //DEV-NOTE: not sure whether we should modify this for response or not?
				this.yuiPanel.get('contentBox')._node.className = "MessageConfirmDialog confirmrespond roundedcorners";
			}
			else {
				this.yuiPanel.get('contentBox')._node.className = "MessageConfirmDialog confirmsend roundedcorners";
			}
			return this.yuiPanel.show();
		}
		};//end method definition for show()

	this.hide = function(intDelayMs){								    //define method for hiding the panel (with optional timer for doing so)
		console.log(instanceName+".hide method invoked.");
		if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
		this.favRecno = undefined;									   //re-initialize favRecno to be safe for future calls to the show method
		if(typeof intDelayMs==="undefined" || isNaN(intDelayMs)){					  //if no delay argument was provided, go ahead and hide the panel
			this.yuiPanel.hide();
		}
		else if(parseInt(intDelayMs,10)>50){								    //else-if delay argument is substantially long enough to have a chance of doing anything, set it to hide on delay
			handle_setTimeout = setTimeout(function(){
				this.yuiPanel.hide();
				}, parseInt(intDelayMs,10));
		}
		else{												//else all other unforseen cases, just hide it immediately
			this.yuiPanel.hide();
		}
		};//end method definition for hide()

	this.isVisible = function(){									 //define method for determining whether panel is currently showing
		if(this.yuiPanel.get('visible')){									 //if the panel is now visible, then return true
			return true;
		}else{											       //else the panel is now hidden, so return false
			return false;
		}//end if-else
		};//end method definition for isVisible()

	this.showFor = function(favRecno, intTimeoutMs){						     //define method for showing for a certain amount of time... favRecno required... if 2nd argument provided, it will automatically hide after that amount of time; else, it will show and NOT automatically hide
		if(typeof favRecno==="undefined"){
			console.log(instanceName+".showFor method invoked without favRecno provided. Aborting");
			return false;
		}else{
			console.log(instanceName+".showFor method invoked. Showing it for "+intTimeoutMs+" milliseconds.");
			if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
			this.favRecno = favRecno;
			var yp;											      //declare a variable to store reference to the yuiPanel that gets returned when we call the show method
			if(typeof intTimeoutMs==="number"){								//if time argument was provided...
				//yp = this.yuiPanel.show(favRecno);								//show the panel, remembering the yuiPanel reference it returns
				yp = this.show(favRecno);								//show the panel, remembering the yuiPanel reference it returns
				handle_setTimeout = setTimeout(function(){
					window.ConfirmLaunch.yuiPanel.hide();
					}, parseInt(intTimeoutMs,10));
			}//end if
		}//end else
		return yp;											   //method returns handle to the YUI Panel
		};//end method definition for showFor()

	this.initialized = true;
}//end function ClassPromptConfirmSend


function ClassPromptConfirmCloseMsg(instanceName){
	//public class resources...
	this.initialized = false;
	this.clickTargetId = undefined;
	this.favRecno = undefined;
	this.objMsgData = undefined;
	this.yuiPanel;
	
	//private class resources...
	var yuiPanel;
	var handle_setTimeout = undefined;								   //initialize a private handle for the setTimeout timer, so it can be cleared when they manually hide the panel
	var _log = function(logLevel, strMsg, doConsole) {
		if((typeof window.FavScreen === "object") && (typeof window.FavScreen.log === "function")) {
			return window.FavScreen.log(logLevel, strMsg, doConsole);
		}
		else {
			if(logLevel == "log") {
				return console.log(strMsg);
			}
			else if(logLevel == "info") {
				return console.info(strMsg);
			}
			else if(logLevel == "warn") {
				return console.warn(strMsg);
			}
			else if(logLevel == "error") {
				return console.error(strMsg);
			}
			else {
				return false;
			}
		}
		};//end function _log()

	var generateContentForShowing = function(objMsgData) {
		// Row 1...
		var node_img_close = document.createElement("img");
			node_img_close.src = window.FAVS_ICON_CLOSE_X;
		var node_btn_close = document.createElement("button");
			node_btn_close.id = "btnClose";
			node_btn_close.addEventListener('click', function(){
				window.ConfirmCloseMsg.hide();				//DEV-NOTE: just hard-coded this instance name to appease deadlines... really need to figure out why .hide can't be accessed here
				});
			node_btn_close.appendChild(node_img_close);
		var node_div_headerWrapper = document.createElement("div");
			node_div_headerWrapper.className = "panelheaderwrapper";
			node_div_headerWrapper.innerHTML = "Close";
		var node_div_row1 = document.createElement("div");		//row containing the title/header info
			node_div_row1.appendChild(node_btn_close);
			node_div_row1.appendChild(node_div_headerWrapper);
		// Row 2... (the message button)
		if(objMsgData.isInboxMsg) {
			var node_div_iconwrapper = document.createElement("div");
				//node_div_iconwrapper.style.cssFloat = "left";
				node_div_iconwrapper.className = "iconwrapper";
			if(objMsgData.node_li_messagecell.getElementsByClassName('iconwrapper')[0].childNodes[0].getAttribute('src').length < 1) {
				var node_span_bullet = document.createElement("span");
					node_span_bullet.innerHTML = '&#x25cf;';
					node_span_bullet.className = "bigblackbullet";
				node_div_iconwrapper.appendChild(node_span_bullet);
			}
			else {
				var node_img_icon = document.createElement("img");		//img node for displaying the fav-icon associated with this message
					node_img_icon.className = "favIcon";
					node_img_icon.src = objMsgData.node_li_messagecell.getElementsByClassName('iconwrapper')[0].childNodes[0].getAttribute('src');
					node_img_icon.align = "left";
				node_div_iconwrapper.appendChild(node_img_icon);
			}
			var node_span_msgTitle = document.createElement("span");	//the name of the reply next to the icon
				//node_span_msgTitle.appendChild(objMsgData.node_li_messagecell.getElementsByClassName('textwrapper')[0]);
				node_span_msgTitle.appendChild(objMsgData.node_li_messagecell.getElementsByClassName('msgwrapper')[0]);
			var node_btn_msg = document.createElement("button");	//big button meant to mimic a messagecell, that they actually click/tap to close the message
				node_btn_msg.id = "btnMsg";
				node_btn_msg.type = "button";
				node_btn_msg.className = objMsgData.node_li_messagecell.className + " bigiosstyle";
				node_btn_msg.addEventListener('click', function() {
					//launchFavorite(objMsgData.favRecno, true);		//re-call the launch method, but this time with 'true' (meaning to skip the pre-check stuff since it's already been done ~how we got here)
					closeMessage(window.ConfirmCloseMsg.clickTargetId, true);		//re-call the launch method, but this time with 'true' (meaning to skip the pre-check stuff since it's already been done ~how we got here)
					window.ConfirmCloseMsg.hide();
					});//end add click listener
				node_btn_msg.appendChild(node_img_icon);
				node_btn_msg.appendChild(node_span_msgTitle);
			var node_div_row2 = document.createElement("div");		//row containing icon and action item(s)
				node_div_row2.style.clear = "right";				//clear the close-button's right float, so this div will be on the next line
				node_div_row2.appendChild(node_btn_msg);
		}
		else {
			var node_img_icon = document.createElement("img");		//img node for displaying the fav-icon associated with this message
				node_img_icon.className = "favIcon";
				node_img_icon.src = objMsgData.favIconSrc;
			var node_span_msgTitle = document.createElement("span");	//the name of the reply next to the icon
				node_span_msgTitle.innerHTML = objMsgData.favName;
			var node_img_toggleicon = document.createElement("img");
				node_img_toggleicon.src = FAVS_ICON_TOGGLE_CLOSE;
				node_img_toggleicon.style.cssFloat = "right";
			var node_btn_msg = document.createElement("button");	//big button meant to mimic a messagecell, that they actually click/tap to close the message
				node_btn_msg.id = "btnMsg";
				node_btn_msg.className = "bigiosstyle";
				node_btn_msg.type = "button";
				node_btn_msg.addEventListener('click', function() {
					//launchFavorite(objMsgData.favRecno, true);		//re-call the launch method, but this time with 'true' (meaning to skip the pre-check stuff since it's already been done ~how we got here)
					closeMessage(window.ConfirmCloseMsg.clickTargetId, true);		//re-call the launch method, but this time with 'true' (meaning to skip the pre-check stuff since it's already been done ~how we got here)
					window.ConfirmCloseMsg.hide();
					});//end add click listener
				node_btn_msg.appendChild(node_img_toggleicon);
				node_btn_msg.appendChild(node_img_icon);
				node_btn_msg.appendChild(node_span_msgTitle);
			var node_div_row2 = document.createElement("div");		//row containing icon and action item(s)
				node_div_row2.style.clear = "right";				//clear the close-button's right float, so this div will be on the next line
				node_div_row2.appendChild(node_btn_msg);
		}
		// Assemble rows into a single node of content to return
		var node_div_main = document.createElement("div");		//main node to return
		node_div_main.appendChild(node_div_row1);
		node_div_main.appendChild(node_div_row2);
		return node_div_main;
		};//end method for generating panel contents

	YUI().use("panel", function(Y){
		_yuiPanel = new Y.Panel({
			id				: 'panelconfirmclosemsg',
			headerContent	: null,
			bodyContent		: null,
			footerContent	: null,
			buttons			: null,
			zIndex			: 999,
			width			: "90%",
			centered		: true,
			modal			: true,
			visible			: false,
			render			: true
			});//end panel

		_yuiPanel.after('init', function(e){
			//eval(instanceName+".initialized = true;");	//this breaks stuff for some reason
			//note: 'this' here references the yuiPanel object
			this.get('boundingBox')._node.style.outline = "none";							//set DOM style property for the Panel's main container (this is heavy on YUI overhead)
			this.get('contentBox')._node.className = "MessageConfirmDialog confirmclosemsg roundedcorners";	//set DOM class property for the Panel's contents wrapper, so the stylesheet can work its magic
			FastClick.attach(document.getElementById('panelconfirmclosemsg'));					//attach the fastclick override to this panel and any of its children (like buttons)
			});//end after-init
		
		var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];	       //get a reference to the modal mask (which, of course, is provided whenever a YUI-Panel reders)
		var headerwrapperHeight = document.getElementById("headerwrapper").offsetHeight;	   //get the calculated height of the headerwrapper area (including padding, etc.)
		if(!(headerwrapperHeight>0)) {headerwrapperHeight=60;}					 //if for some reason we didn't get a valid value, then fallback to hard coded assumed height of 60px (this likely will never happen, though)
		_yuiPanel.after('visibleChange', function(e){
			if(this.get('visible')){							     //if the panel is now visible, then...
				node_modalMask.style.display = "block";					    //show the modal mask
				node_modalMask.style.top = headerwrapperHeight+"px";			       //position the modal mask so that the header area isn't masked
			}else{									       //else the panel is now hidden, so...
				node_modalMask.style.display = "none";					     //hide the modal mask
				node_modalMask.style.top = "0px";						  //reset the modal mask's original position for masking the entire document
			}//end if-else
			});//end after-visibleChange
		});//end YUI().use

	//Expose the YUI Panel to this class' public space
	this.yuiPanel = _yuiPanel;

	this.show = function(clickTargetId){
		if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
		if(typeof clickTargetId==="undefined"){
			console.log(instanceName+".show method invoked without clickTargetId provided. Aborting");
			return false;
		}else{
			console.log(instanceName+".show method invoked with clickTargetId="+clickTargetId+".");
			this.clickTargetId = clickTargetId;
			if(isNaN(clickTargetId)) {
				this.favRecno = clickTargetId.toString().split("_")[1];
			}else{
				this.favRecno = clickTargetId;
			}
			var o;
			if(document.getElementById(clickTargetId).className.indexOf('inboxmsg') > -1) {
				o = {
					isInboxMsg : true, 																//flag
					node_li_messagecell : document.getElementById(clickTargetId).cloneNode(true)	//copy of the inbox messagecell node (to save us the work of building another)
					};
			}else{
				o = assembleDataObjectForFavRecno(this.favRecno);
			}
			var node_bodyContents = generateContentForShowing(o);
			this.yuiPanel.set("bodyContent", node_bodyContents);
			return this.yuiPanel.show();
		}
		};//end method definition for show()

	this.hide = function(intDelayMs){								    //define method for hiding the panel (with optional timer for doing so)
		console.log(instanceName+".hide method invoked.");
		if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
		this.clickTargetId = undefined;									   //re-initialize favRecno to be safe for future calls to the show method
		if(typeof intDelayMs==="undefined" || isNaN(intDelayMs)){					  //if no delay argument was provided, go ahead and hide the panel
			this.yuiPanel.hide();
		}
		else if(parseInt(intDelayMs,10)>50){								    //else-if delay argument is substantially long enough to have a chance of doing anything, set it to hide on delay
			handle_setTimeout = setTimeout(function(){
				this.yuiPanel.hide();
				}, parseInt(intDelayMs,10));
		}
		else{												//else all other unforseen cases, just hide it immediately
			this.yuiPanel.hide();
		}
		};//end method definition for hide()

	this.isVisible = function(){									 //define method for determining whether panel is currently showing
		if(this.yuiPanel.get('visible')){									 //if the panel is now visible, then return true
			return true;
		}else{											       //else the panel is now hidden, so return false
			return false;
		}//end if-else
		};//end method definition for isVisible()

	this.showFor = function(clickTargetId, intTimeoutMs){						     //define method for showing for a certain amount of time... favRecno required... if 2nd argument provided, it will automatically hide after that amount of time; else, it will show and NOT automatically hide
		if(typeof clickTargetId==="undefined"){
			console.log(instanceName+".showFor method invoked without clickTargetId provided. Aborting");
			return false;
		}else{
			console.log(instanceName+".showFor method invoked. Showing it for "+intTimeoutMs+" milliseconds.");
			if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}		       //if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
			this.clickTargetId = clickTargetId;
			var yp;											      //declare a variable to store reference to the yuiPanel that gets returned when we call the show method
			if(typeof intTimeoutMs==="number"){								//if time argument was provided...
				yp = this.show(clickTargetId);								//show the panel, remembering the yuiPanel reference it returns
				handle_setTimeout = setTimeout(function(){
					window.ConfirmCloseMsg.yuiPanel.hide();
					}, parseInt(intTimeoutMs,10));
			}//end if
		}//end else
		return yp;											   //method returns handle to the YUI Panel
		};//end method definition for showFor()

	this.initialized = true;
}//end function ClassPromptConfirmCloseMsg


/**********************************************************************************************************************************************
 * Class ClassPanelSubsectionEdit (Object cfg)
 *
 *	Defines an instance of a subsection edit panel.
 *
 *	Creating an instance of this class with a proper configuration-object will not automatically initialize it;
 *	so, you must call .initialize() to generate/render a logical panel (hidden), and then you can invoke it at any time.
 *
 *	USAGE:
 *		1) Instantiate: Creates a class-instance. 							Ex. myInstance = new ClassPanelSubsectionEdit({str_panelDomID:"myPanelsID"});
 *		2) Initialize: 	Prepares class for use & renders the YUI Panel.		Ex. myInstance.initialize();
 *		3) Show/Hide: 	Actually show/hide the panel.						Ex. myInstance.show();  -OR-  myInstance.hide();
 *
 *	REQUIRES:
 *		- Main favs framework
 *			JS-dynamics
 *		- YUI 3.14.1
 *		- FastClick
 *
 *	ARGUMENTS:
 *		- Object cfg 	(required)	An object containing configuration data for the instance. (members below)
 *			String 	cfg.str_panelDomID					(required)	The DOM ID value to assign to the panel node.
 *			string 	cfg.str_panelDomClassName			(optional)	Any additional custom class names to give the panel (it will get at least the YUI default ones)... multiple classnames should be separated with a space character.
 *			String 	cfg.str_panelTitleText				(optional)	The title text to display at the top of the panel. If not provided, then a default title will be generated.
 *			Object 	cfg.objFxn_refreshHandler			(req/opt)	Specify/define the routine that should handle refreshing. If not provided, no specific refresh can happen.
 *
 *	HISTORY:
 *		- 2015.04.27	v1.0 	Prototype created.
 *
 **********************************************************************************************************************************************/
function ClassPanelSubsectionEdit(cfg) {
	this.str_version = "1.3";
	this.str_build = "2015.05.07";

	this.bool_isConstructorLoaded = false; //pre-initialize this at earliest opportunity to be safe

	// VALIDATIONS...
	//environment...
	if(typeof FavScreen !== "object") {
		return console.error("ClassPanelSubsectionEdit: Instantiation requires a valid ClassFavScreen instance to exist in the global scope as 'FavScreen'. Aborting.");
	}
	if(typeof colorShade !== "function") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires dynamics:colorShade() to exist in the global scope. Aborting.", true);
	}
	if(typeof updateCharCountDisplay !== "function") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires updateCharCountDisplay() to exist in the global scope. Aborting.", true);
	}
	if(typeof YUI !== "function") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires YUI to exist in the global scope, as 'YUI'. Aborting.", true);
	}
	if(typeof FastClick !== "function") {
		FavScreen.log("info", "ClassPanelSubsectionEdit: FastClick not found at instantiation-time (it might exist later?). It is not required, but recommended. Continuing...", true);
	}
	if(typeof ModalNotification_Saved !== "object") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires a ClassModalNotification instance to exist in the global scope as 'ModalNotification_Saved'. Aborting.", true);
	}
	if(typeof ModalNotification_OK !== "object") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires a ClassModalNotification instance to exist in the global scope as 'ModalNotification_OK'. Aborting.", true);
	}
	if(typeof ModalNotification_GeneralError !== "object") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires a ClassModalNotification instance to exist in the global scope as 'ModalNotification_GeneralError'. Aborting.", true);
	}
	//required arguments...
	if(typeof cfg !== "object") {
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Instantiation requires a configuration object to be provided. Aborting", true);
	}
	if(typeof cfg.str_panelDomID !== "string"
		){
		return FavScreen.log("error", "ClassPanelSubsectionEdit: Invalid configuration object provided (required members missing or invalid). Aborting.", true);
	}
	//optional arguments... (since they're optional, the validation needed is just to ensure they're properly data-typed)
	if(typeof cfg.str_panelDomClassName !== "string") {cfg.str_panelDomClassName = String();} //if no str_panelDomClassName member exists in the object (or was provided as an invalid data-type), then init/re-type it properly as a string.
	if(typeof cfg.str_panelTitleText !== "string") {cfg.str_panelTitleText = String();} //if no str_panelTitleText member exists in the object (or was provided as an invalid data-type), then init/re-type it properly as a string.	
	if(typeof cfg.objFxn_refreshHandler !== "function") { //if no refresh handler specified (or invalid), log it and deal with a fall-back
		FavScreen.log("info", "ClassPanelSubsectionEdit: No specific refresh-handler provided. Any refresh operation will fall-back to the global refreshRecordset routine.", true);
		cfg.objFxn_refreshHandler = function() { //define a fall-back handler right now...
			window.refreshRecordset(CURRENT_USER_PIN, true, false, false); //use the global refresh routine (refresh orig, don't jump to top, don't obey delay)
			};//end fall-back handler definition
	}//end refresh handler fallback

	// PRIVATE PROPERTIES...
	//setup configuration defaults... (whatever various items should be whenever something didn't quite turn out right)
	var cfg_defaults = {
		str_panelDomClassName : "", //no specific class required for now
		str_panelTitleText : "Edit Header" //the title text to put in the top, if nothing was provided
	};//end cfg_defaults
	//normalize any provided configuration-items & substitute with defaults if needed...
	if(cfg.str_panelDomClassName.length === 0) {cfg.str_panelDomClassName = cfg_defaults.str_panelDomClassName;} //normalize the provided className or set to default if nothing valid was provided
	if(cfg.str_panelTitleText.length === 0) {cfg.str_panelTitleText = cfg_defaults.str_panelTitleText;} //normalize the provided panel title text or set to default if nothing valid was provided

	// PRIVATE METHODS...
	function generatePanelHeading() {
		var ret = null; //initialize a default return value
		var cfg_div_id = "";
		var cfg_div_classname = "";
		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelHeading(): Starting...", true);
		try {
			var oNode_div = document.createElement("div");
				oNode_div.setAttribute("id", cfg_div_id);
				oNode_div.setAttribute("class", cfg_div_classname);
			var oNode_text_button_addNewAbove = document.createTextNode("Add a New Header");
			var oNode_button_addNewAbove = document.createElement("button");
				oNode_button_addNewAbove.setAttribute("id", "btn-addnewheaderabove");
				oNode_button_addNewAbove.setAttribute("class", "yui3-button"); //make it match the style of buttons in the YUI footer-widget
				oNode_button_addNewAbove.appendChild(oNode_text_button_addNewAbove);
				oNode_button_addNewAbove.addEventListener("click", function(e) {
					e.preventDefault();
					handleAddNewHeaderButtonClick(e);
					});//end add-new-above button onclick definition
			var oNode_text_titleText = document.createTextNode(cfg.str_panelTitleText);
			var oNode_span_titleText = document.createElement("span"); //create a SPAN wrapper node for the text, so it can be packaged up neatly
				oNode_span_titleText.appendChild(oNode_text_titleText); //add the just-created text node to its wrapper node
			var oNode_div_clearfloats = document.createElement("div"); //create the object for our float-clearing element
				oNode_div_clearfloats.setAttribute("class", "clearfloats"); //assign the CSS class that will apply float-clearing
			oNode_div.appendChild(oNode_button_addNewAbove); //add the button first (since it's floated right)
			oNode_div.appendChild(oNode_span_titleText);
			oNode_div.appendChild(oNode_div_clearfloats); //add the clear to the end of the header-div node
			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelHeading(): Completed. Returning DIV node.", true);
			return oNode_div;
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelHeading(): Caught error ("+err.message+").", true);
			return ret;
		}
	}//end function generatePanelHeading()

	function generateColorTiles() {
		var ret = null;
		//define our base pastel palette... (NOTE: remember that we may do slight changes/lighten/darken to these for headers, etc.)
		var arrColors = [
			"#F7977A", //pastel red
			"#FDC68A", //pastel yellow-orange
			"#FFF79A", //pastel yellow
			"#C4DF9B", //pastel pea green
			"#7BCDC8", //pastel green-cyan
			"#F6989D", //pastel magenta-red
			"#F49AC2", //pastel magenta
			"#A187BE", //pastel violet
			"#7EA7D8", //pastel cyan-blue
			"#6ECFF6" //pastel cyan
			];
		var cfg_paletteAdjustment = 0.60;	//convert the original palette colors (above) to be 60% lighter (this value can be between -1 and 1)
		var cfg_numberOfTilesPerRowDesired = 5;	//specify how many tiles you want to be in each row
		//set up the template
		var oNode_span_wrapper = document.createElement("span");
		var oNode_div_row = document.createElement("div"); //the block element we use to make a row... Note: this will be contained inside the span-wrapper
		var oNode_span_colorTile_template = document.createElement("span");
			oNode_span_colorTile_template.setAttribute("class", "colortile");
		//pre-define a few things
		var oNode_span_colorTile_toAdd;
		var handleColorSelection = function(e) {
			handleColorDynamics(e);
			};
		//construct each color tile, based on what's defined in the array above
		var j = 0; //counter for tiles per row
		for(var i=0; i<arrColors.length; i++) {
			oNode_span_colorTile_toAdd = oNode_span_colorTile_template.cloneNode(); //get a copy of the colortile, using the template
			oNode_span_colorTile_toAdd.style.backgroundColor = colorShade_brightness(arrColors[i], cfg_paletteAdjustment); //set this colortile's color
			oNode_span_colorTile_toAdd.addEventListener("click", function(e){handleColorDynamics(e);}); //add an event listener to this colortile
			oNode_div_row.appendChild(oNode_span_colorTile_toAdd); //add this completed colortile to its row
			j++; //increment our per-row tile counter, since we just wrote a tile to its row
			if(j === cfg_numberOfTilesPerRowDesired //if the tile just added was the last one allowed in its row, complete the row
			|| j === arrColors.length) {			//also, if the tile just added was the final one, complete the row
				oNode_span_wrapper.appendChild(oNode_div_row); //add the completed row to
				oNode_div_row = document.createElement("div"); //reinitialize the row object, so we can just reuse it for the next row (if there is one)
			}
		}
		//finalize and return
		ret = oNode_span_wrapper;
		return ret;
	}//end function generateColorTiles()
/*
	function generatePanelBody(objMsgData) {
		var ret = null; //initialize a default return value
		var cfg_div_id = "";
		var cfg_div_classname = "";
		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Starting...", true);
		try {
			cfg.obj_recordData = objMsgData; //expose the record-data context, so it can be referenced later (e.g. using it as a template to create a new custom subheader)
			var shouldIgnoreChangeInIP = String(window.determineShouldIgnoreChangeInIP());
			var currentUserPin = String(window.CURRENT_USER_PIN);
			var record_favRecno = objMsgData.recno_fav || "0";
			var record_label1 = objMsgData.label1 || "";
			var record_position = String(window.rsRec_getFavPosition(FavScreen.rsOrig, record_favRecno));
			var record_baseColor = objMsgData.color || objConfig_MajorSection_personalLibs.str_baseColor;
			//construct main container... (this is what will get returned by this function)
			var oNode_div = document.createElement("div");
				oNode_div.setAttribute("id", cfg_div_id);
				oNode_div.setAttribute("class", cfg_div_classname);
			//construct main form
			var oNode_form = document.createElement("form");
				oNode_form.setAttribute("id", "form_editHeader"); //WARNING: if you change this id-value, be sure to update the reference in the YUI Panel below!
			//construct hidden fields...
			var oNode_fld_smcgiCommand = document.createElement("input");
				oNode_fld_smcgiCommand.setAttribute("type", "hidden");
				oNode_fld_smcgiCommand.setAttribute("id", "fld_smcgi_command");
				oNode_fld_smcgiCommand.setAttribute("name", "updateFavRecord");
				oNode_fld_smcgiCommand.setAttribute("value", "true");
			var oNode_fld_smcgiAuthentication = document.createElement("input");
				oNode_fld_smcgiAuthentication.setAttribute("type", "hidden");
				oNode_fld_smcgiAuthentication.setAttribute("name", window.CGI_IDENT_FIELD);
				oNode_fld_smcgiAuthentication.setAttribute("value", window.CURRENT_USER_PIN_ENCODED);
			var oNode_fld_smcgiDisableCheckIP = document.createElement("input");
				oNode_fld_smcgiDisableCheckIP.setAttribute("type", "hidden");
				oNode_fld_smcgiDisableCheckIP.setAttribute("name", "disableCheckForIP_favorites");
				oNode_fld_smcgiDisableCheckIP.setAttribute("value", shouldIgnoreChangeInIP);
			var oNode_fld_userPin = document.createElement("input");
				oNode_fld_userPin.setAttribute("type", "hidden");
				oNode_fld_userPin.setAttribute("name", "userPin");
				oNode_fld_userPin.setAttribute("value", currentUserPin);
			var oNode_fld_favRecno = document.createElement("input");
				oNode_fld_favRecno.setAttribute("type", "hidden");
				oNode_fld_favRecno.setAttribute("name", "recno_fav");
				oNode_fld_favRecno.setAttribute("value", record_favRecno);
			var oNode_fld_favPosition = document.createElement("input");
				oNode_fld_favPosition.setAttribute("type", "hidden");
				oNode_fld_favPosition.setAttribute("id", "fld_position");
				oNode_fld_favPosition.setAttribute("name", "position");
				oNode_fld_favPosition.setAttribute("value", record_position);
			var oNode_fld_colorHexString = document.createElement("input"); //hidden field for tracking desired subsection base-color... a string hex value
				oNode_fld_colorHexString.setAttribute("type", "hidden");
				oNode_fld_colorHexString.setAttribute("id", "fld_color_hex");
				oNode_fld_colorHexString.setAttribute("name", "color_hex");
				oNode_fld_colorHexString.setAttribute("value", record_baseColor);
			//begin to assemble the form, starting with the hidden fields...
			oNode_form.appendChild(oNode_fld_smcgiCommand);
			oNode_form.appendChild(oNode_fld_smcgiAuthentication);
			oNode_form.appendChild(oNode_fld_smcgiDisableCheckIP);
			oNode_form.appendChild(oNode_fld_userPin);
			oNode_form.appendChild(oNode_fld_favRecno);
			oNode_form.appendChild(oNode_fld_favPosition);
			oNode_form.appendChild(oNode_fld_colorHexString);
			//construct user-facing fields...
			var oNode_fld_headerName = document.createElement("input");
				oNode_fld_headerName.setAttribute("type", "text");
				oNode_fld_headerName.setAttribute("id", "label1");
				oNode_fld_headerName.setAttribute("name", "label1");
				oNode_fld_headerName.setAttribute("value", record_label1);
				oNode_fld_headerName.setAttribute("maxLength", window.FAVS_FAVNAME_MAXLENGTH);
				oNode_fld_headerName.addEventListener("input", function(e) {
					handleFieldDynamics(e);
					});//end field-input handler
			//construct various other elements...
			var oNode_span_charCounter_label1 = document.createElement("span"); //<span class=\"charcountdisplay\" id=\"charcountdisplay-favname\"></span>
				oNode_span_charCounter_label1.setAttribute("id", "charcountdisplay-subsectionedit-label1");
				oNode_span_charCounter_label1.setAttribute("class", "charcountdisplay");
			var oNode_text_fieldLabel_color = document.createTextNode("Color");
			var oNode_text_fieldLabel_label1 = document.createTextNode("Name");
			var oNode_div_colorTiles = document.createElement("div");
				oNode_div_colorTiles.setAttribute("class", "colortilecontainer");
				oNode_div_colorTiles.appendChild(generateColorTiles());
			var oNode_text_previewSubheader = document.createTextNode(record_label1);
			var oNode_div_previewSubheader = document.createElement("div");
				oNode_div_previewSubheader.setAttribute("id", "subsection-preview-subheader");
				oNode_div_previewSubheader.setAttribute("class", "roundedtopcorners8");
				oNode_div_previewSubheader.style.backgroundColor = colorShade(oNode_fld_colorHexString.getAttribute("value"), -0.05);
				oNode_div_previewSubheader.appendChild(oNode_text_previewSubheader);
			var oNode_div_previewSubsection = document.createElement("div");
				oNode_div_previewSubsection.setAttribute("id", "subsection-preview-subsection");
				oNode_div_previewSubsection.style.backgroundColor = oNode_fld_colorHexString.getAttribute("value");
			var oNode_div_preview = document.createElement("div");
				oNode_div_preview.setAttribute("id", "subsection-preview");
				oNode_div_preview.appendChild(oNode_div_previewSubheader);
				oNode_div_preview.appendChild(oNode_div_previewSubsection);
			//construct the layout table (yes, I know this is bad, but it's easy and quick for now)
			//first, construct templates...
			var oNode_table_forLayout = document.createElement("table");
			var oNode_tr_template = document.createElement("tr");
			var oNode_td_fieldLabel_template = document.createElement("td");
				oNode_td_fieldLabel_template.setAttribute("class", "fieldlabel");
			var oNode_td_fieldActual_template = document.createElement("td");
				oNode_td_fieldActual_template.setAttribute("class", "field");
			//second, use those templates to make the nodes we're interested in...
			var oNode_tr_color = oNode_tr_template.cloneNode();
			var oNode_td_fieldLabel_color = oNode_td_fieldLabel_template.cloneNode();
			var oNode_td_fieldActual_color = oNode_td_fieldActual_template.cloneNode();
			var oNode_tr_label1 = oNode_tr_template.cloneNode();
			var oNode_td_fieldLabel_label1 = oNode_td_fieldLabel_template.cloneNode();
			var oNode_td_fieldActual_label1 = oNode_td_fieldActual_template.cloneNode();
			//assemble the body...
			oNode_td_fieldLabel_color.appendChild(oNode_text_fieldLabel_color); //add the color field's label-text to its table cell
			oNode_td_fieldActual_color.appendChild(oNode_div_colorTiles); //add the color chooser/field to its table cell
			oNode_tr_color.appendChild(oNode_td_fieldLabel_color);
			oNode_tr_color.appendChild(oNode_td_fieldActual_color);
			oNode_td_fieldLabel_label1.appendChild(oNode_text_fieldLabel_label1); //add the name (label1) field's label-text to its table cell
			oNode_td_fieldActual_label1.appendChild(oNode_fld_headerName); //add the name (label1) field to its table cell
			oNode_td_fieldActual_label1.appendChild(oNode_span_charCounter_label1); //add the character-counter element to the right of the field
			oNode_tr_label1.appendChild(oNode_td_fieldLabel_label1); //add the label1 field-label cell to its table-row
			oNode_tr_label1.appendChild(oNode_td_fieldActual_label1); //add the label1 field cell to its table-row
			oNode_table_forLayout.appendChild(oNode_tr_label1); //add the label1 row to the table
			oNode_table_forLayout.appendChild(oNode_tr_color); //add the color row to the table
			oNode_form.appendChild(oNode_div_preview); //add the preview section (between the add-new button & table - kinda like a visual separator)
			oNode_form.appendChild(oNode_table_forLayout); //add the layout-table to the form (below the add-new button)
			oNode_div.appendChild(oNode_form); //add the form to the main wrapper div to return

			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Completed. Returning DIV node.", true);
			return oNode_div;
		}
		catch(err) {
			FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Caught error ("+err.message+"). This should be expected on first load where there is no record context.", true);
			return ret;
		}
	}//end function generatePanelBody()
*/
	function generatePanelBody(objMsgData) {
		var ret = null; //initialize a default return value
		var cfg_div_id = "";
		var cfg_div_classname = "";
		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Starting...", true);
		try {
			objMsgData = objMsgData || {};
			cfg.obj_recordData = objMsgData; //expose the record-data context, so it can be referenced later (e.g. using it as a template to create a new custom subheader)
			var shouldIgnoreChangeInIP = String(window.determineShouldIgnoreChangeInIP());
			var currentUserPin = String(window.CURRENT_USER_PIN);
			var record_favRecno = objMsgData.recno_fav || "0";
			var record_label1 = objMsgData.label1 || "";
			var record_position = String(window.rsRec_getFavPosition(FavScreen.rsOrig, record_favRecno));
			var record_baseColor = objMsgData.color || objConfig_MajorSection_personalLibs.str_baseColor;
			//construct main container... (this is what will get returned by this function)
			var oNode_div = document.createElement("div");
				oNode_div.setAttribute("id", cfg_div_id);
				oNode_div.setAttribute("class", cfg_div_classname);
			//construct main form
			var oNode_form = document.createElement("form");
				oNode_form.setAttribute("id", "form_editHeader"); //WARNING: if you change this id-value, be sure to update the reference in the YUI Panel below!
			//construct hidden fields...
			var oNode_fld_smcgiCommand = document.createElement("input");
				oNode_fld_smcgiCommand.setAttribute("type", "hidden");
				oNode_fld_smcgiCommand.setAttribute("id", "fld_smcgi_command");
				oNode_fld_smcgiCommand.setAttribute("name", "updateFavRecord");
				oNode_fld_smcgiCommand.setAttribute("value", "true");
			var oNode_fld_smcgiAuthentication = document.createElement("input");
				oNode_fld_smcgiAuthentication.setAttribute("type", "hidden");
				oNode_fld_smcgiAuthentication.setAttribute("name", window.CGI_IDENT_FIELD);
				oNode_fld_smcgiAuthentication.setAttribute("value", window.CURRENT_USER_PIN_ENCODED);
			var oNode_fld_smcgiDisableCheckIP = document.createElement("input");
				oNode_fld_smcgiDisableCheckIP.setAttribute("type", "hidden");
				oNode_fld_smcgiDisableCheckIP.setAttribute("name", "disableCheckForIP_favorites");
				oNode_fld_smcgiDisableCheckIP.setAttribute("value", shouldIgnoreChangeInIP);
			var oNode_fld_userPin = document.createElement("input");
				oNode_fld_userPin.setAttribute("type", "hidden");
				oNode_fld_userPin.setAttribute("name", "userPin");
				oNode_fld_userPin.setAttribute("value", currentUserPin);
			var oNode_fld_favRecno = document.createElement("input");
				oNode_fld_favRecno.setAttribute("type", "hidden");
				oNode_fld_favRecno.setAttribute("name", "recno_fav");
				oNode_fld_favRecno.setAttribute("value", record_favRecno);
			var oNode_fld_favPosition = document.createElement("input");
				oNode_fld_favPosition.setAttribute("type", "hidden");
				oNode_fld_favPosition.setAttribute("id", "fld_position");
				oNode_fld_favPosition.setAttribute("name", "position");
				oNode_fld_favPosition.setAttribute("value", record_position);
			var oNode_fld_colorHexString = document.createElement("input"); //hidden field for tracking desired subsection base-color... a string hex value
				oNode_fld_colorHexString.setAttribute("type", "hidden");
				oNode_fld_colorHexString.setAttribute("id", "fld_color_hex");
				oNode_fld_colorHexString.setAttribute("name", "color_hex");
				oNode_fld_colorHexString.setAttribute("value", record_baseColor);
			//begin to assemble the form, starting with the hidden fields...
			oNode_form.appendChild(oNode_fld_smcgiCommand);
			oNode_form.appendChild(oNode_fld_smcgiAuthentication);
			oNode_form.appendChild(oNode_fld_smcgiDisableCheckIP);
			oNode_form.appendChild(oNode_fld_userPin);
			oNode_form.appendChild(oNode_fld_favRecno);
			oNode_form.appendChild(oNode_fld_favPosition);
			oNode_form.appendChild(oNode_fld_colorHexString);
			//construct user-interactive fields...
			var oNode_fld_headerName = document.createElement("input");
				oNode_fld_headerName.setAttribute("type", "text");
				oNode_fld_headerName.setAttribute("id", "label1");
				oNode_fld_headerName.setAttribute("name", "label1");
				oNode_fld_headerName.setAttribute("value", record_label1);
				oNode_fld_headerName.setAttribute("maxLength", window.FAVS_FAVNAME_MAXLENGTH);
			//	oNode_fld_headerName.addEventListener("input", function(e) {
			//		handleFieldDynamics(e);
			//		});//end field-input handler
			var oNode_div_colorTiles = document.createElement("div");
				oNode_div_colorTiles.setAttribute("class", "colortilecontainer");
				oNode_div_colorTiles.appendChild(generateColorTiles());
			//construct various other elements & final assembly...
			var oNode_div_previewSubheader = document.createElement("div");
				oNode_div_previewSubheader.setAttribute("id", "subsection-preview-subheader");
				oNode_div_previewSubheader.setAttribute("class", "roundedtopcorners8");
				oNode_div_previewSubheader.style.backgroundColor = colorShade(oNode_fld_colorHexString.getAttribute("value"), -0.10);
				oNode_div_previewSubheader.appendChild(oNode_fld_headerName);
			var oNode_div_previewSubsection = document.createElement("div");
				oNode_div_previewSubsection.setAttribute("id", "subsection-preview-subsection");
				oNode_div_previewSubsection.style.backgroundColor = oNode_fld_colorHexString.getAttribute("value");
			var oNode_div_preview = document.createElement("div");
				oNode_div_preview.setAttribute("id", "subsection-preview");
				oNode_div_preview.appendChild(oNode_div_previewSubheader);
				oNode_div_preview.appendChild(oNode_div_previewSubsection);
			oNode_form.appendChild(oNode_div_preview); //add the preview section (between the add-new button & table - kinda like a visual separator)
			oNode_form.appendChild(oNode_div_colorTiles); //add the color palette selection to the form
			oNode_div.appendChild(oNode_form); //add the form to the main wrapper div to return

			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Completed. Returning DIV node.", true);
			return oNode_div;
		}
		catch(err) {
			FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": generatePanelBody(): Caught error ("+err.message+"). This should be expected on first load where there is no record context.", true);
			return ret;
		}
	}//end function generatePanelBody()
	function updateCharCounter(objNode_charCounterToUpdate, intCurrentChars, intMaxChars) {
		try {
			objNode_charCounterToUpdate.innerHTML = "("+intCurrentChars+"/"+intMaxChars+")";
			if(intCurrentChars >= intMaxChars) {
				if(typeof objNode_charCounterToUpdate.classList === "object") {
					objNode_charCounterToUpdate.classList.add("warn");   //if browser supports classList, then use it to add the 'warn' class
				}
				else {
					FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updateCharCounter(): Client does not support classList, unable to add 'warn' class.", true);
				}
				if(intCurrentChars > intMaxChars) {
					FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updateCharCounter(): User attempting to enter more characters than allowed, returning false.", true);
					return false;
				}
			}
			else {
				if(typeof objNode_charCounterToUpdate.classList === "object") {
					objNode_charCounterToUpdate.classList.remove("warn");   //if browser supports classList, then use it to remove the 'warn' class
				}
				else {
					FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updateCharCounter(): Client does not support classList, unable to remove 'warn' class.", true);
				}
			}
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updateCharCounter(): Caught error ("+err.message+").", true);
		}
	}//end function updateCharCounter()
	function updatePreviewText(updatedText) {
		try {
			var objNode_previewSubheader = document.getElementById("subsection-preview-subheader");
			objNode_previewSubheader.innerHTML = updatedText;
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updatePreviewText(): Caught error ("+err.message+").", true);
		}
	}//end updatePreview()
	function updatePreviewColor(updatedColor) {
		try {
			var objNode_preview_subheader = document.getElementById("subsection-preview-subheader");
			var objNode_preview_subsection = document.getElementById("subsection-preview-subsection");
			objNode_preview_subheader.style.backgroundColor = colorShade(updatedColor, -0.10);
			objNode_preview_subsection.style.backgroundColor = updatedColor;
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updatePreviewColor(): Caught error ("+err.message+").", true);
		}
	}//end updatePreview()
	function handleFieldDynamics(evt) {
		updateCharCounter(document.getElementById("charcountdisplay-subsectionedit-label1"), evt.currentTarget.value.length, window.FAVS_FAVNAME_MAXLENGTH);
		updatePreviewText(evt.currentTarget.value);
	}//end function handleFieldDynamics()
	function handleColorDynamics(evt) {
		function rgb2hex(rgb) {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			function hex(x) {
				return ("0" + parseInt(x).toString(16)).slice(-2);
			}
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
		var rawColorAsRGB = evt.currentTarget.style.backgroundColor;
		var colorAsHex = rgb2hex(rawColorAsRGB);
		updatePreviewColor(colorAsHex); //update the preview color (just visual)
		document.getElementById("fld_color_hex").value = colorAsHex; //update hidden field with the hex value, so smcgi can parse it in order to plug into the database record
	}//end function handleColorDynamics()
	function handleAddNewHeaderButtonClick(evt) {
		var cfg_li_classname = "subsectionheader sublistheader roundedtopcorners8"; //DEV-NOTE: these were just re-used from library hacked manner... redo more properly?
		FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Starting...", true);
		try {
			var objRecordData = cfg.obj_recordData; //grab a local copy of the publicized record data, to use as a template (e.g. exposed by generatePanelBody() and updatePanelWithNewSubsectionData() methods)
			var oNodeRef_li_subheaderEditing = document.getElementById(objRecordData.recno_fav); //get a reference to the LI node of the subheader they're editing
			var oNodeRef_li_subheaderEditing_parent = oNodeRef_li_subheaderEditing.parentNode; //get a reference to the LI node's parent node, so we can more easily use the insertBefore method, later
			var str_contextualListID = oNodeRef_li_subheaderEditing_parent.getAttribute("id"); //get the DOM ID of the list that they're adding a new header to
			//create the text-node that will be the actual heading-text of the section...
			var oNode_text_sectionTitleText = document.createTextNode(window.FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_BLANKNEW); //create a proper "text" node for our section heading title text (note: sure, this *could* be done with an innerHTML on the span below, but this is more proper)
			var oNode_span_sectionTitleText = document.createElement("span"); //create a SPAN wrapper node for the text, so it can be packaged up neatly
				oNode_span_sectionTitleText.appendChild(oNode_text_sectionTitleText); //add the just-created text node to its wrapper node
			//create and configure the main LI node...
			var oNode_li = document.createElement("li"); //create the object for a LI node (which is the main guy that should get returned, when completed)
				//oNode_li.setAttribute("id", obj_data.recno_fav); //give it an ID attribute with whatever recno_fav was passed-in
				oNode_li.setAttribute("class", cfg_li_classname); //give it a CLASS attribute with whatever we need to style it as a section-title (defined above)
				//oNode_li.setAttribute("style", cfg_li_style);
				//oNode_li.onclick = handleSubheaderClick; //add a click listener
				oNode_li.appendChild(oNode_span_sectionTitleText); //the title text is an inline element, so we should be alright to just go ahead and add it before any right-floated elements below
			//add that new node to the DOM above the one currently being edited
			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Inserting a new subheader-LI into the DOM, before the current LI...", true);
			oNodeRef_li_subheaderEditing_parent.insertBefore(oNode_li, oNodeRef_li_subheaderEditing);
			//generate new recordset based on what is now in the DOM list
			if(str_contextualListID == objConfig_MajorSection_personalLibs.str_sectionDomID) { //if the list in context is the personal/my-libraries major list, then export from its instance
				FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Requesting updated recordset from the personal-libs major section...", true);
				window.FavScreen.rsEdited = MajorSection_personalLibs.exportListAsYuiRecordset();
				oNodeRef_li_subheaderEditing_parent.insertBefore(MajorSection_personalLibs.generateListItem_noMessagesCell(), oNodeRef_li_subheaderEditing); //generate a no-msgs list-item in the DOM
			}
			else if(str_contextualListID == objConfig_MajorSection_critical.str_sectionDomID) { //if the list in context is the personal/my-libraries major list, then export from its instance
				FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Requesting updated recordset from the critical major section...", true);
				window.FavScreen.rsEdited = MajorSection_critical.exportListAsYuiRecordset();
			}
			else {
				FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Major section does not support saving new subheaders.", true);
				//remove the subheader that was added above
				return false;
			}
			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Saving updated list items...", true);
			window.saveSortedFavRecnosToSMCGI(window.FavScreen.rsEdited);
			cfg.obj_panel.hide(); //simply hide the panel (but must use the YUI panel's hide method here)
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": handleAddNewHeaderButtonClick(): Caught error ("+err.message+").", true);
		}
	}//end function handleAddNewHeaderButtonClick()

	// PUBLIC PROPERTIES...
	this.bool_isInstanceInitialized = false; //initialize flag to publicly indicate whether a particular instance is initialized
 	this.bool_isVisible = false; //initialize flag to publicly indicate whether the list is visible (visibility-style)
	this.cfg = cfg; //publicly expose the provided config object, which was private until now 	(do we really need to?)

	// PUBLIC METHODS...
	//define what to do in order to initialize an instance...
	this.initialize = function() {
		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): Starting...", true);
		if(this.bool_isConstructorLoaded) {
			//initialize YUI instance...
			var myYUI;
			FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): Instantiating YUI Panel & IO...", true);
			YUI().use("panel", "recordset", "io", "io-base", "io-form", function(Y) {

				//setup YUI-IO response-handling specific stuff...
				var objResponse;
				var handleStart = function(ioId, o){
					FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-IO: Starting.", true);
				};
				var handleSuccess = function(ioId, o) {
					var rt = o.responseText;
					FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-IO: Success. Analyzing server-response...", true);
				};
				var handleFailure = function(ioId, o) {
					var rt = o.responseText;
					FavScreen.log("warn", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-IO: Failure.", true);
					FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-IO: Response-text = '"+rt+"'.", true);
				};
				
				//configure a YUI-IO config object that will be common to any action taken from the panel...
				var obj_cfg_yuiIO = {
					on: {
						start: handleStart,
						success: handleSuccess,
						failure: handleFailure
						},
					method: "POST",
					form: {id: "form_editHeader"}, //parse the form field with this ID value (refer to generatePanelBody)
					headers: {"Content-Type":"application/x-www-form-urlencoded"},
					sync: true, //NOTE: important to be synchronous! (otherwise we won't be able to investigate the response for success or not)
					timeout: 10000
					};//end YUI-IO config object
				FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-IO: Configured timeout will be "+obj_cfg_yuiIO.timeout+"ms.", true);
				
				//use YUI-Panel to generate a panel for us...
				var objPanel = new Y.Panel({
					id: cfg.str_panelDomID,
					width: "90%",
					maxWidth: "90%",
					zIndex: 5,
					centered: true,
					modal: true,
					visible: false,
					render: true,
					buttons: [
						{	value: "Delete",
							section: Y.WidgetStdMod.FOOTER,
							classNames: "btndelete",
							action: function(e) {
								e.preventDefault();
								FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: User clicked 'Delete' button.", true);
								//set whatever panel form field values need to be set
								document.getElementById("fld_position").value = FAVS_DELETED_FLAG + FAVS_POSITION_DELINEATE_TYPE +"00000"+ FAVS_POSITION_DELINEATE_COORD +"00000"+ FAVS_POSITION_DELINEATE_COORD +"00000";
								//cfg.obj_panel.bodyNode.getById("fld_position").getDOMNode().value = FAVS_DELETED_FLAG + FAVS_POSITION_DELINEATE_TYPE +"00000"+ FAVS_POSITION_DELINEATE_COORD +"00000"+ FAVS_POSITION_DELINEATE_COORD +"00000";
								objResponse = Y.io(window.CGI_SERVER, obj_cfg_yuiIO);
								if(objResponse.responseText === "true") { //if server responds with explicit "true" string, that means success...
									FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Delete succeeded, hiding panel...", true);
									window.ModalNotification_OK.showFor(1500);
									this.hide(); //simply hide the panel (but must use the YUI panel's native hide method, due to sandboxing effects)
									setTimeout(function(){cfg.objFxn_refreshHandler();}, 1000);
								}
								else { //else some problem...
									FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Delete failed, user can try again.", true);
									window.ModalNotification_GeneralError.showFor(2000);
								}
								}//end action
						},//end Delete button
						{	value: "Save",
							section: Y.WidgetStdMod.FOOTER,
							classNames: "btnsave",
							action: function(e) {
								e.preventDefault();
								FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: User clicked 'Save' button.", true);
								//set whatever panel form field values need to be set
								objResponse = Y.io(window.CGI_SERVER, obj_cfg_yuiIO); //NOTE: the YUI-IO *MUST* be setup to be synchronous for this to work!
								if(objResponse.responseText === "true") { //if server responds with explicit "true" string, that means success...
									FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Save succeeded, hiding panel...", true);
									window.ModalNotification_Saved.showFor(1500);
									this.hide(); //simply hide the panel (but must use the YUI panel's native hide method, due to sandboxing effects)
									setTimeout(function(){cfg.objFxn_refreshHandler();}, 1000);
								}
								else { //else some problem...
									FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Save failed, user can try again.", true);
									window.ModalNotification_GeneralError.showFor(2000);
								}
								}//end action
						},//end Save button
						{	value: "Cancel",
							section: Y.WidgetStdMod.FOOTER,
							classNames: "btncancel",
							action: function(e) {
								e.preventDefault();
								FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: User clicked 'Cancel' button, hiding panel.", true);
								this.hide(); //simply hide the panel (but must use the YUI panel's native hide method, due to sandboxing effects)
								}//end action
						}//end Cancel button
						]//end buttons
					});//end objPanel instantiation

				//define panel event handling...
				objPanel.after("visibleChange", function(e) {
					FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Visibility changed from "+e.prevVal+" to "+e.newVal+".", true);
					});//end panel after-visible-change handler
				objPanel.after("init", function(e) {
					try {
						//populate the panel with content... (need to wrap in a try/catch?)
						FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Generating and setting panel heading & body content...", true);
						this.set("headerContent", generatePanelHeading());
						this.set("bodyContent", generatePanelBody());
						//attach fastclick (what we use to defeat the 300ms touch interface delay)
						FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Attaching FastClick...", true);
						FastClick.attach(cfg.str_panelDomID);
					}
					catch(err) {
						FavScreen.log("info", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: FastClick not attached ("+err.message+").", true);
					}
					FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI-Panel: Now initialized and rendered.", true);
					});//end panel after-init handler

				//hand the YUI Panel back to the class-instance via its config object (since that's the only resource this YUI sandbox can see)
				cfg.obj_panel = objPanel;
				FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): YUI initializations complete. Panel is now ready for action!", true);
				});//end YUI

			this.bool_isInstanceInitialized = true; //explicitly set a public flag for this
			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): Almost done... Panel will be ready for action, momentarily (after YUI initializations complete). Now setting bool_isInstanceInitialized and returning "+this.bool_isInstanceInitialized+".", true);
			return this.bool_isInstanceInitialized;
		}
		else {
			return FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": initialize(): Class prototype not yet loaded (bool_isLoaded = "+this.bool_isLoaded+").", true);
		}
	};//end initialize

	//define how to update the panel with new data...
	this.updatePanelWithNewSubsectionData = function(objMsgData) {
		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updatePanelWithNewSubsectionData(): Starting...", true);
		var ret = false;
		try {
			cfg.obj_panel.set("bodyContent", generatePanelBody(objMsgData)); //replace whatever may be in the panel's body with data from what was passed in through here
			cfg.obj_recordData = objMsgData; //expose the record-data context, so it can be referenced later (e.g. using it as a template to create a new custom subheader)
		}
		catch(err) {
			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": updatePanelWithNewSubsectionData(): Caught error ("+err.message+"). Returning "+ret+".", true);
		}
		return ret;
	};//end updatePanelWithNewSubsectionData()

	//define how to show/make-visible the panel on-screen... (returns the style's value if no errors / returns false if error)
  	this.show = function() {
  		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": show(): Starting...", true);
  		var ret = false;
 		try {
 			this.cfg.obj_panel.show();
 			ret = Boolean(this.cfg.obj_panel.get("visible"));
 			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": show(): Completed. Setting bool_isVisible and returning "+ret+".", true);
 		}
 		catch(err) {
 			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": show(): Caught error ("+err.message+"). Returning "+ret+".", true);
 		}
 		return ret;
  	};//end show

  	//define how to hide/make-invisible the section on-screen... (returns the style's value if no errors / returns false if error)
  	this.hide = function() {
  		FavScreen.log("verbose", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": hide(): Starting...", true);
  		var ret = false;
 		try {
 			this.cfg.obj_panel.hide();
 			ret = Boolean(this.cfg.obj_panel.get("visible"));
 			FavScreen.log("log", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": hide(): Completed. Setting bool_isVisible and returning "+ret+".", true);
 		}
 		catch(err) {
 			FavScreen.log("error", "ClassPanelSubsectionEdit #"+cfg.str_panelDomID+": hide(): Caught error ("+err.message+"). Returning "+ret+".", true);
 		}
 		return ret;
  	};//end hide

	// FINALIZATIONS...
 	this.bool_isConstructorLoaded = true; //flag that this class-constructor is now loaded and ready to instantiate (since this line is at the very end)

}//end function ClassPanelSubsectionEdit()