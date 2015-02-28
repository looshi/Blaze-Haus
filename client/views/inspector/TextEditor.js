/*
TextEditor
Wraps an instance of CodeMirror.
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

/**
* adds event handlers to the Codemirror instance
* can't seem to append parameters onto a Codemirror event
* so, this wraps an internal event handler, then calls the callback with results + extra params
* @param {String} _type, "change" is the only one we use right now, but there are many available
* @param {Function} _handler , callback
* @param {String} _templateId , _id of document from TemplateCollection
* @param {String} _userId, which user made the change
*/
TextEditor.prototype.on = function(_type,_handler,_templateId,_userId){
  if(_type!=="change"){
    error("error unsupported event : " + _type);
  }
  this.editor.getDoc().on(_type,function(e){
    _handler(e.getValue(),_templateId,_userId);
  });
}

/**
* logs an error to the console
* @param {String} _msg, the error message
*/
var error = function(_msg){
  console.warn(msg);
  //throw new Error(_msg);
}