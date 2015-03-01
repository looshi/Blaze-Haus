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

/*
These flags are used so that changes to the HTML or CSS 
by a different user won't redundantly be autosaved by "this" user.
*/
var CAN_SAVE_HTML = true; 
var CAN_SAVE_CSS = true; 

Template.Inspector.rendered = function(){

  this['userId'] = Random.id(); 
  this['cssEditor'] = 'not set';
  this['htmlEditor'] = 'not set';
  this['lastHtmlEditorId'] = 'not set';
  this['lastCssEditorId'] = 'not set';
  this['subscription'] = Meteor.subscribe("peopleData");  // this is the default sample data set
  this['renderedView'] = null; // Blaze View object we are rendering dynamically

  startObservers(this);
 
}

Template.Inspector.helpers({

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
  }
});

Template.Inspector.events({

  'click .restoreDefaults' : function(e,self){
    
    self.subscription.stop();  // pause the subscription

    if(this.lastHtmlEditorId!=="System" && this.lastCssEditorId!=="System"){

      this.lastHtmlEditorId = "System";
      this.lastCssEditorId = "System";

      var parent = document.getElementById('htmlOutput');
      parent.innerHTML = "";
      
      Meteor.call('restoreDefaults',function(err,res){
        if(!err){
          self.subscription = Meteor.subscribe("peopleData");   // restart the subscription
          setTimeout(function(){
            var dataContext = PeopleCollection.find();  // TODO put this server method into Fiber
            renderHTML(self.data.html,self,dataContext); // remove this settimeout
          },300); 
        }
      });
    }
  }
});

Template.Inspector.destroyed = function(){
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

  var dataContext = PeopleCollection.find(); // Router waits for this as well

  TemplateCollection.find({_id:templateId}).observeChanges({

    added : function(id,doc){

      self.htmlEditor = new TextEditor('html-editor','text/html'); 
      self.htmlEditor.setValue(doc.html);
      self.htmlEditor.on("change",handleHtmlEdit,templateId,self.userId);
      renderHTML(doc.html,self,dataContext);

      self.cssEditor = new TextEditor('css-editor','css');
      self.cssEditor.setValue(doc.css);
      self.cssEditor.on("change",handleCssEdit,templateId,self.userId);
      renderCSS(doc.css,self);

    },
    changed: function(id,doc){
      onCssDataChanged(id,doc,self);
      onHtmlDataChanged(id,doc,self,dataContext);
    }
  });
}


var onHtmlDataChanged = function(id,doc,self,dataContext){

  if(doc.html){
    console.log("html changed ");
    renderHTML(doc.html,self,dataContext); 
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

// TODO debounce
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

// TODO debounce
var handleCssEdit = function(text,templateId,userId){

  if(!CAN_SAVE_CSS){return;}

  Meteor.call('saveCSS',text,templateId,userId);

}

/**
* applies CSS to the CSSOM, right now it will just continually append 
* and override everything on the page, TODO, scope CSS to a given container
* @param {String} newCSS,  css string
* @param {Object} self , this Inspector Template instance
*/
var renderCSS = function(newCSS,self){

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

/**
* renders html with a data context into the parent Dom object
* @param {String} newHTML, html string to render
* @param {Object} self , this Inspector Template instance
*/
var renderHTML = function(newHTML,self,dataContext){

  self.htmlError.set("ok");

  console.log("rendering HTML :: " , dataContext.count() );
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
    
    self.renderedView =  Blaze.render(view,parent);

    self.renderedView._domrange.destroy();   // <-- renders a view then destroys it every single time
                                             // possible to re-render only the parts that changed ?
                                             // what's best destroy method(s) to call here ? there are many destroy,detach methods
  }catch(e){ 
    self.htmlError.set(e);
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



