/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('event-simulate',function(Y){(function(){var L=Y.Lang,array=Y.Array,isFunction=L.isFunction,isString=L.isString,isBoolean=L.isBoolean,isObject=L.isObject,isNumber=L.isNumber,doc=Y.config.doc,mouseEvents={click:1,dblclick:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,mousemove:1},keyEvents={keydown:1,keyup:1,keypress:1},uiEvents={blur:1,change:1,focus:1,resize:1,scroll:1,select:1},bubbleEvents={scroll:1,resize:1,reset:1,submit:1,change:1,select:1,error:1,abort:1};Y.mix(bubbleEvents,mouseEvents);Y.mix(bubbleEvents,keyEvents);function simulateKeyEvent(target,type,bubbles,cancelable,view,ctrlKey,altKey,shiftKey,metaKey,keyCode,charCode)
{if(!target){Y.error("simulateKeyEvent(): Invalid target.");}
if(isString(type)){type=type.toLowerCase();switch(type){case"textevent":type="keypress";break;case"keyup":case"keydown":case"keypress":break;default:Y.error("simulateKeyEvent(): Event type '"+type+"' not supported.");}}else{Y.error("simulateKeyEvent(): Event type must be a string.");}
if(!isBoolean(bubbles)){bubbles=true;}
if(!isBoolean(cancelable)){cancelable=true;}
if(!isObject(view)){view=window;}
if(!isBoolean(ctrlKey)){ctrlKey=false;}
if(!isBoolean(altKey)){altKey=false;}
if(!isBoolean(shiftKey)){shiftKey=false;}
if(!isBoolean(metaKey)){metaKey=false;}
if(!isNumber(keyCode)){keyCode=0;}
if(!isNumber(charCode)){charCode=0;}
var customEvent=null;if(isFunction(doc.createEvent)){try{customEvent=doc.createEvent("KeyEvents");customEvent.initKeyEvent(type,bubbles,cancelable,view,ctrlKey,altKey,shiftKey,metaKey,keyCode,charCode);}catch(ex){try{customEvent=doc.createEvent("Events");}catch(uierror){customEvent=doc.createEvent("UIEvents");}finally{customEvent.initEvent(type,bubbles,cancelable);customEvent.view=view;customEvent.altKey=altKey;customEvent.ctrlKey=ctrlKey;customEvent.shiftKey=shiftKey;customEvent.metaKey=metaKey;customEvent.keyCode=keyCode;customEvent.charCode=charCode;}}
target.dispatchEvent(customEvent);}else if(isObject(doc.createEventObject)){customEvent=doc.createEventObject();customEvent.bubbles=bubbles;customEvent.cancelable=cancelable;customEvent.view=view;customEvent.ctrlKey=ctrlKey;customEvent.altKey=altKey;customEvent.shiftKey=shiftKey;customEvent.metaKey=metaKey;customEvent.keyCode=(charCode>0)?charCode:keyCode;target.fireEvent("on"+type,customEvent);}else{Y.error("simulateKeyEvent(): No event simulation framework present.");}}
function simulateMouseEvent(target,type,bubbles,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget)
{if(!target){Y.error("simulateMouseEvent(): Invalid target.");}
if(isString(type)){type=type.toLowerCase();if(!mouseEvents[type]){Y.error("simulateMouseEvent(): Event type '"+type+"' not supported.");}}else{Y.error("simulateMouseEvent(): Event type must be a string.");}
if(!isBoolean(bubbles)){bubbles=true;}
if(!isBoolean(cancelable)){cancelable=(type!="mousemove");}
if(!isObject(view)){view=window;}
if(!isNumber(detail)){detail=1;}
if(!isNumber(screenX)){screenX=0;}
if(!isNumber(screenY)){screenY=0;}
if(!isNumber(clientX)){clientX=0;}
if(!isNumber(clientY)){clientY=0;}
if(!isBoolean(ctrlKey)){ctrlKey=false;}
if(!isBoolean(altKey)){altKey=false;}
if(!isBoolean(shiftKey)){shiftKey=false;}
if(!isBoolean(metaKey)){metaKey=false;}
if(!isNumber(button)){button=0;}
relatedTarget=relatedTarget||null;var customEvent=null;if(isFunction(doc.createEvent)){customEvent=doc.createEvent("MouseEvents");if(customEvent.initMouseEvent){customEvent.initMouseEvent(type,bubbles,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget);}else{customEvent=doc.createEvent("UIEvents");customEvent.initEvent(type,bubbles,cancelable);customEvent.view=view;customEvent.detail=detail;customEvent.screenX=screenX;customEvent.screenY=screenY;customEvent.clientX=clientX;customEvent.clientY=clientY;customEvent.ctrlKey=ctrlKey;customEvent.altKey=altKey;customEvent.metaKey=metaKey;customEvent.shiftKey=shiftKey;customEvent.button=button;customEvent.relatedTarget=relatedTarget;}
if(relatedTarget&&!customEvent.relatedTarget){if(type=="mouseout"){customEvent.toElement=relatedTarget;}else if(type=="mouseover"){customEvent.fromElement=relatedTarget;}}
target.dispatchEvent(customEvent);}else if(isObject(doc.createEventObject)){customEvent=doc.createEventObject();customEvent.bubbles=bubbles;customEvent.cancelable=cancelable;customEvent.view=view;customEvent.detail=detail;customEvent.screenX=screenX;customEvent.screenY=screenY;customEvent.clientX=clientX;customEvent.clientY=clientY;customEvent.ctrlKey=ctrlKey;customEvent.altKey=altKey;customEvent.metaKey=metaKey;customEvent.shiftKey=shiftKey;switch(button){case 0:customEvent.button=1;break;case 1:customEvent.button=4;break;case 2:break;default:customEvent.button=0;}
customEvent.relatedTarget=relatedTarget;target.fireEvent("on"+type,customEvent);}else{Y.error("simulateMouseEvent(): No event simulation framework present.");}}
function simulateUIEvent(target,type,bubbles,cancelable,view,detail)
{if(!target){Y.error("simulateUIEvent(): Invalid target.");}
if(isString(type)){type=type.toLowerCase();if(!uiEvents[type]){Y.error("simulateUIEvent(): Event type '"+type+"' not supported.");}}else{Y.error("simulateUIEvent(): Event type must be a string.");}
var customEvent=null;if(!isBoolean(bubbles)){bubbles=(type in bubbleEvents);}
if(!isBoolean(cancelable)){cancelable=(type=="submit");}
if(!isObject(view)){view=window;}
if(!isNumber(detail)){detail=1;}
if(isFunction(doc.createEvent)){customEvent=doc.createEvent("UIEvents");customEvent.initUIEvent(type,bubbles,cancelable,view,detail);target.dispatchEvent(customEvent);}else if(isObject(doc.createEventObject)){customEvent=doc.createEventObject();customEvent.bubbles=bubbles;customEvent.cancelable=cancelable;customEvent.view=view;customEvent.detail=detail;target.fireEvent("on"+type,customEvent);}else{Y.error("simulateUIEvent(): No event simulation framework present.");}}
Y.Event.simulate=function(target,type,options){options=options||{};if(mouseEvents[type]){simulateMouseEvent(target,type,options.bubbles,options.cancelable,options.view,options.detail,options.screenX,options.screenY,options.clientX,options.clientY,options.ctrlKey,options.altKey,options.shiftKey,options.metaKey,options.button,options.relatedTarget);}else if(keyEvents[type]){simulateKeyEvent(target,type,options.bubbles,options.cancelable,options.view,options.ctrlKey,options.altKey,options.shiftKey,options.metaKey,options.keyCode,options.charCode);}else if(uiEvents[type]){simulateUIEvent(target,type,options.bubbles,options.cancelable,options.view,options.detail);}else{Y.error("simulate(): Event '"+type+"' can't be simulated.");}};})();},'3.3.0',{requires:['event-base']});