/*
TextEditor
Wraps an instance of CodeMirror.
*/


/**
* constructor
* @param {Object} _textArea, DOM id for the TextArea to apply this editor, e.g. "myTextArea"
* @param {String} _type , only "css" , "html" are supported now
*/
TextEditor = function(_textArea,_type,_id) {


  if(!Utils.isPosString(_textArea)){
    error("selector required : "+_textArea);
  }

  var textArea = document.getElementsByClassName(_textArea)[0];
  if(!textArea){
    error('element '+_textArea+' not found');
  }

  var options = {
    mode : _type,
    theme : 'monokai',
    lineNumbers : true,
  }
  this.editor = CodeMirror.fromTextArea(textArea,options);
  this.editor.display.wrapper.id = _id;

  this.AUTO_SAVE = true;  // allows us to do something like Event.off() for text change

}

TextEditor.prototype.setValue = function(_text){
  this.editor.getDoc().setValue(_text);
}

 
/**
* debounce
* wraps event handler in a debounce, calls callback with params
* @param {String} _eventName, "change" is the only one we use right now, but there are many available
* @param {Function} _handler , callback
* @param {String} _templateId , _id of document from TemplateCollection
* @param {String} _userId, which user made the change
*/
TextEditor.prototype.debounce = function(_eventName,_handler,_templateId,_userId){
  
  var self = this;

  this.editor.getDoc().on(_eventName, 

    _.debounce(  
      function(e){

        _handler(e.getValue(),_templateId,_userId,self);
         
      }, 300 )  // no semicolon
    
  );
}

/**
* on
* wraps event handler, calls callback with params
* @param {String} _eventName, "change" is the only one we use right now, but there are many available
* @param {Function} _handler , callback
* @param {String} _codeType , _id of document from TemplateCollection
* @param {String} _self, Template instance
*/
TextEditor.prototype.on = function(_eventName,_handler,_codeType,_self){
  this.editor.getDoc().on(_eventName,function(e){
    _handler(e.getValue(),_codeType,_self);
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