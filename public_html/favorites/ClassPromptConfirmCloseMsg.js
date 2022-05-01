/*******************************************************************************************
 * ClassPromptConfirmCloseMsg(instanceName)
 *
 *	Provides a user prompt for confirming and closing (or not) of currently-active-toggle messages.
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *
 *	Created November 2014 by Chris Rider (chris.rider81@gmail.com).
 *******************************************************************************************/

function ClassPromptConfirmCloseMsg(instanceName) {

	this.initialized = false;																//initialize a public flag that other code-at-large can reference to tell whether this class has been initialized
	this.clickTargetId = undefined;															//initialize a public reference

	var yuiPanel;																			//initialize a private reference that we'll later instantiate our YUI-Panel into (so other methods in this class can see it)
	var handle_setTimeout = null;															//initialize a private handle for the setTimeout timer, so it can be cleared when they manually hide the panel

	var cfg_radix = 10;																			//specify the radix (number base system) to use for parseInt calls

	YUI().use("panel", function(Y){															//setup a YUI-Panel (the basis for our confirmation prompt)...

		yuiPanel = new Y.Panel({																//instantiate a YUI-Panel, passing it back to our class' private reference...
			id				:  "panelconfirmclosemsg",												//specify the DOM ID to give to the panel
			headerContent	:  null,																//we don't want a header section to show
			bodyContent		:  "<div style='text-align:center; font-size:2em;'>Close Msg?</div>",	//generate the basic body content of the panel
			footerContent	:  null,																//start with a blank footer (we'll add buttons later)
			buttons:[																				//specify what buttons we want for the panel...
				{																						//YES button setup...
				value		: 	"Yes",																		//value of the button
				classNames	: 	"confirmclosemsgbtnyes confirmclosemsgbtn",									//DOM class name(s) of the button (for styling or whatever)
				section		: 	Y.WidgetStdMod.FOOTER,														//tell YUI to put this button in the panel's footer section
				action		: 	function(e){																//define what happens when the button is pressed...
									eval("closeMessage("+instanceName+".clickTargetId,true);");					//re-call the close-msg method, but this time skipping the pre-check stuff since it's already been done (which is how we got here)
									this.hide();																//hide the panel
								}
				},//end yes button
				{																						//NO button setup...
				value		: 	"No",																		//value of the button
				classNames	: 	"confirmclosemsgbtn",														//DOM class name(s) of the button (for styling or whatever)
				section		: 	Y.WidgetStdMod.FOOTER,														//tell YUI to put this button in the panel's footer section
				action		: 	function(e){																//define what happens when the button is pressed...
									this.hide();																//hide the panel
								}
				}//end no button
			],//end button specifications
			width		:  "250px",																	//width of the panel
			zIndex		:  5,																		//z-axis depth of the panel
			centered	:  true,																	//align the panel in the center of the page (container)
			modal		:  true,																	//make the panel modal (where the background is grayed-out)
			visible		:  false,																	//don't make the panel initially visible
			render		:  true																		//render the panel, so it will be ready to show quickly whenever called upon
			});//end panel setup

		yuiPanel.after('init', function(e){														//define what happens after the panel has been initialized...
			eval(instanceName+".initialized = true;");												//set the class' public 'initialized' flag to true
			});//end after-init

		var node_modalMask = document.getElementsByClassName("yui3-widget-mask")[0];			//get a reference to the modal mask (which, of course, is provided whenever a YUI-Panel reders)
		var headerwrapperHeight = document.getElementById("headerwrapper").offsetHeight;		//get the calculated height of the headerwrapper area (including padding, etc.)
		if(!(headerwrapperHeight>0)){headerwrapperHeight=60;}									//if for some reason we didn't get a valid value, then fallback to hard coded assumed height of 60px (this likely will never happen, though)

		yuiPanel.after('visibleChange', function(e){											//define what happens after the panel's visibility changes...
			if(this.get('visible')){																//if the panel is now visible, then...
				node_modalMask.style.display = "block";													//show the modal mask
				node_modalMask.style.top = headerwrapperHeight+"px";									//position the modal mask so that the header area isn't masked
			}else{																					//else the panel is now hidden, so...
				node_modalMask.style.display = "none";													//hide the modal mask
				node_modalMask.style.top = "0px";														//reset the modal mask's original position for masking the entire document
			}
			});//end after-visibleChange

		});//end YUI().use

	/* PRIVATE BOOLEAN cancelAutoHideTimeout() */
	/* Takes care of cancelling any potential auto-hide timeouts that may have been set.
	 *	Returns:
	 *	false	If no setTimeout reference exists to clear.
	 *	true	If a setTimeout reference has been cleared and re-initialized. */
	var cancelAnyAutoHideTimeout = function() {												//define method for cancelling the auto-hide timeout
		if(handle_setTimeout !== null) {														//if an auto-hide timeout has been set...
			clearTimeout(handle_setTimeout);													//clear the timeout referenced by its ID# that's stored in this class' private space (returning the clearTimeout method's result)
			handle_setTimeout = null;																//re-initialize the reference
			return true;
		}
		else {																					//else no auto-hide timeout seems to exist
			return false;
		}
		};//end method definition for cancelAnyAutoHideTimeout()
	
	/* PUBLIC BOOLEAN show() */
	/* Do whatever is necessary to show the YUI-Panel.
		Returns:
		false	Panel did not or could not be shown.
		true	Panel directed to show itself. */
	this.show = function(clickTargetId) {													//define a public class-method for showing the panel
		cancelAnyAutoHideTimeout();																//handle the cancellation of any pending auto-hide
		if(typeof clickTargetId==="undefined") {
			console.log(instanceName+".show method invoked without clickTargetId provided. Aborting.");
			return false;
		}
		else {
			console.log(instanceName+".show method invoked with clickTargetId="+clickTargetId+".");
			this.clickTargetId = clickTargetId;
			yuiPanel.show();
			return true;
		}
		};//end method definition for show()

	this.hide = function(intDelayMs) {														//define method for hiding the panel (with optional timer for doing so)
		console.log(instanceName+".hide method invoked.");
		cancelAnyAutoHideTimeout();																//handle the cancellation of any pending auto-hide
		this.clickTargetId = undefined;															//re-initialize clickTargetId to be safe for future calls to the show method
		if(typeof intDelayMs==="undefined" || isNaN(intDelayMs)){								//if no delay argument was provided or is invalid, go ahead and hide the panel
			yuiPanel.hide();
		}
		else if(parseInt(intDelayMs, cfg_radix) > 50){											//else-if delay argument is substantially long enough to have a chance of doing anything, set it to hide on delay
			handle_setTimeout = setTimeout(	function(){
				yuiPanel.hide();
				}, parseInt(intDelayMs, cfg_radix) );//end setTimeout assignment
		}
		else{												//else all other unforseen cases, just hide it immediately
			yuiPanel.hide();
		}
		};//end method definition for hide()

	this.isVisible = function(){										//define method for determining whether panel is currently showing
		if(yuiPanel.get('visible')) {return true;}							//if the panel is now visible, then return true
		else {return false;}												//else the panel is now hidden, so return false
		};//end method definition for isVisible()

	this.showFor = function(clickTargetId, intTimeoutMs){				//define method for showing for a certain amount of time... clickTargetId required... if 2nd argument provided, it will automatically hide after that amount of time; else, it will show and NOT automatically hide
		if(typeof clickTargetId==="undefined"){
			console.log(instanceName+".showFor method invoked without clickTargetId provided. Aborting");
			return false;
		}else{
			console.log(instanceName+".showFor method invoked. Showing it for "+intTimeoutMs+" milliseconds.");
			if(typeof handle_setTimeout!=="undefined"){clearTimeout(handle_setTimeout);}			//if an auto-timeout hide is active, clear it, since we've essentially cancelled the auto timeout at this point
			this.clickTargetId = clickTargetId;
			var yp;												//declare a variable to store reference to the yuiPanel that gets returned when we call the show method
			if(typeof intTimeoutMs==="number"){								//if time argument was provided...
				yp = yuiPanel.show(clickTargetId);								//show the panel, remembering the yuiPanel reference it returns
				handle_setTimeout = setTimeout( function(){
					yuiPanel.hide();
					}, parseInt(intTimeoutMs, cfg_radix) );//end setTimeout assignment
			}//end if
		}//end else
		return yp;												//method returns handle to the YUI Panel
		};//end method definition for showFor()
}