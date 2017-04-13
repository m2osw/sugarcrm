/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('datatype-xml-parse',function(Y){var LANG=Y.Lang;Y.mix(Y.namespace("DataType.XML"),{parse:function(data){var xmlDoc=null;if(LANG.isString(data)){try{if(!LANG.isUndefined(ActiveXObject)){xmlDoc=new ActiveXObject("Microsoft.XMLDOM");xmlDoc.async=false;xmlDoc.loadXML(data);}}
catch(ee){try{if(!LANG.isUndefined(DOMParser)){xmlDoc=new DOMParser().parseFromString(data,"text/xml");}}
catch(e){}}}
if((LANG.isNull(xmlDoc))||(LANG.isNull(xmlDoc.documentElement))||(xmlDoc.documentElement.nodeName==="parsererror")){}
return xmlDoc;}});Y.namespace("Parsers").xml=Y.DataType.XML.parse;},'3.3.0',{requires:['yui-base']});