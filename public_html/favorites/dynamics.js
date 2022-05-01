/*******************************************************************************************
 * dynamics.js
 *
 *	Provides dynamic user-interface support (e.g. changing look of things)
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created March 2015 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		- 2015.03.09 	v1.2.1	Updated file notes (THIS) to include "Notable Updates"
 *		- 2015.04.14	v1.4	Added colorShade function.
 *******************************************************************************************/
var versionInfoForJavascriptFile_dynamics = {
	version : "1.7",
	build : "2015.05.06"
	};


var cfg_className_collapsed = "collapsed"; 			//NOTE: should match whatever we use in the CSS stylesheet!
var cfg_className_expandCollapseIcon = "minmax";	//NOTE: should match whatever class we create the icons with!

var toggleExpandCollapse_contentWrapper = function(e) {
	if(typeof e !== 'object') {
		FavScreen.log('error', "toggleExpandCollapse_contentWrapper(): Event argument required, aborting.", true);
		return false;
	}
	try {
		//get contentwrapper and click-target data from the event, etc.
		var nodeRef_contentWrapper = e.currentTarget.parentNode.parentNode.parentNode;
		var strNodeID = nodeRef_contentWrapper.id;
		var nodeRef_iconClicked = e.target;
		
		//if node is already collapsed then expand it (by removing collapsed class), else apply collapse class to it (by adding collapsed class)
		if(nodeRef_contentWrapper.className.indexOf(cfg_className_collapsed) > -1) {
			nodeRef_contentWrapper.className = nodeRef_contentWrapper.className.replace(cfg_className_collapsed, "");	//replace collapsed class string with nothing (effectively removing it)
			nodeRef_iconClicked.src = FAVS_ICON_MINIMIZE;
		}
		else {
			nodeRef_contentWrapper.className = nodeRef_contentWrapper.className + " " + cfg_className_collapsed;		//add collapsed class string to the node's class list
			nodeRef_iconClicked.src = FAVS_ICON_MAXIMIZE;
		}
		
		//perform any necessary housekeeping on the class value (e.g. too many spaces adding up)
		nodeRef_contentWrapper.className = nodeRef_contentWrapper.className.replace("  ", " ");							//prevent unnecessary extra spaces from adding up
		forceCssRepaint(nodeRef_contentWrapper);

		FavScreen.log('log', "toggleExpandCollapse_contentWrapper(): Class attribute value for '"+strNodeID+"' is now '"+nodeRef_contentWrapper.className+"'.", false);
		return nodeRef_contentWrapper.className;
	}
	catch(err) {
		FavScreen.log('error', "toggleExpandCollapse_contentWrapper(): Caught: '"+err+"'.", false);
		return false;
	}
	};

