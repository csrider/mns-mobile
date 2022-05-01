/********************************************************************************************************
**	Module:		smcgi_favorites.h
**
**	Author:		Chris Rider
**			Copyright (c) 2013
**	Revisions:
**
*********************************************************************************************************/


/********************************************************************************************************
* DEFINE SYSTEM, VERSION AND BUILD INFORMATION...
-------------------------------------------------------------------------------------------------------*/
//#define FAVS_NAME				"Favorites"				//NOTE: avoid special characters - especially quotes
//#define FAVS_NAME_PLURAL		"Favorites"				//NOTE: avoid special characters - especially quotes
//#define FAVS_NAME_SINGULAR	"Favorite"				//NOTE: avoid special characters - especially quotes
#define FAVS_COMPANY_NAME		"MessageNet"			//NOTE: avoid special characters - especially quotes
#define FAVS_COMPANY_NAME_FULL	"MessageNet Systems"	//NOTE: avoid special characters - especially quotes
#define FAVS_NAMEWITHCO			"MessageNet Connections"//NOTE: avoid special characters - especially quotes
#define FAVS_NAME_FULL			"Connections Mobile"	//NOTE: avoid special characters - especially quotes
#define FAVS_NAME_SHORT			"Connections"			//NOTE: avoid special characters - especially quotes
#define FAVS_NAME_PLURAL		"Connections Messages"	//NOTE: avoid special characters - especially quotes
#define FAVS_NAME_SINGULAR		"Connections Message"	//NOTE: avoid special characters - especially quotes
//#define FAVS_VERSION			"0.50.2-beta"			//Format: major.minor[.revision][-dev-stage]   --Note: this is used by automatic updating notifications in the client
#define FAVS_VERSION			"1.0.0"					//Format: major.minor[.revision][-dev-stage]   --Note: this is used by automatic updating notifications in the client
#define FAVS_BUILD				"20161005"				//Build date[.time] code
#define FAVS_APPLE_APP_CURRENT_VERSION	"1.9.5"			//Our Apple app's currently published/official version
#define FAVS_OBJ_KEY_ARR		"[13, 8, 2, 4, 19, 17, 24, 9, 4, 17, 17, 24, 1, 20, 19, 13, 14, 2, 8, 6, 0, 17]"


/********************************************************************************************************
* Define major items...
-------------------------------------------------------------------------------------------------------*/
#define GET_FAVS_FROM_DATABASE	(1)				//Useful for debugging: set to FALSE-equivalent to generate static test data instead of pulling from the database
//#define FAVS_MAX_ALLOWED	(99999)				//maximum number of favorites allowed in the system
#define FAVS_LOG_LEVEL_CLIENT	(4)				//DRAFT: client (browser) console logging verbosity... 0:off | 1:errors | 2:errors,warnings | 3:errors,warnings,info | 4:all
#define FAVS_LOG_LEVEL_SERVER	(4)				//DRAFT: server logging verbosity... 0:off | 1:errors | 2:errors,warnings | 3:errors,warnings,info | 4:all

#define FAVS_RESTORESAVEDNODE_DELAY	(1500)		//The default time to wait (in milliseconds) before a screen tries to restore a saved node (which is what happens after launching an unresolved msg, closing a msg, etc.)

#define FAVS_SPINNER_DELAY_HIDE 	(800)		//The default minimum time a spinner should wait before hiding (prevents unsightly flashes of spinner)... you may use this in Spinner.hide() calls, if you desire this behavior

#define FAVS_GEOLOCATION_ACCURACY_NOTICE 	(250)		//Number of meters-accuracy to throw a notice
#define FAVS_GEOLOCATION_ACCURACY_WARNING 	(500)		//Number of meters-accuracy to throw a warning
#define FAVS_GEOLOCATION_ACCURACY_CRITICAL 	(1000)		//Number of meters-accuracy considered critical (might be using something other than GPS)

#define FAVS_GEOLOCATION_RANGETHRESHOLD_WIFI_HI	(70)	//Number of meters that would correlate to what might be the upper end of location-services provided location from WiFi SSID data (30 from Google and 60-something from Apple?)

