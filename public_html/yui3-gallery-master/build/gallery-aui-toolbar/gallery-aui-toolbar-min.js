YUI.add("gallery-aui-toolbar",function(n){var e=n.Lang,l=e.isString,u="horizontal",h="toolbar",r="orientation",s="toolbarspacer",o="vertical",i=n.ClassNameManager.getClassName,g=i(h,"first"),m=i(h,u),k=i(h,"item"),f=i(h,"item","content"),a=i(h,"last"),c=i(h,o),q=function(w){return(w instanceof n.ButtonItem);},p=function(w){return(w instanceof n.ToolbarSpacer);},j="<span></span>";var b=n.Component.create({NAME:h,ATTRS:{activeState:{},defaultState:{},hoverState:{},defaultChildType:{value:"ButtonItem"},orientation:{value:u,validator:function(v){return l(v)&&(v===u||v===o);}}},UI_ATTRS:[r],prototype:{BOUNDING_TEMPLATE:j,CONTENT_TEMPLATE:j,initializer:function(){var v=this;n.Do.before(v._addByIconId,v,"add");},bindUI:function(){var v=this;v.on("addChild",v._onAddButton);v.after("addChild",v._afterAddButton);v.after("removeChild",v._afterRemoveButton);},syncUI:function(){var v=this;var y=v.size()-1;var x=-1;var w=-1;v.each(function(A,z,B){var C=A.get("boundingBox");if(q(A)){if(x==-1){x=z;}else{w=z;}C.toggleClass(g,z==x);C.toggleClass(a,z==y);C.addClass(k);}else{if(z==x+1){w=x;}if(w!=-1){B.item(w).get("boundingBox").toggleClass(a,true);}x=-1;w=-1;}});},_addByIconId:function(w){var v=this;if(e.isString(w)){var x={icon:w};return new n.Do.AlterArgs(null,[x]);}},_afterAddButton:function(w){var v=this;v.syncUI();},_afterRemoveButton:function(w){var v=this;w.child.destroy();v.syncUI();},_uiSetOrientation:function(y){var v=this;var x=v.get("boundingBox");var w=(y==u);x.toggleClass(m,w);x.toggleClass(c,!w);}}});var t=n.Component.create({NAME:s,ATTRS:{},prototype:{BOUNDING_TEMPLATE:j,CONTENT_TEMPLATE:null}});n.ToolbarSpacer=n.Base.build(h,t,[n.WidgetChild],{dynamic:false});var d=function(){var v=this;v._CHILD_MAP=new n.DataSet();v.on("addChild",v._onAddChildById);v.after("addChild",v._afterAddChildById);v.after("removeChild",v._afterRemoveChildById);n.Do.before(v._findById,v,"item");n.Do.before(v._findById,v,"remove");};d.prototype={_afterAddChildById:function(w){var v=this;var x=w.child.get("id");v._CHILD_MAP.insert(w.index,x,w.child);},_afterRemoveChildById:function(w){var v=this;var x=w.child.get("id");v._CHILD_MAP.removeKey(x);},_findById:function(x){var v=this;if(e.isString(x)){var w=v._CHILD_MAP.indexOfKey(x);return new n.Do.AlterArgs(null,[w]);}},_getItemById:function(x){var v=this;var w=-1;if(e.isString(x)){w=v._CHILD_MAP[x];}return w;},_onAddChildById:function(w){var v=this;var x=w.child.get("id");if(v._CHILD_MAP.indexOfKey(x)>-1){w.preventDefault();}}};n.Toolbar=n.Base.build(h,b,[n.WidgetParent,d],{dynamic:false});},"gallery-2011.02.09-21-32",{requires:["gallery-aui-base","gallery-aui-button-item","gallery-aui-data-set","widget-parent"],skinnable:true});