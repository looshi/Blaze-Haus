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

  this.jsonError = new ReactiveVar;
  this.jsonError.set("ok");

  this.canClearIntervals = false;
}


Template.Editor.rendered = function(){

  this.cssEditor = 'not set';
  this.htmlEditor = 'not set';
  this.jsEditor = 'not set';
  this.jsonEditor = 'not set';
  this.renderedView = null; // Blaze View object we are rendering dynamically
  this.style = "not set"  // StyleSheet appended to the <head>
  this.observer = "not set";
  startObservers(this);

}

Template.Editor.helpers({
  currentTemplate : function(){
    if(this){
      var id = this.toString();
      var current = CurrentTemplate.findOne({_id:id});
      if(current){
        return current;
      }
    }
  },
  htmlError : function(){
    return Template.instance().htmlError.get();
  },
  htmlErrorClass : function(){
    return Template.instance().htmlError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  },
  cssError : function(){
    return Template.instance().cssError.get();
  },
  cssErrorClass : function(){
    return Template.instance().cssError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  },
  jsonError : function(){
    return Template.instance().jsonError.get();
  },
  jsonErrorClass : function(){
    return Template.instance().jsonError.get()==="ok" ? "errorPanel ok" : "errorPanel";
  },
  getSourceCodeVisible : function(){
    return Session.get('ViewSource');
  },
  getTemplateFullscreen : function(){
    return Session.get('Fullscreen');
  },
  isOwner : function(){
    if(this){
      return iCanSave(this._id);
    }
  },
  isAnonymous : function(){
    if(this){
     return this.owner==='anonymous';
   }
  },
  screenshot : function(){
    if(this && this.screenshot){
      var screenshot = inflate(this.screenshot);
      return screenshot;
    }
  }
});

var iCanSave = function(templateId){
  var template = CurrentTemplate.findOne({_id:templateId});
  
  if(template  && template.owner){
    if(template.owner==='anonymous'){
      return true;
    }else{
      return Meteor.userId() === template.owner;
    }
  
  }
}


Template.Editor.destroyed = function(){

  clearAllIntervals();

  this.observer.stop();

  if(!!this.renderedView){

    destroyCSS();
    Blaze._destroyView(this.renderedView);
    this.renderedView._domrange = null;
    this.renderedView = null;
  }
};


var clearAllIntervals = function(){
  // clear any intervals the template may have running
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i); 
  }
}

var deflate = function(string){
  return pako.deflate(string);
}
var inflate = function(uint8Array){
  uint8Array = pako.inflate(uint8Array);
  return String.fromCharCode.apply(null, new Uint16Array(uint8Array));
}

var startObservers = function(self){

  var templateId  = self.data._id; 
  var userId;
  if( Meteor.userId() ){
    // random digit will be appended so that the 'lastModifiedBy' field is always unique for a single browser window
    userId = Meteor.userId() + "" + Session.get('AnonymousUserId');
  }else{
    userId = Session.get('AnonymousUserId'); 
  }
  
  self.observer = CurrentTemplate.find({_id:templateId}).observeChanges({

    added : function(id,doc){

      self.htmlEditor = new TextEditor('html-editor','text/html','html'+templateId); 
      doc.html = inflate(doc.html);
      self.htmlEditor.setValueNative(doc.html);
      self.htmlEditor.on("change",renderHTML,"html",self);  
      renderHTML(doc.html,"html",self);

      self.jsEditor = new TextEditor('js-editor','text/javascript','js'+templateId);
      doc.js = inflate(doc.js);
      self.jsEditor.setValueNative(doc.js);
      self.jsEditor.on("change",renderHTML,"js",self);  
      renderHTML(doc.js,"js",self);  

      self.cssEditor = new TextEditor('css-editor','text/css','css'+templateId);
      doc.css = inflate(doc.css);
      self.cssEditor.setValueNative(doc.css);
      self.cssEditor.on("change",renderCSS,"css",self);  
      renderCSS(doc.css,"css",self);

      self.jsonEditor = new TextEditor('json-editor','text/javascript','json'+templateId);
      doc.json = inflate(doc.json);
      createCollection(doc.json,self);
      self.jsonEditor.setValueNative(doc.json);
      self.jsonEditor.on("change",renderJSON,"json",self); 

      renderHTML('',null,self);
      self.canClearIntervals = true;

      if(iCanSave(templateId)){
        self.htmlEditor.debounce("change",saveHTML,templateId,userId);
        self.jsEditor.debounce("change",saveJS,templateId,userId);
        self.jsonEditor.debounce("change",saveJSON,templateId,userId);
        self.cssEditor.debounce("change",saveCSS,templateId,userId);
        Session.set('UserEditMessage','All changes saved.');
      }else{
        Session.set('UserEditMessage',"Template is read-only.");
      }

    },

    changed : function(id,doc){

      // The Publication will only send change events where (this.userId!=doc.lastModifiedBy)
      // If someone else made this change, render the template, and update my editor.
      // If I made the last change, I won't recieve this change event.

      if(doc.html){
        renderHTML(doc.html,"html",self);
        doc.html = inflate(doc.html);
        self.htmlEditor.setValue(doc.html);
        Session.set('UserEditMessage','html edited by another user just now.');
      }
      if(doc.js){
        renderHTML(doc.js,"js",self);
        doc.js = inflate(doc.js);
        self.jsEditor.setValue(doc.js);
        Session.set('UserEditMessage','js edited by another user just now.');
      }

      if(doc.css){
        renderCSS(doc.css,"css",self);
        doc.css = inflate(doc.css);
        self.cssEditor.setValue(doc.css);
        Session.set('UserEditMessage','css edited by another user just now.');
      }

      if(doc.json){
        renderHTML("",null,self); 
        doc.json = inflate(doc.json); 
        self.jsonEditor.setValue(doc.json);
        Session.set('UserEditMessage','json edited by another user just now.');
      }
    }
  });
}

