/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('node-focusmanager',function(Y){var ACTIVE_DESCENDANT="activeDescendant",ID="id",DISABLED="disabled",TAB_INDEX="tabIndex",FOCUSED="focused",FOCUS_CLASS="focusClass",CIRCULAR="circular",UI="UI",KEY="key",ACTIVE_DESCENDANT_CHANGE=ACTIVE_DESCENDANT+"Change",HOST="host",scrollKeys={37:true,38:true,39:true,40:true},clickableElements={"a":true,"button":true,"input":true,"object":true},Lang=Y.Lang,UA=Y.UA,NodeFocusManager=function(){NodeFocusManager.superclass.constructor.apply(this,arguments);};NodeFocusManager.ATTRS={focused:{value:false,readOnly:true},descendants:{getter:function(value){return this.get(HOST).all(value);}},activeDescendant:{setter:function(value){var isNumber=Lang.isNumber,INVALID_VALUE=Y.Attribute.INVALID_VALUE,descendantsMap=this._descendantsMap,descendants=this._descendants,nodeIndex,returnValue,oNode;if(isNumber(value)){nodeIndex=value;returnValue=nodeIndex;}
else if((value instanceof Y.Node)&&descendantsMap){nodeIndex=descendantsMap[value.get(ID)];if(isNumber(nodeIndex)){returnValue=nodeIndex;}
else{returnValue=INVALID_VALUE;}}
else{returnValue=INVALID_VALUE;}
if(descendants){oNode=descendants.item(nodeIndex);if(oNode&&oNode.get("disabled")){returnValue=INVALID_VALUE;}}
return returnValue;}},keys:{value:{next:null,previous:null}},focusClass:{},circular:{value:true}};Y.extend(NodeFocusManager,Y.Plugin.Base,{_stopped:true,_descendants:null,_descendantsMap:null,_focusedNode:null,_lastNodeIndex:0,_eventHandlers:null,_initDescendants:function(){var descendants=this.get("descendants"),descendantsMap={},nFirstEnabled=-1,nDescendants,nActiveDescendant=this.get(ACTIVE_DESCENDANT),oNode,sID,i=0;if(Lang.isUndefined(nActiveDescendant)){nActiveDescendant=-1;}
if(descendants){nDescendants=descendants.size();for(i=0;i<nDescendants;i++){oNode=descendants.item(i);if(nFirstEnabled===-1&&!oNode.get(DISABLED)){nFirstEnabled=i;}
if(nActiveDescendant<0&&parseInt(oNode.getAttribute(TAB_INDEX,2),10)===0){nActiveDescendant=i;}
if(oNode){oNode.set(TAB_INDEX,-1);}
sID=oNode.get(ID);if(!sID){sID=Y.guid();oNode.set(ID,sID);}
descendantsMap[sID]=i;}
if(nActiveDescendant<0){nActiveDescendant=0;}
oNode=descendants.item(nActiveDescendant);if(!oNode||oNode.get(DISABLED)){oNode=descendants.item(nFirstEnabled);nActiveDescendant=nFirstEnabled;}
this._lastNodeIndex=nDescendants-1;this._descendants=descendants;this._descendantsMap=descendantsMap;this.set(ACTIVE_DESCENDANT,nActiveDescendant);if(oNode){oNode.set(TAB_INDEX,0);}}},_isDescendant:function(node){return(node.get(ID)in this._descendantsMap);},_removeFocusClass:function(){var oFocusedNode=this._focusedNode,focusClass=this.get(FOCUS_CLASS),sClassName;if(focusClass){sClassName=Lang.isString(focusClass)?focusClass:focusClass.className;}
if(oFocusedNode&&sClassName){oFocusedNode.removeClass(sClassName);}},_detachKeyHandler:function(){var prevKeyHandler=this._prevKeyHandler,nextKeyHandler=this._nextKeyHandler;if(prevKeyHandler){prevKeyHandler.detach();}
if(nextKeyHandler){nextKeyHandler.detach();}},_preventScroll:function(event){if(scrollKeys[event.keyCode]&&this._isDescendant(event.target)){event.preventDefault();}},_fireClick:function(event){var oTarget=event.target,sNodeName=oTarget.get("nodeName").toLowerCase();if(event.keyCode===13&&(!clickableElements[sNodeName]||(sNodeName==="a"&&!oTarget.getAttribute("href")))){oTarget.simulate("click");}},_attachKeyHandler:function(){this._detachKeyHandler();var sNextKey=this.get("keys.next"),sPrevKey=this.get("keys.previous"),oNode=this.get(HOST),aHandlers=this._eventHandlers;if(sPrevKey){this._prevKeyHandler=Y.on(KEY,Y.bind(this._focusPrevious,this),oNode,sPrevKey);}
if(sNextKey){this._nextKeyHandler=Y.on(KEY,Y.bind(this._focusNext,this),oNode,sNextKey);}
if(UA.opera){aHandlers.push(oNode.on("keypress",this._preventScroll,this));}
if(!UA.opera){aHandlers.push(oNode.on("keypress",this._fireClick,this));}},_detachEventHandlers:function(){this._detachKeyHandler();var aHandlers=this._eventHandlers;if(aHandlers){Y.Array.each(aHandlers,function(handle){handle.detach();});this._eventHandlers=null;}},_attachEventHandlers:function(){var descendants=this._descendants,aHandlers,oDocument,handle;if(descendants&&descendants.size()){aHandlers=this._eventHandlers||[];oDocument=this.get(HOST).get("ownerDocument");if(aHandlers.length===0){aHandlers.push(oDocument.on("focus",this._onDocFocus,this));aHandlers.push(oDocument.on("mousedown",this._onDocMouseDown,this));aHandlers.push(this.after("keysChange",this._attachKeyHandler));aHandlers.push(this.after("descendantsChange",this._initDescendants));aHandlers.push(this.after(ACTIVE_DESCENDANT_CHANGE,this._afterActiveDescendantChange));handle=this.after("focusedChange",Y.bind(function(event){if(event.newVal){this._attachKeyHandler();handle.detach();}},this));aHandlers.push(handle);}
this._eventHandlers=aHandlers;}},_onDocMouseDown:function(event){var oHost=this.get(HOST),oTarget=event.target,bChildNode=oHost.contains(oTarget),node,getFocusable=function(node){var returnVal=false;if(!node.compareTo(oHost)){returnVal=this._isDescendant(node)?node:getFocusable.call(this,node.get("parentNode"));}
return returnVal;};if(bChildNode){node=getFocusable.call(this,oTarget);if(node){oTarget=node;}
else if(!node&&this.get(FOCUSED)){this._set(FOCUSED,false);this._onDocFocus(event);}}
if(bChildNode&&this._isDescendant(oTarget)){this.focus(oTarget);}
else if(UA.webkit&&this.get(FOCUSED)&&(!bChildNode||(bChildNode&&!this._isDescendant(oTarget)))){this._set(FOCUSED,false);this._onDocFocus(event);}},_onDocFocus:function(event){var oTarget=this._focusTarget||event.target,bFocused=this.get(FOCUSED),focusClass=this.get(FOCUS_CLASS),oFocusedNode=this._focusedNode,bInCollection;if(this._focusTarget){this._focusTarget=null;}
if(this.get(HOST).contains(oTarget)){bInCollection=this._isDescendant(oTarget);if(!bFocused&&bInCollection){bFocused=true;}
else if(bFocused&&!bInCollection){bFocused=false;}}
else{bFocused=false;}
if(focusClass){if(oFocusedNode&&(!oFocusedNode.compareTo(oTarget)||!bFocused)){this._removeFocusClass();}
if(bInCollection&&bFocused){if(focusClass.fn){oTarget=focusClass.fn(oTarget);oTarget.addClass(focusClass.className);}
else{oTarget.addClass(focusClass);}
this._focusedNode=oTarget;}}
this._set(FOCUSED,bFocused);},_focusNext:function(event,activeDescendant){var nActiveDescendant=activeDescendant||this.get(ACTIVE_DESCENDANT),oNode;if(this._isDescendant(event.target)&&(nActiveDescendant<=this._lastNodeIndex)){nActiveDescendant=nActiveDescendant+1;if(nActiveDescendant===(this._lastNodeIndex+1)&&this.get(CIRCULAR)){nActiveDescendant=0;}
oNode=this._descendants.item(nActiveDescendant);if(oNode){if(oNode.get("disabled")){this._focusNext(event,nActiveDescendant);}
else{this.focus(nActiveDescendant);}}}
this._preventScroll(event);},_focusPrevious:function(event,activeDescendant){var nActiveDescendant=activeDescendant||this.get(ACTIVE_DESCENDANT),oNode;if(this._isDescendant(event.target)&&nActiveDescendant>=0){nActiveDescendant=nActiveDescendant-1;if(nActiveDescendant===-1&&this.get(CIRCULAR)){nActiveDescendant=this._lastNodeIndex;}
oNode=this._descendants.item(nActiveDescendant);if(oNode){if(oNode.get("disabled")){this._focusPrevious(event,nActiveDescendant);}
else{this.focus(nActiveDescendant);}}}
this._preventScroll(event);},_afterActiveDescendantChange:function(event){var oNode=this._descendants.item(event.prevVal);if(oNode){oNode.set(TAB_INDEX,-1);}
oNode=this._descendants.item(event.newVal);if(oNode){oNode.set(TAB_INDEX,0);}},initializer:function(config){this.start();},destructor:function(){this.stop();this.get(HOST).focusManager=null;},focus:function(index){if(Lang.isUndefined(index)){index=this.get(ACTIVE_DESCENDANT);}
this.set(ACTIVE_DESCENDANT,index,{src:UI});var oNode=this._descendants.item(this.get(ACTIVE_DESCENDANT));if(oNode){oNode.focus();if(UA.opera&&oNode.get("nodeName").toLowerCase()==="button"){this._focusTarget=oNode;}}},blur:function(){var oNode;if(this.get(FOCUSED)){oNode=this._descendants.item(this.get(ACTIVE_DESCENDANT));if(oNode){oNode.blur();this._removeFocusClass();}
this._set(FOCUSED,false,{src:UI});}},start:function(){if(this._stopped){this._initDescendants();this._attachEventHandlers();this._stopped=false;}},stop:function(){if(!this._stopped){this._detachEventHandlers();this._descendants=null;this._focusedNode=null;this._lastNodeIndex=0;this._stopped=true;}},refresh:function(){this._initDescendants();if(!this._eventHandlers){this._attachEventHandlers();}}});NodeFocusManager.NAME="nodeFocusManager";NodeFocusManager.NS="focusManager";Y.namespace("Plugin");Y.Plugin.NodeFocusManager=NodeFocusManager;},'3.3.0',{requires:['attribute','node','plugin','node-event-simulate','event-key','event-focus']});