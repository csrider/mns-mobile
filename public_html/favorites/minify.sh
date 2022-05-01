#!/bin/bash


#lessc --clean-css /mnt/vmsrc/public_html/css/smcgi_favorites.css > /tmp/smcgi_favorites.min.css
echo "Manual Example:  yui-compressor --nomunge --preserve-semi --type js -o menu.min.js menu.js"

#mv -f /tmp/smcgi_favorites.min.css /mnt/vmsrc/public_html/css/smcgi_favorites.min.css


echo "Running YUI Compressor on script-defined JS files..."

#yui-compressor --nomunge --preserve-semi --type js -o .min.js .js

#yui-compressor --nomunge --preserve-semi --type js -o ClassPromptConfirmCloseMsg.min.js ClassPromptConfirmCloseMsg.js
#yui-compressor --nomunge --preserve-semi --type js -o ClassServerIO.min.js ClassServerIO.js
yui-compressor --nomunge --preserve-semi --type js -o dialogs.min.js dialogs.js
yui-compressor --nomunge --preserve-semi --type js -o dynamics.min.js dynamics.js
yui-compressor --nomunge --preserve-semi --type js -o fastclick.min.js fastclick.js
yui-compressor --nomunge --preserve-semi --type js -o favscreen.min.js favscreen.js
yui-compressor --nomunge --preserve-semi --type js -o integ.min.js integ.js
yui-compressor --nomunge --preserve-semi --type js -o menu.min.js menu.js
yui-compressor --nomunge --preserve-semi --type js -o nativeAppSupport.min.js nativeAppSupport.js
#yui-compressor --nomunge --preserve-semi --type js -o navigation.min.js navigation.js
yui-compressor --nomunge --preserve-semi --type js -o secur.min.js secur.js
yui-compressor --nomunge --preserve-semi --type js -o winDoc.min.js winDoc.js
yui-compressor --nomunge --preserve-semi --type js -o zoom.min.js zoom.js

echo "Finished."
