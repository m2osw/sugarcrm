/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('swf',function(Y){var Event=Y.Event,SWFDetect=Y.SWFDetect,Lang=Y.Lang,uA=Y.UA,Node=Y.Node,FLASH_CID="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",FLASH_TYPE="application/x-shockwave-flash",FLASH_VER="10.0.22",EXPRESS_INSTALL_URL="http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?"+Math.random(),EVENT_HANDLER="SWF.eventHandler",possibleAttributes={align:"",allowFullScreen:"",allowNetworking:"",allowScriptAccess:"",base:"",bgcolor:"",menu:"",name:"",quality:"",salign:"",scale:"",tabindex:"",wmode:""};function SWF(p_oElement,swfURL,p_oAttributes){this._id=Y.guid("yuiswf");var _id=this._id;var oElement=Node.one(p_oElement);var flashVersion=p_oAttributes["version"]||FLASH_VER;var flashVersionSplit=(flashVersion+'').split(".");var isFlashVersionRight=SWFDetect.isFlashVersionAtLeast(parseInt(flashVersionSplit[0]),parseInt(flashVersionSplit[1]),parseInt(flashVersionSplit[2]));var canExpressInstall=(SWFDetect.isFlashVersionAtLeast(8,0,0));var shouldExpressInstall=canExpressInstall&&!isFlashVersionRight&&p_oAttributes["useExpressInstall"];var flashURL=(shouldExpressInstall)?EXPRESS_INSTALL_URL:swfURL;var objstring='<object ';var w,h;var flashvarstring="yId="+Y.id+"&YUISwfId="+_id+"&YUIBridgeCallback="+EVENT_HANDLER+"&allowedDomain="+document.location.hostname;Y.SWF._instances[_id]=this;if(oElement&&(isFlashVersionRight||shouldExpressInstall)&&flashURL){objstring+='id="'+_id+'" ';if(uA.ie){objstring+='classid="'+FLASH_CID+'" ';}
else{objstring+='type="'+FLASH_TYPE+'" data="'+flashURL+'" ';}
w="100%";h="100%";objstring+='width="'+w+'" height="'+h+'">';if(uA.ie){objstring+='<param name="movie" value="'+flashURL+'"/>';}
for(var attribute in p_oAttributes.fixedAttributes){if(possibleAttributes.hasOwnProperty(attribute)){objstring+='<param name="'+attribute+'" value="'+p_oAttributes.fixedAttributes[attribute]+'"/>';}}
for(var flashvar in p_oAttributes.flashVars){var fvar=p_oAttributes.flashVars[flashvar];if(Lang.isString(fvar)){flashvarstring+="&"+flashvar+"="+encodeURIComponent(fvar);}}
if(flashvarstring){objstring+='<param name="flashVars" value="'+flashvarstring+'"/>';}
objstring+="</object>";oElement.setContent(objstring);this._swf=Node.one("#"+_id);}
else{var event={};event.type="wrongflashversion";this.publish("wrongflashversion",{fireOnce:true});this.fire("wrongflashversion",event);}};SWF._instances=SWF._instances||{};SWF.eventHandler=function(swfid,event){SWF._instances[swfid]._eventHandler(event);};SWF.prototype={_eventHandler:function(event)
{if(event.type==="swfReady")
{this.publish("swfReady",{fireOnce:true});this.fire("swfReady",event);}
else if(event.type==="log")
{}
else
{this.fire(event.type,event);}},callSWF:function(func,args)
{if(!args){args=[];};if(this._swf._node[func]){return(this._swf._node[func].apply(this._swf._node,args));}else{return null;}},toString:function()
{return"SWF "+this._id;}};Y.augment(SWF,Y.EventTarget);Y.SWF=SWF;},'3.3.0');