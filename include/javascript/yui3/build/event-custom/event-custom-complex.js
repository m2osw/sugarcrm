/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('event-custom-complex',function(Y){var FACADE,FACADE_KEYS,EMPTY={},CEProto=Y.CustomEvent.prototype,ETProto=Y.EventTarget.prototype;Y.EventFacade=function(e,currentTarget){e=e||EMPTY;this._event=e;this.details=e.details;this.type=e.type;this._type=e.type;this.target=e.target;this.currentTarget=currentTarget;this.relatedTarget=e.relatedTarget;};Y.extend(Y.EventFacade,Object,{stopPropagation:function(){this._event.stopPropagation();this.stopped=1;},stopImmediatePropagation:function(){this._event.stopImmediatePropagation();this.stopped=2;},preventDefault:function(){this._event.preventDefault();this.prevented=1;},halt:function(immediate){this._event.halt(immediate);this.prevented=1;this.stopped=(immediate)?2:1;}});CEProto.fireComplex=function(args){var es,ef,q,queue,ce,ret,events,subs,postponed,self=this,host=self.host||self,next,oldbubble;if(self.stack){if(self.queuable&&self.type!=self.stack.next.type){self.log('queue '+self.type);self.stack.queue.push([self,args]);return true;}}
es=self.stack||{id:self.id,next:self,silent:self.silent,stopped:0,prevented:0,bubbling:null,type:self.type,afterQueue:new Y.Queue(),defaultTargetOnly:self.defaultTargetOnly,queue:[]};subs=self.getSubs();self.stopped=(self.type!==es.type)?0:es.stopped;self.prevented=(self.type!==es.type)?0:es.prevented;self.target=self.target||host;events=new Y.EventTarget({fireOnce:true,context:host});self.events=events;if(self.preventedFn){events.on('prevented',self.preventedFn);}
if(self.stoppedFn){events.on('stopped',self.stoppedFn);}
self.currentTarget=host;self.details=args.slice();self.log("Firing "+self.type);self._facade=null;ef=self._getFacade(args);if(Y.Lang.isObject(args[0])){args[0]=ef;}else{args.unshift(ef);}
if(subs[0]){self._procSubs(subs[0],args,ef);}
if(self.bubbles&&host.bubble&&!self.stopped){oldbubble=es.bubbling;es.bubbling=self.type;if(es.type!=self.type){es.stopped=0;es.prevented=0;}
ret=host.bubble(self,args,null,es);self.stopped=Math.max(self.stopped,es.stopped);self.prevented=Math.max(self.prevented,es.prevented);es.bubbling=oldbubble;}
if(self.defaultFn&&!self.prevented&&((!self.defaultTargetOnly&&!es.defaultTargetOnly)||host===ef.target)){self.defaultFn.apply(host,args);}
self._broadcast(args);if(subs[1]&&!self.prevented&&self.stopped<2){if(es.id===self.id||self.type!=host._yuievt.bubbling){self._procSubs(subs[1],args,ef);while((next=es.afterQueue.last())){next();}}else{postponed=subs[1];if(es.execDefaultCnt){postponed=Y.merge(postponed);Y.each(postponed,function(s){s.postponed=true;});}
es.afterQueue.add(function(){self._procSubs(postponed,args,ef);});}}
self.target=null;if(es.id===self.id){queue=es.queue;while(queue.length){q=queue.pop();ce=q[0];es.next=ce;ce.fire.apply(ce,q[1]);}
self.stack=null;}
ret=!(self.stopped);if(self.type!=host._yuievt.bubbling){es.stopped=0;es.prevented=0;self.stopped=0;self.prevented=0;}
return ret;};CEProto._getFacade=function(){var ef=this._facade,o,o2,args=this.details;if(!ef){ef=new Y.EventFacade(this,this.currentTarget);}
o=args&&args[0];if(Y.Lang.isObject(o,true)){o2={};Y.mix(o2,ef,true,FACADE_KEYS);Y.mix(ef,o,true);Y.mix(ef,o2,true,FACADE_KEYS);ef.type=o.type||ef.type;}
ef.details=this.details;ef.target=this.originalTarget||this.target;ef.currentTarget=this.currentTarget;ef.stopped=0;ef.prevented=0;this._facade=ef;return this._facade;};CEProto.stopPropagation=function(){this.stopped=1;if(this.stack){this.stack.stopped=1;}
this.events.fire('stopped',this);};CEProto.stopImmediatePropagation=function(){this.stopped=2;if(this.stack){this.stack.stopped=2;}
this.events.fire('stopped',this);};CEProto.preventDefault=function(){if(this.preventable){this.prevented=1;if(this.stack){this.stack.prevented=1;}
this.events.fire('prevented',this);}};CEProto.halt=function(immediate){if(immediate){this.stopImmediatePropagation();}else{this.stopPropagation();}
this.preventDefault();};ETProto.addTarget=function(o){this._yuievt.targets[Y.stamp(o)]=o;this._yuievt.hasTargets=true;};ETProto.getTargets=function(){return Y.Object.values(this._yuievt.targets);};ETProto.removeTarget=function(o){delete this._yuievt.targets[Y.stamp(o)];};ETProto.bubble=function(evt,args,target,es){var targs=this._yuievt.targets,ret=true,t,type=evt&&evt.type,ce,i,bc,ce2,originalTarget=target||(evt&&evt.target)||this,oldbubble;if(!evt||((!evt.stopped)&&targs)){for(i in targs){if(targs.hasOwnProperty(i)){t=targs[i];ce=t.getEvent(type,true);ce2=t.getSibling(type,ce);if(ce2&&!ce){ce=t.publish(type);}
oldbubble=t._yuievt.bubbling;t._yuievt.bubbling=type;if(!ce){if(t._yuievt.hasTargets){t.bubble(evt,args,originalTarget,es);}}else{ce.sibling=ce2;ce.target=originalTarget;ce.originalTarget=originalTarget;ce.currentTarget=t;bc=ce.broadcast;ce.broadcast=false;ce.emitFacade=true;ce.stack=es;ret=ret&&ce.fire.apply(ce,args||evt.details||[]);ce.broadcast=bc;ce.originalTarget=null;if(ce.stopped){break;}}
t._yuievt.bubbling=oldbubble;}}}
return ret;};FACADE=new Y.EventFacade();FACADE_KEYS=Y.Object.keys(FACADE);},'3.3.0',{requires:['event-custom-base']});