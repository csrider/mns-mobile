/*******************************************************************************************
 * navigation.js
 *
 *	Provides functions and methods for navigating throughout a page or site (including jumping).
 *	
 *	Requires:
 *		Instantiation from within the Connections Mobile ("Favorites") framework - including its stylesheets and all.
 *		Pre-initialized YUI3 (Yahoo! User Interface) framework.
 *		The entire base document (smlist) to be loaded first. (this should just happen as-is, because inline JS is loaded before external JS)
 *
 *	Created December 2014 by Chris Rider (chris.rider81@gmail.com).
 *******************************************************************************************/

// Global configuration items


// Define the sublist/section nodes
var cfg_contentwrapperClassName = "contentwrapper";		/* the DOM class name of content wrapper nodes (what actually contain the sections' msg-content) */
var cfg_anchorClassName = "sectionAnchor";				/* the DOM class name of section headers' anchor nodes (what's used as the target for jumps) */

var arrSections = [										/* specify and configure the actual sections */
	{	order : 0,											/* specify the visual order on the page of this section (e.g. 0 is top, 1 is below that, etc.) */
		expanded : true,									/* specify whether this section should be expanded by default */
		jump : {											/* configure jump behavior for this section... */
			enabled : true										/* specify whether this section should participate in the jumping scheme */
			},
		anchor : {
			nodeID : "bodywrapperTopAnchor",
			nodeName : "bodywrapperTopAnchor",
			nodeClass : cfg_anchorClassName
			},
		content : {
			nodeID : "contentwrapper-sorted",
			nodeClass : cfg_contentwrapperClassName
			}
	}

	];//end arrSections


// Handle jumping to the next section, whichever it might be (configured within)
function jumpToNextSection() {
}//end function