// if someone tries to save an empty file = issue #20

var saveHTML = function(text,templateId,userId){
  text = deflate(text);
  Meteor.call('SaveHTML',text,templateId,userId,handleResponse);
}

var saveJS = function(text,templateId,userId){
  text = deflate(text);
  Meteor.call('SaveJS',text,templateId,userId,handleResponse);
}

var saveCSS = function(text,templateId,userId){
  text = deflate(text);
  Meteor.call('SaveCSS',text,templateId,userId,handleResponse);
}

var saveJSON = function(text,templateId,userId){
  text = deflate(text);
  Meteor.call('SaveJSON',text,templateId,userId,handleResponse);
}

var handleResponse = function(err,res){
  if(err){
    Session.set('UserEditMessage','Error, could not save.');
  }else{
    Session.set('UserEditMessage','All changes saved.');
  }
}

var createCollection = function(json,self){
  self.jsonError.set("ok");
  try{
    var items = JSON.parse(json);
    Data.remove({});
    if(items instanceof Array){
      _.each(items,function(item){
        Data.insert(item);
      });
    }else{
      throw new Error("JSON items must be in array.")
    }

  }catch(e){self.jsonError.set(e);}
  
}

/**
* renderJSON
* re-creates the local 'Data' Collection 
* calls render on the template
* @param {String} newJSON,  the json data to be inserted into the Data Collection
* @param {String} codeType , redundant, but consistent with the other render functions
* @param {Object} self , this Template.Editor instance
*/
var renderJSON = function(newJSON,codeType,self){
  createCollection(newJSON,self);
  renderHTML("",null,self); 
}


/**
* renderCSS
* applies CSS to the CSSOM, right now it will just continually append 
* and override everything on the page, TODO, scope CSS to a given container, or leave it?
* @param {String} newCSS,  css string
* @param {String} codeType , redundant, but consistent with the other render functions
* @param {Object} self , this Template.Editor instance
*/
var renderCSS = function(newCSS,codeType,self){

  if(iCanSave(self.data._id)){
    Session.set('UserEditMessage','saving...');
  }

  destroyCSS();

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  self.cssError.set("ok");

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = newCSS;
  } else {
    style.appendChild(document.createTextNode(newCSS));
  }

  head.appendChild(style);

}

var destroyCSS = function(){
  var head = document.head || document.getElementsByTagName('head')[0];
  var node = head.children[head.children.length-1];
  if(node.type==='text/css'){
    head.removeChild( node );  // assumes nothing else is appended to <head> between renders
                               // TODO : remove css by correct index or name, this has bad side effects
  }
}

var latestHTML = "";
var latestJS = "";
/**
* renderHTML
* renders html with a data context into the parent Dom object
* @param {String} codeType, either js or html
* @param {Object} self , this Template.Editor instance
*/
var renderHTML = function(text,codeType,self){

  if(iCanSave(self.data._id)){
    Session.set('UserEditMessage','saving...');
  }

  if(self.htmlError){
    self.htmlError.set("ok");
  }

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

    if(self.canClearIntervals){
      //clearAllIntervals(); // this wipes out autosave debounce TODO fix
    }

    var helpers = eval(latestJS);
    
    for(var key in helpers){
      Blaze.registerHelper(key, createHelper(helpers,key)); // uses Global helpers, 
                                                            // is it possible to apply helpers to the View instance?
    }

    self.renderedView =  Blaze.render(view,parent);

    self.renderedView._domrange.destroy();   // renders a view then destroys it every single time

    for(var key in helpers){
      delete Blaze._globalHelpers[key];  // clean up Global helpers after they're done
    }

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

