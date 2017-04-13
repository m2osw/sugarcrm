/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('features',function(Y){var feature_tests={};Y.mix(Y.namespace('Features'),{tests:feature_tests,add:function(cat,name,o){feature_tests[cat]=feature_tests[cat]||{};feature_tests[cat][name]=o;},all:function(cat,args){var cat_o=feature_tests[cat],result='';if(cat_o){Y.Object.each(cat_o,function(v,k){result+=k+':'+
(Y.Features.test(cat,k,args)?1:0)+';';});}
return result;},test:function(cat,name,args){args=args||[];var result,ua,test,cat_o=feature_tests[cat],feature=cat_o&&cat_o[name];if(!feature){}else{result=feature.result;if(Y.Lang.isUndefined(result)){ua=feature.ua;if(ua){result=(Y.UA[ua]);}
test=feature.test;if(test&&((!ua)||result)){result=test.apply(Y,args);}
feature.result=result;}}
return result;}});var add=Y.Features.add;add('load','0',{"test":function(Y){return!(Y.UA.ios||Y.UA.android);},"trigger":"autocomplete-list"});add('load','1',{"test":function(Y){var testFeature=Y.Features.test,addFeature=Y.Features.add,WINDOW=Y.config.win,DOCUMENT=Y.config.doc,DOCUMENT_ELEMENT='documentElement',ret=false;addFeature('style','computedStyle',{test:function(){return WINDOW&&'getComputedStyle'in WINDOW;}});addFeature('style','opacity',{test:function(){return DOCUMENT&&'opacity'in DOCUMENT[DOCUMENT_ELEMENT].style;}});ret=(!testFeature('style','opacity')&&!testFeature('style','computedStyle'));return ret;},"trigger":"dom-style"});add('load','2',{"trigger":"widget-base","ua":"ie"});add('load','3',{"test":function(Y){var imp=Y.config.doc&&Y.config.doc.implementation;return(imp&&(!imp.hasFeature('Events','2.0')));},"trigger":"node-base"});add('load','4',{"test":function(Y){return(Y.config.win&&('ontouchstart'in Y.config.win&&!Y.UA.chrome));},"trigger":"dd-drag"});add('load','5',{"test":function(Y){var docMode=Y.config.doc.documentMode;return Y.UA.ie&&(!('onhashchange'in Y.config.win)||!docMode||docMode<8);},"trigger":"history-hash"});},'3.3.0',{requires:['yui-base']});