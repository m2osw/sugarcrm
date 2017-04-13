/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('dataschema-text',function(Y){var LANG=Y.Lang,SchemaText={apply:function(schema,data){var data_in=data,data_out={results:[],meta:{}};if(LANG.isString(data_in)&&LANG.isString(schema.resultDelimiter)){data_out=SchemaText._parseResults.call(this,schema,data_in,data_out);}
else{data_out.error=new Error("Text schema parse failure");}
return data_out;},_parseResults:function(schema,text_in,data_out){var resultDelim=schema.resultDelimiter,results=[],results_in,fields_in,result,item,fields,field,key,value,i,j,tmpLength=text_in.length-resultDelim.length;if(text_in.substr(tmpLength)==resultDelim){text_in=text_in.substr(0,tmpLength);}
results_in=text_in.split(schema.resultDelimiter);for(i=results_in.length-1;i>-1;i--){result={};item=results_in[i];if(LANG.isString(schema.fieldDelimiter)){fields_in=item.split(schema.fieldDelimiter);if(LANG.isArray(schema.resultFields)){fields=schema.resultFields;for(j=fields.length-1;j>-1;j--){field=fields[j];key=(!LANG.isUndefined(field.key))?field.key:field;value=(!LANG.isUndefined(fields_in[key]))?fields_in[key]:fields_in[j];result[key]=Y.DataSchema.Base.parse.call(this,value,field);}}}
else{result=item;}
results[i]=result;}
data_out.results=results;return data_out;}};Y.DataSchema.Text=Y.mix(SchemaText,Y.DataSchema.Base);},'3.3.0',{requires:['dataschema-base']});