/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('dd-proxy',function(Y){var DDM=Y.DD.DDM,NODE='node',DRAG_NODE='dragNode',HOST='host',TRUE=true,proto,P=function(config){P.superclass.constructor.apply(this,arguments);};P.NAME='DDProxy';P.NS='proxy';P.ATTRS={host:{},moveOnEnd:{value:TRUE},hideOnEnd:{value:TRUE},resizeFrame:{value:TRUE},positionProxy:{value:TRUE},borderStyle:{value:'1px solid #808080'},cloneNode:{value:false}};proto={_hands:null,_init:function(){if(!DDM._proxy){DDM._createFrame();Y.on('domready',Y.bind(this._init,this));return;}
if(!this._hands){this._hands=[];}
var h,h1,host=this.get(HOST),dnode=host.get(DRAG_NODE);if(dnode.compareTo(host.get(NODE))){if(DDM._proxy){host.set(DRAG_NODE,DDM._proxy);}}
Y.each(this._hands,function(v){v.detach();});h=DDM.on('ddm:start',Y.bind(function(){if(DDM.activeDrag===host){DDM._setFrame(host);}},this));h1=DDM.on('ddm:end',Y.bind(function(){if(host.get('dragging')){if(this.get('moveOnEnd')){host.get(NODE).setXY(host.lastXY);}
if(this.get('hideOnEnd')){host.get(DRAG_NODE).setStyle('display','none');}
if(this.get('cloneNode')){host.get(DRAG_NODE).remove();host.set(DRAG_NODE,DDM._proxy);}}},this));this._hands=[h,h1];},initializer:function(){this._init();},destructor:function(){var host=this.get(HOST);Y.each(this._hands,function(v){v.detach();});host.set(DRAG_NODE,host.get(NODE));},clone:function(){var host=this.get(HOST),n=host.get(NODE),c=n.cloneNode(true);delete c._yuid;c.setAttribute('id',Y.guid());c.setStyle('position','absolute');n.get('parentNode').appendChild(c);host.set(DRAG_NODE,c);return c;}};Y.namespace('Plugin');Y.extend(P,Y.Base,proto);Y.Plugin.DDProxy=P;Y.mix(DDM,{_createFrame:function(){if(!DDM._proxy){DDM._proxy=TRUE;var p=Y.Node.create('<div></div>'),b=Y.one('body');p.setStyles({position:'absolute',display:'none',zIndex:'999',top:'-999px',left:'-999px'});b.prepend(p);p.set('id',Y.guid());p.addClass(DDM.CSS_PREFIX+'-proxy');DDM._proxy=p;}},_setFrame:function(drag){var n=drag.get(NODE),d=drag.get(DRAG_NODE),ah,cur='auto';ah=DDM.activeDrag.get('activeHandle');if(ah){cur=ah.getStyle('cursor');}
if(cur=='auto'){cur=DDM.get('dragCursor');}
d.setStyles({visibility:'hidden',display:'block',cursor:cur,border:drag.proxy.get('borderStyle')});if(drag.proxy.get('cloneNode')){d=drag.proxy.clone();}
if(drag.proxy.get('resizeFrame')){d.setStyles({height:n.get('offsetHeight')+'px',width:n.get('offsetWidth')+'px'});}
if(drag.proxy.get('positionProxy')){d.setXY(drag.nodeXY);}
d.setStyle('visibility','visible');}});},'3.3.0',{requires:['dd-ddm','dd-drag'],skinnable:false});