YUI.add("gallery-icello-date",function(a){a.namespace("Icello.Date");a.Icello.Date.addMonths=function(f,b){var j=null,g=null,h=null,c=f.getMonth()+b,e=c%12,i=null;j=new Date(f.getFullYear(),c,f.getDate());if(e===j.getMonth()){i=j;}else{g=new Date(f.getFullYear(),c,1);h=new Date(g.getFullYear(),g.getMonth(),a.DataType.Date.daysInMonth(g));i=h;}return i;};a.Icello.Date.areDaysEqual=function(i,h){var e=i.getFullYear(),d=h.getFullYear(),c=i.getMonth(),b=h.getMonth(),g=i.getDay(),f=h.getDay();return e===d&&c===b&&g===f;};a.Icello.Date.formatShortDate=function(b){var c=[b.getMonth()+1,"/",b.getDate(),"/",b.getFullYear()];return c.join("");};},"gallery-2012.05.16-20-37",{requires:["datatype-date-math"],skinnable:false});