/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('arraylist',function(Y){var YArray=Y.Array,YArray_each=YArray.each,ArrayListProto;function ArrayList(items){if(items!==undefined){this._items=Y.Lang.isArray(items)?items:YArray(items);}else{this._items=this._items||[];}}
ArrayListProto={item:function(i){return this._items[i];},each:function(fn,context){YArray_each(this._items,function(item,i){item=this.item(i);fn.call(context||item,item,i,this);},this);return this;},some:function(fn,context){return YArray.some(this._items,function(item,i){item=this.item(i);return fn.call(context||item,item,i,this);},this);},indexOf:function(needle){return YArray.indexOf(this._items,needle);},size:function(){return this._items.length;},isEmpty:function(){return!this.size();},toJSON:function(){return this._items;}};ArrayListProto._item=ArrayListProto.item;ArrayList.prototype=ArrayListProto;Y.mix(ArrayList,{addMethod:function(dest,names){names=YArray(names);YArray_each(names,function(name){dest[name]=function(){var args=YArray(arguments,0,true),ret=[];YArray_each(this._items,function(item,i){item=this._item(i);var result=item[name].apply(item,args);if(result!==undefined&&result!==item){ret.push(result);}},this);return ret.length?ret:this;};});}});Y.ArrayList=ArrayList;},'3.3.0');