#define FAVS_LIB_USER_STDREPLIES_PIN	"STD REPLY"		//User PIN of the main system's standard reply library user
#define FAVS_LIB_USER_STDMSGS_PIN	"STD MSGS"			//User PIN of the main system's standard messages library user

#define FORCE_CONSOLE_LOGGING_ON	(0)			//Force browser's console-log-output on or not (if true, this will override any .log method calls' console output arguments)

#define FAVS_RECNO_FLAG_CREATE_SUBHEADER_PERSONALMSGS	(-1)	//Flag to use in the recno, to signal smcgi to create a new record (e.g. creating the first "personal msgs" subheader)
#define FAVS_RECNO_FLAG_CREATE_SUBHEADER_BLANKNEW	(-2)		//Flag to use in the recno, to signal smcgi to create a new record (e.g. creating a new, yet to be named subheader)


/********************************************************************************************************
* Define app-store, vendor, etc. information... 
-------------------------------------------------------------------------------------------------------*/
#define FAVS_PLATFORM_HTTPUA_IPHONE		"iPhone"				//Identifying string of text for http user-agent that iPhone devices provide
#define FAVS_PLATFORM_HTTPUA_IPAD		"iPad"					//Identifying string of text for http user-agent that iPad devices provide
#define FAVS_PLATFORM_HTTPUA_IPOD		"iPod"					//Identifying string of text for http user-agent that iPod devices provide
#define FAVS_PLATFORM_HTTPUA_ANDROID	"Android"				//Identifying string of text for http user-agent that Android devices provide
#define FAVS_APPLE_APPSTORE_ID			"*****REDACTED*****"	//Our Apple App Store ID
//#define FAVS_GOOGLE_PLAYSTORE_ID	""
#define FAVS_APP_USERAGENT		"MessageNet Connections Mobile"	//Our custom userAgent string for app-loaded instances (e.g. UIWebView) --WARNING: if you change this, then the app will need to be updated, and vice-versa
#define FAVS_APP_USERAGENT_UUID_START	"uuid/"					//The sequence of characters in the user agent string that signifies the start of our UUID value
#define FAVS_UUID_MAXLENGTH			(37)						//Maximum length (including null terminator) of the UUID string... e.g. "68753A44-4D6F-1226-9C60-0050E4C00067"
#define FAVS_APP_PLATFORM_APPLE		(1)							//An arbitrary label for testing platform
#define FAVS_APP_PLATFORM_ANDROID	(2)							//An arbitrary label for testing platform


/********************************************************************************************************
* Define app/version/features information... (used by various tests throughout the program)
-------------------------------------------------------------------------------------------------------*/
#define FAVS_APP_IOS_VER_UAVERSION 					"1.2"	//The iOS-app version that first supported passing version info via the user-agent string.
#define FAVS_APP_IOS_VER_NATIVEGEOLOC 				"1.6"	//The iOS-app version that first supported native acquisition of geolocation data.
#define FAVS_APP_IOS_VER_CANRELOADDOC 				"1.6"	//The iOS-app version that first supported the ability to reload the document.
#define FAVS_APP_IOS_VER_CANDETECTFOCUS 			"1.7"	//The iOS-app version that first supported detection (and conveyance) of bring-to-foreground.
#define FAVS_APP_IOS_VER_HASJSBRIDGE 				"1.7"	//The iOS-app version that first supported the best-practice ObjC/JavaScript bridge stuff.
#define FAVS_APP_IOS_VER_HASJSBRIDGECANRECEIVE 		"1.8"	//The iOS-app version that first supported the best-practice ObjC/JavaScript bridge stuff, capable of receiving commands sent from JS.
#define FAVS_APP_IOS_VER_CANAUTOUPDATELOCATION		"1.8"	//The iOS-app version that first supported the ability to "push" auto-updated geolocation data to the JavaScript.
#define FAVS_APP_IOS_VER_JSCANCONTROLNATIVESPINNER	"1.9.5"	//The iOS-app version that first supported the ability for the JavaScript to control the native spinner.


