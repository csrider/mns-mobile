YUI.add("gallery-itsatoolbar",function(e,t){"use strict";var n=e.Lang,r=e.Node,i="<button class='yui3-button'></button>",s="<span class='itsa-button-icon'></span>",o="yui3-button-active",u="itsa-button-active",a="itsa-button-indent",f="itsa-button",l="itsa-syncbutton",c="itsa-togglebutton",h="itsa-buttongroup",p="itsa-button-customfunc",d="<div class='itsatoolbar'></div>",v="itsa-buttonsize-small",m="itsa-buttonsize-medium",g="itsatoolbar-editorpart",y="<div></div>",b="<img id='itsatoolbar-tmpref' />",w="<img class='itsatoolbar-tmpempty' src='data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=' width=0 height=0>",E="<span id='itsatoolbar-ref'></span>",S="itsa-selection-tmp",x="itsa-fontsize",T="itsa-fontfamily",N="itsa-fontcolor",C="itsa-markcolor",k="itsa-iframenode",L="itsa-youtubenode",A="itsa-iframeblocker",O=".itsa-iframeblocker {position: relative; z-index: 1; background-color:#FFF; opacity:0; filter:alpha(opacity=0;} .itsa-iframeblocker:hover {opacity:0.4; filter:alpha(opacity=40;}",M='<span style="padding-left:{width}px; margin-right:-{width}px; padding-top:{height}px; " class="'+A+' {node}"></span>';e.namespace("Plugin").ITSAToolbar=e.Base.create("itsatoolbar",e.Plugin.Base,[],{editor:null,editorY:null,editorNode:null,containerNode:null,toolbarNode:null,_destroyed:!1,_timerClearEmptyFontRef:null,_backupCursorRef:null,_dialogPanelId:null,_extracssBKP:"",_eventhandlers:[],ICON_BOLD:"itsa-icon-bold",ICON_ITALIC:"itsa-icon-italic",ICON_UNDERLINE:"itsa-icon-underline",ICON_ALIGN_LEFT:"itsa-icon-alignleft",ICON_ALIGN_CENTER:"itsa-icon-aligncenter",ICON_ALIGN_RIGHT:"itsa-icon-alignright",ICON_ALIGN_JUSTIFY:"itsa-icon-alignjustify",ICON_SUBSCRIPT:"itsa-icon-subscript",ICON_SUPERSCRIPT:"itsa-icon-superscript",ICON_TEXTCOLOR:"itsa-icon-textcolor",ICON_MARKCOLOR:"itsa-icon-markcolor",ICON_INDENT:"itsa-icon-indent",ICON_OUTDENT:"itsa-icon-outdent",ICON_UNORDEREDLIST:"itsa-icon-unorderedlist",ICON_ORDEREDLIST:"itsa-icon-orderedlist",ICON_UNDO:"itsa-icon-undo",ICON_REDO:"itsa-icon-redo",ICON_EMAIL:"itsa-icon-email",ICON_HYPERLINK:"itsa-icon-hyperlink",ICON_REMOVELINK:"itsa-icon-removelink",ICON_IFRAME:"itsa-icon-iframe",ICON_IMAGE:"itsa-icon-image",ICON_FILE:"itsa-icon-file",ICON_VIDEO:"itsa-icon-video",ICON_SAVE:"itsa-icon-save",ICON_CANCEL:"itsa-icon-cancel",ICON_CLEAR:"itsa-icon-clear",initializer:function(e){var t=this;t.editor=t.get("host"),t.editor.frame&&t.editor.frame.get("node")?t._render():t.editor.on("ready",t._render,t)},_render:function(){var t=this;t._destroyed||(t.editorY=t.editor.getInstance(),t.editorNode=t.editor.frame.get("node"),t.containerNode=t.editorNode.get("parentNode"),t._clearAllTempReferences(),t.initialContent=t.editor.get("content"),t.get("paraSupport")?t.editor.plug(e.Plugin.EditorPara):t.editor.plug(e.Plugin.EditorBR),t._extracssBKP=t.editor.get("extracss"),t.editor.set("extracss",t._extracssBKP+O),t.editor.plug(e.Plugin.ExecCommand),t._defineCustomExecCommands(),t._createUrlDialog(),t._createBlockerRefs(),t._renderUI(),t._bindUI(),t.editor.frame.focus(e.bind(t.sync,t)))},_getCursorRef:function(e){var t=this,r,i,s,o;t._removeCursorRef(),s=new t.editorY.EditorSelection,!s.isCollapsed&&s.anchorNode&&(o=s.getSelected(),o.size()===0&&(o=s.anchorNode.all("[style],font[face]")),o.size()>0&&(r=o.item(0)));if(r){r.addClass(S),r.insert(E,"after");if(!n.isBoolean(e)||!e)r=t.editorY.one("#itsatoolbar-ref")}else t.editor.focus(),t.execCommand("inserthtml",E),r=t.editorY.one("#itsatoolbar-ref");return r},_removeCursorRef:function(t){var r=this,i,s;s=t||r.editorY||e,i=s.all("#itsatoolbar-ref"),i&&i.remove(),i=s.all("#itsatoolbar-tmpempty"),i&&i.remove(),i=s.all("."+S),i.size()>0&&i.each(function(e){n.trim(e.getHTML())===""?e.remove(!1):e.replace(e.getHTML())})},_createBlockerRefs:function(){var e=this,t,r=/^http:\/\/www\.youtube\.com\/embed\/(\w+)/;e._clearBlockerRef(),t=e.editorY.all("iframe"),t.each(function(e){var t,i,s;i=e.get("width"),s=e.get("height"),t=n.sub(M,{width:i||315,height:s||420,node:r.test(e.get("src")||"")?L:k}),e.insert(t,"before")},e)},_clearBlockerRef:function(t){var n=this,r;r=t||n.editorY||e,r.all("."+A).remove(!1)},_clearEmptyFontRef:function(t){var n=this,r,i;i=t||n.editorY||e,r=i.all(".itsatoolbar-tmpempty"),r&&r.remove(),r=i.all(".itsa-fontsize"),r.size()>0&&r.each(function(e){e.getHTML()===""&&e.remove()}),r=i.all(".itsa-fontfamily"),r.size()>0&&r.each(function(e){e.getHTML()===""&&e.remove()}),r=i.all(".itsa-fontcolor"),r.size()>0&&r.each(function(e){e.getHTML()===""&&e.remove()}),r=i.all(".itsa-markcolor"),r.size()>0&&r.each(function(e){e.getHTML()===""&&e.remove()})},_setCursorAtRef:function(){var e=this,t,n=e.editorY.one("#itsatoolbar-ref");n?(e.editor.focus(),t=new e.editorY.EditorSelection,t.selectNode(n),e._removeCursorRef()):e._removeCursorRef()},_createBackupCursorRef:function(){var e=this;return e._backupCursorRef=e._getCursorRef(!0),e._backupCursorRef},_getBackupCursorRef:function(){var e=this;return e._backupCursorRef||e._getCursorRef(!0)},sync:function(t){var n=this,r;if(!t||!t.changedNode)r=n._getCursorRef(!1),t?t.changedNode=r:t={changedNode:r},e.later(250,n,n._removeCursorRef);n.toolbarNode&&n.toolbarNode.fire("itsatoolbar:statusChange",t)},addButton:function(e,t,o,u){var l=this,c,h;return c=r.create(i),c.addClass(f),n.isString(t)?c.setData("execCommand",t):n.isObject(t)&&(n.isString(t.command)&&c.setData("execCommand",t.command),n.isString(t.value)&&c.setData("execValue",t.value),n.isFunction(t.customFunc)&&(c.addClass(p),c.on("click",t.customFunc,t.context||l))),n.isBoolean(o)&&o&&c.addClass(a),h=r.create(s),h.addClass(e),c.append(h),l.toolbarNode?l.toolbarNode.append(c):l.editor.on("ready",function(e,t){l.toolbarNode.append(t)},l,c),c},addSyncButton:function(t,r,i,s,o,u,a){var f=this,c=f.addButton(t,r,o,u);return a||c.addClass(l),f.toolbarNode?f.toolbarNode.addTarget(c):f.editor.on("ready",function(e,t){f.toolbarNode.addTarget
(t)},f,c),n.isFunction(i)&&c.on("itsatoolbar:statusChange",e.bind(i,s||f)),c},addToggleButton:function(e,t,n,r,i,s){var o=this,u=o.addSyncButton(e,t,n,r,i,s,!0);return u.addClass(c),u},addButtongroup:function(e,t,n){var r=this;r.toolbarNode?r._addButtongroup(e,t,n):r.editor.on("ready",function(e,t,n,i){r._addButtongroup(t,n,i)},r,e,t,n)},_addButtongroup:function(t,r,i){var s=this,o=e.guid(),u,a,f=null,l,c;for(c=0;c<t.length;c++)u=t[c],u.iconClass&&u.command&&(n.isString(u.value)?l={command:u.command,value:u.value}:l=u.command,a=s.addButton(u.iconClass,l,r&&c===0,i?i+c:null),a.addClass(h),a.addClass(h+"-"+o),a.setData("buttongroup",o),s.toolbarNode.addTarget(a),n.isFunction(u.syncFunc)&&a.on("itsatoolbar:statusChange",e.bind(u.syncFunc,u.context||s)),f||(f=a));return f},addSelectlist:function(t,r,i,s,o,u,a){var f=this,l;return u=e.merge(u,{items:t,defaultButtonText:""}),l=new e.ITSASelectList(u),l.after("render",function(t,r,i,s,o){var u=this,a=t.currentTarget,f=a.buttonNode;n.isString(r)?f.setData("execCommand",r):(n.isString(r.command)&&f.setData("execCommand",r.command),n.isString(r.restoreCommand)&&f.setData("restoreCommand",r.restoreCommand),n.isString(r.restoreValue)&&f.setData("restoreValue",r.restoreValue)),o&&a.get("boundingBox").addClass("itsa-button-indent"),u.toolbarNode.addTarget(f),a.on("show",u._createBackupCursorRef,u),a.on("selectChange",u._handleSelectChange,u),n.isFunction(i)&&f.on("itsatoolbar:statusChange",e.rbind(i,s||u)),u.editor.on("nodeChange",a.hideListbox,a)},f,r,i,s,o),f.toolbarNode?l.render(f.toolbarNode):f.editor.on("ready",function(){l.render(f.toolbarNode)},f),l},getContent:function(){var e=this,t=e.editorY,n=t&&t.one("body").cloneNode(!0);return n&&e._clearAllTempReferences(n).getHTML()||""},_clearAllTempReferences:function(t){var n=this,r,i;return n._removeCursorRef(t),n._clearEmptyFontRef(t),n._clearBlockerRef(t),r=t||n.editorY||e,i=r.all("#yui-ie-cursor"),i&&i.remove(),i=r.all(".yui-cursor"),i&&i.remove(),i=r.all("#itsatoolbar-tmpref"),i&&i.remove(),t},destructor:function(){var t=this,n=t.get("srcNode");t._destroyed=!0,t._timerClearEmptyFontRef&&t._timerClearEmptyFontRef.cancel(),t._clearAllTempReferences(),t.editor.set("extracss",t._extracssBKP),e.Array.each(t._eventhandlers,function(e){e.detach()}),t.toolbarNode&&t.toolbarNode.remove(!0),t._dialogPanelId&&e.Global.ItsaDialog.panelOptions.splice(t._dialogPanelId,1)},_renderUI:function(){var e=this,t=0,n=e.get("srcNode"),i=e.get("btnSize");e.toolbarNode=r.create(d),i===1?e.toolbarNode.addClass(v):i===2&&e.toolbarNode.addClass(m);if(n)n.prepend(e.toolbarNode);else{e.toolbarNode.addClass(g);switch(e.get("btnSize")){case 1:t=-40;break;case 2:t=-44;break;case 3:t=-46}t+=parseInt(e.containerNode.get("offsetHeight"),10)-parseInt(e.containerNode.getComputedStyle("paddingTop"),10)-parseInt(e.containerNode.getComputedStyle("borderTopWidth"),10)-parseInt(e.containerNode.getComputedStyle("borderBottomWidth"),10),e.editorNode.set("height",t),e.editorNode.insert(e.toolbarNode,"before")}e._initializeButtons()},_bindUI:function(){var e=this,t=e._eventhandlers;t.push(e.editor.on("nodeChange",e.sync,e)),t.push(e.toolbarNode.delegate("click",e._handleBtnClick,"button",e))},_handleShortcutFn:function(e){var t=this;if(e.ctrlKey||e.metaKey)switch(e.keyCode){case 66:e.halt(!0),t.execCommand("bold"),t.sync();break;case 73:e.halt(!0),t.execCommand("italic"),t.sync();break;case 85:e.halt(!0),t.execCommand("underline"),t.sync()}},_createUrlDialog:function(){var t=this;t._dialogPanelId=e.Global.ItsaDialog.definePanel({iconClass:e.Global.ItsaDialog.ICON_INFO,form:[{name:"count",label:"{message}",value:"{count}"}],buttons:{footer:[{name:"cancel",label:"Cancel",action:e.Global.ItsaDialog.ACTION_HIDE},{name:"removelink",label:"Remove link",action:e.Global.ItsaDialog.ACTION_HIDE},{name:"ok",label:"Ok",action:e.Global.ItsaDialog.ACTION_HIDE,validation:!0,isDefault:!0}]}})},getUrl:function(t,n,r,i,s,o,u,a){var f=this,l,c;c=new e.ITSAFORMELEMENT({name:"value",type:"input",value:r,classNameValue:"yui3-itsadialogbox-stringinput itsa-formelement-lastelement",marginTop:10,initialFocus:!0,selectOnFocus:!0}),e.Global.ItsaDialog.showPanel(f._dialogPanelId,t,n+"<br>"+c.render(),i,s,o,u,a)},_defineCustomExecCommands:function(){var e=this;e._defineExecCommandHeader(),e._defineExecCommandFontFamily(),e._defineExecCommandFontSize(),e._defineExecCommandFontColor(),e._defineExecCommandMarkColor(),e._defineExecCommandHyperlink(),e._defineExecCommandRemoveHyperlink(),e._defineExecCommandMaillink(),e._defineExecCommandImage(),e._defineExecCommandIframe(),e._defineExecCommandYouTube(),e._defineExecSaveContent(),e._defineExecSetContent()},_handleBtnClick:function(e){var t=this,n=e.currentTarget;n.hasClass(f)&&(n.hasClass(c)?n.toggleClass(o):n.hasClass(l)?n.toggleClass(u,!0):n.hasClass(h)&&(t.toolbarNode.all("."+h+"-"+n.getData("buttongroup")).toggleClass(o,!1),n.toggleClass(o,!0)),n.hasClass(p)||t._execCommandFromData(n))},_handleSelectChange:function(e){var t,n,r;t=e.currentTarget.buttonNode,n=t.getData("restoreCommand"),r=n&&e.value===t.getData("restoreValue")?n:t.getData("execCommand"),this.execCommand(r,e.value)},_execCommandFromData:function(e){var t=this,n,r;n=e.getData("execCommand"),r=e.getData("execValue"),t._createBackupCursorRef(),t.execCommand(n,r)},execCommand:function(e,t){var n=this,r;n.editor.focus(),e==="inserthtml"?(n.editor._execCommand("createlink","&nbsp;"),n.editor.exec.command("inserthtml",b),r=n.editorY.one("#itsatoolbar-tmpref"),r.replace(t)):n.editor.exec.command(e,t)},_hasSelection:function(){var e=this,t=new e.editorY.EditorSelection;return!t.isCollapsed&&(t.anchorNode||t.getSelected().size()>0)},_checkInbetweenSelector:function(e,t){var n=this,r="<\\s*"+e+"[^>]*>(.*?)<\\s*/\\s*"+e+">",i=new RegExp(r,"gi"),s,o=!1,u=n.editorY.one("body").getHTML(),a,f;a=t.get("id"),f=u.indexOf(' id="'+a+'"'),f===-1&&(f=u.indexOf(" id='"+a+"'")),f===-1&&(f=u.indexOf(" id="+a)),s=i.exec(u);while(s!==null&&!o)o=f>=s.index&&f<s.index+s[0].length,s=i.exec
(u);return o},_getActiveHeader:function(e){var t=this,n,i,s,o,u,a,f=0,l=null,c,h,p;return e&&(a=e.get("tagName"),a.length>1&&(f=parseInt(a.substring(1),10)),a.length===2&&a.toLowerCase().substring(0,1)==="h"&&f>0&&f<10?l=e:(u=e.get("id"),n=" id=(\"|')?"+u+"(\"|')?(.*?)<\\s*/\\s*h\\d>",i=new RegExp(n,"gi"),p=t.editorY.one("body").getHTML(),s=i.exec(p),s!==null&&(h=s.index+s[0].length-1,f=p.substring(h-1,h),n="<\\s*h"+f+"[^>]*>(.*?)id=(\"|')?"+u+"(\"|')?(.*?)<\\s*/\\s*h"+f+">",i=new RegExp(n,"gi"),s=i.exec(p),s!==null&&(o=p.substring(s.index,s.index+s[0].length))),o&&(c=r.create(o),l=t.editorY.one("#"+c.get("id"))))),l},_initializeButtons:function(){var t=this,r,i,s,a,f,l,c,h,p,d;if(t.get("btnFontfamily")){l=t.get("fontFamilies");for(r=0;r<l.length;r++)f=l[r],l[r]={text:"<span style='font-family:"+f+"'>"+f+"</span>",returnValue:f};t.fontSelectlist=t.addSelectlist(l,"itsafontfamily",function(e){var t=e.changedNode.getStyle("fontFamily"),n=t.split(","),r=n[0];if(r.substring(0,1)==="'"||r.substring(0,1)==='"')r=r.substring(1,r.length-1);this.fontSelectlist.selectItemByValue(r,!0,!0)},null,!0,{buttonWidth:145})}if(t.get("btnFontsize")){l=[];for(r=6;r<=32;r++)l.push({text:r.toString(),returnValue:r+"px"});t.sizeSelectlist=t.addSelectlist(l,"itsafontsize",function(e){var t=e.changedNode.getComputedStyle("fontSize"),r=parseFloat(t),i=t.substring(r.toString().length);this.sizeSelectlist.selectItemByValue(n.isNumber(r)?Math.round(r)+i:"",!0)},null,!0,{buttonWidth:42,className:"itsatoolbar-fontsize",listAlignLeft:!1})}if(t.get("btnHeader")){l=[],l.push({text:"No header",returnValue:"none"});for(r=1;r<=t.get("headerLevels");r++)l.push({text:"Header "+r,returnValue:"h"+r});t.headerSelectlist=t.addSelectlist(l,"itsaheading",function(e){var t=this,r=e.changedNode,i=e.sender&&e.sender==="itsaheading",s;i||(s=t._getActiveHeader(r),t.headerSelectlist.selectItem(s?parseInt(s.get("tagName").substring(1),10):0),t.headerSelectlist.set("disabled",n.isNull(s)&&!t._hasSelection()))},null,!0,{buttonWidth:96})}t.get("btnBold")&&t.addToggleButton(t.ICON_BOLD,"bold",function(e){var t=e.changedNode.getStyle("fontWeight");e.currentTarget.toggleClass(o,n.isNumber(parseInt(t,10))?t>=600:t==="bold"||t==="bolder")},null,!0),t.get("btnItalic")&&t.addToggleButton(t.ICON_ITALIC,"italic",function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("fontStyle")==="italic")}),t.get("btnUnderline")&&t.addToggleButton(t.ICON_UNDERLINE,"underline",function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("textDecoration")==="underline")}),t.get("grpAlign")&&(d=[{iconClass:t.ICON_ALIGN_LEFT,command:"JustifyLeft",value:"",syncFunc:function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("textAlign")==="left"||e.changedNode.getStyle("textAlign")==="start")}},{iconClass:t.ICON_ALIGN_CENTER,command:"JustifyCenter",value:"",syncFunc:function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("textAlign")==="center")}},{iconClass:t.ICON_ALIGN_RIGHT,command:"JustifyRight",value:"",syncFunc:function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("textAlign")==="right")}}],t.get("btnJustify")&&d.push({iconClass:t.ICON_ALIGN_JUSTIFY,command:"JustifyFull",value:"",syncFunc:function(e){e.currentTarget.toggleClass(o,e.changedNode.getStyle("textAlign")==="justify")}}),t.addButtongroup(d,!0)),t.get("grpSubsuper")&&(t.addToggleButton(t.ICON_SUBSCRIPT,"subscript",function(e){e.currentTarget.toggleClass(o,e.changedNode.test("sub"))},null,!0),t.addToggleButton(t.ICON_SUPERSCRIPT,"superscript",function(e){e.currentTarget.toggleClass(o,e.changedNode.test("sup"))}));if(t.get("btnTextcolor")){l=[],p=t.get("colorPallet");for(r=0;r<p.length;r++)c=p[r],l.push({text:"<div style='background-color:"+c+";'></div>",returnValue:c});t.colorSelectlist=t.addSelectlist(l,"itsafontcolor",function(e){var t=this,n=e.changedNode.getStyle("color"),r=t._filter_rgb(n);t.colorSelectlist.selectItemByValue(r,!0,!0)},null,!0,{listWidth:256,className:"itsatoolbar-colors",iconClassName:t.ICON_TEXTCOLOR})}if(t.get("btnMarkcolor")){l=[],p=t.get("colorPallet");for(r=0;r<p.length;r++)c=p[r],l.push({text:"<div style='background-color:"+c+";'></div>",returnValue:c});t.markcolorSelectlist=t.addSelectlist(l,"itsamarkcolor",function(e){var t=this,n=e.changedNode.getStyle("backgroundColor"),r=t._filter_rgb(n);t.markcolorSelectlist.selectItemByValue(r,!0,!0)},null,!0,{listWidth:256,className:"itsatoolbar-colors",iconClassName:t.ICON_MARKCOLOR})}t.get("grpIndent")&&(t.addButton(t.ICON_INDENT,"indent",!0),t.addButton(t.ICON_OUTDENT,"outdent")),t.get("grpLists")&&(t.addToggleButton(t.ICON_UNORDEREDLIST,"insertunorderedlist",function(e){var t=this,n=e.changedNode;e.currentTarget.toggleClass(o,t._checkInbetweenSelector("ul",n))},null,!0),t.addToggleButton(t.ICON_ORDEREDLIST,"insertorderedlist",function(e){var t=this,n=e.changedNode;e.currentTarget.toggleClass(o,t._checkInbetweenSelector("ol",n))})),t.get("btnEmail")&&t.addSyncButton(t.ICON_EMAIL,"itsacreatemaillink",function(e){var t=this,n=e.changedNode,r,i,s;i=t._checkInbetweenSelector("a",n);if(i){while(n&&!n.test("a"))n=n.get("parentNode");s=n.get("href").match("^mailto:","i")=="mailto:"}e.currentTarget.toggleClass(u,i&&s)},null,!0),t.get("btnHyperlink")&&t.addSyncButton(t.ICON_HYPERLINK,"itsacreatehyperlink",function(e){var t=this,n=".doc.docx.xls.xlsx.pdf.txt.zip.rar.",r=e.changedNode,i,s,o=!1,a,f,l,c;s=t._checkInbetweenSelector("a",r);if(s){while(r&&!r.test("a"))r=r.get("parentNode");a=r.get("href"),c=a.match("^mailto:","i")!="mailto:",c&&(f=a.lastIndexOf("."),f!==-1&&(l=a.substring(f)+".",o=n.indexOf(l)!==-1))}e.currentTarget.toggleClass(u,s&&c&&!o)}),t.get("btnRemoveHyperlink")&&t.addSyncButton(t.ICON_REMOVELINK,"itsaremovehyperlink",function(e){var t=this,n=e.changedNode;e.currentTarget.toggleClass(u,t._checkInbetweenSelector("a",n))}),t.get("btnImage")&&t.addSyncButton(t.ICON_IMAGE,"itsacreateimage",function(e){e.currentTarget.toggleClass(u,e.changedNode.test("img"))},null,!0),t.get("btnVideo")&&t.addSyncButton
(t.ICON_VIDEO,"itsacreateyoutube",function(e){e.currentTarget.toggleClass(u,e.changedNode.hasClass(L))}),t.get("btnIframe")&&t.addSyncButton(t.ICON_IFRAME,"itsacreateiframe",function(e){e.currentTarget.toggleClass(u,e.changedNode.hasClass(k))},null,!0),t.get("btnClear")&&t.addButton(t.ICON_CLEAR,{command:"mysetcontent",value:""},!0),t.get("btnSave")&&t.addButton(t.ICON_SAVE,"itsasavecontent",!0),t.get("btnCancel")&&t.addButton(t.ICON_CANCEL,{command:"mysetcontent",value:t.initialContent},!0),t.addSyncButton(t.ICON_FILE,{customFunc:e.bind(function(n){e.ItsaFilePicker.getFile().then(function(n){t.execCommand("itsacreatehyperlink","http://files.brongegevens.nl/"+e.config.cmas2plusdomain+"/"+n.file.filename)})},t)},function(e){var t=this,n=".doc.docx.xls.xlsx.pdf.txt.zip.rar.",r=e.changedNode,i,s=!1,o,a,f,l,c;o=t._checkInbetweenSelector("a",r);if(o){while(r&&!r.test("a"))r=r.get("parentNode");a=r.get("href"),c=a.match("^mailto:","i")!="mailto:",c&&(f=a.lastIndexOf("."),f!==-1&&(l=a.substring(f)+".",s=n.indexOf(l)!==-1))}e.currentTarget.toggleClass(u,s)}),t.get("grpUndoredo")&&(t.addButton(t.ICON_UNDO,"undo",!0),t.addButton(t.ICON_REDO,"redo"))},_filter_rgb:function(e){if(e.toLowerCase().indexOf("rgb")!=-1){var t=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi"),n=e.replace(t,"$1,$2,$3,$4,$5").split(","),r,i,s;n.length===5&&(r=parseInt(n[1],10).toString(16),i=parseInt(n[2],10).toString(16),s=parseInt(n[3],10).toString(16),r=r.length===1?"0"+r:r,i=i.length===1?"0"+i:i,s=s.length===1?"0"+s:s,e="#"+r+i+s)}return e},_defineExecCommandHeader:function(){e.Plugin.ExecCommand.COMMANDS.itsaheading||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsaheading:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o=s._getBackupCursorRef(),u=s._getActiveHeader(o),a=0,f=!1,l;n==="none"?u&&(u.replace("<p>"+u.getHTML()+"</p>"),s.headerSelectlist.set("disabled",!0)):(n.length>1&&(a=parseInt(n.substring(1),10)),n.length===2&&n.toLowerCase().substring(0,1)==="h"&&a>0&&a<10&&(l=u||o,l.replace("<"+n+" id='"+i.guid()+"'>"+l.getHTML()+"</"+n+">"))),s.sync({sender:"itsaheading",changedNode:i.one("#itsatoolbar-ref")}),e.later(250,s,s._setCursorAtRef)}})},_defineExecCommandFontFamily:function(){e.Plugin.ExecCommand.COMMANDS.itsafontfamily||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsafontfamily:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a;s._timerClearEmptyFontRef&&s._timerClearEmptyFontRef.cancel(),s._clearEmptyFontRef(),o=s._getBackupCursorRef(),a=o.hasClass(S),a?(o.all("span").setStyle("fontFamily",""),o.all("."+T).replaceClass(T,S),o.setStyle("fontFamily",n),o.addClass(T),o.removeClass(S),s._setCursorAtRef()):(o.replace("<span class='"+T+"' style='font-family:"+n+"'>"+w+E+"</span>"),s._setCursorAtRef(),e.later(3e4,s,s._clearEmptyFontRef))}})},_defineExecCommandFontSize:function(){e.Plugin.ExecCommand.COMMANDS.itsafontsize||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsafontsize:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a,f;s._timerClearEmptyFontRef&&s._timerClearEmptyFontRef.cancel(),s._clearEmptyFontRef(),o=s._getBackupCursorRef(),f=o.hasClass(S),f?(u=o.get("parentNode"),e.UA.webkit&&u.setStyle("lineHeight",""),o.all("span").setStyle("fontSize",""),o.all("."+x).replaceClass(x,S),o.setStyle("fontSize",n),o.addClass(x),o.removeClass(S),s._setCursorAtRef()):(o.replace("<span class='"+x+"' style='font-size:"+n+"'>"+w+E+"</span>"),s._setCursorAtRef(),e.later(3e4,s,s._clearEmptyFontRef))}})},_defineExecCommandFontColor:function(){e.Plugin.ExecCommand.COMMANDS.itsafontcolor||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsafontcolor:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a;s._timerClearEmptyFontRef&&s._timerClearEmptyFontRef.cancel(),s._clearEmptyFontRef(),o=s._getBackupCursorRef(),a=o.hasClass(S),a?(o.all("span").setStyle("color",""),o.all("."+N).replaceClass(N,S),o.setStyle("color",n),o.addClass(N),o.removeClass(S),s._setCursorAtRef()):(o.replace("<span class='"+N+"' style='color:"+n+"'>"+w+E+"</span>"),s._setCursorAtRef(),e.later(3e4,s,s._clearEmptyFontRef))}})},_defineExecCommandMarkColor:function(){e.Plugin.ExecCommand.COMMANDS.itsamarkcolor||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsamarkcolor:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a;s._timerClearEmptyFontRef&&s._timerClearEmptyFontRef.cancel(),s._clearEmptyFontRef(),o=s._getBackupCursorRef(),a=o.hasClass(S),a?(o.all("span").setStyle("backgroundColor",""),o.all("."+C).replaceClass(C,S),o.setStyle("backgroundColor",n),o.addClass(C),o.removeClass(S),s._setCursorAtRef()):(o.replace("<span class='"+C+"' style='background-color:"+n+"'>"+w+E+"</span>"),s._setCursorAtRef(),e.later(3e4,s,s._clearEmptyFontRef))}})},_defineExecSaveContent:function(){e.Plugin.ExecCommand.COMMANDS.itsamarkcolor||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsasavecontent:function(e,t){var n=this.get("host"),r=n.getInstance(),i=n.itsatoolbar,s;s=i._getBackupCursorRef(),i._setCursorAtRef()}})},_defineExecSetContent:function(){e.Plugin.ExecCommand.COMMANDS.itsasetcontent||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsasetcontent:function(e,t){var n=this.get("host"),r=n.getInstance(),i=n.itsatoolbar,s;s=i._getBackupCursorRef(),n.set("content",t),i._setCursorAtRef()}})},_defineExecCommandHyperlink:function(){e.Plugin.ExecCommand.COMMANDS.itsacreatehyperlink||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsacreatehyperlink:function(t,r){var i=this.get("host"),s=i.getInstance(),o=i.itsatoolbar,u,a,f,l,c,h,p,d,v,m;u=o._getBackupCursorRef(),l=u.one("a");if(l||o._checkInbetweenSelector("a",u)){f=l||u;while(f&&f.get("tagName")!=="A")f=f.get("parentNode");f&&(c=f.get("href"))}if(u.hasClass(S)){v=n.trim(e.EditorSelection.getText(u)),p=u.getHTML(),d=v.substr(0,4)==="www.";if(v.substr(0,7)==="http://"||v.substr(0,8)==="https://"||d)m=(d?"http://":"")+v}r?(h=r.replace(/"/g,"").replace(/'/g,""),f?f.set("href",h):(u.setHTML('<a href="'+h+'" target="_blank">'+(p||h)+"</a>"+
E),u.set("id",S),u.toggleClass(S,!0)),o._setCursorAtRef()):(a=f?e.bind(o.getUrl,o):e.bind(e.Global.ItsaDialog.getInput,e.Global.ItsaDialog),a("Hyperlink","Enter here the link",c||m||"http://",function(t){var n=this;t.buttonName==="ok"&&(h=t.value.replace(/"/g,"").replace(/'/g,""),f?f.set("href",h):(u.setHTML('<a href="'+h+'" target="_blank">'+(p||h)+"</a>"+E),u.set("id",S),u.toggleClass(S,!0))),t.buttonName==="removelink"?(f.getHTML()===""?f.remove(!1):f.replace(f.getHTML()),n.sync({changedNode:s.one("#itsatoolbar-ref")}),e.later(250,n,n._setCursorAtRef)):n._setCursorAtRef()},o))}})},_defineExecCommandRemoveHyperlink:function(){e.Plugin.ExecCommand.COMMANDS.itsaremovehyperlink||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsaremovehyperlink:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a;o=s._getBackupCursorRef(),a=o.one("a");if(a||s._checkInbetweenSelector("a",o)){u=a||o;while(u&&u.get("tagName")!=="A")u=u.get("parentNode");u&&(u.getHTML()===""?u.remove(!1):u.replace(u.getHTML()),s.sync({changedNode:i.one("#itsatoolbar-ref")}),e.later(250,s,s._setCursorAtRef))}}})},_defineExecCommandMaillink:function(){e.Plugin.ExecCommand.COMMANDS.itsacreatemaillink||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsacreatemaillink:function(t,r){var i=this.get("host"),s=i.getInstance(),o=i.itsatoolbar,u,a,f,l,c,h,p,d,v;u=o._getBackupCursorRef(),l=u.one("a");if(l||o._checkInbetweenSelector("a",u)){f=l||u;while(f&&f.get("tagName")!=="A")f=f.get("parentNode");f&&(c=f.get("href"),c.toLowerCase().substr(0,7)==="mailto:"&&(c=c.substr(7)))}u.hasClass(S)&&(d=n.trim(e.EditorSelection.getText(u)),p=u.getHTML(),d.indexOf("@")!==-1&&(v=d)),r?(h="mailto:"+r.replace(/"/g,"").replace(/'/g,""),f?f.set("href",h):(u.setHTML('<a href="'+h+'">'+(p||h)+"</a>"+E),u.set("id",S),u.toggleClass(S,!0)),o._setCursorAtRef()):(a=f?e.bind(o.getUrl,o):e.bind(e.Global.ItsaDialog.getInput,e.Global.ItsaDialog),a("Emaillink","Enter here the emailaddress",c||v||"",function(t){var n=this,r,i;t.buttonName==="ok"&&(r="mailto:"+t.value.replace(/"/g,"").replace(/'/g,""),f?f.set("href",r):(u.setHTML('<a href="'+r+'">'+(p||r)+"</a>"+E),u.set("id",S),u.toggleClass(S,!0))),t.buttonName==="removelink"?(f.getHTML()===""?f.remove(!1):f.replace(f.getHTML()),n.sync({changedNode:s.one("#itsatoolbar-ref")}),e.later(250,n,n._setCursorAtRef)):n._setCursorAtRef()},o))}})},_defineExecCommandImage:function(){e.Plugin.ExecCommand.COMMANDS.itsacreateimage||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsacreateimage:function(t,r){var i=this.get("host"),s=i.getInstance(),o=i.itsatoolbar,u,a,f,l,c,h,p;u=o._getBackupCursorRef(),l=u.one("img"),l&&(c=l.get("src"));if(u.hasClass(S)){h=n.trim(e.EditorSelection.getText(u)),f=h.substr(0,4)==="www.";if(h.substr(0,7)==="http://"||h.substr(0,8)==="https://"||f)p=(f?"http://":"")+h}r?(a=r.replace(/"/g,"").replace(/'/g,""),l?l.set("src",a):(u.setHTML('<img src="'+a+'" />'+E),u.set("id",S),u.toggleClass(S,!0)),o._setCursorAtRef()):e.Global.ItsaDialog.getInput("Inline Image","Enter here the link to the image",c||p||"http://",function(t){var n=this;t.buttonName==="ok"&&(a=t.value.replace(/"/g,"").replace(/'/g,""),l?l.set("src",a):(u.setHTML('<img src="'+a+'" />'+E),u.set("id",S),u.toggleClass(S,!0))),t.buttonName==="removelink"?(l.remove(!1),n.sync({changedNode:s.one("#itsatoolbar-ref")}),e.later(250,n,n._setCursorAtRef)):n._setCursorAtRef()},o)}})},_defineExecCommandYouTube:function(){e.Plugin.ExecCommand.COMMANDS.itsacreateyoutube||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsacreateyoutube:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a,f,l=/^http:\/\/www\.youtube\.com\/watch?v=(\w+)/,c=/^http:\/\/youtu\.be\/(\w+)/,h=/^http:\/\/www\.youtube\.com\/embed\/(\w+)/,p=/^v=(\w+)/,d=/^(\w+)$/,v,m;o=s._getBackupCursorRef(),a=o.one("."+A);if(a){v=o.next("iframe");if(v){u=s.editorY.one("#itsatoolbar-ref"),u.remove(!1),v.insert(E,"after"),m=v.get("src");if(l.test(m)||c.test(m)||h.test(m)||p.test(m)||d.test(m))m=RegExp.$1}}f=v?e.bind(s.getUrl,s):e.bind(e.Global.ItsaDialog.getInput,e.Global.ItsaDialog),f("Inline YouTube movie","Enter here the link to the youtube-movie",m||"http://youtu.be/PHIaeHAcE_A",function(t){var n=this,r,s,u=420,f=315;if(t.buttonName==="ok"){r=t.value.replace(/"/g,"").replace(/'/g,"");if(l.test(r)||c.test(r)||h.test(r)||p.test(r)||d.test(r))s=RegExp.$1;s&&(v?v.set("src","http://www.youtube.com/embed/"+s):(o.setHTML('<span style="padding-left:'+u+"px; margin-right:-"+u+"px; padding-top:"+f+'px; " class="'+A+" "+L+'"></span><iframe width="'+u+'" height="'+f+'" src="http://www.youtube.com/embed/'+s+'" frameborder="0" allowfullscreen></iframe>'),o.set("id",S),o.toggleClass(S,!0)))}t.buttonName==="removelink"?(v&&v.remove(!1),a&&a.remove(!1),n.sync({changedNode:i.one("#itsatoolbar-ref")}),e.later(250,n,n._setCursorAtRef)):n._setCursorAtRef()},s)}})},_defineExecCommandIframe:function(){e.Plugin.ExecCommand.COMMANDS.itsacreateiframe||e.mix(e.Plugin.ExecCommand.COMMANDS,{itsacreateiframe:function(t,n){var r=this.get("host"),i=r.getInstance(),s=r.itsatoolbar,o,u,a,f,l,c;o=s._getBackupCursorRef(),u=o.one("."+A),u&&(l=o.next("iframe"),l&&(a=s.editorY.one("#itsatoolbar-ref"),a.remove(!1),l.insert(E,"after"),c=l.get("src"))),f=l?e.bind(s.getUrl,s):e.bind(e.Global.ItsaDialog.getInput,e.Global.ItsaDialog),f("Inline iframe","Enter here the source to the iframe",c||"http://",function(t){var n=this,r=420,s=315,a;t.buttonName==="ok"&&(a=t.value.replace(/"/g,"").replace(/'/g,""),l?l.set("src",a):(o.setHTML('<span style="padding-left:'+r+"px; margin-right:-"+r+"px; padding-top:"+s+'px; " class="'+A+" "+k+'"></span><iframe width="'+r+'" height="'+s+'" src="'+a+'" frameborder="0"></iframe>'),o.set("id",S),o.toggleClass(S,!0))),t.buttonName==="removelink"?(l&&l.remove(!1),u&&u.remove(!1),n.sync({changedNode:i.one("#itsatoolbar-ref")}),e.later(250,n,n._setCursorAtRef)):n._setCursorAtRef()},s)}})}},{NS:"itsatoolbar",ATTRS:{paraSupport:{value:!1,validator:function(e){return n.isBoolean(e)}},srcNode:{value:null,writeOnce
:"initOnly",setter:function(t){return e.one(t)},validator:function(t){return e.one(t)}},btnSize:{value:2,validator:function(e){return n.isNumber(e)&&e>0&&e<4}},headerLevels:{value:6,validator:function(e){return n.isNumber(e)&&e>0&&e<10}},fontFamilies:{value:["Arial","Arial Black","Comic Sans MS","Courier New","Lucida Console","Tahoma","Times New Roman","Trebuchet MS","Verdana"],validator:function(e){return n.isArray(e)}},btnFontfamily:{value:!0,validator:function(e){return n.isBoolean(e)}},btnFontsize:{value:!0,validator:function(e){return n.isBoolean(e)}},btnHeader:{value:!0,validator:function(e){return n.isBoolean(e)}},btnBold:{value:!0,validator:function(e){return n.isBoolean(e)}},btnItalic:{value:!0,validator:function(e){return n.isBoolean(e)}},btnUnderline:{value:!0,validator:function(e){return n.isBoolean(e)}},grpAlign:{value:!0,validator:function(e){return n.isBoolean(e)}},btnJustify:{value:!0,validator:function(e){return n.isBoolean(e)}},grpSubsuper:{value:!0,validator:function(e){return n.isBoolean(e)}},btnTextcolor:{value:!0,validator:function(e){return n.isBoolean(e)}},btnMarkcolor:{value:!0,validator:function(e){return n.isBoolean(e)}},grpIndent:{value:!0,validator:function(e){return n.isBoolean(e)}},grpLists:{value:!0,validator:function(e){return n.isBoolean(e)}},grpUndoredo:{value:!0,validator:function(e){return n.isBoolean(e)}},btnEmail:{value:!0,validator:function(e){return n.isBoolean(e)}},btnHyperlink:{value:!0,validator:function(e){return n.isBoolean(e)}},btnRemoveHyperlink:{value:!0,validator:function(e){return n.isBoolean(e)}},btnImage:{value:!0,validator:function(e){return n.isBoolean(e)}},btnIframe:{value:!0,validator:function(e){return n.isBoolean(e)}},btnVideo:{value:!0,validator:function(e){return n.isBoolean(e)}},btnSave:{value:!1,validator:function(e){return n.isBoolean(e)}},btnCancel:{value:!1,validator:function(e){return n.isBoolean(e)}},btnClear:{value:!1,validator:function(e){return n.isBoolean(e)}},confirmSave:{value:!0,validator:function(e){return n.isBoolean(e)}},confirmCancel:{value:!0,validator:function(e){return n.isBoolean(e)}},confirmClear:{value:!0,validator:function(e){return n.isBoolean(e)}},colorPallet:{value:["#111111","#2D2D2D","#434343","#5B5B5B","#737373","#8B8B8B","#A2A2A2","#B9B9B9","#000000","#D0D0D0","#E6E6E6","#FFFFFF","#BFBF00","#FFFF00","#FFFF40","#FFFF80","#FFFFBF","#525330","#898A49","#AEA945","#7F7F00","#C3BE71","#E0DCAA","#FCFAE1","#60BF00","#80FF00","#A0FF40","#C0FF80","#DFFFBF","#3B5738","#668F5A","#7F9757","#407F00","#8A9B55","#B7C296","#E6EBD5","#00BF00","#00FF80","#40FFA0","#80FFC0","#BFFFDF","#033D21","#438059","#7FA37C","#007F40","#8DAE94","#ACC6B5","#DDEBE2","#00BFBF","#00FFFF","#40FFFF","#80FFFF","#BFFFFF","#033D3D","#347D7E","#609A9F","#007F7F","#96BDC4","#B5D1D7","#E2F1F4","#0060BF","#0080FF","#40A0FF","#80C0FF","#BFDFFF","#1B2C48","#385376","#57708F","#00407F","#7792AC","#A8BED1","#DEEBF6","#0000BF","#0000FF","#4040FF","#8080FF","#BFBFFF","#212143","#373E68","#444F75","#00007F","#585E82","#8687A4","#D2D1E1","#6000BF","#8000FF","#A040FF","#C080FF","#DFBFFF","#302449","#54466F","#655A7F","#40007F","#726284","#9E8FA9","#DCD1DF","#BF00BF","#FF00FF","#FF40FF","#FF80FF","#FFBFFF","#4A234A","#794A72","#936386","#7F007F","#9D7292","#C0A0B6","#ECDAE5","#BF005F","#FF007F","#FF409F","#FF80BF","#FFBFDF","#451528","#823857","#A94A76","#7F003F","#BC6F95","#D8A5BB","#F7DDE9","#C00000","#FF0000","#FF4040","#FF8080","#FFC0C0","#441415","#82393C","#AA4D4E","#800000","#BC6E6E","#D8A3A4","#F8DDDD","#BF5F00","#FF7F00","#FF9F40","#FFBF80","#FFDFBF","#482C1B","#855A40","#B27C51","#7F3F00","#C49B71","#E1C4A8","#FDEEE0"],validator:function(e){return n.isArray(e)}}}})},"@VERSION@",{requires:["plugin","base-build","node-base","editor","event-delegate","event-custom","cssbutton","gallery-itsaselectlist","gallery-itsadialogbox"],skinnable:!0});
