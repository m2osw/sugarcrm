/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('history-deprecated',function(Y){var win=Y.config.win,doc=Y.config.doc,encode=encodeURIComponent,decode=decodeURIComponent,H,G,E_MISSING_OR_INVALID_ARG='Missing or invalid argument',REGEXP=/([^=&]+)=([^&]*)/g,_useIFrame=false,_getHash,EV_HISTORY_READY='history:ready',EV_HISTORY_GLOBAL_STATE_CHANGE='history:globalStateChange',EV_HISTORY_MODULE_STATE_CHANGE='history:moduleStateChange';G=YUI.Env.history||{ready:false,_modules:[],_stateField:null,_historyIFrame:null};YUI.Env.history=G;if(Y.UA.gecko){_getHash=function(){var m=/#(.*)$/.exec(win.location.href);return m&&m[1]?m[1]:'';};}else{_getHash=function(){return win.location.hash.substr(1);};}
function _storeStates(){var initialStates=[],currentStates=[];Y.Object.each(G._modules,function(module,moduleId){initialStates.push(moduleId+'='+module.initialState);currentStates.push(moduleId+'='+module.currentState);});G._stateField.set('value',initialStates.join('&')+'|'+currentStates.join('&'));}
function _handleFQStateChange(fqstate){var m,states=[],globalStateChanged=false;if(fqstate){REGEXP.lastIndex=0;while((m=REGEXP.exec(fqstate))){states[m[1]]=m[2];}
Y.Object.each(G._modules,function(module,moduleId){var currentState=states[moduleId];if(!currentState||module.currentState!==currentState){module.currentState=currentState||module.initialState;module.fire(EV_HISTORY_MODULE_STATE_CHANGE,decode(module.currentState));globalStateChanged=true;}});}else{Y.Object.each(G._modules,function(module,moduleId){if(module.currentState!==module.initialState){module.currentState=module.initialState;module.fire(EV_HISTORY_MODULE_STATE_CHANGE,decode(module.currentState));globalStateChanged=true;}});}
if(globalStateChanged){H.fire(EV_HISTORY_GLOBAL_STATE_CHANGE);}}
function _updateIFrame(fqstate){var html,doc;html='<html><body>'+
fqstate.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'</body></html>';try{doc=G._historyIFrame.get('contentWindow.document');doc.invoke('open');doc.invoke('write',html,'','','','');doc.invoke('close');return true;}catch(e){return false;}}
function _checkIframeLoaded(){var elem,fqstate,hash;if(!G._historyIFrame.get('contentWindow.document')){setTimeout(_checkIframeLoaded,10);return;}
elem=G._historyIFrame.get('contentWindow.document.body');fqstate=elem?elem.get('innerText'):null;hash=_getHash();setInterval(function(){var newfqstate,states,newHash;elem=G._historyIFrame.get('contentWindow.document.body');newfqstate=elem?elem.get('innerText'):null;newHash=_getHash();if(newfqstate!==fqstate){fqstate=newfqstate;_handleFQStateChange(fqstate);if(!fqstate){states=[];Y.Object.each(G._modules,function(module,moduleId){states.push(moduleId+'='+module.initialState);});newHash=states.join('&');}else{newHash=fqstate;}
win.location.hash=hash=newHash;_storeStates();}else if(newHash!==hash){hash=newHash;_updateIFrame(newHash);}},50);G.ready=true;H.fire(EV_HISTORY_READY);}
function _initialize(){var m,parts,moduleId,module,initialState,currentState,hash;parts=G._stateField.get('value').split('|');if(parts.length>1){REGEXP.lastIndex=0;while((m=REGEXP.exec(parts[0]))){moduleId=m[1];initialState=m[2];module=G._modules[moduleId];if(module){module.initialState=initialState;}}
REGEXP.lastIndex=0;while((m=REGEXP.exec(parts[1]))){moduleId=m[1];currentState=m[2];module=G._modules[moduleId];if(module){module.currentState=currentState;}}}
if(!Y.Lang.isUndefined(win.onhashchange)&&(Y.Lang.isUndefined(doc.documentMode)||doc.documentMode>7)){win.onhashchange=function(){var hash=_getHash();_handleFQStateChange(hash);_storeStates();};G.ready=true;H.fire(EV_HISTORY_READY);}else if(_useIFrame){_checkIframeLoaded();}else{hash=_getHash();setInterval(function(){var newHash=_getHash();if(newHash!==hash){hash=newHash;_handleFQStateChange(hash);_storeStates();}},50);G.ready=true;H.fire(EV_HISTORY_READY);}}
H=Y.mix(new Y.EventTarget(),{register:function(moduleId,initialState){var module;if(!Y.Lang.isString(moduleId)||Y.Lang.trim(moduleId)===''||!Y.Lang.isString(initialState)){throw new Error(E_MISSING_OR_INVALID_ARG);}
moduleId=encode(moduleId);initialState=encode(initialState);if(G._modules[moduleId]){return;}
if(G.ready){return null;}
module=new H.Module(moduleId,initialState);G._modules[moduleId]=module;return module;},initialize:function(stateField,historyIFrame){var tagName,type;if(G.ready){return true;}
stateField=Y.one(stateField);if(!stateField){throw new Error(E_MISSING_OR_INVALID_ARG);}
tagName=stateField.get('tagName').toUpperCase();type=stateField.get('type');if(tagName!=='TEXTAREA'&&(tagName!=='INPUT'||type!=='hidden'&&type!=='text')){throw new Error(E_MISSING_OR_INVALID_ARG);}
if(Y.UA.ie&&(Y.Lang.isUndefined(doc.documentMode)||doc.documentMode<8)){_useIFrame=true;historyIFrame=Y.one(historyIFrame);if(!historyIFrame||historyIFrame.get('tagName').toUpperCase()!=='IFRAME'){throw new Error(E_MISSING_OR_INVALID_ARG);}}
if(Y.UA.opera&&!Y.Lang.isUndefined(win.history.navigationMode)){win.history.navigationMode='compatible';}
G._stateField=stateField;G._historyIFrame=historyIFrame;Y.on('domready',_initialize);return true;},navigate:function(moduleId,state){var states;if(!Y.Lang.isString(moduleId)||!Y.Lang.isString(state)){throw new Error(E_MISSING_OR_INVALID_ARG);}
states={};states[moduleId]=state;return H.multiNavigate(states);},multiNavigate:function(states){var newStates=[],fqstate,globalStateChanged=false;if(!G.ready){return false;}
Y.Object.each(G._modules,function(module,moduleId){var state,decodedModuleId=decode(moduleId);if(!states.hasOwnProperty(decodedModuleId)){state=module.currentState;}else{state=encode(states[decodedModuleId]);if(state!==module.upcomingState){module.upcomingState=state;globalStateChanged=true;}}
newStates.push(moduleId+'='+state);});if(!globalStateChanged){return false;}
fqstate=newStates.join('&');if(_useIFrame){return _updateIFrame(fqstate);}else{win.location.hash=fqstate;return true;}},getCurrentState:function(moduleId){var module;if(!Y.Lang.isString(moduleId)){throw new Error(E_MISSING_OR_INVALID_ARG);}
if(!G.ready){return null;}
moduleId=encode(moduleId);module=G._modules[moduleId];if(!module){return null;}
return decode(module.currentState);},getBookmarkedState:function(moduleId){var m,i,h;if(!Y.Lang.isString(moduleId)){throw new Error(E_MISSING_OR_INVALID_ARG);}
moduleId=encode(moduleId);h=win.location.href;i=h.indexOf('#');if(i>=0){h=h.substr(i+1);REGEXP.lastIndex=0;while((m=REGEXP.exec(h))){if(m[1]===moduleId){return decode(m[2]);}}}
return null;},getQueryStringParameter:function(paramName,url){var m,q,i;url=url||win.location.href;i=url.indexOf('?');q=i>=0?url.substr(i+1):url;i=q.lastIndexOf('#');q=i>=0?q.substr(0,i):q;REGEXP.lastIndex=0;while((m=REGEXP.exec(q))){if(m[1]===paramName){return decode(m[2]);}}
return null;}});H.Module=function(id,initialState){this.id=id;this.initialState=initialState;this.currentState=initialState;this.upcomingState=initialState;};Y.augment(H.Module,Y.EventTarget);Y.History=H;},'3.3.0',{skinnable:false,requires:['node-base']});