/********************************************************************************************************
* Configure the encoding for on-screen positioning of favorite messages...
* Here is how the encoding scheme works: 
* 	- Favorites will either be displayed in a 1-dimensional list or a 2-dimensional grid.
* 	- Each favorite message will store its positional data in a single database field (db_bann->dbb_rec_dtsec, which is a string -- 32bit:11 or 64bit:21 -- see local.h)
* 	- Certain letters will represent special statuses of favorite messages (e.g. unsorted, deleted, etc.), while the numbers represent positional data
* 		"S:NNNNN,NNNNN,NNNNN"	64bit sorted	"[position-type-flag]:[listview-index-Y]:[gridview-index-X],[gridview-index-Y]"  DEV-NOTE: the gridview indices may eventually support pixel-coordinates, but not yet.. just make integer/sequential index, like listview
* 	- UPDATE after v0.44.0-beta...
* 		"S:NNNNN,NNNNN,NNNNN"	64bit sorted	"[position-type-flag]:[1stLevelSortOrder]:[2ndLevelSortOrder],[UNUSED]"  DEV-NOTE: this allows nested sorting under specific other sorted items (e.g. sub-headings)... allows future use of 3rd-level, potentially
* 		Example:	[Personal Libraries Major Heading]	(no position-type-flag, as major sections are basically hard-coded into the HTML document -- e.g. contentwrapper)
* 				[Custom Sub-heading A]			P:00001,00000,00000
* 				[Msg #1 Under Custom Sub-heading A]	P:00001,00001,00000
* 				[Msg #2 Under Custom Sub-heading A]	P:00001,00002,00000
* 				[Custom Sub-heading B]			P:00002,00000,00000
* 				[Msg #1 Under Custom Sub-heading B]	P:00002,00001,00000
* 				[Msg #2 Under Custom Sub-heading B]	P:00002,00002,00000
* 				[Msg #3 Under Custom Sub-heading B]	P:00002,00003,00000
* WARNING: changing these will likely impact any existing favorite-messages in the database!
* WARNING: some numerical values (particularly "...max") dictate array lengths and looping behavior -- ex. the favorites-related routines toward the end of smcgi.c:main() 
-------------------------------------------------------------------------------------------------------*/
#define FAVS_POSITION_DELINEATE_TYPE	":"	//what separates position type flag and position value
#define FAVS_POSITION_DELINEATE_COORD	","	//what separates each position value

#define FAVS_UNSORTED_FLAG			"U"		//unsorted position type flag				NOTE: As of v0.44.0-beta, this is now synonumous with "dropbox"
#define FAVS_UNSORTED_INDEX_A_MIN	(0)		//unsorted's level-A minimum index value
#define FAVS_UNSORTED_INDEX_A_MAX	(99999)	//unsorted's level-A maximum index value	NOTE: this should *NEVER* be more than 5 digits ~~would have to update smcgi.c leading-zeros formatting, if so
#define FAVS_UNSORTED_INDEX_B_MIN	(0)		//unsorted's level-B minimum index value
#define FAVS_UNSORTED_INDEX_B_MAX	(99999)	//unsorted's level-B maximum index value
#define FAVS_UNSORTED_INDEX_C_MIN	(0)		//unsorted's level-C minimum index value
#define FAVS_UNSORTED_INDEX_C_MAX	(99999)	//unsorted's level-C maximum index value

#define FAVS_SORTED_FLAG			"S"		//sorted position type flag			NOTE: As of v0.44.0-beta, this is now synonumous with "critical"
#define FAVS_SORTED_INDEX_A_MIN		(0)		//sorted's level-A minimum index value
#define FAVS_SORTED_INDEX_A_MAX		(99999)	//sorted's level-A maximum index value
#define FAVS_SORTED_INDEX_B_MIN		(0)		//sorted's level-B minimum index value
#define FAVS_SORTED_INDEX_B_MAX		(99999)	//sorted's level-B maximum index value
#define FAVS_SORTED_INDEX_C_MIN		(0)		//sorted's level-C minimum index value
#define FAVS_SORTED_INDEX_C_MAX		(99999)	//sorted's level-C maximum index value

