/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('datatype-number-format',function(Y){var LANG=Y.Lang;Y.mix(Y.namespace("DataType.Number"),{format:function(data,config){if(LANG.isNumber(data)){config=config||{};var isNeg=(data<0),output=data+"",decPlaces=config.decimalPlaces,decSep=config.decimalSeparator||".",thouSep=config.thousandsSeparator,decIndex,newOutput,count,i;if(LANG.isNumber(decPlaces)&&(decPlaces>=0)&&(decPlaces<=20)){output=data.toFixed(decPlaces);}
if(decSep!=="."){output=output.replace(".",decSep);}
if(thouSep){decIndex=output.lastIndexOf(decSep);decIndex=(decIndex>-1)?decIndex:output.length;newOutput=output.substring(decIndex);for(count=0,i=decIndex;i>0;i--){if((count%3===0)&&(i!==decIndex)&&(!isNeg||(i>1))){newOutput=thouSep+newOutput;}
newOutput=output.charAt(i-1)+newOutput;count++;}
output=newOutput;}
output=(config.prefix)?config.prefix+output:output;output=(config.suffix)?output+config.suffix:output;return output;}
else{return(LANG.isValue(data)&&data.toString)?data.toString():"";}}});},'3.3.0',{requires:['yui-base']});