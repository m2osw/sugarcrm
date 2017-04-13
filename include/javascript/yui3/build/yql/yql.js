/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('yql',function(Y){var YQLRequest=function(sql,callback,params,opts){if(!params){params={};}
params.q=sql;if(!params.format){params.format=Y.YQLRequest.FORMAT;}
if(!params.env){params.env=Y.YQLRequest.ENV;}
this._params=params;this._opts=opts;this._callback=callback;};YQLRequest.prototype={_jsonp:null,_opts:null,_callback:null,_params:null,send:function(){var qs='',url=((this._opts&&this._opts.proto)?this._opts.proto:Y.YQLRequest.PROTO);Y.each(this._params,function(v,k){qs+=k+'='+encodeURIComponent(v)+'&';});url+=((this._opts&&this._opts.base)?this._opts.base:Y.YQLRequest.BASE_URL)+qs;var o=(!Y.Lang.isFunction(this._callback))?this._callback:{on:{success:this._callback}};if(o.allowCache!==false){o.allowCache=true;}
if(!this._jsonp){this._jsonp=Y.jsonp(url,o);}else{this._jsonp.url=url;if(o.on&&o.on.success){this._jsonp._config.on.success=o.on.success;}
this._jsonp.send();}
return this;}};YQLRequest.FORMAT='json';YQLRequest.PROTO='http';YQLRequest.BASE_URL=':/'+'/query.yahooapis.com/v1/public/yql?';YQLRequest.ENV='http:/'+'/datatables.org/alltables.env';Y.YQLRequest=YQLRequest;Y.YQL=function(sql,callback,params){return new Y.YQLRequest(sql,callback,params).send();};},'3.3.0',{requires:['jsonp']});