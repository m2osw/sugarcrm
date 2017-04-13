/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('arraylist-filter',function(Y){Y.mix(Y.ArrayList.prototype,{filter:function(validator){var items=[];Y.Array.each(this._items,function(item,i){item=this.item(i);if(validator(item)){items.push(item);}},this);return new this.constructor(items);}});},'3.3.0',{requires:['arraylist']});