#define FAVS_DELETED_FLAG			"D"		//deleted position type flag
#define FAVS_DELETED_INDEX_A_MIN	(0)		//deleted's level-A minimum index value
#define FAVS_DELETED_INDEX_A_MAX	(99999)	//deleted's level-A maximum index value
#define FAVS_DELETED_INDEX_B_MIN	(0)		//deleted's level-B minimum index value
#define FAVS_DELETED_INDEX_B_MAX	(99999)	//deleted's level-B maximum index value
#define FAVS_DELETED_INDEX_C_MIN	(0)		//deleted's level-C minimum index value
#define FAVS_DELETED_INDEX_C_MAX	(99999)	//deleted's level-C maximum index value

#define FAVS_REMOVED_FLAG			"D"		//removed's position-type-flag

#define FAVS_ERROR_FLAG				"E"		//error position type flag

#define FAVS_LIBRARY_FLAG			"L"		//shared/system library's position-type-flag

#define FAVS_LIBRARY_PERSONAL_FLAG	"P"		//personal library's position-type-flag


/********************************************************************************************************
* Define strings and similar constants... 
-------------------------------------------------------------------------------------------------------*/
#define FAVS_FAVNAME_MAXLENGTH			(24)	// The maximum allowable length of a favorite's name (label1) (we limit this, primarily, to keep things looking nice - especially in grid view). The database actually allows up to 69 (70 w/null-character).
#define FAVS_MAXRECORDSTOSHOW_INBOX		(25)	// The maximum number of inbox records to show at a time (helps keep network traffic light and the loading snappy)

#define FAVS_DEFAULT_NOFAVSTODISPLAYHTML					"(no msgs)"			// HTML or text to display on-screen if no favorites exist (note: it's possible this can be overridden by other logic)
#define FAVS_SECTION_TITLE_CRITICAL							"Critical Msgs."
#define FAVS_SECTION_TITLE_INBOX							"InBox"
#define FAVS_SECTION_TITLE_DROPBOX							"DropBox"
#define FAVS_SECTION_TITLE_SHARED_LIBRARIES					"Shared Libraries"
#define FAVS_SECTION_TITLE_PERSONAL_LIBRARIES				"My Libraries"		// The text for the entire personal libraries major section, as a whole
#define FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_FIRST		"Personal Msgs."	// The text for the default personal library subheader (note: they may later change this once it's populated into the initial record)
#define FAVS_SECTION_TITLE_PERSONAL_LIB_DEFAULT_BLANKNEW	"[edit to rename]"	// The default text for any newly-added personal library subheader (note: they may later change this once it's populated into the new record)
#define FAVS_SECTION_TITLE_REMOVED							"Removed"

#define FAVS_MINIMUM_EXPECTED_MAJORSECTIONS	(3)	// The minimum number of ClassMajorSection instances expected (this will be used in an initial-load test to determine whether all sections have loaded properly).. update if adding/removing major section instances!


/********************************************************************************************************
* Define confirm-before-send types... 
-------------------------------------------------------------------------------------------------------*/
#define FAVS_CONFIRMSEND_NONE			(0)		//confirm sending on nothing
#define FAVS_CONFIRMSEND_PHONE			(1)		//confirm sending on phone only
#define FAVS_CONFIRMSEND_TABLET			(2)		//confirm sending on tablet only
#define FAVS_CONFIRMSEND_PHONETABLET	(3)		//confirm sending on phone and tablet
#define FAVS_CONFIRMSEND_PC				(4)		//confirm sending on PC only
#define FAVS_CONFIRMSEND_PHONEPC		(5)		//confirm sending on phone and PC
#define FAVS_CONFIRMSEND_TABLETPC		(6)		//confirm sending on tablet and PC
#define FAVS_CONFIRMSEND_ALL			(7)		//confirm sending on phone, tablet and pc


/********************************************************************************************************
* Define icons and favorite-item things... 
-------------------------------------------------------------------------------------------------------*/
#define FAVS_ICON_UPARROW				"coded/go-up-4.png"			// Up arrow icon - Located under "icons/32x32/" in the cgi_icons path
#define FAVS_ICON_DRAGHANDLE			"coded/drag_handle_red.png"	// Drag handle icon - Located under "icons/32x32/" in the cgi_icons path
#define FAVS_DEFAULT_UNSORTED_ICON_FILE	"coded/media-record-5.png"	// Default favorite icon for unsorted favorites - Located under "icons/32x32/" in the cgi_icons path
#define FAVS_DEFAULT_SORTED_ICON_FILE	"coded/media-record-5.png"	// Default favorite icon for sorted favorites that have no specific icon chosen - Located under "icons/32x32/" in the cgi_icons path
#define FAVS_ICON_DEFAULT				"coded/window-close.png"	// Default favorite icon used whenever we can't determine what icon it should have (error condition) - Located under "icons/32x32/" in the cgi_icons path
#define FAVS_ICON_TOGGLE_CLOSE			"coded/stop2.png"			// Icon to use for toggle feature

