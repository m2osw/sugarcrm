/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('cache-base',function(Y){var LANG=Y.Lang,isDate=Y.Lang.isDate,Cache=function(){Cache.superclass.constructor.apply(this,arguments);};Y.mix(Cache,{NAME:"cache",ATTRS:{max:{value:0,setter:"_setMax"},size:{readOnly:true,getter:"_getSize"},uniqueKeys:{value:false},expires:{value:0,validator:function(v){return Y.Lang.isDate(v)||(Y.Lang.isNumber(v)&&v>=0);}},entries:{readOnly:true,getter:"_getEntries"}}});Y.extend(Cache,Y.Base,{_entries:null,initializer:function(config){this.publish("add",{defaultFn:this._defAddFn});this.publish("flush",{defaultFn:this._defFlushFn});this._entries=[];},destructor:function(){this._entries=[];},_setMax:function(value){var entries=this._entries;if(value>0){if(entries){while(entries.length>value){entries.shift();}}}
else{value=0;this._entries=[];}
return value;},_getSize:function(){return this._entries.length;},_getEntries:function(){return this._entries;},_defAddFn:function(e){var entries=this._entries,max=this.get("max"),entry=e.entry;if(this.get("uniqueKeys")&&(this.retrieve(e.entry.request))){entries.shift();}
while(max&&entries.length>=max){entries.shift();}
entries[entries.length]=entry;},_defFlushFn:function(e){this._entries=[];},_isMatch:function(request,entry){if(!entry.expires||new Date()<entry.expires){return(request===entry.request);}
return false;},add:function(request,response){var expires=this.get("expires");if(this.get("initialized")&&((this.get("max")===null)||this.get("max")>0)&&(LANG.isValue(request)||LANG.isNull(request)||LANG.isUndefined(request))){this.fire("add",{entry:{request:request,response:response,cached:new Date(),expires:isDate(expires)?expires:(expires?new Date(new Date().getTime()+this.get("expires")):null)}});}
else{}},flush:function(){this.fire("flush");},retrieve:function(request){var entries=this._entries,length=entries.length,entry=null,i=length-1;if((length>0)&&((this.get("max")===null)||(this.get("max")>0))){this.fire("request",{request:request});for(;i>=0;i--){entry=entries[i];if(this._isMatch(request,entry)){this.fire("retrieve",{entry:entry});if(i<length-1){entries.splice(i,1);entries[entries.length]=entry;}
return entry;}}}
return null;}});Y.Cache=Cache;},'3.3.0',{requires:['base']});YUI.add('cache-offline',function(Y){function CacheOffline(){CacheOffline.superclass.constructor.apply(this,arguments);}
var localStorage=null,JSON=Y.JSON;try{localStorage=Y.config.win.localStorage;}
catch(e){}
Y.mix(CacheOffline,{NAME:"cacheOffline",ATTRS:{sandbox:{value:"default",writeOnce:"initOnly"},expires:{value:86400000},max:{value:null,readOnly:true},uniqueKeys:{value:true,readOnly:true,setter:function(){return true;}}},flushAll:function(){var store=localStorage,key;if(store){if(store.clear){store.clear();}
else{for(key in store){if(store.hasOwnProperty(key)){store.removeItem(key);delete store[key];}}}}
else{}}});Y.extend(CacheOffline,Y.Cache,localStorage?{_setMax:function(value){return null;},_getSize:function(){var count=0,i=0,l=localStorage.length;for(;i<l;++i){if(localStorage.key(i).indexOf(this.get("sandbox"))===0){count++;}}
return count;},_getEntries:function(){var entries=[],i=0,l=localStorage.length,sandbox=this.get("sandbox");for(;i<l;++i){if(localStorage.key(i).indexOf(sandbox)===0){entries[i]=JSON.parse(localStorage.key(i).substring(sandbox.length));}}
return entries;},_defAddFn:function(e){var entry=e.entry,request=entry.request,cached=entry.cached,expires=entry.expires;entry.cached=cached.getTime();entry.expires=expires?expires.getTime():expires;try{localStorage.setItem(this.get("sandbox")+JSON.stringify({"request":request}),JSON.stringify(entry));}
catch(error){this.fire("error",{error:error});}},_defFlushFn:function(e){var key,i=localStorage.length-1;for(;i>-1;--i){key=localStorage.key(i);if(key.indexOf(this.get("sandbox"))===0){localStorage.removeItem(key);}}},retrieve:function(request){this.fire("request",{request:request});var entry,expires,sandboxedrequest;try{sandboxedrequest=this.get("sandbox")+JSON.stringify({"request":request});try{entry=JSON.parse(localStorage.getItem(sandboxedrequest));}
catch(e){}}
catch(e2){}
if(entry){entry.cached=new Date(entry.cached);expires=entry.expires;expires=!expires?null:new Date(expires);entry.expires=expires;if(this._isMatch(request,entry)){this.fire("retrieve",{entry:entry});return entry;}}
return null;}}:{_setMax:function(value){return null;}});Y.CacheOffline=CacheOffline;},'3.3.0',{requires:['cache-base','json']});YUI.add('cache-plugin',function(Y){function CachePlugin(config){var cache=config&&config.cache?config.cache:Y.Cache,tmpclass=Y.Base.create("dataSourceCache",cache,[Y.Plugin.Base]),tmpinstance=new tmpclass(config);tmpclass.NS="tmpClass";return tmpinstance;}
Y.mix(CachePlugin,{NS:"cache",NAME:"cachePlugin"});Y.namespace("Plugin").Cache=CachePlugin;},'3.3.0',{requires:['plugin','cache-base']});YUI.add('cache',function(Y){},'3.3.0',{use:['cache-base','cache-offline','cache-plugin']});