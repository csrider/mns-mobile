YUI.add("gallery-sm-editor-link",function(e,t){(function(){var t=e.Base.create("editorLink",e.Base,[],{linkCommands:{createLink:{commandFn:"_createLink",queryFn:"isLink"},unlink:{commandFn:"_unlink",queryFn:"isLink"}},linkTags:"a",linkTemplate:'<a href="{href}" target="{target}"></a>',initializer:function(){this.commands=e.merge(this.commands,this.linkCommands),this.supportedTags?this.supportedTags+=","+this.linkTags:this.supportedTags=this.linkTags},isLink:function(){return!!this._getAnchorNode()},_getAnchorNode:function(){this.focus();var e=this.selection.range().shrink().parentNode();return e.ancestor(this.linkTags,!0)},_createLink:function(t){var n=this.selection.range(),r,i;if(!n)return;this.isLink()&&(this._unlink(),n=this.selection.range()),t||(t={}),t.href=encodeURI(t.href||""),t.target=encodeURIComponent(t.target||"_self"),r=e.Node.create(e.Lang.sub(this.linkTemplate,t)),i=this._getStyleNodes(n),r.append(i),n.insertNode(r);if(t.text&&t.text!==n.toString()){var s=r.get("firstChild");this._isStyleNode(s)?(s.set("text",t.text),r.setHTML(s)):r.set("text",t.text)}n.selectNode(r).collapse(),this.selection.select(n)},_unlink:function(){var e=this.selection,t;if(t=this._getAnchorNode()){var n=t.get("firstChild"),r=t.get("lastChild"),i=e.range();n.unwrap(),t.destroy(),i.startNode(n,0),i.endNode(r,"after"),e.select(i.shrink({trim:!0}))}}});e.namespace("Editor").Link=t})()},"@VERSION@",{requires:["base-build","gallery-sm-editor-base","node-base"]});