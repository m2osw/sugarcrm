/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('event-flick',function(Y){var EVENT=("ontouchstart"in Y.config.win&&!Y.UA.chrome)?{start:"touchstart",end:"touchend"}:{start:"mousedown",end:"mouseup"},START="start",END="end",OWNER_DOCUMENT="ownerDocument",MIN_VELOCITY="minVelocity",MIN_DISTANCE="minDistance",PREVENT_DEFAULT="preventDefault",_FLICK_START="_fs",_FLICK_START_HANDLE="_fsh",_FLICK_END_HANDLE="_feh",NODE_TYPE="nodeType";Y.Event.define('flick',{on:function(node,subscriber,ce){var startHandle=node.on(EVENT[START],this._onStart,this,node,subscriber,ce);subscriber[_FLICK_START_HANDLE]=startHandle;},detach:function(node,subscriber,ce){var startHandle=subscriber[_FLICK_START_HANDLE],endHandle=subscriber[_FLICK_END_HANDLE];if(startHandle){startHandle.detach();subscriber[_FLICK_START_HANDLE]=null;}
if(endHandle){endHandle.detach();subscriber[_FLICK_END_HANDLE]=null;}},processArgs:function(args){var params=(args.length>3)?Y.merge(args.splice(3,1)[0]):{};if(!(MIN_VELOCITY in params)){params[MIN_VELOCITY]=this.MIN_VELOCITY;}
if(!(MIN_DISTANCE in params)){params[MIN_DISTANCE]=this.MIN_DISTANCE;}
if(!(PREVENT_DEFAULT in params)){params[PREVENT_DEFAULT]=this.PREVENT_DEFAULT;}
return params;},_onStart:function(e,node,subscriber,ce){var start=true,endHandle,doc,preventDefault=subscriber._extra.preventDefault,origE=e;if(e.touches){start=(e.touches.length===1);e=e.touches[0];}
if(start){if(preventDefault){if(!preventDefault.call||preventDefault(e)){origE.preventDefault();}}
e.flick={time:new Date().getTime()};subscriber[_FLICK_START]=e;endHandle=subscriber[_FLICK_END_HANDLE];if(!endHandle){doc=(node.get(NODE_TYPE)===9)?node:node.get(OWNER_DOCUMENT);endHandle=doc.on(EVENT[END],Y.bind(this._onEnd,this),null,node,subscriber,ce);subscriber[_FLICK_END_HANDLE]=endHandle;}}},_onEnd:function(e,node,subscriber,ce){var endTime=new Date().getTime(),start=subscriber[_FLICK_START],valid=!!start,endEvent=e,startTime,time,preventDefault,params,xyDistance,distance,velocity,axis;if(valid){if(e.changedTouches){if(e.changedTouches.length===1&&e.touches.length===0){endEvent=e.changedTouches[0];}else{valid=false;}}
if(valid){params=subscriber._extra;preventDefault=params[PREVENT_DEFAULT];if(preventDefault){if(!preventDefault.call||preventDefault(e)){endEvent.preventDefault();}}
startTime=start.flick.time;endTime=new Date().getTime();time=endTime-startTime;xyDistance=[endEvent.pageX-start.pageX,endEvent.pageY-start.pageY];if(params.axis){axis=params.axis;}else{axis=(Math.abs(xyDistance[0])>=Math.abs(xyDistance[1]))?'x':'y';}
distance=xyDistance[(axis==='x')?0:1];velocity=(time!==0)?distance/time:0;if(isFinite(velocity)&&(Math.abs(distance)>=params[MIN_DISTANCE])&&(Math.abs(velocity)>=params[MIN_VELOCITY])){e.type="flick";e.flick={time:time,distance:distance,velocity:velocity,axis:axis,start:start};ce.fire(e);}
subscriber[_FLICK_START]=null;}}},MIN_VELOCITY:0,MIN_DISTANCE:0,PREVENT_DEFAULT:false});},'3.3.0',{requires:['node-base','event-touch','event-synthetic']});