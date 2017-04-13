/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('yui-later',function(Y){Y.later=function(when,o,fn,data,periodic){when=when||0;var m=fn,f,id;if(o&&Y.Lang.isString(fn)){m=o[fn];}
f=!Y.Lang.isUndefined(data)?function(){m.apply(o,Y.Array(data));}:function(){m.call(o);};id=(periodic)?setInterval(f,when):setTimeout(f,when);return{id:id,interval:periodic,cancel:function(){if(this.interval){clearInterval(id);}else{clearTimeout(id);}}};};Y.Lang.later=Y.later;},'3.3.0',{requires:['yui-base']});