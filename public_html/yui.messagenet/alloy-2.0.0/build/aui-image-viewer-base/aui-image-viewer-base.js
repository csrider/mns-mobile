YUI.add('aui-image-viewer-base', function (A, NAME) {

/**
 * The ImageViewer Utility
 *
 * @module aui-image-viewer
 * @submodule aui-image-viewer-base
 */

var L = A.Lang,
    isBoolean = L.isBoolean,
    isNumber = L.isNumber,
    isObject = L.isObject,
    isString = L.isString,

    NodeFx = A.Plugin.NodeFX,

    DOC = A.config.doc,

    ANIM = 'anim',
    AUTO = 'auto',
    BD = 'bd',
    BLANK = 'blank',
    BODY = 'body',
    BOUNDING_BOX = 'boundingBox',
    CAPTION = 'caption',
    CAPTION_EL = 'captionEl',
    CAPTION_FROM_TITLE = 'captionFromTitle',
    CAROUSEL = 'carousel',
    CENTERED = 'centered',
    CLOSE = 'close',
    CLOSE_EL = 'closeEl',
    CONTROL = 'control',
    CONTROL_LEFT_EL = 'controlLeftEl',
    CONTROL_RIGHT_EL = 'controlRightEl',
    CREATE_DOCUMENT_FRAGMENT = 'createDocumentFragment',
    CURRENT_INDEX = 'currentIndex',
    EASE_BOTH_STRONG = 'easeBothStrong',
    FOOTER = 'footer',
    HELPER = 'helper',
    HIDDEN = 'hidden',
    HIDE = 'hide',
    HREF = 'href',
    ICON = 'icon',
    IMAGE = 'image',
    IMAGE_ANIM = 'imageAnim',
    IMAGE_VIEWER = 'image-viewer',
    INFO = 'info',
    INFO_EL = 'infoEl',
    INFO_TEMPLATE = 'infoTemplate',
    LEFT = 'left',
    LINK = 'link',
    LINKS = 'links',
    LOADER = 'loader',
    LOADING = 'loading',
    LOADING_EL = 'loadingEl',
    LOCK = 'lock',
    MAX_HEIGHT = 'maxHeight',
    MAX_WIDTH = 'maxWidth',
    MODAL = 'modal',
    OFFSET_HEIGHT = 'offsetHeight',
    OFFSET_WIDTH = 'offsetWidth',
    OPACITY = 'opacity',
    OVERLAY = 'overlay',
    PRELOAD_ALL_IMAGES = 'preloadAllImages',
    PRELOAD_NEIGHBOR_IMAGES = 'preloadNeighborImages',
    PX = 'px',
    REGION = 'region',
    RIGHT = 'right',
    SCROLL = 'scroll',
    SHOW = 'show',
    SHOW_CLOSE = 'showClose',
    SHOW_CONTROLS = 'showControls',
    SPACE = ' ',
    SRC = 'src',
    TIME = 'time',
    TITLE = 'title',
    TOP = 'top',
    TOTAL_LINKS = 'totalLinks',
    VIEWPORT_REGION = 'viewportRegion',
    VISIBLE = 'visible',
    WELL = 'well',
    OWNER_DOCUMENT = 'ownerDocument',

    isNodeList = function(v) {
        return (v instanceof A.NodeList);
    },

    concat = function() {
        return Array.prototype.slice.call(arguments).join(SPACE);
    },

    getCN = A.getClassName,

    CSS_CAROUSEL_CONTROL = getCN(CAROUSEL, CONTROL),
    CSS_CLOSE = getCN(CLOSE),
    CSS_HELPER_SCROLL_LOCK = getCN(HELPER, SCROLL, LOCK),
    CSS_HIDE = getCN(HIDE),
    CSS_ICON_TIME = getCN(ICON, TIME),
    CSS_IMAGE_VIEWER_BD = getCN(IMAGE_VIEWER, BD),
    CSS_IMAGE_VIEWER_CAPTION = getCN(IMAGE_VIEWER, CAPTION),
    CSS_IMAGE_VIEWER_CLOSE = getCN(IMAGE_VIEWER, CLOSE),
    CSS_IMAGE_VIEWER_CONTROL = getCN(IMAGE_VIEWER, CONTROL),
    CSS_IMAGE_VIEWER_IMAGE = getCN(IMAGE_VIEWER, IMAGE),
    CSS_IMAGE_VIEWER_INFO = getCN(IMAGE_VIEWER, INFO),
    CSS_IMAGE_VIEWER_LINK = getCN(IMAGE_VIEWER, LINK),
    CSS_IMAGE_VIEWER_LOADER = getCN(IMAGE_VIEWER, LOADER),
    CSS_IMAGE_VIEWER_LOADING = getCN(IMAGE_VIEWER, LOADING),
    CSS_LEFT = getCN(LEFT),
    CSS_RIGHT = getCN(RIGHT),
    CSS_WELL = getCN(WELL),

    KEY_ESC = 'ESC',
    KEY_LEFT = 'LEFT',
    KEY_RIGHT = 'RIGHT',

    MAP_RESET_DIMENSIONS = {
        height: AUTO,
        width: AUTO
    },

    NODE_BLANK_TEXT = DOC.createTextNode(''),

    INFO_LABEL_TEMPLATE = 'Image {current} of {total}',

    TPL_CAPTION = '<h4 class="' + CSS_IMAGE_VIEWER_CAPTION + '"></h4>',
    TPL_CLOSE = '<button class="' + concat(CSS_IMAGE_VIEWER_CLOSE, CSS_CLOSE) + '" type="button">??</button>',
    TPL_CONTROL_LEFT = '<a href="#" class="' + concat(CSS_IMAGE_VIEWER_CONTROL, CSS_CAROUSEL_CONTROL, CSS_LEFT) +
        '">&lsaquo;</a>',
    TPL_CONTROL_RIGHT = '<a href="#" class="' + concat(CSS_IMAGE_VIEWER_CONTROL, CSS_CAROUSEL_CONTROL, CSS_RIGHT) +
        '">&rsaquo;</a>',
    TPL_IMAGE = '<img class="' + CSS_IMAGE_VIEWER_IMAGE + '" />',
    TPL_INFO = '<h5 class="' + CSS_IMAGE_VIEWER_INFO + '"></h5>',
    TPL_LOADER = '<div class="' + CSS_IMAGE_VIEWER_LOADER + '"></div>',
    TPL_LOADING = '<div class="' + CSS_ICON_TIME + '"></div>';

/**
 * A base class for ImageViewer, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Displays an image in a Overlay</li>
 *    <li>Keyboard navigation support</li>
 * </ul>
 *
 * Check the [live demo](http://alloyui.com/examples/image-viewer/).
 *
 * @class A.ImageViewer
 * @extends A.Widget
 * @uses A.WidgetStdMod, A.WidgetPosition, A.WidgetStack, A.WidgetPositionAlign,
 * A.WidgetPositionConstrain, A.WidgetModality
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var ImageViewer = A.Base.create(
    'aui-image-viewer',
    A.Widget, [
        A.WidgetCssClass,
        A.WidgetStdMod,
        A.WidgetToggle,
        A.WidgetPosition,
        A.WidgetStack,
        A.WidgetPositionAlign,
        A.WidgetPositionConstrain,
        A.WidgetModality
    ], {
        /**
         * Handler for the key events.
         *
         * @property _keyHandler
         * @type EventHandler
         * @protected
         */
        _keyHandler: null,

        /**
         * Create the DOM structure for the ImageViewer. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            instance._renderControls();
            instance._renderFooter();

            instance.get(LINKS).addClass(CSS_IMAGE_VIEWER_LINK);
        },

        /**
         * Bind the events on the ImageViewer UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;
            var links = instance.get(LINKS);
            var controlLeftEl = instance.get(CONTROL_LEFT_EL);
            var controlRightEl = instance.get(CONTROL_RIGHT_EL);
            var closeEl = instance.get(CLOSE_EL);

            closeEl.on('click', A.bind(instance._onClickCloseEl, instance));
            controlLeftEl.on('click', A.bind(instance._onClickLeftControl, instance));
            controlRightEl.on('click', A.bind(instance._onClickRightControl, instance));
            links.on('click', A.bind(instance._onClickLinks, instance));

            instance._keyHandler = A.bind(instance._onKeyInteraction, instance);

            // NOTE: using keydown to avoid keyCode bug on IE
            A.getDoc().on('keydown', instance._keyHandler);

            instance.after('render', instance._afterRender);
            instance.after('loadingChange', instance._afterLoadingChange);
            instance.after('visibleChange', instance._afterVisibleChange);
        },

        /**
         * Destructor lifecycle implementation for the ImageViewer class.
         * Purges events attached to the node (and all child nodes).
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this;

            var links = instance.get(LINKS);

            instance.close();

            links.detach('click');
            links.removeClass(CSS_IMAGE_VIEWER_LINK);

            // detach key global listener from the document
            A.getDoc().detach('keydown', instance._keyHandler);

            instance.get(CONTROL_LEFT_EL).remove(true);
            instance.get(CONTROL_RIGHT_EL).remove(true);
            instance.get(CLOSE_EL).remove(true);
            instance.get(LOADER).remove(true);
        },

        /**
         * Close the ImageViewer.
         *
         * @method close
         */
        close: function() {
            var instance = this;

            instance.hide();
        },

        /**
         * Get the Node reference to the <code>currentIndex</code> element from
         * the <a href="ImageViewer.html#config_links">links</a>.
         *
         * @method getLink
         * @param {Number} currentIndex
         * @return {Node}
         */
        getLink: function(currentIndex) {
            var instance = this;

            return instance.get(LINKS).item(currentIndex);
        },

        /**
         * Get the current loaded node link reference.
         *
         * @method getCurrentLink
         * @return {Node}
         */
        getCurrentLink: function() {
            var instance = this;

            return instance.getLink(
                instance.get(CURRENT_INDEX)
            );
        },

        /**
         * Load an image <code>src</code> on the ImageViewer.
         *
         * @method loadImage
         * @param {String} src Image src.
         */
        loadImage: function(src) {
            var instance = this;

            var loader = instance.get(LOADER);

            instance.set(LOADING, true);

            var activeImagePool = instance._activeImagePool;

            if (!activeImagePool) {
                activeImagePool = [];

                // creating the placeholder image
                var placeholder = instance.get(IMAGE);

                var image0 = placeholder.clone();
                var image1 = placeholder.clone();

                // bind the onLoad handler to the image, this handler should append the loaded image
                var onload = A.bind(instance._onLoadImage, instance);

                image0.on('load', onload);
                image1.on('load', onload);

                activeImagePool.push(image0, image1);

                instance._activeImagePool = activeImagePool;
            }

            var image = activeImagePool[0];

            image.removeAttribute('height');
            image.removeAttribute('width');

            image.setStyles(MAP_RESET_DIMENSIONS);

            // append the placeholder image to the loader div
            loader.append(image);

            // re-sort the pool
            activeImagePool.push(activeImagePool.shift(image));

            // set the src of the image to be loaded on the placeholder image.
            // dataURI allows cached images to refire load event in webkit, and bypass
            // the MimeType error (c/o Paul Irish & Doug Jones)
            if (A.UA.webkit) {
                image.attr(SRC, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
            }

            image.attr(SRC, src);

            instance.fire('request', {
                image: image
            });
        },

        /**
         * Check if there is a node reference for the <code>currentIndex</code>.
         *
         * @method hasLink
         * @param {Number} currentIndex
         * @return {Boolean}
         */
        hasLink: function(currentIndex) {
            var instance = this;

            return instance.getLink(currentIndex);
        },

        /**
         * Check if there is a next element to navigate.
         *
         * @method hasNext
         * @return {Boolean}
         */
        hasNext: function() {
            var instance = this;

            return instance.hasLink(
                instance.get(CURRENT_INDEX) + 1
            );
        },

        /**
         * Check if there is a previous element to navigate.
         *
         * @method hasPrev
         * @return {Boolean}
         */
        hasPrev: function() {
            var instance = this;

            return instance.hasLink(
                instance.get(CURRENT_INDEX) - 1
            );
        },

        /**
         * Hide all UI controls (i.e., arrows, close icon etc).
         *
         * @method hideControls
         */
        hideControls: function() {
            var instance = this;

            instance.get(CONTROL_LEFT_EL).hide();
            instance.get(CONTROL_RIGHT_EL).hide();
            instance.get(CLOSE_EL).hide();
        },

        /**
         * Load the next image.
         *
         * @method next
         */
        next: function() {
            var instance = this;

            if (instance.hasNext()) {
                instance.set(
                    CURRENT_INDEX,
                    instance.get(CURRENT_INDEX) + 1
                );

                instance.show();
            }
        },

        /**
         * Preload all images.
         *
         * @method preloadAllImages
         */
        preloadAllImages: function() {
            var instance = this;

            instance.get(LINKS).each(function(link, index) {
                instance.preloadImage(index);
            });
        },

        /**
         * Preload an image based on its <code>index</code>.
         *
         * @method preloadImage
         * @param {Number} currentIndex
         */
        preloadImage: function(currentIndex) {
            var instance = this;
            var link = instance.getLink(currentIndex);

            if (link) {
                var src = link.attr(HREF);

                instance._createPreloadImage(src);
            }
        },

        /**
         * Load the previous image.
         *
         * @method next
         */
        prev: function() {
            var instance = this;

            if (instance.hasPrev()) {
                instance.set(
                    CURRENT_INDEX,
                    instance.get(CURRENT_INDEX) - 1
                );

                instance.show();
            }
        },

        /**
         * Show the loading icon.
         *
         * @method showLoading
         */
        showLoading: function() {
            var instance = this;
            var loadingEl = instance.get(LOADING_EL);

            instance.setStdModContent(BODY, loadingEl);

            loadingEl.center(instance.bodyNode);
        },

        /**
         * Show the ImageViewer UI.
         *
         * @method show
         */
        show: function() {
            var instance = this;
            var currentLink = instance.getCurrentLink();

            if (currentLink) {
                ImageViewer.superclass.show.apply(this, arguments);

                instance.loadImage(
                    currentLink.attr(HREF)
                );
            }
        },

        /**
         * Removes the references to the preload images to free up memory.
         *
         * @method _clearPreloadImageFn
         * @protected
         */
        _clearPreloadImageFn: function() {
            var instance = this;

            var preloadImagePool = instance._preloadImagePool;
            var image;

            for (var i in preloadImagePool) {
                image = preloadImagePool[i];

                if (image && image.complete) {
                    preloadImagePool[i] = null;
                }
            }
        },

        /**
         * Creates the preload image instance, and add's it
         * to the internal pool.
         *
         * @method _createPreloadImage
         * @param src
         * @protected
         */
        _createPreloadImage: function(src) {
            var instance = this;

            var preloadImagePool = instance._preloadImagePool;

            if (!preloadImagePool) {
                preloadImagePool = instance._preloadImagePool = {};

                instance._clearPreloadImageTask = A.debounce(instance._clearPreloadImageFn, 50, instance);
            }

            if (!(src in preloadImagePool)) {
                var image = new Image();

                image.onload = instance._clearPreloadImageTask;
                image.src = src;

                preloadImagePool[src] = image;
            }
        },

        /**
         * Render the controls UI.
         *
         * @method _renderControls
         * @protected
         */
        _renderControls: function() {
            var instance = this;
            var body = A.one(BODY);

            body.append(
                instance.get(CONTROL_LEFT_EL).hide()
            );

            body.append(
                instance.get(CONTROL_RIGHT_EL).hide()
            );

            body.append(
                instance.get(CLOSE_EL).hide()
            );
        },

        /**
         * Render the footer UI.
         *
         * @method _renderFooter
         * @protected
         */
        _renderFooter: function() {
            var instance = this;

            var boundingBox = instance.get(BOUNDING_BOX);

            var docFrag = boundingBox.get(OWNER_DOCUMENT).invoke(CREATE_DOCUMENT_FRAGMENT);

            docFrag.append(
                instance.get(CAPTION_EL)
            );
            docFrag.append(
                instance.get(INFO_EL)
            );

            instance.setStdModContent(
                FOOTER,
                docFrag
            );
        },

        /**
         * Sync the caption UI.
         *
         * @method _syncCaptionUI
         * @protected
         */
        _syncCaptionUI: function() {
            var instance = this;
            var caption = instance.get(CAPTION);
            var captionEl = instance.get(CAPTION_EL);
            var captionFromTitle = instance.get(CAPTION_FROM_TITLE);

            if (captionFromTitle) {
                var currentLink = instance.getCurrentLink();

                if (currentLink) {
                    var title = currentLink.attr(TITLE);

                    if (title) {
                        caption = currentLink.attr(TITLE);
                    }
                }
            }

            captionEl.html(caption);
        },

        /**
         * Sync the controls UI.
         *
         * @method _syncControlsUI
         * @protected
         */
        _syncControlsUI: function() {
            var instance = this;
            var boundingBox = instance.get(BOUNDING_BOX);
            var controlLeftEl = instance.get(CONTROL_LEFT_EL);
            var controlRightEl = instance.get(CONTROL_RIGHT_EL);
            var closeEl = instance.get(CLOSE_EL);

            if (instance.get(VISIBLE)) {
                if (instance.get(SHOW_CONTROLS)) {
                    // get the viewportRegion to centralize the controls on the middle of the window viewport
                    var viewportRegion = boundingBox.get(VIEWPORT_REGION);
                    var heightRegion = Math.floor(viewportRegion.height / 2) + viewportRegion.top;

                    // show or hide controls based on the hasPrev/hasNext information
                    controlLeftEl[instance.hasPrev() ? SHOW : HIDE]();
                    controlRightEl[instance.hasNext() ? SHOW : HIDE]();

                    closeEl.show();
                }
            }
            else {
                // if the overlay is not visible hide all controls
                instance.hideControls();
            }
        },

        /**
         * Sync the ImageViewer UI.
         *
         * @method _syncImageViewerUI
         * @protected
         */
        _syncImageViewerUI: function() {
            var instance = this;

            instance._syncControlsUI();
            instance._syncCaptionUI();
            instance._syncInfoUI();
        },

        /**
         * Sync the info UI.
         *
         * @method _syncInfoUI
         * @protected
         */
        _syncInfoUI: function() {
            var instance = this;
            var infoEl = instance.get(INFO_EL);

            infoEl.html(
                instance.get(INFO_TEMPLATE)
            );
        },

        /**
         * Calculate the resize ratio for the loaded image.
         *
         * @method _getRatio
         * @param {Number} width Image width
         * @param {Number} height Image height
         * @protected
         * @return {Number}
         */
        _getRatio: function(width, height) {
            var instance = this;

            var ratio = 1;
            var maxHeight = instance.get(MAX_HEIGHT);
            var maxWidth = instance.get(MAX_WIDTH);

            if ((height > maxHeight) || (width > maxWidth)) {
                var hRatio = (height / maxHeight);
                var wRatio = (width / maxWidth);

                ratio = Math.max(hRatio, wRatio);
            }

            return ratio;
        },

        /**
         * Get the <a href="ImageViewer.html#config_info">info</a> template.
         *
         * @method _getInfoTemplate
         * @param {String} v template
         * @protected
         * @return {String} Parsed string.
         */
        _getInfoTemplate: function(v) {
            var instance = this;
            var total = instance.get(TOTAL_LINKS);
            var current = instance.get(CURRENT_INDEX) + 1;

            return L.sub(v, {
                current: current,
                total: total
            });
        },

        /**
         * Display the image once it's been loaded.
         *
         * @method _displayLoadedImage
         * @param {Node} image The loaded image
         * @protected
         */
        _displayLoadedImage: function(image) {
            var instance = this;

            instance._uiSetImageSize(image);

            instance.setStdModContent(BODY, image);

            instance.set(LOADING, false);

            instance._syncImageViewerUI();

            // invoke WidgetPosition _setAlignCenter to force center alignment
            instance._setAlignCenter(true);

            instance.fire('load', {
                image: image
            });

            if (instance.get(PRELOAD_NEIGHBOR_IMAGES)) {
                // preload neighbor images
                var currentIndex = instance.get(CURRENT_INDEX);

                instance.preloadImage(currentIndex + 1);
                instance.preloadImage(currentIndex - 1);
            }
        },

        /**
         * Fires after the ImageViewer render phase.
         *
         * @method _afterRender
         * @protected
         */
        _afterRender: function() {
            var instance = this;
            var bodyNode = instance.bodyNode;
            var boundingBox = instance.get(BOUNDING_BOX);

            bodyNode.addClass(CSS_IMAGE_VIEWER_BD);
            boundingBox.addClass(CSS_WELL);

            if (instance.get(PRELOAD_ALL_IMAGES)) {
                instance.preloadAllImages();
            }
        },

        /**
         * Fires after the value of the
         * <a href="ImageViewer.html#config_loading">loading</a> attribute change.
         *
         * @method _afterLoadingChange
         * @param {EventFacade} event
         * @protected
         */
        _afterLoadingChange: function(event) {
            var instance = this;
            var boundingBox = instance.get(BOUNDING_BOX);

            if (event.newVal) {
                boundingBox.addClass(CSS_IMAGE_VIEWER_LOADING);

                instance.showLoading();
            }
            else {
                boundingBox.removeClass(CSS_IMAGE_VIEWER_LOADING);
            }
        },

        /**
         * Fires after the value of the
         * <a href="ImageViewer.html#config_visible">visible</a> attribute change.
         *
         * @method _afterVisibleChange
         * @param {EventFacade} event
         * @protected
         */
        _afterVisibleChange: function(event) {
            var instance = this;

            instance._syncControlsUI();
        },

        /**
         * Fires the click event on the close icon.
         *
         * @method _onClickCloseEl
         * @param {EventFacade} event click event facade
         * @protected
         */
        _onClickCloseEl: function(event) {
            var instance = this;

            instance.close();

            event.halt();
        },

        /**
         * Fires the click event on the left control icon.
         *
         * @method _onClickLeftControl
         * @param {EventFacade} event click event facade
         * @protected
         */
        _onClickLeftControl: function(event) {
            var instance = this;

            instance.prev();

            event.halt();
        },

        /**
         * Fires the click event on the right control icon.
         *
         * @method _onClickRightControl
         * @param {EventFacade} event click event facade
         * @protected
         */
        _onClickRightControl: function(event) {
            var instance = this;

            instance.next();

            event.halt();
        },

        /**
         * Fires the click event on the links.
         *
         * @method _onClickLinks
         * @param {EventFacade} event click event facade
         * @protected
         */
        _onClickLinks: function(event) {
            var instance = this;
            var target = event.currentTarget;

            // set the current currentIndex of the clicked image
            instance.set(
                CURRENT_INDEX,
                instance.get(LINKS).indexOf(target)
            );

            instance.show();

            event.preventDefault();
        },

        /**
         * Handles the key interaction (i.e., next, prev etc).
         *
         * @method _onKeyInteraction
         * @param {EventFacade} event click event facade
         * @protected
         */
        _onKeyInteraction: function(event) {
            var instance = this;

            if (!instance.get(VISIBLE)) {
                return false; // NOTE: return
            }

            if (event.isKey(KEY_LEFT)) {
                instance.prev();
            }
            else if (event.isKey(KEY_RIGHT)) {
                instance.next();
            }
            else if (event.isKey(KEY_ESC)) {
                instance.close();
            }
        },

        /**
         * Fires on a image load.
         *
         * @method _onLoadImage
         * @param {EventFacade} event
         * @protected
         */
        _onLoadImage: function(event) {
            var instance = this;
            var image = event.currentTarget;

            instance._displayLoadedImage(image);

            var imageAnim = instance.get(IMAGE_ANIM);

            if (instance.get(ANIM)) {
                image.setStyle(OPACITY, 0);

                if (!image.fx) {
                    image.plug(NodeFx, imageAnim);
                }

                image.fx.on('end', function(info) {
                    instance.fire('anim', {
                        anim: info,
                        image: image
                    });
                });

                image.fx.stop().run();
            }
        },

        /**
         * Set the size of the image and the overlay respecting the
         * maxHeight/maxWidth ratio.
         *
         * @method _uiSetImageSize
         * @param {HTMLImage} image Image
         * @protected
         */
        _uiSetImageSize: function(image) {
            var instance = this;
            var bodyNode = instance.bodyNode;
            var footerNode = instance.footerNode;
            var imageRegion = image.get(REGION);

            var ratio = instance._getRatio(
                imageRegion.width,
                imageRegion.height
            );

            var height = (imageRegion.height / ratio);
            var width = (imageRegion.width / ratio);

            image.set(OFFSET_HEIGHT, height);
            image.set(OFFSET_WIDTH, width);

            footerNode.setStyle('width', width + PX);

            bodyNode.setStyles({
                height: height + PX,
                width: width + PX
            });
        }
    },

    {
        /**
         * Static property provides a string to identify the class.
         *
         * @property ImageViewer.NAME
         * @type String
         * @static
         */
        NAME: IMAGE_VIEWER,

        /**
         * Static property provides a string to identify the CSS prefix.
         *
         * @property ImageViewer.CSS_PREFIX
         * @type String
         * @static
         */
        CSS_PREFIX: getCN(IMAGE_VIEWER),

        /**
         * Static property used to define the default attribute
         * configuration for the ImageViewer.
         *
         * @property ImageViewer.ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * If <code>true</code> the navigation is animated.
             *
             * @attribute anim
             * @default true
             * @type Boolean
             */
            anim: {
                value: true,
                validator: isBoolean
            },

            /**
             * The content of body.
             *
             * @attribute bodyContent
             * @type String
             */
            bodyContent: {
                value: NODE_BLANK_TEXT
            },

            /**
             * The caption of the displayed image.
             *
             * @attribute caption
             * @default ''
             * @type String
             */
            caption: {
                value: BLANK,
                validator: isString
            },

            /**
             * If <code>true</code> the <a
             * href="ImageViewer.html#config_caption">caption</a> will be pulled
             * from the title DOM attribute.
             *
             * @attribute captionFromTitle
             * @default true
             * @type Boolean
             */
            captionFromTitle: {
                value: true,
                validator: isBoolean
            },

            /**
             * If <code>true</code> the Overlay with the image will be positioned
             * on the center of the viewport.
             *
             * @attribute centered
             * @default true
             * @type Boolean
             */
            centered: {
                value: true
            },

            /**
             * Index of the current image.
             *
             * @attribute currentIndex
             * @default 0
             * @type Number
             */
            currentIndex: {
                value: 0,
                validator: isNumber
            },

            /**
             * Image node element used to load the images.
             *
             * @attribute image
             * @default Generated img element.
             * @readOnly
             * @type Node
             */
            image: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_IMAGE);
                }
            },

            /**
             * Configuration attributes passed to the <a href="Anim.html">Anim</a>
             * class.
             *
             * @attribute imageAnim
             * @default Predefined <a href="Anim.html">Anim</a> configuration.
             * @type Object
             */
            imageAnim: {
                value: {},
                setter: function(value) {
                    return A.merge({
                            to: {
                                opacity: 1
                            },
                            duration: 0.8
                        },
                        value
                    );
                },
                validator: isObject
            },

            /**
             * String template used to display the information.
             *
             * @attribute infoTemplate
             * @default 'Image {current} of {total}'
             * @type String
             */
            infoTemplate: {
                getter: function(v) {
                    return this._getInfoTemplate(v);
                },
                value: INFO_LABEL_TEMPLATE,
                validator: isString
            },

            /**
             * Selector or NodeList containing the links where the ImageViewer
             * extracts the information to generate the thumbnails.
             *
             * @attribute links
             * @type String | NodeList
             */
            links: {
                setter: function(v) {
                    var instance = this;

                    if (isNodeList(v)) {
                        return v;
                    }
                    else if (isString(v)) {
                        return A.all(v);
                    }

                    return new A.NodeList([v]);
                }
            },

            /**
             * Whether the image is during a loading state.
             *
             * @attribute loading
             * @default false
             * @type Boolean
             */
            loading: {
                value: false,
                validator: isBoolean
            },

            /**
             * Displays the modal the viewport. Set to <code>false</code> to
             * disable.
             *
             * @attribute modal
             * @default true
             * @type Boolean
             */
            modal: {
                value: true
            },

            /**
             * Preload all images grabbed from the <a
             * href="ImageViewer.html#config_links">links</a> attribute.
             *
             * @attribute preloadAllImages
             * @default false
             * @type Boolean
             */
            preloadAllImages: {
                value: false,
                validator: isBoolean
            },

            /**
             * Preload the neighbor image (i.e., the previous and next image based
             * on the current load one).
             *
             * @attribute preloadAllImages
             * @default false
             * @type Boolean
             */
            preloadNeighborImages: {
                value: true,
                validator: isBoolean
            },

            /**
             * Show close icon control.
             *
             * @attribute showClose
             * @default true
             * @type Boolean
             */
            showClose: {
                value: true,
                validator: isBoolean
            },

            /**
             * Show the controls.
             *
             * @attribute showControls
             * @default true
             * @type Boolean
             */
            showControls: {
                value: true,
                validator: isBoolean
            },

            /**
             * Specify the tab order of elements.
             *
             * @attribute tabIndex
             * @default null
             * @type Number
             */
            tabIndex: {
                value: null
            },

            /**
             * Helper attribute to get the <code>size</code> of the <a
             * href="ImageViewer.html#config_links">links</a> NodeList.
             *
             * @attribute totalLinks
             * @default true
             * @readOnly
             * @type Boolean
             */
            totalLinks: {
                readOnly: true,
                getter: function(v) {
                    return this.get(LINKS).size();
                }
            },

            /**
             * Determine if the ImageViewer should be visible or not.
             *
             * @attribute visible
             * @default false
             * @type Boolean
             */
            visible: {
                value: false
            },

            /**
             * Specify the stack order of elements.
             *
             * @attribute zIndex
             * @default 3000
             * @type Number
             */
            zIndex: {
                value: 3000,
                validator: isNumber
            },

            /**
             * The element to be used as left control.
             *
             * @attribute controlLeftEl
             * @default Generated HTML div element.
             * @readOnly
             * @type Node
             */
            controlLeftEl: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_CONTROL_LEFT);
                }
            },

            /**
             * The element to be used as right control.
             *
             * @attribute controlRightEl
             * @default Generated HTML div element.
             * @readOnly
             * @type Node
             */
            controlRightEl: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_CONTROL_RIGHT);
                }
            },

            /**
             * The element to be used as caption.
             *
             * @attribute captionEl
             * @default Generated HTML div element.
             * @readOnly
             * @type Node
             */
            captionEl: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_CAPTION);
                }
            },

            /**
             * The element to be used as close.
             *
             * @attribute closeEl
             * @default Generated HTML div element.
             * @readOnly
             * @type Node
             */
            closeEl: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_CLOSE);
                }
            },

            /**
             * The element to be used as info.
             *
             * @attribute infoEl
             * @default Generated HTML div element.
             * @readOnly
             * @type Node
             */
            infoEl: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_INFO);
                }
            },

            /**
             * HTML element to house the <code>img</code> which is being loaded.
             *
             * @attribute loader
             * @default Generated HTML div element.
             * @type Node
             */
            loader: {
                readOnly: true,
                valueFn: function() {
                    return A.Node.create(TPL_LOADER).appendTo(DOC.body);
                }
            },

            /**
             * The element to be used as loading.
             *
             * @attribute loadingEl
             * @default Generated HTML div element.
             * @type Node
             */
            loadingEl: {
                valueFn: function() {
                    return A.Node.create(TPL_LOADING);
                }
            },

            /**
             * The maximum height of the element
             *
             * @attribute maxHeight
             * @default Infinity
             * @type Number
             */
            maxHeight: {
                value: Infinity,
                validator: isNumber
            },

            /**
             * The maximum width of the element
             *
             * @attribute maxWidth
             * @default Infinity
             * @type Number
             */
            maxWidth: {
                value: Infinity,
                validator: isNumber
            }
        }
    }
);

A.ImageViewer = ImageViewer;


}, '2.0.0', {
    "requires": [
        "anim",
        "widget",
        "widget-modality",
        "widget-position",
        "widget-position-align",
        "widget-position-constrain",
        "widget-stack",
        "widget-stdmod",
        "aui-event",
        "aui-node-base",
        "aui-widget-cssclass",
        "aui-widget-toggle"
    ],
    "skinnable": true
});