var toggleExpandCollapse_subsection = function(e) {
	if(typeof e !== 'object') {
		FavScreen.log('error', "toggleExpandCollapse_subsection(): Event argument required, aborting.", true);
		return false;
	}
	try {
		//get container and click-target data from the event, etc.
		var nodeRef_iconClicked = e.currentTarget; //get a reference to the icon that was clicked (since it's what should have had the event listener attached to it)
		var nodeRef_listItem = e.currentTarget.parentNode; //get a reference to the LI node that the clicked-icon resides in
		var nodeRef_ulMessagelist = nodeRef_listItem.parentNode; //get a reference to the UL node that that LI node resides in
		var nodeRef_listContainer = nodeRef_ulMessagelist.parentNode; //get a reference to the container node that that UL node resides in... could be the contentwrapper-DIV (new way) or an LI (old way)

		var strListNodeID = nodeRef_ulMessagelist.getAttribute("id");
		var strListNodeClass = nodeRef_ulMessagelist.getAttribute("class");
		var strListContainerClass = nodeRef_listContainer.getAttribute("class");

		//Note: The original ("old") way was created when we used nested lists (UL in an LI), and was simply a contentwrapper height change.
		//		The "new" way was implemented to work with the new MajorSection class (only LIs in a single UL), and actually sets LI nodes' display style to 'none'.

		//if we're dealing with the newer way of working with subheaders (where we don't nest lists inside list-items)...
		if(strListContainerClass.indexOf("contentwrapper") > -1) { //if this list's container is a contentwrapper-DIV, then we're dealing with the newer way...
			FavScreen.log('verbose', "toggleExpandCollapse_subsection(): Subsection uses newer non-nested method. Will set sibling LI nodes to no-display.", true);
			//construct an array of all list-items that belong to this subsection...
			var arrNodes_siblingLI = []; //initialize an array for containing all nodes that represent members of the subsection (constructed below)
			var node_currentIteration = nodeRef_listItem; //initialize something to keep track of current-node in the loop below... starting with the LI that the icon-clicked resides in (i.e. the subheader)
			while(node_currentIteration !== null) { //as long as there are siblings, try to build an array of nodes
				node_currentIteration = node_currentIteration.nextSibling; //advance the current node iteration to the next sibling
				if(node_currentIteration === null) { //if no next-sibling was found, then we're done
					break;
				}
				if(node_currentIteration.getAttribute("class").indexOf("subsectionheader") > -1) { //if we hit a subsection header, then we're done
					break;
				}
				arrNodes_siblingLI.push(node_currentIteration);
			}
			//note: save aside for more efficient usage later?
			//now, set all LI nodes in the subsection to have a display of none...
			for(var i=0; i<arrNodes_siblingLI.length; i++) {
				if(arrNodes_siblingLI[i].style.display == "") { //if no display value set (implicitly visible / expanded), then hide (collapse) it
					arrNodes_siblingLI[i].style.display = "none";
				}
				else if(arrNodes_siblingLI[i].style.display == "none") { //else show (expand) it
					arrNodes_siblingLI[i].style.display = "";
				}
				else {
					//unexpected
				}
			}//end for
			//finally, modify the icon
			if(nodeRef_iconClicked.src.indexOf(FAVS_ICON_MINIMIZE) > -1) { //if icon is currently the click-to-collapse, change it to the click-to-expand icon
				nodeRef_iconClicked.src = FAVS_ICON_MAXIMIZE;
			}
			else if(nodeRef_iconClicked.src.indexOf(FAVS_ICON_MAXIMIZE) > -1) { //else-if icon is currently click-to-expand, change it to the click-to-collapse icon
				nodeRef_iconClicked.src = FAVS_ICON_MINIMIZE;
			}
			else {
				//unexpected
			}
		}//end if newer, non-nested subsection way
		else { //else we're likely dealing with the older way that involved nested lists...
			FavScreen.log('verbose', "toggleExpandCollapse_subsection(): Subsection uses older nested method. Will simply collapse the LI container.", true);
			//if node is already collapsed then expand it (by removing collapsed class), else apply collapse class to it (by adding collapsed class)
			if(nodeRef_ulMessagelist.className.indexOf(cfg_className_collapsed) > -1) {
				nodeRef_ulMessagelist.className = nodeRef_ulMessagelist.className.replace(cfg_className_collapsed, "");	//replace collapsed class string with nothing (effectively removing it)
				nodeRef_iconClicked.src = FAVS_ICON_MINIMIZE;
			}
			else {
				nodeRef_ulMessagelist.className = nodeRef_ulMessagelist.className + " " + cfg_className_collapsed;		//add collapsed class string to the node's class list
				nodeRef_iconClicked.src = FAVS_ICON_MAXIMIZE;
			}
			//perform any necessary housekeeping on the class value (e.g. too many spaces adding up)
			nodeRef_ulMessagelist.className = nodeRef_ulMessagelist.className.replace("  ", " ");							//prevent unnecessary extra spaces from adding up
			forceCssRepaint(nodeRef_ulMessagelist);
			FavScreen.log('log', "toggleExpandCollapse_subsection(): Class attribute value for '"+strListNodeID+"' is now '"+nodeRef_ulMessagelist.className+"'.", false);
			return nodeRef_ulMessagelist.className;
		}//end else older, nested subsection way
	}
	catch(err) {
		FavScreen.log('error', "toggleExpandCollapse_subsection(): Caught: '"+err+"'.", true);
		return false;
	}
	};

