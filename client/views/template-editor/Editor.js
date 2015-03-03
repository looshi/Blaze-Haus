/*
Editor
Eitable source code for a given template.
Updates the DOM as the user makes edits.

The editable CSS, Template HTML, and other code blocks are stored in 
the database as simple string fields on a TemplateCollection document.
The code is then 'rendered' into an output div.

The text editors are CodeMirror instances : http://codemirror.net/

*/

Template.Editor.created = function(){

  this.htmlError = new ReactiveVar;
  this.htmlError.set("ok");

  this.cssError = new ReactiveVar;
  this.cssError.set("ok");
  
  this.jsError = new ReactiveVar;
  this.jsError.set("ok");
}


Template.Editor.rendered = function(){

  this['cssEditor'] = 'not set';
  this['htmlEditor'] = 'not set';
  this['jsEditor'] = 'not set';
  this['lastHtmlEditorId'] = 'not set';
  this['lastCssEditorId'] = 'not set';
  this['renderedView'] = null; // Blaze View object we are rendering dynamically
  this['LAST_EDITOR'] = '';  // last user who made an edit

  startObservers(this);
 
}

Template.Editor.helpers({

  htmlError : function(){
    return Template.instance().htmlError.get();
  },
  cssError : function(){
    return Template.instance().cssError.get();
  },
  htmlErrorClass : function(){
    return Template.instance().htmlError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  },
  cssErrorClass : function(){
    return Template.instance().cssError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  },
  jsErrorClass : function(){
    return Template.instance().jsError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  }
});

Template.Editor.events({

  'click .restoreDefaults' : function(e,self){
    

    if(this.lastHtmlEditorId!=="System" && this.lastCssEditorId!=="System"){

      this.lastHtmlEditorId = "System";
      this.lastCssEditorId = "System";

      var parent = document.getElementById('htmlOutput');
      parent.innerHTML = "";
      
      Meteor.call('RestoreDefaultTemplate',function(err,res){
        if(!err){
          setTimeout(function(){
            renderHTML(self.data.html,null,self); // remove this settimeout
          },300); 
        }
      });
    }
  }
});

Template.Editor.destroyed = function(){
  if(!!this.renderedView){
    // this.renderedView._domrange.destroyMembers();
    // this.renderedView._domrange.detach();
    // this.renderedView._domrange.destroy();
    Blaze._destroyView(this.renderedView);
    this.renderedView._domrange = null;
    this.renderedView = null;
  }
};


var startObservers = function(self){

  var templateId  = self.data._id; 

  TemplateCollection.find({_id:templateId}).observeChanges({

    added : function(id,doc){

      self.htmlEditor = new TextEditor('html-editor','text/html','html'+templateId); 
      self.htmlEditor.setValue(doc.html);
      self.htmlEditor.debounce("change",saveHTML,templateId);
      self.htmlEditor.on("change",renderHTML,"html",self);  
      renderHTML(doc.html,"html",self);

      self.jsEditor = new TextEditor('js-editor','text/javascript','js'+templateId);
      self.jsEditor.setValue(doc.js);
      self.jsEditor.debounce("change",saveJS,templateId);
      self.jsEditor.on("change",renderHTML,"js",self);  
      renderHTML(doc.js,"js",self);  

      self.cssEditor = new TextEditor('css-editor','text/css','css'+templateId);
      self.cssEditor.setValue(doc.css);
      self.cssEditor.debounce("change",saveCSS,templateId);
      self.cssEditor.on("change",renderCSS,"css",self);  
      renderCSS(doc.css,"css",self);
    },

    changed: function(id,doc){

      var userId = Session.get('userId'); 


      if(doc.lastModifiedBy){
        self.LAST_EDITOR = doc.lastModifiedBy; 
      }
     
      // we don't handle a case where someone else empties the file, like Ctrl A, Ctrl X
      // when that happens no changed fires

      if( self.LAST_EDITOR!==userId && (!!doc.html||!!doc.js)){
        
        //Someone else made this change, render it and update my editor
        self.cssEditor.stopDebounce = true;
        self.htmlEditor.stopDebounce = true;
        self.jsEditor.stopDebounce = true;

        console.log("Someone else made the change.");
        if(doc.css){
          renderCSS(doc.css,"css",self);
          self.cssEditor.setValue(doc.css);
        }
        if(doc.html){
          renderHTML(doc.html,"html",self);
          self.htmlEditor.setValue(doc.html);
        }
        if(doc.js){
          renderHTML(doc.js,"js",self);
          self.jsEditor.setValue(doc.js);
        }
        
        self.cssEditor.stopDebounce = false;
        self.htmlEditor.stopDebounce = false;
        self.jsEditor.stopDebounce = false;

      }

    }
  });
}



