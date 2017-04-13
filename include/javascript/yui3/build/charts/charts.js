/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('charts',function(Y){var ISCHROME=Y.UA.chrome,DRAWINGAPI,canvas=document.createElement("canvas");if(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"))
{DRAWINGAPI="svg";}
else if(canvas&&canvas.getContext&&canvas.getContext("2d"))
{DRAWINGAPI="canvas";}
else
{DRAWINGAPI="vml";}
var Graphic=function(config){this.initializer.apply(this,arguments);};Graphic.prototype={autoSize:true,initializer:function(config){config=config||{};var w=config.width||0,h=config.height||0;if(config.node)
{this.node=config.node;this._styleGroup(this.node);}
else
{this.node=this._createGraphics();this.setSize(w,h);}
this._initProps();},beginBitmapFill:function(config){var fill={};fill.src=config.bitmap.src;fill.type="tile";this._fillProps=fill;if(!isNaN(config.tx)||!isNaN(config.ty)||!isNaN(config.width)||!isNaN(config.height))
{this._gradientBox={tx:config.tx,ty:config.ty,width:config.width,height:config.height};}
else
{this._gradientBox=null;}},beginFill:function(color,alpha){if(color){this._fillAlpha=Y.Lang.isNumber(alpha)?alpha:1;this._fillColor=color;this._fillType='solid';this._fill=1;}
return this;},beginGradientFill:function(config){var alphas=config.alphas||[];if(!this._defs)
{this._defs=this._createGraphicNode("defs");this.node.appendChild(this._defs);}
this._fillAlphas=alphas;this._fillColors=config.colors;this._fillType=config.type||"linear";this._fillRatios=config.ratios||[];this._fillRotation=config.rotation||0;this._fillWidth=config.width||null;this._fillHeight=config.height||null;this._fillX=!isNaN(config.tx)?config.tx:NaN;this._fillY=!isNaN(config.ty)?config.ty:NaN;this._gradientId="lg"+Math.round(100000*Math.random());return this;},destroy:function()
{this._removeChildren(this.node);if(this.node&&this.node.parentNode)
{this.node.parentNode.removeChild(this.node);}},_removeChildren:function(node)
{if(node.hasChildNodes())
{var child;while(node.firstChild)
{child=node.firstChild;this._removeChildren(child);node.removeChild(child);}}},toggleVisible:function(val)
{this._toggleVisible(this.node,val);},_toggleVisible:function(node,val)
{var children=Y.Selector.query(">/*",node),visibility=val?"visible":"hidden",i=0,len;if(children)
{len=children.length;for(;i<len;++i)
{this._toggleVisible(children[i],val);}}
node.style.visibility=visibility;},clear:function(){if(this._graphicsList)
{while(this._graphicsList.length>0)
{this.node.removeChild(this._graphicsList.shift());}}
this.path='';},curveTo:function(cp1x,cp1y,cp2x,cp2y,x,y){this._shapeType="path";if(this.path.indexOf("C")<0||this._pathType!=="C")
{this._pathType="C";this.path+=' C';}
this.path+=Math.round(cp1x)+", "+Math.round(cp1y)+", "+Math.round(cp2x)+", "+Math.round(cp2y)+", "+x+", "+y+" ";this._trackSize(x,y);},quadraticCurveTo:function(cpx,cpy,x,y){if(this.path.indexOf("Q")<0||this._pathType!=="Q")
{this._pathType="Q";this.path+=" Q";}
this.path+=Math.round(cpx)+" "+Math.round(cpy)+" "+Math.round(x)+" "+Math.round(y);},drawCircle:function(x,y,r){this._shape={x:x-r,y:y-r,w:r*2,h:r*2};this._attributes={cx:x,cy:y,r:r};this._width=this._height=r*2;this._x=x-r;this._y=y-r;this._shapeType="circle";this._draw();},drawEllipse:function(x,y,w,h){this._shape={x:x,y:y,w:w,h:h};this._width=w;this._height=h;this._x=x;this._y=y;this._shapeType="ellipse";this._draw();},drawRect:function(x,y,w,h){this._shape={x:x,y:y,w:w,h:h};this._x=x;this._y=y;this._width=w;this._height=h;this.moveTo(x,y);this.lineTo(x+w,y);this.lineTo(x+w,y+h);this.lineTo(x,y+h);this.lineTo(x,y);this._draw();},drawRoundRect:function(x,y,w,h,ew,eh){this._shape={x:x,y:y,w:w,h:h};this._x=x;this._y=y;this._width=w;this._height=h;this.moveTo(x,y+eh);this.lineTo(x,y+h-eh);this.quadraticCurveTo(x,y+h,x+ew,y+h);this.lineTo(x+w-ew,y+h);this.quadraticCurveTo(x+w,y+h,x+w,y+h-eh);this.lineTo(x+w,y+eh);this.quadraticCurveTo(x+w,y,x+w-ew,y);this.lineTo(x+ew,y);this.quadraticCurveTo(x,y,x,y+eh);this._draw();},drawWedge:function(x,y,startAngle,arc,radius,yRadius)
{this._drawingComplete=false;this.path=this._getWedgePath({x:x,y:y,startAngle:startAngle,arc:arc,radius:radius,yRadius:yRadius});this._width=radius*2;this._height=this._width;this._shapeType="path";this._draw();},end:function(){if(this._shapeType)
{this._draw();}
this._initProps();},lineGradientStyle:function(){},lineStyle:function(thickness,color,alpha,pixelHinting,scaleMode,caps,joints,miterLimit){this._stroke=1;this._strokeWeight=thickness;if(color){this._strokeColor=color;}
this._strokeAlpha=Y.Lang.isNumber(alpha)?alpha:1;},lineTo:function(point1,point2,etc){var args=arguments,i,len;if(typeof point1==='string'||typeof point1==='number'){args=[[point1,point2]];}
len=args.length;this._shapeType="path";if(this.path.indexOf("L")<0||this._pathType!=="L")
{this._pathType="L";this.path+=' L';}
for(i=0;i<len;++i){this.path+=args[i][0]+', '+args[i][1]+" ";this._trackSize.apply(this,args[i]);}},moveTo:function(x,y){this._pathType="M";this.path+=' M'+x+', '+y;},_getWedgePath:function(config)
{var x=config.x,y=config.y,startAngle=config.startAngle,arc=config.arc,radius=config.radius,yRadius=config.yRadius||radius,segs,segAngle,theta,angle,angleMid,ax,ay,bx,by,cx,cy,i=0,path=' M'+x+', '+y;if(Math.abs(arc)>360)
{arc=360;}
segs=Math.ceil(Math.abs(arc)/ 45);segAngle=arc / segs;theta=-(segAngle / 180)*Math.PI;angle=(startAngle / 180)*Math.PI;if(segs>0)
{ax=x+Math.cos(startAngle / 180*Math.PI)*radius;ay=y+Math.sin(startAngle / 180*Math.PI)*yRadius;path+=" L"+Math.round(ax)+", "+Math.round(ay);path+=" Q";for(;i<segs;++i)
{angle+=theta;angleMid=angle-(theta / 2);bx=x+Math.cos(angle)*radius;by=y+Math.sin(angle)*yRadius;cx=x+Math.cos(angleMid)*(radius / Math.cos(theta / 2));cy=y+Math.sin(angleMid)*(yRadius / Math.cos(theta / 2));path+=Math.round(cx)+" "+Math.round(cy)+" "+Math.round(bx)+" "+Math.round(by)+" ";}
path+=' L'+x+", "+y;}
return path;},setSize:function(w,h){if(this.autoSize)
{if(w>this.node.getAttribute("width"))
{this.node.setAttribute("width",w);}
if(h>this.node.getAttribute("height"))
{this.node.setAttribute("height",h);}}},_trackSize:function(w,h){if(w>this._width){this._width=w;}
if(h>this._height){this._height=h;}
this.setSize(w,h);},setPosition:function(x,y)
{this.node.setAttribute("x",x);this.node.setAttribute("y",y);},render:function(parentNode){var w=parentNode.get("width")||parentNode.get("offsetWidth"),h=parentNode.get("height")||parentNode.get("offsetHeight");parentNode=parentNode||Y.config.doc.body;parentNode.appendChild(this.node);this.setSize(w,h);this._initProps();return this;},_initProps:function(){this._shape=null;this._fillColor=null;this._strokeColor=null;this._strokeWeight=0;this._fillProps=null;this._fillAlphas=null;this._fillColors=null;this._fillType=null;this._fillRatios=null;this._fillRotation=null;this._fillWidth=null;this._fillHeight=null;this._fillX=NaN;this._fillY=NaN;this.path='';this._width=0;this._height=0;this._x=0;this._y=0;this._fill=null;this._stroke=0;this._stroked=false;this._pathType=null;this._attributes={};},_clearPath:function()
{this._shape=null;this._shapeType=null;this.path='';this._width=0;this._height=0;this._x=0;this._y=0;this._pathType=null;this._attributes={};},_draw:function()
{var shape=this._createGraphicNode(this._shapeType),i,gradFill;if(this.path)
{if(this._fill)
{this.path+='z';}
shape.setAttribute("d",this.path);}
else
{for(i in this._attributes)
{if(this._attributes.hasOwnProperty(i))
{shape.setAttribute(i,this._attributes[i]);}}}
shape.setAttribute("stroke-width",this._strokeWeight);if(this._strokeColor)
{shape.setAttribute("stroke",this._strokeColor);shape.setAttribute("stroke-opacity",this._strokeAlpha);}
if(!this._fillType||this._fillType==="solid")
{if(this._fillColor)
{shape.setAttribute("fill",this._fillColor);shape.setAttribute("fill-opacity",this._fillAlpha);}
else
{shape.setAttribute("fill","none");}}
else if(this._fillType==="linear")
{gradFill=this._getFill();gradFill.setAttribute("id",this._gradientId);this._defs.appendChild(gradFill);shape.setAttribute("fill","url(#"+this._gradientId+")");}
this.node.appendChild(shape);this._clearPath();},_getFill:function(){var type=this._fillType,fill;switch(type){case'linear':fill=this._getLinearGradient('fill');break;case'radial':break;case'bitmap':break;}
return fill;},_getLinearGradient:function(type){var fill=this._createGraphicNode("linearGradient"),prop='_'+type,colors=this[prop+'Colors'],ratios=this[prop+'Ratios'],alphas=this[prop+'Alphas'],w=this._fillWidth||(this._shape.w),h=this._fillHeight||(this._shape.h),r=this[prop+'Rotation'],i,l,color,ratio,alpha,def,stop,x1,x2,y1,y2,cx=w/2,cy=h/2,radCon,tanRadians;radCon=Math.PI/180;tanRadians=parseFloat(parseFloat(Math.tan(r*radCon)).toFixed(8));if(Math.abs(tanRadians)*w/2>=h/2)
{if(r<180)
{y1=0;y2=h;}
else
{y1=h;y2=0;}
x1=cx-((cy-y1)/tanRadians);x2=cx-((cy-y2)/tanRadians);}
else
{if(r>90&&r<270)
{x1=w;x2=0;}
else
{x1=0;x2=w;}
y1=((tanRadians*(cx-x1))-cy)*-1;y2=((tanRadians*(cx-x2))-cy)*-1;}
fill.setAttribute("gradientTransform","rotate("+r+")");fill.setAttribute("width",w);fill.setAttribute("height",h);fill.setAttribute("gradientUnits","userSpaceOnUse");l=colors.length;def=0;for(i=0;i<l;++i)
{alpha=alphas[i];color=colors[i];ratio=ratios[i]||i/(l-1);ratio=Math.round(ratio*100)+"%";alpha=Y.Lang.isNumber(alpha)?alpha:"1";def=(i+1)/ l;stop=this._createGraphicNode("stop");stop.setAttribute("offset",ratio);stop.setAttribute("stop-color",color);stop.setAttribute("stop-opacity",alpha);fill.appendChild(stop);}
return fill;},_createGraphics:function(){var group=this._createGraphicNode("svg");this._styleGroup(group);return group;},_styleGroup:function(group)
{group.style.position="absolute";group.style.top="0px";group.style.overflow="visible";group.style.left="0px";group.setAttribute("pointer-events","none");},_createGraphicNode:function(type,pe)
{var node=document.createElementNS("http://www.w3.org/2000/svg","svg:"+type),v=pe||"none";if(type!=="defs"&&type!=="stop"&&type!=="linearGradient")
{node.setAttribute("pointer-events",v);}
if(type!="svg")
{if(!this._graphicsList)
{this._graphicsList=[];}
this._graphicsList.push(node);}
return node;},getShape:function(config){config.graphic=this;return new Y.Shape(config);}};Y.Graphic=Graphic;function CanvasDrawingUtil()
{this.initializer.apply(this,arguments);}
CanvasDrawingUtil.prototype={initializer:function(config){this._dummy=this._createDummy();this._canvas=this._createGraphic();this._context=this._canvas.getContext('2d');this._initProps();},beginBitmapFill:function(config){var context=this._context,bitmap=config.bitmap,repeat=config.repeat||'repeat';this._fillWidth=config.width||null;this._fillHeight=config.height||null;this._fillX=!isNaN(config.tx)?config.tx:NaN;this._fillY=!isNaN(config.ty)?config.ty:NaN;this._fillType='bitmap';this._bitmapFill=context.createPattern(bitmap,repeat);return this;},beginFill:function(color,alpha){var context=this._context;context.beginPath();if(color){if(alpha){color=this._2RGBA(color,alpha);}else{color=this._2RGB(color);}
this._fillColor=color;this._fillType='solid';}
return this;},beginGradientFill:function(config){var color,alpha,i=0,colors=config.colors,alphas=config.alphas||[],len=colors.length;this._fillAlphas=alphas;this._fillColors=colors;this._fillType=config.type||"linear";this._fillRatios=config.ratios||[];this._fillRotation=config.rotation||0;this._fillWidth=config.width||null;this._fillHeight=config.height||null;this._fillX=!isNaN(config.tx)?config.tx:NaN;this._fillY=!isNaN(config.ty)?config.ty:NaN;for(;i<len;++i)
{alpha=alphas[i];color=colors[i];if(alpha){color=this._2RGBA(color,alpha);}else{color=this._2RGB(color);}
colors[i]=color;}
this._context.beginPath();return this;},lineStyle:function(thickness,color,alpha,pixelHinting,scaleMode,caps,joints,miterLimit){color=color||'#000000';var context=this._context;if(this._stroke)
{context.stroke();}
context.lineWidth=thickness;if(thickness){this._stroke=1;}else{this._stroke=0;}
if(color){this._strokeStyle=color;if(alpha){this._strokeStyle=this._2RGBA(this._strokeStyle,alpha);}}
if(!this._fill)
{context.beginPath();}
if(caps==='butt'){caps='none';}
if(context.lineCap){}
this._drawingComplete=false;return this;},lineTo:function(point1,point2,etc){var args=arguments,context=this._context,i,len;if(typeof point1==='string'||typeof point1==='number'){args=[[point1,point2]];}
for(i=0,len=args.length;i<len;++i){context.lineTo(args[i][0],args[i][1]);this._updateShapeProps.apply(this,args[i]);this._trackSize.apply(this,args[i]);}
this._drawingComplete=false;return this;},moveTo:function(x,y){this._context.moveTo(x,y);this._trackPos(x,y);this._updateShapeProps(x,y);this._drawingComplete=false;return this;},clear:function(){this._initProps();this._canvas.width=this._canvas.width;this._canvas.height=this._canvas.height;return this;},curveTo:function(cp1x,cp1y,cp2x,cp2y,x,y){this._context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);this._drawingComplete=false;this._updateShapeProps(x,y);this._trackSize(x,y);this._trackPos(x,y);return this;},quadraticCurveTo:function(controlX,controlY,anchorX,anchorY){this._context.quadraticCurveTo(controlX,controlY,anchorX,anchorY);this._drawingComplete=false;this._updateShapeProps(anchorX,anchorY);return this;},drawCircle:function(x,y,radius){var context=this._context,startAngle=0,endAngle=2*Math.PI;this._shape={x:x-radius,y:y-radius,w:radius*2,h:radius*2};this._drawingComplete=false;this._trackPos(x,y);this._trackSize(radius*2,radius*2);context.beginPath();context.arc(x,y,radius,startAngle,endAngle,false);this._draw();return this;},drawEllipse:function(x,y,w,h){this._shape={x:x,y:y,w:w,h:h};if(this._stroke&&this._context.lineWidth>0)
{w-=this._context.lineWidth*2;h-=this._context.lineWidth*2;x+=this._context.lineWidth;y+=this._context.lineWidth;}
var context=this._context,l=8,theta=-(45/180)*Math.PI,angle=0,angleMid,radius=w/2,yRadius=h/2,i=0,centerX=x+radius,centerY=y+yRadius,ax,ay,bx,by,cx,cy;this._drawingComplete=false;this._trackPos(x,y);this._trackSize(x+w,y+h);context.beginPath();ax=centerX+Math.cos(0)*radius;ay=centerY+Math.sin(0)*yRadius;context.moveTo(ax,ay);for(;i<l;i++)
{angle+=theta;angleMid=angle-(theta / 2);bx=centerX+Math.cos(angle)*radius;by=centerY+Math.sin(angle)*yRadius;cx=centerX+Math.cos(angleMid)*(radius / Math.cos(theta / 2));cy=centerY+Math.sin(angleMid)*(yRadius / Math.cos(theta / 2));context.quadraticCurveTo(cx,cy,bx,by);}
this._draw();return this;},drawRect:function(x,y,w,h){var ctx=this._context;this._shape={x:x,y:y,w:w,h:h};this._drawingComplete=false;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y);this._trackPos(x,y);this._trackSize(w,h);this._draw();return this;},drawRoundRect:function(x,y,w,h,ew,eh){this._shape={x:x,y:y,w:w,h:h};var ctx=this._context;this._drawingComplete=false;ctx.beginPath();ctx.moveTo(x,y+eh);ctx.lineTo(x,y+h-eh);ctx.quadraticCurveTo(x,y+h,x+ew,y+h);ctx.lineTo(x+w-ew,y+h);ctx.quadraticCurveTo(x+w,y+h,x+w,y+h-eh);ctx.lineTo(x+w,y+eh);ctx.quadraticCurveTo(x+w,y,x+w-ew,y);ctx.lineTo(x+ew,y);ctx.quadraticCurveTo(x,y,x,y+eh);this._trackPos(x,y);this._trackSize(w,h);this._draw();return this;},drawWedge:function(cfg)
{var x=cfg.x,y=cfg.y,startAngle=cfg.startAngle,arc=cfg.arc,radius=cfg.radius,yRadius=cfg.yRadius,segs,segAngle,theta,angle,angleMid,ax,ay,bx,by,cx,cy,i=0;this._drawingComplete=false;this.moveTo(x,y);yRadius=yRadius||radius;if(Math.abs(arc)>360)
{arc=360;}
segs=Math.ceil(Math.abs(arc)/ 45);segAngle=arc / segs;theta=-(segAngle / 180)*Math.PI;angle=(startAngle / 180)*Math.PI;if(segs>0)
{ax=x+Math.cos(startAngle / 180*Math.PI)*radius;ay=y+Math.sin(startAngle / 180*Math.PI)*yRadius;this.lineTo(ax,ay);for(;i<segs;++i)
{angle+=theta;angleMid=angle-(theta / 2);bx=x+Math.cos(angle)*radius;by=y+Math.sin(angle)*yRadius;cx=x+Math.cos(angleMid)*(radius / Math.cos(theta / 2));cy=y+Math.sin(angleMid)*(yRadius / Math.cos(theta / 2));this.quadraticCurveTo(cx,cy,bx,by);}
this.lineTo(x,y);}
this._trackPos(x,y);this._trackSize(radius,radius);this._draw();},end:function(){this._draw();this._initProps();return this;},lineGradientStyle:function(){return this;},setSize:function(w,h)
{this._canvas.width=w;this._canvas.height=h;},_initProps:function(){var context=this._context;context.fillStyle='rgba(0, 0, 0, 1)';context.lineWidth=1;context.lineJoin='miter';context.miterLimit=3;this._strokeStyle='rgba(0, 0, 0, 1)';this._width=0;this._height=0;this._x=0;this._y=0;this._fillType=null;this._stroke=null;this._bitmapFill=null;this._drawingComplete=false;},_getFill:function(){var type=this._fillType,fill;switch(type){case'linear':fill=this._getLinearGradient('fill');break;case'radial':fill=this._getRadialGradient('fill');break;case'bitmap':fill=this._bitmapFill;break;case'solid':fill=this._fillColor;break;}
return fill;},_getLinearGradient:function(type){var prop='_'+type,colors=this[prop+'Colors'],ratios=this[prop+'Ratios'],x=!isNaN(this._fillX)?this._fillX:this._shape.x,y=!isNaN(this._fillY)?this._fillY:this._shape.y,w=this._fillWidth||(this._shape.w),h=this._fillHeight||(this._shape.h),ctx=this._context,r=this[prop+'Rotation'],i,l,color,ratio,def,grad,x1,x2,y1,y2,cx=x+w/2,cy=y+h/2,radCon=Math.PI/180,tanRadians=parseFloat(parseFloat(Math.tan(r*radCon)).toFixed(8));if(Math.abs(tanRadians)*w/2>=h/2)
{if(r<180)
{y1=y;y2=y+h;}
else
{y1=y+h;y2=y;}
x1=cx-((cy-y1)/tanRadians);x2=cx-((cy-y2)/tanRadians);}
else
{if(r>90&&r<270)
{x1=x+w;x2=x;}
else
{x1=x;x2=x+w;}
y1=((tanRadians*(cx-x1))-cy)*-1;y2=((tanRadians*(cx-x2))-cy)*-1;}
grad=ctx.createLinearGradient(x1,y1,x2,y2);l=colors.length;def=0;for(i=0;i<l;++i)
{color=colors[i];ratio=ratios[i]||i/(l-1);grad.addColorStop(ratio,color);def=(i+1)/ l;}
return grad;},_getRadialGradient:function(type){var prop='_'+type,colors=this[prop+"Colors"],ratios=this[prop+"Ratios"],i,l,w=this._fillWidth||this._shape.w,h=this._fillHeight||this._shape.h,x=!isNaN(this._fillX)?this._fillX:this._shape.x,y=!isNaN(this._fillY)?this._fillY:this._shape.y,color,ratio,def,grad,ctx=this._context;x+=w/2;y+=h/2;grad=ctx.createRadialGradient(x,y,1,x,y,w/2);l=colors.length;def=0;for(i=0;i<l;++i){color=colors[i];ratio=ratios[i]||i/(l-1);grad.addColorStop(ratio,color);}
return grad;},_draw:function()
{if(this._drawingComplete||!this._shape)
{return;}
var context=this._context,fill;if(this._fillType){fill=this._getFill();if(fill){context.fillStyle=fill;}
context.closePath();}
if(this._fillType){context.fill();}
if(this._stroke){context.strokeStyle=this._strokeStyle;context.stroke();}
this._drawingComplete=true;},_drawingComplete:false,_reHex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,_2RGBA:function(val,alpha){alpha=(alpha!==undefined)?alpha:1;if(this._reHex.exec(val)){val='rgba('+[parseInt(RegExp.$1,16),parseInt(RegExp.$2,16),parseInt(RegExp.$3,16)].join(',')+','+alpha+')';}
return val;},_createDummy:function(){var dummy=Y.config.doc.createElement('div');dummy.style.height=0;dummy.style.width=0;dummy.style.overflow='hidden';Y.config.doc.documentElement.appendChild(dummy);return dummy;},_createGraphic:function(config){var graphic=Y.config.doc.createElement('canvas');graphic.width=600;graphic.height=600;return graphic;},_2RGB:function(val){this._dummy.style.background=val;return this._dummy.style.backgroundColor;},_trackSize:function(w,h){if(w>this._width){this._width=w;}
if(h>this._height){this._height=h;}},_trackPos:function(x,y){if(x>this._x){this._x=x;}
if(y>this._y){this._y=y;}},_updateShapeProps:function(x,y)
{var w,h;if(!this._shape)
{this._shape={};}
if(!this._shape.x)
{this._shape.x=x;}
else
{this._shape.x=Math.min(this._shape.x,x);}
if(!this._shape.y)
{this._shape.y=y;}
else
{this._shape.y=Math.min(this._shape.y,y);}
w=Math.abs(x-this._shape.x);if(!this._shape.w)
{this._shape.w=w;}
else
{this._shape.w=Math.max(w,this._shape.w);}
h=Math.abs(y-this._shape.y);if(!this._shape.h)
{this._shape.h=h;}
else
{this._shape.h=Math.max(h,this._shape.h);}},getShape:function(config){config.graphic=this;return new Y.Shape(config);}};Y.CanvasDrawingUtil=CanvasDrawingUtil;Y.CanvasGraphic=Y.Base.create("graphic",Y.CanvasDrawingUtil,[],{autoSize:true,setSize:function(w,h){if(this.autoSize)
{if(w>this.node.getAttribute("width"))
{this.node.style.width=w+"px";this._canvas.style.width=w+"px";this._canvas.width=w;this.node.setAttribute("width",w);}
if(h>this.node.getAttribute("height"))
{this.node.style.height=h+"px";this._canvas.style.height=h+"px";this._canvas.height=h;this.node.setAttribute("height",h);}}},_trackSize:function(w,h){if(w>this._width){this._width=w;}
if(h>this._height){this._height=h;}
this.setSize(w,h);},setPosition:function(x,y)
{this.node.style.left=x+"px";this.node.style.top=y+"px";},render:function(node){node=node||Y.config.doc.body;this.node=document.createElement("div");this.node.style.width=node.offsetWidth+"px";this.node.style.height=node.offsetHeight+"px";this.node.style.display="block";this.node.style.position="absolute";this.node.style.left=node.getStyle("left");this.node.style.top=node.getStyle("top");this.node.style.pointerEvents="none";node.appendChild(this.node);this.node.appendChild(this._canvas);this._canvas.width=node.offsetWidth>0?node.offsetWidth:100;this._canvas.height=node.offsetHeight>0?node.offsetHeight:100;this._canvas.style.position="absolute";return this;},toggleVisible:function(val)
{this.node.style.visibility=val?"visible":"hidden";},_createGraphicNode:function(pe)
{var node=Y.config.doc.createElement('canvas');node.style.pointerEvents=pe||"none";if(!this._graphicsList)
{this._graphicsList=[];}
this._graphicsList.push(node);return node;},destroy:function()
{this._removeChildren(this.node);if(this.node&&this.node.parentNode)
{this.node.parentNode.removeChild(this.node);}},_removeChildren:function(node)
{if(node.hasChildNodes())
{var child;while(node.firstChild)
{child=node.firstChild;this._removeChildren(child);node.removeChild(child);}}},node:null});if(DRAWINGAPI=="canvas")
{Y.Graphic=Y.CanvasGraphic;}
var VMLGraphics=function(config){this.initializer.apply(this,arguments);};VMLGraphics.prototype={initializer:function(config){config=config||{};var w=config.width||0,h=config.height||0;this.node=this._createGraphics();this.setSize(w,h);this._initProps();},beginBitmapFill:function(config){var fill={};fill.src=config.bitmap.src;fill.type="tile";this._fillProps=fill;if(!isNaN(config.tx)||!isNaN(config.ty)||!isNaN(config.width)||!isNaN(config.height))
{this._gradientBox={tx:config.tx,ty:config.ty,width:config.width,height:config.height};}
else
{this._gradientBox=null;}},beginFill:function(color,alpha){if(color){if(Y.Lang.isNumber(alpha)){this._fillProps={type:"solid",opacity:alpha};}
this._fillColor=color;this._fill=1;}
return this;},beginGradientFill:function(config){var type=config.type,colors=config.colors,alphas=config.alphas||[],ratios=config.ratios||[],fill={colors:colors,ratios:ratios},len=alphas.length,i=0,alpha,oi,rotation=config.rotation||0;for(;i<len;++i)
{alpha=alphas[i];alpha=Y.Lang.isNumber(alpha)?alpha:1;oi=i>0?i+1:"";alphas[i]=Math.round(alpha*100)+"%";fill["opacity"+oi]=alpha;}
if(type==="linear")
{if(config)
{}
if(rotation>0&&rotation<=90)
{rotation=450-rotation;}
else if(rotation<=270)
{rotation=270-rotation;}
else if(rotation<=360)
{rotation=630-rotation;}
else
{rotation=270;}
fill.type="gradientunscaled";fill.angle=rotation;}
else if(type==="radial")
{fill.alignshape=false;fill.type="gradientradial";fill.focus="100%";fill.focusposition="50%,50%";}
fill.ratios=ratios||[];if(!isNaN(config.tx)||!isNaN(config.ty)||!isNaN(config.width)||!isNaN(config.height))
{this._gradientBox={tx:config.tx,ty:config.ty,width:config.width,height:config.height};}
else
{this._gradientBox=null;}
this._fillProps=fill;},clear:function(){this._path='';this._removeChildren(this.node);},destroy:function()
{this._removeChildren(this.node);this.node.parentNode.removeChild(this.node);},_removeChildren:function(node)
{if(node.hasChildNodes())
{var child;while(node.firstChild)
{child=node.firstChild;this._removeChildren(child);node.removeChild(child);}}},toggleVisible:function(val)
{this._toggleVisible(this.node,val);},_toggleVisible:function(node,val)
{var children=Y.one(node).get("children"),visibility=val?"visible":"hidden",i=0,len;if(children)
{len=children.length;for(;i<len;++i)
{this._toggleVisible(children[i],val);}}
node.style.visibility=visibility;},curveTo:function(cp1x,cp1y,cp2x,cp2y,x,y){this._shape="shape";this._path+=' c '+Math.round(cp1x)+", "+Math.round(cp1y)+", "+Math.round(cp2x)+", "+Math.round(cp2y)+", "+x+", "+y;this._trackSize(x,y);},quadraticCurveTo:function(cpx,cpy,x,y){this._path+=' qb '+cpx+", "+cpy+", "+x+", "+y;},drawCircle:function(x,y,r){this._width=this._height=r*2;this._x=x-r;this._y=y-r;this._shape="oval";this._draw();},drawEllipse:function(x,y,w,h){this._width=w;this._height=h;this._x=x;this._y=y;this._shape="oval";this._draw();},drawRect:function(x,y,w,h){this._x=x;this._y=y;this._width=w;this._height=h;this.moveTo(x,y);this.lineTo(x+w,y);this.lineTo(x+w,y+h);this.lineTo(x,y+h);this.lineTo(x,y);this._draw();},drawRoundRect:function(x,y,w,h,ew,eh){this._x=x;this._y=y;this._width=w;this._height=h;this.moveTo(x,y+eh);this.lineTo(x,y+h-eh);this.quadraticCurveTo(x,y+h,x+ew,y+h);this.lineTo(x+w-ew,y+h);this.quadraticCurveTo(x+w,y+h,x+w,y+h-eh);this.lineTo(x+w,y+eh);this.quadraticCurveTo(x+w,y,x+w-ew,y);this.lineTo(x+ew,y);this.quadraticCurveTo(x,y,x,y+eh);this._draw();},drawWedge:function(x,y,startAngle,arc,radius,yRadius)
{this._drawingComplete=false;this._width=radius;this._height=radius;yRadius=yRadius||radius;this._path+=this._getWedgePath({x:x,y:y,startAngle:startAngle,arc:arc,radius:radius,yRadius:yRadius});this._width=radius*2;this._height=this._width;this._shape="shape";this._draw();},_getWedgePath:function(config)
{var x=config.x,y=config.y,startAngle=config.startAngle,arc=config.arc,radius=config.radius,yRadius=config.yRadius||radius,path;if(Math.abs(arc)>360)
{arc=360;}
startAngle*=-65535;arc*=65536;path=" m "+x+" "+y+" ae "+x+" "+y+" "+radius+" "+yRadius+" "+startAngle+" "+arc;return path;},end:function(){if(this._shape)
{this._draw();}
this._initProps();},lineGradientStyle:function(){},lineStyle:function(thickness,color,alpha,pixelHinting,scaleMode,caps,joints,miterLimit){this._stroke=1;this._strokeWeight=thickness*0.7;this._strokeColor=color;this._strokeOpacity=Y.Lang.isNumber(alpha)?alpha:1;},lineTo:function(point1,point2,etc){var args=arguments,i,len;if(typeof point1==='string'||typeof point1==='number'){args=[[point1,point2]];}
len=args.length;this._shape="shape";this._path+=' l ';for(i=0;i<len;++i){this._path+=' '+Math.round(args[i][0])+', '+Math.round(args[i][1]);this._trackSize.apply(this,args[i]);}},moveTo:function(x,y){this._path+=' m '+Math.round(x)+', '+Math.round(y);},setSize:function(w,h){w=Math.round(w);h=Math.round(h);this.node.style.width=w+'px';this.node.style.height=h+'px';this.node.coordSize=w+' '+h;this._canvasWidth=w;this._canvasHeight=h;},setPosition:function(x,y)
{x=Math.round(x);y=Math.round(y);this.node.style.left=x+"px";this.node.style.top=y+"px";},render:function(parentNode){var w=Math.max(parentNode.offsetWidth||0,this._canvasWidth),h=Math.max(parentNode.offsetHeight||0,this._canvasHeight);parentNode=parentNode||Y.config.doc.body;parentNode.appendChild(this.node);this.setSize(w,h);this._initProps();return this;},_shape:null,_trackSize:function(w,h){if(w>this._width){this._width=w;}
if(h>this._height){this._height=h;}},_initProps:function(){this._fillColor=null;this._strokeColor=null;this._strokeOpacity=null;this._strokeWeight=0;this._fillProps=null;this._path='';this._width=0;this._height=0;this._x=0;this._y=0;this._fill=null;this._stroke=0;this._stroked=false;},_clearPath:function()
{this._shape=null;this._path='';this._width=0;this._height=0;this._x=0;this._y=0;},_draw:function()
{var shape=this._createGraphicNode(this._shape),w=Math.round(this._width),h=Math.round(this._height),strokeNode,fillProps=this._fillProps;this.setSize(w,h);if(this._path)
{if(this._fill||this._fillProps)
{this._path+=' x';}
if(this._stroke)
{this._path+=' e';}
shape.path=this._path;shape.coordSize=w+', '+h;}
else
{shape.style.display="block";shape.style.position="absolute";shape.style.left=this._x+"px";shape.style.top=this._y+"px";}
if(this._fill){shape.fillColor=this._fillColor;}
else
{shape.filled=false;}
if(this._stroke&&this._strokeWeight>0){shape.strokeColor=this._strokeColor;shape.strokeWeight=this._strokeWeight;if(Y.Lang.isNumber(this._strokeOpacity)&&this._strokeOpacity<1)
{strokeNode=this._createGraphicNode("stroke");shape.appendChild(strokeNode);strokeNode.opacity=this._strokeOpacity;}}else{shape.stroked=false;}
shape.style.width=w+'px';shape.style.height=h+'px';if(fillProps){shape.filled=true;shape.appendChild(this._getFill());}
this.node.appendChild(shape);this._clearPath();},_getFill:function(){var fill=this._createGraphicNode("fill"),w=this._width,h=this._height,fillProps=this._fillProps,prop,pct,i=0,colors,colorstring="",len,ratios,hyp=Math.sqrt(Math.pow(w,2)+Math.pow(h,2)),cx=50,cy=50;if(this._gradientBox)
{cx=Math.round((this._gradientBox.width/2-((this._x-this._gradientBox.tx)*hyp/w))/(w*w/hyp)*100);cy=Math.round((this._gradientBox.height/2-((this._y-this._gradientBox.ty)*hyp/h))/(h*h/hyp)*100);fillProps.focussize=(this._gradientBox.width/w)/10+" "+(this._gradientBox.height/h)/10;}
if(fillProps.colors)
{colors=fillProps.colors.concat();ratios=fillProps.ratios.concat();len=colors.length;for(;i<len;++i){pct=ratios[i]||i/(len-1);pct=Math.round(100*pct)+"%";colorstring+=", "+pct+" "+colors[i];}
if(parseInt(pct,10)<100)
{colorstring+=", 100% "+colors[len-1];}}
for(prop in fillProps){if(fillProps.hasOwnProperty(prop)){fill.setAttribute(prop,fillProps[prop]);}}
fill.colors=colorstring.substr(2);if(fillProps.type==="gradientradial")
{fill.focusposition=cx+"%,"+cy+"%";}
return fill;},_createGraphics:function(){var group=this._createGraphicNode("group");group.style.display="inline-block";group.style.position='absolute';return group;},_createGraphicNode:function(type)
{return document.createElement('<'+type+' xmlns="urn:schemas-microsft.com:vml" class="vml'+type+'"/>');},_getNodeShapeType:function(type)
{var shape="shape";if(this._typeConversionHash.hasOwnProperty(type))
{shape=this._typeConversionHash[type];}
return shape;},_typeConversionHash:{circle:"oval",ellipse:"oval",rect:"rect"},getShape:function(config){config.graphic=this;return new Y.Shape(config);},addChild:function(child)
{this.node.appendChild(child);}};if(DRAWINGAPI=="vml")
{var sheet=document.createStyleSheet();sheet.addRule(".vmlgroup","behavior:url(#default#VML)",sheet.rules.length);sheet.addRule(".vmlgroup","display:inline-block",sheet.rules.length);sheet.addRule(".vmlgroup","zoom:1",sheet.rules.length);sheet.addRule(".vmlshape","behavior:url(#default#VML)",sheet.rules.length);sheet.addRule(".vmlshape","display:inline-block",sheet.rules.length);sheet.addRule(".vmloval","behavior:url(#default#VML)",sheet.rules.length);sheet.addRule(".vmloval","display:inline-block",sheet.rules.length);sheet.addRule(".vmlrect","behavior:url(#default#VML)",sheet.rules.length);sheet.addRule(".vmlrect","display:block",sheet.rules.length);sheet.addRule(".vmlfill","behavior:url(#default#VML)",sheet.rules.length);sheet.addRule(".vmlstroke","behavior:url(#default#VML)",sheet.rules.length);Y.Graphic=VMLGraphics;}
function Shape(cfg)
{this._initialize(cfg);this._draw();}
Y.extend(Shape,Y.Graphic,{type:"shape",autoSize:false,pointerEvents:"visiblePainted",_initialize:function(cfg)
{if(!cfg.graphic)
{cfg.graphic=new Y.Graphic();}
this._setProps(cfg);},_setProps:function(cfg)
{this.autoSize=cfg.autoSize||this.autoSize;this.pointerEvents=cfg.pointerEvents||this.pointerEvents;this.width=cfg.width||this.width;this.height=cfg.height||this.height;this.border=cfg.border||this.border;this.graphics=cfg.graphic||this.graphics;this.canvas=this.graphics;this.parentNode=this.graphics.node;this.fill=cfg.fill||this.fill;this.type=cfg.shape||this.type;this.nodetype=this._getNodeShapeType(this.type);this.props=cfg.props||this.props;this.path=cfg.path||this.path;},_draw:function()
{var cx,cy,rx,ry,parentNode=this.parentNode,borderWeight=0,fillWidth=this.width||0,fillHeight=this.height||0;if(!this.node)
{this.node=this._createGraphicNode(this.nodetype,this.pointerEvents);parentNode.appendChild(this.node);}
if(this.type=="wedge")
{this.path=this._getWedgePath(this.props);}
if(this.nodetype=="path")
{this._setPath();}
if(this.border&&this.border.weight&&this.border.weight>0)
{borderWeight=this.border.weight;fillWidth-=borderWeight*2;fillHeight-=borderWeight*2;}
this._addBorder();if(this.nodetype==="ellipse")
{rx=this.width/2;cx=this.width/2;ry=this.height/2;cy=this.height/2;rx-=borderWeight;ry-=borderWeight;this.node.setAttribute("cx",cx);this.node.setAttribute("cy",cy);this.node.setAttribute("rx",rx);this.node.setAttribute("ry",ry);}
else
{this.node.setAttribute("width",fillWidth);this.node.setAttribute("height",fillHeight);this.node.style.width=fillWidth+"px";this.node.style.height=fillHeight+"px";}
this._addFill();parentNode.style.width=this.width+"px";parentNode.style.height=this.height+"px";parentNode.setAttribute("width",this.width);parentNode.setAttribute("height",this.height);this.node.style.visibility="visible";this.node.setAttribute("x",borderWeight);this.node.setAttribute("y",borderWeight);return this;},_setPath:function()
{if(this.path)
{this.path+=" Z";this.node.setAttribute("d",this.path);}},_addBorder:function()
{if(this.border&&this.border.weight&&this.border.weight>0)
{var borderAlpha=this.border.alpha;this.border.color=this.border.color||"#000000";this.border.weight=this.border.weight||1;this.border.alpha=Y.Lang.isNumber(borderAlpha)?borderAlpha:1;this.border.linecap=this.border.linecap||"square";this.node.setAttribute("stroke",this.border.color);this.node.setAttribute("stroke-linecap",this.border.linecap);this.node.setAttribute("stroke-width",this.border.weight);this.node.setAttribute("stroke-opacity",this.border.alpha);}
else
{this.node.setAttribute("stroke","none");}},_addFill:function()
{var fillAlpha;if(this.fill.type==="linear"||this.fill.type==="radial")
{this.beginGradientFill(this.fill);this.node.appendChild(this._getFill());}
else if(this.fill.type==="bitmap")
{this.beginBitmapFill(this.fill);this.node.appendChild(this._getFill());}
else
{if(!this.fill.color)
{this.node.setAttribute("fill","none");}
else
{fillAlpha=this.fill.alpha;this.fill.alpha=Y.Lang.isNumber(fillAlpha)?fillAlpha:1;this.node.setAttribute("fill",this.fill.color);this.node.setAttribute("fill-opacity",fillAlpha);}}},end:function()
{this._setPath();},update:function(cfg)
{this._setProps(cfg);this._draw();return this;},_getNodeShapeType:function(type)
{if(this._typeConversionHash.hasOwnProperty(type))
{type=this._typeConversionHash[type];}
return type;},toggleVisible:function(val)
{var visibility=val?"visible":"hidden";if(this.node)
{this.node.style.visibility=visibility;}},addClass:function(className)
{var node=this.node;if(node)
{if(node.className&&node.className.baseVal)
{node.className.baseVal=Y.Lang.trim([node.className.baseVal,className].join(' '));}
else
{node.setAttribute("class",className);}}},setPosition:function(x,y)
{var pNode=Y.one(this.parentNode),hotspot=this.hotspot;pNode.setStyle("position","absolute");pNode.setStyle("left",x);pNode.setStyle("top",y);if(hotspot)
{hotspot.setStyle("position","absolute");hotspot.setStyle("left",x);hotspot.setStyle("top",y);}},_typeConversionHash:{circle:"ellipse",wedge:"path"}});Y.Shape=Shape;function CanvasShape(cfg)
{this._dummy=this._createDummy();this._canvas=this._createGraphic();this.node=this._canvas;this._context=this._canvas.getContext('2d');this._initialize(cfg);this._validate();}
Y.extend(CanvasShape,Y.CanvasDrawingUtil,{type:"shape",autoSize:false,_initialize:function(cfg)
{this._canvas.style.position="absolute";if(cfg.graphic)
{cfg.graphic.node.appendChild(this._canvas);}
this._setProps(cfg);},_setProps:function(cfg)
{this.autoSize=cfg.autoSize||this.autoSize;this.width=cfg.width||this.width;this.height=cfg.height||this.height;this.border=cfg.border||this.border;this.graphics=cfg.graphic||this.graphics;this.fill=cfg.fill||this.fill;this.type=cfg.shape||this.type;this.props=cfg.props||this.props;this.path=cfg.path||this.path;this.props=cfg.props||this.props;this.parentNode=this.graphics.node;},_validate:function()
{var w=this.width,h=this.height,border=this.border,type=this.type,fill=this.fill;this.clear();this.setSize(this.width,this.height);this._canvas.style.top="0px";this._canvas.style.left="0px";if(border&&border.weight&&border.weight>0)
{border.color=border.color||"#000";border.alpha=border.alpha||1;this.lineStyle(border.weight,border.color,border.alpha);}
if(fill.type==="radial"||fill.type==="linear")
{this.beginGradientFill(fill);}
else if(fill.type==="bitmap")
{this.beginBitmapFill(fill);}
else
{this.beginFill(fill.color,fill.alpha);}
switch(type)
{case"circle":this.drawEllipse(0,0,w,h);break;case"rect":this.drawRect(0,0,w,h);break;case"wedge":this.drawWedge(this.props);break;}
return this;},update:function(cfg)
{this._setProps(cfg);this._validate();return this;},toggleVisible:function(val)
{var visibility=val?"visible":"hidden";if(this.node)
{this.node.style.visibility=visibility;}},setPosition:function(x,y)
{var pNode=Y.one(this.parentNode);pNode.setStyle("position","absolute");pNode.setStyle("left",x);pNode.setStyle("top",y);},addClass:function(val)
{if(this.node)
{this.node.style.pointerEvents="painted";this.node.setAttribute("class",val);}}});Y.CanvasShape=CanvasShape;if(DRAWINGAPI=="canvas")
{Y.Shape=Y.CanvasShape;}
function VMLShape(cfg)
{this._initialize(cfg);this._draw();}
VMLShape.prototype={type:"shape",_initialize:function(cfg)
{if(!cfg.graphic)
{cfg.graphic=new Y.Graphic();}
this._setProps(cfg);},width:0,height:0,_setProps:function(cfg){this.width=cfg.width&&cfg.width>=0?cfg.width:this.width;this.height=cfg.height&&cfg.height>=0?cfg.height:this.height;this.border=cfg.border||this.border;this.graphics=cfg.graphic||this.graphics;this.canvas=this.graphics;this.parentNode=this.graphics.node;this.fill=cfg.fill||this.fill;this.type=cfg.shape||this.type;this.props=cfg.props||this.props;},_draw:function()
{var path,borderWeight=0,fillWidth=this.width||0,fillHeight=this.height||0;this.graphics.setSize(fillWidth,fillHeight);if(this.node)
{this.node.style.visible="hidden";}
else if(!this.node)
{this.node=this.graphics._createGraphicNode(this.graphics._getNodeShapeType(this.type));this.graphics.node.appendChild(this.node);}
if(this.type==="wedge")
{path=this.graphics._getWedgePath(this.props);if(this.fill)
{path+=' x';}
if(this.border)
{path+=' e';}
this.node.path=path;}
this._addBorder();if(this.border&&this.border.weight&&this.border.weight>0)
{borderWeight=this.border.weight;fillWidth-=borderWeight;fillHeight-=borderWeight;}
this.node.style.width=Math.max(fillWidth,0)+"px";this.node.style.height=Math.max(fillHeight,0)+"px";this._addFill();return this;},_addBorder:function()
{if(this.border&&this.border.weight&&this.border.weight>0)
{var borderAlpha=this.border.alpha,borderWeight=this.borderWeight;borderAlpha=Y.Lang.isNumber(borderAlpha)?borderAlpha:1;borderWeight=Y.Lang.isNumber(borderWeight)?borderWeight:1;this.node.strokecolor=this.border.color||"#000000";this.node.strokeweight=borderWeight;if(borderAlpha<1)
{if(!this._strokeNode)
{this._strokeNode=this.graphics._createGraphicNode("stroke");this.node.appendChild(this._strokeNode);}
this._strokeNode.opacity=borderAlpha;}
else if(this._strokeNode)
{this._strokeNode.opacity=borderAlpha;}
this.node.stroked=true;}
else
{this.node.stroked=false;}},_addFill:function()
{var fillAlpha;this.node.filled=true;if(this.fill.type==="linear"||this.fill.type==="radial")
{this.graphics.beginGradientFill(this.fill);this.node.appendChild(this.graphics._getFill());}
else if(this.fill.type==="bitmap")
{this.graphics.beginBitmapFill(this.fill);this.node.appendChild(this.graphics._getFill());}
else
{if(!this.fill.color)
{this.node.filled=false;}
else
{if(this.fillnode)
{this.graphics._removeChildren(this.fillnode);}
fillAlpha=this.fill.alpha;fillAlpha=Y.Lang.isNumber(fillAlpha)?fillAlpha:1;this.fill.alpha=fillAlpha;this.fillnode=this.graphics._createGraphicNode("fill");this.fillnode.type="solid";this.fillnode.color=this.fill.color;this.fillnode.opacity=fillAlpha;this.node.appendChild(this.fillnode);}}},addClass:function(val)
{var node=this.node;if(node)
{Y.one(node).addClass(val);}},toggleVisible:function(val)
{var visibility=val?"visible":"hidden";if(this.node)
{Y.one(this.node).setStyle("visibility",visibility);}},setPosition:function(x,y)
{var pNode=Y.one(this.parentNode);pNode.setStyle("position","absolute");pNode.setStyle("left",x);pNode.setStyle("top",y);},update:function(cfg)
{this._setProps(cfg);this._draw();return this;}};Y.VMLShape=VMLShape;if(DRAWINGAPI=="vml"){Y.Shape=VMLShape;}
function Renderer(){}
Renderer.ATTRS={styles:{getter:function()
{this._styles=this._styles||this._getDefaultStyles();return this._styles;},setter:function(val)
{this._styles=this._setStyles(val);}},graphic:{}};Renderer.NAME="renderer";Renderer.prototype={_styles:null,_setStyles:function(newstyles)
{var styles=this.get("styles");return this._mergeStyles(newstyles,styles);},_mergeStyles:function(a,b)
{if(!b)
{b={};}
var newstyles=Y.merge(b,{});Y.Object.each(a,function(value,key,a)
{if(b.hasOwnProperty(key)&&Y.Lang.isObject(value)&&!Y.Lang.isArray(value))
{newstyles[key]=this._mergeStyles(value,b[key]);}
else
{newstyles[key]=value;}},this);return newstyles;},_getDefaultStyles:function()
{return{padding:{top:0,right:0,bottom:0,left:0}};}};Y.augment(Renderer,Y.Attribute);Y.Renderer=Renderer;Y.Axis=Y.Base.create("axis",Y.Widget,[Y.Renderer],{_dataChangeHandler:function(e)
{if(this.get("rendered"))
{this._drawAxis();}},_updateHandler:function(e)
{if(this.get("rendered"))
{this._drawAxis();}},_positionChangeHandler:function(e)
{var position=this.get("position");if(position=="none")
{return;}
this._layout=this.getLayout(this.get("position"));if(this.get("rendered"))
{this._drawAxis();}},renderUI:function()
{var pos=this.get("position");if(pos&&pos!="none")
{this._layout=this.getLayout(pos);this._setCanvas();}},syncUI:function()
{this._drawAxis();},_setCanvas:function()
{var cb=this.get("contentBox"),bb=this.get("boundingBox"),p=this.get("position"),pn=this._parentNode,w=this.get("width"),h=this.get("height");bb.setStyle("position","absolute");w=w?w+"px":pn.getStyle("width");h=h?h+"px":pn.getStyle("height");if(p==="top"||p==="bottom")
{cb.setStyle("width",w);}
else
{cb.setStyle("height",h);}
cb.setStyle("position","relative");cb.setStyle("left","0px");cb.setStyle("top","0px");this.set("graphic",new Y.Graphic());this.get("graphic").render(cb);},_getDefaultStyles:function()
{var axisstyles={majorTicks:{display:"inside",length:4,color:"#dad8c9",weight:1,alpha:1},minorTicks:{display:"none",length:2,color:"#dad8c9",weight:1},line:{weight:1,color:"#dad8c9",alpha:1},majorUnit:{determinant:"count",count:11,distance:75},top:"0px",left:"0px",width:"100px",height:"100px",label:{color:"#808080",alpha:1,fontSize:"85%",rotation:0,margin:{top:4,right:4,bottom:4,left:4}},hideOverlappingLabelTicks:false};return Y.merge(Y.Renderer.prototype._getDefaultStyles(),axisstyles);},_handleSizeChange:function(e)
{var attrName=e.attrName,pos=this.get("position"),vert=pos=="left"||pos=="right",cb=this.get("contentBox"),hor=pos=="bottom"||pos=="top";cb.setStyle("width",this.get("width"));cb.setStyle("height",this.get("height"));if((hor&&attrName=="width")||(vert&&attrName=="height"))
{this._drawAxis();}},_layout:null,getLayout:function(pos)
{var l;switch(pos)
{case"top":l=new Y.TopAxisLayout({axisRenderer:this});break;case"bottom":l=new Y.BottomAxisLayout({axisRenderer:this});break;case"left":l=new Y.LeftAxisLayout({axisRenderer:this});break;case"right":l=new Y.RightAxisLayout({axisRenderer:this});break;}
return l;},drawLine:function(startPoint,endPoint,line)
{var graphic=this.get("graphic");graphic.lineStyle(line.weight,line.color,line.alpha);graphic.moveTo(startPoint.x,startPoint.y);graphic.lineTo(endPoint.x,endPoint.y);graphic.end();},_drawAxis:function()
{if(this._drawing)
{this._callLater=true;return;}
this._drawing=true;this._callLater=false;if(this.get("position")!="none")
{var styles=this.get("styles"),majorTickStyles=styles.majorTicks,drawTicks=majorTickStyles.display!="none",tickPoint,majorUnit=styles.majorUnit,len,majorUnitDistance,i=0,layoutLength,position,lineStart,label,layout=this._layout,labelFunction=this.get("labelFunction"),labelFunctionScope=this.get("labelFunctionScope"),labelFormat=this.get("labelFormat"),graphic=this.get("graphic");graphic.clear();layout.setTickOffsets();layoutLength=this.getLength();lineStart=layout.getLineStart();len=this.getTotalMajorUnits(majorUnit);majorUnitDistance=this.getMajorUnitDistance(len,layoutLength,majorUnit);this.set("edgeOffset",this.getEdgeOffset(len,layoutLength)*0.5);tickPoint=this.getFirstPoint(lineStart);this.drawLine(lineStart,this.getLineEnd(tickPoint),styles.line);if(drawTicks)
{layout.drawTick(tickPoint,majorTickStyles);}
if(len<1)
{this._clearLabelCache();return;}
this._createLabelCache();this._tickPoints=[];layout.set("maxLabelSize",0);for(;i<len;++i)
{if(drawTicks)
{layout.drawTick(tickPoint,majorTickStyles);}
position=this.getPosition(tickPoint);label=this.getLabel(tickPoint);label.innerHTML=labelFunction.apply(labelFunctionScope,[this.getLabelByIndex(i,len),labelFormat]);tickPoint=this.getNextPoint(tickPoint,majorUnitDistance);}
this._clearLabelCache();layout.setSizeAndPosition();if(this.get("overlapGraph"))
{layout.offsetNodeForTick(this.get("contentBox"));}
layout.setCalculatedSize();for(i=0;i<len;++i)
{layout.positionLabel(this.get("labels")[i],this._tickPoints[i]);}}
this._drawing=false;if(this._callLater)
{this._drawAxis();}
else
{this.fire("axisRendered");}},_labels:null,_labelCache:null,getLabel:function(pt,pos)
{var i,label,customStyles={rotation:"rotation",margin:"margin",alpha:"alpha"},cache=this._labelCache,styles=this.get("styles").label;if(cache.length>0)
{label=cache.shift();}
else
{label=document.createElement("span");label.style.display="block";label.style.whiteSpace="nowrap";Y.one(label).addClass("axisLabel");this.get("contentBox").appendChild(label);}
label.style.position="absolute";this._labels.push(label);this._tickPoints.push({x:pt.x,y:pt.y});this._layout.updateMaxLabelSize(label);for(i in styles)
{if(styles.hasOwnProperty(i)&&!customStyles.hasOwnProperty(i))
{label.style[i]=styles[i];}}
return label;},_createLabelCache:function()
{if(this._labels)
{if(this._labelCache)
{this._labelCache=this._labels.concat(this._labelCache);}
else
{this._labelCache=this._labels.concat();}}
else
{this._clearLabelCache();}
this._labels=[];},_clearLabelCache:function()
{if(this._labelCache)
{var len=this._labelCache.length,i=0,label,labelCache=this._labelCache;for(;i<len;++i)
{label=labelCache[i];label.parentNode.removeChild(label);}}
this._labelCache=[];},_calculateSizeByTickLength:true,getLineEnd:function(pt)
{var w=this.get("width"),h=this.get("height"),pos=this.get("position");if(pos==="top"||pos==="bottom")
{return{x:w,y:pt.y};}
else
{return{x:pt.x,y:h};}},getLength:function()
{var l,style=this.get("styles"),padding=style.padding,w=this.get("width"),h=this.get("height"),pos=this.get("position");if(pos==="top"||pos==="bottom")
{l=w-(padding.left+padding.right);}
else
{l=h-(padding.top+padding.bottom);}
return l;},getFirstPoint:function(pt)
{var style=this.get("styles"),pos=this.get("position"),padding=style.padding,np={x:pt.x,y:pt.y};if(pos==="top"||pos==="bottom")
{np.x+=padding.left+this.get("edgeOffset");}
else
{np.y+=this.get("height")-(padding.top+this.get("edgeOffset"));}
return np;},getNextPoint:function(point,majorUnitDistance)
{var pos=this.get("position");if(pos==="top"||pos==="bottom")
{point.x=point.x+majorUnitDistance;}
else
{point.y=point.y-majorUnitDistance;}
return point;},getLastPoint:function()
{var style=this.get("styles"),padding=style.padding,w=this.get("width"),pos=this.get("position");if(pos==="top"||pos==="bottom")
{return{x:w-padding.right,y:padding.top};}
else
{return{x:padding.left,y:padding.top};}},getPosition:function(point)
{var p,h=this.get("height"),style=this.get("styles"),padding=style.padding,pos=this.get("position"),dataType=this.get("dataType");if(pos==="left"||pos==="right")
{if(dataType==="numeric")
{p=(h-(padding.top+padding.bottom))-(point.y-padding.top);}
else
{p=point.y-padding.top;}}
else
{p=point.x-padding.left;}
return p;}},{ATTRS:{edgeOffset:{value:0},graphic:{},node:{},position:{lazyAdd:false,setOnce:true,setter:function(val)
{if(val=="none")
{this.bindUI();}
return val;}},topTickOffset:{value:0},bottomTickOffset:{value:0},leftTickOffset:{value:0},rightTickOffset:{value:0},labels:{readOnly:true,getter:function()
{return this._labels;}},tickPoints:{readOnly:true,getter:function()
{if(this.get("position")=="none")
{return this.get("styles").majorUnit.count;}
return this._tickPoints;}},overlapGraph:{value:true,validator:function(val)
{return Y.Lang.isBoolean(val);}},labelFunctionScope:{}}});function LeftAxisLayout(config)
{LeftAxisLayout.superclass.constructor.apply(this,arguments);}
LeftAxisLayout.ATTRS={axisRenderer:{value:null},maxLabelSize:{value:0}};Y.extend(LeftAxisLayout,Y.Base,{setTickOffsets:function()
{var ar=this.get("axisRenderer"),majorTicks=ar.get("styles").majorTicks,tickLength=majorTicks.length,halfTick=tickLength*0.5,display=majorTicks.display;ar.set("topTickOffset",0);ar.set("bottomTickOffset",0);switch(display)
{case"inside":ar.set("rightTickOffset",tickLength);ar.set("leftTickOffset",0);break;case"outside":ar.set("rightTickOffset",0);ar.set("leftTickOffset",tickLength);break;case"cross":ar.set("rightTickOffset",halfTick);ar.set("leftTickOffset",halfTick);break;default:ar.set("rightTickOffset",0);ar.set("leftTickOffset",0);break;}},drawTick:function(pt,tickStyles)
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,tickLength=tickStyles.length,start={x:padding.left,y:pt.y},end={x:tickLength+padding.left,y:pt.y};ar.drawLine(start,end,tickStyles);},getLineStart:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,majorTicks=style.majorTicks,tickLength=majorTicks.length,display=majorTicks.display,pt={x:padding.left,y:0};if(display==="outside")
{pt.x+=tickLength;}
else if(display==="cross")
{pt.x+=tickLength/2;}
return pt;},getLabelPoint:function(point)
{var ar=this.get("axisRenderer");return{x:point.x-ar.get("leftTickOffset"),y:point.y};},updateMaxLabelSize:function(label)
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,max;if(!document.createElementNS)
{label.style.filter='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),label.offsetWidth));}
else
{label.style.msTransform="rotate(0deg)";if(rot===0)
{max=label.offsetWidth;}
else if(absRot===90)
{max=label.offsetHeight;}
else
{max=(cosRadians*label.offsetWidth)+(sinRadians*label.offsetHeight);}
this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),max));}},positionLabel:function(label,pt)
{var ar=this.get("axisRenderer"),tickOffset=ar.get("leftTickOffset"),style=ar.get("styles").label,labelAlpha=style.alpha,filterString,margin=0,leftOffset=pt.x,topOffset=pt.y,rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,maxLabelSize=this.get("maxLabelSize"),labelWidth=Math.round(label.offsetWidth),labelHeight=Math.round(label.offsetHeight);if(style.margin&&style.margin.right)
{margin=style.margin.right;}
if(!document.createElementNS)
{label.style.filter=null;labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(rot===0)
{leftOffset=labelWidth;topOffset-=labelHeight*0.5;}
else if(absRot===90)
{leftOffset=labelHeight;topOffset-=labelWidth*0.5;}
else if(rot>0)
{leftOffset=(cosRadians*labelWidth)+(labelHeight*rot/90);topOffset-=(sinRadians*labelWidth)+(cosRadians*(labelHeight*0.5));}
else
{leftOffset=(cosRadians*labelWidth)+(absRot/90*labelHeight);topOffset-=cosRadians*(labelHeight*0.5);}
leftOffset+=tickOffset;label.style.left=((pt.x+maxLabelSize)-leftOffset)+"px";label.style.top=topOffset+"px";if(filterString)
{filterString+=" ";}
if(Y.Lang.isNumber(labelAlpha)&&labelAlpha<1&&labelAlpha>-1&&!isNaN(labelAlpha))
{filterString="progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(labelAlpha*100)+")";}
if(rot!==0)
{if(filterString)
{filterString+=" ";}
else
{filterString="";}
filterString+='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';}
if(filterString)
{label.style.filter=filterString;}
return;}
label.style.msTransform="rotate(0deg)";labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(rot===0)
{leftOffset-=labelWidth;topOffset-=labelHeight*0.5;}
else if(rot===90)
{topOffset-=labelWidth*0.5;}
else if(rot===-90)
{leftOffset-=labelHeight;topOffset+=labelWidth*0.5;}
else
{if(rot<0)
{leftOffset-=(cosRadians*labelWidth)+(sinRadians*labelHeight);topOffset+=(sinRadians*labelWidth)-(cosRadians*(labelHeight*0.6));}
else
{leftOffset-=(cosRadians*labelWidth);topOffset-=(sinRadians*labelWidth)+(cosRadians*(labelHeight*0.6));}}
leftOffset-=tickOffset;label.style.left=(this.get("maxLabelSize")+leftOffset)+"px";label.style.top=topOffset+"px";label.style.MozTransformOrigin="0 0";label.style.MozTransform="rotate("+rot+"deg)";label.style.webkitTransformOrigin="0 0";label.style.webkitTransform="rotate("+rot+"deg)";label.style.msTransformOrigin="0 0";label.style.msTransform="rotate("+rot+"deg)";label.style.OTransformOrigin="0 0";label.style.OTransform="rotate("+rot+"deg)";},setSizeAndPosition:function()
{var labelSize=this.get("maxLabelSize"),ar=this.get("axisRenderer"),style=ar.get("styles"),leftTickOffset=ar.get("leftTickOffset"),sz=labelSize+leftTickOffset,graphic=ar.get("graphic"),margin=style.label.margin;if(margin&&margin.right)
{sz+=margin.right;}
sz=Math.round(sz);ar.set("width",sz);ar.get("contentBox").setStyle("width",sz);Y.one(graphic.node).setStyle("left",labelSize+margin.right);},offsetNodeForTick:function(cb)
{},setCalculatedSize:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles"),label=style.label,tickOffset=ar.get("leftTickOffset"),max=this.get("maxLabelSize"),ttl=Math.round(tickOffset+max+label.margin.right);ar.get("contentBox").setStyle("width",ttl);ar.set("width",ttl);}});Y.LeftAxisLayout=LeftAxisLayout;function RightAxisLayout(config)
{RightAxisLayout.superclass.constructor.apply(this,arguments);}
RightAxisLayout.ATTRS={axisRenderer:{value:null}};Y.extend(RightAxisLayout,Y.Base,{setTickOffsets:function()
{var ar=this.get("axisRenderer"),majorTicks=ar.get("styles").majorTicks,tickLength=majorTicks.length,halfTick=tickLength*0.5,display=majorTicks.display;ar.set("topTickOffset",0);ar.set("bottomTickOffset",0);switch(display)
{case"inside":ar.set("leftTickOffset",tickLength);ar.set("rightTickOffset",0);break;case"outside":ar.set("leftTickOffset",0);ar.set("rightTickOffset",tickLength);break;case"cross":ar.set("rightTickOffset",halfTick);ar.set("leftTickOffset",halfTick);break;default:ar.set("leftTickOffset",0);ar.set("rightTickOffset",0);break;}},drawTick:function(pt,tickStyles)
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,tickLength=tickStyles.length,start={x:padding.left,y:pt.y},end={x:padding.left+tickLength,y:pt.y};ar.drawLine(start,end,tickStyles);},getLineStart:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,majorTicks=style.majorTicks,tickLength=majorTicks.length,display=majorTicks.display,pt={x:padding.left,y:padding.top};if(display==="inside")
{pt.x+=tickLength;}
else if(display==="cross")
{pt.x+=tickLength/2;}
return pt;},getLabelPoint:function(point)
{var ar=this.get("axisRenderer");return{x:point.x+ar.get("rightTickOffset"),y:point.y};},updateMaxLabelSize:function(label)
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,max;if(!document.createElementNS)
{label.style.filter='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),label.offsetWidth));}
else
{label.style.msTransform="rotate(0deg)";if(rot===0)
{max=label.offsetWidth;}
else if(absRot===90)
{max=label.offsetHeight;}
else
{max=(cosRadians*label.offsetWidth)+(sinRadians*label.offsetHeight);}
this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),max));}},positionLabel:function(label,pt)
{var ar=this.get("axisRenderer"),tickOffset=ar.get("rightTickOffset"),style=ar.get("styles").label,labelAlpha=style.alpha,filterString,margin=0,leftOffset=pt.x,topOffset=pt.y,rot=Math.min(Math.max(style.rotation,-90),90),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,labelWidth=Math.round(label.offsetWidth),labelHeight=Math.round(label.offsetHeight);if(style.margin&&style.margin.right)
{margin=style.margin.right;}
if(!document.createElementNS)
{label.style.filter=null;if(rot===0)
{topOffset-=labelHeight*0.5;}
else if(absRot===90)
{topOffset-=labelWidth*0.5;}
else if(rot>0)
{topOffset-=(cosRadians*(labelHeight*0.5));}
else
{topOffset-=(sinRadians*labelWidth)+(cosRadians*(labelHeight*0.5));}
leftOffset+=margin;leftOffset+=tickOffset;label.style.left=leftOffset+"px";label.style.top=topOffset+"px";if(Y.Lang.isNumber(labelAlpha)&&labelAlpha<1&&labelAlpha>-1&&!isNaN(labelAlpha))
{filterString="progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(labelAlpha*100)+")";}
if(rot!==0)
{if(filterString)
{filterString+=" ";}
else
{filterString="";}
filterString+='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';}
if(filterString)
{label.style.filter=filterString;}
return;}
label.style.msTransform="rotate(0deg)";labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(rot===0)
{topOffset-=labelHeight*0.5;}
else if(rot===90)
{leftOffset+=labelHeight;topOffset-=labelWidth*0.5;}
else if(rot===-90)
{topOffset+=labelWidth*0.5;}
else if(rot<0)
{topOffset-=(cosRadians*(labelHeight*0.6));}
else
{topOffset-=cosRadians*(labelHeight*0.6);leftOffset+=sinRadians*labelHeight;}
leftOffset+=margin;leftOffset+=tickOffset;label.style.left=leftOffset+"px";label.style.top=topOffset+"px";label.style.MozTransformOrigin="0 0";label.style.MozTransform="rotate("+rot+"deg)";label.style.webkitTransformOrigin="0 0";label.style.webkitTransform="rotate("+rot+"deg)";label.style.msTransformOrigin="0 0";label.style.msTransform="rotate("+rot+"deg)";label.style.OTransformOrigin="0 0";label.style.OTransform="rotate("+rot+"deg)";},setSizeAndPosition:function()
{var ar=this.get("axisRenderer"),label=ar.get("styles").label,labelSize=this.get("maxLabelSize"),tickOffset=ar.get("rightTickOffset"),sz=tickOffset+labelSize;if(label.margin&&label.margin.weight)
{sz+=label.margin.weight;}
ar.set("width",sz);ar.get("contentBox").setStyle("width",sz);},offsetNodeForTick:function(cb)
{var ar=this.get("axisRenderer"),tickOffset=ar.get("leftTickOffset"),offset=0-tickOffset;cb.setStyle("left",offset);},setCalculatedSize:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,ttl=Math.round(ar.get("rightTickOffset")+this.get("maxLabelSize")+style.margin.left);ar.set("width",ttl);}});Y.RightAxisLayout=RightAxisLayout;function BottomAxisLayout(config)
{BottomAxisLayout.superclass.constructor.apply(this,arguments);}
BottomAxisLayout.ATTRS={axisRenderer:{value:null},maxLabelSize:{value:0}};Y.extend(BottomAxisLayout,Y.Base,{setTickOffsets:function()
{var ar=this.get("axisRenderer"),majorTicks=ar.get("styles").majorTicks,tickLength=majorTicks.length,halfTick=tickLength*0.5,display=majorTicks.display;ar.set("leftTickOffset",0);ar.set("rightTickOffset",0);switch(display)
{case"inside":ar.set("topTickOffset",tickLength);ar.set("bottomTickOffset",0);break;case"outside":ar.set("topTickOffset",0);ar.set("bottomTickOffset",tickLength);break;case"cross":ar.set("topTickOffset",halfTick);ar.set("bottomTickOffset",halfTick);break;default:ar.set("topTickOffset",0);ar.set("bottomTickOffset",0);break;}},getLineStart:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,majorTicks=style.majorTicks,tickLength=majorTicks.length,display=majorTicks.display,pt={x:0,y:padding.top};if(display==="inside")
{pt.y+=tickLength;}
else if(display==="cross")
{pt.y+=tickLength/2;}
return pt;},drawTick:function(pt,tickStyles)
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,tickLength=tickStyles.length,start={x:pt.x,y:padding.top},end={x:pt.x,y:tickLength+padding.top};ar.drawLine(start,end,tickStyles);},getLabelPoint:function(point)
{var ar=this.get("axisRenderer");return{x:point.x,y:point.y+ar.get("bottomTickOffset")};},updateMaxLabelSize:function(label)
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,max;if(!document.createElementNS)
{label.style.filter='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),label.offsetHeight));}
else
{label.style.msTransform="rotate(0deg)";if(rot===0)
{max=label.offsetHeight;}
else if(absRot===90)
{max=label.offsetWidth;}
else
{max=(sinRadians*label.offsetWidth)+(cosRadians*label.offsetHeight);}
this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),max));}},positionLabel:function(label,pt)
{var ar=this.get("axisRenderer"),tickOffset=ar.get("bottomTickOffset"),style=ar.get("styles").label,labelAlpha=style.alpha,filterString,margin=0,leftOffset=Math.round(pt.x),topOffset=Math.round(pt.y),rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,labelWidth=Math.round(label.offsetWidth),labelHeight=Math.round(label.offsetHeight);if(style.margin&&style.margin.top)
{margin=style.margin.top;}
if(!document.createElementNS)
{m11=cosRadians;m12=rot>0?-sinRadians:sinRadians;m21=-m12;m22=m11;label.style.filter=null;labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(absRot===90)
{leftOffset-=labelHeight*0.5;}
else if(rot<0)
{leftOffset-=cosRadians*labelWidth;leftOffset-=sinRadians*(labelHeight*0.5);}
else if(rot>0)
{leftOffset-=sinRadians*(labelHeight*0.5);}
else
{leftOffset-=labelWidth*0.5;}
topOffset+=margin;topOffset+=tickOffset;label.style.left=Math.round(leftOffset)+"px";label.style.top=Math.round(topOffset)+"px";if(Y.Lang.isNumber(labelAlpha)&&labelAlpha<1&&labelAlpha>-1&&!isNaN(labelAlpha))
{filterString="progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(labelAlpha*100)+")";}
if(rot!==0)
{if(filterString)
{filterString+=" ";}
else
{filterString="";}
filterString+='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';}
if(filterString)
{label.style.filter=filterString;}
return;}
label.style.msTransform="rotate(0deg)";labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(rot===0)
{leftOffset-=labelWidth*0.5;}
else if(absRot===90)
{if(rot===90)
{leftOffset+=labelHeight*0.5;}
else
{topOffset+=labelWidth;leftOffset-=labelHeight*0.5;}}
else
{if(rot<0)
{leftOffset-=(cosRadians*labelWidth)+(sinRadians*(labelHeight*0.6));topOffset+=sinRadians*labelWidth;}
else
{leftOffset+=Math.round(sinRadians*(labelHeight*0.6));}}
topOffset+=margin;topOffset+=tickOffset;label.style.left=Math.round(leftOffset)+"px";label.style.top=Math.round(topOffset)+"px";label.style.MozTransformOrigin="0 0";label.style.MozTransform="rotate("+rot+"deg)";label.style.webkitTransformOrigin="0 0";label.style.webkitTransform="rotate("+rot+"deg)";label.style.msTransformOrigin="0 0";label.style.msTransform="rotate("+rot+"deg)";label.style.OTransformOrigin="0 0";label.style.OTransform="rotate("+rot+"deg)";},setSizeAndPosition:function()
{var labelSize=this.get("maxLabelSize"),ar=this.get("axisRenderer"),tickLength=ar.get("bottomTickLength"),style=ar.get("styles"),sz=tickLength+labelSize,margin=style.label.margin;if(margin&&margin.top)
{sz+=margin.top;}
sz=Math.round(sz);ar.set("height",sz);},offsetNodeForTick:function(cb)
{var ar=this.get("axisRenderer");ar.get("contentBox").setStyle("top",0-ar.get("topTickOffset"));},setCalculatedSize:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,ttl=Math.round(ar.get("bottomTickOffset")+this.get("maxLabelSize")+style.margin.top);ar.set("height",ttl);}});Y.BottomAxisLayout=BottomAxisLayout;function TopAxisLayout(config)
{TopAxisLayout.superclass.constructor.apply(this,arguments);}
TopAxisLayout.ATTRS={axisRenderer:{value:null},maxLabelSize:{value:0}};Y.extend(TopAxisLayout,Y.Base,{setTickOffsets:function()
{var ar=this.get("axisRenderer"),majorTicks=ar.get("styles").majorTicks,tickLength=majorTicks.length,halfTick=tickLength*0.5,display=majorTicks.display;ar.set("leftTickOffset",0);ar.set("rightTickOffset",0);switch(display)
{case"inside":ar.set("bottomTickOffset",tickLength);ar.set("topTickOffset",0);break;case"outside":ar.set("bottomTickOffset",0);ar.set("topTickOffset",tickLength);break;case"cross":ar.set("topTickOffset",halfTick);ar.set("bottomTickOffset",halfTick);break;default:ar.set("topTickOffset",0);ar.set("bottomTickOffset",0);break;}},getLineStart:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,majorTicks=style.majorTicks,tickLength=majorTicks.length,display=majorTicks.display,pt={x:0,y:padding.top};if(display==="outside")
{pt.y+=tickLength;}
else if(display==="cross")
{pt.y+=tickLength/2;}
return pt;},drawTick:function(pt,tickStyles)
{var ar=this.get("axisRenderer"),style=ar.get("styles"),padding=style.padding,tickLength=tickStyles.length,start={x:pt.x,y:padding.top},end={x:pt.x,y:tickLength+padding.top};ar.drawLine(start,end,tickStyles);},getLabelPoint:function(pt)
{var ar=this.get("axisRenderer");return{x:pt.x,y:pt.y-ar.get("topTickOffset")};},updateMaxLabelSize:function(label)
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,rot=Math.min(90,Math.max(-90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11=cosRadians,m12=rot>0?-sinRadians:sinRadians,m21=-m12,m22=m11,max;if(!document.createElementNS)
{label.style.filter='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),label.offsetHeight));}
else
{label.style.msTransform="rotate(0deg)";if(rot===0)
{max=label.offsetHeight;}
else if(absRot===90)
{max=label.offsetWidth;}
else
{max=(sinRadians*label.offsetWidth)+(cosRadians*label.offsetHeight);}
this.set("maxLabelSize",Math.max(this.get("maxLabelSize"),max));}},positionLabel:function(label,pt)
{var ar=this.get("axisRenderer"),tickOffset=ar.get("topTickOffset"),style=ar.get("styles").label,labelAlpha=style.alpha,filterString,margin=0,leftOffset=pt.x,topOffset=pt.y,rot=Math.max(-90,Math.min(90,style.rotation)),absRot=Math.abs(rot),radCon=Math.PI/180,sinRadians=parseFloat(parseFloat(Math.sin(absRot*radCon)).toFixed(8)),cosRadians=parseFloat(parseFloat(Math.cos(absRot*radCon)).toFixed(8)),m11,m12,m21,m22,maxLabelSize=this.get("maxLabelSize"),labelWidth=Math.round(label.offsetWidth),labelHeight=Math.round(label.offsetHeight);rot=Math.min(90,rot);rot=Math.max(-90,rot);if(style.margin&&style.margin.bottom)
{margin=style.margin.bottom;}
if(!document.createElementNS)
{label.style.filter=null;labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);m11=cosRadians;m12=rot>0?-sinRadians:sinRadians;m21=-m12;m22=m11;if(rot===0)
{leftOffset-=labelWidth*0.5;}
else if(absRot===90)
{leftOffset-=labelHeight*0.5;}
else if(rot>0)
{leftOffset-=(cosRadians*labelWidth)+Math.min((sinRadians*labelHeight),(rot/180*labelHeight));topOffset-=(sinRadians*labelWidth)+(cosRadians*(labelHeight));topOffset+=maxLabelSize;}
else
{leftOffset-=sinRadians*(labelHeight*0.5);topOffset-=(sinRadians*labelWidth)+(cosRadians*(labelHeight));topOffset+=maxLabelSize;}
topOffset-=tickOffset;label.style.left=leftOffset;label.style.top=topOffset;if(Y.Lang.isNumber(labelAlpha)&&labelAlpha<1&&labelAlpha>-1&&!isNaN(labelAlpha))
{filterString="progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(labelAlpha*100)+")";}
if(rot!==0)
{if(filterString)
{filterString+=" ";}
else
{filterString="";}
filterString+='progid:DXImageTransform.Microsoft.Matrix(M11='+m11+' M12='+m12+' M21='+m21+' M22='+m22+' sizingMethod="auto expand")';}
if(filterString)
{label.style.filter=filterString;}
return;}
label.style.msTransform="rotate(0deg)";labelWidth=Math.round(label.offsetWidth);labelHeight=Math.round(label.offsetHeight);if(rot===0)
{leftOffset-=labelWidth*0.5;topOffset-=labelHeight;}
else if(rot===90)
{leftOffset+=labelHeight*0.5;topOffset-=labelWidth;}
else if(rot===-90)
{leftOffset-=labelHeight*0.5;topOffset-=0;}
else if(rot<0)
{leftOffset-=(sinRadians*(labelHeight*0.6));topOffset-=(cosRadians*labelHeight);}
else
{leftOffset-=(cosRadians*labelWidth)-(sinRadians*(labelHeight*0.6));topOffset-=(sinRadians*labelWidth)+(cosRadians*labelHeight);}
topOffset-=tickOffset;label.style.left=leftOffset+"px";label.style.top=(this.get("maxLabelSize")+topOffset)+"px";label.style.MozTransformOrigin="0 0";label.style.MozTransform="rotate("+rot+"deg)";label.style.webkitTransformOrigin="0 0";label.style.webkitTransform="rotate("+rot+"deg)";label.style.msTransformOrigin="0 0";label.style.msTransform="rotate("+rot+"deg)";label.style.OTransformOrigin="0 0";label.style.OTransform="rotate("+rot+"deg)";},setSizeAndPosition:function()
{var labelSize=this.get("maxLabelSize"),ar=this.get("axisRenderer"),tickOffset=ar.get("topTickOffset"),style=ar.get("styles"),margin=style.label.margin,graphic=ar.get("graphic"),sz=tickOffset+labelSize;if(margin&&margin.bottom)
{sz+=margin.bottom;}
ar.set("height",sz);Y.one(graphic.node).setStyle("top",labelSize+margin.bottom);},offsetNodeForTick:function(cb)
{},setCalculatedSize:function()
{var ar=this.get("axisRenderer"),style=ar.get("styles").label,ttl=Math.round(ar.get("topTickOffset")+this.get("maxLabelSize")+style.margin.bottom);ar.set("height",ttl);}});Y.TopAxisLayout=TopAxisLayout;Y.AxisType=Y.Base.create("baseAxis",Y.Axis,[],{bindUI:function()
{this.after("dataReady",Y.bind(this._dataChangeHandler,this));this.after("dataUpdate",Y.bind(this._dataChangeHandler,this));this.after("minimumChange",Y.bind(this._keyChangeHandler,this));this.after("maximumChange",Y.bind(this._keyChangeHandler,this));this.after("keysChange",this._keyChangeHandler);this.after("dataProviderChange",this._dataProviderChangeHandler);this.after("stylesChange",this._updateHandler);this.after("positionChange",this._positionChangeHandler);this.after("overlapGraphChange",this._updateHandler);this.after("widthChange",this._handleSizeChange);this.after("heightChange",this._handleSizeChange);this.after("alwaysShowZeroChange",this._keyChangeHandler);this.after("roundingMethodChange",this._keyChangeHandler);},_dataProviderChangeHandler:function(e)
{var keyCollection=this.get("keyCollection").concat(),keys=this.get("keys"),i;if(keys)
{for(i in keys)
{if(keys.hasOwnProperty(i))
{delete keys[i];}}}
if(keyCollection&&keyCollection.length)
{this.set("keys",keyCollection);}},GUID:"yuibaseaxis",_type:null,_setMaximum:null,_dataMaximum:null,_setMinimum:null,_data:null,_updateTotalDataFlag:true,_dataReady:false,addKey:function(value)
{this.set("keys",value);},_getKeyArray:function(key,data)
{var i=0,obj,keyArray=[],len=data.length;for(;i<len;++i)
{obj=data[i];keyArray[i]=obj[key];}
return keyArray;},_setDataByKey:function(key,data)
{var i,obj,arr=[],dv=this._dataClone.concat(),len=dv.length;for(i=0;i<len;++i)
{obj=dv[i];arr[i]=obj[key];}
this.get("keys")[key]=arr;this._updateTotalDataFlag=true;},_updateTotalData:function()
{var keys=this.get("keys"),i;this._data=[];for(i in keys)
{if(keys.hasOwnProperty(i))
{this._data=this._data.concat(keys[i]);}}
this._updateTotalDataFlag=false;},removeKey:function(value)
{var keys=this.get("keys");if(keys.hasOwnProperty(value))
{delete keys[value];this._keyChangeHandler();}},getKeyValueAt:function(key,index)
{var value=NaN,keys=this.get("keys");if(keys[key]&&keys[key][index])
{value=keys[key][index];}
return value;},getDataByKey:function(value)
{var keys=this.get("keys");if(keys[value])
{return keys[value];}
return null;},_updateMinAndMax:function()
{var data=this.get("data"),max=0,min=0,len,num,i;if(data&&data.length&&data.length>0)
{len=data.length;max=min=data[0];if(len>1)
{for(i=1;i<len;i++)
{num=data[i];if(isNaN(num))
{continue;}
max=Math.max(num,max);min=Math.min(num,min);}}}
this._dataMaximum=max;this._dataMinimum=min;},getTotalMajorUnits:function()
{var units,majorUnit=this.get("styles").majorUnit,len=this.get("length");if(majorUnit.determinant==="count")
{units=majorUnit.count;}
else if(majorUnit.determinant==="distance")
{units=(len/majorUnit.distance)+1;}
return units;},getMajorUnitDistance:function(len,uiLen,majorUnit)
{var dist;if(majorUnit.determinant==="count")
{dist=uiLen/(len-1);}
else if(majorUnit.determinant==="distance")
{dist=majorUnit.distance;}
return dist;},getEdgeOffset:function(ct,l)
{return 0;},getLabelByIndex:function(i,l)
{var min=this.get("minimum"),max=this.get("maximum"),increm=(max-min)/(l-1),label;l-=1;label=min+(i*increm);return label;},_keyChangeHandler:function(e)
{this._updateMinAndMax();this.fire("dataUpdate");}},{ATTRS:{keys:{value:{},setter:function(val)
{var keys={},i,len,data=this.get("dataProvider");if(Y.Lang.isArray(val))
{len=val.length;for(i=0;i<len;++i)
{keys[val[i]]=this._getKeyArray(val[i],data);}}
else if(Y.Lang.isString(val))
{keys=this.get("keys");keys[val]=this._getKeyArray(val,data);}
else
{for(i in val)
{if(val.hasOwnProperty(i))
{keys[i]=this._getKeyArray(i,data);}}}
this._updateTotalDataFlag=true;return keys;}},roundingMethod:{value:"niceNumber"},type:{readOnly:true,getter:function()
{return this._type;}},dataProvider:{setter:function(value)
{return value;}},dataMaximum:{getter:function()
{if(!this._dataMaximum)
{this._updateMinAndMax();}
return this._dataMaximum;}},maximum:{getter:function()
{var max=this.get("dataMaximum");if(this.get("setMax"))
{max=this._setMaximum;}
return max;},setter:function(value)
{this._setMaximum=parseFloat(value);return value;}},dataMinimum:{getter:function()
{if(!this._dataMinimum)
{this._updateMinAndMax();}
return this._dataMinimum;}},minimum:{getter:function()
{var min=this.get("dataMinimum");if(this.get("setMin"))
{min=this._setMinimum;}
return min;},setter:function(val)
{this._setMinimum=parseFloat(val);return val;}},setMax:{readOnly:true,getter:function()
{return Y.Lang.isNumber(this._setMaximum);}},setMin:{readOnly:true,getter:function()
{return Y.Lang.isNumber(this._setMinimum);}},data:{getter:function()
{if(!this._data||this._updateTotalDataFlag)
{this._updateTotalData();}
return this._data;}},keyCollection:{getter:function()
{var keys=this.get("keys"),i,col=[];for(i in keys)
{if(keys.hasOwnProperty(i))
{col.push(i);}}
return col;},readOnly:true},labelFunction:{value:function(val,format)
{return val;}}}});function NumericAxis(config)
{NumericAxis.superclass.constructor.apply(this,arguments);}
NumericAxis.NAME="numericAxis";NumericAxis.ATTRS={alwaysShowZero:{value:true},labelFunction:{value:function(val,format)
{if(format)
{return Y.DataType.Number.format(val,format);}
return val;}},labelFormat:{value:{prefix:"",thousandsSeparator:"",decimalSeparator:"",decimalPlaces:"0",suffix:""}}};Y.extend(NumericAxis,Y.AxisType,{_type:"numeric",_getMinimumUnit:function(max,min,units)
{return this._getNiceNumber(Math.ceil((max-min)/units));},_getNiceNumber:function(roundingUnit)
{var tempMajorUnit=roundingUnit,order=Math.ceil(Math.log(tempMajorUnit)*0.4342944819032518),roundedMajorUnit=Math.pow(10,order),roundedDiff;if(roundedMajorUnit / 2>=tempMajorUnit)
{roundedDiff=Math.floor((roundedMajorUnit / 2-tempMajorUnit)/(Math.pow(10,order-1)/2));tempMajorUnit=roundedMajorUnit/2-roundedDiff*Math.pow(10,order-1)/2;}
else
{tempMajorUnit=roundedMajorUnit;}
if(!isNaN(tempMajorUnit))
{return tempMajorUnit;}
return roundingUnit;},_updateMinAndMax:function()
{var data=this.get("data"),max=0,min=0,len,num,i,key,setMax=this.get("setMax"),setMin=this.get("setMin");if(!setMax&&!setMin)
{if(data&&data.length&&data.length>0)
{len=data.length;max=min=data[0];if(len>1)
{for(i=1;i<len;i++)
{num=data[i];if(isNaN(num))
{if(Y.Lang.isObject(num))
{for(key in num)
{if(num.hasOwnProperty(key))
{max=Math.max(num[key],max);min=Math.min(num[key],min);}}}
continue;}
max=setMax?this._setMaximum:Math.max(num,max);min=setMin?this._setMinimum:Math.min(num,min);}}}
this._roundMinAndMax(min,max);}},_roundMinAndMax:function(min,max)
{var roundingUnit,minimumRange,minGreaterThanZero=min>=0,maxGreaterThanZero=max>0,dataRangeGreater,maxRound,minRound,topTicks,botTicks,tempMax,tempMin,units=this.getTotalMajorUnits()-1,alwaysShowZero=this.get("alwaysShowZero"),roundingMethod=this.get("roundingMethod"),useIntegers=(max-min)/units>=1;if(roundingMethod)
{if(roundingMethod=="niceNumber")
{roundingUnit=this._getMinimumUnit(max,min,units);if(minGreaterThanZero&&maxGreaterThanZero)
{if(alwaysShowZero||min<roundingUnit)
{min=0;}
roundingUnit=this._getMinimumUnit(max,min,units);max=this._roundUpToNearest(max,roundingUnit);}
else if(maxGreaterThanZero&&!minGreaterThanZero)
{topTicks=Math.round(units /((-1*min)/max+1));botTicks=units-topTicks;tempMax=Math.ceil(max/topTicks);tempMin=Math.floor(min/botTicks)*-1;roundingUnit=Math.max(tempMax,tempMin);roundingUnit=this._getNiceNumber(roundingUnit);max=roundingUnit*topTicks;min=roundingUnit*botTicks*-1;}
else
{if(alwaysShowZero||max===0||max+roundingUnit>0)
{max=0;roundingUnit=this._getMinimumUnit(max,min,units);}
else
{max=this._roundUpToNearest(max,roundingUnit);}
min=max-(roundingUnit*units);}}
else if(roundingMethod=="auto")
{if(minGreaterThanZero&&maxGreaterThanZero)
{if(alwaysShowZero||min<(max-min)/units)
{min=0;}
roundingUnit=(max-min)/units;if(useIntegers)
{roundingUnit=Math.ceil(roundingUnit);}
max=min+(roundingUnit*units);}
else if(maxGreaterThanZero&&!minGreaterThanZero)
{if(alwaysShowZero)
{topTicks=Math.round(units /((-1*min)/max+1));botTicks=units-topTicks;if(useIntegers)
{tempMax=Math.ceil(max/topTicks);tempMin=Math.floor(min/botTicks)*-1;}
else
{tempMax=max/topTicks;tempMin=min/botTicks*-1;}
roundingUnit=Math.max(tempMax,tempMin);max=roundingUnit*topTicks;min=roundingUnit*botTicks*-1;}
else
{roundingUnit=(max-min)/units;if(useIntegers)
{roundingUnit=Math.ceil(roundingUnit);}
min=this._roundDownToNearest(min,roundingUnit);max=this._roundUpToNearest(max,roundingUnit);}}
else
{roundingUnit=(max-min)/units;if(useIntegers)
{roundingUnit=Math.ceil(roundingUnit);}
if(alwaysShowZero||max===0||max+roundingUnit>0)
{max=0;roundingUnit=(max-min)/units;if(useIntegers)
{Math.ceil(roundingUnit);}}
else
{max=this._roundUpToNearest(max,roundingUnit);}
min=max-(roundingUnit*units);}}
else if(!isNaN(roundingMethod)&&isFinite(roundingMethod))
{roundingUnit=roundingMethod;minimumRange=roundingUnit*units;dataRangeGreater=(max-min)>minimumRange;minRound=this._roundDownToNearest(min,roundingUnit);maxRound=this._roundUpToNearest(max,roundingUnit);if(minGreaterThanZero&&maxGreaterThanZero)
{if(alwaysShowZero||minRound<=0)
{min=0;}
else
{min=minRound;}
if(!dataRangeGreater)
{max=min+minimumRange;}
else
{max=maxRound;}}
else if(maxGreaterThanZero&&!minGreaterThanZero)
{min=minRound;if(!dataRangeGreater)
{max=min+minimumRange;}
else
{max=maxRound;}}
else
{if(max===0||alwaysShowZero)
{max=0;}
else
{max=maxRound;}
if(!dataRangeGreater)
{min=max-minimumRange;}
else
{min=minRound;}}}}
this._dataMaximum=max;this._dataMinimum=min;},getLabelByIndex:function(i,l)
{var min=this.get("minimum"),max=this.get("maximum"),increm=(max-min)/(l-1),label;l-=1;label=min+(i*increm);if(i>0)
{label=this._roundToNearest(label,increm);}
return label;},_roundToNearest:function(number,nearest)
{nearest=nearest||1;if(nearest===0)
{return number;}
var roundedNumber=Math.round(this._roundToPrecision(number / nearest,10))*nearest;return this._roundToPrecision(roundedNumber,10);},_roundUpToNearest:function(number,nearest)
{nearest=nearest||1;if(nearest===0)
{return number;}
return Math.ceil(this._roundToPrecision(number / nearest,10))*nearest;},_roundDownToNearest:function(number,nearest)
{nearest=nearest||1;if(nearest===0)
{return number;}
return Math.floor(this._roundToPrecision(number / nearest,10))*nearest;},_roundToPrecision:function(number,precision)
{precision=precision||0;var decimalPlaces=Math.pow(10,precision);return Math.round(decimalPlaces*number)/ decimalPlaces;}});Y.NumericAxis=NumericAxis;function StackedAxis(config)
{StackedAxis.superclass.constructor.apply(this,arguments);}
StackedAxis.NAME="stackedAxis";Y.extend(StackedAxis,Y.NumericAxis,{_updateMinAndMax:function()
{var max=0,min=0,pos=0,neg=0,len=0,i=0,key,num,keys=this.get("keys");for(key in keys)
{if(keys.hasOwnProperty(key))
{len=Math.max(len,keys[key].length);}}
for(;i<len;++i)
{pos=0;neg=0;for(key in keys)
{if(keys.hasOwnProperty(key))
{num=keys[key][i];if(isNaN(num))
{continue;}
if(num>=0)
{pos+=num;}
else
{neg+=num;}}}
if(pos>0)
{max=Math.max(max,pos);}
else
{max=Math.max(max,neg);}
if(neg<0)
{min=Math.min(min,neg);}
else
{min=Math.min(min,pos);}}
this._roundMinAndMax(min,max);}});Y.StackedAxis=StackedAxis;function TimeAxis(config)
{TimeAxis.superclass.constructor.apply(this,arguments);}
TimeAxis.NAME="timeAxis";TimeAxis.ATTRS={setMax:{readOnly:true,getter:function()
{var max=this._getNumber(this._setMaximum);return(Y.Lang.isNumber(max));}},setMin:{readOnly:true,getter:function()
{var min=this._getNumber(this._setMinimum);return(Y.Lang.isNumber(min));}},maximum:{getter:function()
{var max=this._getNumber(this._setMaximum);if(!Y.Lang.isNumber(max))
{max=this._getNumber(this.get("dataMaximum"));}
return max;},setter:function(value)
{this._setMaximum=this._getNumber(value);return value;}},minimum:{getter:function()
{var min=this._getNumber(this._setMinimum);if(!Y.Lang.isNumber(min))
{min=this._getNumber(this.get("dataMinimum"));}
return min;},setter:function(value)
{this._setMinimum=this._getNumber(value);return value;}},labelFunction:{value:function(val,format)
{val=Y.DataType.Date.parse(val);if(format)
{return Y.DataType.Date.format(val,{format:format});}
return val;}},labelFormat:{value:"%b %d, %y"}};Y.extend(TimeAxis,Y.AxisType,{GUID:"yuitimeaxis",_dataType:"time",getLabelByIndex:function(i,l)
{var min=this.get("minimum"),max=this.get("maximum"),position=this.get("position"),increm,label;l-=1;increm=((max-min)/l)*i;if(position=="bottom"||position=="top")
{label=min+increm;}
else
{label=max-increm;}
return label;},_getKeyArray:function(key,data)
{var obj,keyArray=[],i=0,val,len=data.length;for(;i<len;++i)
{obj=data[i][key];if(Y.Lang.isDate(obj))
{val=obj.valueOf();}
else if(!Y.Lang.isNumber(obj))
{val=new Date(obj.toString()).valueOf();}
else
{val=obj;}
keyArray[i]=val;}
return keyArray;},_setDataByKey:function(key,data)
{var obj,arr=[],dv=this._dataClone.concat(),i,val,len=dv.length;for(i=0;i<len;++i)
{obj=dv[i][key];if(Y.Lang.isDate(obj))
{val=obj.valueOf();}
else if(!Y.Lang.isNumber(obj))
{val=new Date(obj.toString()).valueOf();}
else
{val=obj;}
arr[i]=val;}
this.get("keys")[key]=arr;this._updateTotalDataFlag=true;},_getNumber:function(val)
{if(Y.Lang.isDate(val))
{val=val.valueOf();}
else if(!Y.Lang.isNumber(val)&&val)
{val=new Date(val.toString()).valueOf();}
return val;}});Y.TimeAxis=TimeAxis;function CategoryAxis(config)
{CategoryAxis.superclass.constructor.apply(this,arguments);}
CategoryAxis.NAME="categoryAxis";Y.extend(CategoryAxis,Y.AxisType,{_indices:null,GUID:"yuicategoryaxis",_type:"category",_updateMinAndMax:function()
{this._dataMaximum=Math.max(this.get("data").length-1,0);this._dataMinimum=0;},_getKeyArray:function(key,data)
{var i=0,obj,keyArr=[],labels=[],len=data.length;if(!this._indices)
{this._indices={};}
for(;i<len;++i)
{obj=data[i];keyArr[i]=i;labels[i]=obj[key];}
this._indices[key]=keyArr;return labels;},_setDataByKey:function(key)
{var i,obj,arr=[],labels=[],dv=this._dataClone.concat(),len=dv.length;if(!this._indices)
{this._indices={};}
for(i=0;i<len;++i)
{obj=dv[i];arr[i]=i;labels[i]=obj[key];}
this._indices[key]=arr;this.get("keys")[key]=labels.concat();this._updateTotalDataFlag=true;},getDataByKey:function(value)
{if(!this._indices)
{this.get("keys");}
var keys=this._indices;if(keys[value])
{return keys[value];}
return null;},getTotalMajorUnits:function(majorUnit,len)
{return this.get("data").length;},getMajorUnitDistance:function(len,uiLen,majorUnit)
{var dist;if(majorUnit.determinant==="count")
{dist=uiLen/len;}
else if(majorUnit.determinant==="distance")
{dist=majorUnit.distance;}
return dist;},getEdgeOffset:function(ct,l)
{return l/ct;},getLabelByIndex:function(i,l)
{var label,data=this.get("data"),position=this.get("position");if(position=="bottom"||position=="top")
{label=data[i];}
else
{label=data[l-(i+1)];}
return label;}});Y.CategoryAxis=CategoryAxis;function CurveUtil()
{}
CurveUtil.prototype={getCurveControlPoints:function(xcoords,ycoords)
{var outpoints=[],i=1,l=xcoords.length-1,xvals=[],yvals=[];if(l<1)
{return null;}
outpoints[0]={startx:xcoords[0],starty:ycoords[0],endx:xcoords[1],endy:ycoords[1]};if(l===1)
{outpoints[0].ctrlx1=(2.0*xcoords[0]+xcoords[1])/3.0;outpoints[0].ctrly2=(2.0*ycoords[0]+ycoords[1])/3.0;outpoints[0].ctrlx2=2.0*outpoints[0].ctrlx1-xcoords[0];outpoints[0].ctrly2=2.0*outpoints[0].ctrly1-ycoords[0];return outpoints;}
for(;i<l;++i)
{outpoints.push({startx:Math.round(xcoords[i]),starty:Math.round(ycoords[i]),endx:Math.round(xcoords[i+1]),endy:Math.round(ycoords[i+1])});xvals[i]=4.0*xcoords[i]+2*xcoords[i+1];yvals[i]=4.0*ycoords[i]+2*ycoords[i+1];}
xvals[0]=xcoords[0]+(2.0*xcoords[1]);xvals[l-1]=(8.0*xcoords[l-1]+xcoords[l])/ 2.0;xvals=this.getControlPoints(xvals.concat());yvals[0]=ycoords[0]+(2.0*ycoords[1]);yvals[l-1]=(8.0*ycoords[l-1]+ycoords[l])/ 2.0;yvals=this.getControlPoints(yvals.concat());for(i=0;i<l;++i)
{outpoints[i].ctrlx1=Math.round(xvals[i]);outpoints[i].ctrly1=Math.round(yvals[i]);if(i<l-1)
{outpoints[i].ctrlx2=Math.round(2*xcoords[i+1]-xvals[i+1]);outpoints[i].ctrly2=Math.round(2*ycoords[i+1]-yvals[i+1]);}
else
{outpoints[i].ctrlx2=Math.round((xcoords[l]+xvals[l-1])/2);outpoints[i].ctrly2=Math.round((ycoords[l]+yvals[l-1])/2);}}
return outpoints;},getControlPoints:function(vals)
{var l=vals.length,x=[],tmp=[],b=2.0,i=1;x[0]=vals[0]/ b;for(;i<l;++i)
{tmp[i]=1/b;b=(i<l-1?4.0:3.5)-tmp[i];x[i]=(vals[i]-x[i-1])/ b;}
for(i=1;i<l;++i)
{x[l-i-1]-=tmp[l-i]*x[l-i];}
return x;}};Y.CurveUtil=CurveUtil;function StackingUtil(){}
StackingUtil.prototype={_stackCoordinates:function()
{var direction=this.get("direction"),order=this.get("order"),type=this.get("type"),graph=this.get("graph"),h=graph.get("height"),seriesCollection=graph.seriesTypes[type],i=0,len,xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),prevXCoords,prevYCoords;if(order===0)
{return;}
prevXCoords=seriesCollection[order-1].get("xcoords").concat();prevYCoords=seriesCollection[order-1].get("ycoords").concat();if(direction==="vertical")
{len=prevXCoords.length;for(;i<len;++i)
{if(!isNaN(prevXCoords[i])&&!isNaN(xcoords[i]))
{xcoords[i]+=prevXCoords[i];}}}
else
{len=prevYCoords.length;for(;i<len;++i)
{if(!isNaN(prevYCoords[i])&&!isNaN(ycoords[i]))
{ycoords[i]=prevYCoords[i]-(h-ycoords[i]);}}}}};Y.StackingUtil=StackingUtil;function Lines(){}
Lines.prototype={_lineDefaults:null,_getGraphic:function()
{var graph=this.get("graph");if(!this._lineGraphic)
{this._lineGraphic=new Y.Graphic();this._lineGraphic.render(graph.get("contentBox"));}
this._lineGraphic.clear();this._lineGraphic.setSize(graph.get("width"),graph.get("height"));this.autoSize=false;return this._lineGraphic;},drawLines:function()
{if(this.get("xcoords").length<1)
{return;}
var xcoords=this.get("xcoords").concat(),ycoords=this.get("ycoords").concat(),direction=this.get("direction"),len=direction==="vertical"?ycoords.length:xcoords.length,lastX,lastY,lastValidX=lastX,lastValidY=lastY,nextX,nextY,i,styles=this.get("styles").line,lineType=styles.lineType,lc=styles.color||this._getDefaultColor(this.get("graphOrder"),"line"),lineAlpha=styles.alpha,dashLength=styles.dashLength,gapSpace=styles.gapSpace,connectDiscontinuousPoints=styles.connectDiscontinuousPoints,discontinuousType=styles.discontinuousType,discontinuousDashLength=styles.discontinuousDashLength,discontinuousGapSpace=styles.discontinuousGapSpace,graphic=this._getGraphic();lastX=lastValidX=xcoords[0];lastY=lastValidY=ycoords[0];graphic.lineStyle(styles.weight,lc,lineAlpha);graphic.moveTo(lastX,lastY);for(i=1;i<len;i=++i)
{nextX=xcoords[i];nextY=ycoords[i];if(isNaN(nextY))
{lastValidX=nextX;lastValidY=nextY;continue;}
if(lastValidX==lastX)
{if(lineType!="dashed")
{graphic.lineTo(nextX,nextY);}
else
{this.drawDashedLine(lastValidX,lastValidY,nextX,nextY,dashLength,gapSpace);}}
else if(!connectDiscontinuousPoints)
{graphic.moveTo(nextX,nextY);}
else
{if(discontinuousType!="solid")
{this.drawDashedLine(lastValidX,lastValidY,nextX,nextY,discontinuousDashLength,discontinuousGapSpace);}
else
{graphic.lineTo(nextX,nextY);}}
lastX=lastValidX=nextX;lastY=lastValidY=nextY;}
graphic.end();},drawSpline:function()
{if(this.get("xcoords").length<1)
{return;}
var xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),curvecoords=this.getCurveControlPoints(xcoords,ycoords),len=curvecoords.length,cx1,cx2,cy1,cy2,x,y,i=0,styles=this.get("styles").line,graphic=this._getGraphic(),lineAlpha=styles.alpha,color=styles.color||this._getDefaultColor(this.get("graphOrder"),"line");graphic.lineStyle(styles.weight,color,lineAlpha);graphic.moveTo(xcoords[0],ycoords[0]);for(;i<len;i=++i)
{x=curvecoords[i].endx;y=curvecoords[i].endy;cx1=curvecoords[i].ctrlx1;cx2=curvecoords[i].ctrlx2;cy1=curvecoords[i].ctrly1;cy2=curvecoords[i].ctrly2;graphic.curveTo(cx1,cy1,cx2,cy2,x,y);}
graphic.end();},drawDashedLine:function(xStart,yStart,xEnd,yEnd,dashSize,gapSize)
{dashSize=dashSize||10;gapSize=gapSize||10;var segmentLength=dashSize+gapSize,xDelta=xEnd-xStart,yDelta=yEnd-yStart,delta=Math.sqrt(Math.pow(xDelta,2)+Math.pow(yDelta,2)),segmentCount=Math.floor(Math.abs(delta / segmentLength)),radians=Math.atan2(yDelta,xDelta),xCurrent=xStart,yCurrent=yStart,i,graphic=this._getGraphic();xDelta=Math.cos(radians)*segmentLength;yDelta=Math.sin(radians)*segmentLength;for(i=0;i<segmentCount;++i)
{graphic.moveTo(xCurrent,yCurrent);graphic.lineTo(xCurrent+Math.cos(radians)*dashSize,yCurrent+Math.sin(radians)*dashSize);xCurrent+=xDelta;yCurrent+=yDelta;}
graphic.moveTo(xCurrent,yCurrent);delta=Math.sqrt((xEnd-xCurrent)*(xEnd-xCurrent)+(yEnd-yCurrent)*(yEnd-yCurrent));if(delta>dashSize)
{graphic.lineTo(xCurrent+Math.cos(radians)*dashSize,yCurrent+Math.sin(radians)*dashSize);}
else if(delta>0)
{graphic.lineTo(xCurrent+Math.cos(radians)*delta,yCurrent+Math.sin(radians)*delta);}
graphic.moveTo(xEnd,yEnd);},_getLineDefaults:function()
{return{alpha:1,weight:6,lineType:"solid",dashLength:10,gapSpace:10,connectDiscontinuousPoints:true,discontinuousType:"solid",discontinuousDashLength:10,discontinuousGapSpace:10};}};Y.augment(Lines,Y.Attribute);Y.Lines=Lines;function Fills(cfg)
{var attrs={area:{getter:function()
{return this._defaults||this._getAreaDefaults();},setter:function(val)
{var defaults=this._defaults||this._getAreaDefaults();this._defaults=Y.merge(defaults,val);}}};this.addAttrs(attrs,cfg);this.get("styles");}
Fills.prototype={drawFill:function(xcoords,ycoords)
{if(xcoords.length<1)
{return;}
var len=xcoords.length,firstX=xcoords[0],firstY=ycoords[0],lastValidX=firstX,lastValidY=firstY,nextX,nextY,i=1,styles=this.get("styles").area,graphic=this.get("graphic"),color=styles.color||this._getDefaultColor(this.get("graphOrder"),"slice");graphic.clear();graphic.beginFill(color,styles.alpha);graphic.moveTo(firstX,firstY);for(;i<len;i=++i)
{nextX=xcoords[i];nextY=ycoords[i];if(isNaN(nextY))
{lastValidX=nextX;lastValidY=nextY;continue;}
graphic.lineTo(nextX,nextY);lastValidX=nextX;lastValidY=nextY;}
graphic.end();},drawAreaSpline:function()
{if(this.get("xcoords").length<1)
{return;}
var xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),curvecoords=this.getCurveControlPoints(xcoords,ycoords),len=curvecoords.length,cx1,cx2,cy1,cy2,x,y,i=0,firstX=xcoords[0],firstY=ycoords[0],styles=this.get("styles").area,graphic=this.get("graphic"),color=styles.color||this._getDefaultColor(this.get("graphOrder"),"slice");graphic.beginFill(color,styles.alpha);graphic.moveTo(firstX,firstY);for(;i<len;i=++i)
{x=curvecoords[i].endx;y=curvecoords[i].endy;cx1=curvecoords[i].ctrlx1;cx2=curvecoords[i].ctrlx2;cy1=curvecoords[i].ctrly1;cy2=curvecoords[i].ctrly2;graphic.curveTo(cx1,cy1,cx2,cy2,x,y);}
if(this.get("direction")==="vertical")
{graphic.lineTo(this._leftOrigin,y);graphic.lineTo(this._leftOrigin,firstY);}
else
{graphic.lineTo(x,this._bottomOrigin);graphic.lineTo(firstX,this._bottomOrigin);}
graphic.lineTo(firstX,firstY);graphic.end();},drawStackedAreaSpline:function()
{if(this.get("xcoords").length<1)
{return;}
var xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),curvecoords,order=this.get("order"),type=this.get("type"),graph=this.get("graph"),seriesCollection=graph.seriesTypes[type],prevXCoords,prevYCoords,len,cx1,cx2,cy1,cy2,x,y,i=0,firstX,firstY,styles=this.get("styles").area,graphic=this.get("graphic"),color=styles.color||this._getDefaultColor(this.get("graphOrder"),"slice");firstX=xcoords[0];firstY=ycoords[0];curvecoords=this.getCurveControlPoints(xcoords,ycoords);len=curvecoords.length;graphic.beginFill(color,styles.alpha);graphic.moveTo(firstX,firstY);for(;i<len;i=++i)
{x=curvecoords[i].endx;y=curvecoords[i].endy;cx1=curvecoords[i].ctrlx1;cx2=curvecoords[i].ctrlx2;cy1=curvecoords[i].ctrly1;cy2=curvecoords[i].ctrly2;graphic.curveTo(cx1,cy1,cx2,cy2,x,y);}
if(order>0)
{prevXCoords=seriesCollection[order-1].get("xcoords").concat().reverse();prevYCoords=seriesCollection[order-1].get("ycoords").concat().reverse();curvecoords=this.getCurveControlPoints(prevXCoords,prevYCoords);i=0;len=curvecoords.length;graphic.lineTo(prevXCoords[0],prevYCoords[0]);for(;i<len;i=++i)
{x=curvecoords[i].endx;y=curvecoords[i].endy;cx1=curvecoords[i].ctrlx1;cx2=curvecoords[i].ctrlx2;cy1=curvecoords[i].ctrly1;cy2=curvecoords[i].ctrly2;graphic.curveTo(cx1,cy1,cx2,cy2,x,y);}}
else
{if(this.get("direction")==="vertical")
{graphic.lineTo(this._leftOrigin,ycoords[ycoords.length-1]);graphic.lineTo(this._leftOrigin,firstY);}
else
{graphic.lineTo(xcoords[xcoords.length-1],this._bottomOrigin);graphic.lineTo(firstX,this._bottomOrigin);}}
graphic.lineTo(firstX,firstY);graphic.end();},_defaults:null,_getClosingPoints:function()
{var xcoords=this.get("xcoords").concat(),ycoords=this.get("ycoords").concat();if(this.get("direction")==="vertical")
{xcoords.push(this._leftOrigin);xcoords.push(this._leftOrigin);ycoords.push(ycoords[ycoords.length-1]);ycoords.push(ycoords[0]);}
else
{xcoords.push(xcoords[xcoords.length-1]);xcoords.push(xcoords[0]);ycoords.push(this._bottomOrigin);ycoords.push(this._bottomOrigin);}
xcoords.push(xcoords[0]);ycoords.push(ycoords[0]);return[xcoords,ycoords];},_getStackedClosingPoints:function()
{var order=this.get("order"),type=this.get("type"),graph=this.get("graph"),direction=this.get("direction"),seriesCollection=graph.seriesTypes[type],prevXCoords,prevYCoords,allXCoords=this.get("xcoords").concat(),allYCoords=this.get("ycoords").concat(),firstX=allXCoords[0],firstY=allYCoords[0];if(order>0)
{prevXCoords=seriesCollection[order-1].get("xcoords").concat();prevYCoords=seriesCollection[order-1].get("ycoords").concat();allXCoords=allXCoords.concat(prevXCoords.concat().reverse());allYCoords=allYCoords.concat(prevYCoords.concat().reverse());allXCoords.push(allXCoords[0]);allYCoords.push(allYCoords[0]);}
else
{if(direction==="vertical")
{allXCoords.push(this._leftOrigin);allXCoords.push(this._leftOrigin);allYCoords.push(allYCoords[allYCoords.length-1]);allYCoords.push(firstY);}
else
{allXCoords.push(allXCoords[allXCoords.length-1]);allXCoords.push(firstX);allYCoords.push(this._bottomOrigin);allYCoords.push(this._bottomOrigin);}}
return[allXCoords,allYCoords];},_getAreaDefaults:function()
{return{};}};Y.augment(Fills,Y.Attribute);Y.Fills=Fills;function Plots(cfg)
{var attrs={markers:{getter:function()
{return this._markers;}}};this.addAttrs(attrs,cfg);}
Plots.prototype={_plotDefaults:null,drawPlots:function()
{if(!this.get("xcoords")||this.get("xcoords").length<1)
{return;}
var style=Y.clone(this.get("styles").marker),w=style.width,h=style.height,xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),i=0,len=xcoords.length,top=ycoords[0],left,marker,offsetWidth=w/2,offsetHeight=h/2,fillColors=null,borderColors=null,graphOrder=this.get("graphOrder"),hotspot,isChrome=ISCHROME;if(Y.Lang.isArray(style.fill.color))
{fillColors=style.fill.color.concat();}
if(Y.Lang.isArray(style.border.color))
{borderColors=style.border.colors.concat();}
this._createMarkerCache();if(isChrome)
{this._createHotspotCache();}
for(;i<len;++i)
{top=(ycoords[i]-offsetHeight);left=(xcoords[i]-offsetWidth);if(!top||!left||top===undefined||left===undefined||top=="undefined"||left=="undefined"||isNaN(top)||isNaN(left))
{this._markers.push(null);this._graphicNodes.push(null);continue;}
if(fillColors)
{style.fill.color=fillColors[i%fillColors.length];}
if(borderColors)
{style.border.colors=borderColors[i%borderColors.length];}
marker=this.getMarker(style,graphOrder,i);marker.setPosition(left,top);if(isChrome)
{hotspot=this.getHotspot(style,graphOrder,i);hotspot.setPosition(left,top);hotspot.parentNode.style.zIndex=5;}}
this._clearMarkerCache();if(isChrome)
{this._clearHotspotCache();}},_getPlotDefaults:function()
{var defs={fill:{type:"solid",alpha:1,colors:null,alphas:null,ratios:null},border:{weight:1,alpha:1},width:10,height:10,shape:"circle"};defs.fill.color=this._getDefaultColor(this.get("graphOrder"),"fill");defs.border.color=this._getDefaultColor(this.get("graphOrder"),"border");return defs;},_markers:null,_markerCache:null,getMarker:function(styles,order,index)
{var marker;if(this._markerCache.length>0)
{while(!marker)
{if(this._markerCache.length<1)
{marker=this._createMarker(styles,order,index);break;}
marker=this._markerCache.shift();}
marker.update(styles);}
else
{marker=this._createMarker(styles,order,index);}
this._markers.push(marker);this._graphicNodes.push(marker.parentNode);return marker;},_createMarker:function(styles,order,index)
{var graphic=new Y.Graphic(),marker,cfg=Y.clone(styles);graphic.render(this.get("graph").get("contentBox"));graphic.node.setAttribute("id","markerParent_"+order+"_"+index);cfg.graphic=graphic;marker=new Y.Shape(cfg);marker.addClass("yui3-seriesmarker");marker.node.setAttribute("id","series_"+order+"_"+index);return marker;},_createMarkerCache:function()
{if(this._markers&&this._markers.length>0)
{this._markerCache=this._markers.concat();}
else
{this._markerCache=[];}
this._markers=[];this._graphicNodes=[];},_clearMarkerCache:function()
{var len=this._markerCache.length,i=0,graphic,marker;for(;i<len;++i)
{marker=this._markerCache[i];if(marker)
{graphic=marker.graphics;graphic.destroy();}}
this._markerCache=[];},updateMarkerState:function(type,i)
{if(this._markers[i])
{var w,h,markerStyles,styles=Y.clone(this.get("styles").marker),state=this._getState(type),xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),marker=this._markers[i],graphicNode=marker.parentNode;markerStyles=state=="off"||!styles[state]?styles:styles[state];markerStyles.fill.color=this._getItemColor(markerStyles.fill.color,i);markerStyles.border.color=this._getItemColor(markerStyles.border.color,i);marker.update(markerStyles);w=markerStyles.width;h=markerStyles.height;graphicNode.style.left=(xcoords[i]-w/2)+"px";graphicNode.style.top=(ycoords[i]-h/2)+"px";marker.toggleVisible(this.get("visible"));}},_getItemColor:function(val,i)
{if(Y.Lang.isArray(val))
{return val[i%val.length];}
return val;},_setStyles:function(val)
{val=this._parseMarkerStyles(val);return Y.Renderer.prototype._setStyles.apply(this,[val]);},_parseMarkerStyles:function(val)
{if(val.marker)
{var defs=this._getPlotDefaults();val.marker=this._mergeStyles(val.marker,defs);if(val.marker.over)
{val.marker.over=this._mergeStyles(val.marker.over,val.marker);}
if(val.marker.down)
{val.marker.down=this._mergeStyles(val.marker.down,val.marker);}}
return val;},_getState:function(type)
{var state;switch(type)
{case"mouseout":state="off";break;case"mouseover":state="over";break;case"mouseup":state="over";break;case"mousedown":state="down";break;}
return state;},_stateSyles:null,_hotspots:null,_hotspotCache:null,getHotspot:function(hotspotStyles,order,index)
{var hotspot,styles=Y.clone(hotspotStyles);styles.fill={type:"solid",color:"#000",alpha:0};styles.border={weight:0};if(this._hotspotCache.length>0)
{while(!hotspot)
{if(this._hotspotCache.length<1)
{hotspot=this._createHotspot(styles,order,index);break;}
hotspot=this._hotspotCache.shift();}
hotspot.update(styles);}
else
{hotspot=this._createHotspot(styles,order,index);}
this._hotspots.push(hotspot);return hotspot;},_createHotspot:function(styles,order,index)
{var graphic=new Y.Graphic(),hotspot,cfg=Y.clone(styles);graphic.render(this.get("graph").get("contentBox"));graphic.node.setAttribute("id","hotspotParent_"+order+"_"+index);cfg.graphic=graphic;hotspot=new Y.Shape(cfg);hotspot.addClass("yui3-seriesmarker");hotspot.node.setAttribute("id","hotspot_"+order+"_"+index);return hotspot;},_createHotspotCache:function()
{if(this._hotspots&&this._hotspots.length>0)
{this._hotspotCache=this._hotspots.concat();}
else
{this._hotspotCache=[];}
this._hotspots=[];},_clearHotspotCache:function()
{var len=this._hotspotCache.length,i=0,graphic,hotspot;for(;i<len;++i)
{hotspot=this._hotspotCache[i];if(hotspot)
{graphic=hotspot.graphics;graphic.destroy();}}
this._hotspotCache=[];}};Y.augment(Plots,Y.Attribute);Y.Plots=Plots;function Histogram(){}
Histogram.prototype={drawSeries:function()
{if(this.get("xcoords").length<1)
{return;}
var style=Y.clone(this.get("styles").marker),setSize,calculatedSize,xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),i=0,len=xcoords.length,top=ycoords[0],type=this.get("type"),graph=this.get("graph"),seriesCollection=graph.seriesTypes[type],seriesLen=seriesCollection.length,seriesSize=0,totalSize=0,offset=0,ratio,renderer,order=this.get("order"),graphOrder=this.get("graphOrder"),left,marker,setSizeKey,calculatedSizeKey,config,fillColors=null,borderColors=null,hotspot,isChrome=ISCHROME;if(Y.Lang.isArray(style.fill.color))
{fillColors=style.fill.color.concat();}
if(Y.Lang.isArray(style.border.color))
{borderColors=style.border.colors.concat();}
if(this.get("direction")=="vertical")
{setSizeKey="height";calculatedSizeKey="width";}
else
{setSizeKey="width";calculatedSizeKey="height";}
setSize=style[setSizeKey];calculatedSize=style[calculatedSizeKey];this._createMarkerCache();if(isChrome)
{this._createHotspotCache();}
for(;i<seriesLen;++i)
{renderer=seriesCollection[i];seriesSize+=renderer.get("styles").marker[setSizeKey];if(order>i)
{offset=seriesSize;}}
totalSize=len*seriesSize;if(totalSize>graph.get(setSizeKey))
{ratio=graph.get(setSizeKey)/totalSize;seriesSize*=ratio;offset*=ratio;setSize*=ratio;setSize=Math.max(setSize,1);}
offset-=seriesSize/2;for(i=0;i<len;++i)
{config=this._getMarkerDimensions(xcoords[i],ycoords[i],calculatedSize,offset);top=config.top;calculatedSize=config.calculatedSize;left=config.left;style[setSizeKey]=setSize;style[calculatedSizeKey]=calculatedSize;if(fillColors)
{style.fill.color=fillColors[i%fillColors.length];}
if(borderColors)
{style.border.colors=borderColors[i%borderColors.length];}
marker=this.getMarker(style,graphOrder,i);marker.setPosition(left,top);if(isChrome)
{hotspot=this.getHotspot(style,graphOrder,i);hotspot.setPosition(left,top);hotspot.parentNode.style.zIndex=5;}}
this._clearMarkerCache();if(isChrome)
{this._clearHotspotCache();}},_defaultFillColors:["#66007f","#a86f41","#295454","#996ab2","#e8cdb7","#90bdbd","#000000","#c3b8ca","#968373","#678585"],_getPlotDefaults:function()
{var defs={fill:{type:"solid",alpha:1,colors:null,alphas:null,ratios:null},border:{weight:0,alpha:1},width:12,height:12,shape:"rect",padding:{top:0,left:0,right:0,bottom:0}};defs.fill.color=this._getDefaultColor(this.get("graphOrder"),"fill");defs.border.color=this._getDefaultColor(this.get("graphOrder"),"border");return defs;}};Y.Histogram=Histogram;Y.CartesianSeries=Y.Base.create("cartesianSeries",Y.Base,[Y.Renderer],{_xDisplayName:null,_yDisplayName:null,_leftOrigin:null,_bottomOrigin:null,render:function()
{this._setCanvas();this.addListeners();this.set("rendered",true);this.validate();},addListeners:function()
{var xAxis=this.get("xAxis"),yAxis=this.get("yAxis");if(xAxis)
{xAxis.after("dataReady",Y.bind(this._xDataChangeHandler,this));xAxis.after("dataUpdate",Y.bind(this._xDataChangeHandler,this));}
if(yAxis)
{yAxis.after("dataReady",Y.bind(this._yDataChangeHandler,this));yAxis.after("dataUpdate",Y.bind(this._yDataChangeHandler,this));}
this.after("xAxisChange",this._xAxisChangeHandler);this.after("yAxisChange",this._yAxisChangeHandler);this.after("stylesChange",function(e){var axesReady=this._updateAxisData();if(axesReady)
{this.draw();}});this.after("widthChange",function(e){var axesReady=this._updateAxisData();if(axesReady)
{this.draw();}});this.after("heightChange",function(e){var axesReady=this._updateAxisData();if(axesReady)
{this.draw();}});this.after("visibleChange",this._toggleVisible);},_xAxisChangeHandler:function(e)
{var xAxis=this.get("xAxis");xAxis.after("dataReady",Y.bind(this._xDataChangeHandler,this));xAxis.after("dataUpdate",Y.bind(this._xDataChangeHandler,this));},_yAxisChangeHandler:function(e)
{var yAxis=this.get("yAxis");yAxis.after("dataReady",Y.bind(this._yDataChangeHandler,this));yAxis.after("dataUpdate",Y.bind(this._yDataChangeHandler,this));},GUID:"yuicartesianseries",_xDataChangeHandler:function(event)
{var axesReady=this._updateAxisData();if(axesReady)
{this.draw();}},_yDataChangeHandler:function(event)
{var axesReady=this._updateAxisData();if(axesReady)
{this.draw();}},_updateAxisData:function()
{var xAxis=this.get("xAxis"),yAxis=this.get("yAxis"),xKey=this.get("xKey"),yKey=this.get("yKey"),yData,xData;if(!xAxis||!yAxis||!xKey||!yKey)
{return false;}
xData=xAxis.getDataByKey(xKey);yData=yAxis.getDataByKey(yKey);if(!xData||!yData)
{return false;}
this.set("xData",xData.concat());this.set("yData",yData.concat());return true;},validate:function()
{if((this.get("xData")&&this.get("yData"))||this._updateAxisData())
{this.draw();}},_setCanvas:function()
{this.set("graphic",new Y.Graphic());this.get("graphic").render(this.get("graph").get("contentBox"));},setAreaData:function()
{var nextX,nextY,graph=this.get("graph"),w=graph.get("width"),h=graph.get("height"),xAxis=this.get("xAxis"),yAxis=this.get("yAxis"),xData=this.get("xData").concat(),yData=this.get("yData").concat(),xOffset=xAxis.getEdgeOffset(xData.length,w),yOffset=yAxis.getEdgeOffset(yData.length,h),padding=this.get("styles").padding,leftPadding=padding.left,topPadding=padding.top,dataWidth=w-(leftPadding+padding.right+xOffset),dataHeight=h-(topPadding+padding.bottom+yOffset),xcoords=[],ycoords=[],xMax=xAxis.get("maximum"),xMin=xAxis.get("minimum"),yMax=yAxis.get("maximum"),yMin=yAxis.get("minimum"),xScaleFactor=dataWidth /(xMax-xMin),yScaleFactor=dataHeight /(yMax-yMin),dataLength,direction=this.get("direction"),i=0,xMarkerPlane=[],yMarkerPlane=[],xMarkerPlaneOffset=this.get("xMarkerPlaneOffset"),yMarkerPlaneOffset=this.get("yMarkerPlaneOffset"),graphic=this.get("graphic");dataLength=xData.length;xOffset*=0.5;yOffset*=0.5;if(direction==="vertical")
{yData=yData.reverse();}
if(graphic)
{graphic.setSize(w,h);}
this._leftOrigin=Math.round(((0-xMin)*xScaleFactor)+leftPadding+xOffset);this._bottomOrigin=Math.round((dataHeight+topPadding+yOffset)-(0-yMin)*yScaleFactor);for(;i<dataLength;++i)
{nextX=Math.round((((xData[i]-xMin)*xScaleFactor)+leftPadding+xOffset));nextY=Math.round(((dataHeight+topPadding+yOffset)-(yData[i]-yMin)*yScaleFactor));xcoords.push(nextX);ycoords.push(nextY);xMarkerPlane.push({start:nextX-xMarkerPlaneOffset,end:nextX+xMarkerPlaneOffset});yMarkerPlane.push({start:nextY-yMarkerPlaneOffset,end:nextY+yMarkerPlaneOffset});}
this.set("xcoords",xcoords);this.set("ycoords",ycoords);this.set("xMarkerPlane",xMarkerPlane);this.set("yMarkerPlane",yMarkerPlane);},draw:function()
{var graph=this.get("graph"),w=graph.get("width"),h=graph.get("height");if(this.get("rendered"))
{if((isFinite(w)&&isFinite(h)&&w>0&&h>0)&&((this.get("xData")&&this.get("yData"))||this._updateAxisData()))
{if(this._drawing)
{this._callLater=true;return;}
this._drawing=true;this._callLater=false;this.setAreaData();if(this.get("xcoords")&&this.get("ycoords"))
{this.drawSeries();}
this._drawing=false;if(this._callLater)
{this.draw();}
else
{this._toggleVisible(this.get("visible"));this.fire("drawingComplete");}}}},_defaultPlaneOffset:4,_getDefaultStyles:function()
{return{padding:{top:0,left:0,right:0,bottom:0}};},_defaultLineColors:["#426ab3","#d09b2c","#000000","#b82837","#b384b5","#ff7200","#779de3","#cbc8ba","#7ed7a6","#007a6c"],_defaultFillColors:["#6084d0","#eeb647","#6c6b5f","#d6484f","#ce9ed1","#ff9f3b","#93b7ff","#e0ddd0","#94ecba","#309687"],_defaultBorderColors:["#205096","#b38206","#000000","#94001e","#9d6fa0","#e55b00","#5e85c9","#adab9e","#6ac291","#006457"],_defaultSliceColors:["#66007f","#a86f41","#295454","#996ab2","#e8cdb7","#90bdbd","#000000","#c3b8ca","#968373","#678585"],_getDefaultColor:function(index,type)
{var colors={line:this._defaultLineColors,fill:this._defaultFillColors,border:this._defaultBorderColors,slice:this._defaultSliceColors},col=colors[type],l=col.length;index=index||0;if(index>=l)
{index=index%l;}
type=type||"fill";return colors[type][index];},_toggleVisible:function(e)
{var graphic=this.get("graphic"),markers=this.get("markers"),i=0,len,visible=this.get("visible"),marker;if(graphic)
{graphic.toggleVisible(visible);}
if(markers)
{len=markers.length;for(;i<len;++i)
{marker=markers[i];if(marker)
{marker.toggleVisible(visible);}}}
if(this._lineGraphic)
{this._lineGraphic.toggleVisible(visible);}}},{ATTRS:{xDisplayName:{getter:function()
{return this._xDisplayName||this.get("xKey");},setter:function(val)
{this._xDisplayName=val;return val;}},yDisplayName:{getter:function()
{return this._yDisplayName||this.get("yKey");},setter:function(val)
{this._yDisplayName=val;return val;}},categoryDisplayName:{readOnly:true,getter:function()
{return this.get("direction")=="vertical"?this.get("yDisplayName"):this.get("xDisplayName");}},valueDisplayName:{readOnly:true,getter:function()
{return this.get("direction")=="vertical"?this.get("xDisplayName"):this.get("yDisplayName");}},type:{value:"cartesian"},order:{},graphOrder:{},xcoords:{},ycoords:{},graph:{},xAxis:{},yAxis:{},xKey:{},yKey:{},xData:{},yData:{},rendered:{value:false},width:{readOnly:true,getter:function()
{this.get("graph").get("width");}},height:{readOnly:true,getter:function()
{this.get("graph").get("height");}},visible:{value:true},xMarkerPlane:{},yMarkerPlane:{},xMarkerPlaneOffset:{getter:function(){var marker=this.get("styles").marker;if(marker&&marker.width&&isFinite(marker.width))
{return marker.width*0.5;}
return this._defaultPlaneOffset;}},yMarkerPlaneOffset:{getter:function(){var marker=this.get("styles").marker;if(marker&&marker.height&&isFinite(marker.height))
{return marker.height*0.5;}
return this._defaultPlaneOffset;}},direction:{value:"horizontal"}}});Y.MarkerSeries=Y.Base.create("markerSeries",Y.CartesianSeries,[Y.Plots],{renderUI:function()
{this._setNode();},drawSeries:function()
{this.drawPlots();},_setStyles:function(val)
{if(!val.marker)
{val={marker:val};}
val=this._parseMarkerStyles(val);return Y.MarkerSeries.superclass._mergeStyles.apply(this,[val,this._getDefaultStyles()]);},_getDefaultStyles:function()
{var styles=this._mergeStyles({marker:this._getPlotDefaults()},Y.MarkerSeries.superclass._getDefaultStyles());return styles;}},{ATTRS:{type:{value:"marker"}}});Y.LineSeries=Y.Base.create("lineSeries",Y.CartesianSeries,[Y.Lines],{drawSeries:function()
{this.get("graphic").clear();this.drawLines();},_setStyles:function(val)
{if(!val.line)
{val={line:val};}
return Y.LineSeries.superclass._setStyles.apply(this,[val]);},_getDefaultStyles:function()
{var styles=this._mergeStyles({line:this._getLineDefaults()},Y.LineSeries.superclass._getDefaultStyles());return styles;}},{ATTRS:{type:{value:"line"}}});Y.SplineSeries=Y.Base.create("splineSeries",Y.CartesianSeries,[Y.CurveUtil,Y.Lines],{drawSeries:function()
{this.get("graphic").clear();this.drawSpline();}},{ATTRS:{type:{value:"spline"}}});Y.AreaSplineSeries=Y.Base.create("areaSplineSeries",Y.CartesianSeries,[Y.Fills,Y.CurveUtil],{drawSeries:function()
{this.get("graphic").clear();this.drawAreaSpline();}},{ATTRS:{type:{value:"areaSpline"}}});Y.StackedSplineSeries=Y.Base.create("stackedSplineSeries",Y.SplineSeries,[Y.StackingUtil],{setAreaData:function()
{Y.StackedSplineSeries.superclass.setAreaData.apply(this);this._stackCoordinates.apply(this);}},{ATTRS:{type:{value:"stackedSpline"}}});Y.StackedMarkerSeries=Y.Base.create("stackedMarkerSeries",Y.MarkerSeries,[Y.StackingUtil],{setAreaData:function()
{Y.StackedMarkerSeries.superclass.setAreaData.apply(this);this._stackCoordinates.apply(this);}},{ATTRS:{type:{value:"stackedMarker"}}});Y.ColumnSeries=Y.Base.create("columnSeries",Y.MarkerSeries,[Y.Histogram],{_getMarkerDimensions:function(xcoord,ycoord,calculatedSize,offset)
{var config={top:ycoord,left:xcoord+offset};config.calculatedSize=this._bottomOrigin-config.top;return config;},updateMarkerState:function(type,i)
{if(this._markers[i])
{var styles=Y.clone(this.get("styles").marker),markerStyles,state=this._getState(type),xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),marker=this._markers[i],graph=this.get("graph"),seriesCollection=graph.seriesTypes[this.get("type")],seriesLen=seriesCollection.length,seriesSize=0,offset=0,renderer,n=0,xs=[],order=this.get("order");markerStyles=state=="off"||!styles[state]?styles:styles[state];markerStyles.fill.color=this._getItemColor(markerStyles.fill.color,i);markerStyles.border.color=this._getItemColor(markerStyles.border.color,i);markerStyles.height=this._bottomOrigin-ycoords[i];marker.update(markerStyles);for(;n<seriesLen;++n)
{renderer=seriesCollection[n].get("markers")[i];xs[n]=xcoords[i]+seriesSize;seriesSize+=renderer.width;if(order>n)
{offset=seriesSize;}
offset-=seriesSize/2;}
for(n=0;n<seriesLen;++n)
{renderer=Y.one(seriesCollection[n]._graphicNodes[i]);renderer.setStyle("left",(xs[n]-seriesSize/2)+"px");}}}},{ATTRS:{type:{value:"column"}}});Y.BarSeries=Y.Base.create("barSeries",Y.MarkerSeries,[Y.Histogram],{renderUI:function()
{this._setNode();},_getMarkerDimensions:function(xcoord,ycoord,calculatedSize,offset)
{var config={top:ycoord+offset,left:this._leftOrigin};config.calculatedSize=xcoord-config.left;return config;},updateMarkerState:function(type,i)
{if(this._markers[i])
{var styles=Y.clone(this.get("styles").marker),markerStyles,state=this._getState(type),xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),marker=this._markers[i],graph=this.get("graph"),seriesCollection=graph.seriesTypes[this.get("type")],seriesLen=seriesCollection.length,seriesSize=0,offset=0,renderer,n=0,ys=[],order=this.get("order");markerStyles=state=="off"||!styles[state]?styles:styles[state];markerStyles.fill.color=this._getItemColor(markerStyles.fill.color,i);markerStyles.border.color=this._getItemColor(markerStyles.border.color,i);markerStyles.width=(xcoords[i]-this._leftOrigin);marker.update(markerStyles);for(;n<seriesLen;++n)
{renderer=seriesCollection[n].get("markers")[i];ys[n]=ycoords[i]+seriesSize;seriesSize+=renderer.height;if(order>n)
{offset=seriesSize;}
offset-=seriesSize/2;}
for(n=0;n<seriesLen;++n)
{renderer=Y.one(seriesCollection[n]._graphicNodes[i]);renderer.setStyle("top",(ys[n]-seriesSize/2));}}}},{ATTRS:{type:{value:"bar"},direction:{value:"vertical"}}});Y.AreaSeries=Y.Base.create("areaSeries",Y.CartesianSeries,[Y.Fills],{drawSeries:function()
{this.get("graphic").clear();this.drawFill.apply(this,this._getClosingPoints());},_setStyles:function(val)
{if(!val.area)
{val={area:val};}
return Y.AreaSeries.superclass._setStyles.apply(this,[val]);},_getDefaultStyles:function()
{var styles=this._mergeStyles({area:this._getAreaDefaults()},Y.AreaSeries.superclass._getDefaultStyles());return styles;}},{ATTRS:{type:{value:"area"}}});Y.StackedAreaSplineSeries=Y.Base.create("stackedAreaSplineSeries",Y.AreaSeries,[Y.CurveUtil,Y.StackingUtil],{drawSeries:function()
{this.get("graphic").clear();this._stackCoordinates();this.drawStackedAreaSpline();}},{ATTRS:{type:{value:"stackedAreaSpline"}}});Y.ComboSeries=Y.Base.create("comboSeries",Y.CartesianSeries,[Y.Fills,Y.Lines,Y.Plots],{drawSeries:function()
{this.get("graphic").clear();if(this.get("showAreaFill"))
{this.drawFill.apply(this,this._getClosingPoints());}
if(this.get("showLines"))
{this.drawLines();}
if(this.get("showMarkers"))
{this.drawPlots();}},_getDefaultStyles:function()
{var styles=Y.ComboSeries.superclass._getDefaultStyles();styles.line=this._getLineDefaults();styles.marker=this._getPlotDefaults();styles.area=this._getAreaDefaults();return styles;}},{ATTRS:{type:{value:"combo"},showAreaFill:{value:false},showLines:{value:true},showMarkers:{value:true},marker:{lazyAdd:false,getter:function()
{return this.get("styles").marker;},setter:function(val)
{this.set("styles",{marker:val});}},line:{lazyAdd:false,getter:function()
{return this.get("styles").line;},setter:function(val)
{this.set("styles",{line:val});}},area:{lazyAdd:false,getter:function()
{return this.get("styles").area;},setter:function(val)
{this.set("styles",{area:val});}}}});Y.StackedComboSeries=Y.Base.create("stackedComboSeries",Y.ComboSeries,[Y.StackingUtil],{setAreaData:function()
{Y.StackedComboSeries.superclass.setAreaData.apply(this);this._stackCoordinates.apply(this);},drawSeries:function()
{this.get("graphic").clear();if(this.get("showAreaFill"))
{this.drawFill.apply(this,this._getStackedClosingPoints());}
if(this.get("showLines"))
{this.drawLines();}
if(this.get("showMarkers"))
{this.drawPlots();}}},{ATTRS:{type:{value:"stackedCombo"},showAreaFill:{value:true}}});Y.ComboSplineSeries=Y.Base.create("comboSplineSeries",Y.ComboSeries,[Y.CurveUtil],{drawSeries:function()
{this.get("graphic").clear();if(this.get("showAreaFill"))
{this.drawAreaSpline();}
if(this.get("showLines"))
{this.drawSpline();}
if(this.get("showMarkers"))
{this.drawPlots();}}},{ATTRS:{type:{value:"comboSpline"}}});Y.StackedComboSplineSeries=Y.Base.create("stackedComboSplineSeries",Y.StackedComboSeries,[Y.CurveUtil],{drawSeries:function()
{this.get("graphic").clear();if(this.get("showAreaFill"))
{this.drawStackedAreaSpline();}
if(this.get("showLines"))
{this.drawSpline();}
if(this.get("showMarkers"))
{this.drawPlots();}}},{ATTRS:{type:{value:"stackedComboSpline"},showAreaFill:{value:true}}});Y.StackedLineSeries=Y.Base.create("stackedLineSeries",Y.LineSeries,[Y.StackingUtil],{setAreaData:function()
{Y.StackedLineSeries.superclass.setAreaData.apply(this);this._stackCoordinates.apply(this);}},{ATTRS:{type:{value:"stackedLine"}}});Y.StackedAreaSeries=Y.Base.create("stackedAreaSeries",Y.AreaSeries,[Y.StackingUtil],{setAreaData:function()
{Y.StackedAreaSeries.superclass.setAreaData.apply(this);this._stackCoordinates.apply(this);},drawSeries:function()
{this.get("graphic").clear();this.drawFill.apply(this,this._getStackedClosingPoints());}},{ATTRS:{type:{value:"stackedArea"}}});Y.StackedColumnSeries=Y.Base.create("stackedColumnSeries",Y.ColumnSeries,[Y.StackingUtil],{drawSeries:function()
{if(this.get("xcoords").length<1)
{return;}
var style=this.get("styles").marker,w=style.width,h=style.height,xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),i=0,len=xcoords.length,top=ycoords[0],type=this.get("type"),graph=this.get("graph"),seriesCollection=graph.seriesTypes[type],ratio,order=this.get("order"),graphOrder=this.get("graphOrder"),left,marker,lastCollection,negativeBaseValues,positiveBaseValues,useOrigin=order===0,totalWidth=len*w,hotspot,isChrome=ISCHROME;this._createMarkerCache();if(isChrome)
{this._createHotspotCache();}
if(totalWidth>this.get("width"))
{ratio=this.width/totalWidth;w*=ratio;w=Math.max(w,1);}
if(!useOrigin)
{lastCollection=seriesCollection[order-1];negativeBaseValues=lastCollection.get("negativeBaseValues");positiveBaseValues=lastCollection.get("positiveBaseValues");}
else
{negativeBaseValues=[];positiveBaseValues=[];}
this.set("negativeBaseValues",negativeBaseValues);this.set("positiveBaseValues",positiveBaseValues);for(i=0;i<len;++i)
{top=ycoords[i];if(useOrigin)
{h=this._bottomOrigin-top;if(top<this._bottomOrigin)
{positiveBaseValues[i]=top;negativeBaseValues[i]=this._bottomOrigin;}
else if(top>this._bottomOrigin)
{positiveBaseValues[i]=this._bottomOrigin;negativeBaseValues[i]=top;}
else
{positiveBaseValues[i]=top;negativeBaseValues[i]=top;}}
else
{if(top>this._bottomOrigin)
{top+=(negativeBaseValues[i]-this._bottomOrigin);h=negativeBaseValues[i]-top;negativeBaseValues[i]=top;}
else if(top<this._bottomOrigin)
{top=positiveBaseValues[i]-(this._bottomOrigin-ycoords[i]);h=positiveBaseValues[i]-top;positiveBaseValues[i]=top;}}
left=xcoords[i]-w/2;style.width=w;style.height=h;marker=this.getMarker(style,graphOrder,i);marker.setPosition(left,top);if(isChrome)
{hotspot=this.getHotspot(style,graphOrder,i);hotspot.setPosition(left,top);hotspot.parentNode.style.zIndex=5;}}
this._clearMarkerCache();if(isChrome)
{this._clearHotspotCache();}},updateMarkerState:function(type,i)
{if(this._markers[i])
{var styles,markerStyles,state=this._getState(type),xcoords=this.get("xcoords"),marker=this._markers[i],offset=0;styles=this.get("styles").marker;markerStyles=state=="off"||!styles[state]?styles:styles[state];markerStyles.height=marker.height;marker.update(markerStyles);offset=styles.width*0.5;if(marker.parentNode)
{Y.one(marker.parentNode).setStyle("left",(xcoords[i]-offset));}}},_getPlotDefaults:function()
{var defs={fill:{type:"solid",alpha:1,colors:null,alphas:null,ratios:null},border:{weight:0,alpha:1},width:24,height:24,shape:"rect",padding:{top:0,left:0,right:0,bottom:0}};defs.fill.color=this._getDefaultColor(this.get("graphOrder"),"fill");defs.border.color=this._getDefaultColor(this.get("graphOrder"),"border");return defs;}},{ATTRS:{type:{value:"stackedColumn"},negativeBaseValues:{value:null},positiveBaseValues:{value:null}}});Y.StackedBarSeries=Y.Base.create("stackedBarSeries",Y.BarSeries,[Y.StackingUtil],{drawSeries:function()
{if(this.get("xcoords").length<1)
{return;}
var style=this.get("styles").marker,w=style.width,h=style.height,xcoords=this.get("xcoords"),ycoords=this.get("ycoords"),i=0,len=xcoords.length,top=ycoords[0],type=this.get("type"),graph=this.get("graph"),seriesCollection=graph.seriesTypes[type],ratio,order=this.get("order"),graphOrder=this.get("graphOrder"),left,marker,lastCollection,negativeBaseValues,positiveBaseValues,useOrigin=order===0,totalHeight=len*h,hotspot,isChrome=ISCHROME;this._createMarkerCache();if(isChrome)
{this._createHotspotCache();}
if(totalHeight>this.get("height"))
{ratio=this.height/totalHeight;h*=ratio;h=Math.max(h,1);}
if(!useOrigin)
{lastCollection=seriesCollection[order-1];negativeBaseValues=lastCollection.get("negativeBaseValues");positiveBaseValues=lastCollection.get("positiveBaseValues");}
else
{negativeBaseValues=[];positiveBaseValues=[];}
this.set("negativeBaseValues",negativeBaseValues);this.set("positiveBaseValues",positiveBaseValues);for(i=0;i<len;++i)
{top=ycoords[i];left=xcoords[i];if(useOrigin)
{w=left-this._leftOrigin;if(left>this._leftOrigin)
{positiveBaseValues[i]=left;negativeBaseValues[i]=this._leftOrigin;}
else if(left<this._leftOrigin)
{positiveBaseValues[i]=this._leftOrigin;negativeBaseValues[i]=left;}
else
{positiveBaseValues[i]=left;negativeBaseValues[i]=this._leftOrigin;}
left-=w;}
else
{if(left<this._leftOrigin)
{left=negativeBaseValues[i]-(this._leftOrigin-xcoords[i]);w=negativeBaseValues[i]-left;negativeBaseValues[i]=left;}
else if(left>this._leftOrigin)
{left+=(positiveBaseValues[i]-this._leftOrigin);w=left-positiveBaseValues[i];positiveBaseValues[i]=left;left-=w;}}
top-=h/2;style.width=w;style.height=h;marker=this.getMarker(style,graphOrder,i);marker.setPosition(left,top);if(isChrome)
{hotspot=this.getHotspot(style,graphOrder,i);hotspot.setPosition(left,top);hotspot.parentNode.style.zIndex=5;}}
this._clearMarkerCache();if(isChrome)
{this._clearHotspotCache();}},updateMarkerState:function(type,i)
{if(this._markers[i])
{var state=this._getState(type),ycoords=this.get("ycoords"),marker=this._markers[i],styles=this.get("styles").marker,h=styles.height,markerStyles=state=="off"||!styles[state]?styles:styles[state];markerStyles.width=marker.width;marker.update(markerStyles);if(marker.parentNode)
{Y.one(marker.parentNode).setStyle("top",(ycoords[i]-h/2));}}},_getPlotDefaults:function()
{var defs={fill:{type:"solid",alpha:1,colors:null,alphas:null,ratios:null},border:{weight:0,alpha:1},width:24,height:24,shape:"rect",padding:{top:0,left:0,right:0,bottom:0}};defs.fill.color=this._getDefaultColor(this.get("graphOrder"),"fill");defs.border.color=this._getDefaultColor(this.get("graphOrder"),"border");return defs;}},{ATTRS:{type:{value:"stackedBar"},direction:{value:"vertical"},negativeBaseValues:{value:null},positiveBaseValues:{value:null}}});Y.PieSeries=Y.Base.create("pieSeries",Y.MarkerSeries,[],{_map:null,_image:null,_setMap:function()
{var id="pieHotSpotMapi_"+Math.round(100000*Math.random()),cb=this.get("graph").get("contentBox"),areaNode;if(this._image)
{cb.removeChild(this._image);while(this._areaNodes&&this._areaNodes.length>0)
{areaNode=this._areaNodes.shift();this._map.removeChild(areaNode);}
cb.removeChild(this._map);}
this._image=document.createElement("img");this._image.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAABCAYAAAD9yd/wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJJREFUeNpiZGBgSGPAAgACDAAIkABoFyloZQAAAABJRU5ErkJggg==";cb.appendChild(this._image);this._image.setAttribute("usemap","#"+id);this._image.style.zIndex=3;this._image.style.opacity=0;this._image.setAttribute("alt","imagemap");this._map=document.createElement("map");this._map.style.zIndex=5;cb.appendChild(this._map);this._map.setAttribute("name",id);this._map.setAttribute("id",id);this._areaNodes=[];},_categoryDisplayName:null,_valueDisplayName:null,addListeners:function()
{var categoryAxis=this.get("categoryAxis"),valueAxis=this.get("valueAxis");if(categoryAxis)
{categoryAxis.after("dataReady",Y.bind(this._categoryDataChangeHandler,this));categoryAxis.after("dataUpdate",Y.bind(this._categoryDataChangeHandler,this));}
if(valueAxis)
{valueAxis.after("dataReady",Y.bind(this._valueDataChangeHandler,this));valueAxis.after("dataUpdate",Y.bind(this._valueDataChangeHandler,this));}
this.after("categoryAxisChange",this.categoryAxisChangeHandler);this.after("valueAxisChange",this.valueAxisChangeHandler);this.after("stylesChange",this._updateHandler);},validate:function()
{this.draw();this._renderered=true;},_categoryAxisChangeHandler:function(e)
{var categoryAxis=this.get("categoryAxis");categoryAxis.after("dataReady",Y.bind(this._categoryDataChangeHandler,this));categoryAxis.after("dataUpdate",Y.bind(this._categoryDataChangeHandler,this));},_valueAxisChangeHandler:function(e)
{var valueAxis=this.get("valueAxis");valueAxis.after("dataReady",Y.bind(this._valueDataChangeHandler,this));valueAxis.after("dataUpdate",Y.bind(this._valueDataChangeHandler,this));},GUID:"pieseries",_categoryDataChangeHandler:function(event)
{if(this._rendered&&this.get("categoryKey")&&this.get("valueKey"))
{this.draw();}},_valueDataChangeHandler:function(event)
{if(this._rendered&&this.get("categoryKey")&&this.get("valueKey"))
{this.draw();}},draw:function()
{var graph=this.get("graph"),w=graph.get("width"),h=graph.get("height");if(isFinite(w)&&isFinite(h)&&w>0&&h>0)
{this._rendered=true;this.drawSeries();this.fire("drawingComplete");}},drawPlots:function()
{var values=this.get("valueAxis").getDataByKey(this.get("valueKey")).concat(),catValues=this.get("categoryAxis").getDataByKey(this.get("categoryKey")).concat(),totalValue=0,itemCount=values.length,styles=this.get("styles").marker,fillColors=styles.fill.colors,fillAlphas=styles.fill.alphas||["1"],borderColors=styles.border.colors,borderWeights=[styles.border.weight],borderAlphas=[styles.border.alpha],tbw=borderWeights.concat(),tbc=borderColors.concat(),tba=borderAlphas.concat(),tfc,tfa,padding=styles.padding,graph=this.get("graph"),w=graph.get("width")-(padding.left+padding.right),h=graph.get("height")-(padding.top+padding.bottom),startAngle=-90,halfWidth=w / 2,halfHeight=h / 2,radius=Math.min(halfWidth,halfHeight),i=0,value,angle=0,lc,la,lw,wedgeStyle,marker,graphOrder=this.get("graphOrder"),isCanvas=DRAWINGAPI=="canvas";for(;i<itemCount;++i)
{value=values[i];values.push(value);if(!isNaN(value))
{totalValue+=value;}}
tfc=fillColors?fillColors.concat():null;tfa=fillAlphas?fillAlphas.concat():null;this._createMarkerCache();if(isCanvas)
{this._setMap();this._image.width=w;this._image.height=h;}
for(i=0;i<itemCount;i++)
{value=values[i];if(totalValue===0)
{angle=360 / values.length;}
else
{angle=360*(value / totalValue);}
angle=Math.round(angle);if(tfc&&tfc.length<1)
{tfc=fillColors.concat();}
if(tfa&&tfa.length<1)
{tfa=fillAlphas.concat();}
if(tbw&&tbw.length<1)
{tbw=borderWeights.concat();}
if(tbw&&tbc.length<1)
{tbc=borderColors.concat();}
if(tba&&tba.length<1)
{tba=borderAlphas.concat();}
lw=tbw?tbw.shift():null;lc=tbc?tbc.shift():null;la=tba?tba.shift():null;startAngle+=angle;wedgeStyle={border:{color:lc,weight:lw,alpha:la},fill:{color:tfc?tfc.shift():this._getDefaultColor(i,"slice"),alpha:tfa?tfa.shift():null},shape:"wedge",props:{arc:angle,radius:radius,startAngle:startAngle,x:halfWidth,y:halfHeight},width:w,height:h};marker=this.getMarker(wedgeStyle,graphOrder,i);if(isCanvas)
{this._addHotspot(wedgeStyle.props,graphOrder,i);}}
this._clearMarkerCache();},_addHotspot:function(cfg,seriesIndex,index)
{var areaNode=document.createElement("area"),i=1,x=cfg.x,y=cfg.y,arc=cfg.arc,startAngle=cfg.startAngle-arc,endAngle=cfg.startAngle,radius=cfg.radius,ax=x+Math.cos(startAngle / 180*Math.PI)*radius,ay=y+Math.sin(startAngle / 180*Math.PI)*radius,bx=x+Math.cos(endAngle / 180*Math.PI)*radius,by=y+Math.sin(endAngle / 180*Math.PI)*radius,numPoints=Math.floor(arc/10)-1,divAngle=(arc/(Math.floor(arc/10))/ 180)*Math.PI,angleCoord=Math.atan((ay-y)/(ax-x)),pts=x+", "+y+", "+ax+", "+ay,cosAng,sinAng,multDivAng;for(i=1;i<=numPoints;++i)
{multDivAng=divAngle*i;cosAng=Math.cos(angleCoord+multDivAng);sinAng=Math.sin(angleCoord+multDivAng);if(startAngle<=90)
{pts+=", "+(x+(radius*Math.cos(angleCoord+(divAngle*i))));pts+=", "+(y+(radius*Math.sin(angleCoord+(divAngle*i))));}
else
{pts+=", "+(x-(radius*Math.cos(angleCoord+(divAngle*i))));pts+=", "+(y-(radius*Math.sin(angleCoord+(divAngle*i))));}}
pts+=", "+bx+", "+by;pts+=", "+x+", "+y;this._map.appendChild(areaNode);areaNode.setAttribute("class","yui3-seriesmarker");areaNode.setAttribute("id","hotSpot_"+seriesIndex+"_"+index);areaNode.setAttribute("shape","polygon");areaNode.setAttribute("coords",pts);this._areaNodes.push(areaNode);},updateMarkerState:function(type,i)
{if(this._markers[i])
{var state=this._getState(type),markerStyles,indexStyles,marker=this._markers[i],styles=this.get("styles").marker;markerStyles=state=="off"||!styles[state]?styles:styles[state];indexStyles=this._mergeStyles(markerStyles,{});indexStyles.fill.color=indexStyles.fill.colors[i%indexStyles.fill.colors.length];indexStyles.fill.alpha=indexStyles.fill.alphas[i%indexStyles.fill.alphas.length];marker.update(indexStyles);}},_createMarker:function(styles,order,index)
{var cfg=Y.clone(styles),marker;cfg.graphic=this.get("graphic");marker=new Y.Shape(cfg);marker.addClass("yui3-seriesmarker");marker.node.setAttribute("id","series_"+order+"_"+index);return marker;},_clearMarkerCache:function()
{var len=this._markerCache.length,i=0,marker;for(;i<len;++i)
{marker=this._markerCache[i];if(marker&&marker.node&&marker.parentNode)
{marker.parentNode.removeChild(marker.node);}}
this._markerCache=[];},_getPlotDefaults:function()
{var defs={padding:{top:0,left:0,right:0,bottom:0},fill:{alphas:["1"]},border:{weight:0,alpha:1}};defs.fill.colors=this._defaultSliceColors;defs.border.colors=this._defaultBorderColors;return defs;},_defaultLineColors:["#426ab3","#d09b2c","#000000","#b82837","#b384b5","#ff7200","#779de3","#cbc8ba","#7ed7a6","#007a6c"],_defaultFillColors:["#6084d0","#eeb647","#6c6b5f","#d6484f","#ce9ed1","#ff9f3b","#93b7ff","#e0ddd0","#94ecba","#309687"],_defaultBorderColors:["#205096","#b38206","#000000","#94001e","#9d6fa0","#e55b00","#5e85c9","#adab9e","#6ac291","#006457"],_defaultSliceColors:["#66007f","#a86f41","#295454","#996ab2","#e8cdb7","#90bdbd","#000000","#c3b8ca","#968373","#678585"],_getDefaultColor:function(index,type)
{var colors={line:this._defaultLineColors,fill:this._defaultFillColors,border:this._defaultBorderColors,slice:this._defaultSliceColors},col=colors[type],l=col.length;index=index||0;if(index>=l)
{index=index%l;}
type=type||"fill";return colors[type][index];}},{ATTRS:{type:{value:"pie"},order:{},graph:{},categoryAxis:{value:null,validator:function(value)
{return value!==this.get("categoryAxis");}},valueAxis:{value:null,validator:function(value)
{return value!==this.get("valueAxis");}},categoryKey:{value:null,validator:function(value)
{return value!==this.get("categoryKey");}},valueKey:{value:null,validator:function(value)
{return value!==this.get("valueKey");}},categoryDisplayName:{setter:function(val)
{this._categoryDisplayName=val;return val;},getter:function()
{return this._categoryDisplayName||this.get("categoryKey");}},valueDisplayName:{setter:function(val)
{this._valueDisplayName=val;return val;},getter:function()
{return this._valueDisplayName||this.get("valueKey");}},slices:null}});Y.Gridlines=Y.Base.create("gridlines",Y.Base,[Y.Renderer],{render:function()
{this._setCanvas();},remove:function()
{var graphic=this.get("graphic"),gNode;if(graphic)
{gNode=graphic.node;if(gNode)
{Y.one(gNode).remove();}}},draw:function()
{if(this.get("axis")&&this.get("graph"))
{this._drawGridlines();}},_drawGridlines:function()
{var graphic=this.get("graphic"),axis=this.get("axis"),axisPosition=axis.get("position"),points,i=0,l,direction=this.get("direction"),graph=this.get("graph"),w=graph.get("width"),h=graph.get("height"),line=this.get("styles").line,color=line.color,weight=line.weight,alpha=line.alpha,lineFunction=direction=="vertical"?this._verticalLine:this._horizontalLine;if(axisPosition=="none")
{points=[];l=axis.get("styles").majorUnit.count;for(;i<l;++i)
{points[i]={x:w*(i/(l-1)),y:h*(i/(l-1))};}
i=0;}
else
{points=axis.get("tickPoints");l=points.length;}
if(!graphic)
{this._setCanvas();graphic=this.get("graphic");}
graphic.clear();graphic.setSize(w,h);graphic.lineStyle(weight,color,alpha);for(;i<l;++i)
{lineFunction(graphic,points[i],w,h);}
graphic.end();},_horizontalLine:function(graphic,pt,w,h)
{graphic.moveTo(0,pt.y);graphic.lineTo(w,pt.y);},_verticalLine:function(graphic,pt,w,h)
{graphic.moveTo(pt.x,0);graphic.lineTo(pt.x,h);},_setCanvas:function()
{this.set("graphic",new Y.Graphic());this.get("graphic").render(this.get("graph").get("contentBox"));},_getDefaultStyles:function()
{var defs={line:{color:"#f0efe9",weight:1,alpha:1}};return defs;}},{ATTRS:{direction:{},axis:{},graph:{}}});Y.Graph=Y.Base.create("graph",Y.Widget,[Y.Renderer],{bindUI:function()
{var bb=this.get("boundingBox");bb.setStyle("position","absolute");this.after("widthChange",this._sizeChangeHandler);this.after("heightChange",this._sizeChangeHandler);this.after("stylesChange",this._updateStyles);},syncUI:function()
{if(this.get("showBackground"))
{var graphic=new Y.Graphic(),graphicNode,cb=this.get("contentBox"),bg=this.get("styles").background,border=bg.border,weight=border.weight||0,w=this.get("width"),h=this.get("height");if(w)
{w+=weight*2;bg.width=w;}
if(h)
{h+=weight*2;bg.height=h;}
graphic.render(cb);this._background=graphic.getShape(bg);graphicNode=Y.one(graphic.node);graphicNode.setStyle("left",0-weight);graphicNode.setStyle("top",0-weight);graphicNode.setStyle("zIndex",-1);}},renderUI:function()
{var sc=this.get("seriesCollection"),series,i=0,len=sc.length,hgl=this.get("horizontalGridlines"),vgl=this.get("verticalGridlines");for(;i<len;++i)
{series=sc[i];if(series instanceof Y.CartesianSeries)
{series.render();}}
if(hgl&&hgl instanceof Y.Gridlines)
{hgl.draw();}
if(vgl&&vgl instanceof Y.Gridlines)
{vgl.draw();}},seriesTypes:null,getSeriesByIndex:function(val)
{var col=this.get("seriesCollection"),series;if(col&&col.length>val)
{series=col[val];}
return series;},getSeriesByKey:function(val)
{var obj=this._seriesDictionary,series;if(obj&&obj.hasOwnProperty(val))
{series=obj[val];}
return series;},addDispatcher:function(val)
{if(!this._dispatchers)
{this._dispatchers=[];}
this._dispatchers.push(val);},_seriesCollection:null,_seriesDictionary:null,_parseSeriesCollection:function(val)
{if(!val)
{return;}
var len=val.length,i=0,series,seriesKey;if(!this.get("seriesCollection"))
{this._seriesCollection=[];}
if(!this._seriesDictionary)
{this._seriesDictionary={};}
if(!this.seriesTypes)
{this.seriesTypes=[];}
for(;i<len;++i)
{series=val[i];if(!(series instanceof Y.CartesianSeries)&&!(series instanceof Y.PieSeries))
{this._createSeries(series);continue;}
this._addSeries(series);}
len=this.get("seriesCollection").length;for(i=0;i<len;++i)
{series=this.get("seriesCollection")[i];seriesKey=series.get("direction")=="horizontal"?"yKey":"xKey";this._seriesDictionary[series.get(seriesKey)]=series;}},_addSeries:function(series)
{var type=series.get("type"),seriesCollection=this.get("seriesCollection"),graphSeriesLength=seriesCollection.length,seriesTypes=this.seriesTypes,typeSeriesCollection;if(!series.get("graph"))
{series.set("graph",this);}
seriesCollection.push(series);if(!seriesTypes.hasOwnProperty(type))
{this.seriesTypes[type]=[];}
typeSeriesCollection=this.seriesTypes[type];series.set("graphOrder",graphSeriesLength);series.set("order",typeSeriesCollection.length);typeSeriesCollection.push(series);this.addDispatcher(series);series.after("drawingComplete",Y.bind(this._drawingCompleteHandler,this));this.fire("seriesAdded",series);},_createSeries:function(seriesData)
{var type=seriesData.type,seriesCollection=this.get("seriesCollection"),seriesTypes=this.seriesTypes,typeSeriesCollection,seriesType,series;seriesData.graph=this;if(!seriesTypes.hasOwnProperty(type))
{seriesTypes[type]=[];}
typeSeriesCollection=seriesTypes[type];seriesData.graph=this;seriesData.order=typeSeriesCollection.length;seriesData.graphOrder=seriesCollection.length;seriesType=this._getSeries(seriesData.type);series=new seriesType(seriesData);this.addDispatcher(series);series.after("drawingComplete",Y.bind(this._drawingCompleteHandler,this));typeSeriesCollection.push(series);seriesCollection.push(series);},_getSeries:function(type)
{var seriesClass;switch(type)
{case"line":seriesClass=Y.LineSeries;break;case"column":seriesClass=Y.ColumnSeries;break;case"bar":seriesClass=Y.BarSeries;break;case"area":seriesClass=Y.AreaSeries;break;case"candlestick":seriesClass=Y.CandlestickSeries;break;case"ohlc":seriesClass=Y.OHLCSeries;break;case"stackedarea":seriesClass=Y.StackedAreaSeries;break;case"stackedline":seriesClass=Y.StackedLineSeries;break;case"stackedcolumn":seriesClass=Y.StackedColumnSeries;break;case"stackedbar":seriesClass=Y.StackedBarSeries;break;case"markerseries":seriesClass=Y.MarkerSeries;break;case"spline":seriesClass=Y.SplineSeries;break;case"areaspline":seriesClass=Y.AreaSplineSeries;break;case"stackedspline":seriesClass=Y.StackedSplineSeries;break;case"stackedareaspline":seriesClass=Y.StackedAreaSplineSeries;break;case"stackedmarkerseries":seriesClass=Y.StackedMarkerSeries;break;case"pie":seriesClass=Y.PieSeries;break;case"combo":seriesClass=Y.ComboSeries;break;case"stackedcombo":seriesClass=Y.StackedComboSeries;break;case"combospline":seriesClass=Y.ComboSplineSeries;break;case"stackedcombospline":seriesClass=Y.StackedComboSplineSeries;break;default:seriesClass=Y.CartesianSeries;break;}
return seriesClass;},_markerEventHandler:function(e)
{var type=e.type,markerNode=e.currentTarget,strArr=markerNode.getAttribute("id").split("_"),series=this.getSeriesByIndex(strArr[1]),index=strArr[2];series.updateMarkerState(type,index);},_dispatchers:null,_updateStyles:function()
{this._background.update(this.get("styles").background);this._sizeChangeHandler();},_sizeChangeHandler:function(e)
{var hgl=this.get("horizontalGridlines"),vgl=this.get("verticalGridlines"),w=this.get("width"),h=this.get("height"),graphicNode,x=0,y=0,bg=this.get("styles").background,weight;if(bg&&bg.border)
{weight=bg.border.weight||0;}
if(this._background)
{graphicNode=Y.one(this._background.parentNode);if(w&&h)
{if(weight)
{w+=weight*2;h+=weight*2;x-=weight;y-=weight;}
graphicNode.setStyle("width",w);graphicNode.setStyle("height",h);graphicNode.setStyle("left",x);graphicNode.setStyle("top",y);this._background.update({width:w,height:h});}}
if(hgl&&hgl instanceof Y.Gridlines)
{hgl.draw();}
if(vgl&&vgl instanceof Y.Gridlines)
{vgl.draw();}
this._drawSeries();},_drawSeries:function()
{if(this._drawing)
{this._callLater=true;return;}
this._callLater=false;this._drawing=true;var sc=this.get("seriesCollection"),i=0,len=sc.length;for(;i<len;++i)
{sc[i].draw();if(!sc[i].get("xcoords")||!sc[i].get("ycoords"))
{this._callLater=true;break;}}
this._drawing=false;if(this._callLater)
{this._drawSeries();}},_drawingCompleteHandler:function(e)
{var series=e.currentTarget,index=Y.Array.indexOf(this._dispatchers,series);if(index>-1)
{this._dispatchers.splice(index,1);}
if(this._dispatchers.length<1)
{this.fire("chartRendered");}},_getDefaultStyles:function()
{var defs={background:{shape:"rect",fill:{color:"#faf9f2"},border:{color:"#dad8c9",weight:1}}};return defs;}},{ATTRS:{seriesCollection:{getter:function()
{return this._seriesCollection;},setter:function(val)
{this._parseSeriesCollection(val);return this._seriesCollection;}},showBackground:{value:true},seriesDictionary:{readOnly:true,getter:function()
{return this._seriesDictionary;}},horizontalGridlines:{value:null,setter:function(val)
{var gl=this.get("horizontalGridlines");if(gl&&gl instanceof Y.Gridlines)
{gl.remove();}
if(val instanceof Y.Gridlines)
{gl=val;val.set("graph",this);val.render();return val;}
else if(val&&val.axis)
{gl=new Y.Gridlines({direction:"horizontal",axis:val.axis,graph:this,styles:val.styles});gl.render();return gl;}}},verticalGridlines:{value:null,setter:function(val)
{var gl=this.get("verticalGridlines");if(gl&&gl instanceof Y.Gridlines)
{gl.remove();}
if(val instanceof Y.Gridlines)
{gl=val;val.set("graph",this);val.render();return val;}
else if(val&&val.axis)
{gl=new Y.Gridlines({direction:"vertical",axis:val.axis,graph:this,styles:val.styles});gl.render();return gl;}}}}});function ChartBase(){}
ChartBase.ATTRS={tooltip:{valueFn:"_getTooltip",setter:function(val)
{return this._updateTooltip(val);}},categoryKey:{value:"category"},categoryType:{value:"category"},interactionType:{value:"marker"},dataProvider:{setter:function(val)
{return this._setDataValues(val);}},seriesKeys:{},axesCollection:{},graph:{valueFn:"_getGraph"}};ChartBase.prototype={_getGraph:function()
{var graph=new Y.Graph();graph.after("chartRendered",Y.bind(function(e){this.fire("chartRendered");},this));return graph;},getSeries:function(val)
{var series=null,graph=this.get("graph");if(graph)
{if(Y.Lang.isNumber(val))
{series=graph.getSeriesByIndex(val);}
else
{series=graph.getSeriesByKey(val);}}
return series;},getAxisByKey:function(val)
{var axis,axes=this.get("axes");if(axes.hasOwnProperty(val))
{axis=axes[val];}
return axis;},getCategoryAxis:function()
{var axis,key=this.get("categoryKey"),axes=this.get("axes");if(axes.hasOwnProperty(key))
{axis=axes[key];}
return axis;},_direction:"horizontal",_dataProvider:null,_setDataValues:function(val)
{if(Y.Lang.isArray(val[0]))
{var hash,dp=[],cats=val[0],i=0,l=cats.length,n,sl=val.length;for(;i<l;++i)
{hash={category:cats[i]};for(n=1;n<sl;++n)
{hash["series"+n]=val[n][i];}
dp[i]=hash;}
return dp;}
return val;},_seriesCollection:null,_setSeriesCollection:function(val)
{this._seriesCollection=val;},_getAxisClass:function(t)
{return this._axisClass[t];},_axisClass:{stacked:Y.StackedAxis,numeric:Y.NumericAxis,category:Y.CategoryAxis,time:Y.TimeAxis},_axes:null,renderUI:function()
{var tt=this.get("tooltip");this.get("boundingBox").setStyle("position","absolute");this.get("contentBox").setStyle("position","absolute");this._addAxes();this._addSeries();if(tt&&tt.show)
{this._addTooltip();}
this._redraw();},bindUI:function()
{this.after("tooltipChange",Y.bind(this._tooltipChangeHandler,this));this.after("widthChange",this._sizeChanged);this.after("heightChange",this._sizeChanged);this.after("dataProviderChange",this._dataProviderChangeHandler);var tt=this.get("tooltip"),hideEvent="mouseout",showEvent="mouseover",cb=this.get("contentBox"),interactionType=this.get("interactionType"),i=0,len;if(interactionType=="marker")
{hideEvent=tt.hideEvent;showEvent=tt.showEvent;Y.delegate("mouseenter",Y.bind(this._markerEventDispatcher,this),cb,".yui3-seriesmarker");Y.delegate("mousedown",Y.bind(this._markerEventDispatcher,this),cb,".yui3-seriesmarker");Y.delegate("mouseup",Y.bind(this._markerEventDispatcher,this),cb,".yui3-seriesmarker");Y.delegate("mouseleave",Y.bind(this._markerEventDispatcher,this),cb,".yui3-seriesmarker");Y.delegate("click",Y.bind(this._markerEventDispatcher,this),cb,".yui3-seriesmarker");Y.delegate("mousemove",Y.bind(this._positionTooltip,this),cb,".yui3-seriesmarker");}
else if(interactionType=="planar")
{this._overlay.on("mousemove",Y.bind(this._planarEventDispatcher,this));this.on("mouseout",this.hideTooltip);}
if(tt)
{if(hideEvent&&showEvent&&hideEvent==showEvent)
{this.on(interactionType+"Event:"+hideEvent,this.toggleTooltip);}
else
{if(showEvent)
{this.on(interactionType+"Event:"+showEvent,tt[interactionType+"EventHandler"]);}
if(hideEvent)
{if(Y.Lang.isArray(hideEvent))
{len=hideEvent.length;for(;i<len;++i)
{this.on(interactionType+"Event:"+hideEvent[i],this.hideTooltip);}}
this.on(interactionType+"Event:"+hideEvent,this.hideTooltip);}}}},_markerEventDispatcher:function(e)
{var type=e.type,cb=this.get("contentBox"),markerNode=e.currentTarget,strArr=markerNode.getAttribute("id").split("_"),seriesIndex=strArr[1],series=this.getSeries(parseInt(seriesIndex,10)),index=strArr[2],items=this.getSeriesItems(series,index),x=e.pageX-cb.getX(),y=e.pageY-cb.getY();if(type=="mouseenter")
{type="mouseover";}
else if(type=="mouseleave")
{type="mouseout";}
series.updateMarkerState(type,index);e.halt();this.fire("markerEvent:"+type,{categoryItem:items.category,valueItem:items.value,node:markerNode,x:x,y:y,series:series,index:index,seriesIndex:seriesIndex});},_dataProviderChangeHandler:function(e)
{var dataProvider=this.get("dataProvider"),axes=this.get("axes"),i,axis;for(i in axes)
{if(axes.hasOwnProperty(i))
{axis=axes[i];if(axis instanceof Y.Axis)
{axis.set("dataProvider",dataProvider);}}}},toggleTooltip:function(e)
{var tt=this.get("tooltip");if(tt.visible)
{this.hideTooltip();}
else
{tt.markerEventHandler.apply(this,[e]);}},_showTooltip:function(msg,x,y)
{var tt=this.get("tooltip"),node=tt.node;if(msg)
{tt.visible=true;node.set("innerHTML",msg);node.setStyle("top",y+"px");node.setStyle("left",x+"px");node.removeClass("yui3-widget-hidden");}},_positionTooltip:function(e)
{var tt=this.get("tooltip"),node=tt.node,cb=this.get("contentBox"),x=(e.pageX+10)-cb.getX(),y=(e.pageY+10)-cb.getY();if(node)
{node.setStyle("left",x+"px");node.setStyle("top",y+"px");}},hideTooltip:function()
{var tt=this.get("tooltip"),node=tt.node;tt.visible=false;node.set("innerHTML","");node.setStyle("left",-10000);node.setStyle("top",-10000);node.addClass("yui3-widget-hidden");},_addTooltip:function()
{var tt=this.get("tooltip");this.get("contentBox").appendChild(tt.node);},_updateTooltip:function(val)
{var tt=this._tooltip,i,styles=val.styles,props={markerLabelFunction:"markerLabelFunction",planarLabelFunction:"planarLabelFunction",showEvent:"showEvent",hideEvent:"hideEvent",markerEventHandler:"markerEventHandler",planarEventHandler:"planarEventHandler"};if(styles)
{for(i in styles)
{if(styles.hasOwnProperty(i))
{tt.node.setStyle(i,styles[i]);}}}
for(i in props)
{if(val.hasOwnProperty(i))
{tt[i]=val[i];}}
return tt;},_getTooltip:function()
{var node=document.createElement("div"),tt={markerLabelFunction:this._tooltipLabelFunction,planarLabelFunction:this._planarLabelFunction,show:true,hideEvent:"mouseout",showEvent:"mouseover",markerEventHandler:function(e)
{var tt=this.get("tooltip"),msg=tt.markerLabelFunction.apply(this,[e.categoryItem,e.valueItem,e.index,e.series,e.seriesIndex]);this._showTooltip(msg,e.x+10,e.y+10);},planarEventHandler:function(e)
{var tt=this.get("tooltip"),msg,categoryAxis=this.get("categoryAxis");msg=tt.planarLabelFunction.apply(this,[categoryAxis,e.valueItem,e.index,e.items,e.seriesIndex]);this._showTooltip(msg,e.x+10,e.y+10);}};node.setAttribute("id",this.get("id")+"_tooltip");node=Y.one(node);node.setStyle("fontSize","85%");node.setStyle("opacity","0.83");node.setStyle("position","absolute");node.setStyle("paddingTop","2px");node.setStyle("paddingRight","5px");node.setStyle("paddingBottom","4px");node.setStyle("paddingLeft","2px");node.setStyle("backgroundColor","#fff");node.setStyle("border","1px solid #dbdccc");node.setStyle("pointerEvents","none");node.setStyle("zIndex",3);node.setStyle("whiteSpace","noWrap");node.addClass("yui3-widget-hidden");tt.node=Y.one(node);this._tooltip=tt;return tt;},_planarLabelFunction:function(categoryAxis,valueItems,index,seriesArray,seriesIndex)
{var msg="",valueItem,i=0,len=seriesArray.length,axis,series;if(categoryAxis)
{msg+=categoryAxis.get("labelFunction").apply(this,[categoryAxis.getKeyValueAt(this.get("categoryKey"),index),categoryAxis.get("labelFormat")]);}
for(;i<len;++i)
{series=seriesArray[i];if(series.get("visible"))
{valueItem=valueItems[i];axis=valueItem.axis;msg+="<br/><span>"+valueItem.displayName+": "+axis.get("labelFunction").apply(this,[axis.getKeyValueAt(valueItem.key,index),axis.get("labelFormat")])+"</span>";}}
return msg;},_tooltipLabelFunction:function(categoryItem,valueItem,itemIndex,series,seriesIndex)
{var msg=categoryItem.displayName+":&nbsp;"+categoryItem.axis.get("labelFunction").apply(this,[categoryItem.value,categoryItem.axis.get("labelFormat")])+"<br/>"+valueItem.displayName+":&nbsp;"+valueItem.axis.get("labelFunction").apply(this,[valueItem.value,valueItem.axis.get("labelFormat")]);return msg;},_tooltipChangeHandler:function(e)
{if(this.get("tooltip"))
{var tt=this.get("tooltip"),node=tt.node,show=tt.show,cb=this.get("contentBox");if(node&&show)
{if(!cb.containes(node))
{this._addTooltip();}}}}};Y.ChartBase=ChartBase;Y.CartesianChart=Y.Base.create("cartesianChart",Y.Widget,[Y.ChartBase],{renderUI:function()
{var tt=this.get("tooltip"),overlay;this.get("boundingBox").setStyle("position","absolute");this.get("contentBox").setStyle("position","absolute");this._addAxes();this._addGridlines();this._addSeries();if(tt&&tt.show)
{this._addTooltip();}
this.get("styles");if(this.get("interactionType")=="planar")
{overlay=document.createElement("div");this.get("contentBox").appendChild(overlay);this._overlay=Y.one(overlay);this._overlay.setStyle("position","absolute");this._overlay.setStyle("background","#fff");this._overlay.setStyle("opacity",0);this._overlay.addClass("yui3-overlay");this._overlay.setStyle("zIndex",4);}
this._redraw();},_planarEventDispatcher:function(e)
{var graph=this.get("graph"),bb=this.get("boundingBox"),cb=graph.get("contentBox"),x=e.pageX,offsetX=x-cb.getX(),posX=x-bb.getX(),y=e.pageY,offsetY=y-cb.getY(),posY=y-bb.getY(),sc=graph.get("seriesCollection"),series,i=0,index,oldIndex=this._selectedIndex,item,items=[],categoryItems=[],valueItems=[],direction=this.get("direction"),hasMarkers,coord=direction=="horizontal"?offsetX:offsetY,markerPlane=direction=="horizontal"?sc[0].get("xMarkerPlane"):sc[0].get("yMarkerPlane"),len=markerPlane.length;for(;i<len;++i)
{if(coord<=markerPlane[i].end&&coord>=markerPlane[i].start)
{index=i;break;}}
len=sc.length;for(i=0;i<len;++i)
{series=sc[i];hasMarkers=series.get("markers");if(hasMarkers&&!isNaN(oldIndex)&&oldIndex>-1)
{series.updateMarkerState("mouseout",oldIndex);}
if(series.get("ycoords")[index]>-1)
{if(hasMarkers&&!isNaN(index)&&index>-1)
{series.updateMarkerState("mouseover",index);}
item=this.getSeriesItems(series,index);categoryItems.push(item.category);valueItems.push(item.value);items.push(series);}}
this._selectedIndex=index;if(index>-1)
{this.fire("planarEvent:mouseover",{categoryItem:categoryItems,valueItem:valueItems,x:posX,y:posY,items:items,index:index});}
else
{this.fire("planarEvent:mouseout");}},_type:"combo",_axesRenderQueue:null,_addToAxesRenderQueue:function(axis)
{if(!this._axesRenderQueue)
{this._axesRenderQueue=[];}
if(Y.Array.indexOf(this._axesRenderQueue,axis)<0)
{this._axesRenderQueue.push(axis);}},_getDefaultSeriesCollection:function(val)
{var dir=this.get("direction"),sc=val||[],catAxis,valAxis,tempKeys=[],series,seriesKeys=this.get("seriesKeys").concat(),i,index,l,type=this.get("type"),key,catKey,seriesKey,graph,categoryKey=this.get("categoryKey"),showMarkers=this.get("showMarkers"),showAreaFill=this.get("showAreaFill"),showLines=this.get("showLines");if(dir=="vertical")
{catAxis="yAxis";catKey="yKey";valAxis="xAxis";seriesKey="xKey";}
else
{catAxis="xAxis";catKey="xKey";valAxis="yAxis";seriesKey="yKey";}
l=sc.length;for(i=0;i<l;++i)
{key=this._getBaseAttribute(sc[i],seriesKey);if(key)
{index=Y.Array.indexOf(seriesKeys,key);if(index>-1)
{seriesKeys.splice(index,1);}
tempKeys.push(key);}}
if(seriesKeys.length>0)
{tempKeys=tempKeys.concat(seriesKeys);}
l=tempKeys.length;for(i=0;i<l;++i)
{series=sc[i]||{type:type};if(series instanceof Y.CartesianSeries)
{this._parseSeriesAxes(series);continue;}
series[catKey]=series[catKey]||categoryKey;series[seriesKey]=series[seriesKey]||seriesKeys.shift();series[catAxis]=this._getCategoryAxis();series[valAxis]=this._getSeriesAxis(series[seriesKey]);series.type=series.type||type;if((series.type=="combo"||series.type=="stackedcombo"||series.type=="combospline"||series.type=="stackedcombospline"))
{if(showAreaFill!==null)
{series.showAreaFill=series.showAreaFill||showAreaFill;}
if(showMarkers!==null)
{series.showMarkers=series.showMarkers||showMarkers;}
if(showLines!==null)
{series.showLines=series.showLines||showLines;}}
sc[i]=series;}
if(val)
{graph=this.get("graph");graph.set("seriesCollection",sc);sc=graph.get("seriesCollection");}
return sc;},_parseSeriesAxes:function(series)
{var axes=this.get("axes"),xAxis=series.get("xAxis"),yAxis=series.get("yAxis"),YAxis=Y.Axis,axis;if(xAxis&&!(xAxis instanceof YAxis)&&Y.Lang.isString(xAxis)&&axes.hasOwnProperty(xAxis))
{axis=axes[xAxis];if(axis instanceof YAxis)
{series.set("xAxis",axis);}}
if(yAxis&&!(yAxis instanceof YAxis)&&Y.Lang.isString(yAxis)&&axes.hasOwnProperty(yAxis))
{axis=axes[yAxis];if(axis instanceof YAxis)
{series.set("yAxis",axis);}}},_getCategoryAxis:function()
{var axis,axes=this.get("axes"),categoryAxisName=this.get("categoryAxisName")||this.get("categoryKey");axis=axes[categoryAxisName];return axis;},_getSeriesAxis:function(key,axisName)
{var axes=this.get("axes"),i,keys,axis;if(axes)
{if(axisName&&axes.hasOwnProperty(axisName))
{axis=axes[axisName];}
else
{for(i in axes)
{if(axes.hasOwnProperty(i))
{keys=axes[i].get("keys");if(keys&&keys.hasOwnProperty(key))
{axis=axes[i];break;}}}}}
return axis;},_getBaseAttribute:function(item,key)
{if(item instanceof Y.Base)
{return item.get(key);}
if(item.hasOwnProperty(key))
{return item[key];}
return null;},_setBaseAttribute:function(item,key,value)
{if(item instanceof Y.Base)
{item.set(key,value);}
else
{item[key]=value;}},_parseAxes:function(val)
{var hash=this._getDefaultAxes(val),axes={},axesAttrs={edgeOffset:"edgeOffset",position:"position",overlapGraph:"overlapGraph",labelFunction:"labelFunction",labelFunctionScope:"labelFunctionScope",labelFormat:"labelFormat",maximum:"maximum",minimum:"minimum",roundingMethod:"roundingMethod",alwaysShowZero:"alwaysShowZero"},dp=this.get("dataProvider"),ai,i,pos,axis,dh,axisClass,config,axesCollection;for(i in hash)
{if(hash.hasOwnProperty(i))
{dh=hash[i];if(dh instanceof Y.Axis)
{axis=dh;}
else
{axisClass=this._getAxisClass(dh.type);config={};config.dataProvider=dh.dataProvider||dp;config.keys=dh.keys;if(dh.hasOwnProperty("roundingUnit"))
{config.roundingUnit=dh.roundingUnit;}
pos=dh.position;if(dh.styles)
{config.styles=dh.styles;}
config.position=dh.position;for(ai in axesAttrs)
{if(axesAttrs.hasOwnProperty(ai)&&dh.hasOwnProperty(ai))
{config[ai]=dh[ai];}}
axis=new axisClass(config);}
if(axis)
{axesCollection=this.get(pos+"AxesCollection");if(axesCollection&&Y.Array.indexOf(axesCollection,axis)>0)
{axis.set("overlapGraph",false);}
axis.after("axisRendered",Y.bind(this._axisRendered,this));axes[i]=axis;}}}
return axes;},_addAxes:function()
{var axes=this.get("axes"),i,axis,pos,w=this.get("width"),h=this.get("height"),node=Y.Node.one(this._parentNode);if(!this._axesCollection)
{this._axesCollection=[];}
for(i in axes)
{if(axes.hasOwnProperty(i))
{axis=axes[i];if(axis instanceof Y.Axis)
{if(!w)
{this.set("width",node.get("offsetWidth"));w=this.get("width");}
if(!h)
{this.set("height",node.get("offsetHeight"));h=this.get("height");}
axis.set("width",w);axis.set("height",h);this._addToAxesRenderQueue(axis);pos=axis.get("position");if(!this.get(pos+"AxesCollection"))
{this.set(pos+"AxesCollection",[axis]);}
else
{this.get(pos+"AxesCollection").push(axis);}
this._axesCollection.push(axis);if(axis.get("keys").hasOwnProperty(this.get("categoryKey")))
{this.set("categoryAxis",axis);}
axis.render(this.get("contentBox"));}}}},_addSeries:function()
{var graph=this.get("graph"),sc=this.get("seriesCollection");graph.render(this.get("contentBox"));},_addGridlines:function()
{var graph=this.get("graph"),hgl=this.get("horizontalGridlines"),vgl=this.get("verticalGridlines"),direction=this.get("direction"),leftAxesCollection=this.get("leftAxesCollection"),rightAxesCollection=this.get("rightAxesCollection"),bottomAxesCollection=this.get("bottomAxesCollection"),topAxesCollection=this.get("topAxesCollection"),seriesAxesCollection,catAxis=this.get("categoryAxis"),hAxis,vAxis;if(this._axesCollection)
{seriesAxesCollection=this._axesCollection.concat();seriesAxesCollection.splice(Y.Array.indexOf(seriesAxesCollection,catAxis),1);}
if(hgl)
{if(leftAxesCollection&&leftAxesCollection[0])
{hAxis=leftAxesCollection[0];}
else if(rightAxesCollection&&rightAxesCollection[0])
{hAxis=rightAxesCollection[0];}
else
{hAxis=direction=="horizontal"?catAxis:seriesAxesCollection[0];}
if(!this._getBaseAttribute(hgl,"axis")&&hAxis)
{this._setBaseAttribute(hgl,"axis",hAxis);}
if(this._getBaseAttribute(hgl,"axis"))
{graph.set("horizontalGridlines",hgl);}}
if(vgl)
{if(bottomAxesCollection&&bottomAxesCollection[0])
{vAxis=bottomAxesCollection[0];}
else if(topAxesCollection&&topAxesCollection[0])
{vAxis=topAxesCollection[0];}
else
{vAxis=direction=="vertical"?catAxis:seriesAxesCollection[0];}
if(!this._getBaseAttribute(vgl,"axis")&&vAxis)
{this._setBaseAttribute(vgl,"axis",vAxis);}
if(this._getBaseAttribute(vgl,"axis"))
{graph.set("verticalGridlines",vgl);}}},_getDefaultAxes:function(axes)
{var catKey=this.get("categoryKey"),axis,attr,keys,newAxes={},claimedKeys=[],categoryAxisName=this.get("categoryAxisName")||this.get("categoryKey"),valueAxisName=this.get("valueAxisName"),seriesKeys=this.get("seriesKeys")||[],i,l,ii,ll,cIndex,dv,dp=this.get("dataProvider"),direction=this.get("direction"),seriesPosition,categoryPosition,valueAxes=[],seriesAxis=this.get("stacked")?"stacked":"numeric";dv=dp[0];if(direction=="vertical")
{seriesPosition="bottom";categoryPosition="left";}
else
{seriesPosition="left";categoryPosition="bottom";}
if(axes)
{for(i in axes)
{if(axes.hasOwnProperty(i))
{axis=axes[i];keys=this._getBaseAttribute(axis,"keys");attr=this._getBaseAttribute(axis,"type");if(attr=="time"||attr=="category")
{categoryAxisName=i;this.set("categoryAxisName",i);if(Y.Lang.isArray(keys)&&keys.length>0)
{catKey=keys[0];this.set("categoryKey",catKey);}
newAxes[i]=axis;}
else if(i==categoryAxisName)
{newAxes[i]=axis;}
else
{newAxes[i]=axis;if(i!=valueAxisName&&keys&&Y.Lang.isArray(keys))
{ll=keys.length;for(ii=0;ii<ll;++ii)
{claimedKeys.push(keys[ii]);}
valueAxes.push(newAxes[i]);}
if(!(this._getBaseAttribute(newAxes[i],"type")))
{this._setBaseAttribute(newAxes[i],"type",seriesAxis);}
if(!(this._getBaseAttribute(newAxes[i],"position")))
{this._setBaseAttribute(newAxes[i],"position",this._getDefaultAxisPosition(newAxes[i],valueAxes,seriesPosition));}}}}}
if(seriesKeys.length<1)
{for(i in dv)
{if(dv.hasOwnProperty(i)&&i!=catKey&&Y.Array.indexOf(claimedKeys,i)==-1)
{seriesKeys.push(i);}}}
cIndex=Y.Array.indexOf(seriesKeys,catKey);if(cIndex>-1)
{seriesKeys.splice(cIndex,1);}
l=claimedKeys.length;for(i=0;i<l;++i)
{cIndex=Y.Array.indexOf(seriesKeys,claimedKeys[i]);if(cIndex>-1)
{seriesKeys.splice(cIndex,1);}}
if(!newAxes.hasOwnProperty(categoryAxisName))
{newAxes[categoryAxisName]={};}
if(!(this._getBaseAttribute(newAxes[categoryAxisName],"keys")))
{this._setBaseAttribute(newAxes[categoryAxisName],"keys",[catKey]);}
if(!(this._getBaseAttribute(newAxes[categoryAxisName],"position")))
{this._setBaseAttribute(newAxes[categoryAxisName],"position",categoryPosition);}
if(!(this._getBaseAttribute(newAxes[categoryAxisName],"type")))
{this._setBaseAttribute(newAxes[categoryAxisName],"type",this.get("categoryType"));}
if(!newAxes.hasOwnProperty(valueAxisName)&&seriesKeys&&seriesKeys.length>0)
{newAxes[valueAxisName]={keys:seriesKeys};valueAxes.push(newAxes[valueAxisName]);}
if(claimedKeys.length>0)
{if(seriesKeys.length>0)
{seriesKeys=claimedKeys.concat(seriesKeys);}
else
{seriesKeys=claimedKeys;}}
if(newAxes.hasOwnProperty(valueAxisName))
{if(!(this._getBaseAttribute(newAxes[valueAxisName],"position")))
{this._setBaseAttribute(newAxes[valueAxisName],"position",this._getDefaultAxisPosition(newAxes[valueAxisName],valueAxes,seriesPosition));}
if(!(this._getBaseAttribute(newAxes[valueAxisName],"type")))
{this._setBaseAttribute(newAxes[valueAxisName],"type",seriesAxis);}
if(!(this._getBaseAttribute(newAxes[valueAxisName],"keys")))
{this._setBaseAttribute(newAxes[valueAxisName],"keys",seriesKeys);}}
this.set("seriesKeys",seriesKeys);return newAxes;},_getDefaultAxisPosition:function(axis,valueAxes,position)
{var direction=this.get("direction"),i=Y.Array.indexOf(valueAxes,axis);if(valueAxes[i-1]&&valueAxes[i-1].position)
{if(direction=="horizontal")
{if(valueAxes[i-1].position=="left")
{position="right";}
else if(valueAxes[i-1].position=="right")
{position="left";}}
else
{if(valueAxes[i-1].position=="bottom")
{position="top";}
else
{position="bottom";}}}
return position;},getSeriesItems:function(series,index)
{var xAxis=series.get("xAxis"),yAxis=series.get("yAxis"),xKey=series.get("xKey"),yKey=series.get("yKey"),categoryItem,valueItem;if(this.get("direction")=="vertical")
{categoryItem={axis:yAxis,key:yKey,value:yAxis.getKeyValueAt(yKey,index)};valueItem={axis:xAxis,key:xKey,value:xAxis.getKeyValueAt(xKey,index)};}
else
{valueItem={axis:yAxis,key:yKey,value:yAxis.getKeyValueAt(yKey,index)};categoryItem={axis:xAxis,key:xKey,value:xAxis.getKeyValueAt(xKey,index)};}
categoryItem.displayName=series.get("categoryDisplayName");valueItem.displayName=series.get("valueDisplayName");categoryItem.value=categoryItem.axis.getKeyValueAt(categoryItem.key,index);valueItem.value=valueItem.axis.getKeyValueAt(valueItem.key,index);return{category:categoryItem,value:valueItem};},_axisRendered:function(e)
{this._axesRenderQueue=this._axesRenderQueue.splice(1+Y.Array.indexOf(this._axesRenderQueue,e.currentTarget),1);if(this._axesRenderQueue.length<1)
{this._redraw();}},_sizeChanged:function(e)
{if(this._axesCollection)
{var ac=this._axesCollection,i=0,l=ac.length;for(;i<l;++i)
{this._addToAxesRenderQueue(ac[i]);}
this._redraw();}},_redraw:function()
{if(this._drawing)
{this._callLater=true;return;}
this._drawing=true;this._callLater=false;var w=this.get("width"),h=this.get("height"),lw=0,rw=0,th=0,bh=0,lc=this.get("leftAxesCollection"),rc=this.get("rightAxesCollection"),tc=this.get("topAxesCollection"),bc=this.get("bottomAxesCollection"),i=0,l,axis,pos,pts=[],graphOverflow="visible",graph=this.get("graph");if(lc)
{l=lc.length;for(i=l-1;i>-1;--i)
{pts[Y.Array.indexOf(this._axesCollection,lc[i])]={x:lw+"px"};lw+=lc[i].get("width");}}
if(rc)
{l=rc.length;i=0;for(i=l-1;i>-1;--i)
{rw+=rc[i].get("width");pts[Y.Array.indexOf(this._axesCollection,rc[i])]={x:(w-rw)+"px"};}}
if(tc)
{l=tc.length;for(i=l-1;i>-1;--i)
{pts[Y.Array.indexOf(this._axesCollection,tc[i])]={y:th+"px"};th+=tc[i].get("height");}}
if(bc)
{l=bc.length;for(i=l-1;i>-1;--i)
{bh+=bc[i].get("height");pts[Y.Array.indexOf(this._axesCollection,bc[i])]={y:(h-bh)+"px"};}}
l=this._axesCollection.length;i=0;for(;i<l;++i)
{axis=this._axesCollection[i];pos=axis.get("position");if(pos=="left"||pos==="right")
{axis.get("boundingBox").setStyle("top",th+"px");axis.get("boundingBox").setStyle("left",pts[i].x);if(axis.get("height")!==h-(bh+th))
{axis.set("height",h-(bh+th));}}
else if(pos=="bottom"||pos=="top")
{if(axis.get("width")!==w-(lw+rw))
{axis.set("width",w-(lw+rw));}
axis.get("boundingBox").setStyle("left",lw+"px");axis.get("boundingBox").setStyle("top",pts[i].y);}
if(axis.get("setMax")||axis.get("setMin"))
{graphOverflow="hidden";}}
this._drawing=false;if(this._callLater)
{this._redraw();return;}
if(graph)
{graph.get("boundingBox").setStyle("left",lw+"px");graph.get("boundingBox").setStyle("top",th+"px");graph.set("width",w-(lw+rw));graph.set("height",h-(th+bh));graph.get("boundingBox").setStyle("overflow",graphOverflow);}
if(this._overlay)
{this._overlay.setStyle("left",lw+"px");this._overlay.setStyle("top",th+"px");this._overlay.setStyle("width",(w-(lw+rw))+"px");this._overlay.setStyle("height",(h-(th+bh))+"px");}}},{ATTRS:{axesStyles:{getter:function()
{var axes=this.get("axes"),i,styles=this._axesStyles;if(axes)
{for(i in axes)
{if(axes.hasOwnProperty(i)&&axes[i]instanceof Y.Axis)
{if(!styles)
{styles={};}
styles[i]=axes[i].get("styles");}}}
return styles;},setter:function(val)
{var axes=this.get("axes"),i;for(i in val)
{if(val.hasOwnProperty(i)&&axes.hasOwnProperty(i))
{this._setBaseAttribute(axes[i],"styles",val[i]);}}}},seriesStyles:{getter:function()
{var styles=this._seriesStyles,graph=this.get("graph"),dict,i;if(graph)
{dict=graph.get("seriesDictionary");if(dict)
{styles={};for(i in dict)
{if(dict.hasOwnProperty(i))
{styles[i]=dict[i].get("styles");}}}}
return styles;},setter:function(val)
{var i,l,s;if(Y.Lang.isArray(val))
{s=this.get("seriesCollection");i=0;l=val.length;for(;i<l;++i)
{this._setBaseAttribute(s[i],"styles",val[i]);}}
else
{for(i in val)
{if(val.hasOwnProperty(i))
{s=this.getSeries(i);this._setBaseAttribute(s,"styles",val[i]);}}}}},graphStyles:{getter:function()
{var graph=this.get("graph");if(graph)
{return(graph.get("styles"));}
return this._graphStyles;},setter:function(val)
{var graph=this.get("graph");this._setBaseAttribute(graph,"styles",val);}},styles:{getter:function()
{var styles={axes:this.get("axesStyles"),series:this.get("seriesStyles"),graph:this.get("graphStyles")};return styles;},setter:function(val)
{if(val.hasOwnProperty("axes"))
{if(this.get("axesStyles"))
{this.set("axesStyles",val.axes);}
else
{this._axesStyles=val.axes;}}
if(val.hasOwnProperty("series"))
{if(this.get("seriesStyles"))
{this.set("seriesStyles",val.series);}
else
{this._seriesStyles=val.series;}}
if(val.hasOwnProperty("graph"))
{this.set("graphStyles",val.graph);}}},axes:{valueFn:"_parseAxes",setter:function(val)
{return this._parseAxes(val);}},seriesCollection:{valueFn:"_getDefaultSeriesCollection",setter:function(val)
{return this._getDefaultSeriesCollection(val);}},leftAxesCollection:{},bottomAxesCollection:{},rightAxesCollection:{},topAxesCollection:{},stacked:{value:false},direction:{getter:function()
{var type=this.get("type");if(type=="bar")
{return"vertical";}
else if(type=="column")
{return"horizontal";}
return this._direction;},setter:function(val)
{this._direction=val;return this._direction;}},showAreaFill:{},showMarkers:{},showLines:{},categoryAxisName:{},valueAxisName:{value:"values"},horizontalGridlines:{getter:function()
{var graph=this.get("graph");if(graph)
{return graph.get("horizontalGridlines");}
return this._horizontalGridlines;},setter:function(val)
{var graph=this.get("graph");if(val&&!Y.Lang.isObject(val))
{val={};}
if(graph)
{graph.set("horizontalGridlines",val);}
else
{this._horizontalGridlines=val;}}},verticalGridlines:{getter:function()
{var graph=this.get("graph");if(graph)
{return graph.get("verticalGridlines");}
return this._verticalGridlines;},setter:function(val)
{var graph=this.get("graph");if(val&&!Y.Lang.isObject(val))
{val={};}
if(graph)
{graph.set("verticalGridlines",val);}
else
{this._verticalGridlines=val;}}},type:{getter:function()
{if(this.get("stacked"))
{return"stacked"+this._type;}
return this._type;},setter:function(val)
{if(this._type=="bar")
{if(val!="bar")
{this.set("direction","horizontal");}}
else
{if(val=="bar")
{this.set("direction","vertical");}}
this._type=val;return this._type;}},categoryAxis:{}}});Y.PieChart=Y.Base.create("pieChart",Y.Widget,[Y.ChartBase],{_getSeriesCollection:function()
{if(this._seriesCollection)
{return this._seriesCollection;}
var axes=this.get("axes"),sc=[],seriesKeys,i=0,l,type=this.get("type"),key,catAxis="categoryAxis",catKey="categoryKey",valAxis="valueAxis",seriesKey="valueKey";if(axes)
{seriesKeys=axes.values.get("keyCollection");key=axes.category.get("keyCollection")[0];l=seriesKeys.length;for(;i<l;++i)
{sc[i]={type:type};sc[i][catAxis]="category";sc[i][valAxis]="values";sc[i][catKey]=key;sc[i][seriesKey]=seriesKeys[i];}}
this._seriesCollection=sc;return sc;},_parseAxes:function(hash)
{if(!this._axes)
{this._axes={};}
var i,pos,axis,dh,config,axisClass,type=this.get("type"),w=this.get("width"),h=this.get("height"),node=Y.Node.one(this._parentNode);if(!w)
{this.set("width",node.get("offsetWidth"));w=this.get("width");}
if(!h)
{this.set("height",node.get("offsetHeight"));h=this.get("height");}
for(i in hash)
{if(hash.hasOwnProperty(i))
{dh=hash[i];pos=type=="pie"?"none":dh.position;axisClass=this._getAxisClass(dh.type);config={dataProvider:this.get("dataProvider")};if(dh.hasOwnProperty("roundingUnit"))
{config.roundingUnit=dh.roundingUnit;}
config.keys=dh.keys;config.width=w;config.height=h;config.position=pos;config.styles=dh.styles;axis=new axisClass(config);axis.on("axisRendered",Y.bind(this._axisRendered,this));this._axes[i]=axis;}}},_addAxes:function()
{var axes=this.get("axes"),i,axis,p;if(!axes)
{this.set("axes",this._getDefaultAxes());axes=this.get("axes");}
if(!this._axesCollection)
{this._axesCollection=[];}
for(i in axes)
{if(axes.hasOwnProperty(i))
{axis=axes[i];p=axis.get("position");if(!this.get(p+"AxesCollection"))
{this.set(p+"AxesCollection",[axis]);}
else
{this.get(p+"AxesCollection").push(axis);}
this._axesCollection.push(axis);}}},_addSeries:function()
{var graph=this.get("graph"),seriesCollection=this.get("seriesCollection");this._parseSeriesAxes(seriesCollection);graph.set("showBackground",false);graph.set("width",this.get("width"));graph.set("height",this.get("height"));graph.set("seriesCollection",seriesCollection);this._seriesCollection=graph.get("seriesCollection");graph.render(this.get("contentBox"));},_parseSeriesAxes:function(c)
{var i=0,len=c.length,s,axes=this.get("axes"),axis;for(;i<len;++i)
{s=c[i];if(s)
{if(s instanceof Y.PieSeries)
{axis=s.get("categoryAxis");if(axis&&!(axis instanceof Y.Axis))
{s.set("categoryAxis",axes[axis]);}
axis=s.get("valueAxis");if(axis&&!(axis instanceof Y.Axis))
{s.set("valueAxis",axes[axis]);}
continue;}
s.categoryAxis=axes.category;s.valueAxis=axes.values;if(!s.type)
{s.type=this.get("type");}}}},_getDefaultAxes:function()
{var catKey=this.get("categoryKey"),seriesKeys=this.get("seriesKeys")||[],seriesAxis="numeric",i,dv=this.get("dataProvider")[0];if(seriesKeys.length<1)
{for(i in dv)
{if(i!=catKey)
{seriesKeys.push(i);}}
if(seriesKeys.length>0)
{this.set("seriesKeys",seriesKeys);}}
return{values:{keys:seriesKeys,type:seriesAxis},category:{keys:[catKey],type:this.get("categoryType")}};},getSeriesItems:function(series,index)
{var categoryItem={axis:series.get("categoryAxis"),key:series.get("categoryKey"),displayName:series.get("categoryDisplayName")},valueItem={axis:series.get("valueAxis"),key:series.get("valueKey"),displayName:series.get("valueDisplayName")};categoryItem.value=categoryItem.axis.getKeyValueAt(categoryItem.key,index);valueItem.value=valueItem.axis.getKeyValueAt(valueItem.key,index);return{category:categoryItem,value:valueItem};},_sizeChanged:function(e)
{this._redraw();},_redraw:function()
{var graph=this.get("graph");if(graph)
{graph.set("width",this.get("width"));graph.set("height",this.get("height"));}}},{ATTRS:{axes:{getter:function()
{return this._axes;},setter:function(val)
{this._parseAxes(val);}},seriesCollection:{getter:function()
{return this._getSeriesCollection();},setter:function(val)
{return this._setSeriesCollection(val);}},type:{value:"pie"}}});function Chart(cfg)
{if(cfg.type!="pie")
{return new Y.CartesianChart(cfg);}
else
{return new Y.PieChart(cfg);}}
Y.Chart=Chart;},'3.3.0',{requires:['dom','datatype','event-custom','event-mouseenter','widget','widget-position','widget-stack']});