function expandContainer(strNodeID) {
	if(typeof strNodeID === 'undefined') {
		FavScreen.log('error', "expandContainer(): Node DOM-ID argument required, aborting.", true);
		return false;
	}
	try {
		//get references
		var nodeRef_container = document.getElementById(strNodeID);
		var nodeRef_relatedIcon = nodeRef_container.getElementsByClassName(cfg_className_expandCollapseIcon)[0];	//get the first expand/collapse icon we come to in the container's children (should be related to the container)

		//if node is collapsed, then remove that class so it can naturally be expanded... else, don't need to do anything
		if(nodeRef_container.className.indexOf(cfg_className_collapsed) > -1) {
			nodeRef_container.className = nodeRef_container.className.replace(cfg_className_collapsed, "");			//remove the 'collapsed' class
			nodeRef_relatedIcon.src = FAVS_ICON_MINIMIZE;															//update the expand/collapse headericon to 'minimize'
		}
		else {
			FavScreen.log('log', "expandContainer(): Already expanded, no need to do anything.", false);
		}

		//perform any necessary housekeeping on the class value (e.g. too many spaces adding up)
		nodeRef_container.className = nodeRef_container.className.replace("  ", " ");							//prevent unnecessary extra spaces from adding up
		forceCssRepaint(nodeRef_container);

		FavScreen.log('log', "expandContainer(): Class attribute value for '"+strNodeID+"' is now '"+nodeRef_container.className+"'.", false);
		return nodeRef_container.className;
	}
	catch(err) {
		FavScreen.log('error', "expandContainer(): Caught: '"+err+"'.", false);
		return false;
	}
}

function collapseContainer(strNodeID, boolForceLibraries) {
	if(typeof strNodeID === 'undefined') {
		FavScreen.log('error', "collapseContainer(): Node DOM-ID argument required, aborting.", true);
		return false;
	}
	try {
		//handle force-libraries option (unless this is explicitly true, this routine will not collapse a library in edit-mode if it happens to be owned by a current LIB user, so that they may edit it)
		boolForceLibraries = Boolean(boolForceLibraries);

		if( (strNodeID.indexOf("contentwrapper-libraries") > -1) && (FavScreen.get('attrInteractionMode') === MODE_EDITABLE) && (Boolean(anyLibraryIsOwnedBy(CURRENT_USER_PIN))) ){
			FavScreen.log('log', "collapseContainer(): Edit-mode and current user appears to own a library, aborting library-section collapse.", false);
			return false;
		}

		//get references
		var nodeRef_container = document.getElementById(strNodeID);
		var nodeRef_relatedIcon = nodeRef_container.getElementsByClassName(cfg_className_expandCollapseIcon)[0];	//get the first expand/collapse icon we come to in the container's children (should be related to the container)

		//if node is NOT collapsed, then remove that class so it can naturally be expanded... else, don't need to do anything
		if(nodeRef_container.className.indexOf(cfg_className_collapsed) <= -1) {
			nodeRef_container.className = nodeRef_container.className + " " + cfg_className_collapsed;				//add the 'collapsed' class
			nodeRef_container.offsetHeight;																			//help ensure that css reflows
			nodeRef_relatedIcon.src = FAVS_ICON_MAXIMIZE;															//update the expand/collapse headericon to 'maximize'
		}
		else {
			FavScreen.log('log', "collapseContainer(): Already collapsed, no need to do anything.", false);
		}

		//perform any necessary housekeeping on the class value (e.g. too many spaces adding up)
		nodeRef_container.className = nodeRef_container.className.replace("  ", " ");							//prevent unnecessary extra spaces from adding up
		forceCssRepaint(nodeRef_container);

		FavScreen.log('log', "collapseContainer(): Class attribute value for '"+strNodeID+"' is now '"+nodeRef_container.className+"'.", false);
		return nodeRef_container.className;
	}
	catch(err) {
		FavScreen.log('error', "collapseContainer(): Caught: '"+err+"'.", false);
		return false;
	}
}

