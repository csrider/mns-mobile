#!/bin/bash
#
# postinstall.sh 	[-disable_oem] [-update_gifs] [-update_cap]
#
SILENTM_HOME=`cat /etc/silentm/home`
PATH="$PATH:$SILENTM_HOME/bin:"

source $SILENTM_HOME/bin/smfunctions

# Update the system_information folder for server
check_kernel_features

echo "Executing postinstall.sh $COMPANY_ARG $COMPANY"

# 
# make sure all directories are up to date and present
#
ConnectionsDirectories
ConnectionsMotd

##### REDACTED #####

result=`echo 03.14.99 $PREVIOUS_VERSION | awk '$1 >= $2 {print "update"}'`
THIS_VERSION="03.14.99"
 vercomp $THIS_VERSION $PREVIOUS_VERSION		# returns:  0 is '=' / 1 is '>' /  2 is '<'
 case $? in
  0) result="update";;	# =
  1) result="update";;	# >
  2) result="";;		# <
 esac
if [ "$result" = "update" ]
then
	printf "\n"
	printf "===========================================\n"
	printf "03.14.99\n\n"

	# enable favorites via the runtime flag
	echo
	echo Enabling Connections-Mobile...
	if [ -e /etc/silentm/smcgi.diagnostic.level ]; then
		if [ "$(grep -c evolution /etc/silentm/smcgi.diagnostic.level)" = "0" ]; then
			echo -e "LABEL=favorites\n" >> /etc/silentm/smcgi.diagnostic.level
		else
			printf " Already enabled; no runtime label needs to be added.\n"
		fi
	else
		printf " File /etc/silentm/smcgi.diagnostic.level does not exist. Creating it and enabling mobile flag.\n"
		echo -e "LABEL=favorites\n" > /etc/silentm/smcgi.diagnostic.level
		chmod 644 /etc/silentm/smbanner.diagnostic.level
		chown root:root /etc/silentm/smbanner.diagnostic.level
	fi

	##### REDACTED #####
fi

##### REDACTED #####

else
	echo "else"
fi


# Always run these commands (smindex.sh is needed to set permissions for bin files on older systems)
printf "\n"
printf "===========================================\n"
printf "Finishing up\n\n"

echo "Updating GIFS..."
update_gifs
echo "Updating CAP..."
update_cap
echo "Syncing Server Directories..."
sync_server_directories


##### REDACTED #####

