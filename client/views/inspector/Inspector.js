/*
Inspector
Eitable source code for a given template.
Updates the DOM as the user makes edits.

The editable CSS, Template HTML, and other code blocks are stored in 
the database as simple string fields on a TemplateCollection document.
The code is then 'rendered' into an output div.

The text editors are CodeMirror instances : http://codemirror.net/

*/


Template.Inspector.created = function(){

  this.htmlError = new ReactiveVar;
  this.htmlError.set("ok");

  this.cssError = new ReactiveVar;
  this.cssError.set("ok");


}

// using this flag instead of CodeMirrorInstance.off("event") -- which won't work for some reason
var CAN_SAVE_HTML = true; 
var CAN_SAVE_CSS = true; 

Template.Inspector.rendered = function(){

  var templateId = Router.current().params._id;

  console.log("my data!!! " , this.data );

  this['userId'] = Random.id(); 
  this['cssEditor'] = 'not set';
  this['htmlEditor'] = 'not set';
  this['lastHtmlEditorId'] = 'not set';
  this['lastCssEditorId'] = 'not set';
  this['templateId'] = templateId;

  startObservers(templateId,this);
 
}

Template.Inspector.helpers({

  htmlError : function(){
    return Template.instance().htmlError.get();
  },
  cssError : function(){
    return Template.instance().cssError.get();
  },
  htmlErrorClass : function(){
    return Template.instance().htmlError.get()=="ok" ? "errorPanel ok" : "errorPanel";
  },
  cssErrorClass : function(){
    return Template.instance().cssError.get()=="ok" ? "errorPanel ok" : "errorPanel";
  }

});


Template.Inspector.events({
  'click .restoreDefaults' : function(e){
    Meteor.call('restoreDefaults');
  }
});


var startObservers = function(_templateId,self){

  TemplateCollection.find({_id:_templateId}).observeChanges({

    added : function(id,doc){

      self.htmlEditor = new TextEditor('html-editor','html'); 
      self.htmlEditor.setValue(doc.html);
      self.htmlEditor.on("change",handleHtmlEdit,self.templateId,self.userId);
      renderHTML(doc.html,self);

      self.cssEditor = new TextEditor('css-editor','css');
      self.cssEditor.setValue(doc.css);
      self.cssEditor.on("change",handleCssEdit,self.templateId,self.userId);
      renderCSS(doc.css,self);

    },
    changed: function(id,doc){
      console.log("item changed " , id , doc );
      onCssDataChanged(id,doc,self);
      onHtmlDataChanged(id,doc,self);
    }
  });
}


var onHtmlDataChanged = function(id,doc,self){

  if(doc.html){
    renderHTML(doc.html,self); 
  }

  if(doc.lastModifiedBy){
    self.lastHtmlEditorId = doc.lastModifiedBy;  // only update my editor if someone else made the change
  }
 
  if(self.lastHtmlEditorId!==self.userId && doc.html){
    showAlert("html",self.lastHtmlEditorId);
    CAN_SAVE_HTML = false;
    self.htmlEditor.setValue(doc.html);
    CAN_SAVE_HTML = true;
  }
}

var handleHtmlEdit = function(text,templateId,userId){

  if(!CAN_SAVE_HTML){return;}

  Meteor.call('saveHTML',text,templateId,userId);
}


var onCssDataChanged = function(id,doc,self){

  if(doc.css){
    renderCSS(doc.css,self);
  }
  
  if(doc.lastModifiedBy){
    self.lastCssEditorId = doc.lastModifiedBy;
  }

  if(self.lastCssEditorId!==self.userId && doc.css){
    showAlert("css",self.lastCssEditorId);
    CAN_SAVE_CSS = false;
    self.cssEditor.setValue(doc.css);
    CAN_SAVE_CSS = true;
  }
}

var handleCssEdit = function(text,templateId,userId){

  if(!CAN_SAVE_CSS){return;}

  Meteor.call('saveCSS',text,templateId,userId);

}


var renderCSS = function(newCSS,self){

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  self.cssError.set("ok");

  // TODO : validate CSS here 

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = _newCSS;
  } else {
    style.appendChild(document.createTextNode(newCSS));
  }
  head.appendChild(style);
}



// renders html with a data context into the parent Dom object
// you can use spacebars {{ }} template tags in newHTML
var renderHTML = function(newHTML,self){

  self.htmlError.set("ok");

  var dataContext = PeopleCollection.find();    //  TODO get passed in collection vs. default only
  var parent = document.getElementById('htmlOutput');

  // going to 'try' it all, because we're auto-saving on each edit so
  // the malformed Blaze Template syntax will throw a lot of errors
  try{
    // create the 'HTMLjs' which is used internally by the template
    // https://meteorhacks.com/how-blaze-works.html
    var htmlJS = SpacebarsCompiler.compile(newHTML);
    var evaled = eval(htmlJS);
    var view = Blaze.With(dataContext,evaled);

    // clear the output and re-render it
    parent.innerHTML = "";
    Blaze.render(view,parent);
    
  }catch(e){ 
    self.htmlError.set(e);
  }
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



