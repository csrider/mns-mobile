YUI.add("gallery-model-list-union",function(e,t){(function(e){"use strict";var t=e.Array,n=e.ModelList,r=t.flatten,i=t.invoke,s=e.Lang.isString;e.ModelList.union=function(){var t,o,u=r(arguments),a=u[0],f=function(){return o.reset(r(i(u,"toArray")))};return s(a)?(u.shift(),t=e.namespace(a)):a instanceof n&&(t=a.constructor),o=new t,i(u,"after",["add","remove","reset"],f),f()}})(e)},"gallery-2013.05.10-00-54",{requires:["model-list"]});