#define FAVS_ICON_REFRESH			"coded/refresh32.png"
#define FAVS_ICON_REPLY				"coded/replyarrow32.png"
#define FAVS_ICON_CLOSE_X			"coded/winClose_simpleSemiTransOnTrans.png"	//semi-transparent black "X" on transparent background
#define FAVS_ICON_MAXIMIZE			"coded/maximize.png"
#define FAVS_ICON_MINIMIZE			"coded/minimize.png"

#define FAVS_ICON_ARROW_WHITE_DOUBLE_HARD_UP	"coded/whitearrow_doublehard_up.png"	// These are for the CSS-mask method (which isn't friendly toward older browsers, as of 2015/1Q)...
#define FAVS_ICON_ARROW_WHITE_DOUBLE_HARD_DOWN	"coded/whitearrow_doublehard_down.png"
#define FAVS_ICON_ARROW_WHITE_SINGLE_HARD_UP	"coded/whitearrow_singlehard_up.png"
#define FAVS_ICON_ARROW_WHITE_SINGLE_HARD_DOWN	"coded/whitearrow_singlehard_down.png"
#define FAVS_ICON_ARROW_WHITE_SINGLE_UP			"coded/whitearrow_single_up.png"
#define FAVS_ICON_ARROW_WHITE_SINGLE_DOWN		"coded/whitearrow_single_down.png"

#define FAVS_ICON_JUMP_UP_PAGE_WHITE		"coded/jumpNavIcons/jumpPageUpWhite.png"	// These are for the plain-old static-image method...
#define FAVS_ICON_JUMP_UP_PAGE_GREEN		"coded/jumpNavIcons/jumpPageUpGreen.png"
#define FAVS_ICON_JUMP_UP_PAGE_YELLOW		"coded/jumpNavIcons/jumpPageUpYellow.png"
#define FAVS_ICON_JUMP_DOWN_PAGE_WHITE		"coded/jumpNavIcons/jumpPageDownWhite.png"
#define FAVS_ICON_JUMP_DOWN_PAGE_GREEN		"coded/jumpNavIcons/jumpPageDownGreen.png"
#define FAVS_ICON_JUMP_DOWN_PAGE_YELLOW		"coded/jumpNavIcons/jumpPageDownYellow.png"
#define FAVS_ICON_JUMP_UP_MINORSEC_GREEN	"coded/jumpNavIcons/jumpMinorSectionUpGreen.png"
#define FAVS_ICON_JUMP_UP_MINORSEC_YELLOW	"coded/jumpNavIcons/jumpMinorSectionUpYellow.png"
#define FAVS_ICON_JUMP_DOWN_MINORSEC_GREEN	"coded/jumpNavIcons/jumpMinorSectionDownGreen.png"
#define FAVS_ICON_JUMP_DOWN_MINORSEC_YELLOW	"coded/jumpNavIcons/jumpMinorSectionDownYellow.png"
#define FAVS_ICON_JUMP_UP_MAJORSEC_GREEN	"coded/jumpNavIcons/jumpMajorSectionUpGreen.png"
#define FAVS_ICON_JUMP_UP_MAJORSEC_YELLOW	"coded/jumpNavIcons/jumpMajorSectionUpYellow.png"
#define FAVS_ICON_JUMP_DOWN_MAJORSEC_GREEN	"coded/jumpNavIcons/jumpMajorSectionDownGreen.png"
#define FAVS_ICON_JUMP_DOWN_MAJORSEC_YELLOW	"coded/jumpNavIcons/jumpMajorSectionDownYellow.png"

#define FAVS_MINI_SPINNER	"coded/miniSpinner.gif"

