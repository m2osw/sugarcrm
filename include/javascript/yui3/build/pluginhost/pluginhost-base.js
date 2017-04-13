/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('pluginhost-base',function(Y){var L=Y.Lang;function PluginHost(){this._plugins={};}
PluginHost.prototype={plug:function(Plugin,config){var i,ln,ns;if(L.isArray(Plugin)){for(i=0,ln=Plugin.length;i<ln;i++){this.plug(Plugin[i]);}}else{if(Plugin&&!L.isFunction(Plugin)){config=Plugin.cfg;Plugin=Plugin.fn;}
if(Plugin&&Plugin.NS){ns=Plugin.NS;config=config||{};config.host=this;if(this.hasPlugin(ns)){this[ns].setAttrs(config);}else{this[ns]=new Plugin(config);this._plugins[ns]=Plugin;}}}
return this;},unplug:function(plugin){var ns=plugin,plugins=this._plugins;if(plugin){if(L.isFunction(plugin)){ns=plugin.NS;if(ns&&(!plugins[ns]||plugins[ns]!==plugin)){ns=null;}}
if(ns){if(this[ns]){this[ns].destroy();delete this[ns];}
if(plugins[ns]){delete plugins[ns];}}}else{for(ns in this._plugins){if(this._plugins.hasOwnProperty(ns)){this.unplug(ns);}}}
return this;},hasPlugin:function(ns){return(this._plugins[ns]&&this[ns]);},_initPlugins:function(config){this._plugins=this._plugins||{};if(this._initConfigPlugins){this._initConfigPlugins(config);}},_destroyPlugins:function(){this.unplug();}};Y.namespace("Plugin").Host=PluginHost;},'3.3.0',{requires:['yui-base']});