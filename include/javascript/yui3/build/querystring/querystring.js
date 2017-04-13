/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('querystring-parse',function(Y){var QueryString=Y.namespace("QueryString"),pieceParser=function(eq){return function parsePiece(key,val){var sliced,numVal,head,tail,ret;if(arguments.length!==2){key=key.split(eq);return parsePiece(QueryString.unescape(key.shift()),QueryString.unescape(key.join(eq)));}
key=key.replace(/^\s+|\s+$/g,'');if(Y.Lang.isString(val)){val=val.replace(/^\s+|\s+$/g,'');if(!isNaN(val)){numVal=+val;if(val===numVal.toString(10)){val=numVal;}}}
sliced=/(.*)\[([^\]]*)\]$/.exec(key);if(!sliced){ret={};if(key){ret[key]=val;}
return ret;}
tail=sliced[2];head=sliced[1];if(!tail){return parsePiece(head,[val]);}
ret={};ret[tail]=val;return parsePiece(head,ret);};},mergeParams=function(params,addition){return((!params)?addition:(Y.Lang.isArray(params))?params.concat(addition):(!Y.Lang.isObject(params)||!Y.Lang.isObject(addition))?[params].concat(addition):mergeObjects(params,addition));},mergeObjects=function(params,addition){for(var i in addition){if(i&&addition.hasOwnProperty(i)){params[i]=mergeParams(params[i],addition[i]);}}
return params;};QueryString.parse=function(qs,sep,eq){return Y.Array.reduce(Y.Array.map(qs.split(sep||"&"),pieceParser(eq||"=")),{},mergeParams);};QueryString.unescape=function(s){return decodeURIComponent(s.replace(/\+/g,' '));};},'3.3.0',{requires:['collection']});YUI.add('querystring-stringify',function(Y){var QueryString=Y.namespace("QueryString"),stack=[],L=Y.Lang;QueryString.escape=encodeURIComponent;QueryString.stringify=function(obj,c,name){var begin,end,i,l,n,s,sep=c&&c.sep?c.sep:"&",eq=c&&c.eq?c.eq:"=",aK=c&&c.arrayKey?c.arrayKey:false;if(L.isNull(obj)||L.isUndefined(obj)||L.isFunction(obj)){return name?QueryString.escape(name)+eq:'';}
if(L.isBoolean(obj)||Object.prototype.toString.call(obj)==='[object Boolean]'){obj=+obj;}
if(L.isNumber(obj)||L.isString(obj)){return QueryString.escape(name)+eq+QueryString.escape(obj);}
if(L.isArray(obj)){s=[];name=aK?name+'[]':name;l=obj.length;for(i=0;i<l;i++){s.push(QueryString.stringify(obj[i],c,name));}
return s.join(sep);}
for(i=stack.length-1;i>=0;--i){if(stack[i]===obj){throw new Error("QueryString.stringify. Cyclical reference");}}
stack.push(obj);s=[];begin=name?name+'[':'';end=name?']':'';for(i in obj){if(obj.hasOwnProperty(i)){n=begin+i+end;s.push(QueryString.stringify(obj[i],c,n));}}
stack.pop();s=s.join(sep);if(!s&&name){return name+"=";}
return s;};},'3.3.0');YUI.add('querystring',function(Y){},'3.3.0',{use:['querystring-parse','querystring-stringify']});