/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('jsonp-url',function(Y){var JSONPRequest=Y.JSONPRequest,getByPath=Y.Object.getValue,noop=function(){};Y.mix(JSONPRequest.prototype,{_pattern:/\bcallback=(.*?)(?=&|$)/i,_template:"callback={callback}",_defaultCallback:function(url){var match=url.match(this._pattern),keys=[],i=0,locator,path,callback;if(match){locator=match[1].replace(/\[(['"])(.*?)\1\]/g,function(x,$1,$2){keys[i]=$2;return'.@'+(i++);}).replace(/\[(\d+)\]/g,function(x,$1){keys[i]=parseInt($1,10)|0;return'.@'+(i++);}).replace(/^\./,'');if(!/[^\w\.\$@]/.test(locator)){path=locator.split('.');for(i=path.length-1;i>=0;--i){if(path[i].charAt(0)==='@'){path[i]=keys[parseInt(path[i].substr(1),10)];}}
callback=getByPath(Y.config.win,path)||getByPath(Y,path)||getByPath(Y,path.slice(1));}}
return callback||noop;},_format:function(url,proxy){var callback=this._template.replace(/\{callback\}/,proxy),lastChar;if(this._pattern.test(url)){return url.replace(this._pattern,callback);}else{lastChar=url.slice(-1);if(lastChar!=='&'&&lastChar!=='?'){url+=(url.indexOf('?')>-1)?'&':'?';}
return url+callback;}}},true);},'3.3.0',{requires:['jsonp']});