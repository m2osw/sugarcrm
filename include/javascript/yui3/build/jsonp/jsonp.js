/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('jsonp',function(Y){var isFunction=Y.Lang.isFunction;function JSONPRequest(){this._init.apply(this,arguments);}
JSONPRequest.prototype={_requests:0,_init:function(url,callback){this.url=url;callback=(isFunction(callback))?{on:{success:callback}}:callback||{};var subs=callback.on||{};if(!subs.success){subs.success=this._defaultCallback(url,callback);}
this._config=Y.merge({context:this,args:[],format:this._format,allowCache:false},callback,{on:subs});},_defaultCallback:function(){},send:function(){var self=this,args=Y.Array(arguments,0,true),config=self._config,proxy=self._proxy||Y.guid(),url;if(config.allowCache){self._proxy=proxy;self._requests++;}
args.unshift(self.url,'YUI.Env.JSONP.'+proxy);url=config.format.apply(self,args);if(!config.on.success){return self;}
function wrap(fn){return(isFunction(fn))?function(data){if(!config.allowCache||!--self._requests){delete YUI.Env.JSONP[proxy];}
fn.apply(config.context,[data].concat(config.args));}:null;}
YUI.Env.JSONP[proxy]=wrap(config.on.success);Y.Get.script(url,{onFailure:wrap(config.on.failure),onTimeout:wrap(config.on.timeout),timeout:config.timeout});return self;},_format:function(url,proxy){return url.replace(/\{callback\}/,proxy);}};Y.JSONPRequest=JSONPRequest;Y.jsonp=function(url,c){var req=new Y.JSONPRequest(url,c);return req.send.apply(req,Y.Array(arguments,2,true));};if(!YUI.Env.JSONP){YUI.Env.JSONP={};}},'3.3.0',{requires:['get','oop']});