#define FAVS_DEFAULT_UNSORTED_DESCRIPTION	"&nbsp;"	// Used for specifying what string gets shown for new/unsorted favorites' description if a message template description doesn't exist


/********************************************************************************************************
* Define response codes... (primarily useful for server response/requests... for server->client communication)
* 	Syntax:  FRC:[semi-arbitrary numerical code]:[short description]  
-------------------------------------------------------------------------------------------------------*/
#define FAVS_RESPONSE_CODE_DELIM				":"						// Delimiter character for separating internal components of a response code (should match what you use in the strings below)
#define FAVS_RESPONSE_CODE_DELIM_MULTIPLEFRC	","						// Delimiter character for separating multiple response codes (should match what you use at the end of the strings below)
#define FAVS_RESPONSE_CODE_TEMPLATE				"FRC:Code:Description,"

#define FAVS_RESPONSE_CODE_NOACTION					"FRC:100:No action taken,"
#define FAVS_RESPONSE_CODE_PROCESSING				"FRC:110:Processing,"
#define FAVS_RESPONSE_CODE_PROCESSING_START			"FRC:111:Started processing request,"
#define FAVS_RESPONSE_CODE_PROCESSING_STILL			"FRC:112:Still processing request,"
#define FAVS_RESPONSE_CODE_FINISHED					"FRC:150:Finished,"								// Generally finished with some routine or process
#define FAVS_RESPONSE_CODE_FINISHED_UNKNOWN			"FRC:151:Finished but with unknown result,"		// Finished, but it's not known whether something was actually done or not
#define FAVS_RESPONSE_CODE_FINISHED_STUFFDONE		"FRC:152:Finished with stuff actually done,"	// Finished and with stuff actually done
#define FAVS_RESPONSE_CODE_FINISHED_STUFFNOTDONE	"FRC:153:Finished but stuff not actually done,"	// Finished, but with stuff not actually done
#define FAVS_RESPONSE_CODE_FINISHED_WARN			"FRC:160:Finished but with some warning(s),"	// Finished, but with some warning(s)
#define FAVS_RESPONSE_CODE_FINISHED_ERROR			"FRC:170:Finished but with some error(s),"		// Finished, but with some error(s)

#define FAVS_RESPONSE_CODE_SUCCESSFUL			"FRC:200:Success,"									// General success
#define FAVS_RESPONSE_CODE_SUCCESSFUL_ADDNEW	"FRC:201:Successfully created new favorite,"		// Successfully created new favorite message
#define FAVS_RESPONSE_CODE_SUCCESSFUL_UPDATE	"FRC:202:Successfully updated existing favorite,"	// Successfully updated an existing favorite message
#define FAVS_RESPONSE_CODE_SUCCESSFUL_ATTRSET	"FRC:250:Successfully set attribute value,"			// Successfully performed a set method on an attribute value

#define FAVS_RESPONSE_CODE_NONEFOUND			"FRC:400:None found,"					// General not-found (for any resource)
#define FAVS_RESPONSE_CODE_NONEFOUND_SORTED		"FRC:401:No sorted favorites found,"	// No sorted favorites found
#define FAVS_RESPONSE_CODE_NONEFOUND_UNSORTED	"FRC:402:No unsorted favorites found,"	// No unsorted favorites found
#define FAVS_RESPONSE_CODE_NONEFOUND_DELETED	"FRC:403:No deleted favorites found,"	// No deleted favorites found
#define FAVS_RESPONSE_CODE_NONEFOUND_LIBUSERS	"FRC:404:No LIB users found,"			// No library class users found
//#define FAVS_RESPONSE_CODE_NONEFOUND_LIBMSGS	"FRC:405:No LIB messages found,"		// No library messages found
#define FAVS_RESPONSE_CODE_NONEFOUND_INBOXMSGS	"FRC:410:No inbox messages found,"		// No inbox messages found
#define FAVS_RESPONSE_CODE_NOTFOUND_SPECIFIED	"FRC:420:Specified record not found,"	// Specific record not found