var saveHTML = function(text,templateId){
  var userId = Session.get('userId');
  Meteor.call('saveHTML',text,templateId,userId);
}

var saveJS = function(text,templateId){
  var userId = Session.get('userId');
  Meteor.call('saveJS',text,templateId,userId);
}

var saveCSS = function(text,templateId){
  var userId = Session.get('userId');
  Meteor.call('saveCSS',text,templateId,userId);
}



/**
* applies CSS to the CSSOM, right now it will just continually append 
* and override everything on the page, TODO, scope CSS to a given container
* @param {String} newCSS,  css string
* @param {String} codeType , redundant, but consistent with the other render functions
* @param {Object} self , this Editor's Template instance
*/
var renderCSS = function(newCSS,codeType,self){


  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  self.cssError.set("ok");
  // TODO - validate CSS before applying it

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = _newCSS;
  } else {
    style.appendChild(document.createTextNode(newCSS));
  }
  head.appendChild(style);
}


var latestHTML = "";
var latestJS = "";
/**
* renders html with a data context into the parent Dom object
* @param {String} codeType, either js or html
* @param {Object} self , this Editor's Template instance
*/
var renderHTML = function(text,codeType,self){


  self.htmlError.set("ok");
  self.jsError.set("ok");

  if(codeType==="html"){
    latestHTML = text;
  }
  if(codeType==="js"){
    latestJS = text;
  }

  var parent = document.getElementById('htmlOutput');

  // going to 'try' it all, because we're auto-saving on each edit so
  // the malformed Blaze Template syntax will throw a lot of errors
  // which is good actually , we can output these errors to the user 
  try{
    
    var htmlJS = SpacebarsCompiler.compile(latestHTML);
    var evaled = eval(htmlJS);
    var view = Blaze.View(evaled);  // DL 3/2 removed Blaze.With(dataContext,evaled) template must fetch using helpers now

    parent.innerHTML = "";      // clear the output and re-render it
    
    Blaze._globalHelpers = {};  // removes all global helpers, TODO : scope it to this instance

    var helpers = eval(latestJS);
    
    for(var key in helpers){
      Blaze.registerHelper(key, createHelper(helpers,key));
    }

    self.renderedView =  Blaze.render(view,parent);

    self.renderedView._domrange.destroy();   // renders a view then destroys it every single time
                                             // possible to re-render only the parts that changed ?
                                             // what's best destroy method(s) to call here ? 
  }catch(e){ 
    self.htmlError.set(e);
  }
}

// wraps each helper in a try / catch 
function createHelper(helpers,key){
  return function(args){ 
    try{
      return helpers[key](args);
    }catch(e){return e;} 
  }
}

/**
* displays a message if another user besides currentuser is editing this Template
* @param {String} file,  either css , html , js ( js coming soon )
* @param {String} user, userId who is editing
*/
var showAlert = function(file,user){
  var alert = document.getElementById('alertPanel');
  alert.style.display = "block";
  alert.innerHTML = "User " + user +" is editing the " + file + " now!"
  hideAlert();
}
var hideAlert = _.debounce(function(){
  document.getElementById('alertPanel').style.display = 'none';
},3000);