/**********************************************************************************************************************************************
 * colorShade (String hex, Float lum)
 *
 * 	Calculates different shades of a color
 *	NOTE: This works, but may not be as accurate as the newer colorShade_brightness routine.
 * 
 *	USAGE EXAMPLES:
 *		colorShade("#69c", 0);		//returns "#6699cc"
 *		colorShade("6699CC", 0.2);	//returns "#7ab8f5" (20% lighter)
 *		colorShade("69C", -0.5);	//returns "#334d66" (50% darker)
 *		colorShade("000", 1);		//returns "#000000" (true black cannot be made lighter!)
 *
 *	HISTORY:
 *		- 2015.04.14	v1.0 	Created.
 *
 **********************************************************************************************************************************************/
function colorShade(str_hex, float_lum) {
	//validate hex string argument
	str_hex = String(str_hex).replace(/[^0-9a-f]/gi, '');
	if (str_hex.length < 6) { //if in 3-digit format, expand to 6 digit
		str_hex = str_hex[0]+str_hex[0]+str_hex[1]+str_hex[1]+str_hex[2]+str_hex[2];
	}
	//validate luminance argument
	float_lum = float_lum || 0;
	//convert to decimal and change luminosity
	var str_rgb = "#",
		c,
		i;
	for (i = 0; i < 3; i++) {
		c = parseInt(str_hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * float_lum)), 255)).toString(16);
		str_rgb += ("00"+c).substr(c.length);
	}
	return str_rgb;
}

/**********************************************************************************************************************************************
 * colorShade_brightness (String color, Float percent)
 *
 * 	Calculates different brightnesses of a color.
 *	NOTE: Range of brightness is a floating point number between -1 and 1 (positive is lighter, negative is darker).
 *
 *	CREDIT: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 * 
 *	USAGE EXAMPLES:
 *		colorShade_brightness("cccccc", 0);		//returns "cccccc"
 *		colorShade_brightness("000000", 1);		//returns "ffffff" (100% lighter)
 *		colorShade_brightness("ffffff", -1);	//returns "000000" (100% darker)
 *
 *	HISTORY:
 *		- 2015.05.05	v1.0 	Created.
 *		- 2015.05.06	v1.0 	Commented and explained what's happening.
 *
 **********************************************************************************************************************************************/
