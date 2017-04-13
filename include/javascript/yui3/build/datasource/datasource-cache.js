/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('datasource-cache',function(Y){var DataSourceCacheExtension=function(){};Y.mix(DataSourceCacheExtension,{NS:"cache",NAME:"dataSourceCacheExtension"});DataSourceCacheExtension.prototype={initializer:function(config){this.doBefore("_defRequestFn",this._beforeDefRequestFn);this.doBefore("_defResponseFn",this._beforeDefResponseFn);},_beforeDefRequestFn:function(e){var entry=(this.retrieve(e.request))||null;if(entry&&entry.response){this.get("host").fire("response",Y.mix(entry,e));return new Y.Do.Halt("DataSourceCache extension halted _defRequestFn");}},_beforeDefResponseFn:function(e){if(e.response&&!e.cached){this.add(e.request,e.response);}}};Y.namespace("Plugin").DataSourceCacheExtension=DataSourceCacheExtension;function DataSourceCache(config){var cache=config&&config.cache?config.cache:Y.Cache,tmpclass=Y.Base.create("dataSourceCache",cache,[Y.Plugin.Base,Y.Plugin.DataSourceCacheExtension]),tmpinstance=new tmpclass(config);tmpclass.NS="tmpClass";return tmpinstance;}
Y.mix(DataSourceCache,{NS:"cache",NAME:"dataSourceCache"});Y.namespace("Plugin").DataSourceCache=DataSourceCache;},'3.3.0',{requires:['datasource-local','cache-base']});