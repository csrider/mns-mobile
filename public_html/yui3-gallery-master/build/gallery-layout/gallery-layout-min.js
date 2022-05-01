YUI.add("gallery-layout",function(e,t){"use strict";function n(){n.superclass.constructor.apply(this,arguments)}function a(){this.viewport={w:0,h:0,bcw:0};var t=e.one(this.get("body")).get("children"),i=t.filter("."+n.page_header_class);if(i.size()>1)throw Error("There must be at most one div with class "+n.page_header_class);this.header_container=i.isEmpty()?null:i.item(0),i=t.filter("."+n.page_body_class);if(i.size()!=1)throw Error("There must be exactly one div with class "+n.page_body_class);this.body_container=i.item(0),this.body_horiz_mbp=this.body_container.horizMarginBorderPadding(),this.body_vert_mbp=this.body_container.vertMarginBorderPadding();var s=this.body_container.get("className").match(r);s&&s.length&&this.set("mode",n[s[0]]),i=t.filter("."+n.page_footer_class);if(i.size()>1)throw Error("There must be at most one div with class "+n.page_footer_class);this.footer_container=i.isEmpty()?null:i.item(0),e.one(e.config.win).on("resize",h,this),l.call(this),c.call(this),this.rescanBody(),this.after("modeChange",function(){l.call(this),this.body_container&&(this.body_container.scrollTop=0),c.call(this),h.call(this)}),this.after("minWidthChange",h),this.after("minHeightChange",h),this.after("stickyFooterChange",function(){c.call(this),h.call(this)}),this.after("matchColumnHeightsChange",h)}function f(t,r){var i=e.map(t,function(e){if(e.hasClass(n.not_managed_class))return n.unmanaged_size;var t=e.get("className").match(r);return t&&t.length?parseInt(t[1],10):0}),s=e.reduce(i,[0,0],function(e,t){return t>0?e[0]+=t:t===0&&e[1]++,e}),o=s[0],u=s[1];if(u>0){var a=Math.max((100-o)/u,10);i=e.map(i,function(e){return e===0?a:e}),o=e.reduce(i,0,function(e,t,n){return t<0?e:e+t})}return e.map(i,function(e){return e>0?e*(100/o):e})}function l(){this.body_container.replaceClass("FIT_TO_(VIEWPORT|CONTENT)",this.get("mode")===n.FIT_TO_VIEWPORT?"FIT_TO_VIEWPORT":"FIT_TO_CONTENT")}function c(){if(!this.footer_container)return;this.get("mode")===n.FIT_TO_VIEWPORT||this.get("stickyFooter")?this.body_container.get("parentNode").insertBefore(this.footer_container,this.body_container.next(function(e){return e.get("tagName")!="SCRIPT"})):this.body_container.appendChild(this.footer_container)}function h(){if(!this.layout_plugin||!this.body_container)return;var t=this.single_module?e.PageLayout.FIT_TO_VIEWPORT:this.get("mode"),n=this.get("stickyFooter");this.body_container.setStyle("overflowX",t===e.PageLayout.FIT_TO_CONTENT?"auto":"hidden"),this.body_container.setStyle("overflowY",t===e.PageLayout.FIT_TO_CONTENT?"scroll":"hidden");var r={w:e.DOM.winWidth(),h:e.DOM.winHeight()},i=arguments[0]&&arguments[0].type=="resize";if(i&&r.w===this.viewport.w&&r.h===this.viewport.h)return;this.viewport=r,this.fire("beforeReflow"),d.call(this);var s=e.Node.emToPx(this.get("minWidth")),o=Math.max(this.viewport.w,s);this.header_container&&this.header_container.setStyle("width",o+"px"),this.body_container.setStyle("width",o-this.body_horiz_mbp+"px"),this.footer_container&&this.footer_container.setStyle("width",n?o+"px":"auto"),o=this.body_container.get("clientWidth")-this.body_horiz_mbp,this.viewport.bcw=this.body_container.get("clientWidth");var u=this.viewport.h,a=e.Node.emToPx(this.get("minHeight"));t===e.PageLayout.FIT_TO_VIEWPORT&&u<a?(u=a,e.one(document.documentElement).setStyle("overflowY","auto")):(!window.console||!window.console.layout_force_viewport_scrollbars)&&e.one(document.documentElement).setStyle("overflowY","hidden"),this.header_container&&(u-=this.header_container.get("offsetHeight")),this.footer_container&&(t===e.PageLayout.FIT_TO_VIEWPORT||n)&&(u-=this.footer_container.get("offsetHeight"));if(t===e.PageLayout.FIT_TO_VIEWPORT)var f=u-this.body_vert_mbp;else u<0&&(u=10+this.body_vert_mbp);this.body_container.setStyle("height",u-this.body_vert_mbp+"px"),this.layout_plugin.resize.call(this,t,o,f),v.call(this),this.body_container.setStyle("visibility","visible"),this.footer_container&&this.footer_container.setStyle("visibility","visible"),e.later(100,this,p)}function p(){e.DOM.winWidth()!=this.viewport.w||e.DOM.winHeight()!=this.viewport.h||this.body_container.get("clientWidth")!=this.viewport.bcw?h.call(this):this.fire("afterReflow")}function d(){var e=this.body_info.outers.size();for(var t=0;t<e;t++){var n=this.body_info.modules[t],r=n.size();for(var i=0;i<r;i++){var s=n.item(i),o=this._analyzeModule(s);s._page_layout=o.bd?{children:o,bdScrollTop:o.bd.get("scrollTop"),bdScrollLeft:o.bd.get("scrollLeft")}:null}}}function v(){var e=this.body_info.outers.size();for(var t=0;t<e;t++){var n=this.body_info.modules[t],r=n.size();for(var i=0;i<r;i++){var s=n.item(i);if(s._page_layout){var o=s._page_layout.children.bd;o.set("scrollTop",s._page_layout.bdScrollTop),o.get("scrollLeft",s._page_layout.bdScrollLeft)}}}}function m(e){function r(e,n){var r=t.getAncestorByClassName(this.layout_plugin.collapse_classes[e]);if(r&&r.hasClass(n)){var i=this._analyzeModule(r);this.fire("beforeExpandModule",{bd:i.bd}),r.removeClass(n),h.call(this),this.fire("afterExpandModule",{bd:i.bd})}}var t=e.currentTarget;t.hasClass(n.expand_vert_nub_class)?r.call(this,"vert_parent_class",n.collapsed_vert_class):r.call(this,"horiz_parent_class",n.collapsed_horiz_class)}function g(e){function r(e,n){var r=t.getAncestorByClassName(this.layout_plugin.collapse_classes[e]);if(r&&!r.hasClass(n)){var i=this._analyzeModule(r);this.fire("beforeCollapseModule",{bd:i.bd}),r.addClass(n),h.call(this),this.fire("afterCollapseModule",{bd:i.bd})}}var t=e.currentTarget;t.hasClass(n.collapse_vert_nub_class)?r.call(this,"vert_parent_class",n.collapsed_vert_class):r.call(this,"horiz_parent_class",n.collapsed_horiz_class)}n.NAME="pagelayout",n.FIT_TO_VIEWPORT=0,n.FIT_TO_CONTENT=1,n.ATTRS={mode:{value:n.FIT_TO_VIEWPORT,validator:function(e){return e===n.FIT_TO_VIEWPORT||e===n.FIT_TO_CONTENT}},minWidth:{value:73,validator:function(t){return e.Lang.isNumber(t)&&t>0}},minHeight:{value:44,validator:function(t){return e.Lang.isNumber(t)&&t>0}},stickyFooter:{value:!1
,validator:e.Lang.isBoolean},matchColumnHeights:{value:!0,validator:e.Lang.isBoolean},body:{value:"body",validator:function(t){return e.Lang.isString(t)||t._node}}},n.fit_to_viewport_class="FIT_TO_VIEWPORT",n.fit_to_content_class="FIT_TO_CONTENT",n.force_fit_class="FORCE_FIT",n.page_header_class="layout-hd",n.page_body_class="layout-bd",n.page_footer_class="layout-ft",n.module_rows_class="layout-module-row",n.module_cols_class="layout-module-col",n.module_class="layout-module",n.module_header_class="layout-m-hd",n.module_body_class="layout-m-bd",n.module_footer_class="layout-m-ft",n.not_managed_class="layout-not-managed",n.collapse_vert_nub_class="layout-vert-collapse-nub",n.collapse_left_nub_class="layout-left-collapse-nub",n.collapse_right_nub_class="layout-right-collapse-nub",n.expand_vert_nub_class="layout-vert-expand-nub",n.expand_left_nub_class="layout-left-expand-nub",n.expand_right_nub_class="layout-right-expand-nub",n.collapsed_vert_class="layout-collapsed-vert",n.collapsed_horiz_class="layout-collapsed-horiz",n.min_module_height=10,n.unmanaged_size=-1;var r=/\bFIT_TO_[A-Z_]+/,i=/(?:^|\s)height:([0-9]+)%/,s=/(?:^|\s)width:([0-9]+)%/,o=100,u={row:{module:"gallery-layout-rows",plugin:"PageLayoutRows",outer_size:i,inner_size:s},col:{module:"gallery-layout-cols",plugin:"PageLayoutCols",outer_size:s,inner_size:i}};e.extend(n,e.Base,{initializer:function(){e.on("domready",a,this)},rescanBody:function(){e.detach("PageLayoutCollapse|click"),this.body_info={outers:[],modules:[],outer_sizes:[],inner_sizes:[]};var t=this.body_container.all("div."+n.module_rows_class),r=u.row;t.isEmpty()&&(t=this.body_container.all("div."+n.module_cols_class),r=u.col);if(t.isEmpty())throw Error("There must be at least one "+n.module_rows_class+" or "+n.module_cols_class+" inside "+n.page_body_class+".");this.body_info.outers=t;var i="("+n.collapse_vert_nub_class+"|"+n.collapse_left_nub_class+"|"+n.collapse_right_nub_class+")",s="("+n.expand_vert_nub_class+"|"+n.expand_left_nub_class+"|"+n.expand_right_nub_class+")",o=this.body_info.outers.size();e.each(this.body_info.outers,function(t){var u=t.generateID();this.body_info.outer_sizes.push(100/o);var a=t.all("div."+n.module_class);if(a.isEmpty())throw this.body_info.outers=[],this.body_info.modules=[],Error("There must be at least one "+n.module_class+" inside "+n.module_rows_class+".");this.body_info.modules.push(a),e.each(a,function(e){var t=e.getFirstElementByClassName(i);t&&t.on("PageLayoutCollapse|click",g,this),t=e.getFirstElementByClassName(s),t&&t.on("PageLayoutCollapse|click",m,this)},this),this.body_info.inner_sizes.push(f(a,r.inner_size))},this),this.body_info.outer_sizes=f(this.body_info.outers,r.outer_size),this.single_module=!1,this.body_info.outers.size()==1&&this.body_info.modules[0].size()==1&&!this.body_container.hasClass(n.force_fit_class)&&(r=u.row,this.single_module=!0);var a=this;e.use(r.module,function(e){e.all("div.layout-loading").each(function(e){e.setStyle("display","none")}),a.layout_plugin=e[r.plugin],l.call(a),h.call(a)})},getHeaderHeight:function(){return this.header_container?this.header_container.get("offsetHeight"):0},getHeaderContainer:function(){return this.header_container},getBodyHeight:function(){return this.body_container.get("offsetHeight")},getBodyContainer:function(){return this.body_container},getFooterHeight:function(){return this.get("stickyFooter")&&this.footer_container?this.footer_container.get("offsetHeight"):0},getFooterContainer:function(){return this.footer_container},moduleIsCollapsed:function(t){var r="("+n.collapsed_horiz_class+"|"+n.collapses_vert_class+")";return t=e.one(t),t.getFirstElementByClassName(this.layout_plugin.collapse_classes.collapse_parent_pattern)&&(t=t.get("parentNode")),t.hasClass(r)},expandModule:function(t){t=e.one(t);var r=t.getFirstElementByClassName(n.expand_vert_nub_class);if(!r){var i="("+n.expand_left_nub_class+"|"+n.expand_right_nub_class+")";r=t.getFirstElementByClassName(i)}r&&m.call(this,{currentTarget:r})},collapseModule:function(t){t=e.one(t);var r=t.getFirstElementByClassName(n.collapse_vert_nub_class);if(!r){var i="("+n.collapse_left_nub_class+"|"+n.collapse_right_nub_class+")";r=t.getFirstElementByClassName(i)}r&&g.call(this,{currentTarget:r})},toggleModule:function(t){t=e.one(t),this.moduleIsCollapsed(t)?this.expandModule(t):this.collapseModule(t)},elementResized:function(t){t=e.one(t);if(this.header_container&&this.header_container.contains(t)||this.body_container&&this.body_container.contains(t)||this.footer_container&&this.footer_container.contains(t)){this.refresh_timer&&this.refresh_timer.cancel();var n=(new Date).getTime();return this.refresh_timer=e.later(o,this,function(){this.refresh_timer=null;var e=(new Date).getTime();e>n+2*o?this.elementResized(t):h.call(this)}),!0}return!1},_analyzeModule:function(e){var t={root:e,hd:null,bd:null,ft:null},r=e.one("."+n.module_body_class);if(!r)return t;var i=r.siblings().filter("."+n.module_body_class);return i.unshift(r),t.bd=i.find(function(e){return e.get("offsetWidth")>0}),t.bd||(t.bd=r),t.bd&&(t.hd=t.bd.siblings().filter("."+n.module_header_class).item(0),t.ft=t.bd.siblings().filter("."+n.module_footer_class).item(0)),t},_setWidth:function(e,t){e.root.setStyle("width",t+"px")}}),e.PageLayout=n},"gallery-2013.08.15-00-45",{skinnable:"true",requires:["base","gallery-funcprog","gallery-node-optimizations","gallery-dimensions","gallery-nodelist-extras2"],optional:["gallery-layout-rows","gallery-layout-cols"]});