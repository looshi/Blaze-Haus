/*
TextEditor
editable text field
wraps an instance of CodeMirror
*/


/**
* constructor
* @param {Object} _textArea, DOM id for the TextArea to apply this editor, e.g. "myTextArea"
* @param {String} _type , only "css" , "html" are supported now
*/

TextEditor = function(_textArea,_type) {

  if(_type!=="css"&&_type!=="html"){
    error("error unsupported type : " + _type);
  }

  if(!Utils.isPosString(_textArea)){
    error("selector required : "+_textArea);
  }

  var textArea = document.getElementsByClassName(_textArea)[0];
  if(!textArea){
    error('element '+_textArea+' not found');
  }

  this.editor = CodeMirror.fromTextArea(textArea);

}


TextEditor.prototype.setValue = function(_text){
  this.editor.getDoc().setValue(_text);
}


TextEditor.prototype.on = function(_type,_handler,_templateId,_userId){
  if(_type!=="change"){
    error("error unsupported event : " + _type);
  }
  this.editor.getDoc().on(_type,function(e){
    _handler(e.getValue(),_templateId,_userId);
  });
}


var error = function(msg){
  console.warn(msg);
  throw new Error(msg);
}