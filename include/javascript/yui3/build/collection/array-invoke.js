/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('array-invoke',function(Y){Y.Array.invoke=function(items,name){var args=Y.Array(arguments,2,true),isFunction=Y.Lang.isFunction,ret=[];Y.Array.each(Y.Array(items),function(item,i){if(isFunction(item[name])){ret[i]=item[name].apply(item,args);}});return ret;};},'3.3.0');