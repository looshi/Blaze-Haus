/*
TemplateInspector

wraps an instance of CodeMirror
saves and retrieves Template code and CSS
renders a dynamic template
*/


/**
* constructor
* @param {Object} _dataContext, can be a Mongo Collection Cursor, or a regular object
* @param {Object} _parentElement , Dom object where the Template should be rendered
* @param {String} _userId , user is who is editing this template
*/
TemplateInspector = function(_dataContext,_parentElement,_userId) {

  this.dataContext = _dataContext;
  this.parentElement = _parentElement;
  this.userId = _userId;
  this.lastHtmlEditorId = "notset";  // Last user that edited HTML 
  this.lastCssEditorId  = "notset"   // Last user that edited CSS

  setupObservers(this.dataContext,this);
}



TemplateInspector.prototype.render = function (){

}

TemplateInspector.prototype.restoreDefaults = function (){
  Meteor.call('restoreDefaults');
}


// this will be scoped to the Id of the Template
var setupObservers = function(_templateId,_self){

  var self = _self;


  StylesCollection.find().observeChanges({
    added: function(id, doc) {
      var textArea = document.getElementById('cmCss');
      cssEditor = CodeMirror.fromTextArea(textArea);
      cssEditor.getDoc().setValue(doc.css);
      cssEditor.getDoc().on("change",saveCSS);
      renderCSS(doc.css);
    },
    changed: function(id,doc){

      console.log("changed " , id , doc );

      if(doc.css){
        renderCSS(doc.css);
      }
      
      if(doc.lastModifiedBy){
        self.lastCssEditorId = doc.lastModifiedBy;
      }

      if(self.lastCssEditorId!==self.userId && doc.css){
        showAlert("css",self.lastCssEditorId);
        cssEditor.getDoc().off("change",saveCSS);  // turn off auto save temporarily
        cssEditor.getDoc().setValue(doc.css);
        cssEditor.getDoc().on("change",saveCSS);
      }
    }
  });

  HTMLCollection.find().observeChanges({
    added: function(id, doc) {
      
      var textArea = document.getElementById('cmHtml');
      htmlEditor = CodeMirror.fromTextArea(textArea);
      htmlEditor.getDoc().setValue(doc.html);
      htmlEditor.getDoc().on("change",saveHTML);
      console.log("stuff ",doc.html,self.dataContext,self.parentElement );
      renderHTML(doc.html,self.dataContext,self.parentElement);
    },
    changed: function(id,doc){

      if(doc.html){
        renderHTML(doc.html,self.dataContext,self.parentElement); 
      }

      if(doc.lastModifiedBy){
        self.lastHtmlEditorId = doc.lastModifiedBy;  // only update my editor if someone else made the change
      }

      if(self.lastHtmlEditorId!==self.userId && doc.html){
        showAlert("html",self.lastHtmlEditorId);
        htmlEditor.getDoc().off("change",saveHTML);  // turn off auto save temporarily
        htmlEditor.getDoc().setValue(doc.html);
        htmlEditor.getDoc().on("change",saveHTML);
      }
    }
  });
}

function saveCSS(_codeMirror){
  clearCssError();
  var newCSS = _codeMirror.getValue();
  if(newCSS && newCSS.length>800){
    displayCssError('Too long, must be less than 800 chars.','css'); 
    return;
  }
  if(newCSS){
    Meteor.call('saveCSS',newCSS,'NEED_TO_SCOPE_THIS');
  }
}


var renderCSS = function(_newCSS){

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = _newCSS;
  } else {
    style.appendChild(document.createTextNode(_newCSS));
  }
  head.appendChild(style);
}

var saveHTML = function(_codeMirror){
  var newHTML = _codeMirror.getValue();
  Meteor.call('saveHTML',newHTML,'NEED_TO_SCOPE_THIS');
}

// renders html with a data context into the parent Dom object
// you can use spacebars {{ }} template tags in newHTML
var renderHTML = function(_newHTML,_dataContext,_parent){

  clearHtmlError();
  // going to 'try' it all, because we're auto-saving on each edit so
  // the malformed Blaze Template syntax will throw a lot of errors
  try{
    // create the 'HTMLjs' which is used internally by the template
    // https://meteorhacks.com/how-blaze-works.html
    var htmlJS = SpacebarsCompiler.compile(_newHTML);
    var evaled = eval(htmlJS);
    var view = Blaze.With(_dataContext,evaled);

    // clear the output and re-render it
    _parent.innerHTML = "";
    Blaze.render(view,_parent);
    
  }catch(e){ 
    displayHtmlError(e);
  }
}



// status messages 
var displayHtmlError = function(error,type){
  var el = document.getElementById('htmlError');
  el.className = "";
  el.innerHTML = ''+error;
}
var clearHtmlError = function(e){
  var el = document.getElementById('htmlError');
  el.className = 'ok';
  el.innerHTML = 'ok';
}
var displayCssError = function(error,type){
  var el = document.getElementById('cssError');
  el.className = "";
  el.innerHTML = ''+error;
}
var clearCssError = function(e){
  var el = document.getElementById('cssError');
  el.className = 'ok';
  el.innerHTML = 'ok';
}

// displays a message if another user besides currentuser is editing this Template
var showAlert = function(file,user){
  var alert = document.getElementById('alertPanel');
  alert.style.display = "block";
  alert.innerHTML = "User " + user +" is editing the " + file + " now!"
  hideAlert();
}
var hideAlert = _.debounce(function(){
  document.getElementById('alertPanel').style.display = 'none';
},3000);



