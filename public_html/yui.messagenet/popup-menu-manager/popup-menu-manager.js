var isModuleLoaded_popupmenumanager = true;

YUI().add('popup-menu-manager', function(Y) {
        function PopupMenuManager(config) {
                PopupMenuManager.superclass.constructor.apply(this, arguments);
        }
        PopupMenuManager.NAME = "popupMenuManager";
        PopupMenuManager.ATTRS = {
                menuStyles : {
                        value : {
                                'background' : '#eee',
                                'border' : '1px solid black',
                                'padding' : '2px',
                                'position' : 'absolute',
                                'zIndex' : '998',
                                'display' : 'none',
				'list-style-type' : 'none'
                        }
                },
                customClass : {
                        value: false
                },
                liBackgroundUnselected : {
                        value: '#eee'
                },
                liBackgroundSelected : {
                        value: '#ccc'
                },
                items : {
                        value: false
                }
        };
        Y.extend(PopupMenuManager, Y.Widget, {
                initializer: function(config) {
                        this.bodyClick = null;
                        this.active = false;
                        this.selected = -1;
                },
                destructor: function() {
                        // this.menu.remove(true);
                        this.bodyClick.detach();
                },
                loadMenu: function(items) {
                        var i, pieces = [];
                        for (i = 0; i < items.length; i++) {
                                if (items[i].hasOwnProperty('label')) {
                                        pieces.push('<LI tag="' + i + '">' + items[i].label + '</LI>');
                                } else {
                                        pieces.push('<hr />');
                                }
                        }
                        this.menu.set('innerHTML',pieces.join(''));
                },
                renderUI: function() {
                        this.menu = Y.Node.create('<UL tabindex="-1"></UL>');
                        this.get('contentBox').append(this.menu);
                        this.menu.setStyles(this.get('menuStyles'));
                        var cc = this.get('customClass');
                        if (cc) this.menu.addClass(cc);

                        // You must reload the items here since they may have been set
                        // in the config or prior to the render() call.
                        var items = this.get('items');
                        if (items) this.loadMenu(items);
                },
                closeMenu: function(sel) {
                        this.menu.setStyle('display', 'none');
                        this.active = false;
                        if (sel >= 0) {
                                var o = this.get('items')[sel];
                                // If the given function is provided by the window object, such as alert(),
                                // the following line works in IE 8 but not Firefox 14.0.1 (Windows) or Safari 5.1.7 on OS X.
                                // TODO provide a context pointer for each menu item?
                                // o.func(o.data);

                                var f = o.func;
                                var x = o.data;
                                f(x);
                        }
                },
                showSelect: function() {
                        this.menu.all('li').setStyle('background',this.get('liBackgroundUnselected'));
                        if (this.selected >= 0) {
                                var sel = this.menu.one('li[tag="' + this.selected + '"]');
                                sel.setStyle('background',this.get('liBackgroundSelected'));
                        }
                },
                tagForEvent: function(e) {
                        return parseInt(e.target.getAttribute('tag'),10);
                },
                bindUI: function() {
                        this.menu.on('keydown', function(e) {
                                // Y.one('.footer').set('innerHTML', 'e.keyCode = ' + e.keyCode );
                                switch (e.keyCode) {
                                        case 38:        // arrow up
                                                while (true) {
                                                        // skip over separator lines
                                                        this.selected -= 1;
                                                        if (this.selected < 0) break;
                                                        if (items[this.selected].hasOwnProperty('label')) break;
                                                }
                                                if (this.selected < 0) this.selected = this.get('items').length-1;
                                                this.showSelect();
                                                break;
                                        case 40:        // arrow down
                                                while (true) {
                                                        // skip over separator lines
                                                        this.selected += 1;
                                                        if (this.selected >= items.length) break;
                                                        if (items[this.selected].hasOwnProperty('label')) break;
                                                }
                                                if (this.selected >= this.get('items').length) this.selected = 0;
                                                this.showSelect();
                                                break;
                                        case 32:        // space
                                        case 13:        // enter
                                                this.closeMenu(this.selected);
                                                break;
                                        case 27:        // escape
                                                this.closeMenu(-1);
                                                break;
                                }
                                e.preventDefault();
                        }, this);
                        this.menu.delegate('mouseenter', function(e) {
                                e.target.setStyle('background', '#ccc');
                                this.selected = this.tagForEvent(e);
                        }, 'li', this);
                        this.menu.delegate('mouseleave', function(e) {
                                e.target.setStyle('background', '#eee');
                                var tag = this.tagForEvent(e);
                                if (tag == this.selected) this.selected = -1;
                        }, 'li', this);
                        this.menu.delegate('click', function(e) {
                                this.closeMenu(this.tagForEvent(e));
                        }, 'li', this);
                        this.bodyClick = Y.one('body').on('click', function(e) {
                                if (this.active) {
                                        var xlo = this.menu.getX();
                                        var ylo = this.menu.getY();
                                        var xhi = xlo + this.menu.get('offsetWidth');
                                        var yhi = ylo + this.menu.get('offsetHeight');
                                        if (e.pageX < xlo || e.pageY < ylo || e.pageX >= xhi || e.pageY >= yhi) {
                                                this.closeMenu(-1);
                                        }
                                }
                        }, this);
                        this.after('itemsChange', function(e) {
                                this.loadMenu(e.newVal);
                        }, this);
                },
                runMenu: function(e) {

			/* CR - Enable removing other context menus whenever another one is opened elsewhere on the page
			* NOTE! when you create a PopupMenuManager object, you must provide a custom class of "contextMenu"
			* example:  'customClass' : 'contextMenu'  */
			var othermenus = Y.all('.contextMenu');		//this is why the above comment is important and true
			othermenus.setStyle('display', 'none');

                        this.selected = -1;
                        this.showSelect();

                        var V = this.menu.get('viewportRegion');

                        this.menu.setStyle('display','block');
                        this.active = true;

                        var x = e.pageX;
                        var y = e.pageY;
                        var w = this.menu.get('offsetWidth');
                        var h = this.menu.get('offsetHeight');


                        if (x + w > V.right) {
                                x = V.right - w;
                                if (x < V.left) x = V.left;
                        }
                        if (y + h > V.bottom) {
                                y = V.bottom - h;
                                if (y < V.top) y = V.top;
                        }
                        this.menu.setXY([x,y]);
                        this.menu.focus();
                }
        });

        Y.namespace('TaffySoft').PopupMenuManager = PopupMenuManager;
}, "1.0", { requires: ['widget', 'node', 'event', 'event-contextmenu'] });