#define FAVS_RESPONSE_CODE_ERROR						"FRC:500:Error,"							// General error (typically more technical, hard, and generalized server-side stuff)
#define FAVS_RESPONSE_CODE_ERROR_ADD					"FRC:501:Error creating favorite,"
#define FAVS_RESPONSE_CODE_ERROR_UPDATE					"FRC:502:Error updating favorite,"
#define FAVS_RESPONSE_CODE_ERROR_DELETE					"FRC:503:Error deleting favorite,"
#define FAVS_RESPONSE_CODE_ERROR_AUTH					"FRC:510:Authentication error,"				// General authentication error
#define FAVS_RESPONSE_CODE_ERROR_AUTH_TIMEOUT			"FRC:511:Authentication timed-out,"			// Authentication timed-out
#define FAVS_RESPONSE_CODE_ERROR_AUTH_EXPIRED			"FRC:512:Authentication expired,"			// Authentication expired
#define FAVS_RESPONSE_CODE_ERROR_DB						"FRC:520:Error with database,"				// (some action based stuff)
#define FAVS_RESPONSE_CODE_ERROR_DB_SETCUR				"FRC:521:Error setting database currency,"
#define FAVS_RESPONSE_CODE_ERROR_DB_READ				"FRC:522:Error reading from database,"
#define FAVS_RESPONSE_CODE_ERROR_DB_WRITE				"FRC:523:Error writing to database,"
#define FAVS_RESPONSE_CODE_ERROR_DB_LOGIC				"FRC:530:Error in database logic,"			// (some logical kind of stuff)
#define FAVS_RESPONSE_CODE_ERROR_DB_LOGIC_UNEXPECTED	"FRC:531:Unexpected data in database,"
#define FAVS_RESPONSE_CODE_ERROR_FM						"FRC:540:Form data error,"
#define FAVS_RESPONSE_CODE_ERROR_FM_POST				"FRC:541:Form data posted error,"
#define FAVS_RESPONSE_CODE_ERROR_LAUNCH					"FRC:550:Error launching message,"			// General error launching a message
#define FAVS_RESPONSE_CODE_ERROR_LAUNCH_UNAVAILABLE		"FRC:555:Error launching message because unavailable,"	// General error launching a message due to it being unavailable (e.g. couldn't set banner currency of launch record or something)
#define FAVS_RESPONSE_CODE_ERROR_ATTRSET				"FRC:570:Error setting attribute value,"	// Error with setting or updating an attribute's value

#define FAVS_RESPONSE_CODE_ERROR_INVALID_DATA		"FRC:600:Error due to invalid data,"			// Error due to invalid data
#define FAVS_RESPONSE_CODE_ERROR_INVALID_COMMAND	"FRC:601:Error due to invalid command,"			// Error due to invalid command


/********************************************************************************************************
* Prototype these function that can be used anywhere 
-------------------------------------------------------------------------------------------------------*/
extern void add_js_function_isLoadedInMobileApp(void);
extern void add_js_function_isLoadedInMobileApp_fprintf(FILE *fp);
extern void add_js_function_isLoadedOnMobilePlatform_fprintf(FILE *fp);
extern void add_js_function_doHttpRequest_post_fprintf(FILE *fp);
extern void add_js_function_doHttpRequest_post_printf();
extern void add_js_function_doHttpRequest_async_post_printf();

extern int isLoadedInMobileApp(void);
extern int mobileAppPlatform(void);
extern char *versionOfMobileApp(char *httpUserAgent);
extern float versionNumberOfMobilApp();
extern int isLoadedOnMobileDevice(void);

extern int addActiveCopyRecnoToFavTemplate(DBRECORD favRecno, DBRECORD recnoToAdd, UCHAR toggleDuration_raw, long msgDuration_raw, long toggleDuration_translated);
extern int saveSingleActiveCopyRecnoToFavTemplate(DBRECORD favRecno, DBRECORD recnoToAdd, UCHAR toggleDuration_raw, long msgDuration_raw, long toggleDuration_translated);

extern int add_new_favorite_message_from_http_post(void);
extern int add_new_favorite_message_from_arguments(char *userPin, char *position, char *label1);

extern void construct_favorites_main(int withFullSystem);
extern void construct_favorites_installApp(void);
extern void construct_favorites_noLoginAvailable(void);
