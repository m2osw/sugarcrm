/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('node-style',function(Y){(function(Y){var methods=['getStyle','getComputedStyle','setStyle','setStyles'];Y.Node.importMethod(Y.DOM,methods);Y.NodeList.importMethod(Y.Node.prototype,methods);})(Y);},'3.3.0',{requires:['dom-style','node-base']});