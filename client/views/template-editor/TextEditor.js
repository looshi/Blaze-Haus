/**
* TextEditor 
* wraps an instance of Code Mirror
* @param {Object} _textArea, DOM id for the TextArea to apply this editor, e.g. "myTextArea"
* @param {String} _type , only "css" , "html" are supported now
*/
TextEditor = function(_textArea,_type,_id) {

  var textArea = document.getElementsByClassName(_textArea)[0];
  if(!textArea){
    console.warn('element '+_textArea+' not found');
    return;
  }

  var options = {
    mode : _type,
    theme : 'monokai',
    lineNumbers : true,
  }
  this.editor = CodeMirror.fromTextArea(textArea,options);
  this.editor.display.wrapper.id = _id;

  this.autoSave = true;

}


/**
* setValue
* will set the value, but won't cause a "change" in the debounce handler
* this is done so that changes coming from a different user can be set without calling Save functions
* @param {String} _text

*/
TextEditor.prototype.setValue = function(_text){
  this.autoSave = false;
  try{
    this.editor.getDoc().setValue(_text);
  }catch(e){console.warn(e);}
  
}

TextEditor.prototype.setValueNative = function(_text){
  this.editor.getDoc().setValue(_text);
}


/**
* debounce
* wraps event handler in a debounce, calls callback with params, used for Auto Save behavior of the editor
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
console.log("SELF",self.autoSave);
        if(self.autoSave){
          _handler(e.getValue(),_templateId,_userId);
        }else{
          self.autoSave = true;
        }
       
         
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
  
TextEditor.prototype.off = function(_eventName,_handler){
  this.editor.getDoc().off(_eventName,_handler);
}
  
