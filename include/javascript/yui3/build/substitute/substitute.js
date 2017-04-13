/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('substitute',function(Y){var L=Y.Lang,DUMP='dump',SPACE=' ',LBRACE='{',RBRACE='}',substitute=function(s,o,f,recurse){var i,j,k,key,v,meta,saved=[],token,dump,lidx=s.length;for(;;){i=s.lastIndexOf(LBRACE,lidx);if(i<0){break;}
j=s.indexOf(RBRACE,i);if(i+1>=j){break;}
token=s.substring(i+1,j);key=token;meta=null;k=key.indexOf(SPACE);if(k>-1){meta=key.substring(k+1);key=key.substring(0,k);}
v=o[key];if(f){v=f(key,v,meta);}
if(L.isObject(v)){if(!Y.dump){v=v.toString();}else{if(L.isArray(v)){v=Y.dump(v,parseInt(meta,10));}else{meta=meta||'';dump=meta.indexOf(DUMP);if(dump>-1){meta=meta.substring(4);}
if(v.toString===Object.prototype.toString||dump>-1){v=Y.dump(v,parseInt(meta,10));}else{v=v.toString();}}}}else if(!L.isString(v)&&!L.isNumber(v)){v='~-'+saved.length+'-~';saved[saved.length]=token;}
s=s.substring(0,i)+v+s.substring(j+1);if(!recurse){lidx=i-1;}}
for(i=saved.length-1;i>=0;i=i-1){s=s.replace(new RegExp('~-'+i+'-~'),LBRACE+
saved[i]+RBRACE,'g');}
return s;};Y.substitute=substitute;L.substitute=substitute;},'3.3.0',{optional:['dump']});