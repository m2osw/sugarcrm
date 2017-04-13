/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('text-wordbreak',function(Y){var Text=Y.Text,WBData=Text.Data.WordBreak,ALETTER=0,MIDNUMLET=1,MIDLETTER=2,MIDNUM=3,NUMERIC=4,CR=5,LF=6,NEWLINE=7,EXTEND=8,FORMAT=9,KATAKANA=10,EXTENDNUMLET=11,OTHER=12,SETS=[new RegExp(WBData.aletter),new RegExp(WBData.midnumlet),new RegExp(WBData.midletter),new RegExp(WBData.midnum),new RegExp(WBData.numeric),new RegExp(WBData.cr),new RegExp(WBData.lf),new RegExp(WBData.newline),new RegExp(WBData.extend),new RegExp(WBData.format),new RegExp(WBData.katakana),new RegExp(WBData.extendnumlet)],EMPTY_STRING='',PUNCTUATION=new RegExp('^'+WBData.punctuation+'$'),WHITESPACE=/\s/,WordBreak={getWords:function(string,options){var i=0,map=WordBreak._classify(string),len=map.length,word=[],words=[],chr,includePunctuation,includeWhitespace;if(!options){options={};}
if(options.ignoreCase){string=string.toLowerCase();}
includePunctuation=options.includePunctuation;includeWhitespace=options.includeWhitespace;for(;i<len;++i){chr=string.charAt(i);word.push(chr);if(WordBreak._isWordBoundary(map,i)){word=word.join(EMPTY_STRING);if(word&&(includeWhitespace||!WHITESPACE.test(word))&&(includePunctuation||!PUNCTUATION.test(word))){words.push(word);}
word=[];}}
return words;},getUniqueWords:function(string,options){return Y.Array.unique(WordBreak.getWords(string,options));},isWordBoundary:function(string,index){return WordBreak._isWordBoundary(WordBreak._classify(string),index);},_classify:function(string){var chr,map=[],i=0,j,set,stringLength=string.length,setsLength=SETS.length,type;for(;i<stringLength;++i){chr=string.charAt(i);type=OTHER;for(j=0;j<setsLength;++j){set=SETS[j];if(set&&set.test(chr)){type=j;break;}}
map.push(type);}
return map;},_isWordBoundary:function(map,index){var prevType,type=map[index],nextType=map[index+1],nextNextType;if(index<0||(index>map.length-1&&index!==0)){return false;}
if(type===ALETTER&&nextType===ALETTER){return false;}
nextNextType=map[index+2];if(type===ALETTER&&(nextType===MIDLETTER||nextType===MIDNUMLET)&&nextNextType===ALETTER){return false;}
prevType=map[index-1];if((type===MIDLETTER||type===MIDNUMLET)&&nextType===ALETTER&&prevType===ALETTER){return false;}
if((type===NUMERIC||type===ALETTER)&&(nextType===NUMERIC||nextType===ALETTER)){return false;}
if((type===MIDNUM||type===MIDNUMLET)&&nextType===NUMERIC&&prevType===NUMERIC){return false;}
if(type===NUMERIC&&(nextType===MIDNUM||nextType===MIDNUMLET)&&nextNextType===NUMERIC){return false;}
if(type===EXTEND||type===FORMAT||prevType===EXTEND||prevType===FORMAT||nextType===EXTEND||nextType===FORMAT){return false;}
if(type===CR&&nextType===LF){return false;}
if(type===NEWLINE||type===CR||type===LF){return true;}
if(nextType===NEWLINE||nextType===CR||nextType===LF){return true;}
if(type===KATAKANA&&nextType===KATAKANA){return false;}
if(nextType===EXTENDNUMLET&&(type===ALETTER||type===NUMERIC||type===KATAKANA||type===EXTENDNUMLET)){return false;}
if(type===EXTENDNUMLET&&(nextType===ALETTER||nextType===NUMERIC||nextType===KATAKANA)){return false;}
return true;}};Text.WordBreak=WordBreak;},'3.3.0',{requires:['array-extras','text-data-wordbreak']});