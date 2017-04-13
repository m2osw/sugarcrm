/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('history-hash-ie',function(Y){if(Y.UA.ie&&!Y.HistoryBase.nativeHashChange){var Do=Y.Do,GlobalEnv=YUI.namespace('Env.HistoryHash'),HistoryHash=Y.HistoryHash,iframe=GlobalEnv._iframe,win=Y.config.win,location=win.location,lastUrlHash='';HistoryHash.getIframeHash=function(){if(!iframe||!iframe.contentWindow){return'';}
var prefix=HistoryHash.hashPrefix,hash=iframe.contentWindow.location.hash.substr(1);return prefix&&hash.indexOf(prefix)===0?hash.replace(prefix,''):hash;};HistoryHash._updateIframe=function(hash,replace){var iframeDoc=iframe&&iframe.contentWindow&&iframe.contentWindow.document,iframeLocation=iframeDoc&&iframeDoc.location;if(!iframeDoc||!iframeLocation){return;}
iframeDoc.open().close();if(replace){iframeLocation.replace(hash.charAt(0)==='#'?hash:'#'+hash);}else{iframeLocation.hash=hash;}};Do.after(HistoryHash._updateIframe,HistoryHash,'replaceHash',HistoryHash,true);if(!iframe){Y.on('domready',function(){iframe=GlobalEnv._iframe=Y.Node.getDOMNode(Y.Node.create('<iframe src="javascript:0" style="display:none" height="0" width="0" tabindex="-1" title="empty"/>'));Y.config.doc.documentElement.appendChild(iframe);HistoryHash._updateIframe(HistoryHash.getHash()||'#');Y.on('hashchange',function(e){lastUrlHash=e.newHash;if(HistoryHash.getIframeHash()!==lastUrlHash){HistoryHash._updateIframe(lastUrlHash);}},win);Y.later(50,null,function(){var iframeHash=HistoryHash.getIframeHash();if(iframeHash!==lastUrlHash){HistoryHash.setHash(iframeHash);}},null,true);});}}},'3.3.0',{requires:['history-hash','node-base']});