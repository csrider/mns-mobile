#!/bin/bash


lessc --clean-css /mnt/vmsrc/public_html/css/smcgi_favorites.css > /tmp/smcgi_favorites.min.css

mv -f /tmp/smcgi_favorites.min.css /mnt/vmsrc/public_html/css/smcgi_favorites.min.css
