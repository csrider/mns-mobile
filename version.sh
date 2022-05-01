#!/bin/sh
#
# version.sh
#
SILENTM_HOME=`cat /etc/[REDACTED]`
TARBUILD=$SILENTM_HOME/Versions

if [ $(ls -l /bin/sh | grep -c dash) -eq 1 ]
then
        # pure posix shells (e.g. dash on ubuntu) don't like the bash-specific source keyword
        . $SILENTM_HOME/bin/smfunctions
else
        # bash on centos is fine with source
        source $SILENTM_HOME/bin/smfunctions
fi

release=`grep SILENT_MESSENGER_BUILD $SILENTM_HOME/src/smrev.h | cut -d ' ' -f 7`

yui_clean_for_release()
	{
	# The following commands will take YUI's build directory from 39MB to 16MB:
	echo Clean YUI files
	find ../public_html/javascripts/yui/build -name "*-coverage.js" -print0 | xargs -0 rm 2> /dev/null
	find ../public_html/javascripts/yui/build -name "*-debug.js" -print0 | xargs -0 rm 2> /dev/null

	# remove the non "*-min.js" files
	echo Clean YUI files leaving min.js files
	# cannot do this one as it removes widget-base.css and there is no widget-base-min.css
	# find ../public_html/javascripts/yui/build -not -name "*-min.js" -print0 | xargs -0 rm 2> /dev/null

	# Then, you could completely delete the following (cuts out ~31MB):
	echo Clean YUI directories
	rm -rf /home/silentm/public_html/javascripts/yui/docs 2> /dev/null
	rm -rf /home/silentm/public_html/javascripts/yui/tests 2> /dev/null
	rm -rf /home/silentm/public_html/javascripts/yui/releasenotes 2> /dev/null

	# A special note about the "api" subdirectory... I removed it and tested on my dev environment, and everything still works. I'm now fairly certain that it is just the API documentation, and is safe to remove for production. And it really is worth considering for deletion, since it's the largest aspect (at 157MB)!
	rm -rf /home/silentm/public_html/javascripts/yui/api 2> /dev/null
	}

yui_clean_for_release

##### REDACTED #####

# remove debugging symbols from executables

##### REDACTED #####

strip ../bin/smtwitter

##### REDACTED #####

strip ../bin/smajax

cd /

chgrp_and_owner silentm silentm home/silentm/bin/smajax

##### REDACTED #####

chgrp_and_owner root root "home/silentm/bin/*.def"
chmod 644 home/silentm/bin/*.def

echo Tarring /home/silentm/bin

##### REDACTED #####

tar -rpvf $TARBUILD/silentm.tar home/silentm/bin/smtwitter

##### REDACTED #####

# adding the self extractor tools
tar -rpvf $TARBUILD/silentm.tar home/silentm/bin/unzipsfx.exe

# MessageNet
chown silentm /home/silentm/public_html/bin/*.cgi
chgrp silentm /home/silentm/public_html/bin/*.cgi
chmod 744     /home/silentm/public_html/bin/*.cgi

##### REDACTED #####

# Prepare the gifs
chmod 644 home/silentm/public_html/gifs/*.gif home/silentm/public_html/gifs/*.JPG home/silentm/public_html/gifs/*.jpg home/silentm/public_html/gifs/*.png home/silentm/public_html/gifs/*.ico
chmod 644 home/silentm/public_html/gifs.original/*.gif home/silentm/public_html/gifs.original/*.JPG home/silentm/public_html/gifs.original/*.jpg home/silentm/public_html/gifs.original/*.png /home/silentm/public_html/gifs.original/*.ico
chgrp_and_owner silentm silentm "home/silentm/public_html/gifs/*.gif home/silentm/public_html/gifs/*.JPG home/silentm/public_html/gifs/*.jpg home/silentm/public_html/gifs/*.png home/silentm/public_html/gifs/*.ico"
chgrp_and_owner silentm silentm "home/silentm/public_html/gifs.original/*.gif home/silentm/public_html/gifs.original/*.JPG home/silentm/public_html/gifs.original/*.jpg home/silentm/public_html/gifs.original/*.png home/silentm/public_html/gifs.original/*.ico"

##### REDACTED #####

tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/gifs.original/favicon.ico
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/gifs.original/icons

##### REDACTED #####

# Include the help files
chmod 644 home/silentm/public_html/*.js home/silentm/public_html/*.css home/silentm/public_html/*.htm home/silentm/public_html/*.html

##### REDACTED #####

chgrp_and_owner silentm silentm "home/silentm/public_html/*.js"
chgrp_and_owner silentm silentm "home/silentm/public_html/*.css"
chgrp_and_owner silentm silentm "home/silentm/public_html/*.htm"
chgrp_and_owner silentm silentm "home/silentm/public_html/*.html"
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/css/smcgi_favorites.min.css

##### REDACTED #####

chown -R silentm /home/silentm/public_html/javascripts
chgrp -R silentm /home/silentm/public_html/javascripts
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/context_menu.js
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/excanvas.js
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/modalbox
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/favorites
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/yui
tar -rpvf $TARBUILD/silentm.tar home/silentm/public_html/javascripts/yui.messagenet

##### REDACTED #####

cd $TARBUILD

##### REDACTED #####

gzip -v silentm.tar

if [ -e /etc/redhat-release ] 
then
	if [ "`uname -a | grep x86_64`" = "" ]
	then
		BUILD_TYPE="i386"
	else
		BUILD_TYPE="x86_64"
	fi

	# This is also in rpm.sh
	RHVERSION1=`cat /etc/redhat-release | cut -f 1 -d ' '`
	if [ "$RHVERSION1" = "CentOS" ] 
	then
		# Example: CentOS release 4.0 (Final)
		RHVERSION2=""
		RHVERSION3=$MN_OS
	else
		# Example: Red Hat Linux release 7.3 (Valhalla)
		RHVERSION2=`cat /etc/redhat-release | cut -f 2 -d ' ' | cut -f 1 -d '.'`
		RHVERSION3=`cat /etc/redhat-release | cut -f 5 -d ' ' | cut -f 1 -d '.'`
	fi

	mv silentm.tar.gz sm1.$release/$RHVERSION1$RHVERSION2.$RHVERSION3.silentm.$release.$BUILD_TYPE.tgz

	##### REDACTED #####
else
	mv silentm.tar.gz sm1.$release/silentm.$release.tgz

	##### REDACTED #####
fi

cd ../src