function colorShade_brightness(color, percent) {   
	var f = parseInt(color.slice(1),16);	//parse an integer equivalent of the hex value (stripping out the "#" symbol, of course)
	var t = percent<0?0:255;				//if percent is negative, use 0 ("00"), else use 255 ("ff")
	var p = percent<0?percent*-1:percent;	//get the absolute value, so we're not dealing with negatives
	var R = f>>16;							//bitwise-shift parsed-hex value 16 bits to the right (this leaves us with only the red channel's value, as excess bits are discarded)
	var G = f>>8&0x00FF;					//bitwise-shift parsed-hex value 8 bits to the right, after the first (red) channel (this leaves us with just the green channel's value)
	var B = f&0x0000FF;						//finally get the blue channel's value, using bitwise AND
	return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

/**********************************************************************************************************************************************
 * color_HexToRGB (String hexValue)
 *
 * 	Converts a string hex-color value into and returns an array of RGB color channel values.
 * 
 *	USAGE EXAMPLES:
 *		color_HexToRGB("#00ff00");	//returns [0, 255, 0]
 *
 *	HISTORY:
 *		- 2015.05.06	v1.0 	Created.
 *
 **********************************************************************************************************************************************/
function color_HexToRGB(str_hexColor) {
	str_hexColor = String(str_hexColor).replace(/[^0-9a-f]/gi, ''); //strip out any "#" character that may exist
	var f = parseInt(str_hexColor, 16);	//parse an integer equivalent of the hex value
	var R = f>>16;						//bitwise-shift parsed-hex value 16 bits to the right (this leaves us with only the red channel's value, as excess bits are discarded)
	var G = f>>8&0x00FF;				//bitwise-shift parsed-hex value 8 bits to the right, after the first (red) channel (this leaves us with just the green channel's value)
	var B = f&0x0000FF;					//finally get the blue channel's value, using bitwise AND
	return [R,G,B];
}

/**********************************************************************************************************************************************
 * color_RGBtoHex (Array RGBcolorChannelValues)
 *
 * 	Converts an array of RGB color channel values into and returns a string hex-color value.
 * 
 *	USAGE EXAMPLES:
 *		color_RGBtoHex([0, 255, 0]);	//returns "#00ff00"
 *
 *	HISTORY:
 *		- 2015.05.06	v1.0 	Created.
 *
 **********************************************************************************************************************************************/
function color_RGBtoHex(arr_colorValues) {
	arr_colorValues[0] = parseInt(arr_colorValues[0], 10);
	arr_colorValues[1] = parseInt(arr_colorValues[1], 10);
	arr_colorValues[2] = parseInt(arr_colorValues[2], 10);
	return "#" + ((1 << 24) + (arr_colorValues[0] << 16) + (arr_colorValues[1] << 8) + arr_colorValues[2]).toString(16).slice(1);
}

/**********************************************************************************************************************************************
 * color_RGBtoHSV (Array RGBcolorChannelValues)
 *
 * 	Converts an array of RGB color channel values into an array of HSV.
 * 
 *	USAGE EXAMPLES:
 *		color_RGBtoHSV([128, 255, 128]);	//returns [120, 0.498..., 255]
 *
 *	HISTORY:
 *		- 2015.05.06	v1.0 	Created.
 *
 **********************************************************************************************************************************************/
function color_RGBtoHSV(arr_colorValues) {
	var r,g,b,h,s,v;
	r= arr_colorValues[0];
	g= arr_colorValues[1];
	b= arr_colorValues[2];
	min = Math.min( r, g, b );
	max = Math.max( r, g, b );
	v = max;
	delta = max - min;
	if( max != 0 )
		s = delta / max;	// s
	else {
		// r = g = b = 0	// s = 0, v is undefined
		s = 0;
		h = -1;
		return [h, s, undefined];
	}
	if( r === max )
		h = ( g - b ) / delta;      // between yellow & magenta
	else if( g === max )
		h = 2 + ( b - r ) / delta;  // between cyan & yellow
	else
		h = 4 + ( r - g ) / delta;  // between magenta & cyan
	h *= 60;						// degrees
	if( h < 0 )
		h += 360;
	if ( isNaN(h) )
		h = 0;

	return [h,s,v];
}

/**********************************************************************************************************************************************
 * color_HSVtoRGB (Array HSVvalues)
 *
 * 	Converts an array of HSV values into an array of RGB color channel values.
 * 
 *	USAGE EXAMPLES:
 *		color_HSVtoRGB([120, 0.498, 255]);	//returns [128, 255, 128]
 *
 *	HISTORY:
 *		- 2015.05.06	v1.0 	Created.
 *
 **********************************************************************************************************************************************/
function color_HSVtoRGB(arr_colorValues) {
	var i;
	var h,s,v,r,g,b;
	h= arr_colorValues[0];
	s= arr_colorValues[1];
	v= arr_colorValues[2];
	if(s === 0 ) {
	    // achromatic (grey)
	    r = g = b = v;
	    return [r,g,b];
	}
	h /= 60;	    // sector 0 to 5
	i = Math.floor( h );
	f = h - i;	  // factorial part of h
	p = v * ( 1 - s );
	q = v * ( 1 - s * f );
	t = v * ( 1 - s * ( 1 - f ) );
	switch( i ) {
	    case 0:
			r = v;
			g = t;
			b = p;
			break;
	    case 1:
			r = q;
			g = v;
			b = p;
			break;
	    case 2:
			r = p;
			g = v;
			b = t;
			break;
	    case 3:
			r = p;
			g = q;
			b = v;
			break;
	    case 4:
			r = t;
			g = p;
			b = v;
			break;
	    default:	// case 5:
			r = v;
			g = p;
			b = q;
			break;
	}
	return [r,g,b];
}