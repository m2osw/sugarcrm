/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('recordset-indexer',function(Y){function RecordsetIndexer(config){RecordsetIndexer.superclass.constructor.apply(this,arguments);}
Y.mix(RecordsetIndexer,{NS:"indexer",NAME:"recordsetIndexer",ATTRS:{hashTables:{value:{}},keys:{value:{}}}});Y.extend(RecordsetIndexer,Y.Plugin.Base,{initializer:function(config){var host=this.get('host');this.onHostEvent('add',Y.bind("_defAddHash",this),host);this.onHostEvent('remove',Y.bind('_defRemoveHash',this),host);this.onHostEvent('update',Y.bind('_defUpdateHash',this),host);},destructor:function(config){},_setHashTable:function(key){var host=this.get('host'),obj={},i=0,len=host.getLength();for(;i<len;i++){obj[host._items[i].getValue(key)]=host._items[i];}
return obj;},_defAddHash:function(e){var tbl=this.get('hashTables');Y.each(tbl,function(v,key){Y.each(e.added||e.updated,function(o){if(o.getValue(key)){v[o.getValue(key)]=o;}});});},_defRemoveHash:function(e){var tbl=this.get('hashTables'),reckey;Y.each(tbl,function(v,key){Y.each(e.removed||e.overwritten,function(o){reckey=o.getValue(key);if(reckey&&v[reckey]===o){delete v[reckey];}});});},_defUpdateHash:function(e){e.added=e.updated;e.removed=e.overwritten;this._defAddHash(e);this._defRemoveHash(e);},createTable:function(key){var tbls=this.get('hashTables');tbls[key]=this._setHashTable(key);this.set('hashTables',tbls);return tbls[key];},getTable:function(key){return this.get('hashTables')[key];}});Y.namespace("Plugin").RecordsetIndexer=RecordsetIndexer;},'3.3.0',{requires:['recordset-base','plugin']});