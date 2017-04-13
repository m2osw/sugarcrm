/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('datasource-local',function(Y){var LANG=Y.Lang,DSLocal=function(){DSLocal.superclass.constructor.apply(this,arguments);};Y.mix(DSLocal,{NAME:"dataSourceLocal",ATTRS:{source:{value:null}},_tId:0,transactions:{},issueCallback:function(e,caller){var error=(e.error||e.response.error);if(error){e.error=e.error||e.response.error;caller.fire("error",e);}
if(e.callback){var callbackFunc=(error&&e.callback.failure)||e.callback.success;if(callbackFunc){callbackFunc(e);}}}});Y.extend(DSLocal,Y.Base,{initializer:function(config){this._initEvents();},_initEvents:function(){this.publish("request",{defaultFn:Y.bind("_defRequestFn",this),queuable:true});this.publish("data",{defaultFn:Y.bind("_defDataFn",this),queuable:true});this.publish("response",{defaultFn:Y.bind("_defResponseFn",this),queuable:true});},_defRequestFn:function(e){var data=this.get("source");if(LANG.isUndefined(data)){e.error=new Error("Local source undefined");}
this.fire("data",Y.mix({data:data},e));},_defDataFn:function(e){var data=e.data,meta=e.meta,response={results:(LANG.isArray(data))?data:[data],meta:(meta)?meta:{}};this.fire("response",Y.mix({response:response},e));},_defResponseFn:function(e){DSLocal.issueCallback(e,this);},sendRequest:function(request){request=request||{};var tId=DSLocal._tId++;this.fire("request",{tId:tId,request:request.request,callback:request.callback,cfg:request.cfg||{}});return tId;}});Y.namespace("DataSource").Local=DSLocal;},'3.3.0',{requires:['base']});