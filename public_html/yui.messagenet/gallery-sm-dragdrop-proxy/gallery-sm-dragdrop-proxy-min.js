YUI.add("gallery-sm-dragdrop-proxy",function(e,t){var n=e.ClassNameManager.getClassName;e.namespace("Plugin.DragDrop").Proxy=e.Base.create("dragdropProxy",e.Plugin.Base,[],{classNames:{dragproxy:n("dragproxy")},initializer:function(e){this._host=e.host,this.afterHostEvent("dragstart",this._afterDragStart),this.onHostEvent("dragstart",this._onDragStart),this.onHostEvent("dragend",this._onDragEnd)},cloneNode:function(t){var n=t.cloneNode(!0);return delete n._yuid,n.set("id",e.guid()).setData("isDragProxyClone",!0).setStyle("position","absolute"),n},_getContainer:function(e){return e||this._host.get("container")},_getProxyNode:function(e){if(this.get("clone")){var t=this._host._dragState;return t.proxyNode?t.proxyNode:t.pending?this.cloneNode(t.dragNode):null}return e},_setContainer:function(t){return t==="parent"?t:e.one(t)},_setProxyNode:function(t){t=t&&e.one(t);if(!t)return null;t.addClass(this.classNames.dragproxy)},_afterDragStart:function(e){var t=e.dragNode,n=e.state,r=n.proxyNode;r.setStyle("visibility","hidden").show().setXY([e.pageXY[0]+n.offsetXY[0],e.pageXY[1]+n.offsetXY[1]]),this.get("matchSize")&&r.setStyles({height:t.get("offsetHeight"),width:t.get("offsetWidth")}),r.setStyle("visibility","visible")},_onDragEnd:function(e){var t=this._host._dragState.proxyNode;this.get("moveOnEnd")&&e.dragNode.setXY(t.getXY()),t.getData("isDragProxyClone")?t.remove(!0):t.hide()},_onDragStart:function(e){var t=this.get("proxyNode");t.addClass(this.classNames.dragproxy),this._host._dragState.proxyNode=t;if(!t.inDoc()){var n=this.get("container");n==="parent"&&(n=e.dragNode.get("parentNode")),t.hide(),n.append(t)}}},{NS:"proxy",ATTRS:{clone:{value:!1},container:{getter:"_getContainer",setter:"_setContainer"},matchSize:{value:!0},moveOnEnd:{value:!0},proxyNode:{getter:"_getProxyNode",setter:"_setProxyNode",valueFn:function(){return e.Node.create("<div></div>")}}}})},"@VERSION@",{requires:["base-pluginhost","gallery-sm-dragdrop","plugin"]});
